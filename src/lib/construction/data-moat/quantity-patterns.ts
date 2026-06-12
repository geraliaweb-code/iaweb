import { calculateQuantityPatternConfidence, type QuantityPatternMaturity } from "./quantity-confidence"
import type { QuantityNormalizationResult, QuantityProjectScaleClass, QuantityNormalizedUnit } from "./quantity-types"

export type QuantityType = "estimated" | "measured" | "executed"
export type QuantityAreaSource = "document" | "manual" | "inferred" | "unknown"
export type QuantityPatternStatus = QuantityPatternMaturity

export type SpecialtyQuantityInput = {
  id?: string
  projectId: string
  specialtyId: string
  country: "Portugal" | "Franca" | "Espanha"
  typology: string
  areaM2Basis?: number | null
  projectUnitCount?: number | null
  quantityType: QuantityType
  areaSource: QuantityAreaSource
  normalizations: QuantityNormalizationResult[]
}

export type SpecialtyQuantity = {
  id: string
  projectId: string
  specialtyId: string
  country: "Portugal" | "Franca" | "Espanha"
  typology: string
  unitType: QuantityNormalizedUnit
  totalQuantity: number
  areaM2Basis: number | null
  quantityPerM2: number | null
  quantityPerUnit: number | null
  lineCount: number
  completenessScore: number
  extractionConfidence: number
  normalizationConfidence: number
  specialtyQtyConfidence: number
  quantityType: QuantityType
  areaSource: QuantityAreaSource
}

export type QuantityPattern = {
  id: string
  segmentKey: string
  typology: string
  country: "Portugal" | "Franca" | "Espanha"
  specialtyId: string
  unitType: QuantityNormalizedUnit
  scaleClass: QuantityProjectScaleClass
  sampleCount: number
  patternStatus: QuantityPatternStatus
  p10: number
  p25: number
  p50: number
  p75: number
  p90: number
  mean: number
  stdDev: number
  cvPct: number
  patternConfidence: number
  highVarianceFlag: boolean
  stale: boolean
}

export type PatternObservation = {
  id: string
  patternId: string
  specialtyQtyId: string
  observationWeight: number
  includedInCalculation: boolean
  excludedReason: string | null
  observedAt: string
}

export function generateSpecialtyQuantity(input: SpecialtyQuantityInput): SpecialtyQuantity {
  const usable = input.normalizations.filter((normalization) =>
    normalization.material && !normalization.flags.includes("exclude_from_future_benchmarks"),
  )
  const unitType = usable[0]?.normalizedUnit ?? input.normalizations[0]?.normalizedUnit ?? "un"
  const sameUnit = usable.filter((normalization) => normalization.normalizedUnit === unitType)
  const totalQuantity = round(sameUnit.reduce((total, normalization) => total + normalization.normalizedQuantity, 0), 4)
  const lineCount = sameUnit.length
  const normalizationConfidence = average(sameUnit.map((normalization) => normalization.normalizationConfidence))
  const completenessScore = lineCount ? Math.min(100, 45 + lineCount * 8) : 0
  const extractionConfidence = normalizationConfidence ? Math.max(40, Math.min(100, normalizationConfidence - 4)) : 0
  const specialtyQtyConfidence = Math.round((completenessScore * 0.35) + (extractionConfidence * 0.25) + (normalizationConfidence * 0.4))
  const areaM2Basis = input.areaM2Basis ?? null
  const quantityPerM2 = areaM2Basis ? round(totalQuantity / areaM2Basis, 6) : null
  const quantityPerUnit = input.projectUnitCount ? round(totalQuantity / input.projectUnitCount, 6) : null

  return {
    id: input.id ?? `${input.projectId}-${input.specialtyId}-${unitType}`,
    projectId: input.projectId,
    specialtyId: input.specialtyId,
    country: input.country,
    typology: input.typology,
    unitType,
    totalQuantity,
    areaM2Basis,
    quantityPerM2,
    quantityPerUnit,
    lineCount,
    completenessScore,
    extractionConfidence,
    normalizationConfidence,
    specialtyQtyConfidence,
    quantityType: input.quantityType,
    areaSource: input.areaSource,
  }
}

export function generateQuantityPattern(input: {
  segmentKey: string
  typology: string
  country: "Portugal" | "Franca" | "Espanha"
  specialtyId: string
  unitType: QuantityNormalizedUnit
  scaleClass: QuantityProjectScaleClass
  specialtyQuantities: SpecialtyQuantity[]
  observedAt?: string
}): { pattern: QuantityPattern; observations: PatternObservation[] } {
  const included = input.specialtyQuantities.filter((quantity) =>
    quantity.unitType === input.unitType && quantity.quantityPerM2 !== null,
  )
  const values = included.map((quantity) => quantity.quantityPerM2 ?? 0).sort((a, b) => a - b)
  const meanValue = mean(values)
  const stdDev = standardDeviation(values, meanValue)
  const cvPct = meanValue ? round((stdDev / meanValue) * 100, 4) : 0
  const newestObservationAgeDays = 0
  const confidence = calculateQuantityPatternConfidence({
    sampleCount: values.length,
    completenessScore: average(included.map((quantity) => quantity.completenessScore)),
    extractionConfidence: average(included.map((quantity) => quantity.extractionConfidence)),
    normalizationConfidence: average(included.map((quantity) => quantity.normalizationConfidence)),
    coefficientVariationPct: cvPct,
    newestObservationAgeDays,
  })
  const patternId = `${input.segmentKey}-${input.specialtyId}-${input.unitType}`.toLowerCase()
  const observedAt = input.observedAt ?? new Date().toISOString()

  return {
    pattern: {
      id: patternId,
      segmentKey: input.segmentKey,
      typology: input.typology,
      country: input.country,
      specialtyId: input.specialtyId,
      unitType: input.unitType,
      scaleClass: input.scaleClass,
      sampleCount: values.length,
      patternStatus: confidence.maturity,
      p10: percentile(values, 10),
      p25: percentile(values, 25),
      p50: percentile(values, 50),
      p75: percentile(values, 75),
      p90: percentile(values, 90),
      mean: round(meanValue, 6),
      stdDev: round(stdDev, 6),
      cvPct,
      patternConfidence: confidence.patternConfidence,
      highVarianceFlag: cvPct > 35,
      stale: false,
    },
    observations: input.specialtyQuantities.map((quantity) => ({
      id: `${patternId}-${quantity.id}`,
      patternId,
      specialtyQtyId: quantity.id,
      observationWeight: observationWeight(quantity),
      includedInCalculation: included.some((includedQuantity) => includedQuantity.id === quantity.id),
      excludedReason: quantity.quantityPerM2 === null ? "missing_area_basis" : quantity.unitType !== input.unitType ? "unit_mismatch" : null,
      observedAt,
    })),
  }
}

export function percentile(values: number[], percentileValue: number) {
  if (!values.length) return 0
  const index = (percentileValue / 100) * (values.length - 1)
  const lower = Math.floor(index)
  const upper = Math.ceil(index)
  if (lower === upper) return round(values[lower] ?? 0, 6)
  const weight = index - lower
  return round((values[lower] ?? 0) * (1 - weight) + (values[upper] ?? 0) * weight, 6)
}

function observationWeight(quantity: SpecialtyQuantity) {
  const confidenceWeight = quantity.specialtyQtyConfidence / 100
  if (quantity.quantityType === "executed") return round(confidenceWeight, 4)
  if (quantity.quantityType === "measured") return round(confidenceWeight * 0.75, 4)
  return round(confidenceWeight * 0.45, 4)
}

function average(values: number[]) {
  return values.length ? Math.round(values.reduce((total, value) => total + value, 0) / values.length) : 0
}

function mean(values: number[]) {
  return values.length ? values.reduce((total, value) => total + value, 0) / values.length : 0
}

function standardDeviation(values: number[], meanValue: number) {
  if (values.length < 2) return 0
  const variance = values.reduce((total, value) => total + ((value - meanValue) ** 2), 0) / (values.length - 1)
  return Math.sqrt(variance)
}

function round(value: number, decimals: number) {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}
