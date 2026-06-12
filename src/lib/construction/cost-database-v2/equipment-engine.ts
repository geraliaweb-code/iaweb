import { normalizeCostDatabaseCountry, roundCurrency, type ConstructionEquipmentRecord } from "./types"

export const constructionEquipmentSeedV2: ConstructionEquipmentRecord[] = [
  { id: "pt-eqp-bombagem", country: "Portugal", equipmentName: "Bombagem de betao", dailyCost: 380, weeklyCost: 1900, monthlyCost: 6800, supplierName: "Secil" },
  { id: "pt-eqp-andaime", country: "Portugal", equipmentName: "Andaime interior movel", dailyCost: 45, weeklyCost: 190, monthlyCost: 620, supplierName: "BigMat Portugal" },
  { id: "pt-eqp-plataforma", country: "Portugal", equipmentName: "Plataforma elevatoria tesoura", dailyCost: 95, weeklyCost: 420, monthlyCost: 1350, supplierName: "Obramat" },
  { id: "fr-eqp-pompage", country: "Franca", equipmentName: "Pompage beton", dailyCost: 460, weeklyCost: 2300, monthlyCost: 8200, supplierName: "Point.P" },
  { id: "fr-eqp-echafaudage", country: "Franca", equipmentName: "Echafaudage mobile interieur", dailyCost: 62, weeklyCost: 260, monthlyCost: 840, supplierName: "Gedimat" },
  { id: "es-eqp-bombeo", country: "Espanha", equipmentName: "Bombeo de hormigon", dailyCost: 340, weeklyCost: 1700, monthlyCost: 6100, supplierName: "Obramat" },
  { id: "es-eqp-andamio", country: "Espanha", equipmentName: "Andamio movil interior", dailyCost: 42, weeklyCost: 175, monthlyCost: 580, supplierName: "BigMat" },
]

function normalizeText(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

export function findConstructionEquipmentV2(input: { country?: string | null; equipmentName: string }) {
  const country = normalizeCostDatabaseCountry(input.country)
  const equipmentName = normalizeText(input.equipmentName)

  return constructionEquipmentSeedV2.find((record) => {
    const searchable = normalizeText(record.equipmentName)
    return record.country === country && (searchable.includes(equipmentName) || equipmentName.includes(searchable.split(" ")[0]))
  }) ?? null
}

export function estimateConstructionEquipmentCostV2(input: {
  country?: string | null
  equipmentName: string
  days: number
}) {
  const equipment = findConstructionEquipmentV2(input)

  if (!equipment) return null

  const fullWeeks = Math.floor(input.days / 5)
  const remainingDays = input.days % 5
  const weeklyCost = fullWeeks * equipment.weeklyCost
  const dailyCost = remainingDays * equipment.dailyCost

  return {
    equipment,
    days: input.days,
    subtotal: roundCurrency(weeklyCost + dailyCost),
  }
}
