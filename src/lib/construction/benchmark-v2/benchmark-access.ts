import type { BenchmarkV2Result } from "./types"

export const benchmarkV2UpgradeCTA = "Desbloquear Benchmark Europeu Completo"

const blockedSections = [
  "Paises Portugal, Franca e Espanha",
  "Especialidades por custo e produtividade",
  "Mao de obra comparativa",
  "Prazo indicativo completo",
  "Risco e maturidade documental comparados",
]

export function applyBenchmarkV2Access(result: BenchmarkV2Result): BenchmarkV2Result {
  if (result.accessLevel === "full_unlocked") {
    return {
      ...result,
      isBlocked: false,
      lockedSections: [],
      upgradeCTA: null,
    }
  }

  return {
    ...result,
    isBlocked: true,
    comparedCountries: result.comparedCountries.map((country) => ({
      ...country,
      costPerM2Range: null,
      averageLaborDailyRate: null,
      productivityIndex: null,
      scheduleIndex: null,
      isLocked: true,
    })),
    specialtyComparisons: [],
    productivityComparisons: [],
    laborComparisons: [],
    scheduleComparison: null,
    riskComparison: null,
    maturityComparison: null,
    executiveInsights: result.executiveInsights.slice(0, 1),
    lockedSections: blockedSections,
    upgradeCTA: benchmarkV2UpgradeCTA,
  }
}
