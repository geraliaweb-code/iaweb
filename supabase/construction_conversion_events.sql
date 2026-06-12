create table if not exists public.construction_conversion_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.construction_projects(id) on delete cascade,
  organization_id uuid references public.construction_organizations(id) on delete set null,
  user_id uuid,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint construction_conversion_events_event_type_check
    check (
      event_type in (
        'preview_viewed',
        'benchmark_preview_viewed',
        'pdf_preview_viewed',
        'unlock_clicked',
        'checkout_started',
        'checkout_completed',
        'advisor_opened',
        'advisor_recommendation_viewed',
        'advisor_action_clicked',
        'os_opened',
        'os_action_viewed',
        'os_action_clicked',
        'timeline_opened',
        'timeline_action_viewed',
        'timeline_action_clicked',
        'risk_opened',
        'risk_viewed',
        'risk_action_clicked',
        'forecast_opened',
        'forecast_viewed',
        'forecast_action_clicked'
      )
    )
);

create index if not exists construction_conversion_events_project_idx
  on public.construction_conversion_events (project_id);

create index if not exists construction_conversion_events_organization_idx
  on public.construction_conversion_events (organization_id);

create index if not exists construction_conversion_events_event_type_idx
  on public.construction_conversion_events (event_type);

alter table public.construction_conversion_events
  drop constraint if exists construction_conversion_events_event_type_check;

alter table public.construction_conversion_events
  add constraint construction_conversion_events_event_type_check
  check (
    event_type in (
      'preview_viewed',
      'benchmark_preview_viewed',
      'pdf_preview_viewed',
      'unlock_clicked',
      'checkout_started',
      'checkout_completed',
      'advisor_opened',
      'advisor_recommendation_viewed',
      'advisor_action_clicked',
      'os_opened',
      'os_action_viewed',
      'os_action_clicked',
      'timeline_opened',
      'timeline_action_viewed',
      'timeline_action_clicked',
      'risk_opened',
      'risk_viewed',
      'risk_action_clicked',
      'forecast_opened',
      'forecast_viewed',
      'forecast_action_clicked'
    )
  );
