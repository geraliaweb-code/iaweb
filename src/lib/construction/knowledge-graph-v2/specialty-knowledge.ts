import type { SpecialtyNode } from "./types"

export const specialtyKnowledgeNodes: SpecialtyNode[] = [
  { id: "specialty:estruturas", type: "specialty", label: "Estruturas", aliases: ["Structures", "Estructuras"], metadata: { criticality: "high", commonMaterials: ["material:betao", "material:aco_estrutural"] } },
  { id: "specialty:arquitetura", type: "specialty", label: "Arquitetura", aliases: ["Architecture", "Arquitectura"], metadata: { criticality: "high", commonMaterials: ["material:pladur", "material:pavimento_ceramico"] } },
  { id: "specialty:avac", type: "specialty", label: "AVAC", aliases: ["HVAC", "Climatizacao"], metadata: { criticality: "high", commonMaterials: ["material:equipamento_avac", "material:condutas"] } },
  { id: "specialty:ited", type: "specialty", label: "ITED", metadata: { criticality: "medium", commonMaterials: ["material:cabo_dados"] } },
  { id: "specialty:scie", type: "specialty", label: "SCIE", metadata: { criticality: "high", commonMaterials: ["material:porta_corta_fogo"] } },
  { id: "specialty:hidraulica", type: "specialty", label: "Hidraulica", aliases: ["Aguas", "Fontaneria"], metadata: { criticality: "medium", commonMaterials: ["material:tubagem_pex"] } },
  { id: "specialty:eletricidade", type: "specialty", label: "Eletricidade", aliases: ["Electricite", "Electricidad"], metadata: { criticality: "medium", commonMaterials: ["material:cabo_eletrico"] } },
  { id: "specialty:etics", type: "specialty", label: "ETICS", metadata: { criticality: "medium", commonMaterials: ["material:isolamento_etics"] } },
  { id: "specialty:pladur", type: "specialty", label: "Pladur", metadata: { criticality: "medium", commonMaterials: ["material:pladur"] } },
  { id: "specialty:pavimentos", type: "specialty", label: "Pavimentos", metadata: { criticality: "medium", commonMaterials: ["material:pavimento_ceramico"] } },
  { id: "specialty:coberturas", type: "specialty", label: "Coberturas", metadata: { criticality: "high", commonMaterials: ["material:tela_impermeabilizacao"] } },
  { id: "specialty:caixilharias", type: "specialty", label: "Caixilharias", metadata: { criticality: "high", commonMaterials: ["material:aluminio_caixilharia", "material:vidro_duplo"] } },
]
