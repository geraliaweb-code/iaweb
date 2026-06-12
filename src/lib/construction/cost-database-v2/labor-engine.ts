import { normalizeCostDatabaseCountry, roundCurrency, type ConstructionLaborRecord } from "./types"

export const constructionLaborSeedV2: ConstructionLaborRecord[] = [
  { id: "pt-labor-betao", country: "Portugal", specialty: "Estruturas - betonagem", unit: "m3", productivityPerDay: 8, hourRate: 18, dailyRate: 144 },
  { id: "pt-labor-pintura", country: "Portugal", specialty: "Pintura interior", unit: "m2", productivityPerDay: 75, hourRate: 15, dailyRate: 120 },
  { id: "pt-labor-pladur", country: "Portugal", specialty: "Pladur", unit: "m2", productivityPerDay: 28, hourRate: 17, dailyRate: 136 },
  { id: "pt-labor-etics", country: "Portugal", specialty: "ETICS", unit: "m2", productivityPerDay: 18, hourRate: 18, dailyRate: 144 },
  { id: "fr-labor-beton", country: "Franca", specialty: "Structures - beton", unit: "m3", productivityPerDay: 7, hourRate: 28, dailyRate: 224 },
  { id: "fr-labor-peinture", country: "Franca", specialty: "Peinture interieure", unit: "m2", productivityPerDay: 70, hourRate: 25, dailyRate: 200 },
  { id: "fr-labor-plaquiste", country: "Franca", specialty: "Plaquiste", unit: "m2", productivityPerDay: 26, hourRate: 27, dailyRate: 216 },
  { id: "es-labor-hormigon", country: "Espanha", specialty: "Estructuras - hormigon", unit: "m3", productivityPerDay: 8, hourRate: 19, dailyRate: 152 },
  { id: "es-labor-pintura", country: "Espanha", specialty: "Pintura interior", unit: "m2", productivityPerDay: 78, hourRate: 16, dailyRate: 128 },
  { id: "es-labor-pladur", country: "Espanha", specialty: "Pladur", unit: "m2", productivityPerDay: 30, hourRate: 17, dailyRate: 136 },
]

function normalizeText(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

export function findConstructionLaborV2(input: { country?: string | null; specialty: string }) {
  const country = normalizeCostDatabaseCountry(input.country)
  const specialty = normalizeText(input.specialty)

  return constructionLaborSeedV2.find((record) => {
    const searchable = normalizeText(record.specialty)
    return record.country === country && (searchable.includes(specialty) || specialty.includes(searchable.split(" ")[0]))
  }) ?? null
}

export function estimateConstructionLaborCostV2(input: {
  country?: string | null
  specialty: string
  quantity: number
}) {
  const labor = findConstructionLaborV2(input)

  if (!labor) return null

  const days = labor.productivityPerDay > 0 ? input.quantity / labor.productivityPerDay : 0
  const subtotal = roundCurrency(days * labor.dailyRate)

  return {
    labor,
    quantity: input.quantity,
    estimatedDays: roundCurrency(days),
    subtotal,
  }
}
