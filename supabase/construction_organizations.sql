create extension if not exists "pgcrypto";

create table if not exists public.construction_organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  nif text,
  country text not null default 'Portugal' check (country in ('Portugal', 'França', 'Espanha', 'Franca')),
  address text,
  subscription_plan text not null default 'home',
  created_at timestamptz not null default now()
);

alter table public.construction_organizations
  add column if not exists nif text,
  add column if not exists address text,
  add column if not exists subscription_plan text not null default 'home';

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'construction_organizations'
      and column_name = 'plan'
  ) then
    execute 'update public.construction_organizations set subscription_plan = coalesce(subscription_plan, plan, ''home'') where subscription_plan is null';
  else
    update public.construction_organizations
    set subscription_plan = coalesce(subscription_plan, 'home')
    where subscription_plan is null;
  end if;
end $$;

create index if not exists construction_organizations_country_idx
  on public.construction_organizations (country);

create index if not exists construction_organizations_subscription_plan_idx
  on public.construction_organizations (subscription_plan);

alter table public.construction_organizations enable row level security;
