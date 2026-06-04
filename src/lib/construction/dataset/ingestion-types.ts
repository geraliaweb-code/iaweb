export type ConstructionDatasetCountry = "Portugal" | "Franca" | "Espanha" | "Europa"

export type ConstructionReviewedStatus = "pending" | "approved" | "rejected"

export type ConstructionSourceType =
  | "public_procurement_portal"
  | "open_data_portal"
  | "municipal_tender"
  | "public_tender_document"
  | "manual_seed"

export type ConstructionSourceReference = {
  country: ConstructionDatasetCountry
  sourceName: string
  sourceUrl: string
  sourceType: ConstructionSourceType
  capturedAt: string | null
  licenseNotes: string
  confidenceScore: number
  reviewedStatus: ConstructionReviewedStatus
}

export type ConstructionDatasetItem<TPayload extends Record<string, unknown> = Record<string, unknown>> =
  ConstructionSourceReference & {
    itemType: string
    rawPayload: Record<string, unknown>
    normalizedPayload: TPayload
  }

export type ConstructionTypologySeed = {
  id: string
  label: string
  description: string
  typicalAreaBandM2: [number, number]
  complexityBaseline: number
}

export type ConstructionDocumentTaxonomySeed = {
  country: ConstructionDatasetCountry
  documentType: string
  specialty: string
  aliases: string[]
  criticality: "critical" | "important" | "recommended"
  typicalExtensions: string[]
}

export type ConstructionElementSeed = {
  code: string
  family: string
  label: string
  unit: string
  keywords: string[]
}

export type ConstructionCostReferenceSeed = {
  country: ConstructionDatasetCountry
  projectType: string
  minEuroM2: number
  maxEuroM2: number
  source: "manual_seed"
  notes: string
}

export type ConstructionScheduleReferenceSeed = {
  projectType: string
  minMonths: number
  maxMonths: number
  source: "manual_seed"
  notes: string
}

export type ConstructionRiskReferenceSeed = {
  riskType: string
  title: string
  severity: "low" | "medium" | "high"
  trigger: string
  recommendation: string
}
