create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'benchmark_confidence_tier') then
    create type public.benchmark_confidence_tier as enum ('insuficiente', 'baixa', 'média', 'alta', 'muito_alta');
  end if;
end $$;

create table if not exists public.benchmark_segments (
  id uuid primary key default gen_random_uuid(),
  segment_code text not null unique,
  country text not null check (country in ('Portugal', 'Franca', 'Espanha')),
  project_type text not null,
  area_band text not null,
  quality_segment text not null default 'normal' check (quality_segment in ('economic', 'normal', 'premium')),
  complexity_band text not null default 'medium' check (complexity_band in ('low', 'medium', 'high', 'critical')),
  is_active boolean not null default true,
  cold_storage_ready boolean not null default false,
  cold_storage_threshold_projects integer not null default 500,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (country, project_type, area_band, quality_segment, complexity_band)
);

create table if not exists public.project_profiles (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.construction_projects(id) on delete set null,
  benchmark_segment_id uuid references public.benchmark_segments(id) on delete set null,
  source_project_code text,
  country text not null check (country in ('Portugal', 'Franca', 'Espanha')),
  project_type text not null,
  city text,
  area_m2 numeric(12, 2),
  lifecycle_phase text not null default 'conceção' check (lifecycle_phase in ('conceção', 'execução', 'concluído')),
  confidence_weight numeric(4, 3) not null default 0.300 check (confidence_weight in (0.300, 0.600, 1.000)),
  document_maturity_score integer check (document_maturity_score between 0 and 100),
  source_completeness_score integer check (source_completeness_score between 0 and 100),
  is_complete boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id)
);

create table if not exists public.benchmark_records (
  id uuid primary key default gen_random_uuid(),
  project_profile_id uuid not null references public.project_profiles(id) on delete cascade,
  benchmark_segment_id uuid references public.benchmark_segments(id) on delete set null,
  metric_name text not null,
  metric_value numeric(14, 4) not null,
  metric_unit text not null,
  confidence_weight numeric(4, 3) not null check (confidence_weight > 0 and confidence_weight <= 1),
  snapshot_at timestamptz not null default now(),
  source_status text not null default 'warm' check (source_status in ('warm', 'cold_ready', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.cost_deviations (
  id uuid primary key default gen_random_uuid(),
  benchmark_record_id uuid references public.benchmark_records(id) on delete cascade,
  project_profile_id uuid not null references public.project_profiles(id) on delete cascade,
  benchmark_segment_id uuid references public.benchmark_segments(id) on delete set null,
  cost_category text not null,
  baseline_cost numeric(14, 2),
  actual_cost numeric(14, 2),
  deviation_percent numeric(10, 4),
  deviation_reason text,
  confidence_weight numeric(4, 3) not null default 0.300 check (confidence_weight > 0 and confidence_weight <= 1),
  observed_at date not null default current_date,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.timeline_deviations (
  id uuid primary key default gen_random_uuid(),
  benchmark_record_id uuid references public.benchmark_records(id) on delete cascade,
  project_profile_id uuid not null references public.project_profiles(id) on delete cascade,
  benchmark_segment_id uuid references public.benchmark_segments(id) on delete set null,
  phase_name text not null,
  planned_days integer,
  actual_days integer,
  deviation_percent numeric(10, 4),
  delay_days integer,
  deviation_reason text,
  confidence_weight numeric(4, 3) not null default 0.300 check (confidence_weight > 0 and confidence_weight <= 1),
  observed_at date not null default current_date,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.complexity_scores (
  id uuid primary key default gen_random_uuid(),
  project_profile_id uuid not null references public.project_profiles(id) on delete cascade,
  benchmark_segment_id uuid references public.benchmark_segments(id) on delete set null,
  score integer not null check (score between 0 and 100),
  complexity_band text not null check (complexity_band in ('low', 'medium', 'high', 'critical')),
  drivers jsonb not null default '[]'::jsonb,
  confidence_weight numeric(4, 3) not null default 0.300 check (confidence_weight > 0 and confidence_weight <= 1),
  scored_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.benchmark_aggregates (
  id uuid primary key default gen_random_uuid(),
  benchmark_segment_id uuid not null references public.benchmark_segments(id) on delete cascade,
  metric_name text not null,
  metric_unit text not null,
  sample_size integer not null default 0,
  weighted_sample_size numeric(12, 4) not null default 0,
  p25_value numeric(14, 4),
  median_value numeric(14, 4),
  p75_value numeric(14, 4),
  average_value numeric(14, 4),
  min_value numeric(14, 4),
  max_value numeric(14, 4),
  confidence_tier public.benchmark_confidence_tier not null default 'insuficiente',
  serving_status text not null default 'blocked' check (serving_status in ('blocked', 'low_confidence', 'serving')),
  serving_warning text,
  min_projects_to_serve integer not null default 5,
  low_confidence_until_projects integer not null default 15,
  computed_at timestamp not null default (now() at time zone 'utc'),
  valid_until timestamp generated always as (computed_at + interval '24 hours') stored,
  aggregation_window_days integer not null default 365,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (benchmark_segment_id, metric_name, computed_at)
);

create table if not exists public.learning_signals (
  id uuid primary key default gen_random_uuid(),
  project_profile_id uuid references public.project_profiles(id) on delete cascade,
  benchmark_segment_id uuid references public.benchmark_segments(id) on delete set null,
  signal_type text not null,
  signal_strength numeric(8, 4) not null default 0,
  signal_direction text not null default 'neutral' check (signal_direction in ('positive', 'negative', 'neutral')),
  confidence_weight numeric(4, 3) not null default 0.300 check (confidence_weight > 0 and confidence_weight <= 1),
  evidence jsonb not null default '{}'::jsonb,
  observed_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.confidence_models (
  id uuid primary key default gen_random_uuid(),
  model_code text not null unique,
  name text not null,
  model_version text not null default 'v1',
  country text check (country in ('Portugal', 'Franca', 'Espanha')),
  project_type text,
  min_projects_to_serve integer not null default 5,
  low_confidence_until_projects integer not null default 15,
  phase_weights jsonb not null default '{"conceção":0.3,"execução":0.6,"concluído":1.0}'::jsonb,
  confidence_tier_rules jsonb not null default '{"insuficiente":{"max_projects":4},"baixa":{"min_projects":5,"max_projects":15},"média":{"min_projects":16,"max_projects":40},"alta":{"min_projects":41,"max_projects":120},"muito_alta":{"min_projects":121}}'::jsonb,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.forecast_calibrations (
  id uuid primary key default gen_random_uuid(),
  confidence_model_id uuid references public.confidence_models(id) on delete set null,
  benchmark_segment_id uuid references public.benchmark_segments(id) on delete set null,
  calibration_code text not null unique,
  forecast_type text not null check (forecast_type in ('cost', 'timeline', 'complexity', 'confidence')),
  baseline_error_percent numeric(10, 4),
  calibrated_error_percent numeric(10, 4),
  calibration_factor numeric(10, 4) not null default 1,
  sample_size integer not null default 0,
  confidence_tier public.benchmark_confidence_tier not null default 'insuficiente',
  calibrated_at timestamptz not null default now(),
  valid_from date not null default current_date,
  valid_to date,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists benchmark_segments_country_type_idx on public.benchmark_segments(country, project_type);
create index if not exists benchmark_segments_active_idx on public.benchmark_segments(is_active);
create index if not exists project_profiles_segment_idx on public.project_profiles(benchmark_segment_id);
create index if not exists project_profiles_country_type_idx on public.project_profiles(country, project_type);
create index if not exists project_profiles_lifecycle_idx on public.project_profiles(lifecycle_phase, confidence_weight);
create index if not exists benchmark_records_segment_metric_idx on public.benchmark_records(benchmark_segment_id, metric_name);
create index if not exists benchmark_records_profile_idx on public.benchmark_records(project_profile_id);
create index if not exists benchmark_records_snapshot_at_idx on public.benchmark_records(snapshot_at);
create index if not exists cost_deviations_segment_category_idx on public.cost_deviations(benchmark_segment_id, cost_category);
create index if not exists cost_deviations_profile_idx on public.cost_deviations(project_profile_id);
create index if not exists timeline_deviations_segment_phase_idx on public.timeline_deviations(benchmark_segment_id, phase_name);
create index if not exists timeline_deviations_profile_idx on public.timeline_deviations(project_profile_id);
create index if not exists complexity_scores_segment_band_idx on public.complexity_scores(benchmark_segment_id, complexity_band);
create index if not exists benchmark_aggregates_segment_metric_valid_idx on public.benchmark_aggregates(benchmark_segment_id, metric_name, valid_until);
create index if not exists benchmark_aggregates_confidence_idx on public.benchmark_aggregates(confidence_tier, serving_status);
create index if not exists learning_signals_segment_type_idx on public.learning_signals(benchmark_segment_id, signal_type);
create index if not exists learning_signals_observed_at_idx on public.learning_signals(observed_at desc);
create index if not exists confidence_models_active_idx on public.confidence_models(is_active, country, project_type);
create index if not exists forecast_calibrations_segment_type_idx on public.forecast_calibrations(benchmark_segment_id, forecast_type);
create index if not exists forecast_calibrations_validity_idx on public.forecast_calibrations(valid_from, valid_to);

insert into public.benchmark_segments (segment_code, country, project_type, area_band, quality_segment, complexity_band, metadata)
values
  ('BM-PT-MORADIA-100-300-NORMAL-MEDIUM', 'Portugal', 'moradia', '100-300', 'normal', 'medium', '{"seed":"dm3","market":"Portugal"}'),
  ('BM-FR-HOTEL-1000-5000-PREMIUM-HIGH', 'Franca', 'hotel', '1000-5000', 'premium', 'high', '{"seed":"dm3","market":"Franca"}'),
  ('BM-ES-REMODELACAO-50-200-NORMAL-MEDIUM', 'Espanha', 'remodelacao', '50-200', 'normal', 'medium', '{"seed":"dm3","market":"Espanha"}')
on conflict (segment_code) do update set
  country = excluded.country,
  project_type = excluded.project_type,
  area_band = excluded.area_band,
  quality_segment = excluded.quality_segment,
  complexity_band = excluded.complexity_band,
  metadata = public.benchmark_segments.metadata || excluded.metadata,
  updated_at = now();

insert into public.confidence_models (model_code, name, country, project_type, metadata)
values
  ('DM3-CONFIDENCE-GLOBAL-V1', 'DM-3 Global confidence thresholds', null, null, '{"seed":"dm3","realtime":false,"aggregate_recalculation":"daily"}'),
  ('DM3-CONFIDENCE-PT-MORADIA-V1', 'DM-3 Portugal moradia confidence model', 'Portugal', 'moradia', '{"seed":"dm3"}'),
  ('DM3-CONFIDENCE-FR-HOTEL-V1', 'DM-3 Franca hotel confidence model', 'Franca', 'hotel', '{"seed":"dm3"}'),
  ('DM3-CONFIDENCE-ES-REMODELACAO-V1', 'DM-3 Espanha remodelacao confidence model', 'Espanha', 'remodelacao', '{"seed":"dm3"}')
on conflict (model_code) do update set
  name = excluded.name,
  country = excluded.country,
  project_type = excluded.project_type,
  metadata = public.confidence_models.metadata || excluded.metadata,
  updated_at = now();

insert into public.benchmark_aggregates (
  benchmark_segment_id,
  metric_name,
  metric_unit,
  sample_size,
  weighted_sample_size,
  p25_value,
  median_value,
  p75_value,
  average_value,
  min_value,
  max_value,
  confidence_tier,
  serving_status,
  serving_warning,
  computed_at,
  metadata
)
select
  s.id,
  seed.metric_name,
  seed.metric_unit,
  seed.sample_size,
  seed.weighted_sample_size,
  seed.p25_value,
  seed.median_value,
  seed.p75_value,
  seed.average_value,
  seed.min_value,
  seed.max_value,
  seed.confidence_tier::public.benchmark_confidence_tier,
  seed.serving_status,
  seed.serving_warning,
  date_trunc('day', now() at time zone 'utc'),
  jsonb_build_object('seed', 'dm3', 'daily_recalculation', true, 'realtime', false)
from public.benchmark_segments s
join (
  values
    ('BM-PT-MORADIA-100-300-NORMAL-MEDIUM', 'cost_per_m2', 'EUR/m2', 4, 2.7000, 1120.0000, 1280.0000, 1450.0000, 1305.0000, 980.0000, 1650.0000, 'insuficiente', 'blocked', 'Menos de 5 projetos: benchmark nao deve ser servido.'),
    ('BM-FR-HOTEL-1000-5000-PREMIUM-HIGH', 'cost_per_m2', 'EUR/m2', 10, 7.6000, 2380.0000, 2750.0000, 3180.0000, 2815.0000, 2200.0000, 3520.0000, 'baixa', 'low_confidence', 'Entre 5 e 15 projetos: servir com aviso de baixa confianca.'),
    ('BM-ES-REMODELACAO-50-200-NORMAL-MEDIUM', 'timeline_days', 'days', 24, 19.4000, 72.0000, 91.0000, 118.0000, 96.0000, 54.0000, 145.0000, 'média', 'serving', null)
) as seed(segment_code, metric_name, metric_unit, sample_size, weighted_sample_size, p25_value, median_value, p75_value, average_value, min_value, max_value, confidence_tier, serving_status, serving_warning)
  on seed.segment_code = s.segment_code
on conflict (benchmark_segment_id, metric_name, computed_at) do update set
  sample_size = excluded.sample_size,
  weighted_sample_size = excluded.weighted_sample_size,
  p25_value = excluded.p25_value,
  median_value = excluded.median_value,
  p75_value = excluded.p75_value,
  average_value = excluded.average_value,
  min_value = excluded.min_value,
  max_value = excluded.max_value,
  confidence_tier = excluded.confidence_tier,
  serving_status = excluded.serving_status,
  serving_warning = excluded.serving_warning,
  metadata = public.benchmark_aggregates.metadata || excluded.metadata,
  updated_at = now();

insert into public.forecast_calibrations (
  confidence_model_id,
  benchmark_segment_id,
  calibration_code,
  forecast_type,
  baseline_error_percent,
  calibrated_error_percent,
  calibration_factor,
  sample_size,
  confidence_tier,
  metadata
)
select
  cm.id,
  bs.id,
  'DM3-CAL-' || bs.segment_code || '-COST-V1',
  'cost',
  18.5000,
  14.2500,
  0.9700,
  10,
  'baixa',
  '{"seed":"dm3","pending_real_observations":true}'::jsonb
from public.benchmark_segments bs
join public.confidence_models cm on cm.model_code = 'DM3-CONFIDENCE-GLOBAL-V1'
where bs.segment_code in ('BM-PT-MORADIA-100-300-NORMAL-MEDIUM', 'BM-FR-HOTEL-1000-5000-PREMIUM-HIGH', 'BM-ES-REMODELACAO-50-200-NORMAL-MEDIUM')
on conflict (calibration_code) do update set
  baseline_error_percent = excluded.baseline_error_percent,
  calibrated_error_percent = excluded.calibrated_error_percent,
  calibration_factor = excluded.calibration_factor,
  sample_size = excluded.sample_size,
  confidence_tier = excluded.confidence_tier,
  metadata = public.forecast_calibrations.metadata || excluded.metadata,
  updated_at = now();
