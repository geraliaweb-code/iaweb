create extension if not exists "pgcrypto";

create table if not exists public.diagnosticos (
  id uuid primary key default gen_random_uuid()
);

alter table public.diagnosticos
  add column if not exists id uuid default gen_random_uuid(),
  add column if not exists created_at timestamp with time zone not null default now(),
  add column if not exists updated_at timestamp with time zone not null default now(),
  add column if not exists diagnostico_digital_lead_id uuid,
  add column if not exists empresa text not null default '',
  add column if not exists nome_contacto text not null default '',
  add column if not exists email text not null default '',
  add column if not exists telefone text not null default '',
  add column if not exists website text not null default '',
  add column if not exists setor text not null default '',
  add column if not exists objetivo text not null default '',
  add column if not exists score_geral integer not null default 0,
  add column if not exists score_website integer not null default 0,
  add column if not exists score_google integer not null default 0,
  add column if not exists score_conversao integer not null default 0,
  add column if not exists score_automacao integer not null default 0,
  add column if not exists classificacao text not null default '',
  add column if not exists potencial_estimado text not null default '',
  add column if not exists recomendacoes jsonb not null default '[]'::jsonb,
  add column if not exists whatsapp_message text,
  add column if not exists whatsapp_status text not null default 'pendente',
  add column if not exists status text not null default 'novo';

alter table public.diagnosticos
  alter column created_at set default now(),
  alter column updated_at set default now(),
  alter column empresa set default '',
  alter column nome_contacto set default '',
  alter column email set default '',
  alter column telefone set default '',
  alter column website set default '',
  alter column setor set default '',
  alter column objetivo set default '',
  alter column score_geral set default 0,
  alter column score_website set default 0,
  alter column score_google set default 0,
  alter column score_conversao set default 0,
  alter column score_automacao set default 0,
  alter column classificacao set default '',
  alter column potencial_estimado set default '',
  alter column recomendacoes set default '[]'::jsonb,
  alter column whatsapp_status set default 'pendente',
  alter column status set default 'novo';

update public.diagnosticos
set status = 'proposta'
where status = 'qualificado';

update public.diagnosticos
set status = 'fechado'
where status = 'ganho';

update public.diagnosticos
set id = gen_random_uuid()
where id is null;

update public.diagnosticos
set status = 'novo'
where status is null
  or status not in ('novo', 'contactado', 'reuniao', 'proposta', 'fechado', 'perdido');

update public.diagnosticos
set
  empresa = coalesce(empresa, ''),
  nome_contacto = coalesce(nome_contacto, ''),
  email = coalesce(email, ''),
  telefone = coalesce(telefone, ''),
  website = coalesce(website, ''),
  setor = coalesce(setor, ''),
  objetivo = coalesce(objetivo, ''),
  classificacao = coalesce(classificacao, ''),
  potencial_estimado = coalesce(potencial_estimado, ''),
  recomendacoes = coalesce(recomendacoes, '[]'::jsonb),
  created_at = coalesce(created_at, now()),
  updated_at = coalesce(updated_at, now());

update public.diagnosticos
set
  score_geral = least(100, greatest(0, coalesce(score_geral, 0))),
  score_website = least(100, greatest(0, coalesce(score_website, 0))),
  score_google = least(100, greatest(0, coalesce(score_google, 0))),
  score_conversao = least(100, greatest(0, coalesce(score_conversao, 0))),
  score_automacao = least(100, greatest(0, coalesce(score_automacao, 0)));

update public.diagnosticos
set whatsapp_status = 'pendente'
where whatsapp_status is null
  or whatsapp_status = '';

alter table public.diagnosticos
  alter column id set default gen_random_uuid(),
  alter column id set not null,
  alter column created_at set not null,
  alter column updated_at set not null,
  alter column empresa set not null,
  alter column nome_contacto set not null,
  alter column email set not null,
  alter column telefone set not null,
  alter column website set not null,
  alter column setor set not null,
  alter column objetivo set not null,
  alter column score_geral set not null,
  alter column score_website set not null,
  alter column score_google set not null,
  alter column score_conversao set not null,
  alter column score_automacao set not null,
  alter column classificacao set not null,
  alter column potencial_estimado set not null,
  alter column recomendacoes set not null,
  alter column whatsapp_status set not null,
  alter column status set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where contype = 'p'
      and conrelid = 'public.diagnosticos'::regclass
  ) then
    alter table public.diagnosticos
      add constraint diagnosticos_pkey primary key (id);
  end if;
end
$$;

do $$
begin
  if exists (
    select 1
    from pg_constraint
    where conname = 'diagnosticos_status_check'
      and conrelid = 'public.diagnosticos'::regclass
  ) then
    alter table public.diagnosticos
      drop constraint diagnosticos_status_check;
  end if;

  alter table public.diagnosticos
    add constraint diagnosticos_status_check
    check (status in ('novo', 'contactado', 'reuniao', 'proposta', 'fechado', 'perdido'));
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'diagnosticos_score_geral_check'
      and conrelid = 'public.diagnosticos'::regclass
  ) then
    alter table public.diagnosticos
      add constraint diagnosticos_score_geral_check
      check (score_geral >= 0 and score_geral <= 100);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'diagnosticos_score_website_check'
      and conrelid = 'public.diagnosticos'::regclass
  ) then
    alter table public.diagnosticos
      add constraint diagnosticos_score_website_check
      check (score_website >= 0 and score_website <= 100);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'diagnosticos_score_google_check'
      and conrelid = 'public.diagnosticos'::regclass
  ) then
    alter table public.diagnosticos
      add constraint diagnosticos_score_google_check
      check (score_google >= 0 and score_google <= 100);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'diagnosticos_score_conversao_check'
      and conrelid = 'public.diagnosticos'::regclass
  ) then
    alter table public.diagnosticos
      add constraint diagnosticos_score_conversao_check
      check (score_conversao >= 0 and score_conversao <= 100);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'diagnosticos_score_automacao_check'
      and conrelid = 'public.diagnosticos'::regclass
  ) then
    alter table public.diagnosticos
      add constraint diagnosticos_score_automacao_check
      check (score_automacao >= 0 and score_automacao <= 100);
  end if;
end
$$;

do $$
begin
  if exists (
    select 1
    from public.diagnosticos
    where diagnostico_digital_lead_id is not null
    group by diagnostico_digital_lead_id
    having count(*) > 1
  ) then
    raise notice 'Skipped unique index diagnosticos_diagnostico_digital_lead_id_idx because duplicate diagnostico_digital_lead_id values exist.';
  else
    create unique index if not exists diagnosticos_diagnostico_digital_lead_id_idx
      on public.diagnosticos (diagnostico_digital_lead_id);
  end if;
end
$$;

create index if not exists diagnosticos_created_at_idx
  on public.diagnosticos (created_at desc);

create index if not exists diagnosticos_status_idx
  on public.diagnosticos (status);

create index if not exists diagnosticos_score_geral_idx
  on public.diagnosticos (score_geral);

create index if not exists diagnosticos_email_idx
  on public.diagnosticos (email);

create index if not exists diagnosticos_telefone_idx
  on public.diagnosticos (telefone);

notify pgrst, 'reload schema';
