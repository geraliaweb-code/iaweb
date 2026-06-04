import type { ConstructionGraphNode } from "./graph-types"

export const constructionGraphSeedNodes: ConstructionGraphNode[] = [
  { id: "document:mapa_de_quantidades", type: "document", label: "mapa de quantidades", country: "Portugal" },
  { id: "document:dqe", type: "document", label: "DQE", country: "Franca" },
  { id: "document:mediciones", type: "document", label: "Mediciones", country: "Espanha" },
  { id: "document:medicoes", type: "document", label: "medicoes", country: "Portugal" },
  { id: "document:caderno_de_encargos", type: "document", label: "caderno de encargos", country: "Portugal" },
  { id: "document:scie", type: "document", label: "SCIE", country: "Portugal" },
  { id: "specialty:fachada", type: "specialty", label: "fachada" },
  { id: "specialty:estruturas", type: "specialty", label: "estruturas" },
  { id: "element:etics", type: "element", label: "ETICS" },
  { id: "element:piscina", type: "element", label: "piscina" },
  { id: "risk:ausencia_estruturas", type: "risk", label: "ausencia de estruturas" },
  { id: "cost_factor:etics", type: "cost_factor", label: "ETICS aumenta custo" },
  { id: "cost_factor:piscina", type: "cost_factor", label: "piscina aumenta custo" },
  { id: "schedule_factor:etics", type: "schedule_factor", label: "ETICS aumenta prazo" },
  { id: "schedule_factor:piscina", type: "schedule_factor", label: "piscina aumenta prazo" },
  { id: "compliance_rule:scie", type: "compliance_rule", label: "regra de conformidade SCIE" },
  { id: "benchmark_pattern:documentacao_completa", type: "benchmark_pattern", label: "documentacao acima da media" },
]
