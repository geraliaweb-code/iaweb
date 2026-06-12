create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'quantity_project_scale_class') then
    create type public.quantity_project_scale_class as enum ('small', 'medium', 'large', 'xlarge');
  end if;

  if not exists (select 1 from pg_type where typname = 'quantity_document_language') then
    create type public.quantity_document_language as enum ('pt', 'fr', 'es');
  end if;

  if not exists (select 1 from pg_type where typname = 'quantity_source_document_type') then
    create type public.quantity_source_document_type as enum ('MQ', 'DQE', 'DPGF', 'BOQ', 'ESTIMATE');
  end if;
end $$;

create table if not exists public.quantity_records (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.construction_projects(id) on delete cascade,
  document_id uuid references public.construction_detected_documents(id) on delete set null,
  raw_code text,
  raw_description text not null,
  raw_unit text not null,
  raw_quantity numeric(18, 4) not null,
  raw_brand text,
  section text,
  subsection text,
  page_ref text,
  extraction_confidence integer check (extraction_confidence between 0 and 100),
  project_scale_class public.quantity_project_scale_class not null,
  document_language public.quantity_document_language not null,
  source_document_type public.quantity_source_document_type not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.normalized_materials (
  id uuid primary key default gen_random_uuid(),
  canonical_name text not null unique,
  pt_name text,
  fr_name text,
  es_name text,
  category text not null,
  subcategory text,
  unit_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (canonical_name = upper(canonical_name)),
  check (canonical_name ~ '^[A-Z0-9_]+$')
);

create table if not exists public.quantity_normalizations (
  id uuid primary key default gen_random_uuid(),
  record_id uuid not null references public.quantity_records(id) on delete cascade,
  material_id uuid not null references public.normalized_materials(id) on delete restrict,
  normalized_unit text not null,
  normalized_quantity numeric(18, 4) not null,
  conversion_factor numeric(18, 8) not null default 1,
  normalization_confidence integer check (normalization_confidence between 0 and 100),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (record_id, material_id)
);

create table if not exists public.unit_conversion_rules (
  id uuid primary key default gen_random_uuid(),
  from_unit text not null,
  to_unit text not null,
  factor numeric(18, 8) not null default 1,
  material_category text,
  country text check (country in ('Portugal', 'Franca', 'Espanha')),
  confidence integer not null default 70 check (confidence between 0 and 100),
  flag_overhead boolean not null default false,
  flag_compound_unit boolean not null default false,
  exclude_from_future_benchmarks boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (from_unit, to_unit, material_category, country)
);

create index if not exists quantity_records_project_idx on public.quantity_records(project_id);
create index if not exists quantity_records_document_idx on public.quantity_records(document_id);
create index if not exists quantity_records_source_idx on public.quantity_records(source_document_type, document_language, project_scale_class);
create index if not exists normalized_materials_category_idx on public.normalized_materials(category, subcategory);
create index if not exists normalized_materials_canonical_idx on public.normalized_materials(canonical_name);
create index if not exists quantity_normalizations_record_idx on public.quantity_normalizations(record_id);
create index if not exists quantity_normalizations_material_idx on public.quantity_normalizations(material_id);
create index if not exists unit_conversion_rules_lookup_idx on public.unit_conversion_rules(from_unit, material_category, country);

insert into public.normalized_materials (
  canonical_name,
  pt_name,
  fr_name,
  es_name,
  category,
  subcategory,
  unit_type,
  metadata
)
values
  ('STRUCTURAL_CONCRETE_C25_30', 'Betao C25/30', 'Beton C25/30', 'Hormigon HA-25', 'concrete', 'structural_concrete', 'm3', '{"seed":"dm6a","aliases":["Betao C25/30","Beton C25/30","Concrete C25/30","Hormigon HA-25"]}'),
  ('REINFORCEMENT_STEEL', 'Aco A400', 'Acier HA', 'Acero B500S', 'steel', 'reinforcement', 'kg', '{"seed":"dm6a","aliases":["Aco A400","Acier HA","Acero B500S"]}'),
  ('PVC_DRAINAGE_PIPE_SN4', 'Tubo PVC SN4', 'Tube PVC CR4', 'Tubo PVC SN4', 'drainage', 'pvc_pipe', 'm', '{"seed":"dm6a","aliases":["Tubo PVC SN4","Tube PVC CR4"]}'),
  ('HDPE_PIPE', 'Tubo PEAD', 'Tube PEHD', 'Tubo PEAD', 'water_network', 'hdpe_pipe', 'm', '{"seed":"dm6a","aliases":["PEAD","PEAD DN90","Tube PEHD","HDPE pipe"]}'),
  ('CONCRETE_KERB', 'Lancil', 'Bordure beton', 'Bordillo de hormigon', 'urban_elements', 'kerb', 'm', '{"seed":"dm6a","aliases":["Lancis","Bordure beton","Bordillo de hormigon"]}'),
  ('MANHOLE_CHAMBER', 'Camara de visita', 'Regard de visite', 'Pozo de registro', 'drainage', 'inspection_chamber', 'un', '{"seed":"dm6a","aliases":["Camara de visita","Regard de visite","Pozo de registro"]}'),
  ('BITUMINOUS_PAVEMENT', 'Pavimento betuminoso', 'Enrobe bitumineux', 'Pavimento bituminoso', 'roadworks', 'asphalt', 'm2', '{"seed":"dm6a","aliases":["Pavimento betuminoso","Enrobe bitumineux","Pavimento bituminoso"]}'),
  ('GRADED_AGGREGATE_BASE', 'Tout-venant', 'Tout-venant', 'Zahorra', 'earthworks', 'aggregate_base', 'm3', '{"seed":"dm6a","aliases":["Tout-venant","Zahorra","Graded aggregate base"]}')
on conflict (canonical_name) do update set
  pt_name = excluded.pt_name,
  fr_name = excluded.fr_name,
  es_name = excluded.es_name,
  category = excluded.category,
  subcategory = excluded.subcategory,
  unit_type = excluded.unit_type,
  metadata = public.normalized_materials.metadata || excluded.metadata,
  updated_at = now();

insert into public.unit_conversion_rules (
  from_unit,
  to_unit,
  factor,
  material_category,
  country,
  confidence,
  flag_overhead,
  flag_compound_unit,
  exclude_from_future_benchmarks,
  metadata
)
values
  ('m2', 'm2', 1, null, null, 98, false, false, false, '{"seed":"dm6a"}'),
  ('m²', 'm2', 1, null, null, 98, false, false, false, '{"seed":"dm6a"}'),
  ('m3', 'm3', 1, null, null, 98, false, false, false, '{"seed":"dm6a"}'),
  ('ml', 'm', 1, null, null, 96, false, false, false, '{"seed":"dm6a","meaning":"linear_meter"}'),
  ('m', 'm', 1, null, null, 98, false, false, false, '{"seed":"dm6a"}'),
  ('kg', 'kg', 1, null, null, 98, false, false, false, '{"seed":"dm6a"}'),
  ('un', 'un', 1, null, null, 96, false, false, false, '{"seed":"dm6a"}'),
  ('vg', 'vg', 1, null, null, 82, true, false, true, '{"seed":"dm6a","rule":"overhead_excluded_from_future_benchmarks"}'),
  ('conj', 'conj', 1, null, null, 78, false, true, false, '{"seed":"dm6a","rule":"compound_unit"}')
on conflict (from_unit, to_unit, material_category, country) do update set
  factor = excluded.factor,
  confidence = excluded.confidence,
  flag_overhead = excluded.flag_overhead,
  flag_compound_unit = excluded.flag_compound_unit,
  exclude_from_future_benchmarks = excluded.exclude_from_future_benchmarks,
  metadata = public.unit_conversion_rules.metadata || excluded.metadata,
  updated_at = now();
