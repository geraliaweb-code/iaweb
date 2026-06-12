import { NextResponse } from "next/server"
import { trackConstructionEvent, type ConstructionConversionEventType } from "@/lib/construction/analytics/conversion-events"
import { buildConstructionCommercialAnalysis } from "@/lib/construction/commercial/experience"
import { getConstructionProject } from "@/lib/construction/db"
import { generateConstructionTimeline } from "@/lib/construction/timeline"
import { buildProcurementPlan } from "@/lib/construction/procurement"
import { invalidConstructionProjectResponse, isValidConstructionProjectId } from "@/lib/construction/production"
import { listConstructionHealthCheck } from "@/lib/construction/score-engine"
import { buildSupplierRecommendations, type SupplierRecommendation, type SupplierRecommendationResult } from "@/lib/construction/supplier-intelligence"

export const runtime = "nodejs"

type ConstructionTimelineRouteContext = {
  params: Promise<{ id: string }>
}

const timelineEvents = new Set<ConstructionConversionEventType>(["timeline_opened", "timeline_action_viewed", "timeline_action_clicked"])

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

export async function GET(_request: Request, context: ConstructionTimelineRouteContext) {
  const { id } = await context.params

  if (!isValidConstructionProjectId(id)) {
    return invalidConstructionProjectResponse()
  }

  const [projectResult, healthCheckResult, commercialResult] = await Promise.all([
    getConstructionProject(id),
    listConstructionHealthCheck(id),
    buildConstructionCommercialAnalysis(id),
  ])

  if (projectResult.error?.code === "NOT_FOUND") {
    return NextResponse.json({ timeline: null, error: "Projeto nao encontrado." }, { status: 404 })
  }

  const project = projectResult.data ?? commercialResult.data?.project ?? null
  const supplierRecommendations = buildSupplierMap(commercialResult.data)
  const procurementPlan = commercialResult.data?.costBreakdownV2
    ? buildProcurementPlan({
        project,
        costBreakdown: commercialResult.data.costBreakdownV2,
        supplierRecommendations,
      })
    : null

  const timeline = generateConstructionTimeline({
    projectId: id,
    project,
    healthCheck: healthCheckResult.data,
    specialties: healthCheckResult.data?.identifiedSpecialties ?? commercialResult.data?.costBreakdownV2.items.map((item) => item.specialty) ?? [],
    complexityScore: healthCheckResult.data?.complexityScore ?? project?.complexity_score ?? null,
    riskScore: healthCheckResult.data?.riskScore ?? project?.risk_score ?? null,
    confidenceScore: healthCheckResult.data?.confidenceScore ?? project?.confidence_score ?? null,
    maturityScore: healthCheckResult.data?.maturityScore ?? project?.maturity_score ?? null,
    procurementPlan,
    supplierRecommendations,
    knowledgeGraph: healthCheckResult.data?.knowledgeGraph,
  })

  await trackConstructionEvent({
    projectId: id,
    eventType: "timeline_opened",
    metadata: {
      source: "construction-timeline-api",
      expectedMonths: timeline.forecast.expectedMonths,
      delayRisks: timeline.delayRisks.length,
      criticalPath: timeline.criticalPath.length,
    },
  })

  return NextResponse.json({
    estimatedDuration: timeline.estimatedDuration,
    forecast: timeline.forecast,
    phases: timeline.phases,
    criticalPath: timeline.criticalPath,
    delayRisks: timeline.delayRisks,
    dependencies: timeline.dependencies,
    nextActions: timeline.nextActions,
    warnings: [
      projectResult.error?.message,
      healthCheckResult.error?.message,
      commercialResult.error?.message,
    ].filter((warning): warning is string => Boolean(warning)),
  })
}

export async function POST(request: Request, context: ConstructionTimelineRouteContext) {
  const { id } = await context.params

  if (!isValidConstructionProjectId(id)) {
    return invalidConstructionProjectResponse()
  }

  const body = (await request.json().catch(() => null)) as {
    eventType?: ConstructionConversionEventType
    metadata?: Record<string, unknown>
  } | null

  if (!body?.eventType || !timelineEvents.has(body.eventType)) {
    return NextResponse.json({ ok: false, error: "Evento de Timeline Intelligence invalido." }, { status: 400 })
  }

  const result = await trackConstructionEvent({
    projectId: id,
    eventType: body.eventType,
    metadata: {
      source: "construction-timeline-panel",
      ...(body.metadata ?? {}),
    },
  })

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error ?? "Nao foi possivel registar evento." }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
