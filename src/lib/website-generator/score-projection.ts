import type { ScoreProjection, WebsiteGeneratorInput } from "./types"

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)))
}

function getBaseCurrentScore(input: WebsiteGeneratorInput) {
  if (typeof input.currentScore === "number" && Number.isFinite(input.currentScore)) {
    return clampScore(input.currentScore)
  }

  const hasWebsite = input.website?.trim().includes(".") ? 1 : 0
  const hasObjective = input.objective.trim().length > 0 ? 1 : 0

  return clampScore(34 + hasWebsite * 16 + hasObjective * 6)
}

export function projectWebsiteScore(input: WebsiteGeneratorInput, templateId: string): ScoreProjection {
  const currentScore = getBaseCurrentScore(input)
  const templateBoost = templateId === "generic" ? 28 : 34
  const automationBoost = input.objective.toLowerCase().includes("funil") ? 8 : 4
  const projectedScore = clampScore(Math.max(76, currentScore + templateBoost + automationBoost))
  const improvementPoints = projectedScore - currentScore

  return {
    currentScore,
    projectedScore,
    improvementPoints,
    improvementPercent: Math.round((improvementPoints / Math.max(1, currentScore)) * 100),
    areas: {
      conversion: clampScore(currentScore + 36),
      credibility: clampScore(currentScore + 42),
      acquisition: clampScore(currentScore + 34),
      automation: clampScore(currentScore + automationBoost + 24),
      mobile: clampScore(currentScore + 38),
    },
  }
}
