export type EuropeanDatasetCountry = "Portugal" | "Franca" | "Espanha"

export type EuropeanMaterialCategory =
  | "STRUCTURE"
  | "MASONRY"
  | "ETICS"
  | "PLASTERBOARD"
  | "PAINTING"
  | "FLOORING"
  | "WINDOWS"
  | "HVAC"
  | "ELECTRICAL"
  | "ITED"
  | "SCIE"

export type EuropeanCostSegment = "economic" | "normal" | "premium"
export type EuropeanSupplierType = "manufacturer" | "distributor" | "retailer" | "installer"
export type EuropeanProductivityScenario = "economic" | "normal" | "premium"

export type MaterialDataset = {
  id: string
  country: EuropeanDatasetCountry
  category: EuropeanMaterialCategory
  subcategory: string
  name: string
  brand: string | null
  unit: string
  segment: EuropeanCostSegment
  minCost: number
  avgCost: number
  maxCost: number
}

export type LaborDataset = {
  country: EuropeanDatasetCountry
  specialty: string
  role: string
  unit: string
  productivityRate: number
  minCost: number
  avgCost: number
  maxCost: number
}

export type EquipmentDataset = {
  country: EuropeanDatasetCountry
  equipmentName: string
  dailyCost: number
  weeklyCost: number
  monthlyCost: number
}

export type SupplierDataset = {
  country: EuropeanDatasetCountry
  name: string
  supplierType: EuropeanSupplierType
  website: string | null
  coverageRegion: string
  specialties: string[]
}

export type ProductivityDataset = {
  country: EuropeanDatasetCountry
  specialty: string
  unit: string
  productivityRate: number
  crewSize: number
  scenario: EuropeanProductivityScenario
}
