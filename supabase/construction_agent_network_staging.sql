create extension if not exists "pgcrypto";

create table if not exists agent_sources (
  id uuid primary key default gen_random_uuid(),
  source_name text not null,
  country text not null check (country in ('PT', 'FR', 'ES')),
  language text not null check (language in ('pt', 'fr', 'es')),
  status text not null default 'active' check (status in ('active', 'scheduled', 'standby', 'disabled')),
  trust_score numeric(5,2) not null default 75,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists agent_proposals (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references agent_sources(id) on delete set null,
  agent_code text not null,
  country text not null check (country in ('PT', 'FR', 'ES')),
  language text not null check (language in ('pt', 'fr', 'es')),
  external_reference text,
  status text not null default 'received' check (status in ('received', 'normalized', 'audited', 'supervisor_pending', 'governor_pending', 'approved', 'rejected', 'datamoat_pending', 'codex_pending', 'supabase_synced')),
  raw_payload jsonb not null,
  normalized_payload jsonb not null default '{}'::jsonb,
  audit_score integer check (audit_score between 0 and 100),
  supervisor_decision text,
  governor_decision text,
  llm_fallback_used boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists approval_queue (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references agent_proposals(id) on delete cascade,
  approver text not null default 'diego',
  channel text not null default 'telegram',
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'expired')),
  telegram_message_id text,
  requested_at timestamptz not null default now(),
  decided_at timestamptz,
  decision_notes text
);

create table if not exists agent_logs (
  id bigserial primary key,
  proposal_id uuid references agent_proposals(id) on delete set null,
  agent_code text not null,
  stage text not null,
  level text not null default 'info',
  message text not null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists audit_log (
  id bigserial primary key,
  proposal_id uuid references agent_proposals(id) on delete set null,
  actor text not null,
  action text not null,
  before_state jsonb,
  after_state jsonb,
  created_at timestamptz not null default now()
);

create table if not exists dm1_price_cache (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid references agent_proposals(id) on delete set null,
  material_code text not null,
  normalized_description text not null,
  country text not null check (country in ('PT', 'FR', 'ES')),
  unit text not null,
  unit_price numeric(12,2) not null,
  confidence numeric(5,2) not null,
  source_name text not null,
  governor_approved boolean not null default false,
  expires_at timestamptz not null default now() + interval '30 days',
  created_at timestamptz not null default now()
);

create index if not exists idx_agent_proposals_status_created on agent_proposals(status, created_at desc);
create index if not exists idx_agent_logs_proposal_created on agent_logs(proposal_id, created_at desc);
create index if not exists idx_approval_queue_status_requested on approval_queue(status, requested_at desc);
create index if not exists idx_dm1_price_cache_material_country on dm1_price_cache(material_code, country);

insert into agent_sources (source_name, country, language, status, trust_score, metadata)
values
  ('fornecedor_pt_demo', 'PT', 'pt', 'active', 82, '{"sprint":45,"role":"agent_pt_seed"}'),
  ('fornecedor_fr_scheduled', 'FR', 'fr', 'scheduled', 70, '{"activation_week":3}'),
  ('fornecedor_es_standby', 'ES', 'es', 'standby', 70, '{"activation":"standby_total"}')
on conflict do nothing;
