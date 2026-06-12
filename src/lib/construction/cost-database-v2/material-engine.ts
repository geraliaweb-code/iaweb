import {
  getScenarioPrice,
  normalizeCostDatabaseCountry,
  roundCurrency,
  type ConstructionCostScenario,
  type ConstructionLineItemEstimate,
  type ConstructionMaterialRecord,
} from "./types"
import { estimateConstructionEquipmentCostV2 } from "./equipment-engine"
import { estimateConstructionLaborCostV2 } from "./labor-engine"

export const constructionMaterialSeedV2: ConstructionMaterialRecord[] = [
  { id: "pt-betao-c30-37", country: "Portugal", category: "Betao", subcategory: "Estruturas", materialName: "Betao C30/37", brand: "Secil", unit: "m3", economicPrice: 105, normalPrice: 116.67, premiumPrice: 132, supplierName: "Secil" },
  { id: "pt-aco-a500", country: "Portugal", category: "Aco", subcategory: "Estruturas", materialName: "Aco A500 NR", brand: null, unit: "kg", economicPrice: 0.92, normalPrice: 1.08, premiumPrice: 1.28, supplierName: "Sika" },
  { id: "pt-tijolo-ceramico", country: "Portugal", category: "Tijolo", subcategory: "Alvenaria", materialName: "Tijolo ceramico 30x20x11", brand: null, unit: "un", economicPrice: 0.38, normalPrice: 0.48, premiumPrice: 0.62, supplierName: "BigMat Portugal" },
  { id: "pt-pladur-ba13", country: "Portugal", category: "Pladur", subcategory: "Interiores", materialName: "Placa gesso laminado BA13", brand: "Pladur", unit: "m2", economicPrice: 4.2, normalPrice: 5.4, premiumPrice: 7.2, supplierName: "Pladur" },
  { id: "pt-knauf-hidrofuga", country: "Portugal", category: "Pladur", subcategory: "Interiores", materialName: "Placa gesso laminado hidrofuga", brand: "Knauf", unit: "m2", economicPrice: 6.1, normalPrice: 7.6, premiumPrice: 9.5, supplierName: "Knauf" },
  { id: "pt-etics-weber", country: "Portugal", category: "ETICS", subcategory: "Fachadas", materialName: "Sistema ETICS EPS 60 mm", brand: "Weber", unit: "m2", economicPrice: 27, normalPrice: 34, premiumPrice: 44, supplierName: "Weber" },
  { id: "pt-cin-vinylmatt", country: "Portugal", category: "Tinta", subcategory: "Pintura interior", materialName: "Tinta interior mate", brand: "CIN", unit: "l", economicPrice: 8.4, normalPrice: 10.28, premiumPrice: 13.2, supplierName: "CIN" },
  { id: "pt-robbialac-mate", country: "Portugal", category: "Tinta", subcategory: "Pintura interior", materialName: "Tinta interior mate", brand: "Robbialac", unit: "l", economicPrice: 7.9, normalPrice: 9.8, premiumPrice: 12.5, supplierName: "Robbialac" },
  { id: "pt-cortizo-aluminio", country: "Portugal", category: "Caixilharia", subcategory: "Aluminio", materialName: "Sistema aluminio ruptura termica", brand: "Cortizo", unit: "m2", economicPrice: 185, normalPrice: 240, premiumPrice: 330, supplierName: "Cortizo" },
  { id: "pt-pavimento-ceramico", country: "Portugal", category: "Pavimentos", subcategory: "Ceramico", materialName: "Pavimento ceramico medio formato", brand: null, unit: "m2", economicPrice: 12, normalPrice: 22, premiumPrice: 38, supplierName: "BigMat Portugal" },
  { id: "fr-beton-c30-37", country: "Franca", category: "Betao", subcategory: "Structures", materialName: "Beton C30/37", brand: "Saint-Gobain", unit: "m3", economicPrice: 118, normalPrice: 136, premiumPrice: 158, supplierName: "Point.P" },
  { id: "fr-knauf-ba13", country: "Franca", category: "Pladur", subcategory: "Interieurs", materialName: "Plaque de platre BA13", brand: "Knauf", unit: "m2", economicPrice: 5.2, normalPrice: 6.8, premiumPrice: 9.4, supplierName: "Knauf" },
  { id: "fr-etics-saint-gobain", country: "Franca", category: "ETICS", subcategory: "Facades", materialName: "Isolation thermique exterieure EPS 60 mm", brand: "Saint-Gobain", unit: "m2", economicPrice: 34, normalPrice: 43, premiumPrice: 56, supplierName: "Point.P" },
  { id: "fr-peinture-mate", country: "Franca", category: "Tinta", subcategory: "Peinture interieure", materialName: "Peinture interieure mate", brand: "Saint-Gobain", unit: "l", economicPrice: 9.8, normalPrice: 12.4, premiumPrice: 16.2, supplierName: "Gedimat" },
  { id: "es-hormigon-c30-37", country: "Espanha", category: "Betao", subcategory: "Estructuras", materialName: "Hormigon C30/37", brand: null, unit: "m3", economicPrice: 98, normalPrice: 112, premiumPrice: 130, supplierName: "Obramat" },
  { id: "es-pladur-ba13", country: "Espanha", category: "Pladur", subcategory: "Interiores", materialName: "Placa yeso laminado BA13", brand: "Pladur", unit: "m2", economicPrice: 4, normalPrice: 5.2, premiumPrice: 7, supplierName: "Pladur" },
  { id: "es-cortizo-aluminio", country: "Espanha", category: "Caixilharia", subcategory: "Aluminio", materialName: "Sistema aluminio rotura puente termico", brand: "Cortizo", unit: "m2", economicPrice: 170, normalPrice: 225, premiumPrice: 305, supplierName: "Cortizo" },
  { id: "es-pavimento-ceramico", country: "Espanha", category: "Pavimentos", subcategory: "Ceramico", materialName: "Pavimento ceramico medio formato", brand: null, unit: "m2", economicPrice: 10, normalPrice: 19, premiumPrice: 34, supplierName: "BigMat" },
]

function normalizeText(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

export function listConstructionMaterialsV2(country?: string | null, category?: string | null) {
  const normalizedCountry = normalizeCostDatabaseCountry(country)
  const normalizedCategory = category ? normalizeText(category) : null

  return constructionMaterialSeedV2.filter((material) => {
    if (material.country !== normalizedCountry) return false
    if (!normalizedCategory) return true
    return normalizeText(material.category).includes(normalizedCategory)
  })
}

export function findConstructionMaterialV2(input: {
  country?: string | null
  query: string
  brand?: string | null
}) {
  const normalizedCountry = normalizeCostDatabaseCountry(input.country)
  const query = normalizeText(input.query)
  const brand = input.brand ? normalizeText(input.brand) : null

  return constructionMaterialSeedV2.find((material) => {
    if (material.country !== normalizedCountry) return false
    if (brand && normalizeText(material.brand ?? "") !== brand) return false

    const searchable = normalizeText(`${material.category} ${material.subcategory} ${material.materialName} ${material.brand ?? ""}`)
    return searchable.includes(query) || query.includes(normalizeText(material.category))
  }) ?? null
}

export function estimateMaterialCostV2(input: {
  country?: string | null
  query: string
  quantity: number
  scenario?: ConstructionCostScenario
  brand?: string | null
}) {
  const scenario = input.scenario ?? "normal"
  const material = findConstructionMaterialV2(input)

  if (!material) return null

  const unitPrice = getScenarioPrice(material, scenario)

  return {
    material,
    unitPrice,
    quantity: input.quantity,
    subtotal: roundCurrency(unitPrice * input.quantity),
    scenario,
  }
}

export function buildPreparedLineItemEstimateV2(input: {
  label: string
  quantity: number
  unit: string
  scenario?: ConstructionCostScenario
  materialCost?: number
  supplierName?: string | null
  laborCost?: number
  equipmentCost?: number
  notes?: string[]
}): ConstructionLineItemEstimate {
  const materialCost = input.materialCost ?? 0
  const laborCost = input.laborCost ?? 0
  const equipmentCost = input.equipmentCost ?? 0

  return {
    label: input.label,
    quantity: input.quantity,
    unit: input.unit,
    materialCost,
    supplierName: input.supplierName ?? null,
    laborCost,
    equipmentCost,
    subtotal: roundCurrency(materialCost + laborCost + equipmentCost),
    scenario: input.scenario ?? "normal",
    notes: input.notes ?? [],
  }
}

export function prepareConstructionCostBreakdownV2(input: {
  country?: string | null
  materialQuery: string
  quantity: number
  unit: string
  scenario?: ConstructionCostScenario
  laborSpecialty?: string
  equipmentName?: string
  equipmentDays?: number
}) {
  const material = estimateMaterialCostV2({
    country: input.country,
    query: input.materialQuery,
    quantity: input.quantity,
    scenario: input.scenario,
  })
  const labor = input.laborSpecialty
    ? estimateConstructionLaborCostV2({
        country: input.country,
        specialty: input.laborSpecialty,
        quantity: input.quantity,
      })
    : null
  const equipment = input.equipmentName
    ? estimateConstructionEquipmentCostV2({
        country: input.country,
        equipmentName: input.equipmentName,
        days: input.equipmentDays ?? labor?.estimatedDays ?? 1,
      })
    : null

  return buildPreparedLineItemEstimateV2({
    label: input.materialQuery,
    quantity: input.quantity,
    unit: input.unit,
    scenario: input.scenario,
    materialCost: material?.subtotal ?? 0,
    supplierName: material?.material.supplierName ?? null,
    laborCost: labor?.subtotal ?? 0,
    equipmentCost: equipment?.subtotal ?? 0,
    notes: [
      material ? `Material: ${material.material.materialName}` : "Material ainda nao encontrado na base V2.",
      labor ? `Produtividade: ${labor.labor.productivityPerDay} ${labor.labor.unit}/dia.` : "Mao de obra preparada para associacao futura.",
      equipment ? `Equipamento: ${equipment.equipment.equipmentName}.` : "Equipamentos preparados para associacao futura.",
    ],
  })
}
