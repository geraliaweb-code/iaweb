import type { DocumentNode } from "./types"

export const documentKnowledgeNodes: DocumentNode[] = [
  { id: "document:arquitetura", type: "document", label: "Arquitetura", aliases: ["Architecture", "Arquitectura"], metadata: { criticality: "critical", countries: ["portugal", "france", "spain"] } },
  { id: "document:estruturas", type: "document", label: "Estruturas", aliases: ["Structures", "Estructuras"], metadata: { criticality: "critical", countries: ["portugal", "france", "spain"] } },
  { id: "document:mapa_quantidades", type: "document", label: "Mapa de Quantidades", aliases: ["Mapa Quantidades", "Quantidades"], metadata: { criticality: "critical", countries: ["portugal"] } },
  { id: "document:mapa_medicoes", type: "document", label: "Mapa de Medicoes", aliases: ["Medicoes", "Mediciones"], metadata: { criticality: "high", countries: ["portugal", "spain"] } },
  { id: "document:caderno_encargos", type: "document", label: "Caderno de Encargos", aliases: ["Encargos"], metadata: { criticality: "high", countries: ["portugal"] } },
  { id: "document:dqe", type: "document", label: "DQE", aliases: ["Demonstracao Quantidades Estimadas"], metadata: { criticality: "high", countries: ["portugal"] } },
  { id: "document:dpgf", type: "document", label: "DPGF", aliases: ["Decomposition du Prix Global et Forfaitaire"], metadata: { criticality: "high", countries: ["france"] } },
  { id: "document:cctp", type: "document", label: "CCTP", aliases: ["Cahier des Clauses Techniques Particulieres"], metadata: { criticality: "critical", countries: ["france"] } },
  { id: "document:proyecto_basico", type: "document", label: "Proyecto Basico", aliases: ["Proyecto Básico"], metadata: { criticality: "high", countries: ["spain"] } },
  { id: "document:proyecto_ejecucion", type: "document", label: "Proyecto de Ejecucion", aliases: ["Proyecto de Ejecución"], metadata: { criticality: "critical", countries: ["spain"] } },
]
