import { buildSupplierRecommendations, type SupplierRecommendation, type SupplierRecommendationResult } from "../supplier-intelligence"
import type { PlannedMaterial, PlannedSupplier } from "./types"

function asRecommendationResult(value: SupplierRecommendationResult | SupplierRecommendation | null | undefined): SupplierRecommendationResult | null {
  if (!value) return null
  if ("primarySupplier" in value) return value

  return {
    primarySupplier: value,
    alternativeSuppliers: [],
    estimatedCostImpact: value.estimatedCostImpact ?? null,
    segment: value.segment,
    coverage: { countries: [], regions: value.coverage },
  }
}

export function planSuppliers(input: {
  country?: string | null
  material: PlannedMaterial
  supplierRecommendations?: Record<string, SupplierRecommendationResult | SupplierRecommendation | null>
}): PlannedSupplier {
  const recommendationKey = input.material.category
  const existing = asRecommendationResult(input.supplierRecommendations?.[recommendationKey] ?? input.supplierRecommendations?.[input.material.specialty])
  const recommendationResult = existing ?? buildSupplierRecommendations({
    country: input.country,
    specialty: input.material.specialty,
    materialCategory: input.material.category,
  })
  const primary = recommendationResult.primarySupplier
  const sourceSupplier = input.material.sourceLine.supplierName
  const supplier = sourceSupplier ?? primary?.supplierName ?? "Fornecedor a definir"
  const alternatives = recommendationResult.alternativeSuppliers
    .map((item) => item.supplierName)
    .filter((name) => name !== supplier)
  if (primary?.supplierName && primary.supplierName !== supplier) alternatives.unshift(primary.supplierName)

  return {
    supplier,
    alternativeSuppliers: Array.from(new Set(alternatives)).slice(0, 3),
    recommendation: primary,
    recommendationResult,
  }
}
