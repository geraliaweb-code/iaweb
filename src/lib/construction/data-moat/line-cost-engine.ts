import { calculateCostConfidence, priceFreshnessScore } from "./cost-confidence"
import { linkQuantityToPrice, type QpLinkResult, type QpMaterialCost } from "./qp-linking"
import type { QuantityNormalizationResult } from "./quantity-types"

export type LineCostEstimate = {
  id: string
  quantityRecordId: string
  materialCostId: string | null
  linkType: QpLinkResult["linkType"]
  linkConfidence: number
  qUsed: number
  pUsed: number
  qSource: string
  pSource: string
  costMin: number | null
  costProv: number | null
  costMax: number | null
  currency: "EUR"
  costConfidenceLine: number
  uncostedReason: string | null
  exactMatch: boolean
  antiFalsePrecisionRules: string[]
}

export function estimateLineCost(input: {
  quantity: QuantityNormalizationResult
  prices: QpMaterialCost[]
  country: "Portugal" | "Franca" | "Espanha"
  typology: string
  quantityPercentiles?: { p10: number; p50: number; p90: number }
  pricePercentiles?: { p10: number; p50: number; p90: number }
  now?: Date
}): LineCostEstimate {
  const link = linkQuantityToPrice(input)
  const rules = ["FP-01", "FP-02", "FP-06", "FP-07"]
  if (!link.materialCost) {
    return {
      id: `line-cost-${input.quantity.recordId}`,
      quantityRecordId: input.quantity.recordId,
      materialCostId: null,
      linkType: "NO_LINK",
      linkConfidence: 0,
      qUsed: input.quantity.normalizedQuantity,
      pUsed: 0,
      qSource: "quantity_normalizations",
      pSource: "material_costs",
      costMin: null,
      costProv: null,
      costMax: null,
      currency: "EUR",
      costConfidenceLine: 0,
      uncostedReason: link.uncostedReason ?? "no_link",
      exactMatch: false,
      antiFalsePrecisionRules: [...rules, "FP-05"],
    }
  }

  const price = link.materialCost.unit_cost
  const q = input.quantityPercentiles ?? conservativeQuantityRange(input.quantity.normalizedQuantity)
  const p = input.pricePercentiles ?? conservativePriceRange(price, link.linkConfidence)
  const freshness = priceFreshnessScore(link.materialCost.valid_from, input.now)
  const confidence = calculateCostConfidence({
    quantityConfidence: input.quantity.normalizationConfidence,
    priceConfidence: 80,
    linkConfidence: link.linkConfidence,
    coverageRatio: 1,
    priceFreshnessScore: freshness,
  })

  return {
    id: `line-cost-${input.quantity.recordId}`,
    quantityRecordId: input.quantity.recordId,
    materialCostId: link.materialCost.id,
    linkType: link.linkType,
    linkConfidence: link.linkConfidence,
    qUsed: q.p50,
    pUsed: p.p50,
    qSource: "quantity_normalizations",
    pSource: "material_costs",
    costMin: roundEuro(q.p10 * p.p10),
    costProv: roundEuro(q.p50 * p.p50),
    costMax: roundEuro(q.p90 * p.p90),
    currency: "EUR",
    costConfidenceLine: confidence.ccScore,
    uncostedReason: null,
    exactMatch: link.linkType === "EXACT",
    antiFalsePrecisionRules: rules,
  }
}

function conservativeQuantityRange(quantity: number) {
  return {
    p10: quantity * 0.9,
    p50: quantity,
    p90: quantity * 1.12,
  }
}

function conservativePriceRange(price: number, linkConfidence: number) {
  const spread = linkConfidence >= 1 ? 0.08 : linkConfidence >= 0.75 ? 0.14 : linkConfidence >= 0.5 ? 0.22 : 0.32
  return {
    p10: price * (1 - spread),
    p50: price,
    p90: price * (1 + spread),
  }
}

function roundEuro(value: number) {
  return Math.round(value)
}
