import { buildDelayCostImpacts } from "./delay-cost-engine"
import { buildForecastSummary } from "./forecast-summary"
import { buildForecastScenarios } from "./scenario-engine"
import type { CostForecastInput, CostForecastOutput, ForecastRisk } from "./types"

function currentCostFrom(input: CostForecastInput) {
  const cost = input.costBreakdownV2
  if (cost?.totalEstimatedCost) return Math.round(cost.totalEstimatedCost)
  if (input.healthCheck?.costEstimate?.estimatedCostMid) return Math.round(input.healthCheck.costEstimate.estimatedCostMid)
  const range = cost?.estimatedFullCostRange ?? {
    min: input.healthCheck?.costEstimate?.estimatedCostMin ?? 0,
    max: input.healthCheck?.costEstimate?.estimatedCostMax ?? 0,
  }
  return Math.round((range.min + range.max) / 2) || 0
}

function buildForecastRisks(input: CostForecastInput, delayImpacts: CostForecastOutput["delayImpacts"]): ForecastRisk[] {
  const delayRisks: ForecastRisk[] = delayImpacts.map((impact) => ({ title: impact.title, source: "timeline", impact: impact.impact }))
  const financialRisks: ForecastRisk[] = input.riskReport?.topFinancialRisks.map((risk) => ({ title: risk.title, source: "risk", impact: risk.impact })) ?? []
  const benchmarkRisks: ForecastRisk[] = input.benchmarkV2?.costPosition === "acima_da_media"
    ? [{ title: "Projeto acima da media do benchmark", source: "benchmark", impact: Math.round(currentCostFrom(input) * 0.035) }]
    : []
  const procurementRisks: ForecastRisk[] = input.procurementPlan?.criticalItems.slice(0, 3).map((item) => ({
    title: `Material critico: ${item.material}`,
    source: "procurement",
    impact: Math.round(item.estimatedCost * 0.08),
  })) ?? []

  return [...financialRisks, ...delayRisks, ...benchmarkRisks, ...procurementRisks]
    .sort((left, right) => right.impact - left.impact)
    .slice(0, 8)
}

function buildRecommendations(input: CostForecastInput, risks: ForecastRisk[]) {
  const recommendations = [
    ...(input.procurementPlan?.criticalItems.length ? [{ title: "Antecipar aquisicao de materiais criticos", expectedReduction: 12 }] : []),
    ...(input.timeline?.delayRisks.length ? [{ title: input.timeline.delayRisks[0].recommendation, expectedReduction: 10 }] : []),
    ...(input.riskReport?.recommendations[0] ? [{ title: input.riskReport.recommendations[0].title, expectedReduction: input.riskReport.recommendations[0].expectedFinancialReductionPercent }] : []),
    ...(input.benchmarkV2?.costPosition === "acima_da_media" ? [{ title: "Rever rubricas acima do benchmark antes de adjudicar", expectedReduction: 8 }] : []),
    ...(input.constructionOS?.nextBestActions[0] ? [{ title: input.constructionOS.nextBestActions[0].title, expectedReduction: 6 }] : []),
  ]
  const fallback = risks[0] ? [{ title: `Reduzir exposicao: ${risks[0].title}`, expectedReduction: 5 }] : []
  const seen = new Set<string>()
  return [...recommendations, ...fallback].filter((recommendation) => {
    if (seen.has(recommendation.title)) return false
    seen.add(recommendation.title)
    return true
  }).slice(0, 6)
}

export function generateConstructionCostForecast(input: CostForecastInput): CostForecastOutput {
  const currentCost = currentCostFrom(input)
  const delayImpacts = buildDelayCostImpacts(input, currentCost)
  const scenarios = buildForecastScenarios(input, currentCost, delayImpacts)
  const bestCase = scenarios.find((scenario) => scenario.label === "best_case")?.amount ?? currentCost
  const expectedCase = scenarios.find((scenario) => scenario.label === "expected_case")?.amount ?? currentCost
  const worstCase = scenarios.find((scenario) => scenario.label === "worst_case")?.amount ?? currentCost
  const forecastRisks = buildForecastRisks(input, delayImpacts)
  const outputWithoutSummary = {
    currentCost,
    bestCase,
    expectedCase,
    worstCase,
    scenarios,
    costVariation: {
      optimisticDelta: bestCase - currentCost,
      expectedDelta: expectedCase - currentCost,
      pessimisticDelta: worstCase - currentCost,
      benchmarkDeviationPercent: input.benchmarkV2?.specialtyComparisons.find((comparison) => !comparison.isLocked)?.differencePercent ?? null,
    },
    delayImpacts,
    forecastRisks,
    recommendations: buildRecommendations(input, forecastRisks),
  }

  return {
    ...outputWithoutSummary,
    summary: buildForecastSummary(outputWithoutSummary),
  }
}
