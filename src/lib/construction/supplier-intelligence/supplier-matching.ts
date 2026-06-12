import { europeanSuppliers, type EuropeanMaterialCategory, type SupplierDataset } from "../datasets/europe"
import { normalizeSupplierCountry, normalizeSupplierText } from "./supplier-coverage"
import type { SupplierMatchInput } from "./types"

const specialtyAliases: Record<string, EuropeanMaterialCategory[]> = {
  caixilharias: ["WINDOWS"],
  caixilharia: ["WINDOWS"],
  windows: ["WINDOWS"],
  fenetres: ["WINDOWS"],
  pintura: ["PAINTING"],
  peinture: ["PAINTING"],
  etics: ["ETICS"],
  sate: ["ETICS"],
  pladur: ["PLASTERBOARD"],
  plaquiste: ["PLASTERBOARD"],
  pavimentos: ["FLOORING"],
  ceramica: ["FLOORING"],
  avac: ["HVAC"],
  cvc: ["HVAC"],
  eletricidade: ["ELECTRICAL"],
  electricidade: ["ELECTRICAL"],
  electricidad: ["ELECTRICAL"],
  ited: ["ITED"],
  scie: ["SCIE"],
  pci: ["SCIE"],
  estruturas: ["STRUCTURE"],
  estructura: ["STRUCTURE"],
  alvenaria: ["MASONRY"],
  masonry: ["MASONRY"],
}

export function normalizeMaterialCategory(value?: string | null): EuropeanMaterialCategory | null {
  const normalized = normalizeSupplierText(value).toUpperCase()
  const categories: EuropeanMaterialCategory[] = ["STRUCTURE", "MASONRY", "ETICS", "PLASTERBOARD", "PAINTING", "FLOORING", "WINDOWS", "HVAC", "ELECTRICAL", "ITED", "SCIE"]

  return categories.find((category) => category === normalized) ?? null
}

function categoriesFromInput(input: SupplierMatchInput) {
  const categories = new Set<EuropeanMaterialCategory>()
  const category = normalizeMaterialCategory(input.category)
  if (category) categories.add(category)

  const specialty = normalizeSupplierText(input.specialty)
  for (const [alias, mappedCategories] of Object.entries(specialtyAliases)) {
    if (specialty.includes(alias)) mappedCategories.forEach((item) => categories.add(item))
  }

  return Array.from(categories)
}

function supplierMatchesCategory(supplier: SupplierDataset, categories: EuropeanMaterialCategory[]) {
  if (!categories.length) return true
  const specialties = supplier.specialties.map(normalizeSupplierText)
  return categories.some((category) => specialties.includes(normalizeSupplierText(category)))
}

export function matchSuppliers(input: SupplierMatchInput = {}) {
  const country = normalizeSupplierCountry(input.country)
  const categories = categoriesFromInput(input)

  return europeanSuppliers.filter((supplier) => {
    if (supplier.country !== country && supplier.coverageRegion !== "Iberia") return false
    return supplierMatchesCategory(supplier, categories)
  })
}
