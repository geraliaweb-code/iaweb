import type { AdvisorInsight, AdvisorInsightCategory, AdvisorInsightPriority } from "./types"

const priorityRank: Record<AdvisorInsightPriority, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
}

const categoryRank: Record<AdvisorInsightCategory, number> = {
  risk: 4,
  cost: 3,
  documents: 2,
  benchmark: 1,
}

export function clampAdvisorConfidence(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)))
}

export function buildAdvisorInsight(input: AdvisorInsight): AdvisorInsight {
  return {
    ...input,
    confidence: clampAdvisorConfidence(input.confidence),
  }
}

export function sortAdvisorInsights(insights: AdvisorInsight[]) {
  return [...insights].sort((a, b) => {
    const priorityDelta = priorityRank[b.priority] - priorityRank[a.priority]
    if (priorityDelta) return priorityDelta

    const savingsDelta = (b.estimatedSavings ?? 0) - (a.estimatedSavings ?? 0)
    if (savingsDelta) return savingsDelta

    return categoryRank[b.category] - categoryRank[a.category]
  })
}

export function uniqueAdvisorInsights(insights: AdvisorInsight[]) {
  const seen = new Set<string>()
  return insights.filter((insight) => {
    const key = `${insight.category}:${insight.title}:${insight.recommendation}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
