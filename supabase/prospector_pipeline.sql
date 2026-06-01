create extension if not exists "pgcrypto";

create table if not exists public.prospects (
  id uuid primary key default gen_random_uuid(),
  empresa text not null,
  contacto text,
  email text,
  telefone text,
  website text,
  cidade text,
  regiao text,
  nicho text not null,
  keywords text[],
  score_digital integer not null default 0,
  opportunity_score integer not null default 0,
  priority_label text not null default 'Media',
  problemas_detectados jsonb not null default '[]'::jsonb,
  oportunidades jsonb not null default '[]'::jsonb,
  impacto_financeiro jsonb not null default '{}'::jsonb,
  homepage_gerada jsonb not null default '{}'::jsonb,
  score_projetado integer not null default 0,
  melhoria_prevista integer not null default 0,
  template_utilizado text not null default '',
  status text not null default 'novo',
  source text not null default 'manual',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.prospects
  add column if not exists contacto text,
  add column if not exists email text,
  add column if not exists telefone text,
  add column if not exists website text,
  add column if not exists cidade text,
  add column if not exists regiao text,
  add column if not exists keywords text[],
  add column if not exists score_digital integer not null default 0,
  add column if not exists opportunity_score integer not null default 0,
  add column if not exists priority_label text not null default 'Media',
  add column if not exists problemas_detectados jsonb not null default '[]'::jsonb,
  add column if not exists oportunidades jsonb not null default '[]'::jsonb,
  add column if not exists impacto_financeiro jsonb not null default '{}'::jsonb,
  add column if not exists homepage_gerada jsonb not null default '{}'::jsonb,
  add column if not exists score_projetado integer not null default 0,
  add column if not exists melhoria_prevista integer not null default 0,
  add column if not exists template_utilizado text not null default '',
  add column if not exists status text not null default 'novo',
  add column if not exists source text not null default 'manual',
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

create index if not exists prospects_nicho_idx
  on public.prospects (nicho);

create index if not exists prospects_cidade_idx
  on public.prospects (cidade);

create index if not exists prospects_opportunity_score_idx
  on public.prospects (opportunity_score desc);

create index if not exists prospects_priority_label_idx
  on public.prospects (priority_label);

create index if not exists prospects_status_idx
  on public.prospects (status);

create unique index if not exists prospects_email_unique_idx
  on public.prospects (email)
  where email is not null and email <> '';
