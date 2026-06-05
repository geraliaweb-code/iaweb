create extension if not exists "pgcrypto";

create table if not exists public.construction_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  country text not null check (country in ('Portugal', 'França', 'Espanha', 'Franca')),
  user_type text not null check (user_type in ('particular', 'empresa')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.construction_projects
  add column if not exists user_id uuid references auth.users(id) on delete set null,
  add column if not exists organization_id uuid references public.construction_organizations(id) on delete set null;

create index if not exists construction_profiles_email_idx
  on public.construction_profiles (lower(email));

create index if not exists construction_profiles_type_idx
  on public.construction_profiles (user_type);

create index if not exists construction_projects_user_idx
  on public.construction_projects (user_id);

create index if not exists construction_projects_owner_scope_idx
  on public.construction_projects (organization_id, user_id);

alter table public.construction_profiles enable row level security;
alter table public.construction_projects enable row level security;

drop policy if exists construction_profiles_select_own on public.construction_profiles;
create policy construction_profiles_select_own
  on public.construction_profiles
  for select
  using (id = auth.uid());

drop policy if exists construction_profiles_insert_own on public.construction_profiles;
create policy construction_profiles_insert_own
  on public.construction_profiles
  for insert
  with check (id = auth.uid());

drop policy if exists construction_profiles_update_own on public.construction_profiles;
create policy construction_profiles_update_own
  on public.construction_profiles
  for update
  using (id = auth.uid())
  with check (id = auth.uid());
