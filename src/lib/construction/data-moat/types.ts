export type DataMoatCountry = "Portugal" | "Franca" | "Espanha"

export type DataMoatSegment = "economic" | "normal" | "premium"

export type DataMoatRiskLevel = "low" | "medium" | "high" | "critical"

export type DataMoatReviewStatus = "seeded" | "pending_review" | "approved" | "rejected"

export type MaterialCategoryRow = {
  id: string
  code: string
  name: string
  parent_id: string | null
  created_at: string
}

export type ConstructionMaterialDataMoatRow = {
  id: string
  material_code: string | null
  material_name: string
  material_category_id: string | null
  specialty_id: string | null
  country_context_id: string | null
  unit: string
  lifecycle_stage: string | null
  data_moat_status: DataMoatReviewStatus | null
}

export type SupplierRow = {
  id: string
  supplier_code: string
  name: string
  legal_name: string | null
  country: DataMoatCountry | null
  website: string | null
  segment: DataMoatSegment
  created_at: string
}

export type SupplierMaterialRow = {
  id: string
  supplier_id: string
  material_id: string
  country_context_id: string | null
  availability_status: string
  lead_time_days: number | null
  is_preferred: boolean
}

export type MaterialCostRow = {
  id: string
  material_id: string
  country_context_id: string
  scenario: DataMoatSegment
  unit_cost: number
  currency: "EUR"
  valid_from: string
  valid_to: string | null
}

export type DataMoatKnowledgeNodeRow = {
  id: string
  node_key: string
  node_type: string
  source_table: string
  source_id: string
  metadata: Record<string, unknown>
}
