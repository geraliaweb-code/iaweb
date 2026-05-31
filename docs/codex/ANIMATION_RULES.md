# Animation Rules

## Principio

Animacao deve ajudar percecao, hierarquia e feedback. Nunca deve parecer truque barato nem atrasar a leitura.

## Uso permitido

- Entrada subtil de secoes.
- Hover suave em botoes e cards.
- Indicadores de progresso.
- Transicoes entre estados.
- Microinteracoes em formularios.
- Feedback visual apos acao.

## Duracao

- Microinteracoes: 120ms a 200ms.
- Transicoes de layout: 180ms a 280ms.
- Entradas de secao: 250ms a 450ms.

Evitar animacoes lentas acima de 600ms, exceto em momentos muito especificos.

## Easing

Usar curvas suaves e naturais.

Evitar movimentos elasticos, saltitantes ou exagerados em interfaces comerciais premium.

## Scroll

Animações no scroll devem ser subtis:

- Pequena subida.
- Fade leve.
- Revelacao progressiva controlada.

Nunca esconder informacao essencial atras de animacao obrigatoria.

## Hover

Hover deve comunicar interacao:

- Leve mudanca de cor.
- Borda mais evidente.
- Elevacao minima.
- Setas ou icones com movimento pequeno.

## Performance

Animar preferencialmente:

- Opacity.
- Transform.

Evitar animar:

- Width.
- Height.
- Top.
- Left.
- Propriedades que causem layout shift.

## Acessibilidade

Respeitar preferencias de reducao de movimento.

Se o utilizador preferir menos movimento, remover animacoes decorativas e manter apenas feedback essencial.

## Regra final

Se a animacao chama mais atencao para si do que para a mensagem, deve ser reduzida ou removida.
