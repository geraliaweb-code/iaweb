import {
  normalizeCostDatabaseCountry,
  type ConstructionCostDatabaseCountry,
  type ConstructionCostScenario,
  type ConstructionScenarioRecord,
} from "./types"

export const constructionScenarioSeedV2: ConstructionScenarioRecord[] = [
  { id: "pt-material-quality", country: "Portugal", scenario: "material_quality_multiplier", economic: 0.88, normal: 1, premium: 1.22 },
  { id: "pt-labor-complexity", country: "Portugal", scenario: "labor_complexity_multiplier", economic: 0.92, normal: 1, premium: 1.18 },
  { id: "pt-equipment-availability", country: "Portugal", scenario: "equipment_availability_multiplier", economic: 0.9, normal: 1, premium: 1.15 },
  { id: "fr-material-quality", country: "Franca", scenario: "material_quality_multiplier", economic: 0.92, normal: 1.08, premium: 1.32 },
  { id: "fr-labor-complexity", country: "Franca", scenario: "labor_complexity_multiplier", economic: 1.05, normal: 1.22, premium: 1.42 },
  { id: "fr-equipment-availability", country: "Franca", scenario: "equipment_availability_multiplier", economic: 1.02, normal: 1.18, premium: 1.35 },
  { id: "es-material-quality", country: "Espanha", scenario: "material_quality_multiplier", economic: 0.84, normal: 0.96, premium: 1.18 },
  { id: "es-labor-complexity", country: "Espanha", scenario: "labor_complexity_multiplier", economic: 0.88, normal: 0.98, premium: 1.15 },
  { id: "es-equipment-availability", country: "Espanha", scenario: "equipment_availability_multiplier", economic: 0.86, normal: 0.96, premium: 1.12 },
]

export function listConstructionScenariosV2(country?: string | null) {
  const normalizedCountry = normalizeCostDatabaseCountry(country)
  return constructionScenarioSeedV2.filter((scenario) => scenario.country === normalizedCountry)
}

export function getConstructionScenarioMultiplierV2(input: {
  country?: string | null
  scenario: string
  tier?: ConstructionCostScenario
}) {
  const country = normalizeCostDatabaseCountry(input.country)
  const tier = input.tier ?? "normal"
  const record = constructionScenarioSeedV2.find((scenario) => scenario.country === country && scenario.scenario === input.scenario)

  if (!record) return 1
  return record[tier]
}

export function getScenarioTiersV2(country: ConstructionCostDatabaseCountry) {
  return {
    country,
    tiers: ["economic", "normal", "premium"] as ConstructionCostScenario[],
    records: listConstructionScenariosV2(country),
  }
}
