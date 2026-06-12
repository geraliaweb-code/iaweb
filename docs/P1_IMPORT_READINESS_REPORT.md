# P1 Import Readiness Report

IAWEB Construction Intelligence - DM-1 Activation Program

Fase: Post Canonical Audit
Data: 2026-06-07

Escopo read-only:
- Canonical Materials Audit: `docs/CANONICAL_MATERIALS_AUDIT_REPORT.md`
- P1 template: `docs/templates/dm1_p1_material_import_template.csv`
- DM-1: `supabase/construction_dm1_data_moat_foundation.sql`
- DM-6A: `supabase/construction_dm6_quantity_learning.sql`
- DM-6B: `supabase/construction_dm6b_quantity_learning.sql`
- DM-6C: `supabase/construction_dm6c_qp_integration.sql`, `src/lib/construction/data-moat/qp-linking.ts`

Garantias desta fase:
- Nao foram criadas migrations.
- Nao foram alteradas tabelas.
- Nao foram inseridos dados.
- Nao houve alteracoes no Agent Network.
- Nao houve alteracoes no Construction OS.

## Executive Summary

Os 7 materiais P1 aprovados existem em DM-6A como canonical names e usam unidades suportadas por `unit_conversion_rules`. A importacao em DM-1 pode ser preparada sem ambiguidade para 6 dos 7 materiais. O unico bloqueio semantico antes de importacao e `Aco A500`, porque o canonical atual `REINFORCEMENT_STEEL` esta descrito em DM-6A como `Aco A400` e agrupa tambem `Acero B500S`.

Conclusao operacional:
- 6/7 materiais estao `import_ready=true`.
- 1/7 material esta `import_ready=false` ate haver decisao sobre variante de aco.
- DM-6C fica compativel para match `EXACT` somente se a camada de precos expuser `canonical_name` junto de `material_costs`.

## Canonical Mapping Final

| material | canonical_name | aliases | unit | category | import_ready |
|---|---|---|---|---|---|
| Betao C25/30 | `STRUCTURAL_CONCRETE_C25_30` | Betao C25/30; Beton C25/30; Concrete C25/30; Hormigon HA-25; concreto c25/30 | `m3` | `concrete` / `structural_concrete` | true |
| Aco A500 | `REINFORCEMENT_STEEL` | Aco A500; Aco A500 NR; varao A500; varao A500 NR; reinforcement steel | `kg` | `steel` / `reinforcement` | false |
| Tubo PVC SN4 | `PVC_DRAINAGE_PIPE_SN4` | Tubo PVC SN4; PVC SN4; PVC drainage pipe SN4; Tube PVC CR4 | `m` | `drainage` / `pvc_pipe` | true |
| Tubo PEAD | `HDPE_PIPE` | Tubo PEAD; PEAD; PEAD DN90; HDPE pipe; Tube PEHD; PEHD | `m` | `water_network` / `hdpe_pipe` | true |
| Lancil de betao | `CONCRETE_KERB` | Lancil; Lancis; Lancil de betao; concrete kerb; Bordure beton; Bordillo de hormigon | `m` | `urban_elements` / `kerb` | true |
| Camara de visita | `MANHOLE_CHAMBER` | Camara de visita; Caixa de visita; manhole chamber; Regard de visite; Pozo de registro | `un` | `drainage` / `inspection_chamber` | true |
| Pavimento betuminoso | `BITUMINOUS_PAVEMENT` | Pavimento betuminoso; Mistura betuminosa; tapete betuminoso; bituminous pavement; asphalt | `m2` | `roadworks` / `asphalt` | true |

## Validacao por Material

| material | DM-1 | DM-6A | DM-6B | DM-6C | decisao |
|---|---|---|---|---|---|
| Betao C25/30 | DM-1 tem familia concrete e preco para C30/37, mas nao C25/30 exato. | Canonical existe e unidade `m3` existe. | Compatibilidade por `unit_type=m3` e categoria concrete. | `EXACT` apos importacao se preco expuser `STRUCTURAL_CONCRETE_C25_30`; hoje cairia para `FAMILY`. | Pronto para importacao P1 com canonical em metadata/query. |
| Aco A500 | DM-1 ja tem Aco A500 NR e preco. | Canonical existe, mas PT name esta como Aco A400. | Compatibilidade por `unit_type=kg` e categoria steel. | `EXACT` seria perigoso porque une variantes A400/A500. | Bloquear import_ready ate escolher canonical de variante ou declarar `REINFORCEMENT_STEEL` como familia. |
| Tubo PVC SN4 | DM-1 nao tem material nem categoria `drainage` em `material_categories`. | Canonical existe e unidade `m` existe. | Compatibilidade por `unit_type=m` e categoria drainage. | `EXACT` apos importacao se preco expuser canonical; hoje `NO_LINK`. | Pronto com categoria operacional `drainage`; requer cuidado para nao aceitar alias generico `PVC`. |
| Tubo PEAD | DM-1 nao tem material nem categoria `water_network`. | Canonical existe e unidade `m` existe. | Compatibilidade por `unit_type=m` e categoria water_network. | `EXACT` apos importacao se preco expuser canonical; hoje `NO_LINK`. | Pronto com aliases PEAD/HDPE/PEHD limitados a tubo. |
| Lancil de betao | DM-1 nao tem material nem categoria `urban_elements`. | Canonical existe e unidade `m` existe. | Compatibilidade por `unit_type=m` e categoria urban_elements. | `EXACT` apos importacao se preco expuser canonical; hoje `NO_LINK`. | Pronto. |
| Camara de visita | DM-1 nao tem material nem categoria `drainage`. | Canonical existe e unidade `un` existe. | Compatibilidade por `unit_type=un` e categoria drainage. | `EXACT` apos importacao se preco expuser canonical; hoje `NO_LINK`. | Pronto. |
| Pavimento betuminoso | DM-1 nao tem material nem categoria `roadworks`. | Canonical existe e unidade `m2` existe. | Compatibilidade por `unit_type=m2` e categoria roadworks. | `EXACT` apos importacao se preco expuser canonical; hoje `NO_LINK`. | Pronto. |

## Conflitos Antes da Importacao

| conflito | material afetado | severidade | estado |
|---|---|---|---|
| A400/A500 no canonical `REINFORCEMENT_STEEL` | Aco A500 | Alta | Bloqueante para `import_ready`; nao usar match `EXACT` ate resolver. |
| Categoria DM-6A ausente em DM-1 `material_categories` | Tubo PVC SN4; Tubo PEAD; Lancil de betao; Camara de visita; Pavimento betuminoso | Media | Nao bloqueia a simulacao read-only, mas limita FK `material_category_id` se nao houver categoria criada previamente. |
| Alias generico `PVC` | Tubo PVC SN4 | Media | Nao aceitar `PVC` sozinho como alias de importacao; exigir `SN4` ou drenagem. |
| PEAD fora de contexto de tubo | Tubo PEAD | Baixa/Media | Aceitar PEAD/HDPE/PEHD apenas quando o item indica tubo/rede. |
| DM-6C depende de `canonical_name` em preco | Todos | Alta | A importacao deve preservar canonical em metadata ou a query deve fazer join/injecao para `QpMaterialCost.canonical_name`. |

## Activation Score Projetado

Modelo usado nesta simulacao:
- Cobertura critica PT: 35 pontos.
- Compatibilidade DM-6A/DM-6B/DM-6C: 30 pontos.
- Frescura/fonte/confianca do preco: 20 pontos.
- Integridade de historico/fornecedor: 15 pontos.

| cenario | score projetado | leitura |
|---|---:|---|
| Baseline pre-P1 | 55/100 | DM-1 ja tem familias concrete/steel, mas nao tem os 7 P1 completos nem canonical exposto para DM-6C. |
| Importacao conservadora, com Aco A500 bloqueado | 73/100 | 6/7 materiais entram limpos; cobertura melhora muito, mas steel fica sem `EXACT` seguro. |
| Importacao alvo, com decisao A500 resolvida | 81/100 | 7/7 materiais com canonical disciplinado, preco, fonte, data e confidence >= 75. |

Score recomendado para go/no-go imediato: **73/100** ate resolver `REINFORCEMENT_STEEL`.

## Coverage Ratio Projetado

| metrica | baseline | apos importacao conservadora | apos importacao alvo |
|---|---:|---:|---:|
| P1 critical material coverage | 2/7 = 28.6% | 6/7 = 85.7% | 7/7 = 100% |
| P1 canonical coverage DM-6A | 7/7 = 100% | 7/7 = 100% | 7/7 = 100% |
| P1 DM-1 exact material coverage | 0/7 = 0% | 6/7 = 85.7% | 7/7 = 100% |
| P1 DM-6C exact-link eligible | 0/7 = 0% | 6/7 = 85.7% | 7/7 = 100% |

Notas:
- Baseline considera que DM-1 tem familias concrete/steel, mas nao os 7 materiais P1 exatos com canonical.
- `DM-6C exact-link eligible` assume que a importacao ou a query de serving injeta `canonical_name` em `QpMaterialCost`.

## Cost Confidence Projetado

Assuncoes:
- Cada material importado tem preco, fonte, data de recolha e `confidence >= 75`.
- A query DM-6C recebe `canonical_name`, `category` e `country`.
- Linhas normalizadas usam unidades oficiais de DM-6A.

| cenario | coverage_ratio | exact_match_ratio | cost_confidence_project projetado |
|---|---:|---:|---:|
| Baseline pre-P1 | 0.29 | 0.00 | 0.46 |
| Conservador, 6/7 import_ready | 0.86 | 0.86 | 0.72 |
| Alvo, 7/7 import_ready | 1.00 | 1.00 | 0.80 |

Leitura:
- O baseline fica abaixo de serving confiavel porque DM-6C nao tem `canonical_name` nos precos e faltam materiais P1.
- O cenario conservador cruza o limiar de 0.70 para detalhe interno, mas deve bloquear ou degradar linhas de aco.
- O cenario alvo e o primeiro estado realmente consistente para P1 completo.

## Regras de Importacao Readiness

Antes de inserir dados em fase futura:
1. Para cada linha P1, guardar ou expor `canonical_name` de forma consumivel por DM-6C.
2. Nao aceitar alias generico que perca variante: `PVC`, `aco`, `tubo`, `betao` isolados.
3. Para `Aco A500`, decidir entre:
   - criar/usar canonical de variante A500 em fase futura; ou
   - manter `REINFORCEMENT_STEEL` como familia e nunca marcar como `EXACT` de variante.
4. Confirmar que `confidence >= 75` e que `source_name`, `observed_at` e unidade oficial existem.
5. Tratar categorias ausentes em DM-1 como warning de schema/taxonomia antes da importacao real.

## Resultado Final

Readiness final: **READY WITH ONE BLOCKER**.

Bloqueador: `Aco A500` vs `REINFORCEMENT_STEEL` A400/A500.

Os restantes 6 materiais P1 estao prontos para importacao futura em DM-1 do ponto de vista canonico, desde que a importacao preserve `canonical_name` e que DM-6C receba esse campo na camada de preco.
