export type ConstructionMarketSegment = "economic" | "normal" | "premium"

export const constructionMarketSegments: Record<ConstructionMarketSegment, { label: string; materialFactor: number; laborFactor: number; spread: number }> = {
  economic: { label: "Economico", materialFactor: 0.88, laborFactor: 0.92, spread: 0.08 },
  normal: { label: "Normal", materialFactor: 1, laborFactor: 1, spread: 0.12 },
  premium: { label: "Premium", materialFactor: 1.22, laborFactor: 1.18, spread: 0.18 },
}
