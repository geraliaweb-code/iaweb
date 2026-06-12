import {
  estimateConstructionEquipmentCostV2,
  estimateConstructionLaborCostV2,
  estimateMaterialCostV2,
  getConstructionScenarioMultiplierV2,
  normalizeCostDatabaseCountry,
  roundCurrency,
} from "../cost-database-v2"
import type { ConstructionCostBreakdownLine, ConstructionSpecialtySeed } from "./types"
import type { ConstructionCostScenario } from "../cost-database-v2"

function resolveLocalizedLaborSpecialty(country: string, specialty: string) {
  const normalized = country.toLowerCase()

  if (normalized === "franca") {
    if (specialty === "Estruturas") return "Structures"
    if (specialty === "Pintura") return "Peinture interieure"
    if (specialty === "Pladur") return "Plaquiste"
  }

  if (normalized === "espanha") {
    if (specialty === "Estruturas") return "Estructuras"
    if (specialty === "Pintura") return "Pintura interior"
  }

  return specialty
}

function resolveLocalizedEquipmentName(country: string, equipmentName?: string) {
  if (!equipmentName) return undefined

  const normalized = country.toLowerCase()

  if (normalized === "franca" && equipmentName.includes("Bombagem")) return "Pompage beton"
  if (normalized === "espanha" && equipmentName.includes("Bombagem")) return "Bombeo de hormigon"
  if (normalized === "franca" && equipmentName.includes("Andaime")) return "Echafaudage mobile interieur"
  if (normalized === "espanha" && equipmentName.includes("Andaime")) return "Andamio movil interior"

  return equipmentName
}

export function generateSpecialtyCostLineV2(input: {
  country?: string | null
  seed: ConstructionSpecialtySeed
  scenario: ConstructionCostScenario
}): ConstructionCostBreakdownLine {
  const country = normalizeCostDatabaseCountry(input.country)
  const seed = input.seed
  const material = estimateMaterialCostV2({
    country,
    query: seed.materialQuery,
    quantity: seed.quantity,
    scenario: input.scenario,
  })
  const labor = estimateConstructionLaborCostV2({
    country,
    specialty: resolveLocalizedLaborSpecialty(country, seed.specialty),
    quantity: seed.quantity,
  })
  const equipmentName = resolveLocalizedEquipmentName(country, seed.equipmentName)
  const equipment = equipmentName
    ? estimateConstructionEquipmentCostV2({
        country,
        equipmentName,
        days: labor?.estimatedDays ?? 1,
      })
    : null
  const laborMultiplier = getConstructionScenarioMultiplierV2({
    country,
    scenario: "labor_complexity_multiplier",
    tier: input.scenario,
  })
  const equipmentMultiplier = getConstructionScenarioMultiplierV2({
    country,
    scenario: "equipment_availability_multiplier",
    tier: input.scenario,
  })
  const materialCost = material?.subtotal ?? 0
  const laborCost = roundCurrency((labor?.subtotal ?? 0) * laborMultiplier)
  const equipmentCost = roundCurrency((equipment?.subtotal ?? 0) * equipmentMultiplier)
  const subtotal = roundCurrency(materialCost + laborCost + equipmentCost)

  return {
    specialty: seed.specialty,
    itemName: seed.itemName,
    materialName: material?.material.materialName ?? seed.materialQuery,
    brand: material?.material.brand ?? null,
    supplierName: material?.material.supplierName ?? null,
    quantity: seed.quantity,
    unit: material?.material.unit ?? seed.unit,
    materialCost,
    laborRole: labor?.labor.specialty ?? null,
    productivityRate: labor?.labor.productivityPerDay ?? null,
    laborCost,
    equipmentName: equipment?.equipment.equipmentName ?? null,
    equipmentCost,
    subtotal,
    confidenceScore: seed.confidenceScore,
    scenario: input.scenario,
    country,
    notes: [
      material ? "Material ligado a Cost Database V2." : "Material nao encontrado; subtotal parcial.",
      labor ? "Mao de obra calculada por produtividade diaria." : "Mao de obra preparada, mas sem regra local encontrada.",
      equipment ? "Equipamento calculado por periodo estimado." : "Equipamento nao aplicavel ou ainda sem regra.",
    ],
  }
}

export function generateSpecialtyCostLinesV2(input: {
  country?: string | null
  seeds: ConstructionSpecialtySeed[]
  scenario: ConstructionCostScenario
}) {
  return input.seeds.map((seed) => generateSpecialtyCostLineV2({ country: input.country, seed, scenario: input.scenario }))
}
