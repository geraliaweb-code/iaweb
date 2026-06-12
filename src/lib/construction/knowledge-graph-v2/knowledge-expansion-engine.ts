import { knowledgeGraphV2Edges } from "./edge-registry"
import { knowledgeGraphV2Nodes, normalizeKnowledgeText } from "./node-registry"
import type { KnowledgeEdge, KnowledgeGraphV2, KnowledgeNode } from "./types"

export type KnowledgeExpansionInput = {
  nodes?: KnowledgeNode[]
  edges?: KnowledgeEdge[]
}

function uniqueById<T extends { id: string }>(items: T[]) {
  return Array.from(new Map(items.map((item) => [item.id || normalizeKnowledgeText("unknown"), item])).values())
}

export function buildExpandedKnowledgeGraph(input: KnowledgeExpansionInput = {}): KnowledgeGraphV2 {
  return {
    nodes: uniqueById([...knowledgeGraphV2Nodes, ...(input.nodes ?? [])]),
    edges: uniqueById([...knowledgeGraphV2Edges, ...(input.edges ?? [])]),
  }
}

export function getKnowledgeGraphV2Stats(input: KnowledgeExpansionInput = {}) {
  const graph = buildExpandedKnowledgeGraph(input)
  return {
    nodes: graph.nodes.length,
    edges: graph.edges.length,
    countries: graph.nodes.filter((node) => node.type === "country").length,
    documents: graph.nodes.filter((node) => node.type === "document").length,
    suppliers: graph.nodes.filter((node) => node.type === "supplier").length,
    risks: graph.nodes.filter((node) => node.type === "risk").length,
  }
}
