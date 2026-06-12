import type { PlannedMaterial, PlannedPhase, PlannedSupplier, ProcurementPriority, ProcurementRisk, ProcurementScore } from "./types"

function riskFromScore(score: number): ProcurementRisk {
  if (score >= 82) return "critical"
  if (score >= 64) return "high"
  if (score >= 42) return "medium"
  return "low"
}

function priorityFromScore(score: number): ProcurementPriority {
  if (score >= 84) return "critical"
  if (score >= 66) return "high"
  if (score >= 44) return "medium"
  return "low"
}

function costWeight(estimatedCost: number) {
  if (estimatedCost >= 50000) return 22
  if (estimatedCost >= 20000) return 16
  if (estimatedCost >= 8000) return 10
  return 4
}

export function scoreProcurement(input: {
  material: PlannedMaterial
  supplier: PlannedSupplier
  phase: PlannedPhase
}): ProcurementScore {
  const urgencyScore = input.phase.urgencyScore
  const supplierConfidence = input.supplier.recommendation?.confidenceScore ?? input.material.confidenceScore
  const lowConfidencePenalty = Math.max(0, 72 - supplierConfidence) * 0.55
  const noAlternativesPenalty = input.supplier.alternativeSuppliers.length ? 0 : 12
  const riskScore = urgencyScore * 0.42 + costWeight(input.material.estimatedCost) + lowConfidencePenalty + noAlternativesPenalty
  const priorityScore = urgencyScore * 0.52 + costWeight(input.material.estimatedCost) + (input.material.category === "STRUCTURE" ? 12 : 0)

  return {
    urgencyScore,
    supplierConfidence,
    procurementRisk: riskFromScore(riskScore),
    procurementPriority: priorityFromScore(priorityScore),
  }
}
