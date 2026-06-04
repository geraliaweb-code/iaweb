create extension if not exists "pgcrypto";

create table if not exists public.construction_knowledge_sources (
  id uuid primary key default gen_random_uuid(),
  country text not null,
  source_name text not null,
  source_url text not null,
  source_type text not null,
  captured_at timestamptz,
  license_notes text not null,
  confidence_score integer not null default 0 check (confidence_score between 0 and 100),
  reviewed_status text not null default 'pending' check (reviewed_status in ('pending', 'approved', 'rejected')),
  raw_payload jsonb not null default '{}'::jsonb,
  normalized_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.construction_dataset_items (
  id uuid primary key default gen_random_uuid(),
  item_type text not null,
  country text not null,
  source_name text not null,
  source_url text not null,
  source_type text not null,
  captured_at timestamptz,
  license_notes text not null,
  confidence_score integer not null default 0 check (confidence_score between 0 and 100),
  reviewed_status text not null default 'pending' check (reviewed_status in ('pending', 'approved', 'rejected')),
  raw_payload jsonb not null default '{}'::jsonb,
  normalized_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.construction_cost_references (
  id uuid primary key default gen_random_uuid(),
  country text not null,
  source_name text not null,
  source_url text not null,
  source_type text not null,
  captured_at timestamptz,
  license_notes text not null,
  confidence_score integer not null default 0 check (confidence_score between 0 and 100),
  reviewed_status text not null default 'pending' check (reviewed_status in ('pending', 'approved', 'rejected')),
  raw_payload jsonb not null default '{}'::jsonb,
  normalized_payload jsonb not null default '{}'::jsonb,
  project_type text not null,
  min_eur_m2 numeric(12, 2) not null,
  max_eur_m2 numeric(12, 2) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.construction_schedule_references (
  id uuid primary key default gen_random_uuid(),
  country text not null,
  source_name text not null,
  source_url text not null,
  source_type text not null,
  captured_at timestamptz,
  license_notes text not null,
  confidence_score integer not null default 0 check (confidence_score between 0 and 100),
  reviewed_status text not null default 'pending' check (reviewed_status in ('pending', 'approved', 'rejected')),
  raw_payload jsonb not null default '{}'::jsonb,
  normalized_payload jsonb not null default '{}'::jsonb,
  project_type text not null,
  min_months numeric(8, 2) not null,
  max_months numeric(8, 2) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.construction_risk_references (
  id uuid primary key default gen_random_uuid(),
  country text not null,
  source_name text not null,
  source_url text not null,
  source_type text not null,
  captured_at timestamptz,
  license_notes text not null,
  confidence_score integer not null default 0 check (confidence_score between 0 and 100),
  reviewed_status text not null default 'pending' check (reviewed_status in ('pending', 'approved', 'rejected')),
  raw_payload jsonb not null default '{}'::jsonb,
  normalized_payload jsonb not null default '{}'::jsonb,
  risk_type text not null,
  severity text not null default 'medium',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.construction_document_taxonomy (
  id uuid primary key default gen_random_uuid(),
  country text not null,
  source_name text not null,
  source_url text not null,
  source_type text not null,
  captured_at timestamptz,
  license_notes text not null,
  confidence_score integer not null default 0 check (confidence_score between 0 and 100),
  reviewed_status text not null default 'pending' check (reviewed_status in ('pending', 'approved', 'rejected')),
  raw_payload jsonb not null default '{}'::jsonb,
  normalized_payload jsonb not null default '{}'::jsonb,
  document_type text not null,
  specialty text not null,
  criticality text not null default 'important',
  aliases text[] not null default '{}',
  typical_extensions text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.construction_element_library (
  id uuid primary key default gen_random_uuid(),
  country text not null,
  source_name text not null,
  source_url text not null,
  source_type text not null,
  captured_at timestamptz,
  license_notes text not null,
  confidence_score integer not null default 0 check (confidence_score between 0 and 100),
  reviewed_status text not null default 'pending' check (reviewed_status in ('pending', 'approved', 'rejected')),
  raw_payload jsonb not null default '{}'::jsonb,
  normalized_payload jsonb not null default '{}'::jsonb,
  element_code text not null,
  family text not null,
  label text not null,
  unit text not null,
  keywords text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists construction_knowledge_sources_unique_idx
  on public.construction_knowledge_sources (country, source_name, source_url);

create unique index if not exists construction_dataset_items_unique_idx
  on public.construction_dataset_items (item_type, country, (normalized_payload->>'id'));

create unique index if not exists construction_cost_references_unique_idx
  on public.construction_cost_references (country, project_type, source_name);

create unique index if not exists construction_schedule_references_unique_idx
  on public.construction_schedule_references (country, project_type, source_name);

create unique index if not exists construction_risk_references_unique_idx
  on public.construction_risk_references (country, risk_type, source_name);

create unique index if not exists construction_document_taxonomy_unique_idx
  on public.construction_document_taxonomy (country, document_type, specialty);

create unique index if not exists construction_element_library_code_idx
  on public.construction_element_library (element_code);

insert into public.construction_knowledge_sources (
  country, source_name, source_url, source_type, captured_at, license_notes, confidence_score, reviewed_status, raw_payload, normalized_payload
)
values
  ('Portugal', 'Portal BASE', 'https://www.base.gov.pt/', 'public_procurement_portal', null, 'Fonte publica de contratacao. Apenas registada como fonte permitida; sem scraping automatico.', 85, 'pending', '{}'::jsonb, '{"allowed_use":"manual_review_pipeline"}'::jsonb),
  ('Portugal', 'Dados.gov.pt', 'https://dados.gov.pt/', 'open_data_portal', null, 'Rever licenca de cada dataset antes de ingestao.', 80, 'pending', '{}'::jsonb, '{"allowed_use":"open_data_review"}'::jsonb),
  ('Portugal', 'Concursos publicos municipais', 'https://www.base.gov.pt/', 'municipal_tender', null, 'Apenas documentos publicos e rastreaveis; respeitar termos e robots.', 70, 'pending', '{}'::jsonb, '{"allowed_use":"manual_public_tender_review"}'::jsonb),
  ('Franca', 'Marches publics', 'https://www.marches-publics.gouv.fr/', 'public_procurement_portal', null, 'Ingestao futura deve respeitar termos, robots e direitos dos documentos.', 85, 'pending', '{}'::jsonb, '{"allowed_use":"manual_review_pipeline"}'::jsonb),
  ('Franca', 'DCE CCTP DPGF DQE BPU publicos', 'https://www.marches-publics.gouv.fr/', 'public_tender_document', null, 'Apenas documentos publicos; sem captura automatica nesta sprint.', 75, 'pending', '{}'::jsonb, '{"allowed_use":"manual_document_review"}'::jsonb),
  ('Espanha', 'Plataforma de Contratacion del Sector Publico', 'https://contrataciondelestado.es/', 'public_procurement_portal', null, 'Qualquer ingestao futura exige verificacao de termos e licenca.', 85, 'pending', '{}'::jsonb, '{"allowed_use":"manual_review_pipeline"}'::jsonb),
  ('Espanha', 'datos.gob.es', 'https://datos.gob.es/', 'open_data_portal', null, 'Rever licencas dataset a dataset antes de normalizar.', 80, 'pending', '{}'::jsonb, '{"allowed_use":"open_data_review"}'::jsonb)
on conflict (country, source_name, source_url) do update set
  license_notes = excluded.license_notes,
  confidence_score = excluded.confidence_score,
  reviewed_status = excluded.reviewed_status,
  normalized_payload = excluded.normalized_payload,
  updated_at = now();

insert into public.construction_dataset_items (
  item_type, country, source_name, source_url, source_type, captured_at, license_notes, confidence_score, reviewed_status, raw_payload, normalized_payload
)
values
  ('typology', 'Portugal', 'IAWEB manual seed', 'internal://iaweb/construction/manual-seed', 'manual_seed', now(), 'Seed manual interno sem dados privados.', 70, 'approved', '{}'::jsonb, '{"id":"moradia","label":"Moradia","complexity_baseline":32}'::jsonb),
  ('typology', 'Portugal', 'IAWEB manual seed', 'internal://iaweb/construction/manual-seed', 'manual_seed', now(), 'Seed manual interno sem dados privados.', 70, 'approved', '{}'::jsonb, '{"id":"remodelacao","label":"Remodelacao","complexity_baseline":40}'::jsonb),
  ('typology', 'Portugal', 'IAWEB manual seed', 'internal://iaweb/construction/manual-seed', 'manual_seed', now(), 'Seed manual interno sem dados privados.', 70, 'approved', '{}'::jsonb, '{"id":"creche","label":"Creche","complexity_baseline":58}'::jsonb),
  ('typology', 'Portugal', 'IAWEB manual seed', 'internal://iaweb/construction/manual-seed', 'manual_seed', now(), 'Seed manual interno sem dados privados.', 70, 'approved', '{}'::jsonb, '{"id":"hotel","label":"Hotel","complexity_baseline":72}'::jsonb),
  ('typology', 'Portugal', 'IAWEB manual seed', 'internal://iaweb/construction/manual-seed', 'manual_seed', now(), 'Seed manual interno sem dados privados.', 70, 'approved', '{}'::jsonb, '{"id":"pavilhao_industrial","label":"Pavilhao industrial","complexity_baseline":78}'::jsonb),
  ('typology', 'Portugal', 'IAWEB manual seed', 'internal://iaweb/construction/manual-seed', 'manual_seed', now(), 'Seed manual interno sem dados privados.', 70, 'approved', '{}'::jsonb, '{"id":"restaurante","label":"Restaurante","complexity_baseline":55}'::jsonb),
  ('typology', 'Portugal', 'IAWEB manual seed', 'internal://iaweb/construction/manual-seed', 'manual_seed', now(), 'Seed manual interno sem dados privados.', 70, 'approved', '{}'::jsonb, '{"id":"lar","label":"Lar","complexity_baseline":68}'::jsonb),
  ('typology', 'Portugal', 'IAWEB manual seed', 'internal://iaweb/construction/manual-seed', 'manual_seed', now(), 'Seed manual interno sem dados privados.', 70, 'approved', '{}'::jsonb, '{"id":"industria","label":"Industria","complexity_baseline":82}'::jsonb),
  ('typology', 'Portugal', 'IAWEB manual seed', 'internal://iaweb/construction/manual-seed', 'manual_seed', now(), 'Seed manual interno sem dados privados.', 70, 'approved', '{}'::jsonb, '{"id":"comercio","label":"Comercio","complexity_baseline":48}'::jsonb)
on conflict (item_type, country, (normalized_payload->>'id')) do update set
  normalized_payload = excluded.normalized_payload,
  updated_at = now();

insert into public.construction_cost_references (
  country, source_name, source_url, source_type, captured_at, license_notes, confidence_score, reviewed_status, raw_payload, normalized_payload, project_type, min_eur_m2, max_eur_m2
)
values
  ('Portugal','IAWEB manual seed','internal://iaweb/construction/manual-seed','manual_seed',now(),'Seed manual indicativo; nao e orcamento final.',65,'approved','{}','{"unit":"EUR/m2"}','moradia',1100,2500),
  ('Portugal','IAWEB manual seed','internal://iaweb/construction/manual-seed','manual_seed',now(),'Seed manual indicativo; nao e orcamento final.',65,'approved','{}','{"unit":"EUR/m2"}','remodelacao',300,1800),
  ('Portugal','IAWEB manual seed','internal://iaweb/construction/manual-seed','manual_seed',now(),'Seed manual indicativo; nao e orcamento final.',65,'approved','{}','{"unit":"EUR/m2"}','creche',1400,2600),
  ('Portugal','IAWEB manual seed','internal://iaweb/construction/manual-seed','manual_seed',now(),'Seed manual indicativo; nao e orcamento final.',65,'approved','{}','{"unit":"EUR/m2"}','hotel',1800,4500),
  ('Portugal','IAWEB manual seed','internal://iaweb/construction/manual-seed','manual_seed',now(),'Seed manual indicativo; nao e orcamento final.',65,'approved','{}','{"unit":"EUR/m2"}','pavilhao_industrial',600,1500),
  ('Portugal','IAWEB manual seed','internal://iaweb/construction/manual-seed','manual_seed',now(),'Seed manual indicativo; nao e orcamento final.',65,'approved','{}','{"unit":"EUR/m2"}','restaurante',1000,3000),
  ('Portugal','IAWEB manual seed','internal://iaweb/construction/manual-seed','manual_seed',now(),'Seed manual indicativo; nao e orcamento final.',65,'approved','{}','{"unit":"EUR/m2"}','lar',1600,3200),
  ('Portugal','IAWEB manual seed','internal://iaweb/construction/manual-seed','manual_seed',now(),'Seed manual indicativo; nao e orcamento final.',65,'approved','{}','{"unit":"EUR/m2"}','industria',800,2200),
  ('Portugal','IAWEB manual seed','internal://iaweb/construction/manual-seed','manual_seed',now(),'Seed manual indicativo; nao e orcamento final.',65,'approved','{}','{"unit":"EUR/m2"}','comercio',800,2500)
on conflict (country, project_type, source_name) do update set min_eur_m2 = excluded.min_eur_m2, max_eur_m2 = excluded.max_eur_m2, updated_at = now();

insert into public.construction_schedule_references (
  country, source_name, source_url, source_type, captured_at, license_notes, confidence_score, reviewed_status, raw_payload, normalized_payload, project_type, min_months, max_months
)
values
  ('Portugal','IAWEB manual seed','internal://iaweb/construction/manual-seed','manual_seed',now(),'Seed manual indicativo; nao e planeamento contratual.',65,'approved','{}','{"unit":"months"}','moradia',8,18),
  ('Portugal','IAWEB manual seed','internal://iaweb/construction/manual-seed','manual_seed',now(),'Seed manual indicativo; nao e planeamento contratual.',65,'approved','{}','{"unit":"months"}','remodelacao',1,6),
  ('Portugal','IAWEB manual seed','internal://iaweb/construction/manual-seed','manual_seed',now(),'Seed manual indicativo; nao e planeamento contratual.',65,'approved','{}','{"unit":"months"}','creche',8,16),
  ('Portugal','IAWEB manual seed','internal://iaweb/construction/manual-seed','manual_seed',now(),'Seed manual indicativo; nao e planeamento contratual.',65,'approved','{}','{"unit":"months"}','hotel',12,30),
  ('Portugal','IAWEB manual seed','internal://iaweb/construction/manual-seed','manual_seed',now(),'Seed manual indicativo; nao e planeamento contratual.',65,'approved','{}','{"unit":"months"}','pavilhao_industrial',6,14),
  ('Portugal','IAWEB manual seed','internal://iaweb/construction/manual-seed','manual_seed',now(),'Seed manual indicativo; nao e planeamento contratual.',65,'approved','{}','{"unit":"months"}','restaurante',2,8),
  ('Portugal','IAWEB manual seed','internal://iaweb/construction/manual-seed','manual_seed',now(),'Seed manual indicativo; nao e planeamento contratual.',65,'approved','{}','{"unit":"months"}','lar',12,24),
  ('Portugal','IAWEB manual seed','internal://iaweb/construction/manual-seed','manual_seed',now(),'Seed manual indicativo; nao e planeamento contratual.',65,'approved','{}','{"unit":"months"}','industria',8,24),
  ('Portugal','IAWEB manual seed','internal://iaweb/construction/manual-seed','manual_seed',now(),'Seed manual indicativo; nao e planeamento contratual.',65,'approved','{}','{"unit":"months"}','comercio',2,9)
on conflict (country, project_type, source_name) do update set min_months = excluded.min_months, max_months = excluded.max_months, updated_at = now();

insert into public.construction_risk_references (
  country, source_name, source_url, source_type, captured_at, license_notes, confidence_score, reviewed_status, raw_payload, normalized_payload, risk_type, severity
)
values
  ('Europa','IAWEB manual seed','internal://iaweb/construction/manual-seed','manual_seed',now(),'Seed manual para motor de risco; exige revisao futura.',70,'approved','{}','{"title":"Documento critico em falta","recommendation":"Recolher documento antes de decisao."}','missing_document','high'),
  ('Europa','IAWEB manual seed','internal://iaweb/construction/manual-seed','manual_seed',now(),'Seed manual para motor de risco; exige revisao futura.',70,'approved','{}','{"title":"Confianca documental baixa","recommendation":"Rever nomes, metadata e duplicados."}','low_document_confidence','medium'),
  ('Europa','IAWEB manual seed','internal://iaweb/construction/manual-seed','manual_seed',now(),'Seed manual para motor de risco; exige revisao futura.',70,'approved','{}','{"title":"Medicoes ou quantidades ausentes","recommendation":"Solicitar mapa de quantidades."}','missing_measurements','high'),
  ('Europa','IAWEB manual seed','internal://iaweb/construction/manual-seed','manual_seed',now(),'Seed manual para motor de risco; exige revisao futura.',70,'approved','{}','{"title":"Estruturas ausentes","recommendation":"Confirmar projeto de estabilidade."}','missing_structures','high'),
  ('Europa','IAWEB manual seed','internal://iaweb/construction/manual-seed','manual_seed',now(),'Seed manual para motor de risco; exige revisao futura.',70,'approved','{}','{"title":"Documentos nao classificados","recommendation":"Renomear ficheiros e rever taxonomia."}','unknown_documents','medium'),
  ('Europa','IAWEB manual seed','internal://iaweb/construction/manual-seed','manual_seed',now(),'Seed manual para motor de risco; exige revisao futura.',70,'approved','{}','{"title":"Complexidade tecnica elevada","recommendation":"Reforcar revisao tecnica."}','high_complexity','medium')
on conflict (country, risk_type, source_name) do update set normalized_payload = excluded.normalized_payload, severity = excluded.severity, updated_at = now();

insert into public.construction_document_taxonomy (
  country, source_name, source_url, source_type, captured_at, license_notes, confidence_score, reviewed_status, raw_payload, normalized_payload, document_type, specialty, criticality, aliases, typical_extensions
)
select
  item.country,
  'IAWEB manual seed',
  'internal://iaweb/construction/manual-seed',
  'manual_seed',
  now(),
  'Taxonomia manual inicial; sem copia de documentos externos.',
  72,
  'approved',
  '{}'::jsonb,
  to_jsonb(item),
  item.document_type,
  item.specialty,
  item.criticality,
  item.aliases,
  item.extensions
from (
  values
    ('Portugal','arquitetura','arquitetura','critical',array['arquitetura','arquitectura','arq','plantas','alcados','cortes'],array['pdf','dwg','dxf']),
    ('Portugal','estruturas','estruturas','critical',array['estruturas','estabilidade','betao','fundacoes','armaduras'],array['pdf','dwg','dxf','ifc']),
    ('Portugal','medicoes','medicoes','critical',array['medicoes','autos','quantidades'],array['xls','xlsx','pdf']),
    ('Portugal','mapa de quantidades','medicoes','important',array['mapa de quantidades','mq','boq'],array['xls','xlsx','pdf']),
    ('Portugal','caderno de encargos','caderno de encargos','critical',array['caderno de encargos','encargos','condicoes tecnicas'],array['pdf','docx']),
    ('Portugal','AVAC','avac','important',array['avac','hvac','climatizacao','ventilacao'],array['pdf','dwg','dxf']),
    ('Portugal','ITED','ited','important',array['ited','telecomunicacoes','telecom'],array['pdf','dwg','dxf']),
    ('Portugal','SCIE','scie','important',array['scie','incendio','seguranca contra incendio'],array['pdf','dwg','dxf']),
    ('Portugal','aguas e esgotos','aguas e esgotos','important',array['aguas','esgotos','drenagem','abastecimento'],array['pdf','dwg','dxf']),
    ('Portugal','eletricidade','eletricidade','important',array['eletricidade','electricidade','energia','quadros eletricos'],array['pdf','dwg','dxf']),
    ('Franca','CCTP','cahier des clauses techniques','critical',array['cctp','cahier clauses techniques','clauses techniques'],array['pdf','docx']),
    ('Franca','DPGF','decomposition prix global forfaitaire','critical',array['dpgf','decomposition prix'],array['xls','xlsx','pdf']),
    ('Franca','DQE','detail quantitatif estimatif','critical',array['dqe','detail quantitatif'],array['xls','xlsx','pdf']),
    ('Franca','BPU','bordereau prix unitaires','important',array['bpu','bordereau prix unitaires'],array['xls','xlsx','pdf']),
    ('Franca','Plans d''Execution','execution','critical',array['plans execution','plans d execution','exe','execution'],array['pdf','dwg','dxf']),
    ('Franca','Etude de Sol','geotechnique','important',array['etude de sol','geotechnique','g1','g2'],array['pdf']),
    ('Espanha','Mediciones','mediciones','critical',array['mediciones','medicion'],array['xls','xlsx','pdf']),
    ('Espanha','Presupuesto','presupuesto','critical',array['presupuesto','coste'],array['xls','xlsx','pdf']),
    ('Espanha','Pliego','pliego','critical',array['pliego','pliego de condiciones'],array['pdf','docx']),
    ('Espanha','Proyecto Basico','proyecto','important',array['proyecto basico','pb'],array['pdf']),
    ('Espanha','Proyecto de Ejecucion','ejecucion','critical',array['proyecto de ejecucion','pe'],array['pdf','dwg','dxf'])
) as item(country, document_type, specialty, criticality, aliases, extensions)
on conflict (country, document_type, specialty) do update set
  aliases = excluded.aliases,
  typical_extensions = excluded.typical_extensions,
  normalized_payload = excluded.normalized_payload,
  updated_at = now();

insert into public.construction_element_library (
  country, source_name, source_url, source_type, captured_at, license_notes, confidence_score, reviewed_status, raw_payload, normalized_payload, element_code, family, label, unit, keywords
)
select
  'Europa',
  'IAWEB manual seed',
  'internal://iaweb/construction/manual-seed',
  'manual_seed',
  now(),
  'Biblioteca manual inicial; sem dados privados ou scraping.',
  68,
  'approved',
  '{}'::jsonb,
  to_jsonb(item),
  item.code,
  item.family,
  item.label,
  item.unit,
  item.keywords
from (
  values
    ('STR-001','estruturas','Fundacoes diretas','m3',array['fundacoes','sapatas']),
    ('STR-002','estruturas','Estacas','m',array['estacas','fundacao profunda']),
    ('STR-003','estruturas','Macicos de encabecamento','m3',array['macicos','encabecamento']),
    ('STR-004','estruturas','Vigas de fundacao','m3',array['vigas fundacao','lintel']),
    ('STR-005','estruturas','Laje de betao armado','m2',array['laje','betao armado']),
    ('STR-006','estruturas','Pilares de betao armado','m3',array['pilares','betao armado']),
    ('STR-007','estruturas','Vigas de betao armado','m3',array['vigas','betao armado']),
    ('STR-008','estruturas','Muros de suporte','m2',array['muro suporte','contencao']),
    ('STR-009','estruturas','Estrutura metalica','kg',array['estrutura metalica','aco']),
    ('STR-010','estruturas','Estrutura de madeira','m3',array['madeira','estrutura madeira']),
    ('ARC-011','arquitetura','Alvenaria exterior','m2',array['alvenaria exterior','fachada']),
    ('ARC-012','arquitetura','Alvenaria interior','m2',array['alvenaria interior','paredes']),
    ('ARC-013','arquitetura','Divisorias leves','m2',array['pladur','gesso cartonado']),
    ('ARC-014','arquitetura','Rebocos interiores','m2',array['reboco interior','estuque']),
    ('ARC-015','arquitetura','Rebocos exteriores','m2',array['reboco exterior','fachada']),
    ('ARC-016','arquitetura','Pinturas interiores','m2',array['pintura interior','tinta']),
    ('ARC-017','arquitetura','Pinturas exteriores','m2',array['pintura exterior','fachada']),
    ('ARC-018','arquitetura','Pavimento ceramico','m2',array['pavimento ceramico','azulejo']),
    ('ARC-019','arquitetura','Pavimento vinilico','m2',array['vinilico','pavimento pvc']),
    ('ARC-020','arquitetura','Pavimento madeira','m2',array['madeira','flutuante']),
    ('ARC-021','arquitetura','Betonilha','m2',array['betonilha','regularizacao']),
    ('ARC-022','arquitetura','Tetos falsos','m2',array['teto falso','gesso cartonado']),
    ('ARC-023','arquitetura','Revestimento ceramico parede','m2',array['revestimento ceramico','azulejo']),
    ('ARC-024','arquitetura','Cantarias','m',array['cantaria','pedra natural']),
    ('ARC-025','arquitetura','Impermeabilizacao cobertura','m2',array['impermeabilizacao','cobertura']),
    ('ARC-026','arquitetura','Isolamento termico fachada','m2',array['capoto','etics']),
    ('ARC-027','arquitetura','Isolamento acustico','m2',array['isolamento acustico','la mineral']),
    ('ARC-028','arquitetura','Caixilharia aluminio','m2',array['caixilharia','aluminio']),
    ('ARC-029','arquitetura','Vidro duplo','m2',array['vidro duplo','envidracado']),
    ('ARC-030','arquitetura','Portas interiores','un',array['portas interiores','carpintaria']),
    ('ARC-031','arquitetura','Portas exteriores','un',array['porta exterior','seguranca']),
    ('ARC-032','arquitetura','Guardas metalicas','m',array['guardas','serralharia']),
    ('ARC-033','arquitetura','Escadas interiores','un',array['escadas','degraus']),
    ('ARC-034','arquitetura','Cobertura inclinada','m2',array['telhado','cobertura inclinada']),
    ('ARC-035','arquitetura','Cobertura plana','m2',array['cobertura plana','terraco']),
    ('HID-036','aguas e esgotos','Rede de abastecimento agua','m',array['abastecimento agua','rede agua']),
    ('HID-037','aguas e esgotos','Rede de aguas quentes','m',array['agua quente','aqs']),
    ('HID-038','aguas e esgotos','Rede de esgotos domesticos','m',array['esgotos','saneamento']),
    ('HID-039','aguas e esgotos','Rede de aguas pluviais','m',array['pluviais','drenagem']),
    ('HID-040','aguas e esgotos','Loucas sanitarias','un',array['sanitarios','loucas']),
    ('HID-041','aguas e esgotos','Torneiras e misturadoras','un',array['torneiras','misturadoras']),
    ('HID-042','aguas e esgotos','Bombagem','un',array['bomba','bombagem']),
    ('HID-043','aguas e esgotos','Separador de gorduras','un',array['separador gorduras','restaurante']),
    ('ELE-044','eletricidade','Quadro eletrico','un',array['quadro eletrico','qgbt']),
    ('ELE-045','eletricidade','Tubagem eletrica','m',array['tubagem eletrica','eletroduto']),
    ('ELE-046','eletricidade','Cablagem eletrica','m',array['cablagem','cabos']),
    ('ELE-047','eletricidade','Tomadas','un',array['tomadas','pontos energia']),
    ('ELE-048','eletricidade','Interruptores','un',array['interruptores','comandos']),
    ('ELE-049','eletricidade','Iluminacao interior','un',array['iluminacao interior','luminarias']),
    ('ELE-050','eletricidade','Iluminacao exterior','un',array['iluminacao exterior','fachada']),
    ('ELE-051','eletricidade','Iluminacao emergencia','un',array['emergencia','blocos autonomos']),
    ('ELE-052','eletricidade','Terras e protecoes','vg',array['terra','protecoes']),
    ('ELE-053','eletricidade','Posto de transformacao','un',array['posto transformacao','pt']),
    ('AVC-054','avac','Unidades interiores AVAC','un',array['unidade interior','avac']),
    ('AVC-055','avac','Unidades exteriores AVAC','un',array['unidade exterior','condensadora']),
    ('AVC-056','avac','Condutas de ventilacao','m2',array['condutas','ventilacao']),
    ('AVC-057','avac','Grelhas e difusores','un',array['grelhas','difusores']),
    ('AVC-058','avac','UTA','un',array['uta','unidade tratamento ar']),
    ('AVC-059','avac','Ventiladores','un',array['ventiladores','extracao']),
    ('AVC-060','avac','Tubagem frigorifica','m',array['frigorifica','cobre avac']),
    ('SCI-061','scie','Extintores','un',array['extintores','scie']),
    ('SCI-062','scie','Rede armada incendio','un',array['ria','rede armada']),
    ('SCI-063','scie','Detecao incendio','un',array['detecao incendio','alarme']),
    ('SCI-064','scie','Sprinklers','un',array['sprinklers','extincao automatica']),
    ('SCI-065','scie','Sinaletica seguranca','un',array['sinaletica','evacuacao']),
    ('SCI-066','scie','Portas corta-fogo','un',array['corta fogo','porta cf']),
    ('SCI-067','scie','Desenfumagem','un',array['desenfumagem','controlo fumos']),
    ('TEL-068','ited','Armario telecomunicacoes','un',array['ati','armario telecom']),
    ('TEL-069','ited','Cablagem dados','m',array['dados','utp']),
    ('TEL-070','ited','Fibra optica','m',array['fibra optica','fo']),
    ('TEL-071','ited','Tomadas RJ45','un',array['rj45','tomada dados']),
    ('TEL-072','ited','Bastidor','un',array['bastidor','rack']),
    ('EXT-073','exteriores','Movimento de terras','m3',array['escavacao','aterro']),
    ('EXT-074','exteriores','Pavimento exterior betuminoso','m2',array['betuminoso','asfalto']),
    ('EXT-075','exteriores','Pavimento exterior calcada','m2',array['calcada','pavimento exterior']),
    ('EXT-076','exteriores','Lancis','m',array['lancis','bordadura']),
    ('EXT-077','exteriores','Vedacoes','m',array['vedacao','muro exterior']),
    ('EXT-078','exteriores','Portoes','un',array['portao','automatismo']),
    ('EXT-079','exteriores','Jardinagem','m2',array['jardim','arranjos exteriores']),
    ('EXT-080','exteriores','Rega','m2',array['rega','irrigacao']),
    ('EQP-081','equipamentos','Cozinha industrial','vg',array['cozinha industrial','restaurante']),
    ('EQP-082','equipamentos','Camara frigorifica','un',array['camara frigorifica','frio']),
    ('EQP-083','equipamentos','Elevador','un',array['elevador','ascensor']),
    ('EQP-084','equipamentos','Monta-cargas','un',array['monta cargas','carga']),
    ('EQP-085','equipamentos','Equipamento sanitario acessivel','un',array['acessivel','mobilidade reduzida']),
    ('EQP-086','equipamentos','Mobiliario fixo','vg',array['mobiliario fixo','bancadas']),
    ('ENE-087','energia','Paineis fotovoltaicos','un',array['fotovoltaico','solar']),
    ('ENE-088','energia','Bomba de calor','un',array['bomba calor','aqs']),
    ('ENE-089','energia','Solar termico','un',array['solar termico','coletor']),
    ('ENE-090','energia','Carregamento eletrico','un',array['carregamento eletrico','ve']),
    ('SEG-091','seguranca','CCTV','un',array['cctv','videovigilancia']),
    ('SEG-092','seguranca','Controlo acessos','un',array['controlo acessos','cartao']),
    ('SEG-093','seguranca','Intrusao','un',array['intrusao','alarme']),
    ('IND-094','industria','Ponte rolante','un',array['ponte rolante','movimentacao carga']),
    ('IND-095','industria','Ar comprimido','m',array['ar comprimido','compressor']),
    ('IND-096','industria','Rede gas tecnico','m',array['gas tecnico','processo']),
    ('IND-097','industria','Pavimento industrial','m2',array['pavimento industrial','betao afagado']),
    ('IND-098','industria','Portas seccionadas','un',array['porta seccionada','industrial']),
    ('MED-099','medicoes','Mapa de quantidades','vg',array['mapa quantidades','boq']),
    ('DOC-100','documentacao','Caderno de encargos','vg',array['caderno encargos','especificacoes'])
) as item(code, family, label, unit, keywords)
on conflict (element_code) do update set
  family = excluded.family,
  label = excluded.label,
  unit = excluded.unit,
  keywords = excluded.keywords,
  normalized_payload = excluded.normalized_payload,
  updated_at = now();
