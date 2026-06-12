import { getForecastInflationProfile } from "./inflation-engine"
import type { CostForecastInput, DelayCostImpact, ForecastScenario } from "./types"

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function roundCurrency(value: number) {
  return Math.round(value)
}

function benchmarkFactor(input: CostForecastInput) {
  if (!input.benchmarkV2) return 0
  if (input.benchmarkV2.costPosition === "acima_da_media") return 0.035
  if (input.benchmarkV2.costPosition === "abaixo_da_media") return -0.025
  return 0.01
}

function confidenceFactor(input: CostForecastInput) {
  const confidence = input.costBreakdownV2?.confidenceScore ?? input.healthCheck?.confidenceScore ?? input.project?.confidence_score ?? 65
  return clamp((70 - confidence) / 500, -0.025, 0.12)
}

function riskFactor(input: CostForecastInput) {
  const riskScore = input.riskReport?.overallRiskScore ?? input.healthCheck?.riskScore ?? input.project?.risk_score ?? 45
  return clamp((riskScore - 45) / 420, 0, 0.16)
}

function procurementFactor(input: CostForecastInput) {
  const critical = input.procurementPlan?.criticalItems.length ?? 0
  const high = input.procurementPlan?.highPriorityItems.length ?? 0
  return clamp(critical * 0.012 + high * 0.006, 0, 0.09)
}

export function buildForecastScenarios(input: CostForecastInput, currentCost: number, delayImpacts: DelayCostImpact[]): ForecastScenario[] {
  const inflation = getForecastInflationProfile()
  const delayExpected = delayImpacts.slice(0, 2).reduce((total, impact) => total + impact.impactPercent, 0) / 100
  const delayWorst = delayImpacts.reduce((total, impact) => total + impact.impactPercent, 0) / 100
  const sharedUpside = riskFactor(input) + procurementFactor(input) + benchmarkFactor(input) + confidenceFactor(input)
  const expectedVariation = clamp(inflation.normal - 1 + sharedUpside + delayExpected, -0.02, 0.28)
  const worstVariation = clamp(inflation.premium - 1 + sharedUpside * 1.6 + delayWorst, 0.04, 0.45)
  const bestVariation = clamp(inflation.economic - 1 + Math.min(0, benchmarkFactor(input)) - Math.max(0, confidenceFactor(input)) * 0.35, -0.08, 0.08)
  const confidence = input.riskReport ? Math.max(35, 92 - input.riskReport.overallRiskScore) : input.costBreakdownV2?.confidenceScore ?? 62

  return [
    {
      label: "best_case",
      amount: roundCurrency(currentCost * (1 + bestVariation)),
      variationPercent: Math.round(bestVariation * 1000) / 10,
      confidence: clamp(confidence + 8, 0, 95),
    },
    {
      label: "expected_case",
      amount: roundCurrency(currentCost * (1 + expectedVariation)),
      variationPercent: Math.round(expectedVariation * 1000) / 10,
      confidence: clamp(confidence, 0, 95),
    },
    {
      label: "worst_case",
      amount: roundCurrency(currentCost * (1 + worstVariation)),
      variationPercent: Math.round(worstVariation * 1000) / 10,
      confidence: clamp(confidence - 12, 0, 95),
    },
  ]
}
