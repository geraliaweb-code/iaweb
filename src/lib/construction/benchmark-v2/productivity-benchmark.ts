import { roundCurrency, type ConstructionCostDatabaseCountry } from "../cost-database-v2"
import type { ConstructionCostBreakdownLine } from "../cost-engine-v2"
import { differencePercentV2 } from "./specialty-benchmark"
import type { BenchmarkV2LaborComparison, BenchmarkV2ProductivityComparison, BenchmarkV2ScheduleComparison } from "./types"

const productivityPerDay: Record<string, Record<ConstructionCostDatabaseCountry, number>> = {
  Estruturas: { Portugal: 8, Franca: 7, Espanha: 8 },
  Pintura: { Portugal: 75, Franca: 70, Espanha: 78 },
  ETICS: { Portugal: 18, Franca: 16, Espanha: 19 },
  Pladur: { Portugal: 28, Franca: 26, Espanha: 30 },
  Pavimentos: { Portugal: 34, Franca: 31, Espanha: 36 },
  Caixilharias: { Portugal: 9, Franca: 8, Espanha: 10 },
}

const laborCostMultiplier: Record<ConstructionCostDatabaseCountry, number> = {
  Portugal: 1,
  Franca: 1.55,
  Espanha: 1.04,
}

export function getBenchmarkProductivityV2(specialty: string, country: ConstructionCostDatabaseCountry) {
  return productivityPerDay[specialty]?.[country] ?? 24
}

export function buildProductivityComparisonsV2(input: {
  items: ConstructionCostBreakdownLine[]
  country: ConstructionCostDatabaseCountry
  locked: boolean
}): BenchmarkV2ProductivityComparison[] {
  if (input.locked) return []

  return input.items.map((item) => {
    const marketProductivityPerDay = getBenchmarkProductivityV2(item.specialty, input.country)
    const projectProductivityPerDay = item.productivityRate
    const differencePercent = projectProductivityPerDay ? differencePercentV2(projectProductivityPerDay, marketProductivityPerDay) : null
    const position =
      differencePercent === null || Math.abs(differencePercent) <= 8
        ? "dentro_do_benchmark"
        : differencePercent < 0
          ? "abaixo_do_benchmark"
          : "acima_do_benchmark"

    return {
      specialty: item.specialty,
      projectProductivityPerDay,
      marketProductivityPerDay,
      differencePercent,
      position,
      isLocked: false,
    }
  })
}

export function buildLaborComparisonsV2(input: {
  items: ConstructionCostBreakdownLine[]
  country: ConstructionCostDatabaseCountry
  locked: boolean
}): BenchmarkV2LaborComparison[] {
  if (input.locked) return []

  return input.items.map((item) => {
    const marketLaborCost = roundCurrency(item.laborCost * laborCostMultiplier[input.country])

    return {
      specialty: item.specialty,
      projectLaborCost: item.laborCost,
      marketLaborCost,
      differencePercent: differencePercentV2(item.laborCost, marketLaborCost),
      isLocked: false,
    }
  })
}

export function buildScheduleComparisonV2(input: {
  items: ConstructionCostBreakdownLine[]
  country: ConstructionCostDatabaseCountry
  locked: boolean
}): BenchmarkV2ScheduleComparison {
  if (input.locked) return null

  const projectDays = input.items.reduce((total, item) => {
    const productivity = item.productivityRate || getBenchmarkProductivityV2(item.specialty, input.country)
    return total + item.quantity / Math.max(1, productivity)
  }, 0)
  const marketDays = input.items.reduce((total, item) => total + item.quantity / Math.max(1, getBenchmarkProductivityV2(item.specialty, input.country)), 0)
  const projectIndicativeMonths = roundCurrency(projectDays / 21)
  const marketIndicativeMonths = roundCurrency(marketDays / 21)
  const difference = differencePercentV2(projectIndicativeMonths, marketIndicativeMonths)

  return {
    projectIndicativeMonths,
    marketIndicativeMonths,
    differencePercent: difference,
    position: difference > 8 ? "acima_da_media" : difference < -8 ? "abaixo_da_media" : "dentro_da_media",
  }
}
