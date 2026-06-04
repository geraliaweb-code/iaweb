import { getConstructionCountryProfile } from "../country-intelligence"
import { constructionMarketSegments, type ConstructionMarketSegment } from "./market-segments"

type ScenarioInput = {
  baseMin: number
  baseMax: number
  country?: string | null
  confidenceScore: number
}

function roundToHundreds(value: number) {
  return Math.round(value / 100) * 100
}

export function buildCostScenarios(input: ScenarioInput) {
  const profile = getConstructionCountryProfile(input.country)
  return (Object.keys(constructionMarketSegments) as ConstructionMarketSegment[]).map((id) => {
    const segment = constructionMarketSegments[id]
    const factor = (segment.materialFactor + segment.laborFactor) / 2
    const spread = segment.spread + Math.max(0, 70 - input.confidenceScore) / 500

    return {
      id,
      label: segment.label,
      min: roundToHundreds(input.baseMin * factor * (1 - spread)),
      max: roundToHundreds(input.baseMax * factor * (1 + spread)),
      confidenceScore: Math.max(0, Math.min(100, Math.round(input.confidenceScore - (id === "premium" ? 4 : id === "economic" ? 2 : 0)))),
      notes: [
        `Mercado tecnico: ${profile.label}`,
        `Materiais: ${segment.label}`,
        `Mao de obra e fornecedores ajustados ao mercado ${profile.label}.`,
      ],
    }
  })
}
