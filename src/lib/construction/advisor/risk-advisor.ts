import { buildAdvisorInsight } from "./recommendation-engine"
import type { AdvisorContext, AdvisorInsight } from "./types"

function priorityFromRisk(score: number): AdvisorInsight["priority"] {
  if (score >= 82) return "critical"
  if (score >= 65) return "high"
  if (score >= 45) return "medium"
  return "low"
}

export function buildRiskAdvisorInsights(context: AdvisorContext): AdvisorInsight[] {
  const { healthCheck, project } = context
  const insights: AdvisorInsight[] = []
  const riskScore = healthCheck?.riskScore ?? project.risk_score ?? 0

  if (riskScore >= 45) {
    insights.push(buildAdvisorInsight({
      id: "risk-score-main",
      category: "risk",
      priority: priorityFromRisk(riskScore),
      title: "Risco tecnico/documental acima do nivel confortavel.",
      recommendation: "Priorizar alertas criticos antes de usar o valor como base de decisao comercial.",
      impact: riskScore >= 70 ? "Impacto potencial: +7% a +12% em custo ou prazo." : "Impacto potencial: +3% a +7% em custo ou prazo.",
      confidence: healthCheck?.confidenceScore ?? project.confidence_score ?? 58,
    }))
  }

  const graphRisks = healthCheck?.knowledgeGraph?.derivedRisks ?? []
  for (const [index, risk] of graphRisks.slice(0, 2).entries()) {
    insights.push(buildAdvisorInsight({
      id: `risk-graph-${index}`,
      category: "risk",
      priority: "high",
      title: risk,
      recommendation: "Cruzar este risco com documentos, medicoes e especialidades relacionadas no Knowledge Graph.",
      impact: "Pode aumentar incerteza de preco, prazo ou conformidade.",
      confidence: healthCheck?.confidenceScore ?? 62,
    }))
  }

  for (const [index, alert] of (healthCheck?.alerts ?? []).filter((item) => item.severity === "high").slice(0, 2).entries()) {
    insights.push(buildAdvisorInsight({
      id: `risk-alert-${index}`,
      category: "risk",
      priority: "high",
      title: alert.title,
      recommendation: alert.recommendation,
      impact: "Impacto potencial: decisao tecnica menos fiavel ate o alerta ser resolvido.",
      confidence: healthCheck?.confidenceScore ?? 60,
    }))
  }

  return insights
}
