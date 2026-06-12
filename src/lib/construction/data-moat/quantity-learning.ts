import { normalizeQuantityRecord } from "./quantity-normalization"
import type { QuantityNormalizationResult, QuantityRecordInput } from "./quantity-types"

export type QuantityLearningInput = {
  records: QuantityRecordInput[]
}

export type QuantityLearningOutput = {
  recordsReceived: number
  recordsNormalized: number
  averageNormalizationConfidence: number
  normalizations: QuantityNormalizationResult[]
}

export function buildQuantityLearningFoundation(input: QuantityLearningInput): QuantityLearningOutput {
  const normalizations = input.records.map((record) => normalizeQuantityRecord(record))
  const confidentNormalizations = normalizations.filter((normalization) => normalization.material)
  const averageNormalizationConfidence = normalizations.length
    ? Math.round(normalizations.reduce((total, normalization) => total + normalization.normalizationConfidence, 0) / normalizations.length)
    : 0

  return {
    recordsReceived: input.records.length,
    recordsNormalized: confidentNormalizations.length,
    averageNormalizationConfidence,
    normalizations,
  }
}

export function normalizeQuantityLine(record: QuantityRecordInput) {
  return normalizeQuantityRecord(record)
}
