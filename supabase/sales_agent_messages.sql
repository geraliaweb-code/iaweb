alter table public.diagnosticos
  add column if not exists whatsapp_message text,
  add column if not exists email_subject text,
  add column if not exists email_body text,
  add column if not exists followup_3d text,
  add column if not exists followup_7d text,
  add column if not exists followup_15d text,
  add column if not exists objection_responses jsonb not null default '{}'::jsonb,
  add column if not exists post_proposal_message text,
  add column if not exists post_meeting_message text,
  add column if not exists sales_agent_status text not null default 'gerado';

create index if not exists diagnosticos_sales_agent_status_idx
  on public.diagnosticos (sales_agent_status);
