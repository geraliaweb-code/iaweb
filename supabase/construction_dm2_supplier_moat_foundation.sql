create extension if not exists "pgcrypto";

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

alter table public.suppliers
  add column if not exists vat_number text,
  add column if not exists headquarters_city text,
  add column if not exists procurement_score integer default 60 check (procurement_score between 0 and 100),
  add column if not exists sustainability_score integer default 50 check (sustainability_score between 0 and 100);

create table if not exists public.supplier_profiles (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.suppliers(id) on delete cascade,
  company_size text,
  founded_year integer,
  description text,
  capabilities text[] not null default '{}',
  payment_terms text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (supplier_id)
);

create table if not exists public.supplier_coverage (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.suppliers(id) on delete cascade,
  country_context_id uuid references public.country_contexts(id) on delete set null,
  region text,
  coverage_level text not null default 'national' check (coverage_level in ('local', 'regional', 'national', 'european')),
  delivery_days integer,
  created_at timestamptz not null default now()
);

create table if not exists public.supplier_performance (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.suppliers(id) on delete cascade,
  on_time_delivery_score integer not null default 70 check (on_time_delivery_score between 0 and 100),
  quality_score integer not null default 70 check (quality_score between 0 and 100),
  price_stability_score integer not null default 60 check (price_stability_score between 0 and 100),
  responsiveness_score integer not null default 60 check (responsiveness_score between 0 and 100),
  observed_at date not null default current_date,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.supplier_risk (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.suppliers(id) on delete cascade,
  risk_level text not null default 'medium' check (risk_level in ('low', 'medium', 'high', 'critical')),
  financial_risk_score integer not null default 40 check (financial_risk_score between 0 and 100),
  delivery_risk_score integer not null default 45 check (delivery_risk_score between 0 and 100),
  geopolitical_risk_score integer not null default 30 check (geopolitical_risk_score between 0 and 100),
  notes text,
  updated_at timestamptz not null default now(),
  unique (supplier_id)
);

create table if not exists public.supplier_alternatives (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.suppliers(id) on delete cascade,
  alternative_supplier_id uuid not null references public.suppliers(id) on delete cascade,
  substitution_fit_score integer not null default 60 check (substitution_fit_score between 0 and 100),
  reason text,
  created_at timestamptz not null default now(),
  unique (supplier_id, alternative_supplier_id)
);

create table if not exists public.supplier_price_history (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.suppliers(id) on delete cascade,
  material_id uuid references public.construction_materials(id) on delete cascade,
  observed_at date not null,
  unit_cost numeric(14, 4) not null,
  currency text not null default 'EUR',
  source_name text not null default 'IAWEB manual seed',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.supplier_certifications (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.suppliers(id) on delete cascade,
  certification_name text not null,
  certification_body text,
  valid_until date,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (supplier_id, certification_name)
);

create table if not exists public.supplier_contacts (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.suppliers(id) on delete cascade,
  contact_type text not null default 'commercial',
  name text,
  email text,
  phone text,
  region text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.supplier_benchmark (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.suppliers(id) on delete cascade,
  benchmark_metric text not null,
  benchmark_value numeric(14, 4) not null,
  country_context_id uuid references public.country_contexts(id) on delete set null,
  observed_at date not null default current_date,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.procurement_strategies (
  id uuid primary key default gen_random_uuid(),
  strategy_code text not null unique,
  name text not null,
  description text,
  risk_level text not null default 'medium' check (risk_level in ('low', 'medium', 'high', 'critical')),
  recommended_for text[] not null default '{}',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.supplier_kg_nodes (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.suppliers(id) on delete cascade,
  node_key text not null unique,
  node_type text not null default 'supplier',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.supplier_manufacturers (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.suppliers(id) on delete cascade,
  manufacturer_name text not null,
  relationship_type text not null default 'manufacturer',
  countries text[] not null default '{}',
  created_at timestamptz not null default now(),
  unique (supplier_id, manufacturer_name)
);

create table if not exists public.supplier_disruptions (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.suppliers(id) on delete cascade,
  disruption_type text not null,
  severity text not null default 'medium' check (severity in ('low', 'medium', 'high', 'critical')),
  title text not null,
  started_at date,
  resolved_at date,
  expected_delay_days integer,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.supplier_market_share (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.suppliers(id) on delete cascade,
  country_context_id uuid references public.country_contexts(id) on delete set null,
  category_id uuid references public.material_categories(id) on delete set null,
  estimated_share_percent numeric(8, 4),
  confidence_score integer not null default 40 check (confidence_score between 0 and 100),
  observed_at date not null default current_date,
  unique (supplier_id, country_context_id, category_id, observed_at)
);

create table if not exists public.supplier_negotiation_intelligence (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.suppliers(id) on delete cascade,
  leverage_score integer not null default 50 check (leverage_score between 0 and 100),
  discount_band_min numeric(8, 4),
  discount_band_max numeric(8, 4),
  negotiation_notes text,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (supplier_id)
);

create table if not exists public.supplier_carbon (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.suppliers(id) on delete cascade,
  carbon_score integer not null default 50 check (carbon_score between 0 and 100),
  scope_notes text,
  certifications text[] not null default '{}',
  updated_at timestamptz not null default now(),
  unique (supplier_id)
);

create index if not exists suppliers_country_segment_idx on public.suppliers(country, segment);
create index if not exists supplier_profiles_supplier_idx on public.supplier_profiles(supplier_id);
create index if not exists supplier_coverage_supplier_country_idx on public.supplier_coverage(supplier_id, country_context_id);
create unique index if not exists supplier_coverage_unique_idx on public.supplier_coverage(supplier_id, country_context_id, coalesce(region, ''));
create index if not exists supplier_materials_supplier_idx on public.supplier_materials(supplier_id);
create index if not exists supplier_materials_material_idx on public.supplier_materials(material_id);
create index if not exists supplier_performance_supplier_date_idx on public.supplier_performance(supplier_id, observed_at desc);
create index if not exists supplier_risk_level_idx on public.supplier_risk(risk_level);
create index if not exists supplier_alternatives_supplier_idx on public.supplier_alternatives(supplier_id);
create index if not exists supplier_price_history_supplier_date_idx on public.supplier_price_history(supplier_id, observed_at desc);
create index if not exists supplier_certifications_supplier_idx on public.supplier_certifications(supplier_id);
create index if not exists supplier_contacts_supplier_idx on public.supplier_contacts(supplier_id);
create index if not exists supplier_benchmark_supplier_metric_idx on public.supplier_benchmark(supplier_id, benchmark_metric);
create index if not exists supplier_disruptions_supplier_severity_idx on public.supplier_disruptions(supplier_id, severity);
create index if not exists supplier_market_share_category_idx on public.supplier_market_share(category_id);

insert into public.suppliers (supplier_code, name, legal_name, country, website, segment, procurement_score, sustainability_score)
values
  ('SUP-SECIL-PT', 'Secil', 'Secil', 'Portugal', 'https://www.secil.pt', 'normal', 74, 62),
  ('SUP-WEBER-EU', 'Weber', 'Saint-Gobain Weber', 'Portugal', 'https://www.pt.weber', 'normal', 78, 68),
  ('SUP-CORTIZO-IB', 'Cortizo', 'Cortizo', 'Espanha', 'https://www.cortizo.com', 'premium', 82, 60),
  ('SUP-SAINT-GOBAIN-FR', 'Saint-Gobain', 'Saint-Gobain', 'Franca', 'https://www.saint-gobain.fr', 'premium', 86, 72),
  ('SUP-SCHNEIDER-EU', 'Schneider Electric', 'Schneider Electric', 'Franca', 'https://www.se.com', 'premium', 88, 70)
on conflict (supplier_code) do update set
  procurement_score = excluded.procurement_score,
  sustainability_score = excluded.sustainability_score,
  updated_at = now();

insert into public.supplier_profiles (supplier_id, company_size, description, capabilities, payment_terms)
select id, 'enterprise', name || ' supplier profile seed.', array['materials', 'technical_support', 'logistics'], '30_days'
from public.suppliers
on conflict (supplier_id) do update set capabilities = excluded.capabilities, payment_terms = excluded.payment_terms;

insert into public.supplier_coverage (supplier_id, country_context_id, region, coverage_level, delivery_days)
select s.id, c.id, c.country, case when s.name in ('Saint-Gobain', 'Schneider Electric') then 'european' else 'national' end, case when s.segment = 'premium' then 10 else 14 end
from public.suppliers s
join public.country_contexts c on c.country = coalesce(s.country, c.country)
on conflict (supplier_id, country_context_id, coalesce(region, '')) do update set coverage_level = excluded.coverage_level, delivery_days = excluded.delivery_days;

insert into public.supplier_performance (supplier_id, on_time_delivery_score, quality_score, price_stability_score, responsiveness_score)
select id, procurement_score, case when segment = 'premium' then 86 else 74 end, case when segment = 'premium' then 70 else 62 end, 68
from public.suppliers;

insert into public.supplier_risk (supplier_id, risk_level, financial_risk_score, delivery_risk_score, geopolitical_risk_score, notes)
select id, case when procurement_score >= 82 then 'low' when procurement_score >= 70 then 'medium' else 'high' end, 35, 100 - procurement_score, 30, 'DM-2 seed supplier risk.'
from public.suppliers
on conflict (supplier_id) do update set risk_level = excluded.risk_level, delivery_risk_score = excluded.delivery_risk_score, updated_at = now();

insert into public.supplier_alternatives (supplier_id, alternative_supplier_id, substitution_fit_score, reason)
select s1.id, s2.id, 68, 'DM-2 seed alternative by segment/category proximity.'
from public.suppliers s1
join public.suppliers s2 on s1.id <> s2.id and s1.segment = s2.segment
where s1.name in ('Weber', 'Saint-Gobain', 'Secil') and s2.name in ('Weber', 'Saint-Gobain', 'Secil')
on conflict (supplier_id, alternative_supplier_id) do update set substitution_fit_score = excluded.substitution_fit_score, reason = excluded.reason;

insert into public.supplier_price_history (supplier_id, material_id, observed_at, unit_cost)
select sm.supplier_id, sm.material_id, current_date, coalesce(m.normal_price, 0)
from public.supplier_materials sm
join public.construction_materials m on m.id = sm.material_id;

insert into public.supplier_certifications (supplier_id, certification_name, certification_body)
select id, 'ISO 9001', 'Seed certification body'
from public.suppliers
on conflict (supplier_id, certification_name) do update set certification_body = excluded.certification_body;

insert into public.supplier_contacts (supplier_id, contact_type, name, region)
select id, 'commercial', name || ' Commercial Desk', country
from public.suppliers;

insert into public.supplier_benchmark (supplier_id, benchmark_metric, benchmark_value, country_context_id)
select s.id, 'procurement_score', s.procurement_score, c.id
from public.suppliers s
left join public.country_contexts c on c.country = s.country;

insert into public.procurement_strategies (strategy_code, name, description, risk_level, recommended_for)
values
  ('early_lock_structural', 'Early lock estrutural', 'Antecipar compra de aco, betao e sistemas estruturais.', 'high', array['Aco', 'Betao']),
  ('dual_source_facade', 'Dual source fachada', 'Manter alternativa para ETICS, vidro e caixilharia.', 'medium', array['ETICS', 'Caixilharia']),
  ('premium_supplier_mep', 'Premium supplier MEP', 'Usar fornecedor premium para AVAC e eletricidade em caminho critico.', 'medium', array['AVAC', 'Eletricidade'])
on conflict (strategy_code) do update set description = excluded.description, recommended_for = excluded.recommended_for;

insert into public.supplier_manufacturers (supplier_id, manufacturer_name, relationship_type, countries)
select id, legal_name, 'manufacturer', array[coalesce(country, 'Europa')]
from public.suppliers
on conflict (supplier_id, manufacturer_name) do update set countries = excluded.countries;

insert into public.supplier_disruptions (supplier_id, disruption_type, severity, title, expected_delay_days)
select id, 'market_watch', case when name = 'Cortizo' then 'medium' else 'low' end, 'Seed disruption watch: lead time monitoring', case when name = 'Cortizo' then 14 else 3 end
from public.suppliers;

insert into public.supplier_market_share (supplier_id, country_context_id, category_id, estimated_share_percent, confidence_score)
select s.id, c.id, mc.id, case when s.segment = 'premium' then 12 else 8 end, 35
from public.suppliers s
left join public.country_contexts c on c.country = s.country
cross join public.material_categories mc
where mc.code in ('concrete', 'facade', 'openings', 'mep')
on conflict (supplier_id, country_context_id, category_id, observed_at) do update set estimated_share_percent = excluded.estimated_share_percent;

insert into public.supplier_negotiation_intelligence (supplier_id, leverage_score, discount_band_min, discount_band_max, negotiation_notes)
select id, case when segment = 'premium' then 45 else 62 end, 0.0200, case when segment = 'premium' then 0.0700 else 0.1100 end, 'DM-2 seed negotiation profile.'
from public.suppliers
on conflict (supplier_id) do update set leverage_score = excluded.leverage_score, discount_band_max = excluded.discount_band_max, updated_at = now();

insert into public.supplier_carbon (supplier_id, carbon_score, scope_notes, certifications)
select id, sustainability_score, 'DM-2 seed carbon profile pending supplier-verified data.', array['pending_epd_review']
from public.suppliers
on conflict (supplier_id) do update set carbon_score = excluded.carbon_score, updated_at = now();

insert into public.supplier_kg_nodes (supplier_id, node_key, metadata)
select id, 'supplier:' || supplier_code, jsonb_build_object('name', name, 'segment', segment, 'country', country)
from public.suppliers
on conflict (node_key) do update set metadata = excluded.metadata;
