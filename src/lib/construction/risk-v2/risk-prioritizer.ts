import { severityScore } from "./risk-classifier"
import type { RiskAssessment } from "./types"

function priorityScore(risk: RiskAssessment) {
  return (
    risk.impact.financialImpactExpected * 0.004 +
    risk.impact.timelineImpactWeeks * 7 +
    risk.impact.confidenceReduction * 5 +
    severityScore(risk.severity) * 1.2
  )
}

export function prioritizeRisks(risks: RiskAssessment[]) {
  return [...risks].sort((left, right) => priorityScore(right) - priorityScore(left))
}
