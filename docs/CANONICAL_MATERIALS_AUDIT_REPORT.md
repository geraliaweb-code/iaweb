# Canonical Materials Audit Report

IAWEB Construction Intelligence - DM-1 Activation Program

Data da auditoria: 2026-06-07

Escopo read-only:
- DM-1: `supabase/construction_dm1_data_moat_foundation.sql`, `supabase/construction_cost_database_v2.sql`, `src/lib/construction/cost-database-v2/material-engine.ts`
- DM-6A: `supabase/construction_dm6_quantity_learning.sql`, `src/lib/construction/data-moat/quantity-normalization.ts`
- DM-6B: `supabase/construction_dm6b_quantity_learning.sql`
- DM-6C: `supabase/construction_dm6c_qp_integration.sql`, `src/lib/construction/data-moat/qp-linking.ts`
- Agent PT / Normalizer: `agent-network/app/normalization.py`, `agent-network/app/demo_end_to_end_standalone.py`
- Datasets auxiliares: `src/lib/construction/datasets/europe/*/*-materials.ts`

Nao foram criadas migrations, tabelas, alteracoes de dados, alteracoes no Agent Network ou alteracoes no Construction OS.

## Executive Summary

O sistema tem 8 canonical names formalmente definidos em DM-6A, duplicados de forma consistente entre SQL e TypeScript. DM-1 ainda nao tem coluna `canonical_name`; trabalha com `material_code`, nome humano e metadata. DM-6C espera receber `canonical_name` no array de precos (`QpMaterialCost.canonical_name`) para obter match `EXACT`, mas os seeds atuais de DM-1 nao expoem esse campo.

Risco principal: os nomes canonicos existem, mas a ponte DM-1 -> DM-6C ainda depende de uma convencao nao materializada. O resultado esperado hoje e queda para `FAMILY`, `PROXY_COUNTRY` ou `NO_LINK` em materiais com preco real mas sem canonical resolvido.

## Tabela Unica de Canonical Names

| canonical_name | aliases | country | category | status |
|---|---|---|---|---|
| `STRUCTURAL_CONCRETE_C25_30` | Betao C25/30; Beton C25/30; Concrete C25/30; Hormigon HA-25; betao c25/30; concreto c25/30 | PT, FR, ES | concrete / structural_concrete | Canonical ativo em DM-6A e TS; pedido em P1; sem preco DM-1 exato no foundation atual, mas existe em datasets PT/FR/ES auxiliares. |
| `REINFORCEMENT_STEEL` | Aco A400; Acier HA; Acero B500S; reinforcement steel; varao a400; Agent PT: Aco A500, varao a500 | PT, FR, ES | steel / reinforcement | Canonical ativo, mas conflitante: DM-6A descreve A400/B500S enquanto DM-1/Agent PT usam A500/A500 NR. Requer decisao de variante. |
| `PVC_DRAINAGE_PIPE_SN4` | Tubo PVC SN4; Tube PVC CR4; PVC drainage pipe SN4; PVC SN4; PVC CR4 | PT, FR, ES | drainage / pvc_pipe | Canonical ativo em DM-6A e TS; pedido em P1; sem material/preco DM-1 atual. |
| `HDPE_PIPE` | Tubo PEAD; PEAD; PEAD DN90; Tube PEHD; HDPE pipe; PEHD; tubo pead dn90 | PT, FR, ES | water_network / hdpe_pipe | Canonical ativo em DM-6A e TS; pedido em P1; sem material/preco DM-1 atual. |
| `CONCRETE_KERB` | Lancil; Lancis; Bordure beton; Bordure beton accented; Bordillo de hormigon; concrete kerb | PT, FR, ES | urban_elements / kerb | Canonical ativo em DM-6A e TS; pedido em P1; sem material/preco DM-1 atual. |
| `MANHOLE_CHAMBER` | Camara de visita; Regard de visite; Pozo de registro; manhole chamber | PT, FR, ES | drainage / inspection_chamber | Canonical ativo em DM-6A e TS; pedido em P1; sem material/preco DM-1 atual. |
| `BITUMINOUS_PAVEMENT` | Pavimento betuminoso; Enrobe bitumineux; Pavimento bituminoso; asphalt | PT, FR, ES | roadworks / asphalt | Canonical ativo em DM-6A e TS; pedido em P1; sem material/preco DM-1 atual. |
| `GRADED_AGGREGATE_BASE` | Tout-venant; Tout venant; Zahorra; Graded aggregate base; agregado britado | PT, FR, ES | earthworks / aggregate_base | Canonical ativo em DM-6A e TS; nao esta no template P1; sem material/preco DM-1 atual. |

## Inventario por Camada

| Camada | Identificadores encontrados | Observacao |
|---|---:|---|
| DM-6A SQL `normalized_materials` | 8 canonical names | Fonte formal de canonical_name. |
| DM-6A TS `normalizedMaterialSeeds` | 8 canonical names | Espelho funcional usado pela normalizacao em codigo. |
| DM-1 foundation | 6 `material_code` seeds | Nao tem canonical_name materializado. |
| Cost Database V2 SQL/TS | 18 materiais de preco | Nao tem canonical_name. |
| Europe material datasets | 54 materiais | Nao tem canonical_name. |
| Agent PT / Normalizer | 4 codigos internos + `UNKNOWN` | Usa `CONC_C25_30`, `STEEL_A500`, `BRICK_11`, `PLASTER_STD`; nao usa canonical_name DM-6A. |

## Lista de Conflitos

| conflito | severidade | detalhe | impacto |
|---|---|---|---|
| `A400NR` / A400 vs A500 / A500 NR | Alta | DM-6A define `REINFORCEMENT_STEEL` com PT name `Aco A400`; DM-1 e Agent PT usam `Aco A500` / `Aco A500 NR`; Espanha usa `B500S`; Franca usa `HA FeE500`. | Match `EXACT` pode ligar variantes tecnicas diferentes sob o mesmo canonical. Afeta preco, norma, risco e produtividade. |
| `PVC` vs `PVC_SANITATION` vs `PVC_DRAINAGE_PIPE_SN4` | Media | O sistema atual nao tem `PVC_SANITATION`; o canonical existente e `PVC_DRAINAGE_PIPE_SN4`. Alias simples "PVC" seria ambiguo entre drenagem, saneamento, pressao e eletrico. | Risco de classificar tubos sanitarios ou pressao como drenagem SN4. |
| `PEAD` vs `HDPE` vs `PEHD` | Baixa/Media | DM-6A usa `HDPE_PIPE`; PT alias `PEAD`, FR alias `PEHD`. Isto e semanticamente equivalente no contexto de tubo, mas precisa manter aliases multilingues. | Risco baixo se limitado a tubos; risco medio se aparecer chapa/tanque PEAD sem ser tubo. |
| `CONC_C25_30` vs `STRUCTURAL_CONCRETE_C25_30` | Media | Agent PT retorna codigo interno `CONC_C25_30`; DM-6A usa canonical `STRUCTURAL_CONCRETE_C25_30`. | DM-1 price cache e DM-6C nao conseguem match exato sem tabela de traducao. |
| `STEEL_A500` vs `REINFORCEMENT_STEEL` | Alta | Agent PT retorna `STEEL_A500`; DM-6A canonical genericamente `REINFORCEMENT_STEEL`. | Mesmo problema tecnico do A400/A500, agravado por perda de variante. |
| `BRICK_11` e `PLASTER_STD` sem canonical DM-6A | Media | Agent PT normaliza tijolo e reboco, mas DM-6A nao define canonical correspondente. | Linhas normalizadas pelo Agent PT podem virar `NO_LINK` em DM-6C ou ficar apenas no cache staging. |
| Categorias DM-1 vs DM-6A | Media | DM-1 foundation tem `concrete`, `steel`, `facade`, `openings`, `mep`, `finishes`; DM-6A usa tambem `drainage`, `water_network`, `urban_elements`, `roadworks`, `earthworks`. | P1 depende de categorias que nao existem em DM-1 foundation. |
| Encoding mojibake | Baixa/Media | Alguns ficheiros apresentam strings mojibake para Betao, m2 e preco. | Normalizacao por alias pode falhar em inputs corretamente acentuados se a cobertura nao estiver duplicada. |

## Lista de Duplicados

Duplicados saudaveis:
- Os 8 canonical names de DM-6A aparecem tanto no SQL como no TypeScript, com mesmo conjunto conceitual.
- `STRUCTURAL_CONCRETE_C25_30`, `REINFORCEMENT_STEEL`, `PVC_DRAINAGE_PIPE_SN4`, `HDPE_PIPE`, `CONCRETE_KERB`, `MANHOLE_CHAMBER`, `BITUMINOUS_PAVEMENT`, `GRADED_AGGREGATE_BASE`.

Duplicados problematicos:
- `REINFORCEMENT_STEEL` agrupa A400, A500, B500S e HA/FeE500 sob um canonical generico.
- `Aco A500 NR` aparece em DM-1 foundation, Cost Database V2 SQL, Cost Database V2 TS e dataset Portugal, mas sem canonical comum.
- `Betao C30/37` aparece em DM-1 foundation, Cost Database V2 SQL, Cost Database V2 TS e datasets PT/FR/ES, mas nao tem canonical DM-6A.
- `Sistema ETICS EPS 60 mm`, `Sistema aluminio ruptura termica`, `Pavimento ceramico medio formato`, `Pladur BA13` e tintas aparecem em bases de preco/datasets sem canonical DM-6A.

Nao foi encontrado canonical_name duplicado com grafia diferente dentro de DM-6A. O risco esta na duplicacao entre sistemas de identificadores.

## Lista de Aliases

| canonical_name | aliases normalizados |
|---|---|
| `STRUCTURAL_CONCRETE_C25_30` | betao c25/30; betao accented c25/30; beton c25/30; beton accented c25/30; concrete c25/30; concreto c25/30; hormigon ha-25 |
| `REINFORCEMENT_STEEL` | aco a400; aco accented a400; acier ha; acero b500s; reinforcement steel; varao a400; varao accented a400; Agent PT: aco a500, aco accented a500, varao a500 |
| `PVC_DRAINAGE_PIPE_SN4` | tubo pvc sn4; tube pvc cr4; pvc drainage pipe sn4; pvc sn4; pvc cr4 |
| `HDPE_PIPE` | tubo pead; pead; pead dn90; tube pehd; hdpe pipe; pehd; tubo pead dn90 |
| `CONCRETE_KERB` | lancil; lancis; bordure beton; bordillo de hormigon; concrete kerb |
| `MANHOLE_CHAMBER` | camara de visita; regard de visite; pozo de registro; manhole chamber |
| `BITUMINOUS_PAVEMENT` | pavimento betuminoso; enrobe bitumineux; pavimento bituminoso; bituminous pavement; asphalt |
| `GRADED_AGGREGATE_BASE` | tout-venant; tout venant; zahorra; graded aggregate base; agregado britado |

## Materiais Sem Canonical Name

DM-1 foundation sem canonical materializado:
- Portugal: Betao C30/37; Aco A500 NR; Sistema ETICS EPS 60 mm; Sistema aluminio ruptura termica.
- Franca: Beton C30/37.
- Espanha: Hormigon C30/37.

Cost Database V2 sem canonical materializado:
- Portugal: Betao C30/37; Aco A500 NR; Tijolo ceramico 30x20x11; Placa gesso laminado BA13; Placa gesso laminado hidrofuga; Sistema ETICS EPS 60 mm; Tinta interior mate CIN; Tinta interior mate Robbialac; Sistema aluminio ruptura termica; Pavimento ceramico medio formato.
- Franca: Beton C30/37; Plaque de platre BA13; Isolation thermique exterieure EPS 60 mm; Peinture interieure mate.
- Espanha: Hormigon C30/37; Placa yeso laminado BA13; Sistema aluminio rotura puente termico; Pavimento ceramico medio formato.

Europe material datasets sem canonical materializado:
- Portugal: Betao C25/30; Betao C30/37; Aco A500 NR; Tijolo ceramico 30x20x11; Bloco termico 50x20x20; Sistema ETICS EPS 60 mm; Sistema ETICS la mineral 80 mm; Placa gesso laminado BA13; Placa hidrofuga H1; Tinta interior mate lavavel; Tinta interior mate; Pavimento ceramico medio formato; Pavimento vinilico click AC5; Sistema aluminio ruptura termica; Sistema VRF interior; Quadro eletrico modular; Cabo UTP Cat6; Detetor optico enderecavel.
- Franca: Beton C25/30; Beton C30/37; Acier HA FeE500; Brique creuse terre cuite; Bloc beton creux 20 cm; Isolation thermique exterieure EPS 60 mm; Isolation exterieure laine minerale 80 mm; Plaque de platre BA13; Plaque de platre hydrofuge; Peinture interieure mate; Peinture acrylique blanche; Carrelage gres cerame moyen format; Parquet contrecolle chene; Menuiserie aluminium rupture pont thermique; Unite PAC air-air; Tableau electrique modulaire; Cable RJ45 Cat6; Detecteur optique adressable.
- Espanha: Hormigon C25/30; Hormigon C30/37; Acero corrugado B500S; Ladrillo ceramico hueco; Bloque hormigon 20 cm; Sistema SATE EPS 60 mm; Sistema SATE lana mineral 80 mm; Placa yeso laminado BA13; Placa yeso laminado hidrofuga; Pintura plastica mate; Revestimento acrilico fachada; Pavimento ceramico medio formato; Pavimento porcelanico rectificado; Sistema aluminio rotura puente termico; Sistema multisplit interior; Cuadro electrico modular; Cable UTP Cat6; Detector optico direccionable.

Agent PT / Normalizer sem canonical DM-6A direto:
- `CONC_C25_30` deveria mapear para `STRUCTURAL_CONCRETE_C25_30`.
- `STEEL_A500` ainda nao deve mapear automaticamente para `REINFORCEMENT_STEEL` sem resolver o conflito A400/A500.
- `BRICK_11` nao tem canonical DM-6A.
- `PLASTER_STD` nao tem canonical DM-6A.

## Risco por Material

| material/canonical | risco | justificacao |
|---|---|---|
| `STRUCTURAL_CONCRETE_C25_30` | Medio | Canonical existe, mas DM-1 foundation tem C30/37 e nao C25/30. Datasets auxiliares tem C25/30. |
| `REINFORCEMENT_STEEL` | Alto | Agrega variantes A400/A500/B500S/HA. Pode contaminar preco e normas. |
| `PVC_DRAINAGE_PIPE_SN4` | Medio | Sem preco DM-1 atual e alias PVC generico pode colidir com saneamento/pressao. |
| `HDPE_PIPE` | Medio | Sem preco DM-1 atual; PEAD/HDPE/PEHD equivalem no contexto tubo, mas nao em todos os produtos. |
| `CONCRETE_KERB` | Medio | Sem preco DM-1 atual e categoria `urban_elements` ausente em DM-1 foundation. |
| `MANHOLE_CHAMBER` | Medio | Sem preco DM-1 atual e categoria `drainage` ausente em DM-1 foundation. |
| `BITUMINOUS_PAVEMENT` | Medio | Sem preco DM-1 atual e categoria `roadworks` ausente em DM-1 foundation. |
| `GRADED_AGGREGATE_BASE` | Baixo/Medio | Canonical existe, mas nao esta no lote P1; sem preco DM-1 atual. |
| Betao C30/37 | Medio | Material tem preco DM-1, mas nao tem canonical DM-6A. Pode servir apenas por familia `concrete`. |
| ETICS EPS 60 mm | Medio | Tem preco DM-1, mas falta canonical DM-6A. |
| Caixilharia aluminio RPT | Medio/Alto | Tem preco DM-1, alto impacto financeiro, mas sem canonical DM-6A. |
| Tijolo / Pladur / Reboco / Tintas / Pavimentos / MEP | Medio | Presentes em Agent PT ou datasets, mas fora da taxonomia canonica DM-6A atual. |

## Compatibilidade DM-1 -> DM-6C

| etapa | estado | nota |
|---|---|---|
| DM-1 preco interno | Parcial | `material_costs` existe e tem preco por `material_id`, pais e cenario. |
| DM-1 canonical_name | Bloqueado por convencao | Nao ha coluna `canonical_name`; metadata atual nao contem canonical nos seeds foundation. |
| DM-6A normalizacao | Parcialmente pronto | Normaliza 8 canonicos, mas nao cobre a maioria dos materiais com preco. |
| DM-6B aprendizagem | Compativel indiretamente | Usa `specialty_id`, `unit_type`, pais e tipologia; nao depende diretamente de canonical_name, mas depende da normalizacao limpa. |
| DM-6C link QxP | Parcial | `qp-linking.ts` faz `EXACT` por `price.canonical_name === material.canonicalName` e pais. Sem esse campo nos precos, cai para `FAMILY`, `TYPOLOGY`, `PROXY_COUNTRY` ou `NO_LINK`. |
| Agent PT -> DM-1 cache | Parcial | `dm1_price_cache` guarda `material_code`, nao canonical_name. |

Resultado de compatibilidade:
- `STRUCTURAL_CONCRETE_C25_30`: DM-6C pode normalizar Q; P exato depende de preco DM-1 com canonical. Hoje tende a `FAMILY` se houver preco concrete no pais, nao `EXACT`.
- `REINFORCEMENT_STEEL`: DM-6C pode normalizar Q; P exato e tecnicamente arriscado enquanto A400/A500 nao forem separados.
- `PVC_DRAINAGE_PIPE_SN4`, `HDPE_PIPE`, `CONCRETE_KERB`, `MANHOLE_CHAMBER`, `BITUMINOUS_PAVEMENT`, `GRADED_AGGREGATE_BASE`: Q normaliza; P tende a `NO_LINK` no DM-1 atual porque nao ha preco/categoria foundation correspondente.

## Recomendacoes

1. Definir o principio canonico: canonical de familia versus canonical de variante. Para aco, preferir separar `REINFORCEMENT_STEEL_A500_NR`, `REINFORCEMENT_STEEL_A400`, `REINFORCEMENT_STEEL_B500S` ou documentar formalmente que `REINFORCEMENT_STEEL` e familia sem match exato de variante.
2. Criar uma tabela/matriz de traducao documental antes de qualquer migration: `agent_material_code` -> `canonical_name` -> `dm1 material_code`. Exemplo: `CONC_C25_30` -> `STRUCTURAL_CONCRETE_C25_30` -> futuro material DM-1 C25/30.
3. Nao mapear `STEEL_A500` automaticamente para `REINFORCEMENT_STEEL` como `EXACT` ate resolver o conflito A400/A500.
4. Reservar aliases genericos como `PVC` apenas para match de baixa confianca; usar aliases especificos como `PVC SN4`, `PVC saneamento`, `PVC pressao`.
5. Manter `PEAD`, `HDPE` e `PEHD` como aliases de `HDPE_PIPE` apenas quando o item indicar tubo/rede de agua.
6. Alinhar categorias DM-1 com DM-6A antes do P1 produtivo: `drainage`, `water_network`, `urban_elements`, `roadworks`, `earthworks`.
7. Para DM-6C, garantir que a query de precos injete `canonical_name`, `category`, `country` e, se possivel, `typology` em `QpMaterialCost`.
8. Criar uma proxima auditoria de cobertura para os 54 materiais dos datasets Europe, priorizando os que ja aparecem em propostas reais: betao, aco, tijolo, reboco, pladur, ETICS, caixilharia, pavimentos e cablagem.

## Conclusao

A base canonica existe e esta coerente dentro de DM-6A, mas ainda nao e a lingua comum entre DM-1, Agent PT e DM-6C. O programa P1 pode avancar de forma controlada se tratar canonical_name como contrato de integracao, nao apenas como alias textual.

Prioridade imediata: resolver `REINFORCEMENT_STEEL` antes de qualquer match exato e criar a matriz read-only de correspondencia entre `material_code` do Agent PT, canonical DM-6A e materiais/precos DM-1.
