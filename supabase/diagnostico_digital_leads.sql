create extension if not exists "pgcrypto";

create table if not exists public.diagnostico_digital_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone not null default now(),
  nome text not null,
  empresa text not null,
  email text not null,
  whatsapp text not null,
  website text not null,
  setor text not null,
  objetivo text not null,
  score_total integer not null check (score_total >= 0 and score_total <= 100),
  score_website integer not null check (score_website >= 0 and score_website <= 100),
  score_google integer not null check (score_google >= 0 and score_google <= 100),
  score_conversao integer not null check (score_conversao >= 0 and score_conversao <= 100),
  score_automacao integer not null check (score_automacao >= 0 and score_automacao <= 100),
  classificacao text not null,
  potencial_estimado text not null,
  recomendacoes jsonb not null default '[]'::jsonb
);

create index if not exists diagnostico_digital_leads_created_at_idx
  on public.diagnostico_digital_leads (created_at desc);

create index if not exists diagnostico_digital_leads_email_idx
  on public.diagnostico_digital_leads (email);

create index if not exists diagnostico_digital_leads_whatsapp_idx
  on public.diagnostico_digital_leads (whatsapp);

create index if not exists diagnostico_digital_leads_score_total_idx
  on public.diagnostico_digital_leads (score_total);
