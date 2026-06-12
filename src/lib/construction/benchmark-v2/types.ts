import type { ConstructionAccessLevel } from "../unlock-engine"
import type { ConstructionCostDatabaseCountry } from "../cost-database-v2"

export type BenchmarkV2Country = "Portugal" | "Franca" | "Espanha"

export type BenchmarkV2CostPosition = "abaixo_da_media" | "dentro_da_media" | "acima_da_media"

export type BenchmarkV2Range = {
  low: number
  medium: number
  high: number
}

export type BenchmarkV2ComparedCountry = {
  country: BenchmarkV2Country
  label: string
  costPerM2Range: BenchmarkV2Range | null
  averageLaborDailyRate: number | null
  productivityIndex: number | null
  scheduleIndex: number | null
  isLocked: boolean
}

export type BenchmarkV2SpecialtyComparison = {
  specialty: string
  projectCost: number
  projectCostPerM2: number
  marketCostPerM2: number
  differencePercent: number
  position: BenchmarkV2CostPosition
  isLocked: boolean
}

export type BenchmarkV2ProductivityComparison = {
  specialty: string
  projectProductivityPerDay: number | null
  marketProductivityPerDay: number
  differencePercent: number | null
  position: "abaixo_do_benchmark" | "dentro_do_benchmark" | "acima_do_benchmark"
  isLocked: boolean
}

export type BenchmarkV2LaborComparison = {
  specialty: string
  projectLaborCost: number
  marketLaborCost: number
  differencePercent: number
  isLocked: boolean
}

export type BenchmarkV2ScheduleComparison = {
  projectIndicativeMonths: number
  marketIndicativeMonths: number
  differencePercent: number
  position: BenchmarkV2CostPosition
} | null

export type BenchmarkV2RiskComparison = {
  projectRiskScore: number
  marketRiskScore: number
  differencePoints: number
  position: BenchmarkV2CostPosition
} | null

export type BenchmarkV2MaturityComparison = {
  projectMaturityScore: number
  marketMaturityScore: number
  differencePoints: number
  position: BenchmarkV2CostPosition
} | null

export type BenchmarkV2Result = {
  accessLevel: ConstructionAccessLevel
  isBlocked: boolean
  projectCountry: ConstructionCostDatabaseCountry
  comparedCountries: BenchmarkV2ComparedCountry[]
  projectCostPerM2: number
  marketCostPerM2Range: BenchmarkV2Range
  costPosition: BenchmarkV2CostPosition
  specialtyComparisons: BenchmarkV2SpecialtyComparison[]
  productivityComparisons: BenchmarkV2ProductivityComparison[]
  laborComparisons: BenchmarkV2LaborComparison[]
  scheduleComparison: BenchmarkV2ScheduleComparison
  riskComparison: BenchmarkV2RiskComparison
  maturityComparison: BenchmarkV2MaturityComparison
  confidenceScore: number
  executiveInsights: string[]
  lockedSections: string[]
  upgradeCTA: string | null
}

export type BenchmarkV2EngineInput = {
  projectId: string
}
