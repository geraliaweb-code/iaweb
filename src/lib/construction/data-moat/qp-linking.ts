import type { MaterialCostRow } from "./types"
import type { QuantityNormalizationResult } from "./quantity-types"

export type QpLinkType = "EXACT" | "FAMILY" | "TYPOLOGY" | "PROXY_COUNTRY" | "NO_LINK"

export type QpMaterialCost = MaterialCostRow & {
  canonical_name?: string | null
  category?: string | null
  typology?: string | null
  country?: "Portugal" | "Franca" | "Espanha" | null
}

export type QpLinkResult = {
  quantityRecordId: string
  materialCost: QpMaterialCost | null
  linkType: QpLinkType
  linkConfidence: number
  uncostedReason: string | null
}

export const qpLinkConfidence: Record<QpLinkType, number> = {
  EXACT: 1,
  FAMILY: 0.75,
  TYPOLOGY: 0.5,
  PROXY_COUNTRY: 0.35,
  NO_LINK: 0,
}

export function linkQuantityToPrice(input: {
  quantity: QuantityNormalizationResult
  prices: QpMaterialCost[]
  country: "Portugal" | "Franca" | "Espanha"
  typology: string
}): QpLinkResult {
  const material = input.quantity.material
  if (!material) return noLink(input.quantity.recordId, "material_not_normalized")

  const exact = input.prices.find((price) =>
    price.canonical_name === material.canonicalName && price.country === input.country,
  )
  if (exact) return link(input.quantity.recordId, exact, "EXACT")

  const family = input.prices.find((price) =>
    price.category === material.category && price.country === input.country,
  )
  if (family) return link(input.quantity.recordId, family, "FAMILY")

  const typology = input.prices.find((price) =>
    price.typology === input.typology && price.country === input.country,
  )
  if (typology) return link(input.quantity.recordId, typology, "TYPOLOGY")

  const proxyCountry = input.prices.find((price) =>
    price.canonical_name === material.canonicalName || price.category === material.category,
  )
  if (proxyCountry) return link(input.quantity.recordId, proxyCountry, "PROXY_COUNTRY")

  return noLink(input.quantity.recordId, "price_not_found")
}

function link(quantityRecordId: string, materialCost: QpMaterialCost, linkType: QpLinkType): QpLinkResult {
  return {
    quantityRecordId,
    materialCost,
    linkType,
    linkConfidence: qpLinkConfidence[linkType],
    uncostedReason: null,
  }
}

function noLink(quantityRecordId: string, uncostedReason: string): QpLinkResult {
  return {
    quantityRecordId,
    materialCost: null,
    linkType: "NO_LINK",
    linkConfidence: 0,
    uncostedReason,
  }
}
