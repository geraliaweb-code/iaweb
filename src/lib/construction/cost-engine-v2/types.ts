import type { ConstructionDetectedDocument, ConstructionProject } from "../types"
import type { ConstructionCostDatabaseCountry, ConstructionCostScenario } from "../cost-database-v2"

export type ConstructionDetectedElementV2 = {
  id: string
  project_id: string
  detected_document_id: string | null
  element_type: string
  label: string
  quantity: number | null
  unit: string | null
  source_reference: string | null
  confidence_score: number | null
  metadata: Record<string, unknown>
  created_at: string
}

export type ConstructionCostBreakdownInput = {
  projectId?: string
  project?: ConstructionProject
  detectedDocuments?: ConstructionDetectedDocument[]
  detectedElements?: ConstructionDetectedElementV2[]
  scenario?: ConstructionCostScenario
  unlockRatio?: number
}

export type ConstructionSpecialtySeed = {
  specialty: string
  itemName: string
  materialQuery: string
  laborSpecialty: string
  equipmentName?: string
  unit: string
  quantity: number
  confidenceScore: number
}

export type ConstructionCostBreakdownLine = {
  specialty: string
  itemName: string
  materialName: string
  brand: string | null
  supplierName: string | null
  quantity: number
  unit: string
  materialCost: number
  laborRole: string | null
  productivityRate: number | null
  laborCost: number
  equipmentName: string | null
  equipmentCost: number
  subtotal: number
  confidenceScore: number
  scenario: ConstructionCostScenario
  country: ConstructionCostDatabaseCountry
  notes: string[]
}

export type ConstructionCostBreakdownV2 = {
  projectId: string | null
  country: ConstructionCostDatabaseCountry
  scenario: ConstructionCostScenario
  typology: string | null
  areaM2: number | null
  documentsAnalyzed: number
  elementsAnalyzed: number
  items: ConstructionCostBreakdownLine[]
  unlockedItems: ConstructionCostBreakdownLine[]
  lockedItems: ConstructionCostBreakdownLine[]
  totalUnlockedCost: number
  estimatedFullCostRange: {
    min: number
    max: number
  }
  totalEstimatedCost: number
  confidenceScore: number
  engineVersion: "cost-engine-v2"
  warnings: string[]
}

export type LoadedCostBreakdownContext = {
  project: ConstructionProject
  detectedDocuments: ConstructionDetectedDocument[]
  detectedElements: ConstructionDetectedElementV2[]
}
