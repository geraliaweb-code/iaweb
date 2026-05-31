# Vercel Deploy

## Estado do projeto

Projeto pronto para deploy na Vercel.

- Framework: Next.js `16.2.6`
- Package manager esperado: npm, com `package-lock.json`
- Build command: `npm run build`
- Start command local: `npm run start`
- `next.config.ts`: configuracao minima, sem incompatibilidades identificadas

Na Vercel, selecionar o preset `Next.js`. A Vercel gere o runtime de producao automaticamente; nao e necessario configurar `npm run start` como comando manual no painel.

## Variaveis de ambiente na Vercel

Configurar em `Project Settings -> Environment Variables`.

### Supabase

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

Notas:

- Usar o projeto Supabase onde as migrations ja foram executadas.
- `SUPABASE_SERVICE_ROLE_KEY` deve ficar apenas no ambiente server-side da Vercel.
- Nao usar anon key para o CRM nem para as rotas server-side.

### CRM protegido

```env
CRM_AUTH_ENABLED=true
CRM_AUTH_TOKEN=<token-forte>
CRM_AUTH_PASSWORD=<password-forte>
CRM_AUTH_COOKIE_SECRET=<secret-forte>
```

Obrigatorio em producao:

- `CRM_AUTH_ENABLED=true`
- Definir `CRM_AUTH_TOKEN` ou `CRM_AUTH_PASSWORD`
- Definir `CRM_AUTH_COOKIE_SECRET`

Recomendacao:

- Usar um `CRM_AUTH_TOKEN` forte e aleatorio.
- Usar um `CRM_AUTH_COOKIE_SECRET` diferente, tambem forte e aleatorio.
- `CRM_AUTH_PASSWORD` pode ficar vazio se `CRM_AUTH_TOKEN` estiver definido.

Exemplo de formato forte:

```text
CRM_AUTH_TOKEN=iaweb_crm_<32+ caracteres aleatorios>
CRM_AUTH_COOKIE_SECRET=<64+ caracteres aleatorios>
```

### Email pos-diagnostico

```env
RESEND_API_KEY=
DIAGNOSTICO_EMAIL_FROM=
DIAGNOSTICO_EMAIL_REPLY_TO=
DIAGNOSTICO_BOOKING_URL=
```

Estas variaveis sao necessarias se o envio de email pos-diagnostico estiver ativo/esperado. O fluxo CRM nao deve falhar se o envio de email tiver erro, mas em producao devem ser configuradas.

## Comandos locais

Instalar dependencias:

```powershell
npm.cmd install
```

Validar build:

```powershell
npm.cmd run build
```

Testar producao localmente:

```powershell
npm.cmd run start
```

## Configuracao Vercel

1. Importar o repositorio na Vercel.
2. Framework preset: `Next.js`.
3. Install command: default da Vercel para npm, ou `npm install`.
4. Build command: `npm run build`.
5. Output directory: deixar vazio/default.
6. Configurar todas as variaveis de ambiente de producao.
7. Fazer deploy.

## Migrations Supabase

As migrations necessarias sao:

1. `supabase/diagnostico_digital_leads.sql`
2. `supabase/diagnosticos_full_schema_v2.sql`

Confirmacao ja validada:

```sql
select to_regclass('public.diagnosticos');
```

Resultado validado:

```text
diagnosticos
```

Tabelas esperadas:

- `public.diagnostico_digital_leads`
- `public.diagnosticos`

Se houver erro de schema cache no deploy, executar no SQL Editor:

```sql
notify pgrst, 'reload schema';
```

## Checklist pre-deploy

- `npm.cmd run build` passa localmente.
- Migrations Supabase executadas no projeto correto.
- `NEXT_PUBLIC_SUPABASE_URL` aponta para o Supabase correto.
- `SUPABASE_SERVICE_ROLE_KEY` pertence ao mesmo Supabase.
- `CRM_AUTH_ENABLED=true` em producao.
- `CRM_AUTH_TOKEN` ou `CRM_AUTH_PASSWORD` definido com valor forte.
- `CRM_AUTH_COOKIE_SECRET` definido com valor forte.
- Variaveis de email configuradas se o email pos-diagnostico for esperado.

## Teste pos-deploy

### 1. Diagnostico

1. Abrir `https://<dominio>/diagnostico`.
2. Submeter uma lead nova.
3. Confirmar que aparece o resultado do diagnostico.

Esperado:

- `POST /api/diagnostico` responde com sucesso.
- Score, categorias, classificacao, potencial e recomendacoes aparecem.

### 2. Supabase

No Supabase Table Editor, confirmar:

- Nova linha em `public.diagnostico_digital_leads`.
- Nova linha em `public.diagnosticos`.
- `status = novo`.
- `whatsapp_status = pendente`.
- `whatsapp_message` preenchida.

### 3. CRM protegido

1. Abrir `https://<dominio>/crm` sem sessao.
2. Confirmar redirect para `/crm/login`.
3. Confirmar que `GET /api/crm/leads` sem sessao devolve `401`.

### 4. Login CRM

1. Abrir `/crm/login`.
2. Introduzir `CRM_AUTH_TOKEN` ou `CRM_AUTH_PASSWORD`.
3. Confirmar acesso ao CRM.
4. Confirmar que a lead criada aparece na tabela.

### 5. Alteracao de status

1. Alterar a lead de `Novo` para `Contactado`.
2. Confirmar atualizacao visual.
3. Confirmar no Supabase que `public.diagnosticos.status = contactado`.

### 6. Copiar WhatsApp

1. Clicar em `Copiar WhatsApp`.
2. Confirmar estado `Copiado`.
3. Colar a mensagem num editor local.

Esperado:

- Mensagem contem nome, empresa, score e oportunidade principal.
- Nenhum WhatsApp e enviado automaticamente.

## Criterio de sucesso

Deploy aprovado quando:

- Vercel build conclui sem erros.
- `/diagnostico` grava no Supabase.
- `/crm` exige login.
- Login CRM funciona.
- Lead real aparece no CRM.
- Status atualiza no Supabase.
- WhatsApp pode ser copiado.
