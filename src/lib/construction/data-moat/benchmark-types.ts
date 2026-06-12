import type { DataMoatCountry, DataMoatSegment } from "./types"

export type BenchmarkConfidenceTier = "insuficiente" | "baixa" | "média" | "alta" | "muito_alta"

export type BenchmarkServingStatus = "blocked" | "low_confidence" | "serving"

export type BenchmarkLifecyclePhase = "conceção" | "execução" | "concluído"

export type BenchmarkSourceStatus = "warm" | "cold_ready" | "archived"

export type BenchmarkSignalDirection = "positive" | "negative" | "neutral"

export type BenchmarkForecastType = "cost" | "timeline" | "complexity" | "confidence"

export const benchmarkConfidenceWeights: Record<BenchmarkLifecyclePhase, number> = {
  conceção: 0.3,
  execução: 0.6,
  concluído: 1,
}

export const benchmarkThresholds = {
  minProjectsToServe: 5,
  lowConfidenceUntilProjects: 15,
  coldStorageReadyFromProjects: 500,
  aggregateValidityHours: 24,
} as const

export type BenchmarkSegmentRow = {
  id: string
  segment_code: string
  country: DataMoatCountry
  project_type: string
  area_band: string
  quality_segment: DataMoatSegment
  complexity_band: "low" | "medium" | "high" | "critical"
  is_active: boolean
  cold_storage_ready: boolean
  cold_storage_threshold_projects: number
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export type ProjectProfileRow = {
  id: string
  project_id: string | null
  benchmark_segment_id: string | null
  source_project_code: string | null
  country: DataMoatCountry
  project_type: string
  city: string | null
  area_m2: number | null
  lifecycle_phase: BenchmarkLifecyclePhase
  confidence_weight: number
  document_maturity_score: number | null
  source_completeness_score: number | null
  is_complete: boolean
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export type BenchmarkRecordRow = {
  id: string
  project_profile_id: string
  benchmark_segment_id: string | null
  metric_name: string
  metric_value: number
  metric_unit: string
  confidence_weight: number
  snapshot_at: string
  source_status: BenchmarkSourceStatus
  metadata: Record<string, unknown>
  created_at: string
}

export type CostDeviationRow = {
  id: string
  benchmark_record_id: string | null
  project_profile_id: string
  benchmark_segment_id: string | null
  cost_category: string
  baseline_cost: number | null
  actual_cost: number | null
  deviation_percent: number | null
  deviation_reason: string | null
  confidence_weight: number
  observed_at: string
  metadata: Record<string, unknown>
  created_at: string
}

export type TimelineDeviationRow = {
  id: string
  benchmark_record_id: string | null
  project_profile_id: string
  benchmark_segment_id: string | null
  phase_name: string
  planned_days: number | null
  actual_days: number | null
  deviation_percent: number | null
  delay_days: number | null
  deviation_reason: string | null
  confidence_weight: number
  observed_at: string
  metadata: Record<string, unknown>
  created_at: string
}

export type ComplexityScoreRow = {
  id: string
  project_profile_id: string
  benchmark_segment_id: string | null
  score: number
  complexity_band: "low" | "medium" | "high" | "critical"
  drivers: Array<unknown>
  confidence_weight: number
  scored_at: string
  metadata: Record<string, unknown>
}

export type BenchmarkAggregateRow = {
  id: string
  benchmark_segment_id: string
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
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export type LearningSignalRow = {
  id: string
  project_profile_id: string | null
  benchmark_segment_id: string | null
  signal_type: string
  signal_strength: number
  signal_direction: BenchmarkSignalDirection
  confidence_weight: number
  evidence: Record<string, unknown>
  observed_at: string
  metadata: Record<string, unknown>
  created_at: string
}

export type ConfidenceModelRow = {
  id: string
  model_code: string
  name: string
  model_version: string
  country: DataMoatCountry | null
  project_type: string | null
  min_projects_to_serve: number
  low_confidence_until_projects: number
  phase_weights: Record<BenchmarkLifecyclePhase, number>
  confidence_tier_rules: Record<string, unknown>
  is_active: boolean
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export type ForecastCalibrationRow = {
  id: string
  confidence_model_id: string | null
  benchmark_segment_id: string | null
  calibration_code: string
  forecast_type: BenchmarkForecastType
  baseline_error_percent: number | null
  calibrated_error_percent: number | null
  calibration_factor: number
  sample_size: number
  confidence_tier: BenchmarkConfidenceTier
  calibrated_at: string
  valid_from: string
  valid_to: string | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}
