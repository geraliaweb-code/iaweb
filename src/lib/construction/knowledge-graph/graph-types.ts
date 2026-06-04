import type { ConstructionDetectedDocument, ConstructionProject, ConstructionScoreRecord } from "../types"

export const constructionGraphNodeTypes = [
  "document",
  "specialty",
  "element",
  "risk",
  "cost_factor",
  "schedule_factor",
  "compliance_rule",
  "benchmark_pattern",
  "typology",
  "country",
] as const

export const constructionGraphEdgeTypes = [
  "requires",
  "belongs_to",
  "influences",
  "increases_risk",
  "increases_cost",
  "increases_schedule",
  "reduces_confidence",
  "improves_maturity",
  "improves_confidence",
  "increases_complexity",
  "equivalent_to",
  "commonly_missing",
  "benchmarked_against",
] as const

export type ConstructionGraphNodeType = (typeof constructionGraphNodeTypes)[number]
export type ConstructionGraphEdgeType = (typeof constructionGraphEdgeTypes)[number]

export type ConstructionGraphNode = {
  id: string
  type: ConstructionGraphNodeType
  label: string
  country?: string | null
  metadata?: Record<string, unknown>
}

export type ConstructionGraphEdge = {
  id: string
  source: string
  target: string
  relation: ConstructionGraphEdgeType
  weight: number
  evidence?: string
  metadata?: Record<string, unknown>
}

export type ConstructionGraphObservation = {
  id: string
  projectId: string
  nodeId?: string
  edgeId?: string
  observationType: string
  title: string
  severity: "low" | "medium" | "high"
  recommendation: string
  metadata?: Record<string, unknown>
}

export type ConstructionDetectedElementRecord = {
  id: string
  project_id: string
  detected_document_id: string | null
  element_type: string
  label: string
  quantity: number | null
  unit: string | null
  source_reference: string | null
  confidence_score: number | null
  metadata: Record<string, unknown>
  created_at: string
}

export type ConstructionKnowledgeGraphInput = {
  project: ConstructionProject
  documents: ConstructionDetectedDocument[]
  elements: ConstructionDetectedElementRecord[]
  scores: ConstructionScoreRecord[]
}

export type ConstructionKnowledgeGraphSummary = {
  mainEntities: string[]
  mainRelations: string[]
  derivedRisks: string[]
  costFactors: string[]
  scheduleFactors: string[]
  recommendations: string[]
  nodes: ConstructionGraphNode[]
  edges: ConstructionGraphEdge[]
  observations: ConstructionGraphObservation[]
}
