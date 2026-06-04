# IAWEB Construction Intelligence - Deploy & E2E Checklist

Este checklist prepara o modulo Construction Intelligence para validacao real em Vercel/Supabase sem alterar as rotas existentes do IAWEB.

## 1. Variaveis de ambiente

Configurar em Vercel, no projeto de producao:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
CONSTRUCTION_AI_MODEL=gpt-4o-mini
```

Regras:
- `OPENAI_API_KEY` deve existir apenas no servidor/Vercel, nunca no frontend.
- `SUPABASE_SERVICE_ROLE_KEY` deve existir apenas no servidor/Vercel.
- `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` podem ser publicas.
- `CONSTRUCTION_AI_MODEL` e opcional; se ficar vazio, o modulo usa o modelo default definido no codigo.

## 2. Supabase

Antes do deploy ou antes do primeiro teste real:

- Aplicar `supabase/construction_foundation.sql` no SQL Editor do Supabase.
- Confirmar tabelas:
  - `construction_organizations`
  - `construction_projects`
  - `construction_files`
  - `construction_detected_documents`
  - `construction_detected_elements`
  - `construction_scores`
  - `construction_risks`
  - `construction_estimates`
  - `construction_reports`
  - `construction_subscriptions`
  - `construction_benchmarks`
- Confirmar bucket Storage `construction-files`.
- Confirmar que as policies/storage permitem escrita via service role.
- Confirmar que o anon key nao permite acesso indevido a ficheiros privados.
- Confirmar que `construction_detected_documents` tem:
  - `ai_analysis_status`
  - `ai_summary`
  - `detected_entities`

## 3. Rotas antigas que nao podem quebrar

Validar em producao depois do deploy:

- `/demo`
- `/crm`
- `/diagnostico`
- `/proposta`
- `/simulador-site`

Resultado esperado:
- A pagina abre sem erro 500.
- Layout principal continua consistente.
- Fluxos existentes nao foram substituidos por componentes Construction.

## 4. Rotas Construction

Validar em producao depois do deploy:

- `/construction`
- `/construction/dashboard`
- `/construction/projects/new`
- `/construction/projects/demo`

Resultado esperado:
- Landing premium abre com CTA.
- Dashboard mostra dados reais ou empty state.
- Formulario de novo projeto cria projeto no Supabase.
- Projeto demo abre sem depender de Supabase.

## 5. E2E real obrigatorio

Executar num projeto real:

1. Abrir `/construction`.
2. Clicar em `Criar novo projeto`.
3. Criar projeto com:
   - nome
   - tipo de obra
   - pais
   - cidade
   - area estimada
   - tipo de cliente
4. Confirmar que o projeto aparece no dashboard.
5. Abrir o projeto criado.
6. Na aba `Uploads`, enviar pelo menos:
   - 1 PDF
   - 1 XLS/XLSX ou DOCX
   - 1 imagem ou ZIP tecnico
7. Confirmar ficheiros em `construction_files`.
8. Confirmar objetos no bucket `construction-files`.
9. Clicar em `Analisar Documentos`.
10. Confirmar:
    - status dos ficheiros muda para `analyzed` ou `failed`.
    - resultados em `construction_detected_documents`.
    - `ai_analysis_status` mostra `success`, `fallback` ou `not_configured`.
11. Gerar `Health Check`.
12. Confirmar:
    - `construction_scores`
    - `construction_risks`
    - `construction_estimates`
13. Gerar `Benchmark`.
14. Confirmar linhas em `construction_benchmarks`.
15. Gerar PDF executivo.
16. Confirmar download do PDF e linha em `construction_reports`.

## 6. Teste de fallback IA

Executar dois cenarios:

- Com `OPENAI_API_KEY` configurada:
  - esperado: `ai_analysis_status = success` quando a API responder corretamente.
- Sem `OPENAI_API_KEY` ou com falha temporaria:
  - esperado: classificacao por regras locais.
  - esperado: `ai_analysis_status = not_configured` ou `fallback`.
  - esperado: fluxo nao quebra.

## 7. Estados de erro a validar

Forcar ou simular:

- Supabase sem credenciais.
- Projeto inexistente.
- Upload com tipo nao permitido.
- Upload acima do limite.
- Falha no bucket `construction-files`.
- Falha na API de IA.
- Health Check sem documentos.
- Benchmark sem Health Check.
- PDF antes de existirem scores/estimativas.

Resultado esperado:
- Mensagem clara.
- Botao de retry quando aplicavel.
- Nenhum crash de pagina.

## 8. Riscos de producao

- Policies de Storage demasiado abertas podem expor ficheiros tecnicos.
- `SUPABASE_SERVICE_ROLE_KEY` no frontend seria critico; manter apenas server-side.
- Custos da API de IA podem crescer se forem enviados muitos ficheiros em lote.
- Sem OCR pesado, a IA V2 classifica por filename, MIME, extensao e metadata; nao deve ser vendida como leitura integral de conteudo.
- Sem autenticao multi-tenant final, dados reais devem ser usados apenas em ambiente controlado.
- PDFs e estimativas sao indicativos, nao orcamentos finais.

## 9. Criterios para demo comercial

Antes de apresentar a cliente:

- Build Vercel verde.
- Migration aplicada.
- Bucket confirmado.
- Projeto demo abre.
- Projeto real criado.
- Upload real testado.
- Document Intelligence testado com IA e fallback.
- Health Check gerado.
- Benchmark gerado.
- PDF descarregado e visualmente revisto.
- Rotas antigas validadas.
