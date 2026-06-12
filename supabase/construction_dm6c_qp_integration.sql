create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'qp_link_type') then
    create type public.qp_link_type as enum ('EXACT', 'FAMILY', 'TYPOLOGY', 'PROXY_COUNTRY', 'NO_LINK');
  end if;

  if not exists (select 1 from pg_type where typname = 'cost_serving_level') then
    create type public.cost_serving_level as enum ('internal_detail', 'internal_summary', 'blocked');
  end if;
end $$;

create table if not exists public.line_cost_estimates (
  id uuid primary key default gen_random_uuid(),
  quantity_record_id uuid not null references public.quantity_records(id) on delete cascade,
  material_cost_id uuid references public.material_costs(id) on delete set null,
  link_type public.qp_link_type not null default 'NO_LINK',
  link_confidence numeric(5, 4) not null default 0 check (link_confidence between 0 and 1),
  q_used numeric(18, 4) not null check (q_used >= 0),
  p_used numeric(14, 4) not null default 0 check (p_used >= 0),
  q_source text not null,
  p_source text not null,
  cost_min numeric(14, 0),
  cost_prov numeric(14, 0),
  cost_max numeric(14, 0),
  currency text not null default 'EUR',
  cost_confidence_line numeric(6, 4) not null default 0 check (cost_confidence_line between 0 and 1),
  uncosted_reason text,
  anti_false_precision_rules jsonb not null default '["FP-01","FP-02","FP-03","FP-04","FP-05","FP-06","FP-07"]'::jsonb,
  calculated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  check (
    (link_type = 'EXACT' and link_confidence = 1.0000) or
    (link_type = 'FAMILY' and link_confidence = 0.7500) or
    (link_type = 'TYPOLOGY' and link_confidence = 0.5000) or
    (link_type = 'PROXY_COUNTRY' and link_confidence = 0.3500) or
    (link_type = 'NO_LINK' and link_confidence = 0.0000)
  ),
  check (
    (link_type = 'NO_LINK' and material_cost_id is null and cost_min is null and cost_prov is null and cost_max is null and uncosted_reason is not null) or
    (link_type <> 'NO_LINK' and material_cost_id is not null and cost_min is not null and cost_prov is not null and cost_max is not null and cost_min <= cost_prov and cost_prov <= cost_max)
  )
);

create table if not exists public.specialty_cost_estimates (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.construction_projects(id) on delete cascade,
  specialty_id text not null,
  country text not null check (country in ('Portugal', 'Franca', 'Espanha')),
  typology text not null,
  cost_min numeric(14, 0) not null check (cost_min >= 0),
  cost_prov numeric(14, 0) not null check (cost_prov >= 0),
  cost_max numeric(14, 0) not null check (cost_max >= 0),
  cost_per_m2_min numeric(14, 0),
  cost_per_m2_prov numeric(14, 0),
  cost_per_m2_max numeric(14, 0),
  coverage_ratio numeric(6, 4) not null check (coverage_ratio between 0 and 1),
  line_count integer not null default 0 check (line_count >= 0),
  uncosted_lines integer not null default 0 check (uncosted_lines >= 0),
  cost_confidence_specialty numeric(6, 4) not null default 0 check (cost_confidence_specialty between 0 and 1),
  exact_match_ratio numeric(6, 4) not null default 0 check (exact_match_ratio between 0 and 1),
  anti_false_precision_rules jsonb not null default '["FP-01","FP-02","FP-03","FP-04","FP-05","FP-06","FP-07"]'::jsonb,
  calculated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  check (cost_min <= cost_prov and cost_prov <= cost_max),
  check (uncosted_lines <= line_count)
);

create table if not exists public.project_cost_estimates (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.construction_projects(id) on delete cascade,
  cost_min numeric(14, 0) not null check (cost_min >= 0),
  cost_prov numeric(14, 0) not null check (cost_prov >= 0),
  cost_max numeric(14, 0) not null check (cost_max >= 0),
  cost_per_m2_prov numeric(14, 0),
  overhead_factor_used numeric(8, 4) not null default 1 check (overhead_factor_used >= 1),
  specialty_coverage numeric(6, 4) not null check (specialty_coverage between 0 and 1),
  cost_confidence_project numeric(6, 4) not null default 0 check (cost_confidence_project between 0 and 1),
  range_width_pct numeric(10, 4) not null default 0 check (range_width_pct >= 0),
  benchmark_delta_pct numeric(10, 4),
  estimate_version text not null default 'dm6c-v1',
  calculated_at timestamptz not null default now(),
  expires_at timestamptz not null,
  exact_match_ratio numeric(6, 4) not null default 0 check (exact_match_ratio between 0 and 1),
  serving_public boolean not null default false,
  anti_false_precision_rules jsonb not null default '["FP-01","FP-02","FP-03","FP-04","FP-05","FP-06","FP-07"]'::jsonb,
  created_at timestamptz not null default now(),
  check (cost_min <= cost_prov and cost_prov <= cost_max),
  check (expires_at > calculated_at),
  check (serving_public = false)
);

create table if not exists public.cost_range_models (
  id uuid primary key default gen_random_uuid(),
  model_name text not null,
  model_version text not null,
  q_source_rule text not null,
  p_source_rule text not null,
  aggregation_rule text not null,
  overhead_model text not null,
  country text check (country in ('Portugal', 'Franca', 'Espanha')),
  typology text,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  unique (model_name, model_version, country, typology)
);

create table if not exists public.qp_calibration_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.construction_projects(id) on delete cascade,
  estimated_cost numeric(14, 0),
  real_cost numeric(14, 0),
  delta_pct numeric(10, 4),
  q_delta_pct numeric(10, 4),
  p_delta_pct numeric(10, 4),
  calibrated_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.cost_confidence_scores (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.construction_projects(id) on delete cascade,
  specialty_id text,
  cc_score numeric(6, 4) not null check (cc_score between 0 and 1),
  qc_component numeric(6, 4) not null check (qc_component between 0 and 1),
  pc_p_component numeric(6, 4) not null check (pc_p_component between 0 and 1),
  lc_component numeric(6, 4) not null check (lc_component between 0 and 1),
  cf_component numeric(6, 4) not null check (cf_component between 0 and 1),
  price_freshness_score numeric(6, 4) not null check (price_freshness_score between 0 and 1),
  serving_level public.cost_serving_level not null default 'blocked',
  calculated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists line_cost_estimates_quantity_idx on public.line_cost_estimates(quantity_record_id);
create index if not exists line_cost_estimates_material_cost_idx on public.line_cost_estimates(material_cost_id);
create index if not exists line_cost_estimates_link_idx on public.line_cost_estimates(link_type, link_confidence);
create index if not exists specialty_cost_estimates_project_idx on public.specialty_cost_estimates(project_id);
create index if not exists specialty_cost_estimates_segment_idx on public.specialty_cost_estimates(country, typology, specialty_id);
create index if not exists project_cost_estimates_project_idx on public.project_cost_estimates(project_id, calculated_at desc);
create index if not exists project_cost_estimates_serving_idx on public.project_cost_estimates(serving_public, expires_at);
create index if not exists cost_range_models_active_idx on public.cost_range_models(is_active, country, typology);
create index if not exists qp_calibration_events_project_idx on public.qp_calibration_events(project_id, calibrated_at desc);
create index if not exists cost_confidence_scores_project_idx on public.cost_confidence_scores(project_id, calculated_at desc);
create index if not exists cost_confidence_scores_specialty_idx on public.cost_confidence_scores(project_id, specialty_id);

insert into public.cost_range_models (
  model_name,
  model_version,
  q_source_rule,
  p_source_rule,
  aggregation_rule,
  overhead_model,
  country,
  typology,
  is_active
)
values (
  'DM-6C QxP Internal Range Model',
  'v1',
  'Use quantity p10/p50/p90 from normalized project quantities or internal quantity patterns; no extrapolation outside available context.',
  'Use price p10/p50/p90 from material_costs with conservative internal range; no live calibration.',
  'C_min = Q_p10 * P_p10, C_prov = Q_p50 * P_p50, C_max = Q_p90 * P_p90; aggregate lines to specialty and project without Q-P correlation.',
  'Fixed internal overhead factor only; no commercial serving.',
  null,
  null,
  true
)
on conflict (model_name, model_version, country, typology) do update set
  q_source_rule = excluded.q_source_rule,
  p_source_rule = excluded.p_source_rule,
  aggregation_rule = excluded.aggregation_rule,
  overhead_model = excluded.overhead_model,
  is_active = excluded.is_active;
