# Supabase Setup Diagnostico

## Objetivo

Passo a passo para ligar o Diagnostico Digital Gratuito ao Supabase e validar que `/diagnostico` grava leads reais antes de devolver o resultado.

## 1. Criar Projeto Supabase

1. Entrar em `https://supabase.com`.
2. Criar novo projeto.
3. Escolher organizacao, nome do projeto e regiao.
4. Guardar a password da base de dados em local seguro.
5. Aguardar a conclusao do provisioning.

## 2. Executar SQL

1. Abrir o projeto Supabase.
2. Ir a `SQL Editor`.
3. Abrir e executar primeiro o ficheiro local:

`supabase/diagnostico_digital_leads.sql`

4. Copiar o SQL completo.
5. Executar no SQL Editor.
6. Abrir e executar depois o ficheiro local:

`supabase/diagnosticos_full_schema.sql`

7. Copiar o SQL completo.
8. Executar no SQL Editor.
9. Confirmar que as tabelas foram criadas:

`public.diagnostico_digital_leads`

`public.diagnosticos`

10. Confirmar indices:

- `diagnostico_digital_leads_created_at_idx`.
- `diagnostico_digital_leads_email_idx`.
- `diagnostico_digital_leads_whatsapp_idx`.
- `diagnostico_digital_leads_score_total_idx`.
- `diagnosticos_created_at_idx`.
- `diagnosticos_status_idx`.
- `diagnosticos_score_geral_idx`.

## 3. Copiar URL do Supabase

1. Ir a `Project Settings`.
2. Abrir `API`.
3. Copiar `Project URL`.
4. Guardar como:

```env
NEXT_PUBLIC_SUPABASE_URL=
```

## 4. Copiar Service Role Key

1. No mesmo ecran `API`, localizar `service_role`.
2. Copiar a chave.
3. Guardar apenas em ambiente server-side:

```env
SUPABASE_SERVICE_ROLE_KEY=
```

Regra de seguranca:

Nunca colocar `SUPABASE_SERVICE_ROLE_KEY` em codigo client-side, repositorios publicos, analytics, browser ou variaveis com prefixo `NEXT_PUBLIC_`.

## 5. Criar `.env.local`

Na raiz do projeto, criar:

```env
NEXT_PUBLIC_SUPABASE_URL=https://o-seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
```

O ficheiro `.env.example` deve ficar apenas como referencia, sem valores reais:

```env
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

Depois de criar ou alterar `.env.local`, reiniciar o servidor local.

## 6. Testar Localmente

Comandos:

```bash
npm run dev
```

Abrir:

`http://localhost:3000/diagnostico`

Preencher todos os campos:

- Nome.
- Empresa.
- Email.
- WhatsApp.
- Website.
- Setor.
- Objetivo.

Submeter e confirmar:

- Estado loading.
- Resultado aparece.
- Score total aparece.
- Scores individuais aparecem.
- Classificacao aparece.
- Potencial estimado aparece.
- Recomendacoes aparecem.

## 7. Validar Lead Gravada

No Supabase:

1. Ir a `Table Editor`.
2. Abrir `diagnostico_digital_leads`.
3. Confirmar nova linha.
4. Validar campos:

- `created_at`.
- `nome`.
- `empresa`.
- `email`.
- `whatsapp`.
- `website`.
- `setor`.
- `objetivo`.
- `score_total`.
- `score_website`.
- `score_google`.
- `score_conversao`.
- `score_automacao`.
- `classificacao`.
- `potencial_estimado`.
- `recomendacoes`.

Depois de o resultado ser guardado no CRM, abrir tambem `diagnosticos` e validar:

- `empresa`.
- `nome_contacto`.
- `email`.
- `telefone`.
- `website`.
- `score_geral`.
- `status`.
- `whatsapp_message`.
- `whatsapp_status`.
- `created_at`.

## 8. Testar API Diretamente

Enviar `POST` para:

`http://localhost:3000/api/diagnostico`

Payload exemplo:

```json
{
  "nome": "Joao Silva",
  "empresa": "Empresa Teste",
  "email": "joao@empresa.pt",
  "whatsapp": "+351 912 345 678",
  "website": "https://empresa.pt",
  "setor": "Consultoria / Servicos B2B",
  "objetivo": "Mais contactos"
}
```

Resposta esperada:

- `id`.
- `scoreFinal`.
- `categorias.website`.
- `categorias.google`.
- `categorias.conversao`.
- `categorias.automacao`.
- `classificacao`.
- `potencialEstimado`.
- `recomendacoes`.
- `createdAt`.

## 9. Erros Comuns

### Erro: Supabase nao esta configurado

Verificar:

- `.env.local` existe.
- `NEXT_PUBLIC_SUPABASE_URL` esta preenchido.
- `SUPABASE_SERVICE_ROLE_KEY` esta preenchido.
- Servidor local foi reiniciado.

### Erro: coluna nao existe

Verificar se o SQL executado e o endpoint usam os mesmos campos.

Campos esperados pela API:

- `score_total`.
- `score_website`.
- `score_google`.
- `score_conversao`.
- `score_automacao`.

### Resultado nao aparece

Por regra, o resultado so aparece depois da lead ser gravada. Se a gravacao falhar, corrigir Supabase antes de testar conversao.

## 10. Deploy

No ambiente de producao, configurar:

```env
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

Depois:

1. Fazer deploy.
2. Abrir `/diagnostico`.
3. Submeter lead real de teste.
4. Confirmar resultado.
5. Confirmar registo no Supabase.
6. Clicar em `Agendar Diagnostico Estrategico Gratuito`.
