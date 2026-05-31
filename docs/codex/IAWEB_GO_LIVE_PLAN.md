# IAWEB Go-Live Plan

## Objetivo

Publicar a IAWEB em `iaweb.pt` na Vercel com o E2E validado:

Diagnostico -> Supabase -> CRM protegido -> Login CRM -> Status -> WhatsApp copiado.

Este plano nao cria funcionalidades novas. Serve para preparar a publicacao oficial e reduzir risco no go-live.

## Estado tecnico atual

- App: Next.js `16.2.6`
- Build: `npm run build`
- Start local: `npm run start`
- Hosting alvo: Vercel
- Base de dados: Supabase
- CRM: protegido por `CRM_AUTH_ENABLED=true` em producao
- Migrations obrigatorias:
  - `supabase/diagnostico_digital_leads.sql`
  - `supabase/diagnosticos_full_schema_v2.sql`

## 1. Ligar `iaweb.pt` a Vercel

1. Criar/importar o projeto na Vercel.
2. Confirmar que o primeiro deploy em URL Vercel funciona, por exemplo:
   - `https://<project>.vercel.app`
3. Na Vercel, abrir:
   - Project -> Settings -> Domains
4. Adicionar:
   - `iaweb.pt`
   - `www.iaweb.pt`
5. Escolher o dominio principal:
   - recomendado: `iaweb.pt`
6. Configurar redirect:
   - `www.iaweb.pt` -> `iaweb.pt`

## 2. Configurar DNS

No painel DNS do dominio `iaweb.pt`, configurar os records indicados pela Vercel.

Configuracao habitual para Vercel:

```text
Type: A
Name: @
Value: 76.76.21.21
```

```text
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

Notas:

- Remover A/CNAME antigos que apontem para outro hosting.
- Manter records de email existentes, como MX, SPF, DKIM e DMARC, se o dominio ja usa email.
- Nao alterar nameservers sem necessidade. Usar records DNS e mais seguro se o email do dominio ja estiver configurado.
- A propagacao pode demorar de minutos a algumas horas.

Validacao DNS:

```powershell
nslookup iaweb.pt
nslookup www.iaweb.pt
```

Resultado esperado:

- `iaweb.pt` aponta para Vercel.
- `www.iaweb.pt` resolve via CNAME da Vercel.
- A Vercel mostra os dominios como validos.

## 3. Configurar HTTPS

A Vercel emite HTTPS automaticamente depois do DNS estar correto.

Checklist:

1. Esperar a Vercel marcar `iaweb.pt` como `Valid Configuration`.
2. Confirmar certificado ativo em:
   - `https://iaweb.pt`
   - `https://www.iaweb.pt`
3. Confirmar que `http://iaweb.pt` redireciona para HTTPS.
4. Confirmar que `www.iaweb.pt` redireciona para o dominio principal.

## 4. Variaveis de ambiente de producao

Configurar em Vercel:

Project -> Settings -> Environment Variables -> Production.

### Supabase

```env
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

### CRM

```env
CRM_AUTH_ENABLED=true
CRM_AUTH_TOKEN=
CRM_AUTH_PASSWORD=
CRM_AUTH_COOKIE_SECRET=
```

Regras:

- `CRM_AUTH_ENABLED=true` em producao.
- Definir `CRM_AUTH_TOKEN` ou `CRM_AUTH_PASSWORD`.
- Definir `CRM_AUTH_COOKIE_SECRET` forte e diferente da password/token.
- Usar valores longos, aleatorios e guardados apenas na Vercel.

### Email pos-diagnostico

```env
RESEND_API_KEY=
DIAGNOSTICO_EMAIL_FROM=
DIAGNOSTICO_EMAIL_REPLY_TO=
DIAGNOSTICO_BOOKING_URL=
```

O E2E CRM nao deve depender do email, mas estas variaveis devem estar configuradas se o envio pos-diagnostico for esperado em producao.

## 5. Validar Supabase em producao

No Supabase SQL Editor do projeto de producao:

```sql
select to_regclass('public.diagnostico_digital_leads');
select to_regclass('public.diagnosticos');
```

Resultado esperado:

```text
diagnostico_digital_leads
diagnosticos
```

Confirmar tabelas:

- `public.diagnostico_digital_leads`
- `public.diagnosticos`

Se existir erro de schema cache no deploy:

```sql
notify pgrst, 'reload schema';
```

Validar tambem:

- `SUPABASE_SERVICE_ROLE_KEY` pertence ao mesmo projeto.
- `NEXT_PUBLIC_SUPABASE_URL` aponta para o mesmo projeto.
- As tabelas aparecem no Table Editor.

## 6. Validar CRM protegido em producao

Com `CRM_AUTH_ENABLED=true`:

1. Abrir `https://iaweb.pt/crm` sem sessao.
2. Confirmar redirect para:
   - `https://iaweb.pt/crm/login`
3. Aceder a:
   - `https://iaweb.pt/api/crm/leads`
4. Confirmar resposta `401` sem sessao.
5. Fazer login em `/crm/login` com `CRM_AUTH_TOKEN` ou `CRM_AUTH_PASSWORD`.
6. Confirmar acesso ao CRM.
7. Confirmar que o botao `Sair` faz logout.
8. Confirmar que depois do logout `/api/crm/leads` volta a responder `401`.

## 7. Checklist de go-live

### Antes de publicar

- Build local passa:

```powershell
npm.cmd run build
```

- Projeto importado na Vercel.
- Variaveis de ambiente configuradas em Production.
- Migrations Supabase executadas.
- `iaweb.pt` e `www.iaweb.pt` adicionados na Vercel.
- DNS configurado.
- HTTPS ativo.
- CRM auth ativo em producao.

### Depois do deploy

1. Abrir `https://iaweb.pt`.
2. Confirmar que a homepage carrega.
3. Abrir `https://iaweb.pt/diagnostico`.
4. Submeter uma lead real de teste.
5. Confirmar resultado do diagnostico.
6. Confirmar no Supabase:
   - linha em `diagnostico_digital_leads`
   - linha em `diagnosticos`
   - `status = novo`
   - `whatsapp_message` preenchida
7. Abrir `https://iaweb.pt/crm`.
8. Confirmar redirect para login.
9. Fazer login no CRM.
10. Confirmar que a lead aparece.
11. Alterar status para `Contactado`.
12. Confirmar no Supabase que o status mudou.
13. Clicar `Copiar WhatsApp`.
14. Confirmar mensagem copiada.

## 8. Plano de rollback

### Cenario A: Homepage ou diagnostico nao carrega

1. Na Vercel, abrir Deployments.
2. Selecionar o ultimo deploy estavel.
3. Clicar `Promote to Production`.
4. Validar `https://iaweb.pt`.

### Cenario B: Diagnostico carrega mas nao grava no Supabase

1. Verificar variaveis na Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
2. Confirmar projeto Supabase correto.
3. Confirmar migrations.
4. Se necessario, executar:

```sql
notify pgrst, 'reload schema';
```

5. Redeploy na Vercel depois de corrigir variaveis.

### Cenario C: CRM exposto ou login falha

1. Confirmar:
   - `CRM_AUTH_ENABLED=true`
   - `CRM_AUTH_TOKEN` ou `CRM_AUTH_PASSWORD`
   - `CRM_AUTH_COOKIE_SECRET`
2. Redeploy para garantir que variaveis foram aplicadas.
3. Se houver risco de exposicao, remover temporariamente o dominio da Vercel ou promover deploy anterior.

### Cenario D: DNS/HTTPS falha

1. Manter o dominio antigo/hosting anterior ativo ate HTTPS estar validado.
2. Corrigir records DNS.
3. Aguardar propagacao.
4. Confirmar na Vercel que os dominios estao validos.

### Cenario E: E2E falha depois do go-live

1. Registar o erro exato.
2. Confirmar se falha esta em:
   - Vercel env vars
   - Supabase schema/cache
   - CRM auth
   - DNS/HTTPS
3. Promover ultimo deploy estavel se houver impacto em leads reais.
4. Corrigir em staging/local.
5. Reexecutar teste completo antes de novo deploy.

## Ordem recomendada de execucao

1. Garantir migrations no Supabase de producao.
2. Criar projeto na Vercel e configurar env vars.
3. Fazer primeiro deploy em URL `.vercel.app`.
4. Validar E2E nesse URL.
5. Adicionar `iaweb.pt` e `www.iaweb.pt`.
6. Configurar DNS.
7. Validar HTTPS.
8. Reexecutar E2E em `https://iaweb.pt`.
9. Declarar go-live.
