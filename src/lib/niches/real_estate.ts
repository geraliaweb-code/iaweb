import type { NicheEngine } from "./types"

export const realEstateNiche: NicheEngine = {
  id: "imobiliario",
  label: "Imobiliario",
  pains: [
    "Leads chegam pouco qualificados e muitas vezes sem urgencia real.",
    "Imoveis e servicos parecem iguais aos da concorrencia.",
    "Proprietarios nao percebem porque devem confiar a angariacao.",
  ],
  opportunities: [
    "Criar pagina de avaliacao gratuita para captar proprietarios.",
    "Mostrar metodo de venda e prova de resultados.",
    "Segmentar compradores, vendedores e investidores com CTAs diferentes.",
  ],
  objections: [
    "Usamos portais imobiliarios.",
    "A marca pessoal ja gera contactos.",
    "O mercado esta dependente dos imoveis disponiveis.",
  ],
  salesArguments: [
    "Portais geram visibilidade, mas nao constroem ativo proprio de leads.",
    "Uma pagina de avaliacao capta proprietarios antes da concorrencia.",
    "Prova e metodo aumentam confianca em transacoes de alto valor.",
  ],
  estimatedRoi: "EUR 3.000-30.000/mes em comissoes potenciais que podem escapar por falta de captacao propria.",
  keywords: ["avaliacao imovel", "comprar casa", "vender casa", "consultor imobiliario", "imobiliaria local"],
  personalizedDiagnosis:
    "No imobiliario, o maior ganho esta em converter reputacao e procura local num funil proprio de compradores e proprietarios.",
}
