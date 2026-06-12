import { generateBenchmarkV2 } from "../benchmark-v2"
import { generateCostBreakdownV2 } from "../cost-engine-v2"
import { getConstructionProject } from "../db"
import { listConstructionHealthCheck } from "../score-engine"
import { buildBenchmarkAdvisorInsights } from "./benchmark-advisor"
import { buildCostAdvisorInsights } from "./cost-advisor"
import { buildDocumentsAdvisorInsights } from "./documents-advisor"
import { sortAdvisorInsights, uniqueAdvisorInsights } from "./recommendation-engine"
import { buildRiskAdvisorInsights } from "./risk-advisor"
import type { AdvisorContext, ConstructionAdvisorResult } from "./types"

export async function buildConstructionAdvisor(projectId: string): Promise<
  | { data: ConstructionAdvisorResult; error: null; warnings: string[] }
  | { data: null; error: { code: string; message: string }; warnings: string[] }
> {
  const warnings: string[] = []
  const projectResult = await getConstructionProject(projectId)

  if (projectResult.error || !projectResult.data) {
    return {
      data: null,
      error: {
        code: projectResult.error?.code ?? "SUPABASE_QUERY_FAILED",
        message: projectResult.error?.message ?? "Projeto nao encontrado.",
      },
      warnings,
    }
  }

  const [healthCheckResult, costResult, benchmarkResult] = await Promise.all([
    listConstructionHealthCheck(projectId),
    generateCostBreakdownV2({ projectId, project: projectResult.data }),
    generateBenchmarkV2({ projectId }),
  ])

  if (healthCheckResult.error) warnings.push(healthCheckResult.error.message)
  if (costResult.error) warnings.push(costResult.error)
  if (benchmarkResult.error) warnings.push(benchmarkResult.error.message)
  warnings.push(...benchmarkResult.warnings)

  const context: AdvisorContext = {
    project: projectResult.data,
    healthCheck: healthCheckResult.data,
    costBreakdown: costResult.data,
    benchmark: benchmarkResult.data,
  }
  const insights = sortAdvisorInsights(uniqueAdvisorInsights([
    ...buildCostAdvisorInsights(context),
    ...buildRiskAdvisorInsights(context),
    ...buildDocumentsAdvisorInsights(context),
    ...buildBenchmarkAdvisorInsights(context),
  ]))
  const missingDocuments = healthCheckResult.data?.missingCriticalDocuments ?? []
  const currentConfidence = healthCheckResult.data?.confidenceScore ?? projectResult.data.confidence_score ?? 0
  const confidenceImprovementPotential = missingDocuments.length ? Math.min(18, missingDocuments.length * 7) : currentConfidence < 76 ? 8 : 0

  return {
    data: {
      insights,
      totalPotentialSavings: Math.max(0, ...insights.map((insight) => insight.estimatedSavings ?? 0)),
      criticalRisks: insights.filter((insight) => insight.category === "risk" && ["critical", "high"].includes(insight.priority)),
      missingDocuments,
      confidenceImprovementPotential,
    },
    error: null,
    warnings,
  }
}
