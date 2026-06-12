import { buildAdvisorInsight } from "./recommendation-engine"
import type { AdvisorContext, AdvisorInsight } from "./types"

export function buildBenchmarkAdvisorInsights(context: AdvisorContext): AdvisorInsight[] {
  const { benchmark } = context
  if (!benchmark) return []

  const insights: AdvisorInsight[] = []
  const deviation = Math.round(((benchmark.projectCostPerM2 - benchmark.marketCostPerM2Range.medium) / benchmark.marketCostPerM2Range.medium) * 100)
  const strongestSpecialtyDeviation = [...benchmark.specialtyComparisons]
    .filter((item) => !item.isLocked)
    .sort((a, b) => Math.abs(b.differencePercent) - Math.abs(a.differencePercent))[0]

  insights.push(buildAdvisorInsight({
    id: "benchmark-market-position",
    category: "benchmark",
    priority: benchmark.costPosition === "acima_da_media" ? "high" : "medium",
    title: `A obra encontra-se ${Math.abs(deviation)}% ${deviation >= 0 ? "acima" : "abaixo"} da media.`,
    recommendation: benchmark.costPosition === "acima_da_media"
      ? "Isolar as especialidades que explicam o desvio antes de negociar fornecedores."
      : "Manter esta base como referencia e validar se nao ha omissoes de escopo.",
    impact: `Custo atual: ${benchmark.projectCostPerM2.toLocaleString("pt-PT")} EUR/m2 vs media ${benchmark.marketCostPerM2Range.medium.toLocaleString("pt-PT")} EUR/m2.`,
    confidence: benchmark.confidenceScore,
  }))

  if (strongestSpecialtyDeviation) {
    insights.push(buildAdvisorInsight({
      id: "benchmark-specialty-deviation",
      category: "benchmark",
      priority: strongestSpecialtyDeviation.differencePercent > 10 ? "high" : "medium",
      title: `${strongestSpecialtyDeviation.specialty} representa o principal desvio.`,
      recommendation: "Comparar quantidade, produtividade e preco unitario desta especialidade com o mercado.",
      impact: `Desvio da especialidade: ${Math.abs(strongestSpecialtyDeviation.differencePercent)}%.`,
      confidence: benchmark.confidenceScore,
    }))
  }

  return insights
}
