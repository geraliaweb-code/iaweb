import { getCountryLaborAssumptions } from "../country-intelligence"

export function getLaborReferenceForCountry(country?: string | null) {
  return getCountryLaborAssumptions(country)
}
