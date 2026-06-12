import { knowledgeGraphV2Edges } from "./edge-registry"
import { findKnowledgeNodeByLabel, getKnowledgeNode, knowledgeGraphV2Nodes, normalizeKnowledgeText } from "./node-registry"
import type { KnowledgeCountry, KnowledgeEdge, KnowledgeNode, KnowledgeQueryContext, KnowledgeQueryResult } from "./types"

export function normalizeKnowledgeCountry(country: string | null | undefined): KnowledgeCountry {
  const normalized = normalizeKnowledgeText(country)
  if (["franca", "france", "fr"].includes(normalized)) return "france"
  if (["espanha", "espana", "spain", "es"].includes(normalized)) return "spain"
  return "portugal"
}

function uniqueNodes(nodes: KnowledgeNode[]) {
  return Array.from(new Map(nodes.map((node) => [node.id, node])).values())
}

function uniqueEdges(edges: KnowledgeEdge[]) {
  return Array.from(new Map(edges.map((edge) => [edge.id, edge])).values())
}

function isKnowledgeNode(node: KnowledgeNode | null): node is KnowledgeNode {
  return node !== null
}

function contextCountry(context: KnowledgeQueryContext) {
  return normalizeKnowledgeCountry(context.project?.technical_country ?? context.project?.country ?? context.country)
}

function detectedDocumentIds(context: KnowledgeQueryContext) {
  return new Set((context.detectedDocuments ?? []).map((document) => findKnowledgeNodeByLabel(document)?.id ?? `document:${normalizeKnowledgeText(document)}`))
}

export function findMissingDocuments(context: KnowledgeQueryContext) {
  const country = contextCountry(context)
  const detected = detectedDocumentIds(context)
  return knowledgeGraphV2Nodes
    .filter((node) => node.type === "document" && node.metadata.countries.includes(country) && ["critical", "high"].includes(node.metadata.criticality))
    .filter((node) => !detected.has(node.id))
}

export function findDocumentDependencies(context: KnowledgeQueryContext) {
  const relevantDocuments = new Set([
    ...findMissingDocuments(context).map((node) => node.id),
    ...Array.from(detectedDocumentIds(context)),
  ])
  return knowledgeGraphV2Edges.filter((edge) => ["document_requires", "document_depends_on", "document_validates"].includes(edge.relation) && (relevantDocuments.has(edge.source) || relevantDocuments.has(edge.target)))
}

export function findSupplierAlternatives(context: KnowledgeQueryContext) {
  const supplierIds = new Set((context.suppliers ?? []).map((supplier) => findKnowledgeNodeByLabel(supplier)?.id ?? `supplier:${normalizeKnowledgeText(supplier)}`))
  const edges = knowledgeGraphV2Edges.filter((edge) => edge.relation === "supplier_alternative" && (supplierIds.size === 0 || supplierIds.has(edge.source) || supplierIds.has(edge.target)))
  return uniqueNodes(edges.flatMap((edge) => [getKnowledgeNode(edge.source), getKnowledgeNode(edge.target)]).filter((node): node is KnowledgeNode => Boolean(node)))
}

export function findMaterialAlternatives(context: KnowledgeQueryContext) {
  const materials = new Set((context.materials ?? context.procurementMaterials ?? []).map((material) => findKnowledgeNodeByLabel(material)?.id ?? `material:${normalizeKnowledgeText(material)}`))
  const supplierEdges = knowledgeGraphV2Edges.filter((edge) => edge.relation === "supplier_supplies" && (materials.size === 0 || materials.has(edge.target)))
  return uniqueNodes(supplierEdges.map((edge) => getKnowledgeNode(edge.source)).filter((node): node is KnowledgeNode => Boolean(node)))
}

export function findCostDrivers(context: KnowledgeQueryContext) {
  const materialIds = new Set((context.materials ?? context.procurementMaterials ?? []).map((material) => findKnowledgeNodeByLabel(material)?.id ?? `material:${normalizeKnowledgeText(material)}`))
  return knowledgeGraphV2Edges.filter((edge) => edge.relation === "material_impacts_cost" && (materialIds.size === 0 || materialIds.has(edge.source)))
}

export function findScheduleDrivers(context: KnowledgeQueryContext) {
  const materialIds = new Set((context.materials ?? context.procurementMaterials ?? []).map((material) => findKnowledgeNodeByLabel(material)?.id ?? `material:${normalizeKnowledgeText(material)}`))
  return knowledgeGraphV2Edges.filter((edge) => ["material_impacts_schedule", "risk_impacts_schedule"].includes(edge.relation) && (materialIds.size === 0 || materialIds.has(edge.source)))
}

export function findTopRisks(context: KnowledgeQueryContext) {
  const missing = findMissingDocuments(context)
  const riskIds = new Set<string>()
  if (missing.some((node) => node.id === "document:mapa_quantidades" || node.id === "document:mapa_medicoes")) riskIds.add("risk:missing_quantities")
  if (missing.some((node) => node.id === "document:estruturas")) riskIds.add("risk:missing_structures")
  if ((context.benchmarkDeviation ?? 0) > 12) riskIds.add("risk:benchmark_above_average")
  if ((context.procurementMaterials ?? []).length) riskIds.add("risk:procurement_delay")
  return knowledgeGraphV2Nodes.filter((node) => node.type === "risk" && (riskIds.size === 0 || riskIds.has(node.id))).slice(0, 6)
}

export function findBenchmarkDeviations(context: KnowledgeQueryContext) {
  const country = contextCountry(context)
  return knowledgeGraphV2Nodes.filter((node) => node.type === "benchmark" && (node.country === country || node.country === "europe"))
}

export function findProcurementDependencies(context: KnowledgeQueryContext) {
  const materials = new Set((context.procurementMaterials ?? context.materials ?? []).map((material) => findKnowledgeNodeByLabel(material)?.id ?? `material:${normalizeKnowledgeText(material)}`))
  return knowledgeGraphV2Edges.filter((edge) => ["supplier_supplies", "material_impacts_schedule", "material_impacts_cost"].includes(edge.relation) && (materials.size === 0 || materials.has(edge.source) || materials.has(edge.target)))
}

export function queryConstructionKnowledge(context: KnowledgeQueryContext): KnowledgeQueryResult {
  const documents = findMissingDocuments(context)
  const dependencies = uniqueEdges([
    ...findDocumentDependencies(context),
    ...findCostDrivers(context),
    ...findScheduleDrivers(context),
    ...findProcurementDependencies(context),
  ])
  const specialties = uniqueNodes(dependencies.map((edge) => getKnowledgeNode(edge.source)).filter(isKnowledgeNode).filter((node) => node.type === "specialty"))
  const materials = uniqueNodes(dependencies.flatMap((edge) => [getKnowledgeNode(edge.source), getKnowledgeNode(edge.target)]).filter(isKnowledgeNode).filter((node) => node.type === "material"))
  const suppliers = uniqueNodes([...findSupplierAlternatives(context), ...findMaterialAlternatives(context)]).filter((node) => node.type === "supplier")
  const risks = findTopRisks(context)

  return {
    documents,
    specialties,
    materials,
    suppliers,
    risks,
    dependencies,
    recommendations: [
      ...documents.slice(0, 3).map((node) => `Adicionar ou validar ${node.label}.`),
      ...risks.slice(0, 3).map((node) => `Reduzir risco: ${node.label}.`),
      ...suppliers.slice(0, 2).map((node) => `Comparar alternativa de fornecedor: ${node.label}.`),
    ].slice(0, 8),
  }
}
