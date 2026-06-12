import { calculateCostConfidence } from "./cost-confidence"
import type { LineCostEstimate } from "./line-cost-engine"

export type SpecialtyCostEstimate = {
  id: string
  projectId: string
  specialtyId: string
  country: "Portugal" | "Franca" | "Espanha"
  typology: string
  costMin: number
  costProv: number
  costMax: number
  costPerM2Min: number | null
  costPerM2Prov: number | null
  costPerM2Max: number | null
  coverageRatio: number
  lineCount: number
  uncostedLines: number
  costConfidenceSpecialty: number
  exactMatchRatio: number
}

export function estimateSpecialtyCost(input: {
  projectId: string
  specialtyId: string
  country: "Portugal" | "Franca" | "Espanha"
  typology: string
  areaM2Basis?: number | null
  lines: LineCostEstimate[]
}): SpecialtyCostEstimate {
  const costed = input.lines.filter((line) => line.costProv !== null)
  const uncostedLines = input.lines.length - costed.length
  const coverageRatio = ratio(costed.length, input.lines.length)
  const exactMatchRatio = ratio(costed.filter((line) => line.exactMatch).length, input.lines.length)
  const avgLineConfidence = average(costed.map((line) => line.costConfidenceLine))
  const avgLinkConfidence = average(costed.map((line) => line.linkConfidence))
  const confidence = calculateCostConfidence({
    quantityConfidence: avgLineConfidence,
    priceConfidence: avgLineConfidence,
    linkConfidence: avgLinkConfidence,
    coverageRatio,
    priceFreshnessScore: 1,
  })
  const costMin = sum(costed.map((line) => line.costMin ?? 0))
  const costProv = sum(costed.map((line) => line.costProv ?? 0))
  const costMax = sum(costed.map((line) => line.costMax ?? 0))

  return {
    id: `specialty-cost-${input.projectId}-${input.specialtyId}`,
    projectId: input.projectId,
    specialtyId: input.specialtyId,
    country: input.country,
    typology: input.typology,
    costMin,
    costProv,
    costMax,
    costPerM2Min: perM2(costMin, input.areaM2Basis),
    costPerM2Prov: perM2(costProv, input.areaM2Basis),
    costPerM2Max: perM2(costMax, input.areaM2Basis),
    coverageRatio,
    lineCount: input.lines.length,
    uncostedLines,
    costConfidenceSpecialty: confidence.ccScore,
    exactMatchRatio,
  }
}

function sum(values: number[]) {
  return Math.round(values.reduce((total, value) => total + value, 0))
}

function perM2(value: number, area?: number | null) {
  return area ? Math.round(value / area) : null
}

function ratio(part: number, total: number) {
  return total ? Math.round((part / total) * 10000) / 10000 : 0
}

function average(values: number[]) {
  return values.length ? values.reduce((total, value) => total + value, 0) / values.length : 0
}
