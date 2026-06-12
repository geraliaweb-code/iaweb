import type { BenchmarkConfidenceTier, BenchmarkLifecyclePhase, BenchmarkServingStatus } from "./benchmark-types"
import type { DataMoatCountry } from "./types"

export type TimelineSourceStatus = "warm" | "cold_ready" | "archived"

export type DelaySeverity = "low" | "medium" | "high" | "critical"

export type DelayCauseConfirmationStatus = "pending" | "confirmed" | "rejected" | "overridden"

export type DelayPropagationType =
  | "finish_to_start"
  | "resource_dependency"
  | "supplier_dependency"
  | "permit_dependency"
  | "weather_dependency"
  | "manual"

export type CriticalPathTriggerEvent = "project_entered" | "critical_path_delay" | "major_phase_completed"

export const timelineConfidenceWeights: Record<BenchmarkLifecyclePhase, number> = {
  conceção: 0.3,
  execução: 0.6,
  concluído: 1,
}

export const timelineLearningThresholds = {
  minProjectsToServe: 5,
  lowConfidenceUntilProjects: 15,
  recurrentPatternThreshold: 0.2,
  coldStorageReadyFromProjects: 500,
  aggregateValidityHours: 24,
} as const

export type TimelineRecordRow = {
  id: string
  project_profile_id: string | null
  benchmark_segment_id: string | null
  source_project_code: string | null
  country: DataMoatCountry
  project_type: string
  lifecycle_phase: BenchmarkLifecyclePhase
  confidence_weight: number
  planned_start_date: string | null
  planned_end_date: string | null
  actual_start_date: string | null
  actual_end_date: string | null
  planned_duration_days: number | null
  actual_duration_days: number | null
  schedule_deviation_days: number | null
  schedule_deviation_percent: number | null
  source_status: TimelineSourceStatus
  cold_storage_ready: boolean
  cold_storage_threshold_projects: number
  snapshot_at: string
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export type PhaseRecordRow = {
  id: string
  timeline_record_id: string
  phase_code: string
  phase_name: string
  phase_order: number
  is_major_phase: boolean
  is_critical_path: boolean
  planned_start_date: string | null
  planned_end_date: string | null
  actual_start_date: string | null
  actual_end_date: string | null
  planned_duration_days: number | null
  actual_duration_days: number | null
  completion_percent: number
  confidence_weight: number
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export type DelayRecordRow = {
  id: string
  timeline_record_id: string
  phase_record_id: string | null
  supplier_id: string | null
  delay_days: number
  delay_severity: DelaySeverity
  is_critical_path_delay: boolean
  suggested_delay_cause_primary: string | null
  delay_cause_primary: string | null
  delay_cause_confirmation_status: DelayCauseConfirmationStatus
  delay_cause_suggested_by: string
  delay_cause_confirmed_by: string | null
  delay_cause_confirmed_at: string | null
  observed_at: string
  confidence_weight: number
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export type DelayPropagationRow = {
  id: string
  source_delay_record_id: string
  source_phase_record_id: string | null
  impacted_phase_record_id: string | null
  propagation_type: DelayPropagationType
  propagated_delay_days: number
  propagation_probability: number
  is_critical_path_impact: boolean
  confidence_weight: number
  metadata: Record<string, unknown>
  created_at: string
}

export type CriticalPathSnapshotRow = {
  id: string
  timeline_record_id: string
  trigger_event: CriticalPathTriggerEvent
  trigger_delay_record_id: string | null
  trigger_phase_record_id: string | null
  critical_phase_codes: string[]
  critical_path_duration_days: number | null
  total_float_days: number | null
  projected_completion_date: string | null
  projected_delay_days: number
  snapshot_payload: Record<string, unknown>
  confidence_weight: number
  snapshot_at: string
  metadata: Record<string, unknown>
  created_at: string
}

export type SupplierDelayProfileRow = {
  id: string
  supplier_id: string | null
  benchmark_segment_id: string | null
  country: DataMoatCountry | null
  specialty_code: string | null
  observed_deliveries: number
  delayed_deliveries: number
  average_delay_days: number | null
  p75_delay_days: number | null
  critical_delay_rate: number
  confidence_weight: number
  observed_at: string
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export type DelayPatternRow = {
  id: string
  pattern_code: string
  benchmark_segment_id: string | null
  country: DataMoatCountry
  project_type: string
  phase_code: string | null
  delay_cause_primary: string
  recurrence_rate: number
  recurrent_threshold: number
  is_recurrent: boolean
  average_delay_days: number | null
  p75_delay_days: number | null
  sample_size: number
  confidence_tier: BenchmarkConfidenceTier
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export type SeasonalProfileRow = {
  id: string
  profile_code: string
  country: DataMoatCountry
  region: string | null
  season_name: string
  month_start: number
  month_end: number
  affected_phase_codes: string[]
  delay_multiplier: number
  average_delay_days: number | null
  confidence_tier: BenchmarkConfidenceTier
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export type TimelineAggregateRow = {
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
  recurrent_pattern_threshold: number
  computed_at: string
  valid_until: string
  aggregation_window_days: number
  cold_storage_threshold_projects: number
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}
