import type { EuropeanCostSegment, EuropeanDatasetCountry, EuropeanMaterialCategory, EuropeanSupplierType, SupplierDataset } from "../datasets/europe"

export type SupplierRecommendation = {
  supplierId: string
  supplierName: string
  supplierType: EuropeanSupplierType
  segment: EuropeanCostSegment
  coverage: string[]
  specialties: string[]
  totalScore: number
  costScore: number
  coverageScore: number
  specializationScore: number
  confidenceScore: number
  estimatedCostImpact?: number
}

export type SupplierMatchInput = {
  country?: string | null
  specialty?: string | null
  category?: string | null
}

export type SupplierRecommendationInput = {
  country?: string | null
  specialty?: string | null
  materialCategory?: string | null
}

export type SupplierCoverage = {
  countries: EuropeanDatasetCountry[]
  regions: string[]
}

export type SupplierScoringInput = {
  supplier: SupplierDataset
  country: EuropeanDatasetCountry
  specialty?: string | null
  category?: EuropeanMaterialCategory | string | null
  segment: EuropeanCostSegment
}

export type SupplierRecommendationResult = {
  primarySupplier: SupplierRecommendation | null
  alternativeSuppliers: SupplierRecommendation[]
  estimatedCostImpact: number | null
  segment: EuropeanCostSegment
  coverage: SupplierCoverage
}
