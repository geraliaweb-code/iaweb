create extension if not exists "pgcrypto";

create table if not exists public.construction_materials (
  id uuid primary key default gen_random_uuid(),
  country text not null check (country in ('Portugal', 'Franca', 'Espanha')),
  category text not null,
  subcategory text,
  material_name text not null,
  brand text,
  unit text not null,
  economic_price numeric(14, 2),
  normal_price numeric(14, 2),
  premium_price numeric(14, 2),
  supplier_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.construction_labor (
  id uuid primary key default gen_random_uuid(),
  country text not null check (country in ('Portugal', 'Franca', 'Espanha')),
  specialty text not null,
  unit text not null,
  productivity_per_day numeric(14, 2),
  hour_rate numeric(14, 2),
  daily_rate numeric(14, 2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.construction_equipment (
  id uuid primary key default gen_random_uuid(),
  country text not null check (country in ('Portugal', 'Franca', 'Espanha')),
  equipment_name text not null,
  daily_cost numeric(14, 2),
  weekly_cost numeric(14, 2),
  monthly_cost numeric(14, 2),
  supplier_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.construction_suppliers (
  id uuid primary key default gen_random_uuid(),
  country text not null check (country in ('Portugal', 'Franca', 'Espanha')),
  supplier_name text not null,
  website text,
  region text,
  categories text[] not null default '{}'::text[],
  created_at timestamptz not null default now()
);

create table if not exists public.construction_cost_scenarios (
  id uuid primary key default gen_random_uuid(),
  country text not null check (country in ('Portugal', 'Franca', 'Espanha')),
  scenario text not null,
  economic numeric(14, 4),
  normal numeric(14, 4),
  premium numeric(14, 4),
  created_at timestamptz not null default now()
);

create unique index if not exists construction_materials_unique_idx
  on public.construction_materials (country, category, subcategory, material_name, coalesce(brand, ''), unit);

create index if not exists construction_materials_country_category_idx
  on public.construction_materials (country, category);

create index if not exists construction_materials_supplier_idx
  on public.construction_materials (supplier_name);

create unique index if not exists construction_labor_unique_idx
  on public.construction_labor (country, specialty, unit);

create unique index if not exists construction_equipment_unique_idx
  on public.construction_equipment (country, equipment_name, coalesce(supplier_name, ''));

create unique index if not exists construction_suppliers_unique_idx
  on public.construction_suppliers (country, supplier_name);

create unique index if not exists construction_cost_scenarios_unique_idx
  on public.construction_cost_scenarios (country, scenario);

create or replace function public.set_construction_cost_database_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists construction_materials_updated_at on public.construction_materials;
create trigger construction_materials_updated_at
  before update on public.construction_materials
  for each row execute function public.set_construction_cost_database_updated_at();

drop trigger if exists construction_labor_updated_at on public.construction_labor;
create trigger construction_labor_updated_at
  before update on public.construction_labor
  for each row execute function public.set_construction_cost_database_updated_at();

drop trigger if exists construction_equipment_updated_at on public.construction_equipment;
create trigger construction_equipment_updated_at
  before update on public.construction_equipment
  for each row execute function public.set_construction_cost_database_updated_at();

insert into public.construction_suppliers (country, supplier_name, website, region, categories)
values
  ('Portugal', 'Secil', 'https://www.secil.pt', 'Portugal', array['Betao', 'Cimento']),
  ('Portugal', 'CIN', 'https://www.cin.com', 'Portugal', array['Tinta']),
  ('Portugal', 'Robbialac', 'https://www.robbialac.pt', 'Portugal', array['Tinta']),
  ('Portugal', 'Sika', 'https://prt.sika.com', 'Portugal', array['Quimicos', 'Impermeabilizacao']),
  ('Portugal', 'Weber', 'https://www.pt.weber', 'Portugal', array['ETICS', 'Argamassas']),
  ('Portugal', 'Pladur', 'https://www.pladur.com', 'Portugal', array['Pladur']),
  ('Portugal', 'Knauf', 'https://www.knauf.pt', 'Portugal', array['Pladur', 'Isolamento']),
  ('Portugal', 'Cortizo', 'https://www.cortizo.com', 'Iberia', array['Caixilharia']),
  ('Franca', 'Saint-Gobain', 'https://www.saint-gobain.fr', 'Franca', array['Vidro', 'Pladur', 'Isolamento']),
  ('Franca', 'Point.P', 'https://www.pointp.fr', 'Franca', array['Materiais gerais']),
  ('Franca', 'Gedimat', 'https://www.gedimat.fr', 'Franca', array['Materiais gerais']),
  ('Franca', 'Knauf', 'https://www.knauf.fr', 'Franca', array['Pladur', 'Isolamento']),
  ('Espanha', 'Obramat', 'https://www.obramat.es', 'Espanha', array['Materiais gerais']),
  ('Espanha', 'BigMat', 'https://www.bigmat.es', 'Espanha', array['Materiais gerais']),
  ('Espanha', 'Cortizo', 'https://www.cortizo.com', 'Espanha', array['Caixilharia']),
  ('Espanha', 'Pladur', 'https://www.pladur.com', 'Espanha', array['Pladur'])
on conflict (country, supplier_name) do update
set
  website = excluded.website,
  region = excluded.region,
  categories = excluded.categories;

insert into public.construction_materials (
  country, category, subcategory, material_name, brand, unit,
  economic_price, normal_price, premium_price, supplier_name
)
values
  ('Portugal', 'Betao', 'Estruturas', 'Betao C30/37', 'Secil', 'm3', 105, 116.67, 132, 'Secil'),
  ('Portugal', 'Aco', 'Estruturas', 'Aco A500 NR', null, 'kg', 0.92, 1.08, 1.28, 'Sika'),
  ('Portugal', 'Tijolo', 'Alvenaria', 'Tijolo ceramico 30x20x11', null, 'un', 0.38, 0.48, 0.62, 'BigMat Portugal'),
  ('Portugal', 'Pladur', 'Interiores', 'Placa gesso laminado BA13', 'Pladur', 'm2', 4.2, 5.4, 7.2, 'Pladur'),
  ('Portugal', 'Pladur', 'Interiores', 'Placa gesso laminado hidrofuga', 'Knauf', 'm2', 6.1, 7.6, 9.5, 'Knauf'),
  ('Portugal', 'ETICS', 'Fachadas', 'Sistema ETICS EPS 60 mm', 'Weber', 'm2', 27, 34, 44, 'Weber'),
  ('Portugal', 'Tinta', 'Pintura interior', 'Tinta interior mate', 'CIN', 'l', 8.4, 10.28, 13.2, 'CIN'),
  ('Portugal', 'Tinta', 'Pintura interior', 'Tinta interior mate', 'Robbialac', 'l', 7.9, 9.8, 12.5, 'Robbialac'),
  ('Portugal', 'Caixilharia', 'Aluminio', 'Sistema aluminio ruptura termica', 'Cortizo', 'm2', 185, 240, 330, 'Cortizo'),
  ('Portugal', 'Pavimentos', 'Ceramico', 'Pavimento ceramico medio formato', null, 'm2', 12, 22, 38, 'BigMat Portugal'),
  ('Franca', 'Betao', 'Structures', 'Beton C30/37', 'Saint-Gobain', 'm3', 118, 136, 158, 'Point.P'),
  ('Franca', 'Pladur', 'Interieurs', 'Plaque de platre BA13', 'Knauf', 'm2', 5.2, 6.8, 9.4, 'Knauf'),
  ('Franca', 'ETICS', 'Facades', 'Isolation thermique exterieure EPS 60 mm', 'Saint-Gobain', 'm2', 34, 43, 56, 'Point.P'),
  ('Franca', 'Tinta', 'Peinture interieure', 'Peinture interieure mate', 'Saint-Gobain', 'l', 9.8, 12.4, 16.2, 'Gedimat'),
  ('Espanha', 'Betao', 'Estructuras', 'Hormigon C30/37', null, 'm3', 98, 112, 130, 'Obramat'),
  ('Espanha', 'Pladur', 'Interiores', 'Placa yeso laminado BA13', 'Pladur', 'm2', 4.0, 5.2, 7.0, 'Pladur'),
  ('Espanha', 'Caixilharia', 'Aluminio', 'Sistema aluminio rotura puente termico', 'Cortizo', 'm2', 170, 225, 305, 'Cortizo'),
  ('Espanha', 'Pavimentos', 'Ceramico', 'Pavimento ceramico medio formato', null, 'm2', 10, 19, 34, 'BigMat')
on conflict (country, category, subcategory, material_name, coalesce(brand, ''), unit) do update
set
  economic_price = excluded.economic_price,
  normal_price = excluded.normal_price,
  premium_price = excluded.premium_price,
  supplier_name = excluded.supplier_name,
  updated_at = now();

insert into public.construction_labor (
  country, specialty, unit, productivity_per_day, hour_rate, daily_rate
)
values
  ('Portugal', 'Estruturas - betonagem', 'm3', 8, 18, 144),
  ('Portugal', 'Pintura interior', 'm2', 75, 15, 120),
  ('Portugal', 'Pladur', 'm2', 28, 17, 136),
  ('Portugal', 'ETICS', 'm2', 18, 18, 144),
  ('Franca', 'Structures - beton', 'm3', 7, 28, 224),
  ('Franca', 'Peinture interieure', 'm2', 70, 25, 200),
  ('Franca', 'Plaquiste', 'm2', 26, 27, 216),
  ('Espanha', 'Estructuras - hormigon', 'm3', 8, 19, 152),
  ('Espanha', 'Pintura interior', 'm2', 78, 16, 128),
  ('Espanha', 'Pladur', 'm2', 30, 17, 136)
on conflict (country, specialty, unit) do update
set
  productivity_per_day = excluded.productivity_per_day,
  hour_rate = excluded.hour_rate,
  daily_rate = excluded.daily_rate,
  updated_at = now();

insert into public.construction_equipment (
  country, equipment_name, daily_cost, weekly_cost, monthly_cost, supplier_name
)
values
  ('Portugal', 'Bombagem de betao', 380, 1900, 6800, 'Secil'),
  ('Portugal', 'Andaime interior movel', 45, 190, 620, 'BigMat Portugal'),
  ('Portugal', 'Plataforma elevatoria tesoura', 95, 420, 1350, 'Obramat'),
  ('Franca', 'Pompage beton', 460, 2300, 8200, 'Point.P'),
  ('Franca', 'Echafaudage mobile interieur', 62, 260, 840, 'Gedimat'),
  ('Espanha', 'Bombeo de hormigon', 340, 1700, 6100, 'Obramat'),
  ('Espanha', 'Andamio movil interior', 42, 175, 580, 'BigMat')
on conflict (country, equipment_name, coalesce(supplier_name, '')) do update
set
  daily_cost = excluded.daily_cost,
  weekly_cost = excluded.weekly_cost,
  monthly_cost = excluded.monthly_cost,
  updated_at = now();

insert into public.construction_cost_scenarios (
  country, scenario, economic, normal, premium
)
values
  ('Portugal', 'material_quality_multiplier', 0.88, 1.00, 1.22),
  ('Portugal', 'labor_complexity_multiplier', 0.92, 1.00, 1.18),
  ('Portugal', 'equipment_availability_multiplier', 0.90, 1.00, 1.15),
  ('Franca', 'material_quality_multiplier', 0.92, 1.08, 1.32),
  ('Franca', 'labor_complexity_multiplier', 1.05, 1.22, 1.42),
  ('Franca', 'equipment_availability_multiplier', 1.02, 1.18, 1.35),
  ('Espanha', 'material_quality_multiplier', 0.84, 0.96, 1.18),
  ('Espanha', 'labor_complexity_multiplier', 0.88, 0.98, 1.15),
  ('Espanha', 'equipment_availability_multiplier', 0.86, 0.96, 1.12)
on conflict (country, scenario) do update
set
  economic = excluded.economic,
  normal = excluded.normal,
  premium = excluded.premium;
