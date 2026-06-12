import type { RiskNode } from "./types"

export const riskKnowledgeNodes: RiskNode[] = [
  { id: "risk:missing_quantities", type: "risk", label: "Mapa de Quantidades em falta", metadata: { category: "documental", severity: "critical" } },
  { id: "risk:missing_structures", type: "risk", label: "Projeto de Estruturas em falta", metadata: { category: "documental", severity: "critical" } },
  { id: "risk:supplier_low_coverage", type: "risk", label: "Fornecedor sem cobertura suficiente", metadata: { category: "fornecedor", severity: "high" } },
  { id: "risk:material_price_volatility", type: "risk", label: "Volatilidade de preco de material", metadata: { category: "mercado", severity: "high" } },
  { id: "risk:procurement_delay", type: "risk", label: "Atraso de procurement", metadata: { category: "procurement", severity: "high" } },
  { id: "risk:benchmark_above_average", type: "risk", label: "Desvio acima do benchmark", metadata: { category: "benchmark", severity: "medium" } },
  { id: "risk:compliance_gap", type: "risk", label: "Falha de compliance", metadata: { category: "compliance", severity: "high" } },
]
