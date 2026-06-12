export type ConstructionCostDatabaseCountry = "Portugal" | "Franca" | "Espanha"
export type ConstructionCostScenario = "economic" | "normal" | "premium"

export type ConstructionMaterialRecord = {
  id: string
  country: ConstructionCostDatabaseCountry
  category: string
  subcategory: string
  materialName: string
  brand: string | null
  unit: string
  economicPrice: number
  normalPrice: number
  premiumPrice: number
  supplierName: string | null
}

export type ConstructionLaborRecord = {
  id: string
  country: ConstructionCostDatabaseCountry
  specialty: string
  unit: string
  productivityPerDay: number
  hourRate: number
  dailyRate: number
}

export type ConstructionEquipmentRecord = {
  id: string
  country: ConstructionCostDatabaseCountry
  equipmentName: string
  dailyCost: number
  weeklyCost: number
  monthlyCost: number
  supplierName: string | null
}

export type ConstructionSupplierRecord = {
  id: string
  country: ConstructionCostDatabaseCountry
  supplierName: string
  website: string | null
  region: string | null
  categories: string[]
}

export type ConstructionScenarioRecord = {
  id: string
  country: ConstructionCostDatabaseCountry
  scenario: string
  economic: number
  normal: number
  premium: number
}

export type ConstructionLineItemEstimate = {
  label: string
  quantity: number
  unit: string
  materialCost: number
  supplierName: string | null
  laborCost: number
  equipmentCost: number
  subtotal: number
  scenario: ConstructionCostScenario
  notes: string[]
}

export function normalizeCostDatabaseCountry(value?: string | null): ConstructionCostDatabaseCountry {
  const normalized = (value ?? "").toLowerCase()

  if (normalized === "france" || normalized.includes("fran")) return "Franca"
  if (normalized === "spain" || normalized.includes("esp")) return "Espanha"
  return "Portugal"
}

export function getScenarioPrice(record: ConstructionMaterialRecord, scenario: ConstructionCostScenario) {
  if (scenario === "economic") return record.economicPrice
  if (scenario === "premium") return record.premiumPrice
  return record.normalPrice
}

export function roundCurrency(value: number) {
  return Math.round(value * 100) / 100
}
