import type { CountryNode, RegulationNode } from "./types"

export const countryKnowledgeNodes: CountryNode[] = [
  {
    id: "country:portugal",
    type: "country",
    label: "Portugal",
    country: "portugal",
    aliases: ["PT"],
    metadata: {
      documents: ["document:arquitetura", "document:estruturas", "document:mapa_quantidades", "document:caderno_encargos", "document:dqe"],
      regulations: ["regulation:scie_pt", "regulation:ited_pt"],
      specialties: ["specialty:estruturas", "specialty:arquitetura", "specialty:avac", "specialty:ited", "specialty:scie"],
      practices: ["Mapa de Quantidades como base de orcamentacao", "Caderno de Encargos para especificacao contratual"],
    },
  },
  {
    id: "country:france",
    type: "country",
    label: "Franca",
    country: "france",
    aliases: ["France", "FR"],
    metadata: {
      documents: ["document:cctp", "document:dpgf", "document:arquitetura", "document:estruturas"],
      regulations: ["regulation:re2020_fr", "regulation:erp_fr"],
      specialties: ["specialty:structures", "specialty:avac", "specialty:electricite", "specialty:facades"],
      practices: ["CCTP para especificacao tecnica", "DPGF para decomposicao de preco"],
    },
  },
  {
    id: "country:spain",
    type: "country",
    label: "Espanha",
    country: "spain",
    aliases: ["Espana", "Spain", "ES"],
    metadata: {
      documents: ["document:proyecto_basico", "document:proyecto_ejecucion", "document:mediciones", "document:arquitetura"],
      regulations: ["regulation:cte_es", "regulation:rite_es"],
      specialties: ["specialty:estructuras", "specialty:arquitectura", "specialty:climatizacion", "specialty:electricidad"],
      practices: ["Proyecto de Ejecucion para detalhe tecnico", "Mediciones para controlo de custo"],
    },
  },
]

export const regulationKnowledgeNodes: RegulationNode[] = [
  { id: "regulation:scie_pt", type: "regulation", label: "SCIE Portugal", country: "portugal", metadata: { countries: ["portugal"], domain: "seguranca_incendio" } },
  { id: "regulation:ited_pt", type: "regulation", label: "ITED Portugal", country: "portugal", metadata: { countries: ["portugal"], domain: "telecomunicacoes" } },
  { id: "regulation:re2020_fr", type: "regulation", label: "RE2020", country: "france", metadata: { countries: ["france"], domain: "energia_carbono" } },
  { id: "regulation:erp_fr", type: "regulation", label: "ERP France", country: "france", metadata: { countries: ["france"], domain: "seguranca_publico" } },
  { id: "regulation:cte_es", type: "regulation", label: "CTE Espanha", country: "spain", metadata: { countries: ["spain"], domain: "codigo_tecnico" } },
  { id: "regulation:rite_es", type: "regulation", label: "RITE Espanha", country: "spain", metadata: { countries: ["spain"], domain: "instalacoes_termicas" } },
]
