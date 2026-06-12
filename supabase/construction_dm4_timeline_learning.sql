create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'benchmark_confidence_tier') then
    create type public.benchmark_confidence_tier as enum ('insuficiente', 'baixa', 'média', 'alta', 'muito_alta');
  end if;
end $$;

create table if not exists public.timeline_records (
  id uuid primary key default gen_random_uuid(),
  project_profile_id uuid references public.project_profiles(id) on delete set null,
  benchmark_segment_id uuid references public.benchmark_segments(id) on delete set null,
  source_project_code text,
  country text not null check (country in ('Portugal', 'Franca', 'Espanha')),
  project_type text not null,
  lifecycle_phase text not null default 'conceção' check (lifecycle_phase in ('conceção', 'execução', 'concluído')),
  confidence_weight numeric(4, 3) not null default 0.300 check (confidence_weight in (0.300, 0.600, 1.000)),
  planned_start_date date,
  planned_end_date date,
  actual_start_date date,
  actual_end_date date,
  planned_duration_days integer,
  actual_duration_days integer,
  schedule_deviation_days integer,
  schedule_deviation_percent numeric(10, 4),
  source_status text not null default 'warm' check (source_status in ('warm', 'cold_ready', 'archived')),
  cold_storage_ready boolean not null default false,
  cold_storage_threshold_projects integer not null default 500,
  snapshot_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.phase_records (
  id uuid primary key default gen_random_uuid(),
  timeline_record_id uuid not null references public.timeline_records(id) on delete cascade,
  phase_code text not null,
  phase_name text not null,
  phase_order integer not null default 0,
  is_major_phase boolean not null default false,
  is_critical_path boolean not null default false,
  planned_start_date date,
  planned_end_date date,
  actual_start_date date,
  actual_end_date date,
  planned_duration_days integer,
  actual_duration_days integer,
  completion_percent numeric(6, 3) not null default 0 check (completion_percent between 0 and 100),
  confidence_weight numeric(4, 3) not null default 0.300 check (confidence_weight > 0 and confidence_weight <= 1),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (timeline_record_id, phase_code)
);

create table if not exists public.delay_records (
  id uuid primary key default gen_random_uuid(),
  timeline_record_id uuid not null references public.timeline_records(id) on delete cascade,
  phase_record_id uuid references public.phase_records(id) on delete set null,
  supplier_id uuid references public.suppliers(id) on delete set null,
  delay_days integer not null default 0,
  delay_severity text not null default 'medium' check (delay_severity in ('low', 'medium', 'high', 'critical')),
  is_critical_path_delay boolean not null default false,
  suggested_delay_cause_primary text,
  delay_cause_primary text,
  delay_cause_confirmation_status text not null default 'pending' check (delay_cause_confirmation_status in ('pending', 'confirmed', 'rejected', 'overridden')),
  delay_cause_suggested_by text not null default 'platform',
  delay_cause_confirmed_by text,
  delay_cause_confirmed_at timestamptz,
  observed_at timestamptz not null default now(),
  confidence_weight numeric(4, 3) not null default 0.300 check (confidence_weight > 0 and confidence_weight <= 1),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.delay_propagations (
  id uuid primary key default gen_random_uuid(),
  source_delay_record_id uuid not null references public.delay_records(id) on delete cascade,
  source_phase_record_id uuid references public.phase_records(id) on delete set null,
  impacted_phase_record_id uuid references public.phase_records(id) on delete set null,
  propagation_type text not null default 'finish_to_start' check (propagation_type in ('finish_to_start', 'resource_dependency', 'supplier_dependency', 'permit_dependency', 'weather_dependency', 'manual')),
  propagated_delay_days integer not null default 0,
  propagation_probability numeric(6, 4) not null default 0.5000 check (propagation_probability between 0 and 1),
  is_critical_path_impact boolean not null default false,
  confidence_weight numeric(4, 3) not null default 0.300 check (confidence_weight > 0 and confidence_weight <= 1),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.critical_path_snapshots (
  id uuid primary key default gen_random_uuid(),
  timeline_record_id uuid not null references public.timeline_records(id) on delete cascade,
  trigger_event text not null check (trigger_event in ('project_entered', 'critical_path_delay', 'major_phase_completed')),
  trigger_delay_record_id uuid references public.delay_records(id) on delete set null,
  trigger_phase_record_id uuid references public.phase_records(id) on delete set null,
  critical_phase_codes text[] not null default '{}',
  critical_path_duration_days integer,
  total_float_days integer,
  projected_completion_date date,
  projected_delay_days integer not null default 0,
  snapshot_payload jsonb not null default '{}'::jsonb,
  confidence_weight numeric(4, 3) not null default 0.300 check (confidence_weight > 0 and confidence_weight <= 1),
  snapshot_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.supplier_delay_profiles (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid references public.suppliers(id) on delete cascade,
  benchmark_segment_id uuid references public.benchmark_segments(id) on delete set null,
  country text check (country in ('Portugal', 'Franca', 'Espanha')),
  specialty_code text,
  observed_deliveries integer not null default 0,
  delayed_deliveries integer not null default 0,
  average_delay_days numeric(10, 4),
  p75_delay_days numeric(10, 4),
  critical_delay_rate numeric(8, 4) not null default 0 check (critical_delay_rate between 0 and 1),
  confidence_weight numeric(4, 3) not null default 0.300 check (confidence_weight > 0 and confidence_weight <= 1),
  observed_at date not null default current_date,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (supplier_id, benchmark_segment_id, specialty_code, observed_at)
);

create table if not exists public.delay_patterns (
  id uuid primary key default gen_random_uuid(),
  pattern_code text not null unique,
  benchmark_segment_id uuid references public.benchmark_segments(id) on delete set null,
  country text not null check (country in ('Portugal', 'Franca', 'Espanha')),
  project_type text not null,
  phase_code text,
  delay_cause_primary text not null,
  recurrence_rate numeric(8, 4) not null default 0 check (recurrence_rate between 0 and 1),
  recurrent_threshold numeric(8, 4) not null default 0.2000 check (recurrent_threshold between 0 and 1),
  is_recurrent boolean generated always as (recurrence_rate >= recurrent_threshold) stored,
  average_delay_days numeric(10, 4),
  p75_delay_days numeric(10, 4),
  sample_size integer not null default 0,
  confidence_tier public.benchmark_confidence_tier not null default 'insuficiente',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.seasonal_profiles (
  id uuid primary key default gen_random_uuid(),
  profile_code text not null unique,
  country text not null check (country in ('Portugal', 'Franca', 'Espanha')),
  region text,
  season_name text not null,
  month_start integer not null check (month_start between 1 and 12),
  month_end integer not null check (month_end between 1 and 12),
  affected_phase_codes text[] not null default '{}',
  delay_multiplier numeric(8, 4) not null default 1,
  average_delay_days numeric(10, 4),
  confidence_tier public.benchmark_confidence_tier not null default 'insuficiente',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.timeline_aggregates (
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
  recurrent_pattern_threshold numeric(8, 4) not null default 0.2000,
  computed_at timestamp not null default (now() at time zone 'utc'),
  valid_until timestamp generated always as (computed_at + interval '24 hours') stored,
  aggregation_window_days integer not null default 365,
  cold_storage_threshold_projects integer not null default 500,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (benchmark_segment_id, metric_name, computed_at)
);

create index if not exists timeline_records_segment_snapshot_idx on public.timeline_records(benchmark_segment_id, snapshot_at desc);
create index if not exists timeline_records_snapshot_at_idx on public.timeline_records(snapshot_at);
create index if not exists timeline_records_country_type_idx on public.timeline_records(country, project_type);
create index if not exists timeline_records_lifecycle_idx on public.timeline_records(lifecycle_phase, confidence_weight);
create index if not exists phase_records_timeline_order_idx on public.phase_records(timeline_record_id, phase_order);
create index if not exists phase_records_critical_idx on public.phase_records(timeline_record_id, is_critical_path);
create index if not exists delay_records_timeline_observed_idx on public.delay_records(timeline_record_id, observed_at desc);
create index if not exists delay_records_phase_idx on public.delay_records(phase_record_id);
create index if not exists delay_records_supplier_idx on public.delay_records(supplier_id);
create index if not exists delay_records_cause_confirmation_idx on public.delay_records(delay_cause_primary, delay_cause_confirmation_status);
create index if not exists delay_records_critical_idx on public.delay_records(is_critical_path_delay, delay_severity);
create index if not exists delay_propagations_source_idx on public.delay_propagations(source_delay_record_id);
create index if not exists delay_propagations_impacted_phase_idx on public.delay_propagations(impacted_phase_record_id);
create index if not exists critical_path_snapshots_timeline_event_idx on public.critical_path_snapshots(timeline_record_id, trigger_event, snapshot_at desc);
create index if not exists critical_path_snapshots_snapshot_at_idx on public.critical_path_snapshots(snapshot_at desc);
create index if not exists supplier_delay_profiles_supplier_idx on public.supplier_delay_profiles(supplier_id);
create index if not exists supplier_delay_profiles_segment_idx on public.supplier_delay_profiles(benchmark_segment_id, specialty_code);
create index if not exists delay_patterns_segment_cause_idx on public.delay_patterns(benchmark_segment_id, delay_cause_primary);
create index if not exists delay_patterns_recurrent_idx on public.delay_patterns(is_recurrent, recurrence_rate);
create index if not exists seasonal_profiles_country_month_idx on public.seasonal_profiles(country, month_start, month_end);
create index if not exists timeline_aggregates_segment_metric_valid_idx on public.timeline_aggregates(benchmark_segment_id, metric_name, valid_until);
create index if not exists timeline_aggregates_confidence_idx on public.timeline_aggregates(confidence_tier, serving_status);

insert into public.benchmark_segments (segment_code, country, project_type, area_band, quality_segment, complexity_band, metadata)
values
  ('BM-PT-MORADIA-100-300-NORMAL-MEDIUM', 'Portugal', 'moradia', '100-300', 'normal', 'medium', '{"seed":"dm4","domain":"timeline"}'),
  ('BM-FR-HOTEL-1000-5000-PREMIUM-HIGH', 'Franca', 'hotel', '1000-5000', 'premium', 'high', '{"seed":"dm4","domain":"timeline"}'),
  ('BM-ES-REMODELACAO-50-200-NORMAL-MEDIUM', 'Espanha', 'remodelacao', '50-200', 'normal', 'medium', '{"seed":"dm4","domain":"timeline"}')
on conflict (segment_code) do update set
  country = excluded.country,
  project_type = excluded.project_type,
  area_band = excluded.area_band,
  quality_segment = excluded.quality_segment,
  complexity_band = excluded.complexity_band,
  metadata = public.benchmark_segments.metadata || excluded.metadata,
  updated_at = now();

insert into public.seasonal_profiles (
  profile_code,
  country,
  region,
  season_name,
  month_start,
  month_end,
  affected_phase_codes,
  delay_multiplier,
  average_delay_days,
  confidence_tier,
  metadata
)
values
  ('DM4-SEASON-PT-WINTER-RAIN-V1', 'Portugal', null, 'winter_rain', 11, 2, array['earthworks', 'structure', 'facade'], 1.1800, 6.5000, 'baixa', '{"seed":"dm4","label":"Portugal inverno chuva"}'),
  ('DM4-SEASON-FR-AUGUST-SLOWDOWN-V1', 'Franca', null, 'august_slowdown', 8, 8, array['procurement', 'mep', 'finishes'], 1.2200, 8.0000, 'baixa', '{"seed":"dm4","label":"França agosto"}'),
  ('DM4-SEASON-ES-SUMMER-HEAT-V1', 'Espanha', null, 'summer_heat', 7, 8, array['structure', 'facade', 'roofing'], 1.1500, 5.0000, 'baixa', '{"seed":"dm4","label":"Espanha verão calor"}')
on conflict (profile_code) do update set
  delay_multiplier = excluded.delay_multiplier,
  average_delay_days = excluded.average_delay_days,
  confidence_tier = excluded.confidence_tier,
  metadata = public.seasonal_profiles.metadata || excluded.metadata,
  updated_at = now();

insert into public.delay_patterns (
  pattern_code,
  benchmark_segment_id,
  country,
  project_type,
  phase_code,
  delay_cause_primary,
  recurrence_rate,
  average_delay_days,
  p75_delay_days,
  sample_size,
  confidence_tier,
  metadata
)
select
  seed.pattern_code,
  s.id,
  seed.country,
  seed.project_type,
  seed.phase_code,
  seed.delay_cause_primary,
  seed.recurrence_rate,
  seed.average_delay_days,
  seed.p75_delay_days,
  seed.sample_size,
  seed.confidence_tier::public.benchmark_confidence_tier,
  jsonb_build_object('seed', 'dm4', 'auto_suggested_then_human_confirmed', true)
from public.benchmark_segments s
join (
  values
    ('DM4-PATTERN-PT-PERMIT-MORADIA-V1', 'BM-PT-MORADIA-100-300-NORMAL-MEDIUM', 'Portugal', 'moradia', 'permit', 'licenciamento', 0.2400, 14.0000, 22.0000, 12, 'baixa'),
    ('DM4-PATTERN-FR-PROCUREMENT-HOTEL-V1', 'BM-FR-HOTEL-1000-5000-PREMIUM-HIGH', 'Franca', 'hotel', 'procurement', 'fornecedor', 0.3100, 18.0000, 30.0000, 18, 'média'),
    ('DM4-PATTERN-ES-FINISHES-REMODELACAO-V1', 'BM-ES-REMODELACAO-50-200-NORMAL-MEDIUM', 'Espanha', 'remodelacao', 'finishes', 'alteracoes_cliente', 0.2100, 7.5000, 12.0000, 16, 'média')
) as seed(pattern_code, segment_code, country, project_type, phase_code, delay_cause_primary, recurrence_rate, average_delay_days, p75_delay_days, sample_size, confidence_tier)
  on seed.segment_code = s.segment_code
on conflict (pattern_code) do update set
  recurrence_rate = excluded.recurrence_rate,
  average_delay_days = excluded.average_delay_days,
  p75_delay_days = excluded.p75_delay_days,
  sample_size = excluded.sample_size,
  confidence_tier = excluded.confidence_tier,
  metadata = public.delay_patterns.metadata || excluded.metadata,
  updated_at = now();

insert into public.timeline_aggregates (
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
  jsonb_build_object('seed', 'dm4', 'daily_recalculation', true, 'realtime', false, 'event_driven_snapshots', true)
from public.benchmark_segments s
join (
  values
    ('BM-PT-MORADIA-100-300-NORMAL-MEDIUM', 'planned_duration_days', 'days', 4, 2.7000, 180.0000, 210.0000, 245.0000, 218.0000, 160.0000, 280.0000, 'insuficiente', 'blocked', 'Menos de 5 projetos: benchmark de prazo nao deve ser servido.'),
    ('BM-FR-HOTEL-1000-5000-PREMIUM-HIGH', 'critical_path_delay_days', 'days', 11, 8.2000, 12.0000, 21.0000, 36.0000, 24.0000, 5.0000, 55.0000, 'baixa', 'low_confidence', 'Entre 5 e 15 projetos: servir com aviso de baixa confianca.'),
    ('BM-ES-REMODELACAO-50-200-NORMAL-MEDIUM', 'actual_duration_days', 'days', 26, 21.0000, 58.0000, 76.0000, 101.0000, 81.0000, 42.0000, 130.0000, 'média', 'serving', null)
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
  metadata = public.timeline_aggregates.metadata || excluded.metadata,
  updated_at = now();
