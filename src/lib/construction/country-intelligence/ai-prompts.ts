import type { ConstructionLanguage } from "../i18n"
import { getConstructionCountryProfile } from "./country-profile"

export function buildCountryAwarePrompt(country?: string | null, language: ConstructionLanguage = "pt") {
  const profile = getConstructionCountryProfile(country)
  return [
    `Analisa como especialista tecnico de construcao em ${profile.label}.`,
    `Usa terminologia, documentos, custos, mao de obra, fornecedores e praticas de ${profile.label}.`,
    `Responde no idioma ${language}.`,
    `Documentos esperados: ${profile.expectedDocuments.join(", ")}.`,
    `Fontes de referencia: ${profile.publicSources.join(", ")}.`,
    "Nao apresentes custo como numero exato; usa intervalos e cenarios Economico, Normal e Premium.",
  ].join("\n")
}
