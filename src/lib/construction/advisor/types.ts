import type { BenchmarkV2Result } from "../benchmark-v2"
import type { ConstructionCostBreakdownV2 } from "../cost-engine-v2"
import type { ConstructionHealthCheckResult, ConstructionProject } from "../types"

export type AdvisorInsightCategory = "cost" | "risk" | "documents" | "benchmark"

export type AdvisorInsightPriority = "low" | "medium" | "high" | "critical"

export type AdvisorInsight = {
  id: string
  category: AdvisorInsightCategory
  priority: AdvisorInsightPriority
  title: string
  recommendation: string
  impact: string
  estimatedSavings?: number
  confidence: number
}

export type AdvisorContext = {
  project: ConstructionProject
  healthCheck: ConstructionHealthCheckResult | null
  costBreakdown: ConstructionCostBreakdownV2 | null
  benchmark: BenchmarkV2Result | null
}

export type AdvisorActionKey = "reduce_costs" | "largest_risk" | "increase_confidence" | "above_average"

export type ConstructionAdvisorResult = {
  insights: AdvisorInsight[]
  totalPotentialSavings: number
  criticalRisks: AdvisorInsight[]
  missingDocuments: string[]
  confidenceImprovementPotential: number
}
