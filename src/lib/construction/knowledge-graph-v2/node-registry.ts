import { benchmarkKnowledgeNodes, costKnowledgeNodes, timelineKnowledgeNodes } from "./benchmark-knowledge"
import { countryKnowledgeNodes, regulationKnowledgeNodes } from "./country-knowledge"
import { documentKnowledgeNodes } from "./document-knowledge"
import { elementKnowledgeNodes, materialKnowledgeNodes } from "./material-knowledge"
import { riskKnowledgeNodes } from "./risk-knowledge"
import { specialtyKnowledgeNodes } from "./specialty-knowledge"
import { supplierKnowledgeNodes } from "./supplier-knowledge"
import type { KnowledgeNode, KnowledgeNodeType } from "./types"

export const knowledgeGraphV2Nodes: KnowledgeNode[] = [
  ...countryKnowledgeNodes,
  ...regulationKnowledgeNodes,
  ...documentKnowledgeNodes,
  ...specialtyKnowledgeNodes,
  ...elementKnowledgeNodes,
  ...materialKnowledgeNodes,
  ...supplierKnowledgeNodes,
  ...riskKnowledgeNodes,
  ...benchmarkKnowledgeNodes,
  ...timelineKnowledgeNodes,
  ...costKnowledgeNodes,
]

export function getKnowledgeNode(id: string) {
  return knowledgeGraphV2Nodes.find((node) => node.id === id) ?? null
}

export function findKnowledgeNodesByType(type: KnowledgeNodeType) {
  return knowledgeGraphV2Nodes.filter((node) => node.type === type)
}

export function findKnowledgeNodeByLabel(label: string) {
  const normalized = normalizeKnowledgeText(label)
  return knowledgeGraphV2Nodes.find((node) => {
    const labels = [node.label, ...(node.aliases ?? [])].map(normalizeKnowledgeText)
    return labels.includes(normalized) || labels.some((item) => normalized.includes(item) || item.includes(normalized))
  }) ?? null
}

export function normalizeKnowledgeText(value: string | null | undefined) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
}
