import type { ConstructionCostBreakdownV2 } from "../cost-engine-v2"
import type { ConstructionDetectedDocument, ConstructionHealthCheckResult, ConstructionProject, ConstructionReportRecord } from "../types"
import type { UnlockedConstructionAnalysis } from "../unlock-engine"

export type ConstructionPdfV2BlockedResponse = {
  blocked: true
  reason: "full_pdf_locked"
  cta: "Desbloquear Análise Completa"
  message: "O PDF Executivo completo está disponível apenas na análise completa."
}

export type ConstructionPdfV2ProjectScores = {
  maturityScore: number
  riskScore: number
  complexityScore: number
  confidenceScore: number
}

export type ConstructionPdfV2Context = {
  project: ConstructionProject
  health: ConstructionHealthCheckResult | null
  scores: ConstructionPdfV2ProjectScores
  detectedDocuments: ConstructionDetectedDocument[]
  costBreakdown: ConstructionCostBreakdownV2
  unlockedAnalysis: UnlockedConstructionAnalysis
  generatedAt: Date
}

export type ConstructionPdfV2File = {
  bytes: Uint8Array
  filename: string
  report: ConstructionReportRecord | null
  warnings: string[]
}

export type ConstructionPdfV2Result =
  | {
      data: ConstructionPdfV2File
      blocked: null
      error: null
    }
  | {
      data: null
      blocked: ConstructionPdfV2BlockedResponse
      error: null
    }
  | {
      data: null
      blocked: null
      error: {
        code: "NOT_FOUND" | "SUPABASE_NOT_CONFIGURED" | "SUPABASE_QUERY_FAILED" | "PDF_GENERATION_FAILED"
        message: string
      }
    }
