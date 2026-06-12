import { NextResponse } from "next/server"
import { trackConstructionEvent, type ConstructionConversionEventType } from "@/lib/construction/analytics/conversion-events"
import { buildConstructionAdvisor } from "@/lib/construction/advisor"
import { generateBenchmarkV2 } from "@/lib/construction/benchmark-v2"
import { buildConstructionCommercialAnalysis } from "@/lib/construction/commercial/experience"
import { buildConstructionIntelligence } from "@/lib/construction/os"
import { buildProcurementPlan } from "@/lib/construction/procurement"
import { invalidConstructionProjectResponse, isValidConstructionProjectId } from "@/lib/construction/production"
import { generateConstructionRiskReport } from "@/lib/construction/risk-v2"
import { listConstructionHealthCheck } from "@/lib/construction/score-engine"
import { buildSupplierRecommendations, type SupplierRecommendation, type SupplierRecommendationResult } from "@/lib/construction/supplier-intelligence"
import { generateConstructionTimeline } from "@/lib/construction/timeline"

export const runtime = "nodejs"

type ConstructionRiskRouteContext = {
  params: Promise<{ id: string }>
}

const riskEvents = new Set<ConstructionConversionEventType>(["risk_opened", "risk_viewed", "risk_action_clicked"])

function buildSupplierMap(commercial: Awaited<ReturnType<typeof buildConstructionCommercialAnalysis>>["data"]) {
  const supplierRecommendations: Record<string, SupplierRecommendationResult | SupplierRecommendation | null> = {}
  if (!commercial) return supplierRecommendations

  for (const item of commercial.costBreakdownV2.items.slice(0, 8)) {
    supplierRecommendations[item.materialName || item.specialty] = buildSupplierRecommendations({
      country: commercial.project.technical_country ?? commercial.project.country,
      specialty: item.specialty,
      materialCategory: item.materialName,
    })
  }

  return supplierRecommendations
}

export async function GET(_request: Request, context: ConstructionRiskRouteContext) {
  const { id } = await context.params

  if (!isValidConstructionProjectId(id)) {
    return invalidConstructionProjectResponse()
  }

  const [healthCheckResult, commercialResult, advisorResult, benchmarkResult] = await Promise.all([
    listConstructionHealthCheck(id),
    buildConstructionCommercialAnalysis(id),
    buildConstructionAdvisor(id),
    generateBenchmarkV2({ projectId: id }),
  ])

  const supplierRecommendations = buildSupplierMap(commercialResult.data)
  const procurementPlan = commercialResult.data?.costBreakdownV2
    ? buildProcurementPlan({
        project: commercialResult.data.project,
        costBreakdown: commercialResult.data.costBreakdownV2,
        supplierRecommendations,
      })
    : null
  const timeline = generateConstructionTimeline({
    projectId: id,
    project: commercialResult.data?.project ?? null,
    healthCheck: healthCheckResult.data,
    specialties: healthCheckResult.data?.identifiedSpecialties ?? commercialResult.data?.costBreakdownV2.items.map((item) => item.specialty) ?? [],
    complexityScore: healthCheckResult.data?.complexityScore ?? commercialResult.data?.project.complexity_score ?? null,
    riskScore: healthCheckResult.data?.riskScore ?? commercialResult.data?.project.risk_score ?? null,
    confidenceScore: healthCheckResult.data?.confidenceScore ?? commercialResult.data?.project.confidence_score ?? null,
    maturityScore: healthCheckResult.data?.maturityScore ?? commercialResult.data?.project.maturity_score ?? null,
    procurementPlan,
    supplierRecommendations,
    knowledgeGraph: healthCheckResult.data?.knowledgeGraph,
  })
  const constructionOS = buildConstructionIntelligence({
    projectId: id,
    project: commercialResult.data?.project ?? null,
    healthCheck: healthCheckResult.data,
    costBreakdownV2: commercialResult.data?.costBreakdownV2 ?? null,
    advisorInsights: advisorResult.data,
    supplierRecommendations,
    procurementPlan,
    timeline,
    benchmarkV2: benchmarkResult.data,
    unlockStatus: commercialResult.data?.unlockedAnalysis ?? null,
  })
  const report = generateConstructionRiskReport({
    projectId: id,
    project: commercialResult.data?.project ?? null,
    healthCheck: healthCheckResult.data,
    timeline,
    procurementPlan,
    procurementActions: constructionOS.procurementActions,
    supplierRecommendations,
    benchmarkV2: benchmarkResult.data,
    costBreakdownV2: commercialResult.data?.costBreakdownV2 ?? null,
    constructionOS,
    knowledgeGraph: healthCheckResult.data?.knowledgeGraph,
  })

  await trackConstructionEvent({
    projectId: id,
    eventType: "risk_opened",
    metadata: {
      source: "construction-risk-api",
      overallRiskScore: report.overallRiskScore,
      riskLevel: report.riskLevel,
      risks: report.risks.length,
    },
  })

  return NextResponse.json({
    ...report,
    warnings: [
      healthCheckResult.error?.message,
      commercialResult.error?.message,
      advisorResult.error?.message,
      benchmarkResult.error?.message,
      ...benchmarkResult.warnings,
    ].filter((warning): warning is string => Boolean(warning)),
  })
}

export async function POST(request: Request, context: ConstructionRiskRouteContext) {
  const { id } = await context.params

  if (!isValidConstructionProjectId(id)) {
    return invalidConstructionProjectResponse()
  }

  const body = (await request.json().catch(() => null)) as {
    eventType?: ConstructionConversionEventType
    metadata?: Record<string, unknown>
  } | null

  if (!body?.eventType || !riskEvents.has(body.eventType)) {
    return NextResponse.json({ ok: false, error: "Evento de Risk Intelligence invalido." }, { status: 400 })
  }

  const result = await trackConstructionEvent({
    projectId: id,
    eventType: body.eventType,
    metadata: {
      source: "construction-risk-panel",
      ...(body.metadata ?? {}),
    },
  })

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error ?? "Nao foi possivel registar evento." }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
