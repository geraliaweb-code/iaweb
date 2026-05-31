# IAWEB Visual System

## Objetivo

Este documento define o sistema visual definitivo da IAWEB antes da implementacao. Nao e codigo, nao altera a homepage e nao cria componentes.

O sistema visual deve fazer a IAWEB parecer uma empresa premium de websites, automacao, CRM e IA para PMEs: clara, confiavel, moderna, comercial e estruturada.

## Referencias Obrigatorias

As referencias abaixo devem orientar criterio visual, nao ser copiadas literalmente.

- Stripe: narrativa visual de sistemas, movimento fluido, interfaces conectadas e composicao editorial.
- Linear: precisao, densidade elegante, contraste subtil, foco e sensacao de produto premium.
- Vercel: clareza tecnica, uso forte de espaco, tipografia direta e contraste limpo.
- Framer: fluidez, microinteracoes suaves, visual moderno e ritmo visual dinamico.
- Notion: simplicidade, organizacao, leitura natural e blocos funcionais.

Direcao final:

IAWEB deve parecer uma combinacao de consultoria digital premium e produto SaaS claro, nunca uma agencia generica de templates.

## 1. Paleta de Cores

### Base

- Branco principal: #FFFFFF.
- Branco quente: #FAFAF8.
- Cinza fundo: #F5F7FA.
- Cinza superficie: #F8FAFC.
- Linha subtil: #E6EAF0.

### Texto

- Texto principal: #07111F.
- Texto secundario: #445166.
- Texto terciario: #6B7688.
- Texto inverso: #FFFFFF.

### Marca

- Azul profundo: #0B1F4D.
- Azul confianca: #145BFF.
- Ciano tecnico: #18B7FF.
- Azul suave: #EAF3FF.

### Estados

- Sucesso: #16A36A.
- Aviso: #D98A00.
- Erro: #D92D20.
- Info: #2563EB.

### Uso da cor

- O fundo deve ser predominantemente claro.
- Azul profundo deve ser usado para autoridade, navegacao, titulos especiais e blocos de alto impacto.
- Azul confianca deve ser usado para CTAs e estados ativos.
- Ciano tecnico deve aparecer apenas em detalhes, linhas de fluxo, highlights e indicadores.
- Verde deve ser reservado para sucesso, progresso e metricas positivas.

### Proibido

- Roxo dominante.
- Gradientes neon.
- Fundos escuros sem funcao.
- Vermelho agressivo para dores comerciais.
- Paletas bege, castanhas ou demasiado quentes.

## 2. Tipografia

### Direcao

A tipografia deve ser moderna, sans-serif, precisa e premium. Deve transmitir clareza empresarial e maturidade tecnica.

### Familias recomendadas

Preferencias:

- Inter.
- Geist.
- Satoshi.
- Manrope.
- Neue Haas Grotesk, se disponivel.

### Hierarquia

H1:

- Uso: promessa principal.
- Peso: 650 a 750.
- Tamanho desktop: 56px a 72px.
- Tamanho tablet: 44px a 56px.
- Tamanho mobile: 36px a 44px.
- Line-height: 0.98 a 1.08.

H2:

- Uso: secoes de decisao.
- Peso: 620 a 700.
- Tamanho desktop: 40px a 52px.
- Tamanho tablet: 34px a 42px.
- Tamanho mobile: 28px a 34px.
- Line-height: 1.05 a 1.15.

H3:

- Uso: cards, modulos, planos e etapas.
- Peso: 600 a 680.
- Tamanho desktop: 22px a 28px.
- Tamanho mobile: 20px a 24px.

Body:

- Tamanho desktop: 16px a 18px.
- Tamanho mobile: 16px.
- Line-height: 1.55 a 1.7.
- Cor: texto secundario.

Labels e badges:

- Tamanho: 12px a 14px.
- Peso: 550 a 650.
- Letter spacing: 0 ou ligeiramente positivo apenas em labels tecnicas.

### Regras

- Nunca usar tipografia decorativa.
- Nunca usar tracking negativo.
- Evitar titulos centrados em excesso.
- Titulos devem ser curtos, confiantes e comerciais.

## 3. Escala de Espacamento

### Escala base

- 4px: micro ajuste.
- 8px: separacao minima.
- 12px: labels e grupos pequenos.
- 16px: espaco padrao interno.
- 24px: grupos relacionados.
- 32px: separacao entre blocos.
- 48px: separacao media de conteudo.
- 64px: separacao forte.
- 88px: separacao mobile/tablet entre secoes.
- 120px: separacao desktop entre secoes.
- 160px: separacao editorial de grande impacto.

### Secoes

Desktop:

- Padding vertical: 112px a 160px.
- Padding horizontal: 32px a 48px.

Tablet:

- Padding vertical: 88px a 120px.
- Padding horizontal: 28px a 40px.

Mobile:

- Padding vertical: 64px a 88px.
- Padding horizontal: 20px a 24px.

### Regra

O espacamento deve criar sensacao de confianca. Conteudo apertado parece barato. Espaco excessivo sem funcao parece vazio.

## 4. Estilo de Botoes

### Botao primario

Uso:

- Pedir diagnostico.
- Solicitar proposta.
- Agendar chamada.

Visual:

- Fundo: azul confianca ou azul profundo.
- Texto: branco.
- Radius: 8px a 10px.
- Padding desktop: 12px 20px ou 14px 24px.
- Padding mobile: 14px 18px.
- Peso tipografico: 600.
- Sombra: minima ou nenhuma.

Hover:

- Fundo ligeiramente mais escuro.
- Elevar no maximo 1px a 2px.
- Transicao 160ms a 200ms.

Focus:

- Ring claro e acessivel.
- Nao remover outline sem alternativa.

### Botao secundario

Uso:

- Ver pacotes.
- Ver como funciona.
- Comparar planos.

Visual:

- Fundo: branco ou transparente.
- Texto: azul profundo ou texto principal.
- Borda: #D8DEE8.
- Radius igual ao primario.

Hover:

- Fundo: #F5F7FA.
- Borda ligeiramente mais forte.

### Botao ghost

Uso:

- Links contextuais.
- FAQ.
- Voltar a pacotes.

Visual:

- Sem fundo.
- Texto azul confianca ou texto principal.
- Setas discretas permitidas.

### Proibido

- Botoes com sombras pesadas.
- Gradientes fortes.
- Botoes pill demasiado arredondados se o resto do sistema for angular.
- Demasiados botoes primarios na mesma dobra.
- CTAs vagos como "Clique aqui".

## 5. Estilo de Formularios

### Direcao

Formularios devem parecer simples, seguros e premium. O formulario principal e parte do produto de entrada: Diagnostico Gratuito.

### Campos

- Altura desktop: 44px a 48px.
- Altura mobile: 48px a 52px.
- Radius: 8px.
- Borda: #D8DEE8.
- Fundo: #FFFFFF.
- Texto: #07111F.
- Placeholder: #8A94A6.

### Labels

- Sempre visiveis.
- Tamanho: 13px a 14px.
- Peso: 550.
- Cor: texto secundario.

### Focus

- Borda azul confianca.
- Ring azul suave.
- Transicao curta.

### Erro

- Mensagem junto ao campo.
- Borda erro apenas quando necessario.
- Texto de erro claro e curto.

### Success

- Estado final com confirmacao e proximo passo.
- Usar verde com moderacao.

### Layout

- Desktop: formulario em painel de 420px a 520px.
- Tablet: largura controlada.
- Mobile: uma coluna, CTA full width.

### Proibido

- Formularios longos no primeiro contacto.
- Placeholders como unica label.
- Campos com sombras pesadas.
- Mensagens genericas de erro.

## 6. Estilo de Cards

### Direcao

Cards devem estruturar decisao. Nunca devem existir apenas para preencher grelha.

### Card base

- Fundo: branco.
- Borda: 1px solid #E6EAF0.
- Radius: 8px a 12px.
- Padding: 24px a 40px.
- Sombra: nenhuma ou muito subtil.

### Cards de pricing

- Preco perto do titulo.
- Beneficio principal acima da lista.
- CTA no final.
- "Ideal para" visivel.
- Destaque de recomendado com borda ou badge, nao com brilho.

### Cards de modulo

- Usar para Website, Leads, CRM, Automacao e IA.
- Devem mostrar funcao e impacto.
- Podem ser ligados por linhas ou fluxo.

### Cards de casos de uso

- Evitar grelha generica.
- Preferir painel consultivo com seletor e detalhe.

### Hover

- Borda mais forte.
- Pequena elevacao.
- Fundo ligeiramente mais claro.
- Nada de transformacoes grandes.

### Proibido

- Cards repetidos em todas as secoes.
- Cards com icone grande, titulo e texto generico sem funcao.
- Sombras pesadas.
- Radius demasiado grande sem criterio.

## 7. Estilo de Icones

### Direcao

Icones devem ajudar leitura e orientacao. Devem parecer parte de uma interface premium, nao decoracao solta.

### Estilo

- Line icons.
- Stroke: 1.5px a 2px.
- Cantos arredondados.
- Tamanho comum: 18px, 20px, 24px.
- Cor: texto secundario, azul profundo ou azul confianca.

### Uso

- Navegacao secundaria.
- Estados de formulario.
- Modulos de sistema.
- Checklist.
- Pricing.
- FAQ.

### Proibido

- Icones 3D aleatorios.
- Icones coloridos sem sistema.
- Emoji como iconografia principal.
- Icones grandes para compensar falta de conteudo.

## 8. Estilo de Animacoes

### Principio

Animacao deve clarificar o sistema, orientar leitura e dar feedback. Se chama mais atencao para si do que para a mensagem, deve ser reduzida.

### Duracoes

- Hover: 120ms a 180ms.
- Microinteracoes: 160ms a 220ms.
- Transicoes de componentes: 180ms a 280ms.
- Entrada de secao: 250ms a 450ms.

### Movimento

- Translate maximo: 8px a 16px.
- Fade subtil.
- Linha de fluxo pode animar lentamente.
- Evitar parallax forte.

### Easing

- Suave e natural.
- Sem elasticidade exagerada.
- Sem bounce.

### Aplicacoes

- Hero: camadas do sistema entram em sequencia.
- Solucao: modulos conectam por linhas.
- Como funciona: timeline progride.
- Formulario: focus, erro, loading, success.
- FAQ: acordeoes suaves.

### Acessibilidade

Respeitar preferencia de reducao de movimento. Nesse caso, manter apenas feedback essencial.

## 9. Backgrounds

### Direcao

Backgrounds devem criar profundidade premium sem parecer decoracao barata.

### Tipos permitidos

- Fundo branco.
- Fundo branco quente.
- Cinza muito claro.
- Bandas horizontais subtis.
- Grelhas quase imperceptiveis.
- Linhas de sistema muito discretas.
- Gradiente tecnico muito subtil entre branco, azul suave e cinza claro.

### Hero

- Fundo claro com profundidade subtil.
- Visual de dashboard/sistema deve carregar complexidade visual.
- Nao usar fundo escuro dramatico como padrao.

### Secoes de foco

- Diagnostico pode usar banda clara.
- CTA final pode usar azul profundo ou fundo claro com tipografia forte.

### Proibido

- Orbs decorativos.
- Bokeh.
- Gradientes roxos.
- Fundos escuros com brilho artificial.
- Texturas pesadas.
- Imagens stock genericas de escritorio.

## 10. Grid System

### Desktop

- 12 colunas.
- Largura maxima: 1120px a 1240px.
- Gutter: 24px a 32px.
- Margens laterais: 32px a 48px.

### Tablet

- 8 colunas.
- Gutter: 20px a 24px.
- Margens laterais: 28px a 40px.

### Mobile

- 4 colunas.
- Gutter: 16px.
- Margens laterais: 20px a 24px.

### Composicao

Usar assimetria controlada:

- 7/5 no hero.
- 6/6 em comparacoes.
- 4/8 em FAQ.
- 5/7 em formulario de diagnostico.

Evitar secoes sempre centradas e sempre iguais.

## 11. Componentes Premium Recomendados

### Navegacao

- Navbar sticky com blur subtil.
- CTA de diagnostico sempre acessivel.
- Menu mobile simples e rapido.

### Hero

- Bloco editorial de promessa.
- Visual de sistema com website, lead, CRM, automacao e IA.
- Pricing strip discreta.
- Badges funcionais.

### Conversao

- Formulario premium de diagnostico.
- Mini score visual.
- CTA sticky mobile.
- Success state com proximo passo.

### Conteudo Comercial

- Pricing cards assimetricos.
- Tabela comparativa compacta.
- Linha de evolucao projeto para plano mensal.
- Setor selector para casos de uso.
- FAQ por categoria.

### Sistema

- Diagrama modular.
- Timeline de processo.
- Status rows.
- Flow lines.
- Outcome chips.

## 12. Componentes Proibidos

Proibido usar:

- Hero com imagem stock generica.
- Cards 3D.
- Icones 3D sem contexto.
- Carrossel automatico de testemunhos.
- Popups agressivos.
- Secoes com tres cards genericos repetidos.
- Botao primario em excesso.
- Pricing escondido.
- Formulario longo de primeira interacao.
- Secoes com texto centrado em todas as dobras.
- Mockups falsos que nao representam website, CRM, automacao ou IA.
- Animacoes que atrasam leitura.
- Gradientes decorativos sem funcao.

## Hero Visual Direction

O hero deve parecer uma interface estrategica de crescimento.

Elementos:

- Copy forte no lado esquerdo.
- Visual de sistema no lado direito.
- Interface com cards pequenos representando:
  - Website.
  - Lead captada.
  - CRM pipeline.
  - Follow-up automatizado.
  - IA pratica.
- Linhas subtis conectam os modulos.
- Precos de entrada aparecem como prova, nao como promocao.

Sensacao:

- Premium.
- Clara.
- Tecnologica.
- Comercial.
- Confiavel.

Evitar:

- Ilustracao abstrata.
- Pessoa a olhar para computador.
- Mockup bonito sem informacao.
- Fundo escuro pesado.

## CTA Visual Direction

CTAs devem parecer decisoes naturais, nao pressoes.

CTA principal:

- Azul confianca ou azul profundo.
- Texto direto.
- Tamanho generoso.
- Hover subtil.

CTA secundario:

- Borda clara.
- Fundo branco.
- Texto escuro.

CTA sticky mobile:

- Barra inferior compacta.
- Fundo branco com borda superior subtil.
- Botao principal full width ou com secundario pequeno.
- Deve recolher perto do formulario.

## Pricing Visual Direction

Pricing deve ser claro, comparavel e premium.

Projetos:

- Mostrar Landing Page Essential 299 EUR, Homepage Premium 599 EUR e Website Profissional 1290 EUR+.
- Composicao assimetrica.
- Website Profissional pode ter maior largura ou destaque.
- Cada pacote deve mostrar resultado esperado e proximo passo.

Planos:

- Mostrar Starter 99 EUR/mes, Growth 299 EUR/mes e Premium 599 EUR/mes.
- Growth deve ser visualmente recomendado.
- Comparacao deve ser compacta.
- Explicar que mensalidade e continuidade, evolucao e melhoria.

Evitar:

- Pricing confuso.
- Demasiados badges.
- Descontos agressivos.
- Tabelas enormes em mobile.

## Footer Visual Direction

O footer deve reforcar credibilidade, nao parecer fim abandonado da pagina.

Desktop:

- Quatro colunas.
- Bloco de marca com slogan.
- Links para servicos e planos.
- CTA para diagnostico.
- Links legais discretos.

Mobile:

- Uma coluna.
- CTA antes dos links legais.
- Grupos curtos ou acordeoes.

Visual:

- Fundo branco quente ou azul profundo.
- Se usar azul profundo, manter contraste alto e visual sobrio.
- Sem decoracao excessiva.

## Regra Final do Sistema Visual

Cada decisao visual deve aumentar pelo menos uma destas tres coisas:

- Confianca.
- Clareza.
- Conversao.

Se um elemento existe apenas para parecer moderno, deve sair. Se ajuda o visitante a entender, confiar ou agir, pertence ao sistema visual da IAWEB.
