# Estado Atual

Auditoria realizada em 2026-05-31 sobre o projeto `iaweb-factory`.

## Classificacao geral

| Area | Estado | Evidencia |
| --- | --- | --- |
| Homepage IAWEB | PRONTO | `src/app/page.tsx` renderiza os componentes `iaweb`: Navbar, Hero, System, Process, Results, LeadForm, Footer e WhatsAppButton. |
| Diagnostico Digital | PRONTO | Pagina `/diagnostico`, motor de score, formulario, resultado visual, PDF e gravacao inicial em Supabase existem. |
| CRM de diagnosticos | PARCIAL | Lista leads, pesquisa, ordena, filtra, altera status e copia mensagem de WhatsApp. Nao tem criacao manual de leads, notas, tarefas, historico ou pipeline avancado. |
| Autenticacao do CRM | PARCIAL | Existe auth opcional por token/password e cookie HMAC. Em `.env.example` vem desativada por defeito. |
| Supabase | PRONTO | Cliente server-side com service role e SQL para `diagnostico_digital_leads` e `diagnosticos`. |
| PDF | PRONTO | PDF client-side com `jspdf` em `src/app/diagnostico/pdf.ts`. |
| WhatsApp | PARCIAL | Ha CTA/link e geracao/copia de mensagem. Nao ha envio automatico nem API WhatsApp integrada. |
| Email | PARCIAL | Ha envio via Resend usando `fetch`, mas depende de variaveis de ambiente nao presentes no `.env.local` auditado. |
| IA externa | NAO EXISTE | `@anthropic-ai/sdk` esta instalado, mas nao ha uso no codigo `src`. |
| Modulos novos | NAO EXISTE | Nao ha areas como propostas, faturacao, automacoes reais, analytics, utilizadores, equipas ou backoffice completo. |

## Estrutura atual

```text
iaweb-factory/
  src/
    app/
      page.tsx
      layout.tsx
      diagnostico/
        page.tsx
        DiagnosticoDigital.tsx
        pdf.ts
      crm/
        page.tsx
        CrmDashboardClient.tsx
        login/
          page.tsx
          CrmLoginForm.tsx
      api/
        diagnostico/
          route.ts
          lead/route.ts
        crm/
          leads/route.ts
          leads/[id]/route.ts
          auth/login/route.ts
          auth/logout/route.ts
    components/
      iaweb/
      solar/
      ui/
    lib/
      crm.ts
      crm-auth.ts
      diagnostico.ts
      diagnostico-email.ts
      diagnostico-whatsapp.ts
      utils.ts
  supabase/
  public/
    brand/
  docs/
    codex/
```

# Funcionalidades Prontas

| Funcionalidade | Estado | Observacoes |
| --- | --- | --- |
| Homepage institucional IAWEB | PRONTO | Usa somente componentes em `src/components/iaweb`. |
| Pagina `/diagnostico` | PRONTO | Experiencia completa com formulario, loading, resultado, animacoes e CTA. |
| Motor de diagnostico | PRONTO | `src/lib/diagnostico.ts` calcula score 0-100 por website, Google, conversao e automacao. |
| Gravacao de lead inicial | PRONTO | `POST /api/diagnostico` grava em `public.diagnostico_digital_leads`. |
| Sincronizacao para funil comercial | PRONTO | `POST /api/diagnostico/lead` grava/upsert em `public.diagnosticos`. |
| CRM leitura de leads | PRONTO | `/crm` lista leads de `diagnosticos`. |
| CRM filtro/pesquisa/ordenacao | PRONTO | Filtro por status, pesquisa por empresa/email/telefone e ordenacao por data/score. |
| CRM atualizar status | PRONTO | `PATCH /api/crm/leads/[id]` atualiza `status` e `updated_at`. |
| Geracao de mensagem WhatsApp | PRONTO | `generateDiagnosticoWhatsAppMessage` cria mensagem comercial. |
| Copia de WhatsApp no CRM | PRONTO | Dashboard copia `whatsapp_message` para clipboard. |
| Download PDF | PRONTO | `downloadDiagnosticoPdf` cria relatorio estrategico em A4. |
| Auth opcional do CRM | PRONTO | Quando ativado, protege `/crm` e APIs por cookie. |

# Funcionalidades Incompletas

| Funcionalidade | Estado | Lacuna |
| --- | --- | --- |
| Email pos-diagnostico | PARCIAL | Codigo Resend existe, mas depende de `RESEND_API_KEY` e `DIAGNOSTICO_EMAIL_FROM`; falhas sao apenas logadas e nao refletidas no CRM. |
| WhatsApp comercial | PARCIAL | Existe mensagem pronta e CTA, mas nao ha Evolution API, Meta WhatsApp Cloud API, webhook ou envio automatico dentro do Next. |
| CRM operacional | PARCIAL | Falta historico de contacto, notas, responsavel, proxima acao, data de follow-up, origem, prioridade persistida e timeline. |
| Lead form da homepage | PARCIAL | O componente `src/components/iaweb/LeadFormSection.tsx` existe visualmente, mas a integracao efetiva deve ser revista porque o fluxo robusto esta em `/diagnostico`. |
| Autenticacao | PARCIAL | E baseada em segredo unico; nao ha utilizadores, roles, reset de password, auditoria ou expiracao por utilizador. |
| Observabilidade | PARCIAL | Ha erros retornados/logados, mas nao ha logging estruturado, tracing, alertas ou tabela de eventos. |
| Testes automatizados | PARCIAL | Ha documento E2E manual em `docs/codex/E2E_CRM_TEST.md`, mas nao ha Playwright/Jest/Vitest configurado no `package.json`. |
| Migrations Supabase | PARCIAL | SQL existe em ficheiros soltos; nao ha estrutura formal de migrations Supabase CLI. |
| Tipos de base de dados | PARCIAL | Queries Supabase usam objetos manuais; nao ha tipos gerados do schema. |

# Funcionalidades em Falta

| Funcionalidade | Estado | Observacoes |
| --- | --- | --- |
| Envio automatico WhatsApp | NAO EXISTE | Apenas geracao/copia de mensagem. |
| Webhooks WhatsApp | NAO EXISTE | Nao ha endpoints para receber estados, respostas ou eventos. |
| Gestao manual de leads | NAO EXISTE | CRM nao cria/edita dados principais da lead, apenas status. |
| Notas e tarefas comerciais | NAO EXISTE | Nao ha tabelas nem UI para notas, tarefas ou follow-ups. |
| Pipeline com etapas configuraveis | NAO EXISTE | Status sao fixos no codigo e no check constraint. |
| Multiutilizador/roles | NAO EXISTE | Auth por segredo unico. |
| Dashboard analytics real | NAO EXISTE | Nao ha agregacoes historicas, graficos de conversao ou relatorios. |
| Integracao de IA real | NAO EXISTE | SDK Anthropic instalado, mas sem uso em codigo. |
| Envio de proposta/orcamento | NAO EXISTE | Nao ha modulo de propostas. |
| Area de clientes | NAO EXISTE | Nao ha login de cliente nem portal. |
| CMS/conteudo editavel | NAO EXISTE | Conteudo hardcoded nos componentes. |
| Testes automatizados | NAO EXISTE | Sem suite definida em scripts. |

# Dependências Instaladas

## Runtime

| Dependencia | Estado | Uso observado |
| --- | --- | --- |
| `next` 16.2.6 | PRONTO | Framework principal. |
| `react` 19.2.4 / `react-dom` 19.2.4 | PRONTO | UI. |
| `@supabase/supabase-js` | PRONTO | APIs server-side e CRM. |
| `@supabase/ssr` | PARCIAL | Instalado, mas nao foi encontrado uso direto em `src`. |
| `jspdf` | PRONTO | Geracao de PDF do diagnostico. |
| `framer-motion` | PRONTO | Animacoes na homepage/diagnostico/CRM. |
| `gsap` | PRONTO | Efeitos premium em `/diagnostico`. |
| `lenis` | PRONTO | Smooth scroll em `/diagnostico`. |
| `lucide-react` | PRONTO | Iconografia. |
| `class-variance-authority`, `clsx`, `tailwind-merge` | PARCIAL | Base UI/utilitarios; uso parcial. |
| `@radix-ui/react-slot` | PRONTO | Usado em componente `button`. |
| `@base-ui/react` | PARCIAL | Instalado, sem uso encontrado em `src`. |
| `motion` | PARCIAL | Instalado, sem import direto encontrado. |
| `shadcn` | PARCIAL | Instalado como dependencia, componentes locais existem. |
| `tw-animate-css` | PARCIAL | Instalado; confirmar uso no CSS antes de manter. |
| `@anthropic-ai/sdk` | PARCIAL | Instalado, sem uso encontrado em `src`. |

## Dev

| Dependencia | Estado | Observacoes |
| --- | --- | --- |
| `typescript` | PRONTO | `strict: true`, alias `@/*`. |
| `eslint` + `eslint-config-next` | PRONTO | Script `npm run lint`. |
| `tailwindcss` + `@tailwindcss/postcss` | PRONTO | Tailwind v4. |
| `@types/*` | PRONTO | Tipos React/Node. |

## Dependencias em falta

| Necessidade | Estado | Observacoes |
| --- | --- | --- |
| SDK/API WhatsApp | NAO EXISTE | Necessario para envio automatico e status real. |
| Test runner | NAO EXISTE | Falta Playwright/Vitest/Jest ou equivalente. |
| Supabase CLI/migrations formais | NAO EXISTE | SQL esta documentado, mas nao versionado como migrations CLI. |
| Logger/monitoring | NAO EXISTE | Sem Sentry, Logtail, Axiom ou equivalente. |
| Email SDK | PARCIAL | Nao e obrigatorio porque Resend usa `fetch`, mas nao ha pacote dedicado nem tracking. |

# Estrutura de Dados

## Tabelas utilizadas

| Tabela | Estado | Utilizacao |
| --- | --- | --- |
| `public.diagnostico_digital_leads` | PRONTO | Primeira gravacao do formulario `/diagnostico`. |
| `public.diagnosticos` | PRONTO | Funil comercial usado pelo CRM. |

## `diagnostico_digital_leads`

Campos principais:

| Campo | Estado |
| --- | --- |
| `id`, `created_at` | PRONTO |
| `nome`, `empresa`, `email`, `whatsapp`, `website`, `setor`, `objetivo` | PRONTO |
| `score_total`, `score_website`, `score_google`, `score_conversao`, `score_automacao` | PRONTO |
| `classificacao`, `potencial_estimado`, `recomendacoes` | PRONTO |

Indices:

| Indice | Estado |
| --- | --- |
| `diagnostico_digital_leads_created_at_idx` | PRONTO |
| `diagnostico_digital_leads_email_idx` | PRONTO |
| `diagnostico_digital_leads_whatsapp_idx` | PRONTO |
| `diagnostico_digital_leads_score_total_idx` | PRONTO |

## `diagnosticos`

Campos principais:

| Campo | Estado |
| --- | --- |
| `id`, `created_at`, `updated_at` | PRONTO |
| `diagnostico_digital_lead_id` | PRONTO |
| `empresa`, `nome_contacto`, `email`, `telefone`, `website`, `setor`, `objetivo` | PRONTO |
| `score_geral`, `score_website`, `score_google`, `score_conversao`, `score_automacao` | PRONTO |
| `classificacao`, `potencial_estimado`, `recomendacoes` | PRONTO |
| `status` | PRONTO |
| `whatsapp_message`, `whatsapp_status` | PARCIAL |

Status permitidos:

| Status | Estado |
| --- | --- |
| `novo`, `contactado`, `reuniao`, `proposta`, `fechado`, `perdido` | PRONTO |

Indices:

| Indice | Estado |
| --- | --- |
| `diagnosticos_diagnostico_digital_lead_id_idx` | PRONTO |
| `diagnosticos_created_at_idx` | PRONTO |
| `diagnosticos_status_idx` | PRONTO |
| `diagnosticos_score_geral_idx` | PRONTO |
| `diagnosticos_email_idx` | PRONTO |
| `diagnosticos_telefone_idx` | PRONTO |

# APIs

| Endpoint | Metodo | Estado | Funcao |
| --- | --- | --- | --- |
| `/api/diagnostico` | POST | PRONTO | Valida payload, calcula score e grava em `diagnostico_digital_leads`. |
| `/api/diagnostico/lead` | POST | PRONTO | Cria/upsert em `diagnosticos`, prepara WhatsApp e tenta enviar email. |
| `/api/crm/leads` | GET | PRONTO | Lista leads com filtros de status, pesquisa, sort e direction. |
| `/api/crm/leads/[id]` | PATCH | PRONTO | Atualiza status da lead. |
| `/api/crm/auth/login` | POST | PRONTO | Valida token/password e cria cookie de sessao. |
| `/api/crm/auth/logout` | POST | PRONTO | Remove cookie de sessao. |

## Variaveis de ambiente

| Variavel | Estado | Observacao |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | PRONTO | Presente no `.env.example`; valor local configurado. |
| `SUPABASE_SERVICE_ROLE_KEY` | PRONTO | Presente no `.env.example`; valor local configurado. Deve continuar fora de git. |
| `RESEND_API_KEY` | PARCIAL | Presente no `.env.example`, sem valor local observado. |
| `DIAGNOSTICO_EMAIL_FROM` | PARCIAL | Presente no `.env.example`, sem valor local observado. |
| `DIAGNOSTICO_EMAIL_REPLY_TO` | PARCIAL | Opcional; sem valor local observado. |
| `DIAGNOSTICO_BOOKING_URL` | PARCIAL | Opcional; sem valor local observado. |
| `CRM_AUTH_ENABLED` | PARCIAL | Presente no `.env.example`; se falso, CRM fica aberto. |
| `CRM_AUTH_TOKEN` / `CRM_AUTH_PASSWORD` | PARCIAL | Necessario se `CRM_AUTH_ENABLED=true`. |
| `CRM_AUTH_COOKIE_SECRET` | PARCIAL | Recomendado para separar segredo de sessao da credential. |

# Componentes

## Componentes ativos IAWEB

| Componente | Estado | Uso |
| --- | --- | --- |
| `NavbarSection` | PRONTO | Homepage. |
| `HeroSection` | PRONTO | Homepage. |
| `SystemSection` | PRONTO | Homepage. |
| `ProcessSection` | PRONTO | Homepage. |
| `ResultsSection` | PRONTO | Homepage. |
| `LeadFormSection` | PARCIAL | Homepage; rever integracao real com CRM/diagnostico. |
| `FooterSection` | PRONTO | Homepage. |
| `WhatsAppButton` | PRONTO | Homepage CTA. |
| `DiagnosticoDigital` | PRONTO | Pagina `/diagnostico`. |
| `CrmDashboardClient` | PRONTO | Dashboard CRM. |
| `CrmLoginForm` | PRONTO | Login CRM. |

## Componentes UI

| Componente | Estado | Observacoes |
| --- | --- | --- |
| `button.tsx` | PARCIAL | Usado por componentes UI/legado, nao central em homepage. |
| `shimmer-button.tsx` | PARCIAL | Usado pelos componentes `solar`. |
| `bento-grid.tsx` | PARCIAL | Usado pelos componentes `solar`. |
| `aurora-background.tsx` | PARCIAL | Sem uso ativo confirmado na app principal. |

## Codigo morto ou legado

| Item | Estado | Observacoes |
| --- | --- | --- |
| `src/components/solar/*` | PARCIAL | Componentes de uma vertical solar. Nenhuma referencia ativa encontrada em `src/app/page.tsx` ou rotas atuais. Deve ser classificado como legado/candidato a arquivo/remocao futura. |
| Dependencias associadas ao solar/UI antigo | PARCIAL | `shimmer-button`, `bento-grid` aparecem ligados ao pacote solar. |
| `@anthropic-ai/sdk` | PARCIAL | Instalado sem uso atual. |
| `@base-ui/react` | PARCIAL | Instalado sem uso atual confirmado. |
| `motion` | PARCIAL | Instalado sem import direto confirmado; `framer-motion` e usado. |
| Assets default Next (`next.svg`, `vercel.svg`, etc.) | PARCIAL | Presentes em `public`; confirmar se sao necessarios. |

# Recomendações

1. Congelar o contrato atual antes de novos modulos: manter `diagnostico_digital_leads` como tabela de submissao e `diagnosticos` como tabela comercial.
2. Transformar os SQL soltos em migrations ordenadas: primeiro `diagnostico_digital_leads`, depois `diagnosticos_full_schema_v2`.
3. Decidir o destino de `src/components/solar`: remover, arquivar ou mover para `legacy/` antes de expandir o produto.
4. Ativar `CRM_AUTH_ENABLED=true` em producao e configurar `CRM_AUTH_COOKIE_SECRET`.
5. Criar testes automatizados minimos para: diagnostico, gravacao Supabase mockada, CRM listagem, CRM patch status e auth.
6. Adicionar campos comerciais antes de criar modulos complexos: `owner`, `notes`, `next_action_at`, `source`, `priority`, `last_contacted_at`.
7. Separar email/WhatsApp em servicos com estados persistidos: `email_status`, `email_error`, `whatsapp_sent_at`, `whatsapp_error`.
8. Remover ou justificar dependencias nao usadas antes de aumentar o projeto.
9. Gerar tipos Supabase para reduzir erros entre schema e codigo.
10. Criar uma tabela de eventos para auditoria comercial, por exemplo `crm_events`.

# Roadmap Prioritário

| Prioridade | Item | Estado atual | Resultado esperado |
| --- | --- | --- | --- |
| P0 | Proteger CRM em producao | PARCIAL | Auth obrigatoria e segredo forte. |
| P0 | Formalizar migrations | PARCIAL | Setup reprodutivel da base de dados. |
| P0 | Limpar/arquivar legado solar | PARCIAL | Base mais clara antes de novos modulos. |
| P1 | Criar testes automatizados essenciais | NAO EXISTE | Menos regressao no fluxo Diagnostico -> CRM. |
| P1 | Persistir estados de email/WhatsApp | PARCIAL | Visibilidade operacional real. |
| P1 | Expandir CRM com notas e follow-ups | NAO EXISTE | Pipeline utilizavel no dia a dia. |
| P2 | Integrar envio WhatsApp real | NAO EXISTE | Seguimento automatico ou semi-automatico. |
| P2 | Criar analytics do funil | NAO EXISTE | Taxas por status, origem, score e periodo. |
| P2 | Tipos Supabase gerados | NAO EXISTE | Menos divergencia schema/codigo. |
| P3 | Avaliar uso real de IA externa | NAO EXISTE | Justificar ou remover SDK Anthropic. |

