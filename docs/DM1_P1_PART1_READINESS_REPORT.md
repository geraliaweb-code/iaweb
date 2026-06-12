# DM-1 Activation Program - P1 Parte 1 Readiness

## Scope

Objetivo: preparar a insercao dos primeiros 7 materiais criticos PT sem criar migrations, sem criar novos Data Moats, sem alterar Agent Network e sem alterar Construction OS.

Estado desta parte: readiness documental e template de importacao. Nenhum dado foi inserido.

## Estrutura DM-1 Atual

Fonte principal: `supabase/construction_dm1_data_moat_foundation.sql`.

DM-1 ja define a fundacao para precos de materiais com:

- Taxonomia: `material_categories`, `specialties`, `country_contexts`.
- Materiais: `construction_materials`.
- Precos: `material_costs`, `price_history`, `material_brand_costs`.
- Fornecedores: `suppliers`, `supplier_materials`.
- Sinais complementares: `material_availability`, `material_productivity`, `material_risk_profiles`, `material_timeline_impacts`, `material_brands`, `material_substitutions`, `material_carbon`, `material_kg_nodes`.

Seeds PT atuais relevantes:

- Betao C30/37, `m3`, categoria `concrete`.
- Aco A500 NR, `kg`, categoria `steel`.
- Sistema ETICS EPS 60 mm, `m2`, categoria `facade`.
- Sistema aluminio ruptura termica, `m2`, categoria `openings`.

## Tabelas Utilizadas

### material_costs

Uso: tabela de preco unitario por material, pais, cenario e validade.

Campos criticos para P1:

- `material_id`: referencia `construction_materials(id)`.
- `country_context_id`: referencia `country_contexts(id)`.
- `scenario`: `economic`, `normal`, `premium`.
- `unit_cost`: preco unitario.
- `currency`: `EUR`.
- `source_name`: fonte do preco.
- `confidence_score`: 0 a 100.
- `valid_from`: data de inicio de validade.

Constraint operacional: unico por `material_id`, `country_context_id`, `scenario`, `valid_from`.

### price_history

Uso: historico observavel do preco recolhido.

Campos criticos para P1:

- `material_id`.
- `country_context_id`.
- `observed_at`: data da recolha.
- `unit_cost`.
- `currency`.
- `source_name`.
- `source_type`: deve ser `manual_seed` para esta fase.
- `metadata`: local adequado para guardar `canonical_name`, URL, notas e lote P1.

### supplier_materials

Uso: ligacao entre fornecedor e material.

Campos criticos para P1:

- `supplier_id`: referencia `suppliers(id)`.
- `material_id`: referencia `construction_materials(id)`.
- `country_context_id`.
- `availability_status`.
- `lead_time_days`.
- `is_preferred`.
- `source_name`.

Nota: o template P1 pedido tem apenas `fonte`; por isso, se a fonte for apenas documental e nao um fornecedor existente, `supplier_materials` nao deve ser preenchida automaticamente. Para preencher esta tabela com seguranca sera necessario resolver ou criar previamente um `supplier_id`.

### material_categories

Uso: taxonomia de materiais.

Campos criticos para P1:

- `code`: codigo unico da categoria.
- `name`.
- `parent_id`.
- `description`.

Categorias DM-1 existentes: `concrete`, `steel`, `facade`, `openings`, `mep`, `finishes`.

Categorias DM-6A esperadas para os 7 materiais P1: `concrete`, `steel`, `drainage`, `water_network`, `urban_elements`, `roadworks`.

Gap: `drainage`, `water_network`, `urban_elements` e `roadworks` ainda nao existem em `material_categories` no DM-1 atual.

## 7 Materiais Criticos PT Propostos para P1

| # | Material PT | Canonical name DM-6A | Unidade | Estado DM-1 |
|---|---|---|---|---|
| 1 | Betao C25/30 | `STRUCTURAL_CONCRETE_C25_30` | `m3` | familia pronta; material exato ainda nao existe |
| 2 | Aco A500 | `REINFORCEMENT_STEEL` | `kg` | familia pronta; existe A500 NR, mas canonical DM-6A usa seed A400 |
| 3 | Tubo PVC SN4 | `PVC_DRAINAGE_PIPE_SN4` | `m` | requer categoria `drainage` |
| 4 | Tubo PEAD | `HDPE_PIPE` | `m` | requer categoria `water_network` |
| 5 | Lancil de betao | `CONCRETE_KERB` | `m` | requer categoria `urban_elements` |
| 6 | Camara de visita | `MANHOLE_CHAMBER` | `un` | requer categoria `drainage` |
| 7 | Pavimento betuminoso | `BITUMINOUS_PAVEMENT` | `m2` | requer categoria `roadworks` |

## Compatibilidade DM-6A

DM-6A define `normalized_materials` e `unit_conversion_rules`.

Resultado:

- Unidades P1 sao compativeis: `m3`, `kg`, `m`, `un`, `m2`.
- Canonical names dos 7 materiais existem em DM-6A.
- Risco identificado: `REINFORCEMENT_STEEL` esta descrito como A400 no seed DM-6A, enquanto o P1 pretende A500. A importacao deve guardar aliases/metadados para A500 ou exigir revisao do mapeamento antes de usar match exato.

Readiness DM-6A: **parcialmente pronto**.

## Compatibilidade DM-6B

DM-6B aprende padroes de quantidades por `specialty_id`, `unit_type`, pais, tipologia e escala.

Resultado:

- P1 melhora cobertura de materiais usados em quantidades de infraestrutura e estruturas.
- Materiais lineares (`m`) e unitarios (`un`) ja estao cobertos por regras de unidade DM-6A, permitindo alimentar padroes DM-6B quando houver `quantity_records`.
- Nao ha dependencia direta de `material_costs` para criar `quantity_patterns`; a compatibilidade e indireta via normalizacao.

Readiness DM-6B: **pronto para leitura/normalizacao; aprendizagem depende de projetos reais**.

## Compatibilidade DM-6C

DM-6C usa `line_cost_estimates.material_cost_id` apontando para `material_costs`.

O engine `qp-linking` procura precos por:

- `canonical_name` + pais para match `EXACT`.
- `category` + pais para match `FAMILY`.
- `typology` + pais para match `TYPOLOGY`.
- `canonical_name` ou `category` sem pais para `PROXY_COUNTRY`.

Resultado:

- `material_costs` existe e e a tabela correta para P.
- Para match exato, a camada que seleciona precos precisa expor `canonical_name` junto do custo. O schema atual nao tem coluna `canonical_name` em `material_costs`; portanto o canonical deve vir de join/metadados de `construction_materials` ou de uma view/query futura.
- Sem canonical resolvido, DM-6C ainda consegue cair para `FAMILY` em concrete/steel, mas perde confianca nas novas categorias enquanto elas nao existirem.

Readiness DM-6C: **pronto para inserir precos; match exato requer disciplina de canonical_name na importacao/query**.

## Activation Score - Impacto Esperado

Assuncao de score para P1:

- Cobertura critica PT: 35% do score.
- Compatibilidade QxP DM-6A/6B/6C: 30%.
- Frescura/fonte/confianca do preco: 20%.
- Integridade fornecedor/historico: 15%.

Baseline observado por estrutura atual:

- 4 materiais PT seedados no DM-1.
- Apenas concrete e steel alinham diretamente com os 7 P1.
- 7 canonical names existem em DM-6A, mas DM-1 ainda nao tem 5 categorias P1.

Estimativa:

- Antes P1: **52/100 a 58/100**.
- Depois de preparar/inserir os 7 materiais com preco, fonte, data e confidence >= 75: **76/100 a 82/100**.
- Ganho esperado: **+18 a +24 pontos**.

Drivers do ganho:

- Cobertura critica PT sobe para 7/7.
- DM-6C passa a ter preco interno para linhas normalizadas.
- `price_history` aumenta rastreabilidade e freshness.
- `confidence_score` permite servir detalhe interno quando o custo de linha ultrapassar 0.70 de confianca.

Limitadores:

- Sem categorias novas, 5 materiais ficam com `material_category_id` nulo ou mapeamento imperfeito.
- Sem canonical name exposto na query de precos, DM-6C pode servir `FAMILY` em vez de `EXACT`.
- Sem fornecedor resolvido, `supplier_materials` fica incompleto.

## Readiness Final

Status: **READY WITH PRE-IMPORT WARNINGS**.

Pode avancar para P1 Parte 2 se forem aceites estas regras:

- Usar o template CSV desta entrega como lote de recolha.
- Nao inserir linhas com `confidence` abaixo de 70 sem revisao manual.
- Resolver categoria operacional antes da importacao real para `drainage`, `water_network`, `urban_elements`, `roadworks`.
- Guardar `canonical_name` em metadados ou garantir join com `normalized_materials` na query de precos.
- Preencher `price_history` sempre que `material_costs` for atualizado.
- Preencher `supplier_materials` apenas quando a fonte corresponder a fornecedor resolvido em `suppliers`.

Validacao final: **PASS para readiness P1 Parte 1; sem alteracoes de schema, sem migrations e sem ativacao de novos Data Moats**.
