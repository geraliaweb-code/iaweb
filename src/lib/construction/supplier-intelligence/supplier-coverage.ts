import { europeanSuppliers, type EuropeanDatasetCountry, type SupplierDataset } from "../datasets/europe"

export function normalizeSupplierCountry(value?: string | null): EuropeanDatasetCountry {
  const normalized = (value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

  if (normalized.includes("france") || normalized.includes("franca") || normalized.includes("franca")) return "Franca"
  if (normalized.includes("spain") || normalized.includes("esp")) return "Espanha"
  return "Portugal"
}

export function normalizeSupplierText(value?: string | null) {
  return (value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()
}

export function getSupplierId(supplier: SupplierDataset) {
  const slug = normalizeSupplierText(supplier.name).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  const country = supplier.country === "Franca" ? "fr" : supplier.country === "Espanha" ? "es" : "pt"
  return `${country}-${slug}`
}

function regionCountries(region: string, supplierCountry: EuropeanDatasetCountry): EuropeanDatasetCountry[] {
  const normalized = normalizeSupplierText(region)
  if (normalized.includes("iberia")) return ["Portugal", "Espanha"]
  if (normalized.includes("europe")) return ["Portugal", "Franca", "Espanha"]
  return [supplierCountry]
}

export function resolveSupplierCoverage(supplierId?: string | null) {
  const supplier = supplierId ? europeanSuppliers.find((item) => getSupplierId(item) === supplierId) : null
  const suppliers = supplier ? [supplier] : europeanSuppliers
  const countries = new Set<EuropeanDatasetCountry>()
  const regions = new Set<string>()

  for (const item of suppliers) {
    regions.add(item.coverageRegion)
    for (const country of regionCountries(item.coverageRegion, item.country)) {
      countries.add(country)
    }
  }

  return {
    countries: Array.from(countries),
    regions: Array.from(regions),
  }
}
