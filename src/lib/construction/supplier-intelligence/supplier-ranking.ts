import type { EuropeanCostSegment, SupplierDataset } from "../datasets/europe"
import { scoreSupplier } from "./supplier-scoring"
import type { SupplierRecommendation, SupplierScoringInput } from "./types"

function inferSegment(recommendation: SupplierRecommendation): EuropeanCostSegment {
  if (recommendation.supplierType === "retailer" || recommendation.costScore >= 88) return "economic"
  if (recommendation.supplierType === "manufacturer" && recommendation.specializationScore >= 82) return "premium"
  return "normal"
}

export function rankSuppliers(input: Omit<SupplierScoringInput, "supplier" | "segment"> & { suppliers: SupplierDataset[]; segment?: EuropeanCostSegment }) {
  return input.suppliers
    .flatMap((supplier) => {
      const baseSegment = input.segment ?? "normal"
      const scored = scoreSupplier({ ...input, supplier, segment: baseSegment })
      const inferredSegment = input.segment ?? inferSegment(scored)
      return inferredSegment === baseSegment ? scored : scoreSupplier({ ...input, supplier, segment: inferredSegment })
    })
    .sort((a, b) => b.totalScore - a.totalScore)
}
