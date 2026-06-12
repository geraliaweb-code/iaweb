import type { ExecutiveSummary, ProjectIntelligenceSnapshot, ProjectStatus } from "./types"

function clampScore(value: number | null, fallback = 0) {
  if (value === null || Number.isNaN(value)) return fallback
  return Math.max(0, Math.min(100, Math.round(value)))
}

export function resolveProjectStatus(snapshot: ProjectIntelligenceSnapshot): ProjectStatus {
  const risk = clampScore(snapshot.healthCheck.riskScore)
  const confidence = clampScore(snapshot.healthCheck.confidenceScore)
  const criticalRisks = snapshot.advisor.criticalRisks.length + snapshot.procurement.criticalItems.length

  if (risk >= 82 || confidence < 35 || criticalRisks >= 3) return "critical"
  if (risk >= 68 || confidence < 50 || criticalRisks > 0) return "high_risk"
  if (risk >= 45 || confidence < 70 || snapshot.healthCheck.missingCriticalDocuments.length > 0) return "needs_attention"
  return "healthy"
}

function statusLabel(status: ProjectStatus) {
  if (status === "critical") return "critico"
  if (status === "high_risk") return "alto risco"
  if (status === "needs_attention") return "precisa de atencao"
  return "saudavel"
}

export function buildExecutiveSummary(snapshot: ProjectIntelligenceSnapshot): ExecutiveSummary {
  const projectStatus = resolveProjectStatus(snapshot)
  const confidence = clampScore(snapshot.healthCheck.confidenceScore ?? snapshot.costIntelligence.confidenceScore)
  const risk = clampScore(snapshot.healthCheck.riskScore)
  const maturity = clampScore(snapshot.healthCheck.maturityScore)
  const complexity = clampScore(snapshot.healthCheck.complexityScore)
  const benchmarkDeviation = snapshot.benchmark.deviationPercent
  const costRange = snapshot.costIntelligence.estimatedCostRange
  const savingsText = snapshot.advisor.totalPotentialSavings > 0 ? ` com poupanca potencial ate ${Math.round(snapshot.advisor.totalPotentialSavings).toLocaleString("pt-PT")} EUR` : ""

  return {
    projectStatus,
    confidence,
    risk,
    maturity,
    complexity,
    estimatedCostRange: {
      min: costRange.min,
      max: costRange.max,
      currency: "EUR",
    },
    benchmarkDeviation,
    shortSummary: `Projeto ${statusLabel(projectStatus)} com confianca ${confidence}/100, risco ${risk}/100 e maturidade ${maturity}/100${savingsText}.`,
  }
}
