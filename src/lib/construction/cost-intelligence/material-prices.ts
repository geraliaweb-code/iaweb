import type { ConstructionMarketSegment } from "./market-segments"

export const materialQualityBands: Record<ConstructionMarketSegment, string[]> = {
  economic: ["materiais standard", "solucoes correntes", "acabamentos economicos"],
  normal: ["materiais profissionais", "solucoes equilibradas", "acabamentos medios"],
  premium: ["materiais premium", "solucoes tecnicas superiores", "acabamentos elevados"],
}
