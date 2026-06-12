create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'quantity_type') then
    create type public.quantity_type as enum ('estimated', 'measured', 'executed');
  end if;

  if not exists (select 1 from pg_type where typname = 'quantity_area_source') then
    create type public.quantity_area_source as enum ('document', 'manual', 'inferred', 'unknown');
  end if;

  if not exists (select 1 from pg_type where typname = 'quantity_pattern_status') then
    create type public.quantity_pattern_status as enum ('seed', 'candidate', 'emerging', 'established', 'mature', 'reference');
  end if;

  if not exists (select 1 from pg_type where typname = 'quantity_serving_segment_level') then
    create type public.quantity_serving_segment_level as enum ('primary', 'secondary', 'tertiary', 'fallback');
  end if;
end $$;

create table if not exists public.specialty_quantities (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.construction_projects(id) on delete cascade,
  specialty_id text not null,
  country text not null check (country in ('Portugal', 'Franca', 'Espanha')),
  typology text not null,
  unit_type text not null,
  total_quantity numeric(18, 4) not null,
  area_m2_basis numeric(14, 4),
  quantity_per_m2 numeric(18, 8),
  quantity_per_unit numeric(18, 8),
  line_count integer not null default 0,
  completeness_score integer check (completeness_score between 0 and 100),
  extraction_confidence integer check (extraction_confidence between 0 and 100),
  normalization_confidence integer check (normalization_confidence between 0 and 100),
  specialty_qty_confidence integer check (specialty_qty_confidence between 0 and 100),
  quantity_type public.quantity_type not null default 'measured',
  area_source public.quantity_area_source not null default 'unknown',
  metadata jsonb not null default '{}'::jsonb,
  observed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quantity_patterns (
  id uuid primary key default gen_random_uuid(),
  segment_key text not null,
  typology text not null,
  country text not null check (country in ('Portugal', 'Franca', 'Espanha')),
  specialty_id text not null,
  unit_type text not null,
  scale_class public.quantity_project_scale_class not null,
  sample_count integer not null default 0,
  pattern_status public.quantity_pattern_status not null default 'seed',
  p10 numeric(18, 8),
  p25 numeric(18, 8),
  p50 numeric(18, 8),
  p75 numeric(18, 8),
  p90 numeric(18, 8),
  mean numeric(18, 8),
  std_dev numeric(18, 8),
  cv_pct numeric(10, 4),
  pattern_confidence numeric(6, 4) not null default 0 check (pattern_confidence between 0 and 1),
  high_variance_flag boolean not null default false,
  stale boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  computed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (segment_key, specialty_id, unit_type, scale_class)
);

create table if not exists public.quantity_benchmarks (
  id uuid primary key default gen_random_uuid(),
  pattern_id uuid references public.quantity_patterns(id) on delete set null,
  serving_segment_level public.quantity_serving_segment_level not null,
  benchmark_confidence numeric(6, 4) not null default 0 check (benchmark_confidence between 0 and 1),
  serving_blocked boolean not null default true,
  blocked_reason text,
  warnings jsonb not null default '[]'::jsonb,
  sample_count integer not null default 0,
  outlier_count integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  served_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.pattern_observations (
  id uuid primary key default gen_random_uuid(),
  pattern_id uuid not null references public.quantity_patterns(id) on delete cascade,
  specialty_qty_id uuid not null references public.specialty_quantities(id) on delete cascade,
  observation_weight numeric(8, 4) not null default 1 check (observation_weight >= 0 and observation_weight <= 1),
  included_in_calculation boolean not null default true,
  excluded_reason text,
  observed_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (pattern_id, specialty_qty_id)
);

create table if not exists public.learning_signals_qty (
  id uuid primary key default gen_random_uuid(),
  signal_type text not null,
  project_id uuid references public.construction_projects(id) on delete set null,
  specialty_id text not null,
  affected_patterns jsonb not null default '[]'::jsonb,
  delta_p50_pct numeric(10, 4) not null default 0,
  delta_confidence numeric(10, 4) not null default 0,
  triggered_at timestamptz not null default now(),
  processed_at timestamptz,
  action_taken text not null default 'queued',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.quantity_benchmark_segments (
  id uuid primary key default gen_random_uuid(),
  request_id text not null,
  project_id uuid references public.construction_projects(id) on delete set null,
  requested_segment text not null,
  served_segment text not null,
  segment_level_used public.quantity_serving_segment_level not null,
  fallback_reason text,
  served_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists specialty_quantities_project_idx on public.specialty_quantities(project_id);
create index if not exists specialty_quantities_segment_idx on public.specialty_quantities(country, typology, specialty_id, unit_type);
create index if not exists specialty_quantities_quality_idx on public.specialty_quantities(specialty_qty_confidence, quantity_type);
create index if not exists quantity_patterns_segment_idx on public.quantity_patterns(segment_key, specialty_id, unit_type);
create index if not exists quantity_patterns_confidence_idx on public.quantity_patterns(pattern_confidence, pattern_status);
create index if not exists quantity_benchmarks_pattern_idx on public.quantity_benchmarks(pattern_id, served_at desc);
create index if not exists pattern_observations_pattern_idx on public.pattern_observations(pattern_id, included_in_calculation);
create index if not exists pattern_observations_specialty_qty_idx on public.pattern_observations(specialty_qty_id);
create index if not exists learning_signals_qty_project_idx on public.learning_signals_qty(project_id, triggered_at desc);
create index if not exists learning_signals_qty_type_idx on public.learning_signals_qty(signal_type, processed_at);
create index if not exists quantity_benchmark_segments_request_idx on public.quantity_benchmark_segments(request_id);
create index if not exists quantity_benchmark_segments_project_idx on public.quantity_benchmark_segments(project_id, served_at desc);

insert into public.quantity_patterns (
  segment_key,
  typology,
  country,
  specialty_id,
  unit_type,
  scale_class,
  sample_count,
  pattern_status,
  p10,
  p25,
  p50,
  p75,
  p90,
  mean,
  std_dev,
  cv_pct,
  pattern_confidence,
  high_variance_flag,
  stale,
  metadata
)
values
  ('QTY-PT-INFRA-MEDIUM-DRAINAGE', 'infraestrutura', 'Portugal', 'drainage', 'm', 'medium', 8, 'candidate', 0.1800, 0.2200, 0.3100, 0.4200, 0.5800, 0.3400, 0.1200, 35.2900, 0.7200, true, false, '{"seed":"dm6b","pc_cap_under_10":0.85}'),
  ('QTY-FR-HOTEL-LARGE-CONCRETE', 'hotel', 'Franca', 'concrete', 'm3', 'large', 16, 'emerging', 0.1800, 0.2400, 0.3200, 0.4300, 0.5600, 0.3500, 0.1000, 28.5700, 0.7900, false, false, '{"seed":"dm6b"}'),
  ('QTY-ES-REMODELACAO-SMALL-STEEL', 'remodelacao', 'Espanha', 'steel', 'kg', 'small', 6, 'candidate', 4.5000, 5.8000, 7.2000, 9.1000, 11.0000, 7.6000, 2.1000, 27.6300, 0.6800, false, false, '{"seed":"dm6b","pc_cap_under_10":0.85}')
on conflict (segment_key, specialty_id, unit_type, scale_class) do update set
  sample_count = excluded.sample_count,
  pattern_status = excluded.pattern_status,
  p10 = excluded.p10,
  p25 = excluded.p25,
  p50 = excluded.p50,
  p75 = excluded.p75,
  p90 = excluded.p90,
  mean = excluded.mean,
  std_dev = excluded.std_dev,
  cv_pct = excluded.cv_pct,
  pattern_confidence = excluded.pattern_confidence,
  high_variance_flag = excluded.high_variance_flag,
  stale = excluded.stale,
  metadata = public.quantity_patterns.metadata || excluded.metadata,
  updated_at = now();
