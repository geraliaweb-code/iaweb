import type { ConstructionLanguage } from "../i18n"

export type ConstructionTechnicalCountry = "portugal" | "france" | "spain"

export type ConstructionCountryProfile = {
  id: ConstructionTechnicalCountry
  label: string
  currency: "EUR"
  defaultLanguage: ConstructionLanguage
  expectedDocuments: string[]
  technicalTerms: string[]
  publicSources: string[]
  suppliers: string[]
  laborContext: string[]
  regulatoryContext: string[]
}

export const constructionCountryProfiles: Record<ConstructionTechnicalCountry, ConstructionCountryProfile> = {
  portugal: {
    id: "portugal",
    label: "Portugal",
    currency: "EUR",
    defaultLanguage: "pt",
    expectedDocuments: ["Mapa de Quantidades", "Caderno de Encargos", "Arquitetura", "Estruturas", "Especialidades"],
    technicalTerms: ["medicoes", "caderno de encargos", "especialidades", "empreitada", "licenciamento"],
    publicSources: ["Portal BASE", "Municipios", "Diario da Republica", "LNEC", "IMPIC", "INE"],
    suppliers: ["Leroy Merlin Portugal", "MaxMat", "Bricomarche", "BigMat Portugal", "armazens regionais"],
    laborContext: ["Pedreiro", "Servente", "Eletricista", "Canalizador"],
    regulatoryContext: ["Regime juridico da urbanizacao e edificacao", "SCIE", "ITED", "normas portuguesas aplicaveis"],
  },
  france: {
    id: "france",
    label: "France",
    currency: "EUR",
    defaultLanguage: "fr",
    expectedDocuments: ["CCTP", "DPGF", "DQE", "Plans d'Execution", "Etude de Sol"],
    technicalTerms: ["DCE", "CCTP", "DPGF", "DQE", "BPU", "lots"],
    publicSources: ["Marches Publics", "BOAMP", "INSEE", "Legifrance", "CSTB", "ADEME", "Qualibat"],
    suppliers: ["Leroy Merlin France", "Castorama", "Point.P", "BigMat", "Gedimat", "Saint-Gobain Distribution"],
    laborContext: ["Macon", "Electricien", "Plombier", "Chef de chantier"],
    regulatoryContext: ["Code de la construction", "DTU", "RE2020", "regles incendie applicables"],
  },
  spain: {
    id: "spain",
    label: "Espana",
    currency: "EUR",
    defaultLanguage: "es",
    expectedDocuments: ["Mediciones", "Presupuesto", "Pliego", "Proyecto Basico", "Proyecto de Ejecucion"],
    technicalTerms: ["mediciones", "presupuesto", "pliego", "proyecto basico", "proyecto de ejecucion"],
    publicSources: ["Plataforma de Contratacion del Sector Publico", "BOE", "INE Espana", "Codigo Tecnico de la Edificacion", "Ministerio de Transportes/Vivienda"],
    suppliers: ["Leroy Merlin Espana", "Obramat", "Bauhaus Espana", "BigMat Espana"],
    laborContext: ["Albanil", "Electricista", "Fontanero", "Jefe de obra"],
    regulatoryContext: ["Codigo Tecnico de la Edificacion", "normativa urbanistica municipal", "seguridad contra incendios"],
  },
}

export function getConstructionCountryProfile(country?: string | null) {
  const normalized = normalizeConstructionCountry(country)
  return constructionCountryProfiles[normalized]
}

export function normalizeConstructionCountry(country?: string | null): ConstructionTechnicalCountry {
  const value = (country ?? "").toLowerCase()
  if (value.includes("fran") || value === "fr") return "france"
  if (value.includes("esp") || value === "es" || value.includes("spain")) return "spain"
  return "portugal"
}

export function countryFromLanguage(language?: ConstructionLanguage | string | null): ConstructionTechnicalCountry {
  if (language === "fr") return "france"
  if (language === "es") return "spain"
  return "portugal"
}
