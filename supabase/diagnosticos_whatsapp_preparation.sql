alter table public.diagnosticos
  add column if not exists whatsapp_message text;

alter table public.diagnosticos
  add column if not exists whatsapp_status text not null default 'pendente';
