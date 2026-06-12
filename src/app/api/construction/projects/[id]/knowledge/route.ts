import { NextResponse } from "next/server"
import { generateBenchmarkV2 } from "@/lib/construction/benchmark-v2"
import { buildConstructionCommercialAnalysis } from "@/lib/construction/commercial/experience"
import { getConstructionProject } from "@/lib/construction/db"
import { queryConstructionKnowledge } from "@/lib/construction/knowledge-graph-v2"
import { invalidConstructionProjectResponse, isValidConstructionProjectId } from "@/lib/construction/production"
import { listConstructionHealthCheck } from "@/lib/construction/score-engine"

export const runtime = "nodejs"

type ConstructionKnowledgeRouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(_request: Request, context: ConstructionKnowledgeRouteContext) {
  const { id } = await context.params

  if (!isValidConstructionProjectId(id)) {
    return invalidConstructionProjectResponse()
  }

  const [projectResult, healthCheckResult, commercialResult, benchmarkResult] = await Promise.all([
    getConstructionProject(id),
    listConstructionHealthCheck(id),
    buildConstructionCommercialAnalysis(id),
    generateBenchmarkV2({ projectId: id }),
  ])

  if (projectResult.error?.code === "NOT_FOUND") {
    return NextResponse.json({ error: "Projeto nao encontrado." }, { status: 404 })
  }

  const project = projectResult.data ?? commercialResult.data?.project ?? null
  const query = queryConstructionKnowledge({
    project,
    country: project?.technical_country ?? project?.country,
    detectedDocuments: healthCheckResult.data?.scores.map((score) => score.engine) ?? [],
    specialties: healthCheckResult.data?.identifiedSpecialties ?? commercialResult.data?.costBreakdownV2.items.map((item) => item.specialty) ?? [],
    materials: commercialResult.data?.costBreakdownV2.items.map((item) => item.materialName) ?? [],
    procurementMaterials: commercialResult.data?.costBreakdownV2.items.slice(0, 8).map((item) => item.materialName) ?? [],
    benchmarkDeviation: benchmarkResult.data?.specialtyComparisons.find((comparison) => !comparison.isLocked)?.differencePercent ?? null,
  })

  return NextResponse.json({
    documents: query.documents,
    specialties: query.specialties,
    materials: query.materials,
    suppliers: query.suppliers,
    risks: query.risks,
    dependencies: query.dependencies,
    recommendations: query.recommendations,
    warnings: [
      projectResult.error?.message,
      healthCheckResult.error?.message,
      commercialResult.error?.message,
      benchmarkResult.error?.message,
      ...benchmarkResult.warnings,
    ].filter((warning): warning is string => Boolean(warning)),
  })
}
