import type { MarketSegment } from "./types"

export const marketSegments: MarketSegment[] = [
  { niche: "construcao", label: "Construcao", defaultTicket: 8000, keywords: ["remodelacoes", "obras", "orcamentos"] },
  { niche: "clinicas", label: "Clinicas", defaultTicket: 750, keywords: ["clinica", "marcacao", "tratamentos"] },
  { niche: "imobiliario", label: "Imobiliario", defaultTicket: 5000, keywords: ["imobiliaria", "imoveis", "avaliacao"] },
  { niche: "restaurantes", label: "Restaurantes", defaultTicket: 35, keywords: ["restaurante", "reservas", "menu"] },
  { niche: "advocacia", label: "Advogados", defaultTicket: 1200, keywords: ["advogado", "consulta", "juridico"] },
  { niche: "contabilidade", label: "Contabilistas", defaultTicket: 450, keywords: ["contabilidade", "fiscalidade", "empresas"] },
]

export function getMarketSegment(niche: string) {
  return marketSegments.find((segment) => segment.niche === niche) ?? marketSegments[0]
}
