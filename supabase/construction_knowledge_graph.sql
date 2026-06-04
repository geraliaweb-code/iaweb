create extension if not exists "pgcrypto";

create table if not exists public.construction_graph_nodes (
  id uuid primary key default gen_random_uuid(),
  node_key text not null unique,
  node_type text not null check (
    node_type in (
      'document',
      'specialty',
      'element',
      'risk',
      'cost_factor',
      'schedule_factor',
      'compliance_rule',
      'benchmark_pattern',
      'typology',
      'country'
    )
  ),
  label text not null,
  country text,
  source_name text not null default 'IAWEB manual seed',
  confidence_score integer not null default 70 check (confidence_score between 0 and 100),
  reviewed_status text not null default 'approved' check (reviewed_status in ('pending', 'approved', 'rejected')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.construction_graph_edges (
  id uuid primary key default gen_random_uuid(),
  edge_key text not null unique,
  source_node_key text not null references public.construction_graph_nodes(node_key) on delete cascade,
  target_node_key text not null references public.construction_graph_nodes(node_key) on delete cascade,
  relation_type text not null check (
    relation_type in (
      'requires',
      'belongs_to',
      'influences',
      'increases_risk',
      'increases_cost',
      'increases_schedule',
      'reduces_confidence',
      'improves_maturity',
      'improves_confidence',
      'increases_complexity',
      'equivalent_to',
      'commonly_missing',
      'benchmarked_against'
    )
  ),
  weight numeric(5, 4) not null default 0.5000,
  evidence text,
  source_name text not null default 'IAWEB manual seed',
  confidence_score integer not null default 70 check (confidence_score between 0 and 100),
  reviewed_status text not null default 'approved' check (reviewed_status in ('pending', 'approved', 'rejected')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.construction_graph_observations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.construction_projects(id) on delete cascade,
  node_key text,
  edge_key text,
  observation_type text not null,
  title text not null,
  severity text not null default 'medium' check (severity in ('low', 'medium', 'high')),
  recommendation text,
  confidence_score integer not null default 70 check (confidence_score between 0 and 100),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists construction_graph_nodes_type_idx
  on public.construction_graph_nodes (node_type);

create index if not exists construction_graph_edges_source_idx
  on public.construction_graph_edges (source_node_key);

create index if not exists construction_graph_edges_target_idx
  on public.construction_graph_edges (target_node_key);

create index if not exists construction_graph_edges_relation_idx
  on public.construction_graph_edges (relation_type);

create index if not exists construction_graph_observations_project_idx
  on public.construction_graph_observations (project_id);

insert into public.construction_graph_nodes (node_key, node_type, label, country, metadata)
values
  ('document:mapa_de_quantidades', 'document', 'mapa de quantidades', 'Portugal', '{}'::jsonb),
  ('document:dqe', 'document', 'DQE', 'Franca', '{}'::jsonb),
  ('document:mediciones', 'document', 'Mediciones', 'Espanha', '{}'::jsonb),
  ('document:medicoes', 'document', 'medicoes', 'Portugal', '{}'::jsonb),
  ('document:caderno_de_encargos', 'document', 'caderno de encargos', 'Portugal', '{}'::jsonb),
  ('document:scie', 'document', 'SCIE', 'Portugal', '{}'::jsonb),
  ('specialty:fachada', 'specialty', 'fachada', null, '{}'::jsonb),
  ('specialty:estruturas', 'specialty', 'estruturas', null, '{}'::jsonb),
  ('element:etics', 'element', 'ETICS', null, '{"aliases":["capoto","isolamento termico fachada"]}'::jsonb),
  ('element:piscina', 'element', 'piscina', null, '{}'::jsonb),
  ('risk:ausencia_estruturas', 'risk', 'ausencia de estruturas', null, '{}'::jsonb),
  ('cost_factor:etics', 'cost_factor', 'ETICS aumenta custo', null, '{}'::jsonb),
  ('cost_factor:piscina', 'cost_factor', 'piscina aumenta custo', null, '{}'::jsonb),
  ('schedule_factor:etics', 'schedule_factor', 'ETICS aumenta prazo', null, '{}'::jsonb),
  ('schedule_factor:piscina', 'schedule_factor', 'piscina aumenta prazo', null, '{}'::jsonb),
  ('compliance_rule:scie', 'compliance_rule', 'regra de conformidade SCIE', 'Portugal', '{}'::jsonb),
  ('benchmark_pattern:documentacao_completa', 'benchmark_pattern', 'documentacao acima da media', 'Europa', '{}'::jsonb)
on conflict (node_key) do update set
  node_type = excluded.node_type,
  label = excluded.label,
  country = excluded.country,
  metadata = excluded.metadata,
  updated_at = now();

insert into public.construction_graph_edges (
  edge_key, source_node_key, target_node_key, relation_type, weight, evidence, metadata
)
values
  ('edge:mq_equiv_dqe', 'document:mapa_de_quantidades', 'document:dqe', 'equivalent_to', 0.9200, 'Equivalencia funcional para quantidades estimativas.', '{}'::jsonb),
  ('edge:mq_equiv_mediciones', 'document:mapa_de_quantidades', 'document:mediciones', 'equivalent_to', 0.9200, 'Equivalencia funcional PT/ES para medicoes.', '{}'::jsonb),
  ('edge:etics_belongs_fachada', 'element:etics', 'specialty:fachada', 'belongs_to', 0.8600, 'ETICS e sistema de isolamento termico pelo exterior.', '{}'::jsonb),
  ('edge:etics_cost', 'element:etics', 'cost_factor:etics', 'increases_cost', 0.7200, 'ETICS aumenta componentes de material e mao de obra de fachada.', '{}'::jsonb),
  ('edge:etics_schedule', 'element:etics', 'schedule_factor:etics', 'increases_schedule', 0.6200, 'ETICS acrescenta fases de preparacao, acabamento e cura.', '{}'::jsonb),
  ('edge:piscina_complexity', 'element:piscina', 'risk:ausencia_estruturas', 'increases_complexity', 0.7400, 'Piscina adiciona estrutura, impermeabilizacao e redes tecnicas.', '{}'::jsonb),
  ('edge:piscina_cost', 'element:piscina', 'cost_factor:piscina', 'increases_cost', 0.8200, 'Piscina aumenta escavacao, estrutura, impermeabilizacao e equipamentos.', '{}'::jsonb),
  ('edge:piscina_schedule', 'element:piscina', 'schedule_factor:piscina', 'increases_schedule', 0.7600, 'Piscina cria atividades adicionais e interfaces tecnicas.', '{}'::jsonb),
  ('edge:scie_requires_rule', 'document:scie', 'compliance_rule:scie', 'requires', 0.8800, 'SCIE depende de verificacao regulamentar aplicavel.', '{}'::jsonb),
  ('edge:missing_structures_risk', 'specialty:estruturas', 'risk:ausencia_estruturas', 'increases_risk', 0.9000, 'Ausencia de estruturas aumenta risco documental.', '{}'::jsonb),
  ('edge:medicoes_confidence', 'document:medicoes', 'benchmark_pattern:documentacao_completa', 'improves_confidence', 0.8200, 'Medicoes melhoram confianca de custo e decisao.', '{}'::jsonb),
  ('edge:caderno_maturity', 'document:caderno_de_encargos', 'benchmark_pattern:documentacao_completa', 'improves_maturity', 0.8200, 'Caderno de encargos aumenta maturidade documental.', '{}'::jsonb)
on conflict (edge_key) do update set
  source_node_key = excluded.source_node_key,
  target_node_key = excluded.target_node_key,
  relation_type = excluded.relation_type,
  weight = excluded.weight,
  evidence = excluded.evidence,
  metadata = excluded.metadata,
  updated_at = now();
