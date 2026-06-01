create extension if not exists "pgcrypto";

alter table public.diagnosticos
  add column if not exists email_provider text not null default 'resend',
  add column if not exists email_status text not null default 'pendente',
  add column if not exists email_last_attempt_at timestamp with time zone,
  add column if not exists email_sent_at timestamp with time zone,
  add column if not exists email_error text,
  add column if not exists email_resend_id text,
  add column if not exists pdf_status text not null default 'pendente',
  add column if not exists pdf_filename text,
  add column if not exists pdf_generated_at timestamp with time zone;

update public.diagnosticos
set
  email_provider = coalesce(nullif(email_provider, ''), 'resend'),
  email_status = coalesce(nullif(email_status, ''), 'pendente'),
  pdf_status = coalesce(nullif(pdf_status, ''), 'pendente');

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'diagnosticos_email_status_check'
      and conrelid = 'public.diagnosticos'::regclass
  ) then
    alter table public.diagnosticos
      add constraint diagnosticos_email_status_check
      check (email_status in ('pendente', 'a_enviar', 'enviado', 'erro'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'diagnosticos_pdf_status_check'
      and conrelid = 'public.diagnosticos'::regclass
  ) then
    alter table public.diagnosticos
      add constraint diagnosticos_pdf_status_check
      check (pdf_status in ('pendente', 'a_gerar', 'gerado', 'erro'));
  end if;
end
$$;

create table if not exists public.diagnostico_email_events (
  id uuid primary key default gen_random_uuid(),
  diagnostico_id uuid references public.diagnosticos(id) on delete set null,
  diagnostico_digital_lead_id uuid,
  provider text not null default 'resend',
  resend_email_id text,
  recipient_email text not null default '',
  subject text not null default '',
  status text not null default 'pendente',
  error_message text,
  pdf_filename text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone not null default now()
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'diagnostico_email_events_status_check'
      and conrelid = 'public.diagnostico_email_events'::regclass
  ) then
    alter table public.diagnostico_email_events
      add constraint diagnostico_email_events_status_check
      check (status in ('pendente', 'a_enviar', 'enviado', 'erro'));
  end if;
end
$$;

create index if not exists diagnosticos_email_status_idx
  on public.diagnosticos (email_status);

create index if not exists diagnosticos_email_resend_id_idx
  on public.diagnosticos (email_resend_id);

create index if not exists diagnostico_email_events_diagnostico_id_idx
  on public.diagnostico_email_events (diagnostico_id);

create index if not exists diagnostico_email_events_created_at_idx
  on public.diagnostico_email_events (created_at desc);

create index if not exists diagnostico_email_events_recipient_email_idx
  on public.diagnostico_email_events (recipient_email);

notify pgrst, 'reload schema';
