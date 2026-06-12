import type { BenchmarkV2Result } from "../benchmark-v2"
import type { ConstructionCostBreakdownV2 } from "../cost-engine-v2"
import type { ConstructionKnowledgeGraphSummary } from "../knowledge-graph"
import type { ConstructionIntelligenceOSResult } from "../os"
import type { ProcurementItem, ProcurementPlanResult } from "../procurement"
import type { SupplierRecommendation, SupplierRecommendationResult } from "../supplier-intelligence"
import type { TimelineOutput } from "../timeline"
import type { ConstructionHealthCheckResult, ConstructionProject } from "../types"

export type RiskCategory =
  | "documental"
  | "financeiro"
  | "prazo"
  | "fornecedor"
  | "procurement"
  | "especialidades"
  | "compliance"
  | "benchmark"
  | "execucao"
  | "mercado"

export type RiskSeverity = "critical" | "high" | "medium" | "low"

export type RiskProbability = "rare" | "possible" | "likely" | "almost_certain"

export type RiskScore = {
  probabilityScore: number
  impactScore: number
  totalScore: number
}

export type RiskImpact = {
  financialImpactMin: number
  financialImpactExpected: number
  financialImpactMax: number
  timelineImpactWeeks: number
  timelineImpactMonths: number
  confidenceReduction: number
  confidenceAfter: number
}

export type RiskRecommendation = {
  title: string
  action: string
  expectedFinancialReductionPercent: number
  expectedWeeksReduction: number
  confidenceGain: number
}

export type RiskAssessment = {
  id: string
  title: string
  category: RiskCategory
  severity: RiskSeverity
  probability: RiskProbability
  score: RiskScore
  impact: RiskImpact
  recommendation: RiskRecommendation
  source: "health_check" | "timeline" | "procurement" | "supplier" | "knowledge_graph" | "benchmark" | "cost_intelligence" | "construction_os"
}

export type ConstructionRiskInput = {
  projectId?: string | null
  project?: ConstructionProject | null
  healthCheck?: ConstructionHealthCheckResult | null
  timeline?: TimelineOutput | null
  procurementPlan?: ProcurementPlanResult | null
  procurementActions?: ProcurementItem[]
  supplierRecommendations?: SupplierRecommendationResult | SupplierRecommendation[] | Record<string, SupplierRecommendationResult | SupplierRecommendation | null> | null
  benchmarkV2?: BenchmarkV2Result | null
  costBreakdownV2?: ConstructionCostBreakdownV2 | null
  constructionOS?: ConstructionIntelligenceOSResult | null
  knowledgeGraph?: Partial<ConstructionKnowledgeGraphSummary> | null
}

export type ConstructionRiskReport = {
  overallRiskScore: number
  riskLevel: RiskSeverity
  risks: RiskAssessment[]
  topFinancialRisks: Array<{
    title: string
    impact: number
  }>
  topTimelineRisks: Array<{
    title: string
    impactWeeks: number
  }>
  topConfidenceRisks: Array<{
    title: string
    confidenceReduction: number
  }>
  recommendations: RiskRecommendation[]
}
