import type { ConstructionDatasetCountry } from "./ingestion-types"

export const constructionCountryDictionary: Record<ConstructionDatasetCountry, { label: string; procurementTerms: string[]; documentTerms: string[] }> = {
  Portugal: {
    label: "Portugal",
    procurementTerms: ["Portal BASE", "concurso publico", "ajuste direto", "procedimento", "caderno de encargos"],
    documentTerms: ["arquitetura", "estruturas", "medicoes", "mapa de quantidades", "caderno de encargos", "AVAC", "ITED", "SCIE"],
  },
  Franca: {
    label: "Franca",
    procurementTerms: ["marches publics", "appel d'offres", "DCE", "lot", "consultation"],
    documentTerms: ["CCTP", "DPGF", "DQE", "BPU", "plans d'execution", "etude de sol"],
  },
  Espanha: {
    label: "Espanha",
    procurementTerms: ["licitaciones publicas", "contratacion del sector publico", "pliego", "expediente"],
    documentTerms: ["Mediciones", "Presupuesto", "Pliego", "Proyecto Basico", "Proyecto de Ejecucion"],
  },
  Europa: {
    label: "Europa",
    procurementTerms: ["public procurement", "tender", "technical specifications"],
    documentTerms: ["technical documents", "bill of quantities", "specifications"],
  },
}
