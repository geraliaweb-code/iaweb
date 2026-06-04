import { normalizeConstructionCountry } from "../country-intelligence"

export function getCountryPriceFactor(country?: string | null) {
  const normalized = normalizeConstructionCountry(country)
  if (normalized === "france") return 1.22
  if (normalized === "spain") return 1.05
  return 1
}
