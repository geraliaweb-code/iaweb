import { getConstructionProject, getConstructionSupabaseClient } from "../db"
import { listConstructionDetectedDocuments } from "../document-intelligence"
import { getConstructionBillingUsage } from "../billing/usage"
import { generateCostBreakdownV2 } from "../cost-engine-v2"
import { normalizeCostDatabaseCountry, roundCurrency } from "../cost-database-v2"
import { buildUnlockedConstructionAnalysis } from "../unlock-engine"
import type { ConstructionProject } from "../types"
import { applyBenchmarkV2Access } from "./benchmark-access"
import { buildComparedCountriesV2, getMarketCostPerM2RangeV2 } from "./country-benchmark"
import { buildLaborComparisonsV2, buildProductivityComparisonsV2, buildScheduleComparisonV2 } from "./productivity-benchmark"
import { buildSpecialtyComparisonsV2, differencePercentV2, resolveCostPositionV2 } from "./specialty-benchmark"
import type { BenchmarkV2EngineInput, BenchmarkV2Result } from "./types"

function scorePosition(projectValue: number, marketValue: number, lowerIsBetter: boolean) {
  const delta = projectValue - marketValue
  if (Math.abs(delta) <= 6) return "dentro_da_media" as const
  if (lowerIsBetter) return delta > 0 ? "acima_da_media" as const : "abaixo_da_media" as const
  return delta < 0 ? "abaixo_da_media" as const : "acima_da_media" as const
}

function buildRiskComparison(project: ConstructionProject, locked: boolean) {
  if (locked) return null
  const projectRiskScore = project.risk_score ?? 58
  const marketRiskScore = 52

  return {
    projectRiskScore,
    marketRiskScore,
    differencePoints: projectRiskScore - marketRiskScore,
    position: scorePosition(projectRiskScore, marketRiskScore, true),
  }
}

function buildMaturityComparison(project: ConstructionProject, locked: boolean) {
  if (locked) return null
  const projectMaturityScore = project.maturity_score ?? 62
  const marketMaturityScore = 68

  return {
    projectMaturityScore,
    marketMaturityScore,
    differencePoints: projectMaturityScore - marketMaturityScore,
    position: scorePosition(projectMaturityScore, marketMaturityScore, false),
  }
}

function buildExecutiveInsights(input: {
  projectCostPerM2: number
  marketCostPerM2: number
  costPosition: BenchmarkV2Result["costPosition"]
  productivityComparisons: BenchmarkV2Result["productivityComparisons"]
  riskComparison: BenchmarkV2Result["riskComparison"]
}) {
  const costDifference = Math.abs(differencePercentV2(input.projectCostPerM2, input.marketCostPerM2))
  const costDirection = input.costPosition === "acima_da_media" ? "acima" : input.costPosition === "abaixo_da_media" ? "abaixo" : "dentro"
  const productivityBelow = input.productivityComparisons.find((item) => item.position === "abaixo_do_benchmark")
  const insights = [
    costDirection === "dentro"
      ? "A sua obra esta dentro da media de custo para projetos semelhantes."
      : `A sua obra esta ${costDifference}% ${costDirection} da media de custo para projetos semelhantes.`,
  ]

  if (productivityBelow) {
    insights.push("A produtividade estimada esta abaixo do benchmark europeu para esta especialidade.")
  } else {
    insights.push("A produtividade estimada esta alinhada com o benchmark europeu para as especialidades analisadas.")
  }

  if (input.riskComparison?.position === "acima_da_media") {
    insights.push("A documentacao apresenta risco superior a media, o que pode aumentar custo e prazo.")
  } else {
    insights.push("A maturidade documental reduz incerteza comercial face a projetos com documentacao incompleta.")
  }

  return insights
}

async function tryPersistBenchmarkV2(input: {
  projectId: string
  projectCostPerM2: number
  marketCostPerM2: number
  differencePercent: number
}) {
  const client = getConstructionSupabaseClient()

  if (!client.ok) return client.error.message

  const { error } = await client.supabase.from("construction_benchmarks").insert({
    project_id: input.projectId,
    benchmark_type: "benchmark_v2_cost_per_m2",
    benchmark_value: input.marketCostPerM2,
    project_value: input.projectCostPerM2,
    difference_percent: input.differencePercent,
    notes: "Benchmark Europeu Real V2 gerado como camada isolada.",
  })

  return error?.message ?? null
}

export async function generateBenchmarkV2(input: BenchmarkV2EngineInput): Promise<
  | { data: BenchmarkV2Result; warnings: string[]; error: null }
  | { data: null; warnings: string[]; error: { code: string; message: string } }
> {
  const warnings: string[] = []
  const projectResult = await getConstructionProject(input.projectId)

  if (projectResult.error || !projectResult.data) {
    return {
      data: null,
      warnings,
      error: {
        code: projectResult.error?.code === "NOT_FOUND" ? "NOT_FOUND" : "SUPABASE_QUERY_FAILED",
        message: projectResult.error?.message ?? "Projeto nao encontrado.",
      },
    }
  }

  const project = projectResult.data
  const [documentsResult, billingResult] = await Promise.all([
    listConstructionDetectedDocuments(input.projectId),
    getConstructionBillingUsage(input.projectId),
  ])

  if (documentsResult.error) warnings.push(documentsResult.error.message)
  if (billingResult.error) warnings.push(billingResult.error.message)

  const costResult = await generateCostBreakdownV2({
    projectId: input.projectId,
    project,
    detectedDocuments: documentsResult.data ?? [],
  })

  if (costResult.error || !costResult.data) {
    return {
      data: null,
      warnings,
      error: { code: "BENCHMARK_V2_FAILED", message: costResult.error ?? "Nao foi possivel gerar Cost Breakdown V2." },
    }
  }

  const billing = billingResult.data
  const unlockedAnalysis = buildUnlockedConstructionAnalysis({
    projectId: input.projectId,
    project,
    userId: project.user_id ?? null,
    organizationId: project.organization_id,
    costBreakdownV2: costResult.data,
    subscription: billing
      ? {
          status: billing.status,
          planId: billing.planId,
          planName: billing.planName,
          stripeReady: billing.stripeReady,
          remainingThisMonth: billing.remainingThisMonth,
        }
      : null,
    billingStatus: billing?.status ?? null,
  })

  const country = normalizeCostDatabaseCountry(project.technical_country ?? project.country)
  const areaM2 = Math.max(1, Number(costResult.data.areaM2 ?? project.estimated_area_m2 ?? 120))
  const projectCostPerM2 = roundCurrency(costResult.data.totalEstimatedCost / areaM2)
  const marketCostPerM2Range = getMarketCostPerM2RangeV2(project)
  const costPosition = resolveCostPositionV2(projectCostPerM2, marketCostPerM2Range.medium)
  const locked = unlockedAnalysis.accessLevel !== "full_unlocked"
  const specialtyComparisons = buildSpecialtyComparisonsV2({ items: costResult.data.items, areaM2, country, locked })
  const productivityComparisons = buildProductivityComparisonsV2({ items: costResult.data.items, country, locked })
  const riskComparison = buildRiskComparison(project, locked)
  const baseResult: BenchmarkV2Result = {
    accessLevel: unlockedAnalysis.accessLevel,
    isBlocked: locked,
    projectCountry: country,
    comparedCountries: buildComparedCountriesV2(project, locked),
    projectCostPerM2,
    marketCostPerM2Range,
    costPosition,
    specialtyComparisons,
    productivityComparisons,
    laborComparisons: buildLaborComparisonsV2({ items: costResult.data.items, country, locked }),
    scheduleComparison: buildScheduleComparisonV2({ items: costResult.data.items, country, locked }),
    riskComparison,
    maturityComparison: buildMaturityComparison(project, locked),
    confidenceScore: costResult.data.confidenceScore,
    executiveInsights: buildExecutiveInsights({
      projectCostPerM2,
      marketCostPerM2: marketCostPerM2Range.medium,
      costPosition,
      productivityComparisons,
      riskComparison,
    }),
    lockedSections: [],
    upgradeCTA: null,
  }

  const persistWarning = await tryPersistBenchmarkV2({
    projectId: input.projectId,
    projectCostPerM2,
    marketCostPerM2: marketCostPerM2Range.medium,
    differencePercent: differencePercentV2(projectCostPerM2, marketCostPerM2Range.medium),
  })

  if (persistWarning) warnings.push(`Persistencia opcional ignorada: ${persistWarning}`)

  return { data: applyBenchmarkV2Access(baseResult), warnings, error: null }
}
