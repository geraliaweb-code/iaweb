import type { UnlockedConstructionAnalysis } from "../unlock-engine"
import type { ConstructionPdfV2BlockedResponse } from "./types"

export function getConstructionPdfV2BlockedResponse(): ConstructionPdfV2BlockedResponse {
  return {
    blocked: true,
    reason: "full_pdf_locked",
    cta: "Desbloquear Análise Completa",
    message: "O PDF Executivo completo está disponível apenas na análise completa.",
  }
}

export function canGenerateConstructionPdfV2(unlockedAnalysis: UnlockedConstructionAnalysis) {
  return unlockedAnalysis.accessLevel === "full_unlocked" && unlockedAnalysis.canDownloadFullPdf
}
