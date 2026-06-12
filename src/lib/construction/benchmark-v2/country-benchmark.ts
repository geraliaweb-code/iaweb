import { roundCurrency, type ConstructionCostDatabaseCountry } from "../cost-database-v2"
import type { ConstructionProject } from "../types"
import type { BenchmarkV2ComparedCountry, BenchmarkV2Country, BenchmarkV2Range } from "./types"

export const benchmarkV2Countries: BenchmarkV2Country[] = ["Portugal", "Franca", "Espanha"]

const countryBaseCostPerM2: Record<BenchmarkV2Country, BenchmarkV2Range> = {
  Portugal: { low: 980, medium: 1320, high: 1780 },
  Franca: { low: 1420, medium: 1910, high: 2580 },
  Espanha: { low: 1040, medium: 1390, high: 1860 },
}

const countryLaborDailyRate: Record<BenchmarkV2Country, number> = {
  Portugal: 136,
  Franca: 214,
  Espanha: 139,
}

const countryProductivityIndex: Record<BenchmarkV2Country, number> = {
  Portugal: 100,
  Franca: 94,
  Espanha: 104,
}

const countryScheduleIndex: Record<BenchmarkV2Country, number> = {
  Portugal: 100,
  Franca: 106,
  Espanha: 97,
}

const typologyMultiplier: Record<string, number> = {
  moradia: 1,
  remodelacao: 0.72,
  creche: 1.08,
  hotel: 1.26,
  pavilhao_industrial: 0.82,
  restaurante: 1.12,
  lar: 1.18,
  industria: 0.9,
  comercio: 0.86,
}

function applyMultiplier(range: BenchmarkV2Range, multiplier: number): BenchmarkV2Range {
  return {
    low: roundCurrency(range.low * multiplier),
    medium: roundCurrency(range.medium * multiplier),
    high: roundCurrency(range.high * multiplier),
  }
}

export function getCountryBenchmarkRangeV2(country: ConstructionCostDatabaseCountry, project: ConstructionProject) {
  return applyMultiplier(countryBaseCostPerM2[country], typologyMultiplier[project.project_type] ?? 1)
}

export function getMarketCostPerM2RangeV2(project: ConstructionProject): BenchmarkV2Range {
  const ranges = benchmarkV2Countries.map((country) => getCountryBenchmarkRangeV2(country, project))

  return {
    low: roundCurrency(ranges.reduce((total, range) => total + range.low, 0) / ranges.length),
    medium: roundCurrency(ranges.reduce((total, range) => total + range.medium, 0) / ranges.length),
    high: roundCurrency(ranges.reduce((total, range) => total + range.high, 0) / ranges.length),
  }
}

export function buildComparedCountriesV2(project: ConstructionProject, locked: boolean): BenchmarkV2ComparedCountry[] {
  return benchmarkV2Countries.map((country) => ({
    country,
    label: country,
    costPerM2Range: locked ? null : getCountryBenchmarkRangeV2(country, project),
    averageLaborDailyRate: locked ? null : countryLaborDailyRate[country],
    productivityIndex: locked ? null : countryProductivityIndex[country],
    scheduleIndex: locked ? null : countryScheduleIndex[country],
    isLocked: locked,
  }))
}
