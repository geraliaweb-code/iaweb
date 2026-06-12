import { europeanMaterials, type EuropeanCostSegment, type SupplierDataset } from "../datasets/europe"
import { getSupplierId, normalizeSupplierText, resolveSupplierCoverage } from "./supplier-coverage"
import { normalizeMaterialCategory } from "./supplier-matching"
import type { SupplierRecommendation, SupplierScoringInput } from "./types"

const typeCostBias: Record<SupplierDataset["supplierType"], number> = {
  manufacturer: 78,
  distributor: 72,
  retailer: 84,
  installer: 62,
}

const segmentBias: Record<EuropeanCostSegment, number> = {
  economic: 10,
  normal: 0,
  premium: -6,
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)))
}

function estimateCostImpact(supplier: SupplierDataset, segment: EuropeanCostSegment) {
  const base = supplier.supplierType === "retailer" ? -6 : supplier.supplierType === "distributor" ? -4 : supplier.supplierType === "manufacturer" ? -2 : 4
  if (segment === "premium") return base + 8
  if (segment === "economic") return base - 5
  return base
}

function scoreSpecialization(supplier: SupplierDataset, category?: string | null, specialty?: string | null) {
  const normalizedCategory = normalizeMaterialCategory(category)
  const normalizedSpecialty = normalizeSupplierText(specialty)
  const specialties = supplier.specialties.map(normalizeSupplierText)
  let score = 46 + Math.min(24, supplier.specialties.length * 6)

  if (normalizedCategory && specialties.includes(normalizeSupplierText(normalizedCategory))) score += 26
  if (normalizedSpecialty && specialties.some((item) => normalizedSpecialty.includes(item.toLowerCase()))) score += 10

  return clampScore(score)
}

function scoreCoverage(supplier: SupplierDataset, country: SupplierScoringInput["country"]) {
  const coverage = resolveSupplierCoverage(getSupplierId(supplier))
  let score = coverage.countries.includes(country) ? 78 : 50
  if (supplier.country === country) score += 8
  if (coverage.countries.length > 1) score += 12
  if (normalizeSupplierText(supplier.coverageRegion).includes(normalizeSupplierText(country))) score += 6
  return clampScore(score)
}

function scoreCost(input: SupplierScoringInput) {
  const category = normalizeMaterialCategory(input.category)
  const supplierMaterials = europeanMaterials.filter((material) => {
    if (material.country !== input.country) return false
    if (category && material.category !== category) return false
    const brand = normalizeSupplierText(material.brand)
    const supplierName = normalizeSupplierText(input.supplier.name)
    return Boolean(brand) && (brand === supplierName || supplierName.includes(brand) || brand.includes(supplierName))
  })
  const materialSignal = supplierMaterials.length ? 8 : 0
  return clampScore(typeCostBias[input.supplier.supplierType] + segmentBias[input.segment] + materialSignal)
}

function scoreConfidence(input: SupplierScoringInput, costScore: number, coverageScore: number, specializationScore: number) {
  const hasWebsite = input.supplier.website ? 8 : 0
  const hasCategory = normalizeMaterialCategory(input.category) ? 8 : 0
  return clampScore((costScore + coverageScore + specializationScore) / 3 + hasWebsite + hasCategory)
}

export function scoreSupplier(input: SupplierScoringInput): SupplierRecommendation {
  const costScore = scoreCost(input)
  const coverageScore = scoreCoverage(input.supplier, input.country)
  const specializationScore = scoreSpecialization(input.supplier, input.category, input.specialty)
  const confidenceScore = scoreConfidence(input, costScore, coverageScore, specializationScore)
  const totalScore = clampScore(costScore * 0.28 + coverageScore * 0.24 + specializationScore * 0.32 + confidenceScore * 0.16)

  return {
    supplierId: getSupplierId(input.supplier),
    supplierName: input.supplier.name,
    supplierType: input.supplier.supplierType,
    segment: input.segment,
    coverage: resolveSupplierCoverage(getSupplierId(input.supplier)).regions,
    specialties: input.supplier.specialties,
    totalScore,
    costScore,
    coverageScore,
    specializationScore,
    confidenceScore,
    estimatedCostImpact: estimateCostImpact(input.supplier, input.segment),
  }
}
