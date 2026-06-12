import type { RiskProbability, RiskSeverity } from "./types"

export function probabilityScore(probability: RiskProbability) {
  if (probability === "almost_certain") return 95
  if (probability === "likely") return 76
  if (probability === "possible") return 52
  return 24
}

export function severityScore(severity: RiskSeverity) {
  if (severity === "critical") return 100
  if (severity === "high") return 78
  if (severity === "medium") return 52
  return 26
}

export function classifyRisk(probability: RiskProbability, impactScore: number): RiskSeverity {
  const total = Math.round((probabilityScore(probability) * impactScore) / 100)
  if (total >= 78) return "critical"
  if (total >= 58) return "high"
  if (total >= 34) return "medium"
  return "low"
}

export function classifyOverallRisk(score: number): RiskSeverity {
  if (score >= 78) return "critical"
  if (score >= 62) return "high"
  if (score >= 38) return "medium"
  return "low"
}
