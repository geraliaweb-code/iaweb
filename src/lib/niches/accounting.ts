import type { NicheEngine } from "./types"

export const accountingNiche: NicheEngine = {
  id: "contabilidade",
  label: "Contabilidade",
  pains: [
    "Servicos parecem comoditizados e comparados apenas por preco.",
    "Empresarios nao percebem diferencas entre contabilidade operacional e apoio estrategico.",
    "Pedidos chegam sem segmentacao por tipo de empresa.",
  ],
  opportunities: [
    "Posicionar a contabilidade como parceiro de gestao.",
    "Criar funil por tipo de cliente: empresario, PME, independente.",
    "Automatizar pedidos e recolha inicial de documentos.",
  ],
  objections: [
    "Contabilidade e um servico de confianca, nao de marketing.",
    "Clientes chegam por indicacao.",
    "Nao queremos muitos leads desqualificados.",
  ],
  salesArguments: [
    "Um funil bem desenhado filtra e educa antes do contacto.",
    "A proposta certa reduz comparacao por preco.",
    "Automacao de pedidos iniciais poupa tempo administrativo.",
  ],
  estimatedRoi: "EUR 2.000-20.000/mes em clientes recorrentes que podem perder-se para gabinetes mais claros digitalmente.",
  keywords: ["contabilidade", "TOC", "gabinete contabilidade", "apoio empresas", "contabilidade PME"],
  personalizedDiagnosis:
    "Gabinetes de contabilidade ganham quando deixam de vender apenas cumprimento fiscal e passam a comunicar previsibilidade, apoio e acompanhamento.",
}
