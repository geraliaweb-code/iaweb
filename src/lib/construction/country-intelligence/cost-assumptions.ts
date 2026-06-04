import { getConstructionCountryProfile } from "./country-profile"

export function getCountryCostAssumptions(country?: string | null) {
  const profile = getConstructionCountryProfile(country)
  return {
    country: profile.id,
    currency: profile.currency,
    marketReference: profile.publicSources.slice(0, 4),
    suppliers: profile.suppliers,
    note: "Assumptions V1 sao referenciais e devem ser validadas com fornecedores e profissionais locais.",
  }
}
