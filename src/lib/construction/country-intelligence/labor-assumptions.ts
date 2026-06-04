import { getConstructionCountryProfile } from "./country-profile"

export function getCountryLaborAssumptions(country?: string | null) {
  const profile = getConstructionCountryProfile(country)
  return {
    country: profile.id,
    roles: profile.laborContext,
    note: "Custos de mao de obra variam por regiao, disponibilidade, especialidade e fase de mercado.",
  }
}
