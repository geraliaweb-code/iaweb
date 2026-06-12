import type { BenchmarkConfidenceTier, BenchmarkLifecyclePhase, BenchmarkServingStatus } from "./benchmark-types"
import type { DataMoatCountry } from "./types"

export type RiskLearningCategory =
  | "financeiro"
  | "prazo"
  | "tecnico"
  | "fornecedor"
  | "regulatorio"
  | "operacional"

export type RiskLearningSubcategory =
  | "financeiro_orcamento"
  | "financeiro_inflacao"
  | "financeiro_cambio"
  | "financeiro_cashflow"
  | "financeiro_margem"
  | "prazo_licenciamento"
  | "prazo_fornecedor"
  | "prazo_clima"
  | "prazo_mao_de_obra"
  | "prazo_caminho_critico"
  | "tecnico_projeto"
  | "tecnico_compatibilizacao"
  | "tecnico_qualidade"
  | "tecnico_geotecnia"
  | "tecnico_instalacoes"
  | "fornecedor_entrega"
  | "fornecedor_preco"
  | "fornecedor_capacidade"
  | "fornecedor_qualidade"
  | "fornecedor_substituicao"
  | "regulatorio_licenca"
  | "regulatorio_seguranca"
  | "regulatorio_ambiental"
  | "regulatorio_fiscal"
  | "regulatorio_normativo"
  | "operacional_produtividade"
  | "operacional_seguranca_obra"
  | "operacional_coordenacao"
  | "operacional_subempreiteiro"
  | "operacional_cliente"

export type RiskRecordStatus = "open" | "monitoring" | "mitigated" | "materialized" | "dismissed"

export type RiskSourceStatus = "warm" | "cold_ready" | "archived"

export type RiskObservationType = "active_reminder" | "automatic_inference" | "manual_update" | "project_close_review"

export type RiskObservedStatus = "not_observed" | "observed" | "partially_observed" | "unknown"

export type RiskReminderStatus = "active" | "sent" | "snoozed" | "completed" | "not_required"

export type RiskPropagationTarget = "cost" | "timeline" | "supplier" | "quality" | "compliance" | "client" | "portfolio"

export type RiskPropagationType = "causal" | "correlation" | "dependency" | "manual"

export type MacroRiskSourceMode = "manual" | "future_automatic" | "hybrid"

export type HumanApprovalStatus = "pending" | "approved" | "rejected" | "superseded"

export type RiskCalibrationApprovalStatus = "auto_applied" | "pending_human_approval" | "approved" | "rejected"

export const riskLearningCategories: RiskLearningCategory[] = [
  "financeiro",
  "prazo",
  "tecnico",
  "fornecedor",
  "regulatorio",
  "operacional",
]

export const riskLearningSubcategories: RiskLearningSubcategory[] = [
  "financeiro_orcamento",
  "financeiro_inflacao",
  "financeiro_cambio",
  "financeiro_cashflow",
  "financeiro_margem",
  "prazo_licenciamento",
  "prazo_fornecedor",
  "prazo_clima",
  "prazo_mao_de_obra",
  "prazo_caminho_critico",
  "tecnico_projeto",
  "tecnico_compatibilizacao",
  "tecnico_qualidade",
  "tecnico_geotecnia",
  "tecnico_instalacoes",
  "fornecedor_entrega",
  "fornecedor_preco",
  "fornecedor_capacidade",
  "fornecedor_qualidade",
  "fornecedor_substituicao",
  "regulatorio_licenca",
  "regulatorio_seguranca",
  "regulatorio_ambiental",
  "regulatorio_fiscal",
  "regulatorio_normativo",
  "operacional_produtividade",
  "operacional_seguranca_obra",
  "operacional_coordenacao",
  "operacional_subempreiteiro",
  "operacional_cliente",
]

export const riskConfidenceWeights: Record<BenchmarkLifecyclePhase, number> = {
  conceção: 0.3,
  execução: 0.6,
  concluído: 1,
}

export const riskLearningThresholds = {
  minProjectsToServe: 5,
  lowConfidenceUntilProjects: 15,
  autoCalibrationDeltaPercent: 20,
  coldStorageReadyFromProjects: 500,
  aggregateValidityHours: 24,
} as const

export type RiskRecordRow = {
  id: string
  project_profile_id: string | null
  benchmark_segment_id: string | null
  source_project_code: string | null
  country: DataMoatCountry
  project_type: string
  lifecycle_phase: BenchmarkLifecyclePhase
  confidence_weight: number
  risk_category: RiskLearningCategory
  risk_subcategory: RiskLearningSubcategory
  risk_title: string
  risk_description: string | null
  initial_probability: number | null
  initial_impact_score: number | null
  initial_risk_score: number | null
  current_probability: number | null
  current_impact_score: number | null
  current_risk_score: number | null
  status: RiskRecordStatus
  source_status: RiskSourceStatus
  cold_storage_ready: boolean
  cold_storage_threshold_projects: number
  snapshot_at: string
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export type RiskPredictionRow = {
  id: string
  risk_record_id: string
  prediction_model_code: string
  predicted_probability: number
  predicted_impact_score: number
  predicted_risk_score: number
  prediction_horizon_days: number | null
  confidence_score: number | null
  confidence_weight: number
  inputs: Record<string, unknown>
  predicted_at: string
  metadata: Record<string, unknown>
  created_at: string
}

export type RiskObservationRow = {
  id: string
  risk_record_id: string
  observation_type: RiskObservationType
  observed_status: RiskObservedStatus
  observed_probability: number | null
  observed_impact_score: number | null
  observed_cost_impact: number | null
  observed_delay_days: number | null
  inferred_automatically: boolean
  reminder_status: RiskReminderStatus
  blocks_project_closure: boolean
  human_confirmed: boolean
  confirmed_by: string | null
  confirmed_at: string | null
  observed_at: string
  evidence: Record<string, unknown>
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export type RiskDeviationRow = {
  id: string
  risk_record_id: string
  risk_prediction_id: string | null
  risk_observation_id: string | null
  predicted_risk_score: number | null
  observed_risk_score: number | null
  score_deviation_points: number | null
  probability_deviation: number | null
  impact_deviation_points: number | null
  cost_deviation_amount: number | null
  timeline_deviation_days: number | null
  deviation_reason: string | null
  confidence_weight: number
  observed_at: string
  metadata: Record<string, unknown>
  created_at: string
}

export type RiskPropagationRow = {
  id: string
  source_risk_record_id: string
  impacted_risk_record_id: string | null
  propagation_target: RiskPropagationTarget
  propagation_type: RiskPropagationType
  propagation_probability: number
  propagated_impact_score: number | null
  propagated_cost_amount: number | null
  propagated_delay_days: number | null
  confidence_weight: number
  metadata: Record<string, unknown>
  created_at: string
}

export type RiskPatternRow = {
  id: string
  pattern_code: string
  benchmark_segment_id: string | null
  country: DataMoatCountry
  project_type: string
  risk_category: RiskLearningCategory
  risk_subcategory: RiskLearningSubcategory
  pattern_name: string
  recurrence_rate: number
  average_impact_score: number | null
  average_cost_impact: number | null
  average_delay_days: number | null
  sample_size: number
  confidence_tier: BenchmarkConfidenceTier
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export type SupplierRiskProfileRow = {
  id: string
  supplier_id: string | null
  benchmark_segment_id: string | null
  country: DataMoatCountry | null
  specialty_code: string | null
  risk_category: RiskLearningCategory
  observed_events: number
  materialized_events: number
  average_risk_score: number | null
  average_delay_days: number | null
  average_cost_impact: number | null
  critical_event_rate: number
  confidence_weight: number
  observed_at: string
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export type MacroRiskContextRow = {
  id: string
  context_code: string
  country: DataMoatCountry
  region: string | null
  risk_category: RiskLearningCategory
  risk_subcategory: RiskLearningSubcategory
  context_name: string
  severity_score: number
  probability: number
  source_mode: MacroRiskSourceMode
  approval_status: HumanApprovalStatus
  approved_by: string | null
  approved_at: string | null
  valid_from: string
  valid_to: string | null
  evidence: Record<string, unknown>
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export type RiskCalibrationRow = {
  id: string
  calibration_code: string
  benchmark_segment_id: string | null
  risk_category: RiskLearningCategory
  risk_subcategory: RiskLearningSubcategory | null
  model_code: string
  previous_factor: number
  proposed_factor: number
  calibration_delta_percent: number
  requires_human_approval: boolean
  approval_status: RiskCalibrationApprovalStatus
  approved_by: string | null
  approved_at: string | null
  sample_size: number
  confidence_tier: BenchmarkConfidenceTier
  calibrated_at: string
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export type RiskAggregateRow = {
  id: string
  benchmark_segment_id: string
  risk_category: RiskLearningCategory
  risk_subcategory: RiskLearningSubcategory | null
  metric_name: string
  metric_unit: string
  sample_size: number
  weighted_sample_size: number
  p25_value: number | null
  median_value: number | null
  p75_value: number | null
  average_value: number | null
  min_value: number | null
  max_value: number | null
  confidence_tier: BenchmarkConfidenceTier
  serving_status: BenchmarkServingStatus
  serving_warning: string | null
  min_projects_to_serve: number
  low_confidence_until_projects: number
  computed_at: string
  valid_until: string
  aggregation_window_days: number
  cold_storage_threshold_projects: number
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}
