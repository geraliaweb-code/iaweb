create extension if not exists "pgcrypto";

create table if not exists public.prospect_signals (
  id uuid primary key default gen_random_uuid(),
  prospect_id uuid not null references public.prospects(id) on delete cascade,
  signal_type text not null,
  signal_text text not null,
  signal_score integer,
  source text not null default 'prospector',
  source_url text,
  created_at timestamptz not null default now()
);

create index if not exists prospect_signals_prospect_id_idx
  on public.prospect_signals (prospect_id);

create index if not exists prospect_signals_signal_type_idx
  on public.prospect_signals (signal_type);

create index if not exists prospect_signals_created_at_idx
  on public.prospect_signals (created_at desc);

create index if not exists prospect_signals_source_idx
  on public.prospect_signals (source);
