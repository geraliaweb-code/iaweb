import type { ConstructionTechnicalCountry } from "../types"
import type { ConstructionCostSegment } from "./categories"

export type ConstructionCostDatabaseDimension =
  | "materials"
  | "brands"
  | "suppliers"
  | "equipment"
  | "productivity"
  | "labor"
  | "countryCosts"

export type ConstructionIndicativeCostRecord = {
  country: ConstructionTechnicalCountry
  segment: ConstructionCostSegment
  specialty: string
  itemCode: string
  itemName: string
  materialType?: string
  brandOrEquivalent?: string
  supplierReference?: string
  equipmentType?: string
  productivityUnit?: string
  productivityRange?: [number, number]
  laborRole?: string
  laborHoursRange?: [number, number]
  unit: string
  indicativeUnitCostRange: [number, number]
  currency: "EUR"
  sourceType: "manual_seed" | "supplier_quote" | "public_reference" | "market_observation"
  confidenceScore: number
}

export const constructionCostDatabaseCountries: ConstructionTechnicalCountry[] = ["portugal", "france", "spain"]
export const constructionCostDatabaseSegments: ConstructionCostSegment[] = ["economic", "normal", "premium"]

export const constructionCostDatabaseDimensions: ConstructionCostDatabaseDimension[] = [
  "materials",
  "brands",
  "suppliers",
  "equipment",
  "productivity",
  "labor",
  "countryCosts",
]

export const constructionIndicativeCostDisclaimer =
  "Valores indicativos por faixa. Nao representam preco exato e devem ser validados com medicoes, fornecedores e contexto local."
