import { roundCurrency, type ConstructionCostDatabaseCountry } from "../cost-database-v2"
import type { ConstructionCostBreakdownLine } from "../cost-engine-v2"
import type { BenchmarkV2CostPosition, BenchmarkV2SpecialtyComparison } from "./types"

const specialtyCostPerM2: Record<string, Record<ConstructionCostDatabaseCountry, number>> = {
  Estruturas: { Portugal: 430, Franca: 610, Espanha: 450 },
  Pintura: { Portugal: 38, Franca: 54, Espanha: 40 },
  ETICS: { Portugal: 78, Franca: 102, Espanha: 82 },
  Pladur: { Portugal: 64, Franca: 88, Espanha: 66 },
  Pavimentos: { Portugal: 74, Franca: 96, Espanha: 76 },
  Caixilharias: { Portugal: 168, Franca: 226, Espanha: 174 },
}

export function getSpecialtyMarketCostPerM2V2(specialty: string, country: ConstructionCostDatabaseCountry) {
  return specialtyCostPerM2[specialty]?.[country] ?? 80
}

export function differencePercentV2(projectValue: number, marketValue: number) {
  if (!marketValue) return 0
  return Math.round(((projectValue - marketValue) / marketValue) * 100)
}

export function resolveCostPositionV2(projectValue: number, marketValue: number): BenchmarkV2CostPosition {
  const difference = differencePercentV2(projectValue, marketValue)
  if (difference > 8) return "acima_da_media"
  if (difference < -8) return "abaixo_da_media"
  return "dentro_da_media"
}

export function buildSpecialtyComparisonsV2(input: {
  items: ConstructionCostBreakdownLine[]
  areaM2: number
  country: ConstructionCostDatabaseCountry
  locked: boolean
}): BenchmarkV2SpecialtyComparison[] {
  if (input.locked) return []

  return input.items.map((item) => {
    const projectCostPerM2 = roundCurrency(item.subtotal / input.areaM2)
    const marketCostPerM2 = getSpecialtyMarketCostPerM2V2(item.specialty, input.country)

    return {
      specialty: item.specialty,
      projectCost: item.subtotal,
      projectCostPerM2,
      marketCostPerM2,
      differencePercent: differencePercentV2(projectCostPerM2, marketCostPerM2),
      position: resolveCostPositionV2(projectCostPerM2, marketCostPerM2),
      isLocked: false,
    }
  })
}
