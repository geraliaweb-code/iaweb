import type { BenchmarkNode, CostNode, TimelineNode } from "./types"

export const benchmarkKnowledgeNodes: BenchmarkNode[] = [
  { id: "benchmark:moradia_pt_cost", type: "benchmark", label: "Moradia Portugal custo/m2", country: "portugal", metadata: { typology: "moradia", areaBand: "100-500", metric: "cost" } },
  { id: "benchmark:remodelacao_eu_schedule", type: "benchmark", label: "Remodelacao Europa prazo", country: "europe", metadata: { typology: "remodelacao", areaBand: "50-300", metric: "schedule" } },
  { id: "benchmark:hotel_eu_complexity", type: "benchmark", label: "Hotel Europa complexidade", country: "europe", metadata: { typology: "hotel", areaBand: "1000+", metric: "complexity" } },
  { id: "benchmark:pavilhao_industrial_eu_risk", type: "benchmark", label: "Pavilhao industrial risco", country: "europe", metadata: { typology: "pavilhao_industrial", areaBand: "1000+", metric: "risk" } },
]

export const timelineKnowledgeNodes: TimelineNode[] = [
  { id: "timeline:critical_path", type: "timeline", label: "Caminho critico" },
  { id: "timeline:procurement_window", type: "timeline", label: "Janela de procurement" },
]

export const costKnowledgeNodes: CostNode[] = [
  { id: "cost:cost_driver_material", type: "cost", label: "Driver custo material" },
  { id: "cost:cost_driver_labor", type: "cost", label: "Driver custo mao de obra" },
]
