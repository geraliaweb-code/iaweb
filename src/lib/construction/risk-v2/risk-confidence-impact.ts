import type { ConstructionRiskInput, RiskCategory, RiskSeverity } from "./types"

const severityReduction: Record<RiskSeverity, number> = {
  critical: 18,
  high: 12,
  medium: 7,
  low: 3,
}

const categoryAdjustment: Record<RiskCategory, number> = {
  documental: 1.25,
  financeiro: 0.65,
  prazo: 0.75,
  fornecedor: 0.7,
  procurement: 0.82,
  especialidades: 1,
  compliance: 1.1,
  benchmark: 0.78,
  execucao: 0.92,
  mercado: 0.7,
}

export function estimateConfidenceImpact(input: ConstructionRiskInput, category: RiskCategory, severity: RiskSeverity) {
  const current = input.healthCheck?.confidenceScore ?? input.project?.confidence_score ?? input.timeline?.forecast.confidence ?? 65
  const confidenceReduction = Math.round(severityReduction[severity] * categoryAdjustment[category])
  return {
    confidenceReduction,
    confidenceAfter: Math.max(0, current - confidenceReduction),
  }
}
