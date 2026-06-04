import { getConstructionCountryProfile } from "./country-profile"

export function getCountryRegulatoryContext(country?: string | null) {
  const profile = getConstructionCountryProfile(country)
  return {
    country: profile.id,
    items: profile.regulatoryContext,
    disclaimer: "Contexto regulatorio indicativo; nao substitui validacao por tecnico habilitado.",
  }
}
