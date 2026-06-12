export type QuantityPatternMaturity =
  | "seed"
  | "candidate"
  | "emerging"
  | "established"
  | "mature"
  | "reference"

export type QuantityPatternConfidenceInput = {
  sampleCount: number
  completenessScore: number
  extractionConfidence: number
  normalizationConfidence: number
  coefficientVariationPct: number
  newestObservationAgeDays: number
}

export type QuantityPatternConfidenceBreakdown = {
  volume: number
  quality: number
  recency: number
  consistency: number
  patternConfidence: number
  maturity: QuantityPatternMaturity
}

export function calculateQuantityPatternConfidence(input: QuantityPatternConfidenceInput): QuantityPatternConfidenceBreakdown {
  const volume = volumeScore(input.sampleCount)
  const quality = averageScore([input.completenessScore, input.extractionConfidence, input.normalizationConfidence]) / 100
  const recency = recencyScore(input.newestObservationAgeDays)
  const consistency = consistencyScore(input.coefficientVariationPct)
  const rawConfidence = (0.35 * volume) + (0.4 * quality) + (0.15 * recency) + (0.1 * consistency)
  const cappedConfidence = input.sampleCount < 10 ? Math.min(rawConfidence, 0.85) : rawConfidence
  const patternConfidence = round(cappedConfidence, 4)

  return {
    volume: round(volume, 4),
    quality: round(quality, 4),
    recency: round(recency, 4),
    consistency: round(consistency, 4),
    patternConfidence,
    maturity: maturityFrom(input.sampleCount, patternConfidence),
  }
}

export function maturityFrom(sampleCount: number, patternConfidence: number): QuantityPatternMaturity {
  if (sampleCount >= 120 && patternConfidence >= 0.95) return "reference"
  if (sampleCount >= 60 && patternConfidence >= 0.9) return "mature"
  if (sampleCount >= 30 && patternConfidence >= 0.82) return "established"
  if (sampleCount >= 10 && patternConfidence >= 0.72) return "emerging"
  if (sampleCount >= 3 && patternConfidence >= 0.55) return "candidate"
  return "seed"
}

function volumeScore(sampleCount: number) {
  if (sampleCount >= 120) return 1
  if (sampleCount >= 60) return 0.9
  if (sampleCount >= 30) return 0.78
  if (sampleCount >= 10) return 0.62
  if (sampleCount >= 3) return 0.42
  return 0.22
}

function recencyScore(ageDays: number) {
  if (ageDays <= 30) return 1
  if (ageDays <= 90) return 0.85
  if (ageDays <= 180) return 0.7
  if (ageDays <= 365) return 0.55
  return 0.35
}

function consistencyScore(cvPct: number) {
  if (cvPct <= 10) return 1
  if (cvPct <= 20) return 0.85
  if (cvPct <= 35) return 0.68
  if (cvPct <= 50) return 0.48
  return 0.25
}

function averageScore(values: number[]) {
  return values.length ? values.reduce((total, value) => total + value, 0) / values.length : 0
}

function round(value: number, decimals: number) {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}
