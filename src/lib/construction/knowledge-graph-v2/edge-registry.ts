import { knowledgeGraphV2Nodes } from "./node-registry"
import type { KnowledgeEdge, KnowledgeRelationType } from "./types"

function edge(source: string, relation: KnowledgeRelationType, target: string, weight: number, evidence: string): KnowledgeEdge {
  return {
    id: `edge:${source}:${relation}:${target}`,
    source,
    target,
    relation,
    weight,
    evidence,
  }
}

const countryEdges = knowledgeGraphV2Nodes
  .filter((node) => node.type === "country")
  .flatMap((country) => {
    const metadata = country.metadata
    return [
      ...metadata.documents.map((document) => edge(country.id, "document_requires", document, 0.86, "Base documental por pais.")),
      ...metadata.regulations.map((regulation) => edge(country.id, "country_regulates", regulation, 0.9, "Regulacao aplicavel por pais.")),
      ...metadata.specialties.map((specialty) => edge(country.id, "specialty_requires", specialty, 0.72, "Especialidades comuns por pais.")),
    ]
  })

const documentEdges: KnowledgeEdge[] = [
  edge("document:estruturas", "document_depends_on", "document:arquitetura", 0.88, "Estruturas depende de base arquitetonica."),
  edge("document:mapa_quantidades", "document_depends_on", "document:arquitetura", 0.82, "Quantidades dependem de pecas desenhadas."),
  edge("document:mapa_quantidades", "document_depends_on", "document:estruturas", 0.84, "Quantidades estruturais dependem do projeto estrutural."),
  edge("document:caderno_encargos", "document_validates", "document:mapa_quantidades", 0.8, "Especificacoes validam quantidades e preco."),
  edge("document:dqe", "document_depends_on", "document:mapa_quantidades", 0.84, "DQE deriva de quantidades."),
  edge("document:dpgf", "document_depends_on", "document:cctp", 0.82, "DPGF depende da especificacao CCTP."),
  edge("document:proyecto_ejecucion", "document_depends_on", "document:proyecto_basico", 0.9, "Proyecto de Ejecucion detalha Proyecto Basico."),
  edge("document:mapa_medicoes", "document_depends_on", "document:proyecto_ejecucion", 0.82, "Mediciones dependem do projeto de execucao."),
]

const specialtyEdges: KnowledgeEdge[] = [
  edge("specialty:estruturas", "specialty_contains", "element:fundacoes", 0.88, "Fundacoes pertencem a estruturas."),
  edge("specialty:estruturas", "specialty_contains", "element:estrutura", 0.88, "Estrutura pertence a estruturas."),
  edge("specialty:etics", "specialty_contains", "element:fachada", 0.75, "ETICS impacta fachada."),
  edge("specialty:coberturas", "specialty_contains", "element:cobertura", 0.86, "Coberturas impactam cobertura."),
  edge("specialty:avac", "specialty_requires", "specialty:eletricidade", 0.72, "AVAC tem dependencias eletricas."),
  edge("specialty:scie", "specialty_requires", "regulation:scie_pt", 0.8, "SCIE exige enquadramento regulamentar."),
]

const materialEdges = knowledgeGraphV2Nodes
  .filter((node) => node.type === "material")
  .flatMap((material) => [
    edge(material.metadata.specialty, "element_uses", material.id, 0.78, "Material associado a especialidade."),
    edge(material.id, "material_impacts_cost", "cost:cost_driver_material", material.metadata.costImpact === "high" ? 0.9 : 0.62, "Material influencia custo."),
    edge(material.id, "material_impacts_schedule", "timeline:critical_path", material.metadata.scheduleImpact === "high" ? 0.86 : 0.58, "Material influencia prazo."),
  ])

const supplierEdges = knowledgeGraphV2Nodes
  .filter((node) => node.type === "supplier")
  .flatMap((supplier) => supplier.metadata.materials.map((material) => edge(supplier.id, "supplier_supplies", material, 0.78, "Fornecedor fornece material.")))

const supplierAlternativeEdges: KnowledgeEdge[] = [
  edge("supplier:saint_gobain", "supplier_alternative", "supplier:weber", 0.62, "Alternativa em isolamento e fachada."),
  edge("supplier:leroy_merlin_pro", "supplier_alternative", "supplier:saint_gobain", 0.58, "Alternativa multi-categoria."),
  edge("supplier:bosch_thermotechnology", "supplier_alternative", "supplier:schneider_electric", 0.42, "Alternativa parcial em sistemas tecnicos."),
]

const riskEdges: KnowledgeEdge[] = [
  edge("document:mapa_quantidades", "document_validates", "risk:missing_quantities", 0.9, "Quantidades reduzem risco documental e financeiro."),
  edge("document:estruturas", "document_validates", "risk:missing_structures", 0.92, "Projeto estrutural reduz risco tecnico."),
  edge("risk:missing_quantities", "risk_impacts_cost", "cost:cost_driver_material", 0.9, "Falta de quantidades aumenta incerteza de custo."),
  edge("risk:missing_structures", "risk_impacts_schedule", "timeline:critical_path", 0.88, "Estruturas em falta afetam caminho critico."),
  edge("risk:supplier_low_coverage", "risk_impacts_schedule", "timeline:procurement_window", 0.76, "Cobertura fraca atrasa procurement."),
  edge("risk:procurement_delay", "risk_impacts_cost", "cost:cost_driver_material", 0.78, "Procurement atrasado aumenta custo futuro."),
  edge("risk:benchmark_above_average", "risk_impacts_cost", "cost:cost_driver_material", 0.72, "Benchmark acima da media sinaliza risco financeiro."),
]

const benchmarkEdges: KnowledgeEdge[] = [
  edge("benchmark:moradia_pt_cost", "benchmark_compares", "cost:cost_driver_material", 0.78, "Benchmark compara custo/m2."),
  edge("benchmark:remodelacao_eu_schedule", "benchmark_compares", "timeline:critical_path", 0.7, "Benchmark compara prazo."),
  edge("benchmark:hotel_eu_complexity", "benchmark_compares", "risk:compliance_gap", 0.66, "Complexidade hoteleira aumenta compliance."),
  edge("benchmark:pavilhao_industrial_eu_risk", "benchmark_compares", "risk:procurement_delay", 0.66, "Pavilhao industrial exposto a procurement."),
]

export const knowledgeGraphV2Edges: KnowledgeEdge[] = [
  ...countryEdges,
  ...documentEdges,
  ...specialtyEdges,
  ...materialEdges,
  ...supplierEdges,
  ...supplierAlternativeEdges,
  ...riskEdges,
  ...benchmarkEdges,
]

export function findKnowledgeEdgesByRelation(relation: KnowledgeRelationType) {
  return knowledgeGraphV2Edges.filter((edge) => edge.relation === relation)
}

export function findKnowledgeEdgesForNode(nodeId: string) {
  return knowledgeGraphV2Edges.filter((edge) => edge.source === nodeId || edge.target === nodeId)
}
