# GO LIVE FIXES REPORT IAWEB

Data: 2026-06-01  
Sprint: 12.1 - Correcoes Criticas Go-Live  
Build: PASS

## Resumo Executivo

Foram corrigidos os tres bloqueadores criticos identificados no `GO_LIVE_REPORT.md`:

1. Protecao de rotas internas e APIs do Prospector.
2. Constraint unica para suportar `onConflict: "email"` em `diagnosticos`.
3. QR Code real no PDF executivo.

Novo Go Live Score estimado: **88 / 100**

Estado recomendado: **apto para go-live controlado apos aplicar migrations Supabase e configurar variaveis de producao.**

## Correcoes Aplicadas

### 1. Protecao de Rotas

Rotas protegidas com a mesma sessao usada pelo CRM:

- `/dashboard`
- `/prospector`
- `/admin/testes`

Comportamento:

- Utilizador sem sessao valida e redirecionado para `/crm/login`.
- A autenticacao CRM fica ativa por defeito em producao, exceto se `CRM_AUTH_ENABLED=false` for definido explicitamente.
- Cookies continuam geridos pelo helper existente, com `httpOnly`, `sameSite: "lax"` e `secure` em producao.

APIs protegidas com resposta `401` quando nao autenticadas:

- `/api/prospector/prospects`
- `/api/prospector/generate`
- `/api/prospector/promote-to-crm`
- `/api/prospector/prospects/[id]`

### 2. Constraint Unica de Email

Migration criada:

- `supabase/diagnosticos_email_unique.sql`

Objetivo:

- Normalizar emails vazios para `NULL`.
- Normalizar emails existentes para `lower(trim(email))`.
- Identificar duplicados.
- Manter o registo mais completo e mais recente.
- Remover duplicados restantes.
- Criar indice unico em `public.diagnosticos(email)`.

Decisao documentada no SQL:

- Em caso de duplicados, e preservado o registo com mais campos comerciais preenchidos.
- Em empate, e preservado o registo mais recente por `updated_at`, depois `created_at`.

Indice criado:

```sql
create unique index if not exists diagnosticos_email_unique_idx
on public.diagnosticos (email);
```

### 3. QR Code Real no PDF

O placeholder visual foi substituido por QR Code real gerado com a biblioteca `qrcode`.

Destino do QR:

1. `NEXT_PUBLIC_DIAGNOSTICO_BOOKING_URL`, se existir.
2. `NEXT_PUBLIC_BOOKING_URL`, se existir.
3. `DIAGNOSTICO_BOOKING_URL`, quando disponivel em server-side.
4. Website institucional IAWEB.
5. WhatsApp como fallback final.

O QR e desenhado diretamente no jsPDF como matriz escaneavel, mantendo o PDF sincrono e estavel.

## Ficheiros Alterados

- `package.json`
- `package-lock.json`
- `src/lib/crm-auth.ts`
- `src/app/dashboard/page.tsx`
- `src/app/prospector/page.tsx`
- `src/app/admin/testes/page.tsx`
- `src/app/api/prospector/prospects/route.ts`
- `src/app/api/prospector/generate/route.ts`
- `src/app/api/prospector/promote-to-crm/route.ts`
- `src/app/api/prospector/prospects/[id]/route.ts`
- `src/app/diagnostico/pdf.ts`

## Ficheiros Criados

- `supabase/diagnosticos_email_unique.sql`
- `docs/GO_LIVE_FIXES_REPORT.md`

## Dependencias

Dependencia adicionada:

- `qrcode`

Tipos adicionados:

- `@types/qrcode`

Motivo:

- Gerar QR Code real e escaneavel sem mudar a arquitetura do PDF para async e sem introduzir dependencia pesada.

## Validacao

Comando executado:

```bash
npm.cmd run build
```

Resultado:

```text
PASS
Compiled successfully
TypeScript completed successfully
17/17 static pages generated
```

## Migrations a Executar no Supabase

Executar no Supabase antes do go-live:

```sql
supabase/diagnosticos_email_unique.sql
```

Recomendacao operacional:

1. Fazer backup da tabela `diagnosticos`.
2. Executar query de auditoria para duplicados.
3. Aplicar a migration.
4. Testar `/api/prospector/promote-to-crm` com um prospect real de teste.

## Riscos Restantes

### Risco Medio - Autenticacao depende de configuracao de ambiente

Em producao, a autenticacao fica ativa por defeito. Ainda assim, devem existir:

- `CRM_AUTH_TOKEN` ou `CRM_AUTH_PASSWORD`
- `CRM_AUTH_COOKIE_SECRET`

Sem credenciais, as areas protegidas ficam bloqueadas por configuracao incompleta.

### Risco Medio - Migration remove duplicados

A migration remove registos duplicados por email, mantendo o mais completo/recente. Antes de aplicar em producao, deve ser feito backup.

### Risco Baixo - QR deve ser validado visualmente

O QR agora e gerado como matriz real, mas deve ser testado com telemovel apos exportar um PDF em ambiente final.

### Risco Baixo - Rate limiting ainda pendente

As APIs comerciais estao protegidas onde eram criticas, mas ainda nao ha rate limiting dedicado.

### Risco Baixo - Auditoria npm pendente

Durante a instalacao do `qrcode`, o npm reportou 2 vulnerabilidades moderadas. O build nao falhou, mas antes do go-live final deve ser executado `npm audit` e avaliado o impacto real sem aplicar `--force` automaticamente.

## Decisao Pos-Correcao

A IAWEB deixa de ter os bloqueadores criticos identificados na Sprint 12.

Condicoes para go-live:

1. Aplicar todas as migrations Supabase, incluindo `diagnosticos_email_unique.sql`.
2. Configurar credenciais CRM em producao.
3. Confirmar que `CRM_AUTH_ENABLED` nao esta definido como `false` na Vercel.
4. Testar login, dashboard, prospector, promocao para CRM e download PDF em ambiente final.

Conclusao:

**SIM, a IAWEB fica tecnicamente apta para go-live controlado depois da migration e configuracao final de ambiente.**
