# IAWEB Wireframe System

## Objetivo

Este documento define o wireframe estrategico completo da homepage da IAWEB. Nao e codigo, nao cria componentes e nao deve ser tratado como implementacao.

A homepage deve vender websites premium, automacao, CRM e IA para microempresas e PMEs, conduzindo o visitante para o Diagnostico Digital Gratuito e para a escolha entre projetos pontuais e planos mensais.

## Referencias de Direcao

O wireframe deve combinar principios inspirados em:

- Stripe: movimento fluido, narrativa visual de sistemas e composicao editorial forte.
- Linear: densidade elegante, foco, ritmo, precisao e UI limpa.
- Vercel: contraste tecnico premium, secções respiraveis e mensagens diretas.
- Framer: fluidez, transicoes subtis e sensacao de produto moderno.
- Notion: clareza, simplicidade, blocos bem organizados e leitura natural.

Nao copiar a aparencia destas marcas. Usar apenas o nivel de criterio: preciso, premium, funcional, leve e memoravel.

## Regras Globais do Wireframe

### Grelha

- Desktop: grelha de 12 colunas, largura maxima entre 1120px e 1240px.
- Tablet: grelha de 8 colunas, largura fluida com margens generosas.
- Mobile: grelha de 4 colunas, conteudo em coluna unica.

### Espaçamento

- Entre secoes desktop: 112px a 160px.
- Entre secoes tablet: 88px a 120px.
- Entre secoes mobile: 64px a 88px.
- Dentro de secoes: usar blocos com ritmo 16px, 24px, 32px, 48px e 64px.
- Evitar cards colados, mas tambem evitar vazio decorativo.

### Hierarquia Visual

Ordem de peso:

1. Headline.
2. Subheadline.
3. CTA principal.
4. Prova ou preco.
5. Visual de sistema.
6. Conteudo secundario.

### Ordem de Leitura

A leitura deve seguir uma diagonal natural em desktop: topo esquerdo para centro, depois visual de apoio, depois CTA. Em mobile, tudo deve ficar linear e inevitavel: promessa, prova, acao, explicacao.

### Anti-template

Evitar:

- Secoes todas com titulo centrado e tres cards.
- Alternancia previsivel imagem/texto em todas as dobras.
- Grelhas repetidas sem tensao visual.
- Cards iguais em todas as secoes.
- Blocos genericos que poderiam servir para qualquer agencia.

Usar:

- Composicoes assimetricas controladas.
- Secoes editoriais com elementos de produto.
- Blocos de diagnostico e sistema.
- Comparacoes visuais.
- Fluxos e timelines.
- Tabelas compactas quando ajudam decisao.

## Navbar

### Objetivo

Dar acesso rapido aos pontos de decisao sem roubar protagonismo ao hero.

### Layout Desktop

- Navbar sticky no topo, altura entre 64px e 76px.
- Logo IAWEB no lado esquerdo.
- Links centrados: Servicos, Planos, Como Funciona, Diagnostico, FAQ.
- CTA no lado direito: Receber Diagnostico Gratuito.
- Fundo branco semi-opaco com blur subtil apos scroll.
- Borda inferior muito subtil apenas quando a pagina estiver em scroll.

### Layout Tablet

- Logo esquerdo.
- Links principais reduzidos a 3 itens: Servicos, Planos, Diagnostico.
- CTA visivel no lado direito.
- Menu secundario opcional para FAQ e Como Funciona.

### Layout Mobile

- Logo esquerdo.
- Botao de menu direito.
- CTA sticky inferior assume a funcao principal.
- Menu mobile em painel simples, sem animacao teatral.

### Hierarquia e Posicao

O CTA deve ser sempre o elemento mais forte da navbar, mas nao deve competir com o H1 do hero.

### Animacoes

- Entrada inicial sem efeito ou com fade muito leve.
- Mudanca de estado no scroll em 180ms.
- Menu mobile abre com slide curto e opacity.

### Componentes Recomendados

- Logo.
- Nav links.
- Button primary small.
- Mobile menu panel.
- Scroll state.

## CTA Sticky

### Objetivo

Manter o caminho para diagnostico acessivel sem parecer agressivo.

### Desktop

- Nao usar barra sticky grande.
- Manter CTA na navbar.
- Opcional: pequeno botao flutuante discreto no canto inferior direito apenas apos 50% de scroll.

### Tablet

- CTA na navbar enquanto houver espaco.
- Em scroll profundo, pode aparecer botao compacto inferior: Receber Diagnostico Gratuito.

### Mobile

- Barra inferior sticky apos o hero.
- Texto: Receber Diagnostico Gratuito.
- Secundario opcional: Ver pacotes.
- Altura compacta, sem cobrir formularios.
- Deve desaparecer ou recolher quando o formulario principal estiver visivel.

### Animacoes

- Aparece com fade e translate pequeno.
- Esconde ao entrar na secao do formulario.
- Sem bounce.

## 1. Hero Section

### Layout Desktop

- Altura minima: 78vh a 92vh.
- Conteudo principal ocupa 6 a 7 colunas no lado esquerdo.
- Visual de sistema ocupa 5 a 6 colunas no lado direito, ligeiramente deslocado para baixo.
- O visual deve mostrar um preview do Diagnostico Digital Gratuito: score, categorias avaliadas, potencial estimado e CTA de agendamento.
- Linha de prova e precos abaixo dos CTAs.
- Badges acima ou abaixo da subheadline, nunca dispersos.
- Fundo limpo com textura quase imperceptivel ou linhas de grelha muito subtis.

### Layout Tablet

- Conteudo ocupa largura quase total.
- Visual passa para baixo em largura ampla.
- CTAs mantem-se lado a lado se houver espaco; caso contrario, empilhados.
- Badges em linha com wrap controlado.

### Layout Mobile

- Ordem: badge de categoria, H1, subheadline, CTAs, prova de preco, visual simplificado.
- H1 com maximo de 5 linhas.
- Visual nao deve empurrar o CTA para fora da primeira dobra em excesso.

### Posicao dos Elementos

1. Badge: "Websites premium para PMEs".
2. H1.
3. Subheadline.
4. CTAs, com o principal "Receber Diagnostico Gratuito".
5. Prova: "Projetos desde 299 EUR. Planos desde 99 EUR/mes."
6. Visual de sistema.

### Hierarquia Visual

H1 deve dominar. O visual serve para tangibilizar sistema, nao para decorar.

### Espaçamento

- Badge para H1: 16px.
- H1 para subheadline: 24px.
- Subheadline para CTAs: 32px.
- CTAs para prova: 20px.
- Conteudo para visual: 48px desktop, 32px mobile.

### Ordem de Leitura

Promessa, resultado, acao, prova, mecanismo visual.

### Comportamento das Animacoes

- H1 e subheadline entram primeiro.
- CTAs entram depois, sem atraso excessivo.
- Visual de sistema entra por camadas: Website, Google Business, SEO, Conversao, Automacao, Presenca Digital.
- Movimento maximo: 8px a 16px.

### Componentes Recomendados

- Hero copy block.
- Primary CTA.
- Secondary CTA.
- Trust/pricing strip.
- System dashboard visual.
- Capability badges.

## 2. Problema

### Layout Desktop

- Secao editorial assimetrica.
- Titulo grande em 6 colunas.
- Texto explicativo em 4 a 5 colunas alinhado a direita ou abaixo.
- Abaixo, um painel dividido: lado esquerdo "Como acontece hoje"; lado direito "Impacto no negocio".
- Em vez de muitos cards iguais, usar uma lista visual com linhas e estados.

### Layout Tablet

- Titulo em largura total.
- Painel dividido passa para duas colunas equilibradas.
- Lista de dores em blocos compactos.

### Layout Mobile

- Titulo, texto, lista de dores, CTA.
- Comparacao vira acordeao ou blocos empilhados.

### Posicao dos Elementos

1. Eyebrow: "O problema".
2. Titulo.
3. Texto curto.
4. Comparacao visual.
5. CTA "Avaliar o meu website".

### Hierarquia Visual

O titulo deve criar reconhecimento. A comparacao deve dar prova concreta.

### Espaçamento

- Titulo para texto: 24px.
- Texto para painel: 48px.
- Linhas internas do painel: 20px a 28px.

### Ordem de Leitura

Reconhecimento da dor, exemplos, impacto, acao.

### Comportamento das Animacoes

- A comparacao aparece linha a linha.
- Estados negativos podem usar pequenos indicadores, nunca vermelho agressivo.
- Hover mostra impacto: lead perdida, resposta tardia, follow-up ausente.

### Componentes Recomendados

- Editorial heading.
- Problem comparison panel.
- Status rows.
- Contextual CTA.

## 3. Solucao

### Layout Desktop

- Composicao inspirada em produto SaaS.
- Centro da secao: mapa de sistema com cinco nos: Website, Leads, CRM, Automacao, IA.
- Lado esquerdo: titulo e explicacao.
- Lado direito ou fundo: painel com fluxo de uma lead.
- Evitar cinco cards iguais. Usar um diagrama conectado.

### Layout Tablet

- Titulo em cima.
- Diagrama em duas linhas.
- Descricao de cada modulo abaixo em lista compacta.

### Layout Mobile

- Diagrama vira lista vertical numerada.
- Cada item mostra: modulo, funcao, impacto.
- A linha de fluxo torna-se uma narrativa curta.

### Posicao dos Elementos

1. Eyebrow: "A solucao IAWEB".
2. Titulo.
3. Texto.
4. Diagrama de sistema.
5. CTAs.

### Hierarquia Visual

O diagrama deve ser o centro da secao. O visitante deve perceber que a IAWEB vende sistema, nao pagina isolada.

### Espaçamento

- Titulo para texto: 20px.
- Texto para diagrama: 48px.
- Entre modulos: 16px a 24px.
- Diagrama para CTA: 32px.

### Ordem de Leitura

Sistema, modulos, impacto, proximo passo.

### Comportamento das Animacoes

- Modulos revelam em sequencia logica: Website, Leads, CRM, Automacao, IA.
- Conexoes aparecem depois dos modulos.
- No mobile, animacao reduzida a fade por item.

### Componentes Recomendados

- System map.
- Module node.
- Flow line.
- Impact caption.
- CTA group.

## 4. Como Funciona

### Layout Desktop

- Timeline horizontal com cinco etapas.
- Titulo alinhado a esquerda.
- Uma coluna lateral pequena mostra "resultado final": diagnostico, estrutura, implementacao, evolucao.
- Timeline nao deve parecer processo generico; cada etapa deve ter saida concreta.

### Layout Tablet

- Timeline em duas linhas ou vertical curta.
- Resultado final abaixo.

### Layout Mobile

- Timeline vertical.
- Cada etapa em bloco compacto.
- CTA no final.

### Posicao dos Elementos

1. Titulo.
2. Texto curto.
3. Timeline.
4. Resultado de cada etapa.
5. CTA.

### Hierarquia Visual

Numeros das etapas fortes, descricoes curtas, resultado destacado.

### Espaçamento

- Entre etapas desktop: 24px.
- Entre etapas mobile: 20px.
- Timeline para CTA: 40px.

### Ordem de Leitura

Diagnostico, estrategia, design e copy, implementacao, evolucao.

### Comportamento das Animacoes

- Linha progride ao scroll.
- Etapas aparecem quando a linha chega a cada ponto.
- Sem bloquear leitura se o utilizador fizer scroll rapido.

### Componentes Recomendados

- Process timeline.
- Step marker.
- Outcome chip.
- Process CTA.

## 5. Servicos

### Layout Desktop

- Secao de pricing editorial, nao grelha basica.
- Titulo e introducao no topo.
- Tres pacotes em composicao escalonada:
  - Landing Page Essential menor e focado.
  - Homepage Premium central como degrau visual.
  - Website Profissional mais largo, com destaque de valor.
- Abaixo, uma linha "Melhor proximo passo" liga cada projeto a um plano mensal.

### Layout Tablet

- Cards em grelha 2 + 1, com Website Profissional em largura total.
- Linha de proximo passo abaixo de cada card.

### Layout Mobile

- Cards em ordem de maturidade: Landing Page, Homepage, Website Profissional.
- Preco sempre visivel perto do titulo.
- Cada card termina com CTA.

### Posicao dos Elementos

1. Eyebrow: "Projetos".
2. Titulo.
3. Introducao.
4. Pacotes.
5. Linha de evolucao.
6. CTA de duvida.

### Hierarquia Visual

Website Profissional deve parecer a opcao mais completa, sem esconder as entradas de 299 EUR e 599 EUR.

### Espaçamento

- Titulo para cards: 48px.
- Padding dos cards: 28px a 40px.
- Entre cards: 20px a 28px.
- Cards para evolucao: 40px.

### Ordem de Leitura

Entrada simples, entrada premium, solucao completa, continuidade.

### Comportamento das Animacoes

- Cards entram de forma escalonada.
- Hover revela ou destaca "proximo passo".
- Evitar flip cards e efeitos de comparacao exagerados.

### Componentes Recomendados

- Pricing package card.
- Featured package treatment.
- Next-step connector.
- Comparison mini-row.
- CTA "Nao sei qual escolher".

## 6. Planos

### Layout Desktop

- Secao com duas camadas:
  - No topo, explicacao editorial sobre recorrencia.
  - Abaixo, planos mensais em tabela/camadas.
- Growth deve ficar no centro e receber destaque moderado.
- Tabela comparativa compacta em vez de blocos repetitivos longos.

### Layout Tablet

- Tres cards de plano em linha se couberem.
- Comparacao passa para tabela horizontal com scroll controlado ou acordeoes.

### Layout Mobile

- Cards empilhados.
- Tabela convertida em acordeao por plano.
- "Ideal para" aparece logo abaixo do preco.

### Posicao dos Elementos

1. Titulo.
2. Texto.
3. Cards Starter, Growth, Premium.
4. Comparacao de criterios.
5. CTA.

### Hierarquia Visual

O visitante deve perceber que os planos existem para manter e evoluir o sistema, nao apenas para suporte.

### Espaçamento

- Texto para cards: 40px.
- Cards para tabela: 32px.
- Linhas da tabela: 16px a 20px.

### Ordem de Leitura

Porque recorrencia, escolher nivel, comparar criterios, receber Diagnostico Gratuito.

### Comportamento das Animacoes

- Destaque do Growth aparece estatico, sem pulsar.
- Alternancia de tabs, se existir, em 180ms a 240ms.
- Acordeoes mobile sem layout shift brusco.

### Componentes Recomendados

- Subscription plan cards.
- Comparison matrix.
- Recommended badge.
- Plan CTA.

## 7. Diagnostico Digital Gratuito

### Layout Desktop

- Secao dividida em duas zonas fortes.
- Esquerda: promessa, categorias avaliadas, mini score e potencial estimado.
- Direita: formulario principal.
- O formulario deve parecer premium, simples e confiavel.
- Fundo pode ter uma banda clara para dar foco, sem parecer modal colado.
- Apos submissao, o painel deve poder mostrar resultado resumido e CTA para agendamento.

### Layout Tablet

- Promessa em cima.
- Categorias em grelha 2 colunas.
- Score preview abaixo das categorias.
- Formulario abaixo em largura controlada.

### Layout Mobile

- Promessa.
- Beneficios do diagnostico.
- Formulario.
- Resultado resumido apos submissao.
- Garantia de baixo compromisso.
- Campos grandes e em coluna unica.

### Posicao dos Elementos

1. Eyebrow: "Diagnostico Digital Gratuito".
2. Titulo.
3. Texto.
4. Categorias avaliadas.
5. Formulario.
6. Score preview.
7. Potencial estimado.
8. Nota de baixo compromisso.
9. CTA apos resultado.

### Hierarquia Visual

O formulario e o ponto de conversao principal da pagina. Deve ser destacado, mas sem parecer agressivo. O resultado do diagnostico deve parecer util imediatamente, mesmo antes da reuniao estrategica.

### Espaçamento

- Titulo para texto: 20px.
- Texto para categorias: 32px.
- Categorias para score preview: 24px.
- Score preview para formulario mobile: 32px.
- Entre campos: 14px a 18px.
- Formulario padding desktop: 32px a 40px.

### Ordem de Leitura

Promessa, valor da avaliacao, categorias, preenchimento, score, recomendacoes, CTA estrategico.

### Comportamento das Animacoes

- Campos com feedback imediato.
- Focus state claro.
- Erros aparecem junto ao campo.
- Loading no submit.
- Success state com score final, recomendacoes automaticas, potencial estimado e CTA "Agendar Diagnostico Estrategico Gratuito".

### Componentes Recomendados

- Lead magnet block.
- Diagnostic score preview.
- Main form.
- Result score panel.
- Recommendation list.
- CRM integration indicator.
- Form field group.
- Consent/low-commitment note.

## 8. Casos de Uso

### Layout Desktop

- Em vez de grelha simples de seis cards, usar painel com seletor.
- Esquerda: lista de setores prioritarios.
- Direita: painel dinamico com dor, solucao, pacote recomendado e plano provavel.
- Isto cria sensacao de produto consultivo, nao catalogo.

### Layout Tablet

- Setores em tabs horizontais.
- Painel de detalhe abaixo.

### Layout Mobile

- Filtros em scroll horizontal.
- Cada setor abre um bloco curto.
- Pacote recomendado sempre visivel.

### Posicao dos Elementos

1. Titulo.
2. Texto curto.
3. Seletor de setor.
4. Painel de detalhe.
5. CTA.

### Hierarquia Visual

O setor selecionado deve dominar. Os restantes devem funcionar como navegacao secundaria.

### Espaçamento

- Texto para seletor: 32px.
- Seletor para painel: 20px.
- Painel padding: 28px a 40px.

### Ordem de Leitura

Identificacao por setor, problema, solucao, caminho recomendado.

### Comportamento das Animacoes

- Troca de setor com fade curto.
- Sem recarregar a secao visualmente.
- Mobile usa acordeao simples.

### Componentes Recomendados

- Sector selector.
- Use-case detail panel.
- Recommended path badge.
- Sector CTA.

## 9. FAQ

### Layout Desktop

- Layout em duas colunas.
- Esquerda fixa dentro da secao: titulo, texto curto, CTA "Ainda tenho duvidas".
- Direita: acordeoes.
- Separar perguntas por categoria: Projetos, Planos, Processo, CRM/Automacao/IA.

### Layout Tablet

- Titulo em cima.
- Acordeoes em largura total.
- CTA apos blocos principais.

### Layout Mobile

- Uma coluna.
- Acordeoes compactos.
- CTA repetido a meio e no fim.

### Posicao dos Elementos

1. Titulo.
2. Texto curto.
3. Categorias.
4. Acordeoes.
5. CTA.

### Hierarquia Visual

Perguntas sobre preco e escolha de pacote devem aparecer antes das perguntas tecnicas.

### Espaçamento

- Entre categorias: 32px.
- Entre acordeoes: 8px a 12px.
- Padding de pergunta: 18px a 22px.

### Ordem de Leitura

Escolha de projeto, mensalidade, processo, tecnologia.

### Comportamento das Animacoes

- Acordeoes abrem em 180ms a 280ms.
- So um acordeao aberto por categoria, se isso reduzir ruido.
- Focus state visivel.

### Componentes Recomendados

- FAQ category group.
- Accordion.
- Inline CTA.

## 10. CTA Final

### Layout Desktop

- Bloco final amplo, editorial e memoravel.
- Titulo grande em 7 a 8 colunas.
- Resumo de caminhos em linha: 299 EUR, 599 EUR, 1290 EUR+, 99/299/599 EUR por mes.
- CTA principal e secundario abaixo.
- Visual pequeno de sistema ou diagnostico, sem competir com a mensagem.

### Layout Tablet

- Titulo em largura total.
- Resumo de caminhos em duas linhas.
- CTAs lado a lado ou empilhados.

### Layout Mobile

- Titulo curto.
- Texto de apoio.
- Lista compacta de caminhos.
- CTA principal.
- CTA secundario.

### Posicao dos Elementos

1. Titulo.
2. Texto.
3. Resumo de caminhos.
4. CTAs.
5. Micro slogan.

### Hierarquia Visual

O CTA final deve parecer conclusao natural, nao publicidade repetida.

### Espaçamento

- Titulo para texto: 20px.
- Texto para caminhos: 28px.
- Caminhos para CTAs: 32px.
- Secao para footer: 80px a 120px.

### Ordem de Leitura

Decisao, caminhos disponiveis, acao final.

### Comportamento das Animacoes

- Bloco entra com fade leve.
- Caminhos aparecem em sequencia curta.
- CTAs com hover claro.

### Componentes Recomendados

- Final CTA block.
- Price path strip.
- CTA group.
- Slogan line.

## Formulario Principal

### Objetivo

Captar leads qualificadas para o Diagnostico Gratuito.
O formulario principal deve alimentar o Diagnostico Digital Gratuito e criar uma oportunidade comercial no CRM.

### Campos

- Nome.
- Empresa.
- Email.
- WhatsApp.
- Website.
- Setor.
- Objetivo.

### Layout Desktop

- Card/painel com largura entre 420px e 520px.
- Nome e empresa podem ficar em duas colunas.
- Email e WhatsApp em duas colunas.
- Website em largura total.
- Setor como select.
- Objetivo como select ou opcoes curtas.
- CTA full width.

### Layout Tablet

- Largura maxima controlada.
- Campos em uma ou duas colunas conforme espaco.

### Layout Mobile

- Todos os campos em uma coluna.
- Labels visiveis.
- Inputs altos.
- CTA full width.

### Estados

- Empty.
- Focus.
- Error.
- Loading.
- Success.
- Disabled.

### Microcopy

- Nota abaixo do CTA: "Sem compromisso. Resposta personalizada."
- Mensagens de erro especificas e curtas.
- Success: "Pedido recebido. Vamos analisar e responder com o proximo passo."
- Success apos score: "Diagnostico gerado. Agora pode agendar o Diagnostico Estrategico Gratuito."

### Resultado do diagnostico

O resultado deve mostrar:

- Score final: Presenca Digital 62/100.
- Website: 70/100.
- Google Business: 45/100.
- SEO: pontuacao propria quando disponivel.
- Conversao: 55/100.
- Automacao: 10/100.
- Recomendacoes automaticas.
- Potencial estimado, por exemplo +15% a +35% mais contactos.
- CTA: Agendar Diagnostico Estrategico Gratuito.

### Integracao CRM

Cada submissao deve enviar para o CRM:

- Dados do formulario.
- Scores por categoria.
- Score final.
- Recomendacoes automaticas.
- Potencial estimado.
- Origem da lead.
- Proxima acao recomendada.

Pipeline visual recomendado:

1. Diagnostico Digital submetido.
2. Score gerado.
3. Lead qualificada.
4. Recomendacoes enviadas.
5. Diagnostico Estrategico Gratuito agendado.
6. Proposta recomendada.

## Lead Magnet

### Nome

Diagnostico Digital Gratuito.

### Promessa

Descubra onde a sua empresa esta a perder visibilidade, confianca, contactos e tempo.

### Representacao Visual

- Mini score com categorias: Website, Google Business, SEO, Conversao, Automacao, Presenca Digital.
- Preview de recomendacao: "Melhor proximo passo".
- Potencial estimado: "+15% a +35% mais contactos".
- Checklist visual com pontos avaliados.

### Posicionamento na Pagina

- Primeiro convite no hero.
- Reforco no problema.
- Secao propria apos planos.
- CTA final.
- CTA sticky em mobile.

### Comportamento

- Clicar em qualquer CTA de diagnostico leva para o formulario.
- Se o visitante estiver no mobile, scroll deve parar com o titulo e os primeiros campos visiveis.
- Quando formulario estiver visivel, CTA sticky deve recolher.
- Apos resultado, o CTA principal passa a ser "Agendar Diagnostico Estrategico Gratuito".

## Footer

### Objetivo

Fechar a experiencia com orientacao, credibilidade e acesso aos caminhos principais.

### Layout Desktop

- Quatro colunas:
  - Marca: IAWEB, slogan e pequena descricao.
  - Servicos: Landing Page, Homepage Premium, Website Profissional.
  - Planos: Starter, Growth, Premium.
  - Contacto: email, WhatsApp, Diagnostico Digital Gratuito, redes se existirem.
- Linha inferior com direitos, privacidade, termos e cookies.

### Layout Tablet

- Duas colunas.
- Marca ocupa linha superior.
- Links agrupados.

### Layout Mobile

- Uma coluna.
- Secoes em acordeao ou grupos curtos.
- CTA para Receber Diagnostico Gratuito antes dos links legais.

### Hierarquia Visual

O footer nao deve parecer despejo de links. Deve reforcar o posicionamento: websites premium, sistemas inteligentes, crescimento mais claro.

### Animacoes

- Sem animacoes obrigatorias.
- Hover discreto em links.

### Componentes Recomendados

- Footer brand block.
- Footer link groups.
- Footer CTA.
- Legal links.

## Sequencia Visual Completa

1. Navbar: orientacao e CTA.
2. Hero: promessa e prova.
3. Problema: reconhecimento.
4. Solucao: sistema IAWEB.
5. Como Funciona: reducao de risco.
6. Servicos: projetos pontuais.
7. Planos: continuidade mensal.
8. Diagnostico Digital Gratuito: conversao principal.
9. Casos de Uso: identificacao por setor.
10. FAQ: remocao de objecoes.
11. CTA Final: decisao.
12. Footer: orientacao final.

## Checklist Anti-Template

- A homepage tem pelo menos uma secao com diagrama de sistema.
- A secao de servicos nao e apenas tres cards iguais.
- A secao de casos de uso funciona como painel consultivo, nao grelha generica.
- O Diagnostico Digital Gratuito e tratado como produto de entrada, nao formulario escondido.
- A recorrencia mensal aparece como evolucao natural.
- O mobile tem ordem de leitura propria, nao apenas desktop encolhido.
- As animacoes ajudam compreensao e feedback.
- O visual nao usa decoracao sem funcao.

## Regra Final

O wireframe deve fazer a homepage parecer uma interface estrategica de crescimento, nao uma montra de agencia.

Cada dobra deve responder a uma pergunta do visitante:

- Isto e para mim?
- Que problema resolve?
- Como funciona?
- Quanto custa comecar?
- O que acontece depois?
- Qual e o proximo passo?
