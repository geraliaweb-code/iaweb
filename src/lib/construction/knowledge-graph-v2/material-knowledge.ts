import type { ElementNode, MaterialNode } from "./types"

export const elementKnowledgeNodes: ElementNode[] = [
  { id: "element:fundacoes", type: "element", label: "Fundacoes" },
  { id: "element:estrutura", type: "element", label: "Estrutura" },
  { id: "element:fachada", type: "element", label: "Fachada" },
  { id: "element:cobertura", type: "element", label: "Cobertura" },
  { id: "element:instalacoes", type: "element", label: "Instalacoes" },
]

export const materialKnowledgeNodes: MaterialNode[] = [
  { id: "material:betao", type: "material", label: "Betao", metadata: { specialty: "specialty:estruturas", costImpact: "high", scheduleImpact: "high" } },
  { id: "material:aco_estrutural", type: "material", label: "Aco estrutural", metadata: { specialty: "specialty:estruturas", costImpact: "high", scheduleImpact: "high" } },
  { id: "material:isolamento_etics", type: "material", label: "Isolamento ETICS", metadata: { specialty: "specialty:etics", costImpact: "medium", scheduleImpact: "medium" } },
  { id: "material:aluminio_caixilharia", type: "material", label: "Aluminio caixilharia", metadata: { specialty: "specialty:caixilharias", costImpact: "high", scheduleImpact: "high" } },
  { id: "material:vidro_duplo", type: "material", label: "Vidro duplo", metadata: { specialty: "specialty:caixilharias", costImpact: "medium", scheduleImpact: "high" } },
  { id: "material:equipamento_avac", type: "material", label: "Equipamento AVAC", metadata: { specialty: "specialty:avac", costImpact: "high", scheduleImpact: "high" } },
  { id: "material:condutas", type: "material", label: "Condutas AVAC", metadata: { specialty: "specialty:avac", costImpact: "medium", scheduleImpact: "medium" } },
  { id: "material:cabo_eletrico", type: "material", label: "Cabo eletrico", metadata: { specialty: "specialty:eletricidade", costImpact: "medium", scheduleImpact: "low" } },
  { id: "material:tubagem_pex", type: "material", label: "Tubagem PEX", metadata: { specialty: "specialty:hidraulica", costImpact: "medium", scheduleImpact: "medium" } },
  { id: "material:pladur", type: "material", label: "Pladur", metadata: { specialty: "specialty:pladur", costImpact: "low", scheduleImpact: "medium" } },
  { id: "material:pavimento_ceramico", type: "material", label: "Pavimento ceramico", metadata: { specialty: "specialty:pavimentos", costImpact: "medium", scheduleImpact: "medium" } },
  { id: "material:tela_impermeabilizacao", type: "material", label: "Tela impermeabilizacao", metadata: { specialty: "specialty:coberturas", costImpact: "medium", scheduleImpact: "high" } },
  { id: "material:porta_corta_fogo", type: "material", label: "Porta corta-fogo", metadata: { specialty: "specialty:scie", costImpact: "medium", scheduleImpact: "medium" } },
  { id: "material:cabo_dados", type: "material", label: "Cabo dados", metadata: { specialty: "specialty:ited", costImpact: "low", scheduleImpact: "low" } },
]
