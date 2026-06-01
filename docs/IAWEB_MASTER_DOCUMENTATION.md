# IAWEB Master Documentation V1

Referencia tecnica e operacional oficial da plataforma IAWEB apos a Sprint 10.5.

## 1. Visao Geral

### Missao

A IAWEB e uma plataforma comercial para diagnosticar presenca digital, demonstrar transformacao, priorizar oportunidades e apoiar a equipa na conversao de prospects em clientes.

### Proposta de valor

A plataforma nao vende apenas websites. Vende clareza comercial, credibilidade, captacao de contactos, automacao, previsibilidade e crescimento.

### Problema resolvido

Empresas perdem oportunidades por baixa presenca digital, falta de clareza, ausencia de seguimento e dificuldade em perceber o impacto financeiro do digital. A IAWEB transforma esses sinais em diagnostico, proposta visual, plano recomendado e mensagens comerciais.

### Fluxo principal

```text
Prospector IA
  -> Diagnostico Digital
  -> Impacto Financeiro
  -> Website Generator
  -> Proposta Comercial
  -> PDF Executivo
  -> CRM Kanban
  -> Agente Comercial
  -> Dashboard Executivo
```

### Objetivos estrategicos

- Criar oportunidades comerciais antes de depender apenas de leads inbound.
- Mostrar ao cliente a diferenca entre estado atual e solucao proposta.
- Priorizar oportunidades por valor potencial e urgencia.
- Centralizar pipeline, diagnostico, propostas e mensagens comerciais.
- Preparar a plataforma para automacoes futuras de WhatsApp, email e aquisicao.

## 2. Arquitetura

### Diagrama textual completo

```text
/prospector
  usa src/lib/prospector
  gera prospects simulados
  avalia presenca digital
  calcula opportunity score
  prepara homepage, impacto financeiro e dados comerciais
  promove para CRM

/diagnostico e /demo
  usam src/lib/diagnostico, src/lib/niches e src/lib/finance-impact
  geram score digital, recomendacoes e impacto
  guardam lead em Supabase via /api/diagnostico/lead

/simulador-site
  usa src/lib/website-generator
  mostra homepage gerada
  mostra Antes vs Depois
  calcula score projetado
  pode guardar simulacao no CRM

/proposta
  usa dados de query params e motores comerciais
  mostra proposta comercial
  inclui score atual, score projetado, homepage e ROI

/diagnostico/pdf.ts
  gera PDF Executivo Premium em jsPDF
  usa branding centralizado

/crm
  lista leads da tabela diagnosticos
  mostra Kanban comercial
  permite alterar status, notas e copiar mensagens

src/lib/sales-agent
  gera WhatsApp, email, follow-ups, objecoes, pos-proposta e pos-reuniao

/dashboard
  agrega prospects e CRM
  mostra centro de inteligencia comercial

/admin/testes
  valida motores, Supabase e dados ficticios
```

## 3. Rotas

### `/`

- Objetivo: homepage institucional/landing principal.
- Componentes: `HeroSection`, `ProcessSection`, `SystemSection`, `ResultsSection`, `LeadFormSection`, `FooterSection`, `NavbarSection`, `WhatsAppButton`.
- Dados utilizados: conteudo estatico e formularios existentes.
- APIs utilizadas: depende dos componentes de lead existentes.

### `/diagnostico`

- Objetivo: Diagnostico Digital Gratuito.
- Componentes: `DiagnosticoDigital`.
- Dados utilizados: `DiagnosticoFormData`, `DiagnosticoResult`, categorias de score.
- APIs utilizadas: `POST /api/diagnostico`, `POST /api/diagnostico/lead`.

### `/demo`

- Objetivo: ferramenta comercial presencial para gerar analise client-side.
- Componentes: `DemoCommercialTool`, `DemoScoreCard`, `DemoOpportunityLoss`, `DemoRecommendedPlan`.
- Dados utilizados: motor de nichos, impacto financeiro, score comercial, website generator para payload CRM.
- APIs utilizadas: `POST /api/diagnostico/lead`.

### `/simulador-site`

- Objetivo: simular homepage premium e transformacao visual.
- Componentes: `SiteSimulator`, `SitePreviewMockup`, `SitePaletteSelector`, `SiteStructurePreview`, `WebsiteBeforeAfterComparison`.
- Dados utilizados: query params de `/demo`, `generateWebsiteTransformation`.
- APIs utilizadas: `POST /api/diagnostico/lead` para guardar simulacao.

### `/proposta`

- Objetivo: gerar proposta comercial editavel.
- Componentes: `ProposalGenerator`, `ProposalPreview`, `ProposalPlanSelector`, `ProposalInvestmentCard`.
- Dados utilizados: query params, motor de nichos, impacto financeiro, website generator.
- APIs utilizadas: nenhuma backend obrigatoria nesta fase; guardar CRM permanece preparado/TODO conforme fluxo.

### `/crm`

- Objetivo: CRM Kanban premium.
- Componentes: `CrmDashboardClient`.
- Dados utilizados: tabela `diagnosticos`.
- APIs utilizadas: `GET /api/crm/leads`, `PATCH /api/crm/leads/[id]`, auth CRM.

### `/crm/login`

- Objetivo: login do CRM.
- Componentes: `CrmLoginForm`.
- Dados utilizados: credenciais via env.
- APIs utilizadas: `POST /api/crm/auth/login`, `POST /api/crm/auth/logout`.

### `/prospector`

- Objetivo: centro operacional do Prospector IA.
- Componentes: `ProspectorClient`.
- Dados utilizados: tabela `prospects`, motor `src/lib/prospector`.
- APIs utilizadas: `GET /api/prospector/prospects`, `POST /api/prospector/generate`, `POST /api/prospector/promote-to-crm`, `PATCH /api/prospector/prospects/[id]`.

### `/dashboard`

- Objetivo: Centro de Inteligencia Comercial.
- Componentes: `ExecutiveDashboard`, `ExecutiveMetrics`, `ProspectorInsights`, `PipelineOverview`, `OpportunityTable`, `CommercialAlerts`.
- Dados utilizados: tabelas `prospects` e `diagnosticos`.
- APIs utilizadas: leitura server-side via libs Supabase.

### `/admin/testes`

- Objetivo: painel interno de validacao end-to-end.
- Componentes: pagina server em `src/app/admin/testes/page.tsx`.
- Dados utilizados: leads ficticias de teste, motores locais, Supabase.
- APIs utilizadas: leitura direta Supabase server-side.

## 4. Componentes

### Diagnostico

- `DiagnosticoDigital`: formulario, submissao, resultado e download PDF.
- `src/app/diagnostico/pdf.ts`: gerador PDF executivo multipagina.
- `src/app/diagnostico/branding.ts`: configuracao de branding/white-label para PDF.

### Demo Comercial

- `DemoCommercialTool`: ferramenta presencial, analise client-side, CRM payload.
- `DemoScoreCard`: score comercial premium.
- `DemoOpportunityLoss`: perda mensal estimada.
- `DemoRecommendedPlan`: plano recomendado.

### CRM

- `CrmDashboardClient`: Kanban, drawer, timeline, notas, status, agente comercial.
- `CrmLoginForm`: login CRM.

### Prospector

- `ProspectorClient`: filtros, gerar prospects, ranking, detalhes e promover CRM.

### Dashboard

- `ExecutiveDashboard`: composicao principal do centro executivo.
- `ExecutiveMetrics`: resumo executivo.
- `ProspectorInsights`: insights por nicho, cidade, prioridade e top oportunidades.
- `PipelineOverview`: Kanban resumido por status.
- `OpportunityTable`: tabela premium de oportunidades.
- `CommercialAlerts`: alertas IA.

### Website Generator

- `SiteSimulator`: simulador visual.
- `SitePreviewMockup`: preview browser da homepage gerada.
- `SitePaletteSelector`: paleta recomendada.
- `SiteStructurePreview`: estrutura e pacote.
- `WebsiteBeforeAfterComparison`: Antes vs Depois e score projetado.

### Propostas

- `ProposalGenerator`: formulario e preview.
- `ProposalPreview`: documento comercial.
- `ProposalPlanSelector`: selecao de plano.
- `ProposalInvestmentCard`: valores de setup/mensalidade.

### Homepage/Marketing

- `HeroSection`, `ProcessSection`, `SystemSection`, `ResultsSection`, `LeadFormSection`, `FooterSection`, `NavbarSection`, `WhatsAppButton`.

## 5. APIs

### `POST /api/diagnostico`

- Input: `DiagnosticoFormData`.
- Output: `DiagnosticoResult`.
- Responsabilidade: calcular diagnostico digital base.

### `POST /api/diagnostico/lead`

- Input: `formData`, `result`, campos CRM opcionais.
- Output: `{ ok, id, status }`.
- Responsabilidade: guardar lead na tabela `diagnosticos`, gerar mensagens comerciais e preparar WhatsApp/email/follow-ups.

### `GET /api/crm/leads`

- Input: query params `status`, `niche`, `q`, `sort`, `direction`.
- Output: `{ leads }`.
- Responsabilidade: listar leads CRM.

### `PATCH /api/crm/leads/[id]`

- Input: `status`, `notas`, `proxima_acao`.
- Output: lead atualizado.
- Responsabilidade: atualizar lead CRM.

### `POST /api/crm/auth/login`

- Input: credenciais CRM.
- Output: sessao/cookie.
- Responsabilidade: autenticar acesso CRM.

### `POST /api/crm/auth/logout`

- Input: nenhum.
- Output: logout.
- Responsabilidade: limpar sessao CRM.

### `GET /api/prospector/prospects`

- Input: filtros `nicho`, `cidade`, `priority`, `status`, `scoreMin`.
- Output: prospects.
- Responsabilidade: listar tabela `prospects`.

### `POST /api/prospector/generate`

- Input: `ProspectorFilters`.
- Output: prospects gerados/salvos.
- Responsabilidade: gerar prospects simulados, analisar e gravar em Supabase quando configurado.

### `POST /api/prospector/promote-to-crm`

- Input: `{ id }`.
- Output: `{ ok, crmLeadId }`.
- Responsabilidade: transformar prospect em lead CRM na tabela `diagnosticos` e marcar prospect como `promovido_crm`.

### `PATCH /api/prospector/prospects/[id]`

- Input: `status`.
- Output: prospect atualizado.
- Responsabilidade: atualizar status do prospect.

## 6. Supabase

### Tabela `diagnosticos`

Utilizacao: CRM principal, diagnosticos, leads de demo, propostas, mensagens comerciais e dados de website generator.

Colunas principais:

- `id uuid`
- `created_at timestamptz`
- `updated_at timestamptz`
- `diagnostico_digital_lead_id uuid`
- `empresa text`
- `nome_contacto text`
- `email text`
- `telefone text`
- `website text`
- `cidade text`
- `setor text`
- `objetivo text`
- `score_geral integer`
- `score_website integer`
- `score_google integer`
- `score_conversao integer`
- `score_automacao integer`
- `score_crm integer`
- `classificacao text`
- `potencial_estimado text`
- `recomendacoes jsonb`
- `status text`
- `origem text`
- `proxima_acao text`
- `notas text`
- `perda_mensal_estimada numeric/integer conforme migration`
- `impacto_financeiro jsonb`
- `plano_recomendado text`
- `homepage_gerada jsonb`
- `score_projetado integer`
- `melhoria_prevista integer`
- `template_utilizado text`
- `whatsapp_message text`
- `whatsapp_status text`
- `email_subject text`
- `email_body text`
- `followup_3d text`
- `followup_7d text`
- `followup_15d text`
- `objection_responses jsonb`
- `post_proposal_message text`
- `post_meeting_message text`
- `sales_agent_status text`

Indices/migrations relevantes:

- `diagnosticos_created_at_idx`
- `diagnosticos_status_idx`
- `diagnosticos_score_geral_idx`
- `diagnosticos_email_idx`
- `diagnosticos_telefone_idx`
- `diagnosticos_origem_idx`
- `diagnosticos_setor_idx`
- `diagnosticos_plano_recomendado_idx`
- `diagnosticos_score_projetado_idx`
- `diagnosticos_template_utilizado_idx`
- `diagnosticos_sales_agent_status_idx`

### Tabela `prospects`

Utilizacao: Prospector IA e ranking de oportunidades.

Colunas:

- `id uuid primary key default gen_random_uuid()`
- `empresa text not null`
- `contacto text`
- `email text`
- `telefone text`
- `website text`
- `cidade text`
- `regiao text`
- `nicho text not null`
- `keywords text[]`
- `score_digital integer`
- `opportunity_score integer`
- `priority_label text`
- `problemas_detectados jsonb`
- `oportunidades jsonb`
- `impacto_financeiro jsonb`
- `homepage_gerada jsonb`
- `score_projetado integer`
- `melhoria_prevista integer`
- `template_utilizado text`
- `status text`
- `source text`
- `created_at timestamptz`
- `updated_at timestamptz`

Indices:

- `prospects_nicho_idx`
- `prospects_cidade_idx`
- `prospects_opportunity_score_idx`
- `prospects_priority_label_idx`
- `prospects_status_idx`
- `prospects_email_unique_idx`

### Outras estruturas

- `diagnostico_digital_leads.sql`: schema legado/apoio do diagnostico digital.
- Migrations historicas: `diagnosticos.sql`, `diagnosticos_full_schema.sql`, `diagnosticos_full_schema_v2.sql`, `diagnosticos_crm_statuses.sql`, `diagnosticos_whatsapp_preparation.sql`.

## 7. Sprints

### Sprint 1 - Demo Comercial

- Objetivo: criar `/demo` para reunioes comerciais.
- Resultado: analise client-side, score, perdas, recomendacoes e botoes CRM/simulador/proposta.
- Ficheiros: `DemoCommercialTool`, `DemoScoreCard`, `DemoOpportunityLoss`, `DemoRecommendedPlan`, `src/app/demo/page.tsx`.

### Sprint 2 - Simulador Site

- Objetivo: criar `/simulador-site`.
- Resultado: simulador visual de homepage por nicho.
- Ficheiros: `SiteSimulator`, `SitePreviewMockup`, `SitePaletteSelector`, `SiteStructurePreview`.

### Sprint 3 - Proposta

- Objetivo: criar `/proposta`.
- Resultado: proposta comercial editavel, preview premium, print/PDF browser.
- Ficheiros: `ProposalGenerator`, `ProposalPreview`, `ProposalPlanSelector`, `ProposalInvestmentCard`.

### Sprint 4 - Motor de Nichos

- Objetivo: estruturar dados comerciais por nicho.
- Resultado: `src/lib/niches` com construction, dentist, real_estate, restaurant, lawyer, accounting.
- Ficheiros: `src/lib/niches/*`.

### Sprint 4.2 - Propagacao Nichos

- Objetivo: usar nichos em simulador e proposta.
- Resultado: copy, dores, oportunidades e argumentos consistentes.

### Sprint 4.3 - Impacto Financeiro

- Objetivo: calcular potencial financeiro.
- Resultado: `src/lib/finance-impact.ts`, blocos em demo/proposta.

### Sprint 4.4 - Premium Visual Demo

- Objetivo: upgrade visual premium da `/demo`.
- Resultado: SaaS dark, glow, bento, score circular e impacto financeiro.

### Sprint 4.5 + Sprint 5 - CRM Comercial Real

- Objetivo: guardar leads reais no CRM/Supabase.
- Resultado: pipeline, campos comerciais, migration `crm_commercial_pipeline.sql`.

### Sprint 6 - CRM Kanban Premium

- Objetivo: transformar CRM em Kanban visual.
- Resultado: drag & drop, drawer lateral, notas, filtros, metricas.
- Ficheiros: `CrmDashboardClient`.

### Sprint 7 - PDF Executivo Premium

- Objetivo: transformar PDF em relatorio executivo.
- Resultado: PDF multipagina com capa, resumo, impacto, analise, plano e proximos passos.
- Ficheiros: `src/app/diagnostico/pdf.ts`.

### Sprint 7.1 - Branding e White Label

- Objetivo: reforcar branding e preparar white-label.
- Resultado: `branding.ts`, watermark, rodape, metadata, pagina institucional.

### Sprint 8 - Website Generator Premium

- Objetivo: gerar homepage e comparacao Antes/Depois.
- Resultado: `src/lib/website-generator`, score projetado, comparison engine, migration `website_generator_pipeline.sql`.

### Sprint 9 - Agente Comercial

- Objetivo: gerar mensagens comerciais personalizadas.
- Resultado: `src/lib/sales-agent`, campos Supabase, UI no drawer CRM.
- Migration: `sales_agent_messages.sql`.

### Sprint 9.5 - Dados de Teste e Validacao

- Objetivo: ambiente de testes sem clientes reais.
- Resultado: `test_seed_iaweb.sql`, `/admin/testes`.

### Sprint 10 - Prospector IA

- Objetivo: criar base de prospeccao e opportunity engine.
- Resultado: `src/lib/prospector`, APIs `/api/prospector/*`, pagina `/prospector`, migration `prospector_pipeline.sql`.

### Sprint 10.5 - Centro de Inteligencia Comercial

- Objetivo: dashboard executivo unificado.
- Resultado: `/dashboard`, componentes dashboard e agregacao de CRM/prospects.

## 8. Motores

### Motor de Nichos

- Pasta: `src/lib/niches`.
- Responsabilidade: dores, oportunidades, objecoes, argumentos, ROI, keywords e diagnostico personalizado.
- Nichos: construction, dentist, real_estate, restaurant, lawyer, accounting, fallback outro.

### Impacto Financeiro

- Ficheiro: `src/lib/finance-impact.ts`.
- Responsabilidade: leads perdidos, ticket medio, receita mensal/anual, ROI, payback e frase comercial.

### Website Generator

- Pasta: `src/lib/website-generator`.
- Responsabilidade: homepage, templates por nicho, score projetado e comparacao Antes/Depois.
- Templates: construction, clinic, realestate, restaurant, lawyer, accounting, generic.

### Opportunity Engine

- Ficheiro: `src/lib/prospector/opportunity-score.ts`.
- Responsabilidade: opportunity score 0-100 e prioridade Critica/Alta/Media/Baixa.

### Agente Comercial

- Pasta: `src/lib/sales-agent`.
- Responsabilidade: WhatsApp, email, follow-ups, objecoes, pos-proposta e pos-reuniao.

### Prospector IA

- Pasta: `src/lib/prospector`.
- Responsabilidade: gerar prospects simulados, analisar presenca digital, calcular oportunidade e preparar CRM.

## 9. Fluxos

### Lead -> CRM

```text
/diagnostico ou /demo
  -> /api/diagnostico/lead
  -> tabela diagnosticos
  -> CRM Kanban
  -> Agente Comercial no drawer
```

### Prospect -> CRM

```text
/prospector
  -> POST /api/prospector/generate
  -> tabela prospects
  -> POST /api/prospector/promote-to-crm
  -> tabela diagnosticos
  -> CRM
```

### Diagnostico -> Proposta

```text
/diagnostico ou /demo
  -> score e recomendacoes
  -> /simulador-site ou /proposta
  -> proposta com plano, ROI e proximos passos
```

### Website -> Proposta

```text
/simulador-site
  -> Website Generator
  -> score atual/projetado
  -> query params para /proposta
  -> preview comercial
```

### Prospector -> Comercial

```text
Prospect
  -> analise digital simulada
  -> opportunity score
  -> impacto financeiro
  -> homepage gerada
  -> agente comercial
  -> promover CRM
```

## 10. Pendencias

### Sprint 11 - Envio Controlado de Mensagens

- Integrar WhatsApp/email real com consentimento e logs.
- Criar estado de envio, erro, opt-out e historico.

### Sprint 12 - Fontes Reais de Prospeccao

- Integrar Google Maps, fontes publicas ou imports CSV.
- Evitar scraping agressivo.
- Criar validacao e deduplicacao robusta.

### Sprint 13 - Automacoes e Sequencias

- Sequencias comerciais multicanal.
- Tarefas automaticas no CRM.
- Regras de follow-up por status e prioridade.

### Sprint 14 - Analytics e Revenue Intelligence

- Conversao por canal.
- ROI real vs estimado.
- Forecast comercial.
- Dashboards para campanhas e equipa.

## 11. Deploy

### Vercel

- Stack: Next.js 16, React 19, TypeScript.
- Build: `npm.cmd run build` localmente; em Vercel usar `npm run build`.
- Rotas dinamicas: CRM, Prospector, Dashboard, Admin Testes e APIs.

### Supabase

- Usado para `diagnosticos` e `prospects`.
- Aplicar migrations em ordem recomendada:
  1. schemas base existentes (`diagnosticos_full_schema_v2.sql` ou equivalente)
  2. `crm_commercial_pipeline.sql`
  3. `website_generator_pipeline.sql`
  4. `sales_agent_messages.sql`
  5. `prospector_pipeline.sql`
  6. opcional: `test_seed_iaweb.sql`

### Variaveis de ambiente

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- variaveis de autenticacao CRM definidas em `src/lib/crm-auth.ts`
- variaveis de email se usadas por `diagnostico-email.ts`

### Dominio

- Dominio de producao a configurar em Vercel.
- Links internos assumem rotas relativas.

### Autenticacao

- CRM usa middleware/logica propria via `crm-auth.ts`.
- Prospector, dashboard e admin/testes ainda nao possuem protecao dedicada alem do contexto da app. Recomenda-se restringir antes de producao publica.

## 12. Risco e Divida Tecnica

### Areas nao testadas automaticamente

- Testes unitarios formais ainda nao existem.
- Fluxos UI nao possuem suite E2E persistente.
- PDF foi validado por build, nao por comparacao visual automatica.
- Prospector usa dados simulados; fontes reais ainda nao foram integradas.

### Dependencias

- `jspdf` usado para PDF client-side.
- `framer-motion`, `gsap` e `lenis` usados em experiencias premium.
- `@supabase/supabase-js` usado em APIs server-side.
- `@anthropic-ai/sdk` existe no projeto, mas os motores atuais nao dependem de IA externa.

### Integracoes futuras

- WhatsApp real.
- Email real.
- Google Maps/Places ou import CSV.
- LinkedIn ou enriquecimento externo.
- Automacoes externas tipo Make/Zapier/n8n.

### Migracoes pendentes

- Confirmar em producao se todas as migrations foram executadas.
- `cidade` foi adicionada no seed de testes, mas deve ser formalizada numa migration base se passar a ser campo permanente do CRM.
- Confirmar unique constraints usadas por `upsert` em `diagnosticos.email` e `prospects.email`.

### Riscos operacionais

- Service role Supabase deve permanecer apenas em server-side.
- `/admin/testes`, `/dashboard` e `/prospector` devem receber protecao antes de exposicao publica.
- Mensagens comerciais nao devem ser enviadas automaticamente sem consentimento, logs e opt-out.
- Estimativas financeiras devem continuar apresentadas como potenciais conservadores, nunca garantias.
