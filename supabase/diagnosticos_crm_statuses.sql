update public.diagnosticos
set status = 'proposta'
where status = 'qualificado';

update public.diagnosticos
set status = 'fechado'
where status = 'ganho';

alter table public.diagnosticos
  drop constraint if exists diagnosticos_status_check;

alter table public.diagnosticos
  add constraint diagnosticos_status_check
  check (status in ('novo', 'contactado', 'reuniao', 'proposta', 'fechado', 'perdido'));
