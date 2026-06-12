create extension if not exists "pgcrypto";

create table if not exists public.construction_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  company text not null,
  nif text not null,
  address text not null,
  country text not null check (country in ('Portugal', 'França', 'Espanha', 'Franca', 'France', 'Spain')),
  lead_type text not null check (lead_type in ('particular', 'empresa')),
  project_id uuid references public.construction_projects(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists construction_leads_created_at_idx
  on public.construction_leads (created_at desc);

create index if not exists construction_leads_email_idx
  on public.construction_leads (lower(email));

create index if not exists construction_leads_project_idx
  on public.construction_leads (project_id);

create index if not exists construction_leads_type_country_idx
  on public.construction_leads (lead_type, country);
