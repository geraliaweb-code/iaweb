import type { CostForecastInput, DelayCostImpact } from "./types"

function roundCurrency(value: number) {
  return Math.round(value)
}

export function delayWeeksToCostPercent(weeks: number) {
  return Math.max(0, Math.round(weeks * 0.5 * 10) / 10)
}

export function buildDelayCostImpacts(input: CostForecastInput, currentCost: number): DelayCostImpact[] {
  const timelineRisks = input.timeline?.delayRisks.map((risk) => ({
    title: risk.title,
    delayWeeks: risk.impactWeeks,
  })) ?? []
  const riskReportRisks = input.riskReport?.topTimelineRisks.map((risk) => ({
    title: risk.title,
    delayWeeks: risk.impactWeeks,
  })) ?? []
  const procurementRisks = input.procurementPlan?.criticalItems.slice(0, 3).map((item) => ({
    title: `Atraso procurement: ${item.material}`,
    delayWeeks: item.risk === "critical" ? 5 : 3,
  })) ?? []

  const seen = new Set<string>()
  return [...timelineRisks, ...riskReportRisks, ...procurementRisks]
    .filter((risk) => {
      const key = risk.title.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .map((risk) => {
      const impactPercent = delayWeeksToCostPercent(risk.delayWeeks)
      return {
        ...risk,
        impactPercent,
        impact: roundCurrency(currentCost * (impactPercent / 100)),
      }
    })
    .sort((left, right) => right.impact - left.impact)
    .slice(0, 6)
}
