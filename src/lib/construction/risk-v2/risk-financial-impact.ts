import type { ConstructionRiskInput, RiskCategory, RiskSeverity } from "./types"

const categoryFactor: Record<RiskCategory, number> = {
  documental: 0.035,
  financeiro: 0.065,
  prazo: 0.028,
  fornecedor: 0.03,
  procurement: 0.05,
  especialidades: 0.045,
  compliance: 0.04,
  benchmark: 0.055,
  execucao: 0.048,
  mercado: 0.04,
}

const severityFactor: Record<RiskSeverity, number> = {
  critical: 1.75,
  high: 1.25,
  medium: 0.72,
  low: 0.36,
}

function costBasis(input: ConstructionRiskInput) {
  const range = input.costBreakdownV2?.estimatedFullCostRange
  const healthEstimate = input.healthCheck?.costEstimate
  const min = range?.min ?? healthEstimate?.estimatedCostMin ?? 0
  const max = range?.max ?? healthEstimate?.estimatedCostMax ?? min
  return (input.costBreakdownV2?.totalEstimatedCost ?? healthEstimate?.estimatedCostMid ?? Math.round((min + max) / 2)) || 100000
}

export function estimateFinancialImpact(input: ConstructionRiskInput, category: RiskCategory, severity: RiskSeverity) {
  const expected = Math.round(costBasis(input) * categoryFactor[category] * severityFactor[severity])
  return {
    min: Math.round(expected * 0.42),
    expected,
    max: Math.round(expected * 1.9),
  }
}
