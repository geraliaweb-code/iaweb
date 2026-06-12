export type CostServingLevel = "internal_detail" | "internal_summary" | "blocked"

export type CostConfidenceInput = {
  quantityConfidence: number
  priceConfidence: number
  linkConfidence: number
  coverageRatio: number
  priceFreshnessScore: number
}

export type CostConfidenceScore = {
  ccScore: number
  qcComponent: number
  pcPComponent: number
  lcComponent: number
  cfComponent: number
  priceFreshnessScore: number
  servingLevel: CostServingLevel
}

export function calculateCostConfidence(input: CostConfidenceInput): CostConfidenceScore {
  const qcComponent = normalize(input.quantityConfidence)
  const pcPComponent = normalize(input.priceConfidence) * input.priceFreshnessScore
  const lcComponent = normalize(input.linkConfidence)
  const cfComponent = normalize(input.coverageRatio)
  const rawScore = (0.35 * qcComponent) + (0.35 * pcPComponent) + (0.2 * lcComponent) + (0.1 * cfComponent)
  const cappedScore = input.coverageRatio < 0.7 ? Math.min(rawScore, 0.65) : rawScore
  const ccScore = round(cappedScore, 4)

  return {
    ccScore,
    qcComponent: round(qcComponent, 4),
    pcPComponent: round(pcPComponent, 4),
    lcComponent: round(lcComponent, 4),
    cfComponent: round(cfComponent, 4),
    priceFreshnessScore: input.priceFreshnessScore,
    servingLevel: servingLevelFrom(ccScore),
  }
}

export function priceFreshnessScore(validFrom: string, now = new Date()) {
  const months = Math.max(0, monthDiff(new Date(validFrom), now))
  if (months <= 6) return 1
  if (months <= 12) return 0.85
  if (months <= 24) return 0.65
  return 0.4
}

export function servingLevelFrom(ccScore: number): CostServingLevel {
  if (ccScore < 0.45) return "blocked"
  if (ccScore < 0.7) return "internal_summary"
  return "internal_detail"
}

function normalize(value: number) {
  return value > 1 ? Math.max(0, Math.min(1, value / 100)) : Math.max(0, Math.min(1, value))
}

function monthDiff(from: Date, to: Date) {
  return (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth())
}

function round(value: number, decimals: number) {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}
