# E2E CRM Test

## Objetivo

Validar manualmente o fluxo real da IAWEB:

Diagnostico -> Supabase -> CRM -> Status -> WhatsApp copiado.

## Pre-condicoes

- `.env.local` configurado com `NEXT_PUBLIC_SUPABASE_URL`.
- `.env.local` configurado com `SUPABASE_SERVICE_ROLE_KEY`.
- Servidor local reiniciado depois de alterar variaveis.
- No Supabase SQL Editor, executar por esta ordem:
  1. `supabase/diagnostico_digital_leads.sql`
  2. `supabase/diagnosticos_full_schema.sql`
- Confirmar que existem as tabelas:
  - `public.diagnostico_digital_leads`
  - `public.diagnosticos`

## Dados de teste

Usar uma lead nova para cada teste:

- Nome: `Teste IAWEB CRM`
- Empresa: `Empresa E2E IAWEB`
- Email: `teste.e2e+crm@iaweb.pt`
- WhatsApp: `+351 912 345 678`
- Website: `https://empresa-e2e.pt`
- Setor: `Consultoria / Servicos B2B`
- Objetivo: `Mais contactos`

## 1. Diagnostico no frontend

1. Abrir `http://localhost:3000/diagnostico`.
2. Preencher todos os campos.
3. Submeter o formulario.
4. Confirmar estado de loading.
5. Confirmar que o resultado aparece.
6. Confirmar que o resultado mostra:
   - score geral
   - scores por categoria
   - classificacao
   - potencial estimado
   - recomendacoes

Resultado esperado:

- A pagina nao mostra erro.
- O resultado so aparece depois de `/api/diagnostico` responder com sucesso.

## 2. Supabase: tabela diagnostico_digital_leads

No Supabase Table Editor, abrir `public.diagnostico_digital_leads`.

Confirmar nova linha com:

- `nome`
- `empresa`
- `email`
- `whatsapp`
- `website`
- `setor`
- `objetivo`
- `score_total`
- `score_website`
- `score_google`
- `score_conversao`
- `score_automacao`
- `classificacao`
- `potencial_estimado`
- `recomendacoes`
- `created_at`

Resultado esperado:

- A lead existe.
- `score_total` esta entre 0 e 100.
- `recomendacoes` contem JSON valido.

## 3. Supabase: tabela diagnosticos

No Supabase Table Editor, abrir `public.diagnosticos`.

Confirmar nova linha ligada ao diagnostico:

- `diagnostico_digital_lead_id` preenchido
- `empresa`
- `nome_contacto`
- `email`
- `telefone`
- `website`
- `setor`
- `objetivo`
- `score_geral`
- `score_website`
- `score_google`
- `score_conversao`
- `score_automacao`
- `classificacao`
- `potencial_estimado`
- `recomendacoes`
- `status`
- `whatsapp_message`
- `whatsapp_status`
- `created_at`
- `updated_at`

Resultado esperado:

- `status` = `novo`.
- `whatsapp_status` = `pendente`.
- `whatsapp_message` esta preenchida.
- `score_geral` corresponde ao `score_total` da tabela `diagnostico_digital_leads`.

## 4. CRM: leitura de leads

1. Abrir `http://localhost:3000/crm`.
2. Confirmar que a lead aparece na tabela.
3. Confirmar que aparecem:
   - empresa
   - contacto
   - email
   - telefone
   - website
   - score
   - prioridade
   - status
   - WhatsApp
   - data de criacao

Resultado esperado:

- A pagina carrega sem erro.
- As metricas no topo incluem a nova lead.
- O filtro `Novo` mostra a lead.

## 5. CRM: pesquisa e ordenacao

1. Pesquisar por `Empresa E2E IAWEB`.
2. Confirmar que a lead permanece visivel.
3. Pesquisar pelo email de teste.
4. Confirmar que a lead permanece visivel.
5. Pesquisar pelo telefone de teste.
6. Confirmar que a lead permanece visivel.
7. Ordenar por `Score maior`.
8. Ordenar por `Mais recentes`.

Resultado esperado:

- Pesquisa encontra a lead por empresa, email e telefone.
- Ordenacao nao remove nem duplica leads.

## 6. CRM: atualizar status

1. Na linha da lead, alterar status de `Novo` para `Contactado`.
2. Confirmar que a tabela atualiza sem erro.
3. No Supabase, confirmar que `public.diagnosticos.status` passou para `contactado`.
4. Voltar ao CRM e filtrar por `Contactado`.

Resultado esperado:

- A lead aparece no filtro `Contactado`.
- O campo `updated_at` e atualizado no Supabase.

## 7. CRM: copiar WhatsApp

1. Clicar em `Copiar WhatsApp`.
2. Confirmar que o botao mostra `Copiado`.
3. Colar a mensagem num editor local.

Resultado esperado:

- A mensagem copiada inclui:
  - nome do contacto
  - empresa
  - score geral
  - principal oportunidade
  - CTA suave para conversa
- Nenhum WhatsApp e enviado automaticamente.

## 8. Resultado final esperado

O teste passa quando:

- `/api/diagnostico` grava em `public.diagnostico_digital_leads`.
- `/api/diagnostico/lead` grava em `public.diagnosticos`.
- `/crm` lista a lead.
- O status e atualizado no Supabase.
- `whatsapp_message` aparece e pode ser copiada.

## Falhas comuns

- `public.diagnosticos` nao existe: executar `supabase/diagnosticos_full_schema.sql`.
- Erro de Supabase nao configurado: confirmar `.env.local`.
- Lead aparece no resultado mas nao no CRM: verificar logs de `/api/diagnostico/lead`.
- Botao de WhatsApp desativado: confirmar `whatsapp_message` em `public.diagnosticos`.
