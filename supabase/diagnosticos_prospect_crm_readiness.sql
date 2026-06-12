create extension if not exists "pgcrypto";

create table if not exists public.diagnosticos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  empresa text not null default '',
  nome_contacto text not null default '',
  email text,
  telefone text not null default '',
  website text not null default '',
  setor text not null default '',
  objetivo text not null default '',
  score_geral integer not null default 0,
  score_website integer not null default 0,
  score_google integer not null default 0,
  score_conversao integer not null default 0,
  score_automacao integer not null default 0,
  score_crm integer not null default 0,
  classificacao text not null default '',
  potencial_estimado text not null default '',
  recomendacoes jsonb not null default '[]'::jsonb,
  status text not null default 'novo',
  origem text not null default 'prospector',
  proxima_acao text not null default '',
  notas text not null default '',
  perda_mensal_estimada numeric not null default 0,
  impacto_financeiro jsonb not null default '{}'::jsonb,
  plano_recomendado text not null default '',
  homepage_gerada jsonb not null default '{}'::jsonb,
  score_projetado integer not null default 0,
  melhoria_prevista integer not null default 0,
  template_utilizado text not null default '',
  whatsapp_status text,
  whatsapp_message text,
  email_subject text,
  email_body text,
  followup_3d text,
  followup_7d text,
  followup_15d text,
  objection_responses jsonb not null default '{}'::jsonb,
  post_proposal_message text,
  post_meeting_message text,
  sales_agent_status text
);

alter table public.diagnosticos
  add column if not exists email text,
  add column if not exists cidade text not null default '',
  add column if not exists whatsapp_status text,
  add column if not exists whatsapp_message text,
  add column if not exists email_subject text,
  add column if not exists email_body text,
  add column if not exists followup_3d text,
  add column if not exists followup_7d text,
  add column if not exists followup_15d text,
  add column if not exists objection_responses jsonb not null default '{}'::jsonb,
  add column if not exists post_proposal_message text,
  add column if not exists post_meeting_message text,
  add column if not exists sales_agent_status text;

update public.diagnosticos
set email = null
where email is not null
  and btrim(email) = '';

update public.diagnosticos
set email = lower(btrim(email))
where email is not null
  and email <> lower(btrim(email));

create unique index if not exists diagnosticos_email_unique_idx
  on public.diagnosticos (email)
  where email is not null;
