alter table public.diagnosticos
  add column if not exists origem text not null default 'diagnostico',
  add column if not exists proxima_acao text not null default '',
  add column if not exists notas text not null default '',
  add column if not exists perda_mensal_estimada integer not null default 0,
  add column if not exists impacto_financeiro jsonb not null default '{}'::jsonb,
  add column if not exists plano_recomendado text not null default '',
  add column if not exists score_crm integer not null default 0;

update public.diagnosticos
set status = 'reuniao'
where status = 'reunião';

update public.diagnosticos
set status = 'novo'
where status is null
  or status not in ('novo', 'contactado', 'reuniao', 'simulacao', 'proposta', 'negociacao', 'fechado', 'perdido');

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
    check (status in ('novo', 'contactado', 'reuniao', 'simulacao', 'proposta', 'negociacao', 'fechado', 'perdido'));
end
$$;

create index if not exists diagnosticos_origem_idx
  on public.diagnosticos (origem);

create index if not exists diagnosticos_setor_idx
  on public.diagnosticos (setor);

create index if not exists diagnosticos_plano_recomendado_idx
  on public.diagnosticos (plano_recomendado);

notify pgrst, 'reload schema';
