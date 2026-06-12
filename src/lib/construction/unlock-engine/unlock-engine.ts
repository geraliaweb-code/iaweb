import { buildUnlockedPreviewFromBreakdown } from "./preview-builder"
import type { ConstructionUnlockInput, UnlockedConstructionAnalysis } from "./types"

export function buildUnlockedConstructionAnalysis(input: ConstructionUnlockInput): UnlockedConstructionAnalysis {
  return buildUnlockedPreviewFromBreakdown(input)
}
