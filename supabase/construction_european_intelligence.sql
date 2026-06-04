alter table public.construction_projects
  add column if not exists language text not null default 'pt',
  add column if not exists technical_country text not null default 'portugal';

alter table public.construction_files
  add column if not exists retention_policy text not null default '90_days',
  add column if not exists consent_anonymous_learning boolean not null default false,
  add column if not exists deleted_at timestamptz;

create table if not exists public.construction_knowledge_vault (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.construction_projects(id) on delete set null,
  country text not null,
  typology text not null,
  area_m2 numeric(12, 2),
  document_count integer not null default 0,
  specialties_detected jsonb not null default '[]'::jsonb,
  risks_summary jsonb not null default '[]'::jsonb,
  cost_scenarios jsonb not null default '[]'::jsonb,
  schedule_scenario jsonb not null default '{}'::jsonb,
  confidence_score integer check (confidence_score between 0 and 100),
  anonymized_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists construction_knowledge_vault_country_idx
  on public.construction_knowledge_vault (country);

create index if not exists construction_knowledge_vault_typology_idx
  on public.construction_knowledge_vault (typology);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'construction_projects_language_check'
  ) then
    alter table public.construction_projects
      add constraint construction_projects_language_check
      check (language in ('pt', 'fr', 'es'));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'construction_projects_technical_country_check'
  ) then
    alter table public.construction_projects
      add constraint construction_projects_technical_country_check
      check (technical_country in ('portugal', 'france', 'spain'));
  end if;
end $$;
