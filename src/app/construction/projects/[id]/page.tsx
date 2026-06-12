import type { Metadata } from "next"
import Link from "next/link"
import { Lock } from "lucide-react"
import { notFound } from "next/navigation"
import BenchmarkPreviewPanel from "@/components/construction/BenchmarkPreviewPanel"
import ConstructionAdvisorPanel from "@/components/construction/ConstructionAdvisorPanel"
import ConstructionCostIntelligencePanel from "@/components/construction/ConstructionCostIntelligencePanel"
import ConstructionCopilot from "@/components/construction/ConstructionCopilot"
import ConstructionForecastPanel from "@/components/construction/ConstructionForecastPanel"
import ConstructionOSPanel from "@/components/construction/ConstructionOSPanel"
import ConstructionRiskPanel from "@/components/construction/ConstructionRiskPanel"
import ConstructionShell from "@/components/construction/ConstructionShell"
import ConstructionTimelinePanel from "@/components/construction/ConstructionTimelinePanel"
import ExecutiveProjectDashboard from "@/components/construction/ExecutiveProjectDashboard"
import PdfPreviewPanel from "@/components/construction/PdfPreviewPanel"
import ProjectTabs from "@/components/construction/ProjectTabs"
import UpgradeBanner from "@/components/construction/UpgradeBanner"
import { getConstructionAccountContext, getConstructionAuthUser } from "@/lib/construction/auth"
import {
  constructionDemoHealthCheck,
  constructionDemoProject,
  constructionPt002HealthCheck,
  constructionPt002Project,
  constructionTartasHealthCheck,
  constructionTartasProject,
} from "@/lib/construction/demo-data"
import { buildConstructionAdvisor } from "@/lib/construction/advisor"
import { generateBenchmarkV2 } from "@/lib/construction/benchmark-v2"
import { buildConstructionCommercialAnalysis } from "@/lib/construction/commercial/experience"
import { generateConstructionCostForecast } from "@/lib/construction/cost-forecasting"
import { getConstructionProject } from "@/lib/construction/db"
import { buildConstructionIntelligence } from "@/lib/construction/os"
import { buildProcurementPlan } from "@/lib/construction/procurement"
import { isConstructionAlphaEnvironment, isValidConstructionProjectId } from "@/lib/construction/production"
import { generateConstructionRiskReport } from "@/lib/construction/risk-v2"
import { listConstructionHealthCheck } from "@/lib/construction/score-engine"
import { buildSupplierRecommendations, type SupplierRecommendation, type SupplierRecommendationResult } from "@/lib/construction/supplier-intelligence"
import { generateConstructionTimeline } from "@/lib/construction/timeline"
import type { ConstructionAdvisorResult } from "@/lib/construction/advisor"
import type { ConstructionHealthCheckResult, ConstructionProject } from "@/lib/construction/types"

export const dynamic = "force-dynamic"

type ProjectPageProps = {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: "Projeto Construction | IAWEB",
}

export default async function ConstructionProjectPage({ params }: ProjectPageProps) {
  const { id } = await params
  const isAlpha = isConstructionAlphaEnvironment()

  if (id === "demo") {
    const demoIntelligence = buildAlphaHealthCheckV2Intelligence(constructionDemoProject, constructionDemoHealthCheck, "Portugal")
    return (
      <ConstructionShell>
        <ExecutiveProjectDashboard project={constructionDemoProject} healthCheck={constructionDemoHealthCheck} intelligence={demoIntelligence} />
        <ConstructionCopilot project={constructionDemoProject} healthCheck={constructionDemoHealthCheck} />
        <ProjectTabs project={constructionDemoProject} demoMode />
      </ConstructionShell>
    )
  }

  if (isAlpha && id === "pt-002") {
    const pt002Intelligence = buildAlphaHealthCheckV2Intelligence(constructionPt002Project, constructionPt002HealthCheck, "Portugal")
    return (
      <ConstructionShell>
        <ExecutiveProjectDashboard project={constructionPt002Project} healthCheck={constructionPt002HealthCheck} intelligence={pt002Intelligence} />
        <ProjectTabs project={constructionPt002Project} demoMode />
      </ConstructionShell>
    )
  }

  if (isAlpha && id === "tartas") {
    const tartasIntelligence = buildAlphaHealthCheckV2Intelligence(constructionTartasProject, constructionTartasHealthCheck, "Franca")
    return (
      <ConstructionShell>
        <ExecutiveProjectDashboard project={constructionTartasProject} healthCheck={constructionTartasHealthCheck} intelligence={tartasIntelligence} />
        <ProjectTabs project={constructionTartasProject} demoMode />
      </ConstructionShell>
    )
  }

  if (!isValidConstructionProjectId(id)) {
    notFound()
  }

  const { data, error } = await getConstructionProject(id)

  if (error?.code === "NOT_FOUND") {
    notFound()
  }

  if (error) {
    return (
      <ConstructionShell>
        <div className="flex flex-1 items-center justify-center py-12">
          <div className="construction-glass-card max-w-2xl rounded-xl p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-400">Projeto indisponivel</p>
            <h1 className="mt-3 text-2xl font-semibold text-white">Nao foi possivel carregar este projeto.</h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">{error.message}</p>
            <Link href="/construction/dashboard" className="mt-6 inline-flex rounded-lg bg-amber-500 px-5 py-3 text-sm font-bold text-slate-950">
              Voltar ao dashboard
            </Link>
          </div>
        </div>
      </ConstructionShell>
    )
  }

  if (!data) {
    notFound()
  }

  const { user } = await getConstructionAuthUser()
  const context = await getConstructionAccountContext(user)

  if (user && context.organization?.id) {
    if (data.organization_id !== context.organization.id) notFound()
  } else if (user && data.user_id && data.user_id !== user.id) {
    notFound()
  }

  const healthCheckResult = await listConstructionHealthCheck(data.id)
  const advisorResult = await buildConstructionAdvisor(data.id)
  const healthCheckV2 = await buildHealthCheckV2Intelligence(data.id, data, healthCheckResult.data, advisorResult.data)

  return (
    <ConstructionShell>
      <ExecutiveProjectDashboard
        project={data}
        healthCheck={healthCheckResult.data}
        intelligence={healthCheckV2}
        warning={[healthCheckResult.error?.message, healthCheckV2.warning].filter(Boolean).join(" ")}
      />
      {isAlpha ? (
        <>
          <ConstructionOSPanel projectId={data.id} />
          <ConstructionTimelinePanel projectId={data.id} />
          <ConstructionRiskPanel projectId={data.id} />
          <ConstructionForecastPanel projectId={data.id} />
          <ConstructionAdvisorPanel projectId={data.id} advisor={advisorResult.data} warnings={advisorResult.warnings} />
          <ConstructionCostIntelligencePanel projectId={data.id} />
          <BenchmarkPreviewPanel projectId={data.id} />
          <PdfPreviewPanel projectId={data.id} />
          <UpgradeBanner projectId={data.id} />
          <LockedCopilotPanel />
        </>
      ) : null}
      <ProjectTabs project={data} />
    </ConstructionShell>
  )
}

function buildSupplierMap(commercial: Awaited<ReturnType<typeof buildConstructionCommercialAnalysis>>["data"]) {
  const supplierRecommendations: Record<string, SupplierRecommendationResult | SupplierRecommendation | null> = {}

  for (const item of commercial?.costBreakdownV2.items.slice(0, 8) ?? []) {
    supplierRecommendations[item.materialName || item.specialty] = buildSupplierRecommendations({
      country: commercial?.project.technical_country ?? commercial?.project.country,
      specialty: item.specialty,
      materialCategory: item.materialName,
    })
  }

  return supplierRecommendations
}

async function buildHealthCheckV2Intelligence(
  projectId: string,
  project: ConstructionProject,
  healthCheck: ConstructionHealthCheckResult | null,
  advisor: ConstructionAdvisorResult | null,
) {
  const [commercialResult, benchmarkResult] = await Promise.all([
    buildConstructionCommercialAnalysis(projectId),
    generateBenchmarkV2({ projectId }),
  ])
  const commercial = commercialResult.data
  const supplierRecommendations = buildSupplierMap(commercial)
  const procurementPlan = commercial?.costBreakdownV2
    ? buildProcurementPlan({
        project: commercial.project,
        costBreakdown: commercial.costBreakdownV2,
        supplierRecommendations,
      })
    : null
  const timeline = generateConstructionTimeline({
    projectId,
    project: commercial?.project ?? project,
    healthCheck,
    specialties: healthCheck?.identifiedSpecialties ?? commercial?.costBreakdownV2.items.map((item) => item.specialty) ?? [],
    complexityScore: healthCheck?.complexityScore ?? project.complexity_score ?? null,
    riskScore: healthCheck?.riskScore ?? project.risk_score ?? null,
    confidenceScore: healthCheck?.confidenceScore ?? project.confidence_score ?? null,
    maturityScore: healthCheck?.maturityScore ?? project.maturity_score ?? null,
    procurementPlan,
    supplierRecommendations,
    knowledgeGraph: healthCheck?.knowledgeGraph,
  })
  const constructionOS = buildConstructionIntelligence({
    projectId,
    project: commercial?.project ?? project,
    healthCheck,
    costBreakdownV2: commercial?.costBreakdownV2 ?? null,
    advisorInsights: advisor,
    supplierRecommendations,
    procurementPlan,
    timeline,
    benchmarkV2: benchmarkResult.data,
    unlockStatus: commercial?.unlockedAnalysis ?? null,
  })
  const riskReport = generateConstructionRiskReport({
    projectId,
    project: commercial?.project ?? project,
    healthCheck,
    timeline,
    procurementPlan,
    procurementActions: constructionOS.procurementActions,
    supplierRecommendations,
    benchmarkV2: benchmarkResult.data,
    costBreakdownV2: commercial?.costBreakdownV2 ?? null,
    constructionOS,
    knowledgeGraph: healthCheck?.knowledgeGraph,
  })
  const forecast = generateConstructionCostForecast({
    projectId,
    project: commercial?.project ?? project,
    healthCheck,
    costBreakdownV2: commercial?.costBreakdownV2 ?? null,
    timeline,
    riskReport,
    benchmarkV2: benchmarkResult.data,
    constructionOS,
    procurementPlan,
    supplierRecommendations,
  })

  return {
    timeline,
    riskReport,
    forecast,
    benchmark: benchmarkResult.data,
    advisor,
    warning: [
      commercialResult.error?.message,
      benchmarkResult.error?.message,
      ...benchmarkResult.warnings,
    ].filter(Boolean).join(" "),
  }
}

function buildAlphaHealthCheckV2Intelligence(project: ConstructionProject, healthCheck: ConstructionHealthCheckResult, benchmarkCountry: "Portugal" | "Franca") {
  const timeline = generateConstructionTimeline({
    projectId: project.id,
    project,
    healthCheck,
    specialties: healthCheck.identifiedSpecialties,
    complexityScore: healthCheck.complexityScore,
    riskScore: healthCheck.riskScore,
    confidenceScore: healthCheck.confidenceScore,
    maturityScore: healthCheck.maturityScore,
    knowledgeGraph: healthCheck.knowledgeGraph,
  })
  const riskReport = generateConstructionRiskReport({
    projectId: project.id,
    project,
    healthCheck,
    timeline,
    knowledgeGraph: healthCheck.knowledgeGraph,
  })
  const forecast = generateConstructionCostForecast({
    projectId: project.id,
    project,
    healthCheck,
    timeline,
    riskReport,
  })
  const mediumCost = project.estimated_area_m2 ? Math.round((healthCheck.costEstimate?.estimatedCostMid ?? forecast.expectedCase) / project.estimated_area_m2) : 1900

  return {
    timeline,
    riskReport,
    forecast,
    benchmark: {
      accessLevel: "full_unlocked" as const,
      isBlocked: false,
      projectCountry: benchmarkCountry,
      comparedCountries: [],
      projectCostPerM2: mediumCost,
      marketCostPerM2Range: benchmarkCountry === "Franca" ? { low: 1420, medium: 1910, high: 2580 } : { low: 1400, medium: 1900, high: 2600 },
      costPosition: "dentro_da_media" as const,
      specialtyComparisons: [],
      productivityComparisons: [],
      laborComparisons: [],
      scheduleComparison: null,
      riskComparison: null,
      maturityComparison: null,
      confidenceScore: healthCheck.learningConfidence?.benchmarkConfidence ?? healthCheck.confidenceScore,
      executiveInsights: [
        benchmarkCountry === "Franca"
          ? "TARTAS consolidado produz Benchmark FR consistente para custo, prazo e produtividade."
          : `${project.name} esta dentro da media de custo para projetos semelhantes.`,
      ],
      lockedSections: [],
      upgradeCTA: null,
    },
    advisor: null,
  }
}

function LockedCopilotPanel() {
  return (
    <section className="construction-glass-card rounded-xl p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="max-w-3xl">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-300 text-slate-950">
            <Lock className="h-5 w-5" aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-white">Construction Copilot completo bloqueado</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            O Copilot completo, recomendacoes tecnicas, proximos passos e Knowledge Vault avancado fazem parte da analise completa.
          </p>
        </div>
        <Link href="/construction/billing" className="inline-flex rounded-lg bg-amber-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-300">
          Desbloquear Analise Completa
        </Link>
      </div>
    </section>
  )
}
