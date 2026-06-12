import { calculateCostConfidence } from "./cost-confidence"
import type { SpecialtyCostEstimate } from "./specialty-cost-engine"

export type ProjectCostEstimate = {
  id: string
  projectId: string
  costMin: number
  costProv: number
  costMax: number
  costPerM2Prov: number | null
  overheadFactorUsed: number
  specialtyCoverage: number
  costConfidenceProject: number
  rangeWidthPct: number
  benchmarkDeltaPct: number | null
  estimateVersion: string
  calculatedAt: string
  expiresAt: string
  exactMatchRatio: number
  servingPublic: false
}

export type CostRangeModel = {
  id: string
  modelName: string
  modelVersion: string
  qSourceRule: string
  pSourceRule: string
  aggregationRule: string
  overheadModel: string
  country: "Portugal" | "Franca" | "Espanha" | null
  typology: string | null
  isActive: boolean
  createdAt: string
}

export type QpCalibrationEvent = {
  id: string
  projectId: string
  estimatedCost: number | null
  realCost: number | null
  deltaPct: number | null
  qDeltaPct: number | null
  pDeltaPct: number | null
  calibratedAt: string | null
}

export function estimateProjectCost(input: {
  projectId: string
  areaM2Basis?: number | null
  specialties: SpecialtyCostEstimate[]
  overheadFactorUsed?: number
  benchmarkCostProv?: number | null
  estimateVersion?: string
  calculatedAt?: string
  expiresInDays?: number
}): ProjectCostEstimate {
  const overheadFactorUsed = input.overheadFactorUsed ?? 1.08
  const specialtyCoverage = ratio(input.specialties.filter((specialty) => specialty.coverageRatio >= 0.7).length, input.specialties.length)
  const exactMatchRatio = average(input.specialties.map((specialty) => specialty.exactMatchRatio))
  const avgConfidence = average(input.specialties.map((specialty) => specialty.costConfidenceSpecialty))
  const confidence = calculateCostConfidence({
    quantityConfidence: avgConfidence,
    priceConfidence: avgConfidence,
    linkConfidence: exactMatchRatio,
    coverageRatio: specialtyCoverage,
    priceFreshnessScore: 1,
  })
  const baseMin = sum(input.specialties.map((specialty) => specialty.costMin))
  const baseProv = sum(input.specialties.map((specialty) => specialty.costProv))
  const baseMax = sum(input.specialties.map((specialty) => specialty.costMax))
  const costMin = Math.round(baseMin * overheadFactorUsed)
  const costProv = Math.round(baseProv * overheadFactorUsed)
  const costMax = Math.round(baseMax * overheadFactorUsed)
  const calculatedAt = input.calculatedAt ?? new Date().toISOString()
  const expiresAt = new Date(new Date(calculatedAt).getTime() + (input.expiresInDays ?? 30) * 24 * 60 * 60 * 1000).toISOString()

  return {
    id: `project-cost-${input.projectId}-${input.estimateVersion ?? "v1"}`,
    projectId: input.projectId,
    costMin,
    costProv,
    costMax,
    costPerM2Prov: input.areaM2Basis ? Math.round(costProv / input.areaM2Basis) : null,
    overheadFactorUsed,
    specialtyCoverage,
    costConfidenceProject: confidence.ccScore,
    rangeWidthPct: costProv ? Math.round(((costMax - costMin) / costProv) * 10000) / 100 : 0,
    benchmarkDeltaPct: input.benchmarkCostProv ? Math.round(((costProv - input.benchmarkCostProv) / input.benchmarkCostProv) * 10000) / 100 : null,
    estimateVersion: input.estimateVersion ?? "dm6c-v1",
    calculatedAt,
    expiresAt,
    exactMatchRatio,
    servingPublic: false,
  }
}

export const defaultCostRangeModel: CostRangeModel = {
  id: "dm6c-qpxp-range-v1",
  modelName: "DM-6C QxP Internal Range Model",
  modelVersion: "v1",
  qSourceRule: "quantity p10/p50/p90 from quantity_normalizations or quantity_patterns",
  pSourceRule: "price p10/p50/p90 from material_costs with conservative spread",
  aggregationRule: "line costs roll up to specialty and project without Q-P correlation",
  overheadModel: "fixed_internal_overhead_factor",
  country: null,
  typology: null,
  isActive: true,
  createdAt: new Date(0).toISOString(),
}

export function createInactiveCalibrationEvent(projectId: string): QpCalibrationEvent {
  return {
    id: `qp-calibration-${projectId}`,
    projectId,
    estimatedCost: null,
    realCost: null,
    deltaPct: null,
    qDeltaPct: null,
    pDeltaPct: null,
    calibratedAt: null,
  }
}

function sum(values: number[]) {
  return Math.round(values.reduce((total, value) => total + value, 0))
}

function ratio(part: number, total: number) {
  return total ? Math.round((part / total) * 10000) / 10000 : 0
}

function average(values: number[]) {
  return values.length ? Math.round((values.reduce((total, value) => total + value, 0) / values.length) * 10000) / 10000 : 0
}
