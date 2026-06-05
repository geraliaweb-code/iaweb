create extension if not exists "pgcrypto";

create table if not exists public.construction_organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.construction_organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'manager', 'viewer')),
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create index if not exists construction_organization_members_org_idx
  on public.construction_organization_members (organization_id);

create index if not exists construction_organization_members_user_idx
  on public.construction_organization_members (user_id);

create index if not exists construction_organization_members_role_idx
  on public.construction_organization_members (role);

alter table public.construction_organization_members enable row level security;

create or replace function public.is_construction_organization_member(target_organization_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.construction_organization_members
    where organization_id = target_organization_id
      and user_id = auth.uid()
  );
$$;

create or replace function public.has_construction_organization_role(target_organization_id uuid, allowed_roles text[])
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.construction_organization_members
    where organization_id = target_organization_id
      and user_id = auth.uid()
      and role = any(allowed_roles)
  );
$$;

drop policy if exists construction_organization_members_select_own_org on public.construction_organization_members;
create policy construction_organization_members_select_own_org
  on public.construction_organization_members
  for select
  using (user_id = auth.uid() or public.is_construction_organization_member(organization_id));

drop policy if exists construction_organization_members_manage_admins on public.construction_organization_members;
create policy construction_organization_members_manage_admins
  on public.construction_organization_members
  for all
  using (public.has_construction_organization_role(organization_id, array['owner', 'admin']))
  with check (public.has_construction_organization_role(organization_id, array['owner', 'admin']));

drop policy if exists construction_organizations_select_member on public.construction_organizations;
create policy construction_organizations_select_member
  on public.construction_organizations
  for select
  using (public.is_construction_organization_member(id));

drop policy if exists construction_organizations_update_admins on public.construction_organizations;
create policy construction_organizations_update_admins
  on public.construction_organizations
  for update
  using (public.has_construction_organization_role(id, array['owner', 'admin']))
  with check (public.has_construction_organization_role(id, array['owner', 'admin']));

drop policy if exists construction_projects_select_owner_scope on public.construction_projects;
create policy construction_projects_select_owner_scope
  on public.construction_projects
  for select
  using (user_id = auth.uid() or public.is_construction_organization_member(organization_id));

drop policy if exists construction_projects_insert_owner_scope on public.construction_projects;
create policy construction_projects_insert_owner_scope
  on public.construction_projects
  for insert
  with check (user_id = auth.uid() or public.has_construction_organization_role(organization_id, array['owner', 'admin', 'manager']));

drop policy if exists construction_projects_update_owner_scope on public.construction_projects;
create policy construction_projects_update_owner_scope
  on public.construction_projects
  for update
  using (user_id = auth.uid() or public.has_construction_organization_role(organization_id, array['owner', 'admin', 'manager']))
  with check (user_id = auth.uid() or public.has_construction_organization_role(organization_id, array['owner', 'admin', 'manager']));
