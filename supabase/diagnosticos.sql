create extension if not exists "pgcrypto";

create table if not exists public.diagnosticos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  diagnostico_digital_lead_id uuid unique,
  empresa text not null,
  nome_contacto text not null,
  email text not null,
  telefone text not null,
  website text not null,
  setor text not null,
  objetivo text not null,
  score_geral integer not null check (score_geral >= 0 and score_geral <= 100),
  score_website integer not null check (score_website >= 0 and score_website <= 100),
  score_google integer not null check (score_google >= 0 and score_google <= 100),
  score_conversao integer not null check (score_conversao >= 0 and score_conversao <= 100),
  score_automacao integer not null check (score_automacao >= 0 and score_automacao <= 100),
  classificacao text not null,
  potencial_estimado text not null,
  recomendacoes jsonb not null default '[]'::jsonb,
  whatsapp_message text,
  whatsapp_status text not null default 'pendente',
  status text not null default 'novo' check (status in ('novo', 'contactado', 'reuniao', 'proposta', 'fechado', 'perdido'))
);

create index if not exists diagnosticos_created_at_idx
  on public.diagnosticos (created_at desc);

create index if not exists diagnosticos_email_idx
  on public.diagnosticos (email);

create index if not exists diagnosticos_telefone_idx
  on public.diagnosticos (telefone);

create index if not exists diagnosticos_status_idx
  on public.diagnosticos (status);

create index if not exists diagnosticos_score_geral_idx
  on public.diagnosticos (score_geral);
