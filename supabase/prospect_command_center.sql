create extension if not exists "pgcrypto";

do $$ begin
  create type public.prospect_agent_run_status as enum ('active', 'paused', 'idle', 'completed', 'failed');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.prospect_agent_event_type as enum (
    'agent_started',
    'agent_finished',
    'company_found',
    'website_analyzed',
    'email_found',
    'pain_signal_detected',
    'lead_imported',
    'error'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists public.prospect_agent_runs (
  id uuid primary key default gen_random_uuid(),
  agent_name text not null,
  status public.prospect_agent_run_status not null default 'idle',
  current_task text,
  started_at timestamptz,
  finished_at timestamptz,
  total_processed integer not null default 0,
  total_success integer not null default 0,
  total_failed integer not null default 0,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.prospect_agent_events (
  id uuid primary key default gen_random_uuid(),
  agent_name text not null,
  event_type public.prospect_agent_event_type not null,
  event_message text not null,
  company_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists prospect_agent_runs_agent_name_idx
  on public.prospect_agent_runs (agent_name);

create index if not exists prospect_agent_runs_status_idx
  on public.prospect_agent_runs (status);

create index if not exists prospect_agent_runs_started_at_idx
  on public.prospect_agent_runs (started_at desc);

create index if not exists prospect_agent_events_agent_name_idx
  on public.prospect_agent_events (agent_name);

create index if not exists prospect_agent_events_event_type_idx
  on public.prospect_agent_events (event_type);

create index if not exists prospect_agent_events_created_at_idx
  on public.prospect_agent_events (created_at desc);

create or replace function public.set_prospect_agent_runs_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists prospect_agent_runs_updated_at on public.prospect_agent_runs;
create trigger prospect_agent_runs_updated_at
  before update on public.prospect_agent_runs
  for each row
  execute function public.set_prospect_agent_runs_updated_at();
