import type { ConstructionTechnicalCountry } from "../types"
import { normalizeConstructionCountry } from "../country-intelligence"
import { constructionCostSegmentLabels, dominantCategoryByProjectType, type ConstructionCostCategory, type ConstructionCostSegment } from "./categories"
import { franceCostDatabase } from "./france"
import { getAverageLaborRate } from "./labor"
import { portugalCostDatabase, type CountryCostRange } from "./portugal"
import { spainCostDatabase } from "./spain"
import { getConstructionCostSuppliers } from "./suppliers"

const countryDatabases = {
  portugal: portugalCostDatabase,
  france: franceCostDatabase,
  spain: spainCostDatabase,
} satisfies Record<ConstructionTechnicalCountry, typeof portugalCostDatabase>

export type ConstructionMarketCostReference = {
  country: ConstructionTechnicalCountry
  segment: ConstructionCostSegment
  segmentLabel: string
  dominantCategory: ConstructionCostCategory
  range: CountryCostRange
  suppliers: string[]
  averageLaborRate: number
}

export function chooseCostSegment(input: {
  maturityScore: number
  riskScore: number
  complexityScore: number
  confidenceScore: number
}): ConstructionCostSegment {
  if (input.complexityScore >= 72 || input.riskScore >= 68) return "premium"
  if (input.maturityScore >= 72 && input.confidenceScore >= 68 && input.riskScore <= 45) return "normal"
  if (input.confidenceScore < 45 || input.maturityScore < 45) return "economic"
  return "normal"
}

export function getConstructionMarketCostReference(input: {
  country?: string | null
  projectType: string
  segment?: ConstructionCostSegment | null
  maturityScore: number
  riskScore: number
  complexityScore: number
  confidenceScore: number
}): ConstructionMarketCostReference {
  const country = normalizeConstructionCountry(input.country)
  const database = countryDatabases[country]
  const segment = input.segment ?? chooseCostSegment(input)
  const projectMatrix = database[input.projectType] ?? portugalCostDatabase[input.projectType] ?? portugalCostDatabase.moradia
  const range = projectMatrix[segment]
  const dominantCategory = dominantCategoryByProjectType[input.projectType] ?? "Estrutura"

  return {
    country,
    segment,
    segmentLabel: constructionCostSegmentLabels[segment],
    dominantCategory,
    range,
    suppliers: getConstructionCostSuppliers(country, 3),
    averageLaborRate: getAverageLaborRate(country, segment),
  }
}

export * from "./categories"
export * from "./blueprint"
export * from "./labor"
export * from "./suppliers"
export * from "./portugal"
export * from "./france"
export * from "./spain"
