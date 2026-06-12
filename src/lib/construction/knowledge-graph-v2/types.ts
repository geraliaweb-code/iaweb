import type { ConstructionProject } from "../types"

export type KnowledgeCountry = "portugal" | "france" | "spain"

export type KnowledgeNodeType =
  | "country"
  | "document"
  | "specialty"
  | "element"
  | "material"
  | "supplier"
  | "risk"
  | "benchmark"
  | "timeline"
  | "cost"
  | "regulation"

export type KnowledgeRelationType =
  | "document_requires"
  | "document_depends_on"
  | "document_validates"
  | "specialty_contains"
  | "specialty_requires"
  | "element_uses"
  | "element_depends_on"
  | "material_impacts_cost"
  | "material_impacts_schedule"
  | "supplier_supplies"
  | "supplier_alternative"
  | "risk_impacts_cost"
  | "risk_impacts_schedule"
  | "benchmark_compares"
  | "country_regulates"

export type KnowledgeNodeBase = {
  id: string
  type: KnowledgeNodeType
  label: string
  country?: KnowledgeCountry | "europe" | null
  aliases?: string[]
  metadata?: Record<string, unknown>
}

export type CountryNode = KnowledgeNodeBase & { type: "country"; metadata: { documents: string[]; regulations: string[]; specialties: string[]; practices: string[] } }
export type DocumentNode = KnowledgeNodeBase & { type: "document"; metadata: { criticality: "low" | "medium" | "high" | "critical"; countries: KnowledgeCountry[] } }
export type SpecialtyNode = KnowledgeNodeBase & { type: "specialty"; metadata: { criticality: "low" | "medium" | "high"; commonMaterials: string[] } }
export type ElementNode = KnowledgeNodeBase & { type: "element" }
export type MaterialNode = KnowledgeNodeBase & { type: "material"; metadata: { specialty: string; costImpact: "low" | "medium" | "high"; scheduleImpact: "low" | "medium" | "high" } }
export type SupplierNode = KnowledgeNodeBase & { type: "supplier"; metadata: { countries: KnowledgeCountry[]; materials: string[]; segment: "economic" | "normal" | "premium" } }
export type RiskNode = KnowledgeNodeBase & { type: "risk"; metadata: { category: string; severity: "low" | "medium" | "high" | "critical" } }
export type BenchmarkNode = KnowledgeNodeBase & { type: "benchmark"; metadata: { typology?: string; areaBand?: string; metric: "cost" | "schedule" | "complexity" | "risk" } }
export type TimelineNode = KnowledgeNodeBase & { type: "timeline" }
export type CostNode = KnowledgeNodeBase & { type: "cost" }
export type RegulationNode = KnowledgeNodeBase & { type: "regulation"; metadata: { countries: KnowledgeCountry[]; domain: string } }

export type KnowledgeNode =
  | CountryNode
  | DocumentNode
  | SpecialtyNode
  | ElementNode
  | MaterialNode
  | SupplierNode
  | RiskNode
  | BenchmarkNode
  | TimelineNode
  | CostNode
  | RegulationNode

export type KnowledgeEdge = {
  id: string
  source: string
  target: string
  relation: KnowledgeRelationType
  weight: number
  evidence: string
  metadata?: Record<string, unknown>
}

export type KnowledgeGraphV2 = {
  nodes: KnowledgeNode[]
  edges: KnowledgeEdge[]
}

export type KnowledgeQueryContext = {
  project?: ConstructionProject | null
  country?: KnowledgeCountry | string | null
  detectedDocuments?: string[]
  specialties?: string[]
  materials?: string[]
  suppliers?: string[]
  benchmarkDeviation?: number | null
  procurementMaterials?: string[]
}

export type KnowledgeQueryResult = {
  documents: KnowledgeNode[]
  specialties: KnowledgeNode[]
  materials: KnowledgeNode[]
  suppliers: KnowledgeNode[]
  risks: KnowledgeNode[]
  dependencies: KnowledgeEdge[]
  recommendations: string[]
}
