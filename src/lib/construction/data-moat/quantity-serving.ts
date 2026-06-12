import { buildQuantityBenchmark, type QuantityBenchmark, type QuantityServingSegmentLevel } from "./quantity-benchmarks"
import type { QuantityPattern } from "./quantity-patterns"

export type QuantityBenchmarkSegment = {
  id: string
  requestId: string
  projectId: string
  requestedSegment: string
  servedSegment: string
  segmentLevelUsed: QuantityServingSegmentLevel
  fallbackReason: string | null
  servedAt: string
}

export type QuantityServingRequest = {
  requestId: string
  projectId: string
  requestedSegment: string
  country: "Portugal" | "Franca" | "Espanha"
  specialtyId: string
  unitType: string
  allowCrossCountry?: boolean
}

export type QuantityServingResult = {
  benchmark: QuantityBenchmark
  benchmarkSegment: QuantityBenchmarkSegment
  rulesApplied: string[]
}

const minPatternConfidenceByLevel: Record<QuantityServingSegmentLevel, number> = {
  primary: 0.72,
  secondary: 0.66,
  tertiary: 0.58,
  fallback: 0.5,
}

export function serveQuantityBenchmark(request: QuantityServingRequest, patterns: QuantityPattern[]): QuantityServingResult {
  const candidates = patterns
    .filter((pattern) => pattern.specialtyId === request.specialtyId && pattern.unitType === request.unitType)
    .map((pattern) => ({ pattern, level: segmentLevel(request, pattern) }))
    .sort((left, right) => levelRank(left.level) - levelRank(right.level) || right.pattern.patternConfidence - left.pattern.patternConfidence)
  const selected = candidates.find((candidate) =>
    passesMinimumConfidence(candidate.pattern, candidate.level)
    && (request.allowCrossCountry || candidate.pattern.country === request.country),
  ) ?? candidates[0]

  if (!selected) {
    const emptyPattern = emptyFallbackPattern(request)
    return buildServingResult(request, emptyPattern, "fallback", "no_pattern_available", ["REGRA-01: PC minima bloqueou serving"])
  }

  const warnings = servingWarnings(request, selected.pattern, selected.level)
  const blockedReason = rollbackReason(selected.pattern) ?? blockedReasonFor(selected.pattern, selected.level)
  const fallbackReason = selected.pattern.segmentKey === request.requestedSegment ? null : `REGRA-02: segment degradation para ${selected.level}`

  return buildServingResult(request, selected.pattern, selected.level, fallbackReason ?? blockedReason, warnings, blockedReason)
}

function buildServingResult(
  request: QuantityServingRequest,
  pattern: QuantityPattern,
  level: QuantityServingSegmentLevel,
  fallbackReason: string | null,
  warnings: string[],
  blockedReason?: string | null,
): QuantityServingResult {
  const benchmark = buildQuantityBenchmark({
    pattern,
    servingSegmentLevel: level,
    warnings,
    blockedReason: blockedReason ?? blockedReasonFor(pattern, level),
  })

  return {
    benchmark,
    benchmarkSegment: {
      id: `qty-segment-${request.requestId}`,
      requestId: request.requestId,
      projectId: request.projectId,
      requestedSegment: request.requestedSegment,
      servedSegment: pattern.segmentKey,
      segmentLevelUsed: level,
      fallbackReason,
      servedAt: new Date().toISOString(),
    },
    rulesApplied: appliedRules(request, pattern, level, warnings, benchmark.servingBlocked),
  }
}

function segmentLevel(request: QuantityServingRequest, pattern: QuantityPattern): QuantityServingSegmentLevel {
  if (pattern.segmentKey === request.requestedSegment && pattern.country === request.country) return "primary"
  if (pattern.country === request.country && pattern.typology && request.requestedSegment.includes(pattern.typology)) return "secondary"
  if (pattern.country === request.country) return "tertiary"
  return "fallback"
}

function passesMinimumConfidence(pattern: QuantityPattern, level: QuantityServingSegmentLevel) {
  return pattern.patternConfidence >= minPatternConfidenceByLevel[level]
}

function blockedReasonFor(pattern: QuantityPattern, level: QuantityServingSegmentLevel) {
  if (!passesMinimumConfidence(pattern, level)) return "REGRA-01: pattern_confidence abaixo do minimo"
  return null
}

function rollbackReason(pattern: QuantityPattern) {
  if (pattern.sampleCount > 0 && pattern.p50 <= 0) return "REGRA-07: rollback por percentil invalido"
  if (pattern.cvPct > 120) return "REGRA-07: rollback por variancia extrema"
  return null
}

function servingWarnings(request: QuantityServingRequest, pattern: QuantityPattern, level: QuantityServingSegmentLevel) {
  const warnings: string[] = []
  if (level !== "primary") warnings.push("REGRA-02: segment degradation aplicada")
  if (pattern.highVarianceFlag) warnings.push("REGRA-03: high variance warning")
  if (pattern.sampleCount < 10) warnings.push("REGRA-04: low sample warning")
  if (pattern.stale) warnings.push("REGRA-05: stale warning")
  warnings.push("REGRA-06: serving por percentis p10/p25/p50/p75/p90")
  if (pattern.country !== request.country) warnings.push("REGRA-08: cross-country warning")
  return warnings
}

function appliedRules(
  request: QuantityServingRequest,
  pattern: QuantityPattern,
  level: QuantityServingSegmentLevel,
  warnings: string[],
  blocked: boolean,
) {
  const rules = ["REGRA-01", "REGRA-06"]
  if (level !== "primary") rules.push("REGRA-02")
  if (warnings.some((warning) => warning.includes("high variance"))) rules.push("REGRA-03")
  if (warnings.some((warning) => warning.includes("low sample"))) rules.push("REGRA-04")
  if (warnings.some((warning) => warning.includes("stale"))) rules.push("REGRA-05")
  if (blocked) rules.push("REGRA-07")
  if (pattern.country !== request.country) rules.push("REGRA-08")
  return Array.from(new Set(rules))
}

function emptyFallbackPattern(request: QuantityServingRequest): QuantityPattern {
  return {
    id: `empty-${request.requestId}`,
    segmentKey: "fallback:none",
    typology: "unknown",
    country: request.country,
    specialtyId: request.specialtyId,
    unitType: request.unitType === "m2" || request.unitType === "m3" || request.unitType === "m" || request.unitType === "kg" || request.unitType === "vg" || request.unitType === "conj" ? request.unitType : "un",
    scaleClass: "small",
    sampleCount: 0,
    patternStatus: "seed",
    p10: 0,
    p25: 0,
    p50: 0,
    p75: 0,
    p90: 0,
    mean: 0,
    stdDev: 0,
    cvPct: 0,
    patternConfidence: 0,
    highVarianceFlag: false,
    stale: false,
  }
}

function levelRank(level: QuantityServingSegmentLevel) {
  if (level === "primary") return 1
  if (level === "secondary") return 2
  if (level === "tertiary") return 3
  return 4
}
