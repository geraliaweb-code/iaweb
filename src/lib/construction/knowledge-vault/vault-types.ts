export type ConstructionRetentionPolicy = "30_days" | "90_days" | "180_days" | "manual_review"

export type ConstructionKnowledgeVaultPayload = {
  country: string
  typology: string
  areaM2: number | null
  documentCount: number
  specialtiesDetected: string[]
  risksSummary: Array<{ title: string; severity: string }>
  costScenarios: unknown[]
  scheduleScenario: unknown
  confidenceScore: number | null
  benchmark: unknown
}
