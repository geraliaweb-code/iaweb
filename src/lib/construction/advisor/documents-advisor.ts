import { buildAdvisorInsight } from "./recommendation-engine"
import type { AdvisorContext, AdvisorInsight } from "./types"

function confidenceTarget(current: number, missingCount: number) {
  return Math.min(94, current + Math.min(18, missingCount * 7))
}

export function buildDocumentsAdvisorInsights(context: AdvisorContext): AdvisorInsight[] {
  const { healthCheck, project } = context
  const missingDocuments = healthCheck?.missingCriticalDocuments ?? []
  const currentConfidence = healthCheck?.confidenceScore ?? project.confidence_score ?? 0
  const targetConfidence = confidenceTarget(currentConfidence, missingDocuments.length)
  const insights: AdvisorInsight[] = []

  if (missingDocuments.length) {
    insights.push(buildAdvisorInsight({
      id: "documents-missing-critical",
      category: "documents",
      priority: missingDocuments.length >= 3 ? "high" : "medium",
      title: `${missingDocuments.length} documento(s) critico(s) em falta.`,
      recommendation: `Adicionar ${missingDocuments.slice(0, 2).join(" e ")}${missingDocuments.length > 2 ? " primeiro." : "."}`,
      impact: `Confianca pode subir de ${currentConfidence}% para ${targetConfidence}%.`,
      confidence: Math.max(55, currentConfidence),
    }))
  }

  if (currentConfidence > 0 && currentConfidence < 76) {
    insights.push(buildAdvisorInsight({
      id: "documents-confidence-boost",
      category: "documents",
      priority: "medium",
      title: "Confianca documental ainda abaixo do ideal executivo.",
      recommendation: "Adicionar Mapa de Quantidades, projeto AVAC ou caderno de encargos conforme aplicavel.",
      impact: `Potencial de melhoria: +${Math.max(0, targetConfidence - currentConfidence)} pontos de confianca.`,
      confidence: currentConfidence,
    }))
  }

  return insights
}
