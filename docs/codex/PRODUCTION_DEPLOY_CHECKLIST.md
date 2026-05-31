# Production Deploy Checklist

## Objetivo

Publicar a IAWEB sem quebrar o fluxo validado:

Diagnostico -> Supabase -> CRM protegido -> Status -> WhatsApp copiado.

## Variaveis de ambiente

### Supabase

```env
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

- `NEXT_PUBLIC_SUPABASE_URL`: URL do projeto Supabase correto.
- `SUPABASE_SERVICE_ROLE_KEY`: service role key do mesmo projeto Supabase.
- Nunca usar anon key para as rotas server-side que gravam/leem CRM.

### CRM Auth

```env
CRM_AUTH_ENABLED=true
CRM_AUTH_TOKEN=
CRM_AUTH_PASSWORD=
CRM_AUTH_COOKIE_SECRET=
```

- Em producao, usar `CRM_AUTH_ENABLED=true`.
- Definir pelo menos uma credencial:
  - `CRM_AUTH_TOKEN`, ou
  - `CRM_AUTH_PASSWORD`.
- Definir `CRM_AUTH_COOKIE_SECRET` com valor longo e aleatorio.
- Guardar estes valores apenas no provider de deploy/hosting, nunca no repositorio.

### Email pos-diagnostico

```env
RESEND_API_KEY=
DIAGNOSTICO_EMAIL_FROM=
DIAGNOSTICO_EMAIL_REPLY_TO=
DIAGNOSTICO_BOOKING_URL=
```

- Necessarias para envio de email pos-diagnostico.
- O E2E CRM nao depende do email para gravar a lead, mas estas variaveis devem estar configuradas se o envio em producao for esperado.

## Comandos

Build:

```powershell
npm.cmd run build
```

Start em producao:

```powershell
npm.cmd run start
```

Em providers como Vercel/Netlify/Render, configurar:

```text
Build command: npm run build
Start command: npm run start
```

## Migrations Supabase

Executar no SQL Editor do projeto Supabase de producao:

1. `supabase/diagnostico_digital_leads.sql`
2. `supabase/diagnosticos_full_schema_v2.sql`

Confirmar depois:

```sql
select to_regclass('public.diagnostico_digital_leads');
select to_regclass('public.diagnosticos');
```

Resultado esperado:

```text
diagnostico_digital_leads
diagnosticos
```

Se o PostgREST ainda nao reconhecer a tabela, executar:

```sql
notify pgrst, 'reload schema';
```

## Teste pos-deploy

### 1. Diagnostico

1. Abrir `/diagnostico`.
2. Submeter uma lead nova.
3. Confirmar que o resultado aparece sem erro.

Resultado esperado:

- `POST /api/diagnostico` responde com sucesso.
- O resultado mostra score, categorias, classificacao, potencial e recomendacoes.

### 2. Lead no Supabase

No Supabase Table Editor, confirmar:

- Nova linha em `public.diagnostico_digital_leads`.
- Nova linha em `public.diagnosticos`.
- `diagnosticos.status = novo`.
- `diagnosticos.whatsapp_status = pendente`.
- `diagnosticos.whatsapp_message` preenchido.

### 3. CRM protegido

1. Abrir `/crm` sem sessao.
2. Confirmar redirect para `/crm/login`.
3. Confirmar que `GET /api/crm/leads` sem sessao devolve `401`.

### 4. Login CRM

1. Abrir `/crm/login`.
2. Introduzir `CRM_AUTH_TOKEN` ou `CRM_AUTH_PASSWORD`.
3. Confirmar redirect/acesso a `/crm`.

Resultado esperado:

- A tabela CRM aparece.
- A lead de teste esta visivel.
- Nao aparece erro de Supabase ou schema cache.

### 5. Alteracao de status

1. Na lead de teste, mudar status de `Novo` para `Contactado`.
2. Confirmar que a UI atualiza.
3. Confirmar no Supabase que `public.diagnosticos.status = contactado`.

### 6. Copiar WhatsApp

1. Clicar em `Copiar WhatsApp`.
2. Confirmar que o botao muda para `Copiado`.
3. Colar a mensagem num editor local.

Resultado esperado:

- A mensagem contem nome, empresa, score e oportunidade principal.
- Nenhuma mensagem e enviada automaticamente.

## Criterio de sucesso

O deploy esta pronto quando:

- Build conclui sem erros.
- As duas migrations existem em producao.
- Diagnostico grava em Supabase.
- CRM exige login em producao.
- Login CRM funciona.
- Lead aparece no CRM.
- Status atualiza no Supabase.
- WhatsApp pode ser copiado.
