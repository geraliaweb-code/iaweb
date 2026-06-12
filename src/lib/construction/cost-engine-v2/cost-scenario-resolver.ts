import type { ConstructionDetectedDocument, ConstructionProject } from "../types"
import type { ConstructionCostScenario } from "../cost-database-v2"

function averageDocumentConfidence(documents: ConstructionDetectedDocument[]) {
  if (!documents.length) return 0
  return documents.reduce((total, document) => total + (document.confidence_score ?? 0), 0) / documents.length
}

export function resolveConstructionCostScenarioV2(input: {
  project: ConstructionProject
  detectedDocuments?: ConstructionDetectedDocument[]
  requestedScenario?: ConstructionCostScenario
}): ConstructionCostScenario {
  if (input.requestedScenario) return input.requestedScenario

  const confidence = averageDocumentConfidence(input.detectedDocuments ?? [])
  const area = input.project.estimated_area_m2 ?? 0

  if (area >= 1500 || confidence >= 82) return "premium"
  if (confidence > 0 && confidence < 55) return "economic"
  return "normal"
}

export function resolveUnlockedRatioV2(input?: { unlockRatio?: number; documentsFound?: number }) {
  if (typeof input?.unlockRatio === "number" && Number.isFinite(input.unlockRatio)) {
    return Math.max(0.2, Math.min(0.3, input.unlockRatio))
  }

  if ((input?.documentsFound ?? 0) >= 4) return 0.3
  return 0.25
}
