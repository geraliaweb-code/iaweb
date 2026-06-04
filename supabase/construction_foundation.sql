create extension if not exists "pgcrypto";

create table if not exists public.construction_organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country text not null default 'Portugal',
  owner_email text,
  plan text not null default 'home',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.construction_projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.construction_organizations(id) on delete set null,
  name text not null,
  project_type text not null check (
    project_type in (
      'moradia',
      'remodelacao',
      'creche',
      'hotel',
      'pavilhao_industrial',
      'restaurante',
      'lar',
      'industria',
      'comercio'
    )
  ),
  country text not null check (country in ('Portugal', 'França', 'Espanha')),
  city text not null,
  estimated_area_m2 numeric(12, 2),
  client_type text not null check (
    client_type in (
      'particular',
      'construtora',
      'arquiteto',
      'engenheiro',
      'promotor_imobiliario',
      'gabinete_tecnico'
    )
  ),
  status text not null default 'draft',
  maturity_score integer check (maturity_score between 0 and 100),
  risk_score integer check (risk_score between 0 and 100),
  complexity_score integer check (complexity_score between 0 and 100),
  confidence_score integer check (confidence_score between 0 and 100),
  analyses_count integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.construction_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.construction_projects(id) on delete cascade,
  bucket text not null default 'construction-files',
  storage_path text not null,
  original_filename text not null,
  mime_type text,
  size_bytes bigint,
  uploaded_by text,
  processing_status text not null default 'uploaded' check (processing_status in ('uploaded', 'processing', 'analyzed', 'failed')),
  checksum text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.construction_detected_documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.construction_projects(id) on delete cascade,
  file_id uuid references public.construction_files(id) on delete set null,
  document_type text not null,
  country text,
  specialty text,
  confidence_score integer not null default 0 check (confidence_score between 0 and 100),
  notes text,
  ai_analysis_status text,
  ai_summary text,
  detected_entities jsonb not null default '{}'::jsonb,
  title text,
  version text,
  detected_confidence numeric(5, 2),
  page_count integer,
  extracted_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.construction_detected_elements (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.construction_projects(id) on delete cascade,
  detected_document_id uuid references public.construction_detected_documents(id) on delete cascade,
  element_type text not null,
  label text not null,
  quantity numeric(14, 4),
  unit text,
  source_reference text,
  confidence_score integer check (confidence_score between 0 and 100),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.construction_scores (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.construction_projects(id) on delete cascade,
  engine text not null,
  score integer not null check (score between 0 and 100),
  grade text,
  rationale text,
  inputs jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.construction_risks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.construction_projects(id) on delete cascade,
  risk_type text not null,
  title text not null,
  severity text not null default 'medium',
  probability text not null default 'unknown',
  impact text,
  recommendation text,
  source text,
  status text not null default 'open',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.construction_estimates (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.construction_projects(id) on delete cascade,
  estimate_type text not null,
  currency text not null default 'EUR',
  low_amount numeric(14, 2),
  expected_amount numeric(14, 2),
  high_amount numeric(14, 2),
  confidence_score integer check (confidence_score between 0 and 100),
  assumptions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.construction_reports (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.construction_projects(id) on delete cascade,
  report_type text not null default 'executive',
  title text not null,
  status text not null default 'draft',
  summary text,
  report_url text,
  payload jsonb not null default '{}'::jsonb,
  generated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.construction_benchmarks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.construction_projects(id) on delete cascade,
  benchmark_type text not null,
  benchmark_value numeric(14, 2) not null,
  project_value numeric(14, 2) not null,
  difference_percent numeric(10, 2) not null,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.construction_subscriptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.construction_organizations(id) on delete cascade,
  plan text not null default 'foundation',
  status text not null default 'trial',
  seats integer not null default 1,
  trial_starts_at timestamptz not null default now(),
  trial_ends_at timestamptz,
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_price_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.construction_usage_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.construction_organizations(id) on delete cascade,
  project_id uuid references public.construction_projects(id) on delete cascade,
  action text not null check (action in ('analyze_documents', 'run_health_check', 'run_benchmark', 'generate_pdf')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists construction_projects_organization_idx
  on public.construction_projects (organization_id);

create index if not exists construction_projects_created_at_idx
  on public.construction_projects (created_at desc);

create index if not exists construction_projects_type_idx
  on public.construction_projects (project_type);

create index if not exists construction_files_project_idx
  on public.construction_files (project_id);

create unique index if not exists construction_files_storage_path_unique_idx
  on public.construction_files (storage_path);

create index if not exists construction_detected_documents_project_idx
  on public.construction_detected_documents (project_id);

create index if not exists construction_detected_documents_file_idx
  on public.construction_detected_documents (file_id);

create index if not exists construction_detected_elements_project_idx
  on public.construction_detected_elements (project_id);

create index if not exists construction_scores_project_engine_idx
  on public.construction_scores (project_id, engine);

create index if not exists construction_risks_project_status_idx
  on public.construction_risks (project_id, status);

create index if not exists construction_estimates_project_idx
  on public.construction_estimates (project_id);

create index if not exists construction_reports_project_idx
  on public.construction_reports (project_id);

create index if not exists construction_benchmarks_project_idx
  on public.construction_benchmarks (project_id);

create index if not exists construction_benchmarks_project_type_idx
  on public.construction_benchmarks (project_id, benchmark_type);

create index if not exists construction_usage_events_organization_month_idx
  on public.construction_usage_events (organization_id, created_at desc);

create index if not exists construction_usage_events_project_month_idx
  on public.construction_usage_events (project_id, created_at desc);

alter table public.construction_subscriptions
  add column if not exists trial_starts_at timestamptz not null default now(),
  add column if not exists trial_ends_at timestamptz,
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text,
  add column if not exists stripe_price_id text,
  add column if not exists current_period_start timestamptz,
  add column if not exists current_period_end timestamptz;

alter table public.construction_subscriptions
  alter column plan set default 'home';

update public.construction_subscriptions
set plan = 'home'
where plan = 'foundation';

update public.construction_subscriptions
set trial_ends_at = coalesce(trial_ends_at, trial_starts_at + interval '7 days')
where status = 'trial';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'construction_subscriptions_plan_check'
  ) then
    alter table public.construction_subscriptions
      add constraint construction_subscriptions_plan_check
      check (plan in ('home', 'builder', 'architect', 'engineering', 'enterprise'));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'construction_subscriptions_status_check'
  ) then
    alter table public.construction_subscriptions
      add constraint construction_subscriptions_status_check
      check (status in ('trial', 'active', 'past_due', 'cancelled'));
  end if;
end $$;

alter table public.construction_files
  alter column processing_status set default 'uploaded';

update public.construction_files
set processing_status = 'uploaded'
where processing_status = 'pending';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'construction_files_processing_status_check'
  ) then
    alter table public.construction_files
      add constraint construction_files_processing_status_check
      check (processing_status in ('uploaded', 'processing', 'analyzed', 'failed'));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'construction_detected_documents_ai_analysis_status_check'
  ) then
    alter table public.construction_detected_documents
      add constraint construction_detected_documents_ai_analysis_status_check
      check (ai_analysis_status is null or ai_analysis_status in ('not_configured', 'success', 'failed', 'fallback'));
  end if;
end $$;

alter table public.construction_detected_documents
  add column if not exists country text,
  add column if not exists specialty text,
  add column if not exists confidence_score integer not null default 0,
  add column if not exists notes text,
  add column if not exists ai_analysis_status text,
  add column if not exists ai_summary text,
  add column if not exists detected_entities jsonb not null default '{}'::jsonb;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'construction_detected_documents_confidence_score_check'
  ) then
    alter table public.construction_detected_documents
      add constraint construction_detected_documents_confidence_score_check
      check (confidence_score between 0 and 100);
  end if;
end $$;

alter table public.construction_projects
  add column if not exists complexity_score integer;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'construction_projects_complexity_score_check'
  ) then
    alter table public.construction_projects
      add constraint construction_projects_complexity_score_check
      check (complexity_score between 0 and 100);
  end if;
end $$;

alter table public.construction_reports
  add column if not exists report_url text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'construction-files',
  'construction-files',
  false,
  104857600,
  null
)
on conflict (id) do update
set
  name = excluded.name,
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
