create extension if not exists "pgcrypto";

create table if not exists public.material_categories (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  parent_id uuid references public.material_categories(id) on delete set null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.specialties (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  domain text not null default 'construction',
  criticality text not null default 'medium' check (criticality in ('low', 'medium', 'high', 'critical')),
  created_at timestamptz not null default now()
);

create table if not exists public.country_contexts (
  id uuid primary key default gen_random_uuid(),
  country text not null check (country in ('Portugal', 'Franca', 'Espanha')),
  country_code text not null check (country_code in ('PT', 'FR', 'ES')),
  currency text not null default 'EUR',
  vat_rate numeric(6, 4),
  labor_market_index numeric(8, 4) not null default 1,
  material_market_index numeric(8, 4) not null default 1,
  regulatory_context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (country),
  unique (country_code)
);

create table if not exists public.construction_materials (
  id uuid primary key default gen_random_uuid(),
  country text,
  category text,
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

alter table public.construction_materials
  add column if not exists material_code text,
  add column if not exists material_category_id uuid references public.material_categories(id) on delete set null,
  add column if not exists specialty_id uuid references public.specialties(id) on delete set null,
  add column if not exists country_context_id uuid references public.country_contexts(id) on delete set null,
  add column if not exists lifecycle_stage text not null default 'active',
  add column if not exists data_moat_status text not null default 'seeded' check (data_moat_status in ('seeded', 'pending_review', 'approved', 'rejected')),
  add column if not exists metadata jsonb not null default '{}'::jsonb;

create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),
  supplier_code text not null unique,
  name text not null,
  legal_name text,
  country text check (country in ('Portugal', 'Franca', 'Espanha')),
  website text,
  segment text not null default 'normal' check (segment in ('economic', 'normal', 'premium')),
  status text not null default 'active',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.material_costs (
  id uuid primary key default gen_random_uuid(),
  material_id uuid not null references public.construction_materials(id) on delete cascade,
  country_context_id uuid not null references public.country_contexts(id) on delete cascade,
  scenario text not null check (scenario in ('economic', 'normal', 'premium')),
  unit_cost numeric(14, 4) not null,
  currency text not null default 'EUR',
  source_name text not null default 'IAWEB manual seed',
  confidence_score integer not null default 70 check (confidence_score between 0 and 100),
  valid_from date not null default current_date,
  valid_to date,
  created_at timestamptz not null default now()
);

create table if not exists public.price_history (
  id uuid primary key default gen_random_uuid(),
  material_id uuid not null references public.construction_materials(id) on delete cascade,
  country_context_id uuid not null references public.country_contexts(id) on delete cascade,
  observed_at date not null,
  unit_cost numeric(14, 4) not null,
  currency text not null default 'EUR',
  source_name text not null,
  source_type text not null default 'manual_seed',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.material_availability (
  id uuid primary key default gen_random_uuid(),
  material_id uuid not null references public.construction_materials(id) on delete cascade,
  country_context_id uuid not null references public.country_contexts(id) on delete cascade,
  availability_status text not null default 'available' check (availability_status in ('available', 'limited', 'scarce', 'unavailable')),
  lead_time_days integer,
  stock_risk text not null default 'medium' check (stock_risk in ('low', 'medium', 'high', 'critical')),
  updated_at timestamptz not null default now(),
  unique (material_id, country_context_id)
);

create table if not exists public.material_productivity (
  id uuid primary key default gen_random_uuid(),
  material_id uuid not null references public.construction_materials(id) on delete cascade,
  specialty_id uuid references public.specialties(id) on delete set null,
  unit text not null,
  productivity_per_day numeric(14, 4),
  crew_size integer,
  confidence_score integer not null default 65 check (confidence_score between 0 and 100),
  created_at timestamptz not null default now(),
  unique (material_id, specialty_id, unit)
);

create table if not exists public.material_risk_profiles (
  id uuid primary key default gen_random_uuid(),
  material_id uuid not null references public.construction_materials(id) on delete cascade,
  risk_level text not null default 'medium' check (risk_level in ('low', 'medium', 'high', 'critical')),
  cost_volatility_score integer not null default 50 check (cost_volatility_score between 0 and 100),
  supply_risk_score integer not null default 50 check (supply_risk_score between 0 and 100),
  compliance_risk_score integer not null default 30 check (compliance_risk_score between 0 and 100),
  risk_notes text,
  created_at timestamptz not null default now(),
  unique (material_id)
);

create table if not exists public.material_timeline_impacts (
  id uuid primary key default gen_random_uuid(),
  material_id uuid not null references public.construction_materials(id) on delete cascade,
  impact_level text not null default 'medium' check (impact_level in ('low', 'medium', 'high', 'critical')),
  typical_delay_days integer not null default 0,
  procurement_window_days integer,
  schedule_notes text,
  created_at timestamptz not null default now(),
  unique (material_id)
);

create table if not exists public.material_brands (
  id uuid primary key default gen_random_uuid(),
  material_id uuid not null references public.construction_materials(id) on delete cascade,
  brand_name text not null,
  manufacturer text,
  segment text not null default 'normal' check (segment in ('economic', 'normal', 'premium')),
  created_at timestamptz not null default now(),
  unique (material_id, brand_name)
);

create table if not exists public.material_brand_costs (
  id uuid primary key default gen_random_uuid(),
  material_brand_id uuid not null references public.material_brands(id) on delete cascade,
  country_context_id uuid not null references public.country_contexts(id) on delete cascade,
  unit_cost numeric(14, 4) not null,
  currency text not null default 'EUR',
  source_name text not null default 'IAWEB manual seed',
  valid_from date not null default current_date,
  created_at timestamptz not null default now(),
  unique (material_brand_id, country_context_id, valid_from)
);

create table if not exists public.material_substitutions (
  id uuid primary key default gen_random_uuid(),
  material_id uuid not null references public.construction_materials(id) on delete cascade,
  substitute_material_id uuid not null references public.construction_materials(id) on delete cascade,
  substitution_type text not null default 'equivalent',
  cost_delta_percent numeric(8, 4),
  schedule_delta_days integer,
  confidence_score integer not null default 60 check (confidence_score between 0 and 100),
  created_at timestamptz not null default now(),
  unique (material_id, substitute_material_id)
);

create table if not exists public.material_carbon (
  id uuid primary key default gen_random_uuid(),
  material_id uuid not null references public.construction_materials(id) on delete cascade,
  embodied_carbon_kgco2e_per_unit numeric(14, 4),
  epd_reference text,
  confidence_score integer not null default 40 check (confidence_score between 0 and 100),
  created_at timestamptz not null default now(),
  unique (material_id)
);

create table if not exists public.supplier_materials (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.suppliers(id) on delete cascade,
  material_id uuid not null references public.construction_materials(id) on delete cascade,
  country_context_id uuid references public.country_contexts(id) on delete set null,
  availability_status text not null default 'available',
  lead_time_days integer,
  is_preferred boolean not null default false,
  source_name text not null default 'IAWEB manual seed',
  created_at timestamptz not null default now(),
  unique (supplier_id, material_id, country_context_id)
);

create table if not exists public.material_kg_nodes (
  id uuid primary key default gen_random_uuid(),
  material_id uuid not null references public.construction_materials(id) on delete cascade,
  node_key text not null unique,
  node_type text not null default 'material',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists material_categories_parent_idx on public.material_categories(parent_id);
create unique index if not exists construction_materials_dm_unique_idx
  on public.construction_materials (country, category, subcategory, material_name, coalesce(brand, ''), unit);
create index if not exists construction_materials_category_fk_idx on public.construction_materials(material_category_id);
create index if not exists construction_materials_specialty_fk_idx on public.construction_materials(specialty_id);
create index if not exists construction_materials_country_context_fk_idx on public.construction_materials(country_context_id);
create index if not exists construction_materials_material_code_idx on public.construction_materials(material_code);
create unique index if not exists material_costs_unique_idx on public.material_costs(material_id, country_context_id, scenario, valid_from);
create index if not exists price_history_material_date_idx on public.price_history(material_id, observed_at desc);
create index if not exists material_availability_country_status_idx on public.material_availability(country_context_id, availability_status);
create index if not exists material_productivity_specialty_idx on public.material_productivity(specialty_id);
create index if not exists material_risk_profiles_level_idx on public.material_risk_profiles(risk_level);
create index if not exists material_timeline_impacts_level_idx on public.material_timeline_impacts(impact_level);
create index if not exists material_brands_material_idx on public.material_brands(material_id);
create index if not exists material_brand_costs_country_idx on public.material_brand_costs(country_context_id);
create index if not exists material_substitutions_material_idx on public.material_substitutions(material_id);
create index if not exists supplier_materials_supplier_idx on public.supplier_materials(supplier_id);
create index if not exists supplier_materials_material_idx on public.supplier_materials(material_id);

insert into public.material_categories (code, name, description)
values
  ('concrete', 'Betao', 'Betao, cimento e agregados estruturais.'),
  ('steel', 'Aco', 'Aco estrutural e armaduras.'),
  ('facade', 'Fachadas', 'Sistemas de fachada, ETICS e isolamento.'),
  ('openings', 'Caixilharias', 'Caixilharias, vidros e componentes associados.'),
  ('mep', 'Instalacoes tecnicas', 'AVAC, eletricidade, hidraulica e telecomunicacoes.'),
  ('finishes', 'Acabamentos', 'Pavimentos, pladur, pinturas e revestimentos.')
on conflict (code) do update set name = excluded.name, description = excluded.description;

insert into public.specialties (code, name, criticality)
values
  ('estruturas', 'Estruturas', 'critical'),
  ('arquitetura', 'Arquitetura', 'high'),
  ('avac', 'AVAC', 'high'),
  ('eletricidade', 'Eletricidade', 'medium'),
  ('hidraulica', 'Hidraulica', 'medium'),
  ('etics', 'ETICS', 'medium'),
  ('caixilharias', 'Caixilharias', 'high'),
  ('pavimentos', 'Pavimentos', 'medium')
on conflict (code) do update set name = excluded.name, criticality = excluded.criticality;

insert into public.country_contexts (country, country_code, vat_rate, labor_market_index, material_market_index, regulatory_context)
values
  ('Portugal', 'PT', 0.2300, 1.0000, 1.0000, '{"primary_rules":["SCIE","ITED"],"currency":"EUR"}'),
  ('Franca', 'FR', 0.2000, 1.2600, 1.1200, '{"primary_rules":["RE2020","ERP"],"currency":"EUR"}'),
  ('Espanha', 'ES', 0.2100, 0.9800, 0.9600, '{"primary_rules":["CTE","RITE"],"currency":"EUR"}')
on conflict (country) do update set
  vat_rate = excluded.vat_rate,
  labor_market_index = excluded.labor_market_index,
  material_market_index = excluded.material_market_index,
  regulatory_context = excluded.regulatory_context;

insert into public.construction_materials (
  country, category, subcategory, material_name, unit, material_code, material_category_id, specialty_id, country_context_id, economic_price, normal_price, premium_price, metadata
)
values
  ('Portugal', 'Betao', 'Estruturas', 'Betao C30/37', 'm3', 'MAT-BET-C3037-PT', (select id from public.material_categories where code = 'concrete'), (select id from public.specialties where code = 'estruturas'), (select id from public.country_contexts where country = 'Portugal'), 105, 116.67, 132, '{"seed":"dm1"}'),
  ('Portugal', 'Aco', 'Estruturas', 'Aco A500 NR', 'kg', 'MAT-ACO-A500-PT', (select id from public.material_categories where code = 'steel'), (select id from public.specialties where code = 'estruturas'), (select id from public.country_contexts where country = 'Portugal'), 0.92, 1.08, 1.28, '{"seed":"dm1"}'),
  ('Portugal', 'ETICS', 'Fachadas', 'Sistema ETICS EPS 60 mm', 'm2', 'MAT-ETICS-EPS60-PT', (select id from public.material_categories where code = 'facade'), (select id from public.specialties where code = 'etics'), (select id from public.country_contexts where country = 'Portugal'), 27, 34, 44, '{"seed":"dm1"}'),
  ('Portugal', 'Caixilharia', 'Aluminio', 'Sistema aluminio ruptura termica', 'm2', 'MAT-CX-ALU-PT', (select id from public.material_categories where code = 'openings'), (select id from public.specialties where code = 'caixilharias'), (select id from public.country_contexts where country = 'Portugal'), 185, 240, 330, '{"seed":"dm1"}'),
  ('Franca', 'Betao', 'Structures', 'Beton C30/37', 'm3', 'MAT-BET-C3037-FR', (select id from public.material_categories where code = 'concrete'), (select id from public.specialties where code = 'estruturas'), (select id from public.country_contexts where country = 'Franca'), 118, 136, 158, '{"seed":"dm1"}'),
  ('Espanha', 'Betao', 'Estructuras', 'Hormigon C30/37', 'm3', 'MAT-BET-C3037-ES', (select id from public.material_categories where code = 'concrete'), (select id from public.specialties where code = 'estruturas'), (select id from public.country_contexts where country = 'Espanha'), 98, 112, 130, '{"seed":"dm1"}')
on conflict (country, category, subcategory, material_name, coalesce(brand, ''), unit) do update set
  material_code = excluded.material_code,
  material_category_id = excluded.material_category_id,
  specialty_id = excluded.specialty_id,
  country_context_id = excluded.country_context_id,
  economic_price = excluded.economic_price,
  normal_price = excluded.normal_price,
  premium_price = excluded.premium_price,
  metadata = public.construction_materials.metadata || excluded.metadata,
  updated_at = now();

insert into public.suppliers (supplier_code, name, legal_name, country, website, segment)
values
  ('SUP-SECIL-PT', 'Secil', 'Secil', 'Portugal', 'https://www.secil.pt', 'normal'),
  ('SUP-WEBER-EU', 'Weber', 'Saint-Gobain Weber', 'Portugal', 'https://www.pt.weber', 'normal'),
  ('SUP-CORTIZO-IB', 'Cortizo', 'Cortizo', 'Espanha', 'https://www.cortizo.com', 'premium'),
  ('SUP-SAINT-GOBAIN-FR', 'Saint-Gobain', 'Saint-Gobain', 'Franca', 'https://www.saint-gobain.fr', 'premium')
on conflict (supplier_code) do update set
  name = excluded.name,
  legal_name = excluded.legal_name,
  country = excluded.country,
  website = excluded.website,
  segment = excluded.segment,
  updated_at = now();

insert into public.material_costs (material_id, country_context_id, scenario, unit_cost)
select m.id, m.country_context_id, scenario, price
from public.construction_materials m
cross join lateral (
  values ('economic', m.economic_price), ('normal', m.normal_price), ('premium', m.premium_price)
) as p(scenario, price)
where m.material_code in ('MAT-BET-C3037-PT', 'MAT-ACO-A500-PT', 'MAT-ETICS-EPS60-PT', 'MAT-CX-ALU-PT', 'MAT-BET-C3037-FR', 'MAT-BET-C3037-ES')
  and m.country_context_id is not null
  and p.price is not null
on conflict (material_id, country_context_id, scenario, valid_from) do update set unit_cost = excluded.unit_cost;

insert into public.price_history (material_id, country_context_id, observed_at, unit_cost, source_name, source_type)
select m.id, m.country_context_id, current_date, coalesce(m.normal_price, 0), 'IAWEB DM-1 seed', 'manual_seed'
from public.construction_materials m
where m.material_code is not null and m.country_context_id is not null;

insert into public.material_availability (material_id, country_context_id, availability_status, lead_time_days, stock_risk)
select id, country_context_id, 'available', case when category in ('Aco', 'Caixilharia') then 21 else 7 end, case when category in ('Aco', 'Caixilharia') then 'high' else 'medium' end
from public.construction_materials
where material_code is not null and country_context_id is not null
on conflict (material_id, country_context_id) do update set
  lead_time_days = excluded.lead_time_days,
  stock_risk = excluded.stock_risk,
  updated_at = now();

insert into public.material_productivity (material_id, specialty_id, unit, productivity_per_day, crew_size)
select id, specialty_id, unit, case when unit = 'm3' then 8 when unit = 'kg' then 650 else 18 end, 3
from public.construction_materials
where material_code is not null
on conflict (material_id, specialty_id, unit) do update set productivity_per_day = excluded.productivity_per_day, crew_size = excluded.crew_size;

insert into public.material_risk_profiles (material_id, risk_level, cost_volatility_score, supply_risk_score, compliance_risk_score, risk_notes)
select id, case when category in ('Aco', 'Caixilharia') then 'high' else 'medium' end, case when category = 'Aco' then 82 else 55 end, case when category in ('Aco', 'Caixilharia') then 76 else 45 end, 30, 'DM-1 seed risk profile.'
from public.construction_materials
where material_code is not null
on conflict (material_id) do update set
  risk_level = excluded.risk_level,
  cost_volatility_score = excluded.cost_volatility_score,
  supply_risk_score = excluded.supply_risk_score,
  risk_notes = excluded.risk_notes;

insert into public.material_timeline_impacts (material_id, impact_level, typical_delay_days, procurement_window_days, schedule_notes)
select id, case when category in ('Aco', 'Caixilharia') then 'high' else 'medium' end, case when category in ('Aco', 'Caixilharia') then 14 else 5 end, case when category in ('Aco', 'Caixilharia') then 30 else 14 end, 'DM-1 seed timeline impact.'
from public.construction_materials
where material_code is not null
on conflict (material_id) do update set
  impact_level = excluded.impact_level,
  typical_delay_days = excluded.typical_delay_days,
  procurement_window_days = excluded.procurement_window_days,
  schedule_notes = excluded.schedule_notes;

insert into public.material_brands (material_id, brand_name, manufacturer, segment)
select id, coalesce(brand, material_name), coalesce(brand, supplier_name, 'IAWEB seed'), case when premium_price > normal_price * 1.25 then 'premium' else 'normal' end
from public.construction_materials
where material_code is not null
on conflict (material_id, brand_name) do update set manufacturer = excluded.manufacturer, segment = excluded.segment;

insert into public.material_brand_costs (material_brand_id, country_context_id, unit_cost)
select mb.id, m.country_context_id, coalesce(m.normal_price, 0)
from public.material_brands mb
join public.construction_materials m on m.id = mb.material_id
where m.country_context_id is not null
on conflict (material_brand_id, country_context_id, valid_from) do update set unit_cost = excluded.unit_cost;

insert into public.material_carbon (material_id, embodied_carbon_kgco2e_per_unit, epd_reference, confidence_score)
select id, case when category = 'Betao' then 280 when category = 'Aco' then 1.8 when category = 'ETICS' then 8.5 else 12 end, 'manual_seed_pending_epd', 35
from public.construction_materials
where material_code is not null
on conflict (material_id) do update set embodied_carbon_kgco2e_per_unit = excluded.embodied_carbon_kgco2e_per_unit;

insert into public.supplier_materials (supplier_id, material_id, country_context_id, availability_status, lead_time_days, is_preferred)
select s.id, m.id, m.country_context_id, 'available', case when m.category in ('Aco', 'Caixilharia') then 21 else 7 end, true
from public.suppliers s
join public.construction_materials m on (
  (s.name = 'Secil' and m.category = 'Betao' and m.country = 'Portugal') or
  (s.name = 'Weber' and m.category = 'ETICS') or
  (s.name = 'Cortizo' and m.category = 'Caixilharia') or
  (s.name = 'Saint-Gobain' and m.country = 'Franca')
)
where m.material_code is not null
on conflict (supplier_id, material_id, country_context_id) do update set
  availability_status = excluded.availability_status,
  lead_time_days = excluded.lead_time_days,
  is_preferred = excluded.is_preferred;

insert into public.material_kg_nodes (material_id, node_key, metadata)
select id, 'material:' || material_code, jsonb_build_object('category', category, 'unit', unit, 'country', country)
from public.construction_materials
where material_code is not null
on conflict (node_key) do update set metadata = excluded.metadata;
