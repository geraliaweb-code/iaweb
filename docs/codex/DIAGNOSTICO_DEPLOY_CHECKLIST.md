# Diagnostico Deploy Checklist

## Objetivo

Checklist operacional para colocar o Diagnostico Digital Gratuito em producao com seguranca, garantindo formulario, API, Supabase, persistencia, responsividade, conversao e validacao final.

## Estado Atual da Implementacao

Rotas existentes:

- Pagina: `/diagnostico`.
- API: `/api/diagnostico`.

Ficheiros relevantes:

- `src/app/diagnostico/page.tsx`.
- `src/app/diagnostico/DiagnosticoDigital.tsx`.
- `src/app/api/diagnostico/route.ts`.
- `src/lib/diagnostico.ts`.
- `supabase/diagnostico_digital_leads.sql`.

Estado de alinhamento:

A API e o SQL usam os mesmos campos para persistencia: `score_total`, `score_website`, `score_google`, `score_conversao`, `score_automacao`, `classificacao`, `potencial_estimado` e `recomendacoes`.

## 1. Configuracao Supabase

- Criar ou confirmar projeto Supabase de producao.
- Confirmar URL do projeto.
- Confirmar chave `service_role` para uso apenas no servidor.
- Confirmar que a tabela `diagnostico_digital_leads` existe no schema `public`.
- Confirmar que os tipos dos campos correspondem ao payload inserido pela API.
- Confirmar politicas de RLS conforme estrategia.
- Se usar `SUPABASE_SERVICE_ROLE_KEY`, manter RLS ativo e fazer escrita apenas pelo endpoint server-side.
- Nunca expor `SUPABASE_SERVICE_ROLE_KEY` no browser.

## 2. Variaveis de Ambiente

Obrigatorias em producao:

- `NEXT_PUBLIC_SUPABASE_URL`.
- `SUPABASE_SERVICE_ROLE_KEY`.

Checklist:

- Definir variaveis no ambiente de deploy.
- Definir variaveis em `.env.local` para teste local.
- Confirmar que `SUPABASE_SERVICE_ROLE_KEY` nao aparece em codigo client-side.
- Confirmar que a app reinicia apos alterar variaveis.
- Testar API sem variaveis e confirmar erro controlado.
- Testar API com variaveis corretas e confirmar persistencia.

## 3. Execucao do SQL

Ficheiro:

- `supabase/diagnostico_digital_leads.sql`.
- `supabase/diagnosticos_full_schema.sql`.

Passos:

1. Abrir SQL Editor no Supabase.
2. Executar o ficheiro completo `supabase/diagnostico_digital_leads.sql`.
3. Executar o ficheiro completo `supabase/diagnosticos_full_schema.sql`.
4. Confirmar criacao da extensao `pgcrypto`.
5. Confirmar criacao da tabela `public.diagnostico_digital_leads`.
6. Confirmar criacao ou estabilizacao da tabela `public.diagnosticos`.
7. Confirmar indices:
   - `diagnostico_digital_leads_created_at_idx`.
   - `diagnostico_digital_leads_email_idx`.
   - `diagnostico_digital_leads_whatsapp_idx`.
   - `diagnostico_digital_leads_score_total_idx`.
   - `diagnosticos_created_at_idx`.
   - `diagnosticos_status_idx`.
   - `diagnosticos_score_geral_idx`.
8. Confirmar constraints de score entre 0 e 100.

Confirmar que a API insere exatamente estes campos:

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
- `created_at`.

Confirmar que o CRM usa estes campos em `public.diagnosticos`:

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

## 4. Testes Locais

Comandos:

- `npm run build`.
- `npm run dev`.

Checklist:

- Abrir `http://localhost:3000/diagnostico`.
- Confirmar que a pagina carrega sem erro.
- Confirmar que o hero aparece corretamente.
- Confirmar que o formulario aparece completo.
- Confirmar campos obrigatorios:
  - Nome.
  - Empresa.
  - Email.
  - WhatsApp.
  - Website.
  - Setor.
  - Objetivo.
- Submeter formulario vazio e confirmar validacao.
- Submeter email invalido e confirmar erro.
- Submeter dados validos e confirmar estado loading.
- Confirmar que resultado so aparece apos resposta da API.

## 5. Testes de API

Endpoint:

- `POST /api/diagnostico`.

Payload minimo:

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

Checklist:

- Confirmar status `200` com payload valido.
- Confirmar status `400` com campos em falta.
- Confirmar status `400` com email invalido.
- Confirmar status `500` se Supabase nao estiver configurado.
- Confirmar que a resposta inclui:
  - `scoreFinal`.
  - `categorias`.
  - `classificacao`.
  - `potencialEstimado`.
  - `recomendacoes`.
  - `createdAt`.
  - `id`.
- Confirmar que `id` corresponde ao registo criado no Supabase.

## 6. Testes Mobile

Breakpoints a validar:

- Mobile pequeno: 360px.
- Mobile comum: 390px.
- Tablet: 768px.
- Desktop: 1280px+.

Checklist:

- Nao existe overflow horizontal.
- Hero e formulario cabem de forma natural.
- CTAs ficam tocaveis.
- Campos têm altura confortavel.
- Selects funcionam em mobile.
- Mensagens de erro nao quebram layout.
- Resultado com barras de progresso fica legivel.
- CTA "Agendar Diagnostico Estrategico Gratuito" aparece claro.
- A pagina continua rapida e sem saltos bruscos.

## 7. Testes de Conversao

Checklist:

- CTA principal da pagina: `Receber Diagnostico Gratuito`.
- CTA do formulario: `Gerar diagnostico`.
- CTA pos-resultado: `Agendar Diagnostico Estrategico Gratuito`.
- Confirmar que o valor do diagnostico fica claro antes do formulario.
- Confirmar que "Guardado no CRM" nao promete algo falso se Supabase/CRM nao estiver ativo.
- Confirmar que o potencial estimado aparece como intervalo, nao promessa absoluta.
- Confirmar que o WhatsApp de agendamento abre corretamente.
- Confirmar tracking futuro dos eventos:
  - `diagnostic_form_start`.
  - `diagnostic_form_submit`.
  - `diagnostic_score_generated`.
  - `strategic_diagnostic_cta_click`.
  - `crm_lead_created`.

## 8. Testes de Persistencia

Checklist:

- Submeter lead teste.
- Confirmar que a lead aparece no Supabase.
- Confirmar `created_at`.
- Confirmar dados pessoais:
  - nome.
  - empresa.
  - email.
  - whatsapp.
  - website.
  - setor.
  - objetivo.
- Confirmar scores:
  - score total ou score final.
  - website.
  - google.
  - conversao.
  - automacao.
- Confirmar classificacao.
- Confirmar potencial estimado.
- Confirmar recomendacoes em JSON/JSONB.
- Confirmar que leads duplicadas podem ser analisadas por email ou WhatsApp.
- Confirmar que erro de Supabase nao mostra resultado ao utilizador.

## 9. Deploy

Checklist pre-deploy:

- Build local passa.
- SQL executado em producao.
- Schema alinhado com API.
- Variaveis de ambiente definidas.
- URL de WhatsApp confirmada.
- Textos principais revistos.
- Nao existem secrets no frontend.

Checklist deploy:

- Fazer deploy no ambiente escolhido.
- Confirmar que `/diagnostico` fica acessivel.
- Confirmar que `/api/diagnostico` responde apenas a POST.
- Confirmar logs do deploy.
- Confirmar que nao ha erros de TypeScript.
- Confirmar que nao ha warnings criticos.

## 10. Validacao Final

Fluxo completo:

1. Abrir pagina em producao.
2. Preencher formulario com dados reais de teste.
3. Submeter.
4. Confirmar loading.
5. Confirmar registo no Supabase.
6. Confirmar resultado visual.
7. Confirmar scores individuais.
8. Confirmar classificacao.
9. Confirmar potencial estimado.
10. Confirmar recomendacoes.
11. Clicar em `Agendar Diagnostico Estrategico Gratuito`.
12. Confirmar abertura do WhatsApp.

Critérios de aprovacao:

- A lead e guardada antes do resultado aparecer.
- O resultado aparece sem erro.
- O design parece premium, claro e responsivo.
- A experiencia mobile e utilizavel.
- O CTA final leva para agendamento.
- A equipa consegue ver a lead no Supabase.

## Go/No-Go

Go:

- Build passa.
- Supabase grava corretamente.
- Schema e API estao alinhados.
- Resultado aparece apos persistencia.
- Mobile validado.
- CTA de agendamento testado.

No-Go:

- API falha ao gravar no Supabase.
- Resultado aparece sem persistencia.
- Campos SQL nao correspondem ao payload da API.
- Variaveis de ambiente ausentes.
- Mobile com overflow ou formulario dificil de usar.
- CTA final nao funciona.
