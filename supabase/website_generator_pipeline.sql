alter table public.diagnosticos
  add column if not exists homepage_gerada jsonb not null default '{}'::jsonb,
  add column if not exists score_projetado integer not null default 0,
  add column if not exists melhoria_prevista integer not null default 0,
  add column if not exists template_utilizado text not null default '';

create index if not exists diagnosticos_score_projetado_idx
  on public.diagnosticos (score_projetado);

create index if not exists diagnosticos_template_utilizado_idx
  on public.diagnosticos (template_utilizado);
