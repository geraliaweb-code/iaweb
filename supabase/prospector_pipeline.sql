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
  prospect_score integer not null default 0,
  classificacao text not null default 'Oportunidade',
  sinais_score jsonb not null default '{}'::jsonb,
  score_digital integer not null default 0,
  opportunity_score integer not null default 0,
  priority_label text not null default 'Media',
  problemas_detectados jsonb not null default '[]'::jsonb,
  oportunidades jsonb not null default '[]'::jsonb,
  potencial_estimado integer not null default 0,
  resumo_executivo text not null default '',
  proxima_acao text not null default '',
  impacto_financeiro jsonb not null default '{}'::jsonb,
  homepage_gerada jsonb not null default '{}'::jsonb,
  score_projetado integer not null default 0,
  melhoria_prevista integer not null default 0,
  template_utilizado text not null default '',
  whatsapp_message text,
  email_subject text,
  email_body text,
  followup_3d text,
  followup_7d text,
  followup_15d text,
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
  add column if not exists prospect_score integer not null default 0,
  add column if not exists classificacao text not null default 'Oportunidade',
  add column if not exists sinais_score jsonb not null default '{}'::jsonb,
  add column if not exists score_digital integer not null default 0,
  add column if not exists opportunity_score integer not null default 0,
  add column if not exists priority_label text not null default 'Media',
  add column if not exists problemas_detectados jsonb not null default '[]'::jsonb,
  add column if not exists oportunidades jsonb not null default '[]'::jsonb,
  add column if not exists potencial_estimado integer not null default 0,
  add column if not exists resumo_executivo text not null default '',
  add column if not exists proxima_acao text not null default '',
  add column if not exists impacto_financeiro jsonb not null default '{}'::jsonb,
  add column if not exists homepage_gerada jsonb not null default '{}'::jsonb,
  add column if not exists score_projetado integer not null default 0,
  add column if not exists melhoria_prevista integer not null default 0,
  add column if not exists template_utilizado text not null default '',
  add column if not exists whatsapp_message text,
  add column if not exists email_subject text,
  add column if not exists email_body text,
  add column if not exists followup_3d text,
  add column if not exists followup_7d text,
  add column if not exists followup_15d text,
  add column if not exists status text not null default 'novo',
  add column if not exists source text not null default 'manual',
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

update public.prospects
set
  prospect_score = case
    when prospect_score = 0 then score_digital
    else prospect_score
  end,
  classificacao = case
    when classificacao is null or classificacao = '' or classificacao = 'Oportunidade' then
      case
        when coalesce(nullif(prospect_score, 0), score_digital) <= 40 then 'Critico'
        when coalesce(nullif(prospect_score, 0), score_digital) <= 70 then 'Oportunidade'
        else 'Forte'
      end
    else classificacao
  end,
  potencial_estimado = case
    when potencial_estimado = 0 then coalesce((impacto_financeiro #>> '{lostRevenueMonthly,max}')::integer, 0)
    else potencial_estimado
  end,
  resumo_executivo = case
    when resumo_executivo = '' then empresa || ' tem sinais digitais com potencial comercial a validar pelo Prospector IA.'
    else resumo_executivo
  end,
  proxima_acao = case
    when proxima_acao = '' then 'Validar prospect e enviar abordagem comercial personalizada'
    else proxima_acao
  end;

create index if not exists prospects_nicho_idx
  on public.prospects (nicho);

create index if not exists prospects_cidade_idx
  on public.prospects (cidade);

create index if not exists prospects_opportunity_score_idx
  on public.prospects (opportunity_score desc);

create index if not exists prospects_prospect_score_idx
  on public.prospects (prospect_score);

create index if not exists prospects_classificacao_idx
  on public.prospects (classificacao);

create index if not exists prospects_priority_label_idx
  on public.prospects (priority_label);

create index if not exists prospects_status_idx
  on public.prospects (status);

create unique index if not exists prospects_email_unique_idx
  on public.prospects (email)
  where email is not null and email <> '';
