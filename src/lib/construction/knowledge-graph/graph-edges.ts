import type { ConstructionGraphEdge } from "./graph-types"

export const constructionGraphSeedEdges: ConstructionGraphEdge[] = [
  { id: "edge:mq_equiv_dqe", source: "document:mapa_de_quantidades", target: "document:dqe", relation: "equivalent_to", weight: 0.92, evidence: "Equivalencia funcional para quantidades estimativas." },
  { id: "edge:mq_equiv_mediciones", source: "document:mapa_de_quantidades", target: "document:mediciones", relation: "equivalent_to", weight: 0.92, evidence: "Equivalencia funcional PT/ES para medicoes." },
  { id: "edge:etics_belongs_fachada", source: "element:etics", target: "specialty:fachada", relation: "belongs_to", weight: 0.86, evidence: "ETICS e sistema de isolamento termico pelo exterior." },
  { id: "edge:etics_cost", source: "element:etics", target: "cost_factor:etics", relation: "increases_cost", weight: 0.72, evidence: "ETICS aumenta componentes de material e mao de obra de fachada." },
  { id: "edge:etics_schedule", source: "element:etics", target: "schedule_factor:etics", relation: "increases_schedule", weight: 0.62, evidence: "ETICS acrescenta fases de preparacao, colagem, acabamento e cura." },
  { id: "edge:piscina_complexity", source: "element:piscina", target: "risk:ausencia_estruturas", relation: "increases_complexity", weight: 0.74, evidence: "Piscina adiciona estrutura, impermeabilizacao e redes tecnicas." },
  { id: "edge:piscina_cost", source: "element:piscina", target: "cost_factor:piscina", relation: "increases_cost", weight: 0.82, evidence: "Piscina aumenta escavacao, estrutura, impermeabilizacao e equipamentos." },
  { id: "edge:piscina_schedule", source: "element:piscina", target: "schedule_factor:piscina", relation: "increases_schedule", weight: 0.76, evidence: "Piscina cria atividades adicionais e interfaces tecnicas." },
  { id: "edge:scie_requires_rule", source: "document:scie", target: "compliance_rule:scie", relation: "requires", weight: 0.88, evidence: "SCIE depende de verificacao regulamentar aplicavel." },
  { id: "edge:missing_structures_risk", source: "specialty:estruturas", target: "risk:ausencia_estruturas", relation: "increases_risk", weight: 0.9, evidence: "Ausencia de estruturas aumenta risco documental." },
  { id: "edge:medicoes_confidence", source: "document:medicoes", target: "benchmark_pattern:documentacao_completa", relation: "improves_confidence", weight: 0.82, evidence: "Medicoes melhoram confianca de custo e decisao." },
  { id: "edge:caderno_maturity", source: "document:caderno_de_encargos", target: "benchmark_pattern:documentacao_completa", relation: "improves_maturity", weight: 0.82, evidence: "Caderno de encargos aumenta maturidade documental." },
]
