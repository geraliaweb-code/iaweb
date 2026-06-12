import type { BenchmarkV2Result } from "../benchmark-v2"
import type { ConstructionCostBreakdownV2 } from "../cost-engine-v2"
import type { ConstructionIntelligenceOSResult } from "../os"
import type { ProcurementPlanResult } from "../procurement"
import type { ConstructionRiskReport } from "../risk-v2"
import type { SupplierRecommendation, SupplierRecommendationResult } from "../supplier-intelligence"
import type { TimelineOutput } from "../timeline"
import type { ConstructionHealthCheckResult, ConstructionProject } from "../types"

export type ForecastScenario = {
  label: "best_case" | "expected_case" | "worst_case"
  amount: number
  variationPercent: number
  confidence: number
}

export type CostVariation = {
  optimisticDelta: number
  expectedDelta: number
  pessimisticDelta: number
  benchmarkDeviationPercent: number | null
}

export type DelayCostImpact = {
  title: string
  delayWeeks: number
  impactPercent: number
  impact: number
}

export type ForecastRisk = {
  title: string
  source: "timeline" | "risk" | "procurement" | "benchmark" | "supplier" | "construction_os"
  impact: number
}

export type ForecastSummary = {
  title: string
  body: string
  biggestIncreaseRisk: string | null
}

export type CostForecastInput = {
  projectId?: string | null
  project?: ConstructionProject | null
  healthCheck?: ConstructionHealthCheckResult | null
  costBreakdownV2?: ConstructionCostBreakdownV2 | null
  timeline?: TimelineOutput | null
  riskReport?: ConstructionRiskReport | null
  benchmarkV2?: BenchmarkV2Result | null
  constructionOS?: ConstructionIntelligenceOSResult | null
  procurementPlan?: ProcurementPlanResult | null
  supplierRecommendations?: SupplierRecommendationResult | SupplierRecommendation[] | Record<string, SupplierRecommendationResult | SupplierRecommendation | null> | null
}

export type CostForecastOutput = {
  currentCost: number
  bestCase: number
  expectedCase: number
  worstCase: number
  scenarios: ForecastScenario[]
  costVariation: CostVariation
  delayImpacts: DelayCostImpact[]
  forecastRisks: ForecastRisk[]
  recommendations: Array<{
    title: string
    expectedReduction: number
  }>
  summary: ForecastSummary
}
