import type { ConstructionCostBreakdownLine, ConstructionCostBreakdownV2 } from "../cost-engine-v2"
import type { ConstructionProject } from "../types"
import type { SupplierRecommendation, SupplierRecommendationResult } from "../supplier-intelligence"

export type ProcurementPriority = "low" | "medium" | "high" | "critical"
export type ProcurementRisk = "low" | "medium" | "high" | "critical"

export type ProcurementItem = {
  material: string
  quantity: number
  unit: string
  supplier: string
  alternativeSuppliers: string[]
  phase: string
  procurementWindow: string
  estimatedCost: number
  priority: ProcurementPriority
  risk: ProcurementRisk
}

export type PlannedMaterial = {
  material: string
  quantity: number
  unit: string
  specialty: string
  category: string
  estimatedCost: number
  confidenceScore: number
  sourceLine: ConstructionCostBreakdownLine
}

export type PlannedSupplier = {
  supplier: string
  alternativeSuppliers: string[]
  recommendation: SupplierRecommendation | null
  recommendationResult: SupplierRecommendationResult
}

export type PlannedPhase = {
  phase: string
  procurementWindow: string
  urgencyScore: number
}

export type ProcurementScore = {
  urgencyScore: number
  supplierConfidence: number
  procurementRisk: ProcurementRisk
  procurementPriority: ProcurementPriority
}

export type ProcurementPlanInput = {
  project?: ConstructionProject | null
  costBreakdown: ConstructionCostBreakdownV2
  supplierRecommendations?: Record<string, SupplierRecommendationResult | SupplierRecommendation | null>
}

export type ProcurementPlanResult = {
  procurementItems: ProcurementItem[]
  totalProcurementValue: number
  highPriorityItems: ProcurementItem[]
  criticalItems: ProcurementItem[]
}
