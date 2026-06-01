# IAWEB Deploy Checklist

Checklist de producao para colocar a IAWEB online com risco minimo.

## 1. Estado Atual

Stack:

- Next.js 16.2.6
- React 19.2.4
- TypeScript
- Supabase
- Vercel
- jsPDF para PDF executivo
- Resend opcional para email pos-diagnostico

Rotas principais:

- `/`
- `/diagnostico`
- `/demo`
- `/simulador-site`
- `/proposta`
- `/crm`
- `/crm/login`
- `/prospector`
- `/dashboard`
- `/admin/testes`

APIs principais:

- `/api/diagnostico`
- `/api/diagnostico/lead`
- `/api/crm/auth/login`
- `/api/crm/auth/logout`
- `/api/crm/leads`
- `/api/crm/leads/[id]`
- `/api/prospector/prospects`
- `/api/prospector/generate`
- `/api/prospector/promote-to-crm`
- `/api/prospector/prospects/[id]`

Build local validado:

```bash
npm.cmd run build
```

## 2. Supabase

### 2.1 Criar projeto

1. Criar projeto Supabase.
2. Guardar:
   - Project URL
   - Service Role Key
3. Confirmar que a Service Role Key fica apenas em variaveis server-side.

### 2.2 Executar migrations

Executar no SQL Editor do Supabase, por ordem:

1. `supabase/diagnosticos_full_schema_v2.sql`
2. `supabase/crm_commercial_pipeline.sql`
3. `supabase/website_generator_pipeline.sql`
4. `supabase/sales_agent_messages.sql`
5. `supabase/prospector_pipeline.sql`

Opcional para ambiente interno/demo:

6. `supabase/test_seed_iaweb.sql`

### 2.3 Tabelas esperadas

#### `diagnosticos`

Usada por:

- Diagnostico
- Demo
- Simulador
- CRM
- Proposta
- Website Generator
- Agente Comercial
- Dashboard

Campos criticos:

- `empresa`
- `nome_contacto`
- `email`
- `telefone`
- `website`
- `cidade`
- `setor`
- `objetivo`
- `score_geral`
- `score_website`
- `score_google`
- `score_conversao`
- `score_automacao`
- `score_crm`
- `status`
- `origem`
- `impacto_financeiro`
- `plano_recomendado`
- `homepage_gerada`
- `score_projetado`
- `melhoria_prevista`
- `template_utilizado`
- `whatsapp_message`
- `email_subject`
- `email_body`
- `followup_3d`
- `followup_7d`
- `followup_15d`
- `objection_responses`
- `sales_agent_status`

#### `prospects`

Usada por:

- Prospector IA
- Dashboard Executivo
- Promover para CRM

Campos criticos:

- `empresa`
- `contacto`
- `email`
- `telefone`
- `website`
- `cidade`
- `regiao`
- `nicho`
- `keywords`
- `score_digital`
- `opportunity_score`
- `priority_label`
- `impacto_financeiro`
- `homepage_gerada`
- `score_projetado`
- `melhoria_prevista`
- `template_utilizado`
- `status`
- `source`

### 2.4 Verificacoes Supabase

- Confirmar indices criados.
- Confirmar que `prospects.email` tem unique index parcial.
- Confirmar que `diagnosticos.email` permite o `upsert` usado no Prospector. Se falhar, criar indice unico ou alterar estrategia de insert.
- Confirmar permissões: as APIs usam Service Role no servidor; nao expor Service Role no browser.

## 3. Variaveis de Ambiente

Configurar em Vercel:

```bash
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

RESEND_API_KEY=
DIAGNOSTICO_EMAIL_FROM=
DIAGNOSTICO_EMAIL_REPLY_TO=
DIAGNOSTICO_BOOKING_URL=

CRM_AUTH_ENABLED=true
CRM_AUTH_TOKEN=
CRM_AUTH_PASSWORD=
CRM_AUTH_COOKIE_SECRET=

NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_APP_ENV=production
```

Obrigatorias para producao:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CRM_AUTH_ENABLED=true`
- `CRM_AUTH_TOKEN` ou `CRM_AUTH_PASSWORD`
- `CRM_AUTH_COOKIE_SECRET`

Opcionais:

- `RESEND_API_KEY`
- `DIAGNOSTICO_EMAIL_FROM`
- `DIAGNOSTICO_EMAIL_REPLY_TO`
- `DIAGNOSTICO_BOOKING_URL`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_APP_ENV`

## 4. Vercel

### 4.1 Configurar projeto

1. Ligar repositorio no Vercel.
2. Framework: Next.js.
3. Build command: `npm run build`.
4. Output: default Next.js.
5. Node runtime: default Vercel compativel com Next.js 16.

### 4.2 Validar SSR/CSR

Rotas server/dynamic:

- `/crm`
- `/dashboard`
- `/prospector`
- `/admin/testes`
- APIs em `/api/*`

Rotas client-heavy:

- `/demo`
- `/simulador-site`
- `/proposta`
- `/diagnostico`

### 4.3 Cookies e auth

CRM usa cookie:

- Nome: `iaweb_crm_session`
- `httpOnly: true`
- `sameSite: lax`
- `secure: true` em producao
- max age: 8h

Validar:

1. Abrir `/crm`.
2. Deve redirecionar para `/crm/login` quando `CRM_AUTH_ENABLED=true`.
3. Fazer login com `CRM_AUTH_TOKEN` ou `CRM_AUTH_PASSWORD`.
4. Confirmar acesso a `/crm`.
5. Fazer logout.
6. Confirmar cookie removido.

## 5. Dominio e SSL

1. Adicionar dominio no Vercel.
2. Configurar DNS conforme Vercel.
3. Confirmar SSL ativo.
4. Confirmar redirects HTTP -> HTTPS.
5. Atualizar `NEXT_PUBLIC_SITE_URL`.

## 6. Seguranca

### Riscos atuais

- `/dashboard`, `/prospector` e `/admin/testes` ainda nao usam a mesma protecao do CRM.
- `SUPABASE_SERVICE_ROLE_KEY` deve ficar apenas no servidor.
- APIs do Prospector usam Service Role e devem ser protegidas antes de exposicao publica ampla.
- `/admin/testes` pode expor dados de validacao interna.
- Mensagens comerciais sao geradas, mas nao enviadas; manter assim ate haver consentimento/logs/opt-out.

### Recomendacoes antes de publico

- Proteger `/dashboard`, `/prospector` e `/admin/testes` com auth.
- Avaliar middleware global para areas internas.
- Rever CORS se forem adicionados clientes externos.
- Garantir tokens longos e secretos.
- Nunca commitar `.env.local`.
- Rodar secrets se tiverem sido expostos em testes.

## 7. Performance

### Pontos de atencao

- `/dashboard` carrega prospects e CRM no server; limitar resultados e paginar quando crescer.
- `/prospector` pode gerar 30 prospects por pedido; manter limite.
- `CrmDashboardClient` renderiza Kanban completo; paginar/virtualizar se houver centenas de leads.
- PDF com jsPDF e UI rica pode pesar no browser em maquinas lentas.
- `framer-motion`, `gsap` e `lenis` sao usados em experiencias premium; monitorizar impacto em mobile.

### Otimizacoes futuras

- Paginar CRM e Prospector.
- Criar endpoints agregados para dashboard em vez de carregar listas completas.
- Cache server-side para metricas.
- Lazy-load de componentes pesados.
- Testes Lighthouse nas rotas publicas.

## 8. Logs

### Estrutura recomendada

Adicionar logging padronizado por dominio:

- `diagnostico`
- `crm`
- `prospector`
- `sales-agent`
- `pdf`
- `dashboard`

Eventos minimos:

- erro de Supabase
- erro de insert/update
- falha de autenticacao CRM
- falha de email Resend
- promocao de prospect para CRM
- geracao de prospects
- download/geracao PDF

Atualmente existem `console.error` pontuais em email/WhatsApp diagnostico. Para producao, recomenda-se integrar Sentry, Logtail, Axiom ou Vercel Logs.

## 9. Monitorizacao

Checklist operacional:

- Uptime Vercel.
- Erros 5xx nas APIs.
- Latencia de `/api/diagnostico/lead`.
- Latencia de `/api/prospector/generate`.
- Erros Supabase.
- Tamanho das tabelas `diagnosticos` e `prospects`.
- Taxa de promocao Prospect -> CRM.
- Leads sem follow-up.
- Propostas paradas.
- Falhas de email Resend.

Rotas a monitorizar:

- `/`
- `/diagnostico`
- `/demo`
- `/crm`
- `/prospector`
- `/dashboard`
- `/api/diagnostico`
- `/api/diagnostico/lead`
- `/api/prospector/generate`

## 10. Testes Finais

### 10.1 Build

```bash
npm.cmd run build
```

### 10.2 Diagnostico

1. Abrir `/diagnostico`.
2. Submeter formulario.
3. Confirmar score.
4. Baixar PDF.
5. Confirmar lead no CRM.

### 10.3 Demo

1. Abrir `/demo`.
2. Gerar analise.
3. Guardar lead no CRM.
4. Navegar para simulador.
5. Confirmar query params.

### 10.4 Simulador

1. Abrir `/simulador-site`.
2. Gerar simulacao.
3. Confirmar Antes/Depois.
4. Guardar simulacao.
5. Ir para proposta.

### 10.5 Proposta

1. Abrir `/proposta`.
2. Confirmar score atual/projetado.
3. Confirmar ROI e plano.
4. Testar print/PDF browser.

### 10.6 CRM

1. Abrir `/crm`.
2. Login.
3. Mover card no Kanban.
4. Alterar status no drawer.
5. Adicionar nota.
6. Copiar WhatsApp/email/follow-ups.

### 10.7 Prospector

1. Abrir `/prospector`.
2. Gerar prospects.
3. Filtrar por nicho/cidade.
4. Promover prospect para CRM.
5. Confirmar lead em `/crm`.

### 10.8 Dashboard

1. Abrir `/dashboard`.
2. Confirmar metricas.
3. Confirmar alertas IA.
4. Confirmar tabela de oportunidades.

### 10.9 Admin Testes

1. Executar `supabase/test_seed_iaweb.sql` em ambiente de staging.
2. Abrir `/admin/testes`.
3. Confirmar checklist OK.

## 11. Ordem Recomendada de Producao

1. Criar Supabase.
2. Executar migrations.
3. Configurar Vercel.
4. Configurar variaveis.
5. Fazer deploy preview.
6. Correr testes finais em preview.
7. Proteger rotas internas.
8. Apontar dominio.
9. Validar SSL.
10. Fazer teste completo em producao.

## 12. Go/No-Go

Go se:

- Build passa.
- Supabase responde.
- CRM autentica.
- `/diagnostico`, `/demo`, `/simulador-site`, `/proposta`, `/crm`, `/prospector`, `/dashboard` carregam.
- Lead entra no CRM.
- Prospect promove para CRM.
- PDF gera.
- Mensagens comerciais aparecem no drawer.

No-Go se:

- Service Role aparece no browser.
- CRM fica aberto em producao sem intencao.
- APIs internas ficam publicas sem protecao definida.
- Migrations falham.
- `upsert` em email falha por falta de constraint.
- Dashboard ou Prospector expõem dados reais sem auth.
