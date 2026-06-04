import { getConstructionCountryProfile } from "./country-profile"

export function getCountrySupplierDirectory(country?: string | null) {
  const profile = getConstructionCountryProfile(country)
  return profile.suppliers.map((supplier) => ({
    name: supplier,
    country: profile.id,
    category: "materials_reference",
    verified: false,
  }))
}
