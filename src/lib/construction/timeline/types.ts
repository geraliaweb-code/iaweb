import type { ConstructionKnowledgeGraphSummary } from "../knowledge-graph"
import type { ProcurementPlanResult } from "../procurement"
import type { SupplierRecommendation, SupplierRecommendationResult } from "../supplier-intelligence"
import type { ConstructionHealthCheckResult, ConstructionProject } from "../types"

export type TimelineSeverity = "low" | "medium" | "high" | "critical"

export type TimelineInput = {
  projectId?: string | null
  project?: ConstructionProject | null
  healthCheck?: ConstructionHealthCheckResult | null
  specialties?: string[]
  complexityScore?: number | null
  riskScore?: number | null
  confidenceScore?: number | null
  maturityScore?: number | null
  procurementPlan?: ProcurementPlanResult | null
  supplierRecommendations?: SupplierRecommendationResult | SupplierRecommendation[] | Record<string, SupplierRecommendationResult | SupplierRecommendation | null> | null
  knowledgeGraph?: Partial<ConstructionKnowledgeGraphSummary> | null
}

export type ConstructionPhase = {
  id: string
  name: string
  order: number
  estimatedWeeks: number
  startWeek: number
  endWeek: number
  specialties: string[]
  isCritical: boolean
}

export type TimelineDependency = {
  id: string
  fromPhaseId: string
  toPhaseId: string
  type: "finish_to_start" | "start_to_start"
  rationale: string
}

export type DelayRisk = {
  id: string
  title: string
  severity: TimelineSeverity
  impactWeeks: number
  recommendation: string
}

export type CriticalPathItem = {
  phaseId: string
  phaseName: string
  order: number
  estimatedWeeks: number
  dependencyIds: string[]
  riskLevel: TimelineSeverity
}

export type TimelineForecast = {
  bestCaseMonths: number
  expectedMonths: number
  worstCaseMonths: number
  confidence: number
}

export type TimelineAction = {
  id: string
  title: string
  priority: "critical" | "high" | "medium" | "low"
  impactWeeks: number
  recommendation: string
}

export type TimelineOutput = {
  estimatedDuration: {
    weeks: number
    months: number
    source: string
  }
  phases: ConstructionPhase[]
  dependencies: TimelineDependency[]
  criticalPath: CriticalPathItem[]
  delayRisks: DelayRisk[]
  forecast: TimelineForecast
  nextActions: TimelineAction[]
}
