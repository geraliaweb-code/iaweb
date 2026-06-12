import type { DelayRisk, TimelineForecast, TimelineInput } from "./types"

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function month(value: number) {
  return Math.max(1, Math.round(value))
}

export function buildTimelineForecast(input: TimelineInput, expectedWeeks: number, delayRisks: DelayRisk[]): TimelineForecast {
  const confidence = input.confidenceScore ?? input.healthCheck?.confidenceScore ?? input.project?.confidence_score ?? 65
  const maturity = input.maturityScore ?? input.healthCheck?.maturityScore ?? input.project?.maturity_score ?? 60
  const totalDelayWeeks = delayRisks.reduce((total, risk) => total + risk.impactWeeks, 0)
  const spread = clamp((100 - confidence) / 180 + (70 - maturity) / 240, 0.08, 0.42)
  const expectedMonths = expectedWeeks / 4.345
  const bestCaseMonths = expectedMonths * (1 - spread * 0.65)
  const worstCaseMonths = (expectedWeeks + totalDelayWeeks) / 4.345 * (1 + spread)

  return {
    bestCaseMonths: month(bestCaseMonths),
    expectedMonths: month(expectedMonths),
    worstCaseMonths: month(worstCaseMonths),
    confidence: clamp(Math.round(confidence * 0.72 + maturity * 0.18 - totalDelayWeeks * 1.2), 15, 95),
  }
}
