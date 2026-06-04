import type { ConstructionDocumentTaxonomySeed } from "./ingestion-types"

export const constructionDocumentTaxonomy: ConstructionDocumentTaxonomySeed[] = [
  { country: "Portugal", documentType: "arquitetura", specialty: "arquitetura", aliases: ["arquitetura", "arquitectura", "arq", "plantas", "alcados", "cortes"], criticality: "critical", typicalExtensions: ["pdf", "dwg", "dxf"] },
  { country: "Portugal", documentType: "estruturas", specialty: "estruturas", aliases: ["estruturas", "estabilidade", "betao", "fundacoes", "armaduras"], criticality: "critical", typicalExtensions: ["pdf", "dwg", "dxf", "ifc"] },
  { country: "Portugal", documentType: "medicoes", specialty: "medicoes", aliases: ["medicoes", "autos", "quantidades"], criticality: "critical", typicalExtensions: ["xls", "xlsx", "pdf"] },
  { country: "Portugal", documentType: "mapa de quantidades", specialty: "medicoes", aliases: ["mapa de quantidades", "mq", "boq"], criticality: "important", typicalExtensions: ["xls", "xlsx", "pdf"] },
  { country: "Portugal", documentType: "caderno de encargos", specialty: "caderno de encargos", aliases: ["caderno de encargos", "encargos", "condicoes tecnicas"], criticality: "critical", typicalExtensions: ["pdf", "docx"] },
  { country: "Portugal", documentType: "AVAC", specialty: "avac", aliases: ["avac", "hvac", "climatizacao", "ventilacao"], criticality: "important", typicalExtensions: ["pdf", "dwg", "dxf"] },
  { country: "Portugal", documentType: "ITED", specialty: "ited", aliases: ["ited", "telecomunicacoes", "telecom"], criticality: "important", typicalExtensions: ["pdf", "dwg", "dxf"] },
  { country: "Portugal", documentType: "SCIE", specialty: "scie", aliases: ["scie", "incendio", "seguranca contra incendio"], criticality: "important", typicalExtensions: ["pdf", "dwg", "dxf"] },
  { country: "Portugal", documentType: "aguas e esgotos", specialty: "aguas e esgotos", aliases: ["aguas", "esgotos", "drenagem", "abastecimento"], criticality: "important", typicalExtensions: ["pdf", "dwg", "dxf"] },
  { country: "Portugal", documentType: "eletricidade", specialty: "eletricidade", aliases: ["eletricidade", "electricidade", "energia", "quadros eletricos"], criticality: "important", typicalExtensions: ["pdf", "dwg", "dxf"] },
  { country: "Franca", documentType: "CCTP", specialty: "cahier des clauses techniques", aliases: ["cctp", "cahier clauses techniques", "clauses techniques"], criticality: "critical", typicalExtensions: ["pdf", "docx"] },
  { country: "Franca", documentType: "DPGF", specialty: "decomposition prix global forfaitaire", aliases: ["dpgf", "decomposition prix"], criticality: "critical", typicalExtensions: ["xls", "xlsx", "pdf"] },
  { country: "Franca", documentType: "DQE", specialty: "detail quantitatif estimatif", aliases: ["dqe", "detail quantitatif"], criticality: "critical", typicalExtensions: ["xls", "xlsx", "pdf"] },
  { country: "Franca", documentType: "BPU", specialty: "bordereau prix unitaires", aliases: ["bpu", "bordereau prix unitaires"], criticality: "important", typicalExtensions: ["xls", "xlsx", "pdf"] },
  { country: "Franca", documentType: "Plans d'Execution", specialty: "execution", aliases: ["plans execution", "plans d execution", "exe", "execution"], criticality: "critical", typicalExtensions: ["pdf", "dwg", "dxf"] },
  { country: "Franca", documentType: "Etude de Sol", specialty: "geotechnique", aliases: ["etude de sol", "geotechnique", "g1", "g2"], criticality: "important", typicalExtensions: ["pdf"] },
  { country: "Espanha", documentType: "Mediciones", specialty: "mediciones", aliases: ["mediciones", "medicion"], criticality: "critical", typicalExtensions: ["xls", "xlsx", "pdf"] },
  { country: "Espanha", documentType: "Presupuesto", specialty: "presupuesto", aliases: ["presupuesto", "coste"], criticality: "critical", typicalExtensions: ["xls", "xlsx", "pdf"] },
  { country: "Espanha", documentType: "Pliego", specialty: "pliego", aliases: ["pliego", "pliego de condiciones"], criticality: "critical", typicalExtensions: ["pdf", "docx"] },
  { country: "Espanha", documentType: "Proyecto Basico", specialty: "proyecto", aliases: ["proyecto basico", "pb"], criticality: "important", typicalExtensions: ["pdf"] },
  { country: "Espanha", documentType: "Proyecto de Ejecucion", specialty: "ejecucion", aliases: ["proyecto de ejecucion", "pe"], criticality: "critical", typicalExtensions: ["pdf", "dwg", "dxf"] },
]

export function getCriticalDocumentsForCountry(country: string) {
  const normalizedCountry = country.includes("Fran") ? "Franca" : country
  return constructionDocumentTaxonomy
    .filter((item) => item.country === normalizedCountry && item.criticality === "critical")
    .map((item) => item.documentType)
}

export function getDocumentClassificationRules() {
  return constructionDocumentTaxonomy.map((item) => ({
    country: item.country,
    documentType: item.documentType,
    specialty: item.specialty,
    keywords: item.aliases,
    extensions: item.typicalExtensions,
    baseConfidence: item.criticality === "critical" ? 82 : item.criticality === "important" ? 76 : 68,
  }))
}
