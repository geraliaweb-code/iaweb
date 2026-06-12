import type { DelayRisk } from "../timeline"
import type { RiskCategory, RiskSeverity } from "./types"

const severityWeeks: Record<RiskSeverity, number> = {
  critical: 6,
  high: 4,
  medium: 2,
  low: 1,
}

const categoryMultiplier: Record<RiskCategory, number> = {
  documental: 0.8,
  financeiro: 0.45,
  prazo: 1.2,
  fornecedor: 0.9,
  procurement: 1.25,
  especialidades: 0.9,
  compliance: 0.7,
  benchmark: 0.35,
  execucao: 1,
  mercado: 0.75,
}

export function estimateTimelineImpact(category: RiskCategory, severity: RiskSeverity, sourceDelayRisk?: DelayRisk | null) {
  const weeks = sourceDelayRisk?.impactWeeks ?? Math.max(1, Math.round(severityWeeks[severity] * categoryMultiplier[category]))
  return {
    weeks,
    months: Math.max(0, Math.round((weeks / 4.345) * 10) / 10),
  }
}
