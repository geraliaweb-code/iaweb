import type { ConstructionCostDatabaseCountry, ConstructionSupplierRecord } from "./types"
import { normalizeCostDatabaseCountry } from "./types"

export const constructionSupplierSeedV2: ConstructionSupplierRecord[] = [
  { id: "pt-secil", country: "Portugal", supplierName: "Secil", website: "https://www.secil.pt", region: "Portugal", categories: ["Betao", "Cimento"] },
  { id: "pt-cin", country: "Portugal", supplierName: "CIN", website: "https://www.cin.com", region: "Portugal", categories: ["Tinta"] },
  { id: "pt-robbialac", country: "Portugal", supplierName: "Robbialac", website: "https://www.robbialac.pt", region: "Portugal", categories: ["Tinta"] },
  { id: "pt-sika", country: "Portugal", supplierName: "Sika", website: "https://prt.sika.com", region: "Portugal", categories: ["Quimicos", "Impermeabilizacao"] },
  { id: "pt-weber", country: "Portugal", supplierName: "Weber", website: "https://www.pt.weber", region: "Portugal", categories: ["ETICS", "Argamassas"] },
  { id: "pt-pladur", country: "Portugal", supplierName: "Pladur", website: "https://www.pladur.com", region: "Portugal", categories: ["Pladur"] },
  { id: "pt-knauf", country: "Portugal", supplierName: "Knauf", website: "https://www.knauf.pt", region: "Portugal", categories: ["Pladur", "Isolamento"] },
  { id: "pt-cortizo", country: "Portugal", supplierName: "Cortizo", website: "https://www.cortizo.com", region: "Iberia", categories: ["Caixilharia"] },
  { id: "fr-saint-gobain", country: "Franca", supplierName: "Saint-Gobain", website: "https://www.saint-gobain.fr", region: "Franca", categories: ["Vidro", "Pladur", "Isolamento"] },
  { id: "fr-point-p", country: "Franca", supplierName: "Point.P", website: "https://www.pointp.fr", region: "Franca", categories: ["Materiais gerais"] },
  { id: "fr-gedimat", country: "Franca", supplierName: "Gedimat", website: "https://www.gedimat.fr", region: "Franca", categories: ["Materiais gerais"] },
  { id: "fr-knauf", country: "Franca", supplierName: "Knauf", website: "https://www.knauf.fr", region: "Franca", categories: ["Pladur", "Isolamento"] },
  { id: "es-obramat", country: "Espanha", supplierName: "Obramat", website: "https://www.obramat.es", region: "Espanha", categories: ["Materiais gerais"] },
  { id: "es-bigmat", country: "Espanha", supplierName: "BigMat", website: "https://www.bigmat.es", region: "Espanha", categories: ["Materiais gerais"] },
  { id: "es-cortizo", country: "Espanha", supplierName: "Cortizo", website: "https://www.cortizo.com", region: "Espanha", categories: ["Caixilharia"] },
  { id: "es-pladur", country: "Espanha", supplierName: "Pladur", website: "https://www.pladur.com", region: "Espanha", categories: ["Pladur"] },
]

export function listConstructionSuppliersV2(country?: string | null, category?: string | null) {
  const normalizedCountry = normalizeCostDatabaseCountry(country)
  const normalizedCategory = category?.toLowerCase()

  return constructionSupplierSeedV2.filter((supplier) => {
    if (supplier.country !== normalizedCountry) return false
    if (!normalizedCategory) return true
    return supplier.categories.some((item) => item.toLowerCase().includes(normalizedCategory))
  })
}

export function getPreferredConstructionSupplierV2(input: {
  country?: string | null
  category?: string | null
  supplierName?: string | null
}): ConstructionSupplierRecord | null {
  const normalizedCountry = normalizeCostDatabaseCountry(input.country)
  const supplierName = input.supplierName?.toLowerCase()

  if (supplierName) {
    const supplier = constructionSupplierSeedV2.find(
      (item) => item.country === normalizedCountry && item.supplierName.toLowerCase() === supplierName,
    )
    if (supplier) return supplier
  }

  return listConstructionSuppliersV2(normalizedCountry, input.category)[0] ?? null
}

export function getSupplierNamesByCountryV2(country: ConstructionCostDatabaseCountry) {
  return constructionSupplierSeedV2.filter((supplier) => supplier.country === country).map((supplier) => supplier.supplierName)
}
