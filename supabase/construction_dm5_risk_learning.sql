create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'benchmark_confidence_tier') then
    create type public.benchmark_confidence_tier as enum ('insuficiente', 'baixa', 'média', 'alta', 'muito_alta');
  end if;

  if not exists (select 1 from pg_type where typname = 'risk_learning_category') then
    create type public.risk_learning_category as enum (
      'financeiro',
      'prazo',
      'tecnico',
      'fornecedor',
      'regulatorio',
      'operacional'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'risk_learning_subcategory') then
    create type public.risk_learning_subcategory as enum (
      'financeiro_orcamento',
      'financeiro_inflacao',
      'financeiro_cambio',
      'financeiro_cashflow',
      'financeiro_margem',
      'prazo_licenciamento',
      'prazo_fornecedor',
      'prazo_clima',
      'prazo_mao_de_obra',
      'prazo_caminho_critico',
      'tecnico_projeto',
      'tecnico_compatibilizacao',
      'tecnico_qualidade',
      'tecnico_geotecnia',
      'tecnico_instalacoes',
      'fornecedor_entrega',
      'fornecedor_preco',
      'fornecedor_capacidade',
      'fornecedor_qualidade',
      'fornecedor_substituicao',
      'regulatorio_licenca',
      'regulatorio_seguranca',
      'regulatorio_ambiental',
      'regulatorio_fiscal',
      'regulatorio_normativo',
      'operacional_produtividade',
      'operacional_seguranca_obra',
      'operacional_coordenacao',
      'operacional_subempreiteiro',
      'operacional_cliente'
    );
  end if;
end $$;

create table if not exists public.risk_records (
  id uuid primary key default gen_random_uuid(),
  project_profile_id uuid references public.project_profiles(id) on delete set null,
  benchmark_segment_id uuid references public.benchmark_segments(id) on delete set null,
  source_project_code text,
  country text not null check (country in ('Portugal', 'Franca', 'Espanha')),
  project_type text not null,
  lifecycle_phase text not null default 'conceção' check (lifecycle_phase in ('conceção', 'execução', 'concluído')),
  confidence_weight numeric(4, 3) not null default 0.300 check (confidence_weight in (0.300, 0.600, 1.000)),
  risk_category public.risk_learning_category not null,
  risk_subcategory public.risk_learning_subcategory not null,
  risk_title text not null,
  risk_description text,
  initial_probability numeric(6, 4) check (initial_probability between 0 and 1),
  initial_impact_score integer check (initial_impact_score between 0 and 100),
  initial_risk_score integer check (initial_risk_score between 0 and 100),
  current_probability numeric(6, 4) check (current_probability between 0 and 1),
  current_impact_score integer check (current_impact_score between 0 and 100),
  current_risk_score integer check (current_risk_score between 0 and 100),
  status text not null default 'open' check (status in ('open', 'monitoring', 'mitigated', 'materialized', 'dismissed')),
  source_status text not null default 'warm' check (source_status in ('warm', 'cold_ready', 'archived')),
  cold_storage_ready boolean not null default false,
  cold_storage_threshold_projects integer not null default 500,
  snapshot_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.risk_predictions (
  id uuid primary key default gen_random_uuid(),
  risk_record_id uuid not null references public.risk_records(id) on delete cascade,
  prediction_model_code text not null default 'dm5-risk-learning-v1',
  predicted_probability numeric(6, 4) not null check (predicted_probability between 0 and 1),
  predicted_impact_score integer not null check (predicted_impact_score between 0 and 100),
  predicted_risk_score integer not null check (predicted_risk_score between 0 and 100),
  prediction_horizon_days integer,
  confidence_score integer check (confidence_score between 0 and 100),
  confidence_weight numeric(4, 3) not null default 0.300 check (confidence_weight > 0 and confidence_weight <= 1),
  inputs jsonb not null default '{}'::jsonb,
  predicted_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.risk_observations (
  id uuid primary key default gen_random_uuid(),
  risk_record_id uuid not null references public.risk_records(id) on delete cascade,
  observation_type text not null default 'active_reminder' check (observation_type in ('active_reminder', 'automatic_inference', 'manual_update', 'project_close_review')),
  observed_status text not null check (observed_status in ('not_observed', 'observed', 'partially_observed', 'unknown')),
  observed_probability numeric(6, 4) check (observed_probability between 0 and 1),
  observed_impact_score integer check (observed_impact_score between 0 and 100),
  observed_cost_impact numeric(14, 2),
  observed_delay_days integer,
  inferred_automatically boolean not null default false,
  reminder_status text not null default 'active' check (reminder_status in ('active', 'sent', 'snoozed', 'completed', 'not_required')),
  blocks_project_closure boolean not null default false check (blocks_project_closure = false),
  human_confirmed boolean not null default false,
  confirmed_by text,
  confirmed_at timestamptz,
  observed_at timestamptz not null default now(),
  evidence jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.risk_deviations (
  id uuid primary key default gen_random_uuid(),
  risk_record_id uuid not null references public.risk_records(id) on delete cascade,
  risk_prediction_id uuid references public.risk_predictions(id) on delete set null,
  risk_observation_id uuid references public.risk_observations(id) on delete set null,
  predicted_risk_score integer check (predicted_risk_score between 0 and 100),
  observed_risk_score integer check (observed_risk_score between 0 and 100),
  score_deviation_points integer,
  probability_deviation numeric(8, 4),
  impact_deviation_points integer,
  cost_deviation_amount numeric(14, 2),
  timeline_deviation_days integer,
  deviation_reason text,
  confidence_weight numeric(4, 3) not null default 0.300 check (confidence_weight > 0 and confidence_weight <= 1),
  observed_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.risk_propagations (
  id uuid primary key default gen_random_uuid(),
  source_risk_record_id uuid not null references public.risk_records(id) on delete cascade,
  impacted_risk_record_id uuid references public.risk_records(id) on delete set null,
  propagation_target text not null check (propagation_target in ('cost', 'timeline', 'supplier', 'quality', 'compliance', 'client', 'portfolio')),
  propagation_type text not null default 'correlation' check (propagation_type in ('causal', 'correlation', 'dependency', 'manual')),
  propagation_probability numeric(6, 4) not null default 0.5000 check (propagation_probability between 0 and 1),
  propagated_impact_score integer check (propagated_impact_score between 0 and 100),
  propagated_cost_amount numeric(14, 2),
  propagated_delay_days integer,
  confidence_weight numeric(4, 3) not null default 0.300 check (confidence_weight > 0 and confidence_weight <= 1),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.risk_patterns (
  id uuid primary key default gen_random_uuid(),
  pattern_code text not null unique,
  benchmark_segment_id uuid references public.benchmark_segments(id) on delete set null,
  country text not null check (country in ('Portugal', 'Franca', 'Espanha')),
  project_type text not null,
  risk_category public.risk_learning_category not null,
  risk_subcategory public.risk_learning_subcategory not null,
  pattern_name text not null,
  recurrence_rate numeric(8, 4) not null default 0 check (recurrence_rate between 0 and 1),
  average_impact_score numeric(10, 4),
  average_cost_impact numeric(14, 2),
  average_delay_days numeric(10, 4),
  sample_size integer not null default 0,
  confidence_tier public.benchmark_confidence_tier not null default 'insuficiente',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.supplier_risk_profiles (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid references public.suppliers(id) on delete cascade,
  benchmark_segment_id uuid references public.benchmark_segments(id) on delete set null,
  country text check (country in ('Portugal', 'Franca', 'Espanha')),
  specialty_code text,
  risk_category public.risk_learning_category not null default 'fornecedor',
  observed_events integer not null default 0,
  materialized_events integer not null default 0,
  average_risk_score numeric(10, 4),
  average_delay_days numeric(10, 4),
  average_cost_impact numeric(14, 2),
  critical_event_rate numeric(8, 4) not null default 0 check (critical_event_rate between 0 and 1),
  confidence_weight numeric(4, 3) not null default 0.300 check (confidence_weight > 0 and confidence_weight <= 1),
  observed_at date not null default current_date,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (supplier_id, benchmark_segment_id, specialty_code, observed_at)
);

create table if not exists public.macro_risk_contexts (
  id uuid primary key default gen_random_uuid(),
  context_code text not null unique,
  country text not null check (country in ('Portugal', 'Franca', 'Espanha')),
  region text,
  risk_category public.risk_learning_category not null,
  risk_subcategory public.risk_learning_subcategory not null,
  context_name text not null,
  severity_score integer not null check (severity_score between 0 and 100),
  probability numeric(6, 4) not null check (probability between 0 and 1),
  source_mode text not null default 'manual' check (source_mode in ('manual', 'future_automatic', 'hybrid')),
  approval_status text not null default 'pending' check (approval_status in ('pending', 'approved', 'rejected', 'superseded')),
  approved_by text,
  approved_at timestamptz,
  valid_from date not null default current_date,
  valid_to date,
  evidence jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.risk_calibrations (
  id uuid primary key default gen_random_uuid(),
  calibration_code text not null unique,
  benchmark_segment_id uuid references public.benchmark_segments(id) on delete set null,
  risk_category public.risk_learning_category not null,
  risk_subcategory public.risk_learning_subcategory,
  model_code text not null default 'dm5-risk-learning-v1',
  previous_factor numeric(10, 4) not null default 1,
  proposed_factor numeric(10, 4) not null default 1,
  calibration_delta_percent numeric(10, 4) not null default 0,
  requires_human_approval boolean generated always as (abs(calibration_delta_percent) > 20.0000) stored,
  approval_status text not null default 'auto_applied' check (approval_status in ('auto_applied', 'pending_human_approval', 'approved', 'rejected')),
  approved_by text,
  approved_at timestamptz,
  sample_size integer not null default 0,
  confidence_tier public.benchmark_confidence_tier not null default 'insuficiente',
  calibrated_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.risk_aggregates (
  id uuid primary key default gen_random_uuid(),
  benchmark_segment_id uuid not null references public.benchmark_segments(id) on delete cascade,
  risk_category public.risk_learning_category not null,
  risk_subcategory public.risk_learning_subcategory,
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
  cold_storage_threshold_projects integer not null default 500,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (benchmark_segment_id, risk_category, risk_subcategory, metric_name, computed_at)
);

create index if not exists risk_records_segment_snapshot_idx on public.risk_records(benchmark_segment_id, snapshot_at desc);
create index if not exists risk_records_snapshot_at_idx on public.risk_records(snapshot_at);
create index if not exists risk_records_country_type_idx on public.risk_records(country, project_type);
create index if not exists risk_records_category_idx on public.risk_records(risk_category, risk_subcategory);
create index if not exists risk_records_lifecycle_idx on public.risk_records(lifecycle_phase, confidence_weight);
create index if not exists risk_predictions_record_date_idx on public.risk_predictions(risk_record_id, predicted_at desc);
create index if not exists risk_predictions_model_idx on public.risk_predictions(prediction_model_code);
create index if not exists risk_observations_record_date_idx on public.risk_observations(risk_record_id, observed_at desc);
create index if not exists risk_observations_reminder_idx on public.risk_observations(reminder_status, observation_type);
create index if not exists risk_deviations_record_idx on public.risk_deviations(risk_record_id, observed_at desc);
create index if not exists risk_propagations_source_idx on public.risk_propagations(source_risk_record_id);
create index if not exists risk_propagations_target_idx on public.risk_propagations(propagation_target, propagation_probability);
create index if not exists risk_patterns_segment_category_idx on public.risk_patterns(benchmark_segment_id, risk_category, risk_subcategory);
create index if not exists risk_patterns_country_type_idx on public.risk_patterns(country, project_type);
create index if not exists supplier_risk_profiles_supplier_idx on public.supplier_risk_profiles(supplier_id);
create index if not exists supplier_risk_profiles_segment_idx on public.supplier_risk_profiles(benchmark_segment_id, specialty_code);
create index if not exists macro_risk_contexts_country_category_idx on public.macro_risk_contexts(country, risk_category, risk_subcategory);
create index if not exists macro_risk_contexts_validity_idx on public.macro_risk_contexts(valid_from, valid_to);
create index if not exists macro_risk_contexts_approval_idx on public.macro_risk_contexts(approval_status, source_mode);
create index if not exists risk_calibrations_segment_category_idx on public.risk_calibrations(benchmark_segment_id, risk_category, risk_subcategory);
create index if not exists risk_calibrations_approval_idx on public.risk_calibrations(requires_human_approval, approval_status);
create index if not exists risk_aggregates_segment_category_valid_idx on public.risk_aggregates(benchmark_segment_id, risk_category, risk_subcategory, valid_until);
create index if not exists risk_aggregates_confidence_idx on public.risk_aggregates(confidence_tier, serving_status);

insert into public.benchmark_segments (segment_code, country, project_type, area_band, quality_segment, complexity_band, metadata)
values
  ('BM-PT-MORADIA-100-300-NORMAL-MEDIUM', 'Portugal', 'moradia', '100-300', 'normal', 'medium', '{"seed":"dm5","domain":"risk"}'),
  ('BM-FR-HOTEL-1000-5000-PREMIUM-HIGH', 'Franca', 'hotel', '1000-5000', 'premium', 'high', '{"seed":"dm5","domain":"risk"}'),
  ('BM-ES-REMODELACAO-50-200-NORMAL-MEDIUM', 'Espanha', 'remodelacao', '50-200', 'normal', 'medium', '{"seed":"dm5","domain":"risk"}')
on conflict (segment_code) do update set
  metadata = public.benchmark_segments.metadata || excluded.metadata,
  updated_at = now();

insert into public.risk_patterns (
  pattern_code,
  benchmark_segment_id,
  country,
  project_type,
  risk_category,
  risk_subcategory,
  pattern_name,
  recurrence_rate,
  average_impact_score,
  average_cost_impact,
  average_delay_days,
  sample_size,
  confidence_tier,
  metadata
)
select
  seed.pattern_code,
  s.id,
  seed.country,
  seed.project_type,
  seed.risk_category::public.risk_learning_category,
  seed.risk_subcategory::public.risk_learning_subcategory,
  seed.pattern_name,
  seed.recurrence_rate,
  seed.average_impact_score,
  seed.average_cost_impact,
  seed.average_delay_days,
  seed.sample_size,
  seed.confidence_tier::public.benchmark_confidence_tier,
  jsonb_build_object('seed', 'dm5')
from public.benchmark_segments s
join (
  values
    ('DM5-PATTERN-PT-LICENCIAMENTO-MORADIA-V1', 'BM-PT-MORADIA-100-300-NORMAL-MEDIUM', 'Portugal', 'moradia', 'regulatorio', 'regulatorio_licenca', 'Licenciamento prolongado em moradias', 0.2600, 62.0000, 8500.00, 18.0000, 12, 'baixa'),
    ('DM5-PATTERN-FR-FORNECEDOR-HOTEL-V1', 'BM-FR-HOTEL-1000-5000-PREMIUM-HIGH', 'Franca', 'hotel', 'fornecedor', 'fornecedor_capacidade', 'Capacidade limitada de fornecedor premium', 0.3300, 74.0000, 42000.00, 24.0000, 18, 'média'),
    ('DM5-PATTERN-ES-CLIENTE-REMODELACAO-V1', 'BM-ES-REMODELACAO-50-200-NORMAL-MEDIUM', 'Espanha', 'remodelacao', 'operacional', 'operacional_cliente', 'Alteracoes de cliente durante obra', 0.2900, 55.0000, 6200.00, 9.0000, 22, 'média')
) as seed(pattern_code, segment_code, country, project_type, risk_category, risk_subcategory, pattern_name, recurrence_rate, average_impact_score, average_cost_impact, average_delay_days, sample_size, confidence_tier)
  on seed.segment_code = s.segment_code
on conflict (pattern_code) do update set
  recurrence_rate = excluded.recurrence_rate,
  average_impact_score = excluded.average_impact_score,
  average_cost_impact = excluded.average_cost_impact,
  average_delay_days = excluded.average_delay_days,
  sample_size = excluded.sample_size,
  confidence_tier = excluded.confidence_tier,
  metadata = public.risk_patterns.metadata || excluded.metadata,
  updated_at = now();

insert into public.macro_risk_contexts (
  context_code,
  country,
  region,
  risk_category,
  risk_subcategory,
  context_name,
  severity_score,
  probability,
  source_mode,
  approval_status,
  evidence,
  metadata
)
values
  ('DM5-MACRO-PT-INFLACAO-MATERIAIS-V1', 'Portugal', null, 'financeiro', 'financeiro_inflacao', 'Pressao de inflacao em materiais', 58, 0.4200, 'manual', 'approved', '{"source":"manual_seed"}', '{"seed":"dm5"}'),
  ('DM5-MACRO-FR-NORMATIVO-ENERGETICO-V1', 'Franca', null, 'regulatorio', 'regulatorio_normativo', 'Exigencia normativa energetica', 66, 0.3800, 'hybrid', 'pending', '{"source":"manual_seed","future_automatic":true}', '{"seed":"dm5"}'),
  ('DM5-MACRO-ES-MAO-DE-OBRA-V1', 'Espanha', null, 'prazo', 'prazo_mao_de_obra', 'Disponibilidade regional de mao de obra', 52, 0.3600, 'manual', 'approved', '{"source":"manual_seed"}', '{"seed":"dm5"}')
on conflict (context_code) do update set
  severity_score = excluded.severity_score,
  probability = excluded.probability,
  source_mode = excluded.source_mode,
  approval_status = excluded.approval_status,
  evidence = public.macro_risk_contexts.evidence || excluded.evidence,
  metadata = public.macro_risk_contexts.metadata || excluded.metadata,
  updated_at = now();

insert into public.risk_calibrations (
  calibration_code,
  benchmark_segment_id,
  risk_category,
  risk_subcategory,
  model_code,
  previous_factor,
  proposed_factor,
  calibration_delta_percent,
  approval_status,
  sample_size,
  confidence_tier,
  metadata
)
select
  seed.calibration_code,
  s.id,
  seed.risk_category::public.risk_learning_category,
  seed.risk_subcategory::public.risk_learning_subcategory,
  'dm5-risk-learning-v1',
  seed.previous_factor,
  seed.proposed_factor,
  seed.calibration_delta_percent,
  seed.approval_status,
  seed.sample_size,
  seed.confidence_tier::public.benchmark_confidence_tier,
  jsonb_build_object('seed', 'dm5', 'auto_until_delta_percent', 20)
from public.benchmark_segments s
join (
  values
    ('DM5-CAL-PT-LICENCA-V1', 'BM-PT-MORADIA-100-300-NORMAL-MEDIUM', 'regulatorio', 'regulatorio_licenca', 1.0000, 1.1200, 12.0000, 'auto_applied', 12, 'baixa'),
    ('DM5-CAL-FR-FORNECEDOR-V1', 'BM-FR-HOTEL-1000-5000-PREMIUM-HIGH', 'fornecedor', 'fornecedor_capacidade', 1.0000, 1.2700, 27.0000, 'pending_human_approval', 18, 'média'),
    ('DM5-CAL-ES-CLIENTE-V1', 'BM-ES-REMODELACAO-50-200-NORMAL-MEDIUM', 'operacional', 'operacional_cliente', 1.0000, 0.9200, -8.0000, 'auto_applied', 22, 'média')
) as seed(calibration_code, segment_code, risk_category, risk_subcategory, previous_factor, proposed_factor, calibration_delta_percent, approval_status, sample_size, confidence_tier)
  on seed.segment_code = s.segment_code
on conflict (calibration_code) do update set
  previous_factor = excluded.previous_factor,
  proposed_factor = excluded.proposed_factor,
  calibration_delta_percent = excluded.calibration_delta_percent,
  approval_status = excluded.approval_status,
  sample_size = excluded.sample_size,
  confidence_tier = excluded.confidence_tier,
  metadata = public.risk_calibrations.metadata || excluded.metadata,
  updated_at = now();

insert into public.risk_aggregates (
  benchmark_segment_id,
  risk_category,
  risk_subcategory,
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
  seed.risk_category::public.risk_learning_category,
  seed.risk_subcategory::public.risk_learning_subcategory,
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
  jsonb_build_object('seed', 'dm5', 'daily_recalculation', true, 'realtime', false)
from public.benchmark_segments s
join (
  values
    ('BM-PT-MORADIA-100-300-NORMAL-MEDIUM', 'regulatorio', 'regulatorio_licenca', 'risk_score', 'score', 4, 2.7000, 36.0000, 48.0000, 61.0000, 50.0000, 25.0000, 72.0000, 'insuficiente', 'blocked', 'Menos de 5 projetos: benchmark de risco nao deve ser servido.'),
    ('BM-FR-HOTEL-1000-5000-PREMIUM-HIGH', 'fornecedor', 'fornecedor_capacidade', 'risk_score', 'score', 11, 8.4000, 48.0000, 63.0000, 78.0000, 65.0000, 34.0000, 86.0000, 'baixa', 'low_confidence', 'Entre 5 e 15 projetos: servir com aviso de baixa confianca.'),
    ('BM-ES-REMODELACAO-50-200-NORMAL-MEDIUM', 'operacional', 'operacional_cliente', 'risk_score', 'score', 24, 19.5000, 28.0000, 42.0000, 57.0000, 44.0000, 18.0000, 71.0000, 'média', 'serving', null)
) as seed(segment_code, risk_category, risk_subcategory, metric_name, metric_unit, sample_size, weighted_sample_size, p25_value, median_value, p75_value, average_value, min_value, max_value, confidence_tier, serving_status, serving_warning)
  on seed.segment_code = s.segment_code
on conflict (benchmark_segment_id, risk_category, risk_subcategory, metric_name, computed_at) do update set
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
  metadata = public.risk_aggregates.metadata || excluded.metadata,
  updated_at = now();
