import type { QuantityPattern } from "./quantity-patterns"

export type QuantityServingSegmentLevel = "primary" | "secondary" | "tertiary" | "fallback"

export type QuantityBenchmark = {
  id: string
  patternId: string
  servingSegmentLevel: QuantityServingSegmentLevel
  benchmarkConfidence: number
  servingBlocked: boolean
  blockedReason: string | null
  warnings: string[]
  sampleCount: number
  outlierCount: number
  percentiles: {
    p10: number
    p25: number
    p50: number
    p75: number
    p90: number
  }
}

export type LearningSignalQty = {
  id: string
  signalType: "pattern_created" | "pattern_updated" | "benchmark_served" | "rollback_triggered"
  projectId: string | null
  specialtyId: string
  affectedPatterns: string[]
  deltaP50Pct: number
  deltaConfidence: number
  triggeredAt: string
  processedAt: string | null
  actionTaken: string
}

export function buildQuantityBenchmark(input: {
  pattern: QuantityPattern
  servingSegmentLevel: QuantityServingSegmentLevel
  warnings?: string[]
  blockedReason?: string | null
  outlierCount?: number
}): QuantityBenchmark {
  const warnings = input.warnings ?? []
  const servingBlocked = Boolean(input.blockedReason)

  return {
    id: `qb-${input.pattern.id}-${input.servingSegmentLevel}`,
    patternId: input.pattern.id,
    servingSegmentLevel: input.servingSegmentLevel,
    benchmarkConfidence: input.pattern.patternConfidence,
    servingBlocked,
    blockedReason: input.blockedReason ?? null,
    warnings,
    sampleCount: input.pattern.sampleCount,
    outlierCount: input.outlierCount ?? estimateOutlierCount(input.pattern),
    percentiles: {
      p10: input.pattern.p10,
      p25: input.pattern.p25,
      p50: input.pattern.p50,
      p75: input.pattern.p75,
      p90: input.pattern.p90,
    },
  }
}

export function createQuantityLearningSignal(input: {
  signalType: LearningSignalQty["signalType"]
  projectId?: string | null
  specialtyId: string
  affectedPatterns: string[]
  previousP50?: number | null
  nextP50: number
  previousConfidence?: number | null
  nextConfidence: number
  actionTaken: string
  triggeredAt?: string
}) {
  const triggeredAt = input.triggeredAt ?? new Date().toISOString()
  const deltaP50Pct = input.previousP50 && input.previousP50 !== 0
    ? Math.round(((input.nextP50 - input.previousP50) / input.previousP50) * 10000) / 100
    : 0
  const deltaConfidence = Math.round(((input.nextConfidence - (input.previousConfidence ?? input.nextConfidence)) * 10000)) / 10000

  return {
    id: `qty-signal-${input.signalType}-${triggeredAt}`,
    signalType: input.signalType,
    projectId: input.projectId ?? null,
    specialtyId: input.specialtyId,
    affectedPatterns: input.affectedPatterns,
    deltaP50Pct,
    deltaConfidence,
    triggeredAt,
    processedAt: null,
    actionTaken: input.actionTaken,
  } satisfies LearningSignalQty
}

function estimateOutlierCount(pattern: QuantityPattern) {
  return pattern.highVarianceFlag ? Math.max(1, Math.round(pattern.sampleCount * 0.08)) : 0
}
