import { constructionCountryProfiles, getConstructionCountryProfile } from "./country-profile"

export const constructionCountryDocumentRules = Object.fromEntries(
  Object.values(constructionCountryProfiles).map((profile) => [
    profile.id,
    {
      expectedDocuments: profile.expectedDocuments,
      terminology: profile.technicalTerms,
      missingDocumentImpact: "A ausencia de documentos criticos aumenta risco, reduz maturidade e alarga intervalos de custo/prazo.",
    },
  ]),
)

export function getExpectedDocumentsForCountry(country?: string | null) {
  return getConstructionCountryProfile(country).expectedDocuments
}
