import type { ActionPriority, NextBestAction, ProjectIntelligenceSnapshot } from "./types"

const priorityWeight: Record<ActionPriority, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
}

function scoreAction(action: NextBestAction) {
  return (
    priorityWeight[action.priority] * 100 +
    action.riskImpact * 2.4 +
    action.financialImpact * 1.8 +
    action.confidenceImpact * 1.5 +
    action.procurementUrgency * 2 +
    action.unlockImpact * 1.2
  )
}

function priorityFromScore(score: number): ActionPriority {
  if (score >= 86) return "critical"
  if (score >= 66) return "high"
  if (score >= 36) return "medium"
  return "low"
}

export function deriveActionPriority(action: Omit<NextBestAction, "priority">, snapshot: ProjectIntelligenceSnapshot): ActionPriority {
  const unlockPenalty = snapshot.unlock.accessLevel === "free_preview" ? action.unlockImpact : 0
  const score = action.riskImpact * 0.32 + action.financialImpact * 0.24 + action.confidenceImpact * 0.18 + action.procurementUrgency * 0.2 + unlockPenalty * 0.12
  return priorityFromScore(score)
}

export function prioritizeActions(actions: NextBestAction[]) {
  return [...actions].sort((left, right) => scoreAction(right) - scoreAction(left))
}
