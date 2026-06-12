import { buildAdvisorInsight } from "./recommendation-engine"
import type { AdvisorContext, AdvisorInsight } from "./types"

function formatSpecialty(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export function buildCostAdvisorInsights(context: AdvisorContext): AdvisorInsight[] {
  const { costBreakdown, benchmark } = context
  if (!costBreakdown) return []

  const insights: AdvisorInsight[] = []
  const premiumOpportunity = costBreakdown.scenario === "premium"
  const benchmarkAboveAverage = benchmark?.costPosition === "acima_da_media"
  const estimatedSavings = Math.round(costBreakdown.totalEstimatedCost * (premiumOpportunity ? 0.08 : benchmarkAboveAverage ? 0.05 : 0.03))
  const topCostDriver = [...costBreakdown.items].sort((a, b) => b.subtotal - a.subtotal)[0]

  if (topCostDriver) {
    insights.push(buildAdvisorInsight({
      id: "cost-driver-main",
      category: "cost",
      priority: topCostDriver.subtotal > costBreakdown.totalEstimatedCost * 0.25 ? "high" : "medium",
      title: `${formatSpecialty(topCostDriver.specialty)} e o principal driver de custo.`,
      recommendation: `Validar quantidades, fornecedor e alternativa tecnica para ${topCostDriver.itemName}.`,
      impact: `Representa aproximadamente ${Math.round((topCostDriver.subtotal / Math.max(1, costBreakdown.totalEstimatedCost)) * 100)}% do custo estimado.`,
      estimatedSavings,
      confidence: Math.min(costBreakdown.confidenceScore, topCostDriver.confidenceScore),
    }))
  }

  if (benchmarkAboveAverage) {
    const deviation = Math.round(((benchmark.projectCostPerM2 - benchmark.marketCostPerM2Range.medium) / benchmark.marketCostPerM2Range.medium) * 100)
    insights.push(buildAdvisorInsight({
      id: "cost-market-optimization",
      category: "cost",
      priority: deviation >= 12 ? "high" : "medium",
      title: `A obra encontra-se ${Math.abs(deviation)}% acima da media.`,
      recommendation: "Rever especialidades com maior desvio antes de fechar proposta ou adjudicacao.",
      impact: `Potencial de otimizacao estimado entre 4% e 8% do custo total.`,
      estimatedSavings,
      confidence: benchmark.confidenceScore,
    }))
  }

  if (premiumOpportunity) {
    insights.push(buildAdvisorInsight({
      id: "cost-scenario-normal",
      category: "cost",
      priority: "medium",
      title: "Cenario Premium pode estar a inflacionar a estimativa.",
      recommendation: "Considere cenario Normal em vez de Premium para obter uma base executiva mais equilibrada.",
      impact: `Poupanca estimada: ${estimatedSavings.toLocaleString("pt-PT")} EUR.`,
      estimatedSavings,
      confidence: costBreakdown.confidenceScore,
    }))
  }

  return insights
}
