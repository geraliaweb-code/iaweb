import type { AdvisorInsight, ConstructionAdvisorResult } from "../advisor"
import type { BenchmarkV2Result } from "../benchmark-v2"
import type { ConstructionCostBreakdownV2 } from "../cost-engine-v2"
import type { KnowledgeQueryResult } from "../knowledge-graph-v2"
import type { ProcurementItem, ProcurementPlanResult } from "../procurement"
import type { SupplierRecommendation, SupplierRecommendationResult } from "../supplier-intelligence"
import type { TimelineOutput } from "../timeline"
import type { ConstructionHealthCheckResult, ConstructionProject, ConstructionScoreRecord } from "../types"
import type { UnlockedConstructionAnalysis } from "../unlock-engine"

export type ProjectStatus = "healthy" | "needs_attention" | "high_risk" | "critical"

export type ActionPriority = "critical" | "high" | "medium" | "low"

export type NextBestAction = {
  id: string
  title: string
  description: string
  priority: ActionPriority
  category: "documents" | "technical" | "cost" | "supplier" | "procurement" | "timeline" | "unlock"
  riskImpact: number
  financialImpact: number
  confidenceImpact: number
  procurementUrgency: number
  unlockImpact: number
  ctaLabel?: string
  href?: string
}

export type ExecutiveSummary = {
  projectStatus: ProjectStatus
  confidence: number
  risk: number
  maturity: number
  complexity: number
  estimatedCostRange: {
    min: number | null
    max: number | null
    currency: "EUR"
  }
  benchmarkDeviation: number | null
  shortSummary: string
}

export type ProjectIntelligenceSnapshot = {
  projectId: string | null
  projectName: string | null
  healthCheck: {
    available: boolean
    maturityScore: number | null
    riskScore: number | null
    complexityScore: number | null
    confidenceScore: number | null
    missingCriticalDocuments: string[]
    alerts: ConstructionHealthCheckResult["alerts"]
  }
  costIntelligence: {
    available: boolean
    confidenceScore: number | null
    estimatedCostRange: {
      min: number | null
      max: number | null
    }
    totalEstimatedCost: number | null
    warnings: string[]
  }
  benchmark: {
    available: boolean
    isBlocked: boolean
    deviationPercent: number | null
    position: BenchmarkV2Result["costPosition"] | null
    insights: string[]
  }
  advisor: {
    available: boolean
    insights: AdvisorInsight[]
    totalPotentialSavings: number
    criticalRisks: AdvisorInsight[]
    missingDocuments: string[]
    confidenceImprovementPotential: number
  }
  supplier: {
    available: boolean
    recommendations: SupplierRecommendation[]
    primarySupplier: SupplierRecommendation | null
  }
  procurement: {
    available: boolean
    items: ProcurementItem[]
    criticalItems: ProcurementItem[]
    highPriorityItems: ProcurementItem[]
    totalProcurementValue: number
  }
  unlock: {
    available: boolean
    accessLevel: string | null
    unlockedPercentage: number | null
    blockedItems: string[]
    canViewSuppliers: boolean | null
    canViewFullBenchmark: boolean | null
    canDownloadPdf: boolean | null
  }
  timeline: {
    available: boolean
    estimatedMonths: number | null
    forecast: TimelineOutput["forecast"] | null
    delayRisks: TimelineOutput["delayRisks"]
    criticalPath: TimelineOutput["criticalPath"]
    nextActions: TimelineOutput["nextActions"]
  }
  knowledgeV2: {
    available: boolean
    dependencies: KnowledgeQueryResult["dependencies"]
    recommendations: string[]
    costDrivers: string[]
    scheduleDrivers: string[]
    supplierAlternatives: string[]
  }
}

export type ConstructionIntelligenceOSInput = {
  projectId?: string | null
  project?: ConstructionProject | null
  scores?: ConstructionHealthCheckResult | ConstructionScoreRecord[] | null
  healthCheck?: ConstructionHealthCheckResult | null
  costBreakdownV2?: ConstructionCostBreakdownV2 | null
  advisorInsights?: ConstructionAdvisorResult | AdvisorInsight[] | null
  supplierRecommendations?: SupplierRecommendationResult | SupplierRecommendation[] | Record<string, SupplierRecommendationResult | SupplierRecommendation | null> | null
  procurementPlan?: ProcurementPlanResult | null
  timeline?: TimelineOutput | null
  knowledgeV2?: KnowledgeQueryResult | null
  benchmarkV2?: BenchmarkV2Result | null
  unlockStatus?: Partial<UnlockedConstructionAnalysis> | null
}

export type CommercialCTA = {
  label: string
  title: string
  body: string
  href: string
} | null

export type ConstructionIntelligenceOSResult = {
  executiveSummary: ExecutiveSummary
  projectStatus: ProjectStatus
  confidenceScore: number
  topRisks: string[]
  topSavings: Array<{
    title: string
    amount: number | null
  }>
  supplierRecommendations: SupplierRecommendation[]
  procurementActions: ProcurementItem[]
  timelineSummary: {
    estimatedMonths: number | null
    primaryDelayRisk: string | null
    criticalPathLength: number
  }
  timelineForecast: TimelineOutput["forecast"] | null
  delayRisks: TimelineOutput["delayRisks"]
  criticalPath: TimelineOutput["criticalPath"]
  nextBestActions: NextBestAction[]
  blockedOpportunities: string[]
  commercialCTA: CommercialCTA
  projectIntelligenceSnapshot: ProjectIntelligenceSnapshot
  warnings: string[]
}
