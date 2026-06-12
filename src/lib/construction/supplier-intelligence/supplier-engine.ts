import type { EuropeanCostSegment } from "../datasets/europe"
import { normalizeSupplierCountry, resolveSupplierCoverage } from "./supplier-coverage"
import { matchSuppliers } from "./supplier-matching"
import { rankSuppliers } from "./supplier-ranking"
import type { SupplierRecommendationInput, SupplierRecommendationResult } from "./types"

function resolveResultSegment(primarySegment?: EuropeanCostSegment): EuropeanCostSegment {
  return primarySegment ?? "normal"
}

export function buildSupplierRecommendations(input: SupplierRecommendationInput): SupplierRecommendationResult {
  const country = normalizeSupplierCountry(input.country)
  const suppliers = matchSuppliers({
    country,
    specialty: input.specialty,
    category: input.materialCategory,
  })
  const ranked = rankSuppliers({
    suppliers,
    country,
    specialty: input.specialty,
    category: input.materialCategory,
  })
  const primarySupplier = ranked[0] ?? null
  const alternativeSuppliers = ranked.slice(1, 4)
  const segment = resolveResultSegment(primarySupplier?.segment)

  return {
    primarySupplier,
    alternativeSuppliers,
    estimatedCostImpact: primarySupplier?.estimatedCostImpact ?? null,
    segment,
    coverage: primarySupplier ? resolveSupplierCoverage(primarySupplier.supplierId) : resolveSupplierCoverage(),
  }
}
