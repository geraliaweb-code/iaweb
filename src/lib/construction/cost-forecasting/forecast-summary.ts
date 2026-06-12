import type { CostForecastOutput } from "./types"

function formatEuro(value: number) {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value)
}

export function buildForecastSummary(output: Omit<CostForecastOutput, "summary">) {
  const biggestIncreaseRisk = output.forecastRisks[0]?.title ?? output.delayImpacts[0]?.title ?? null

  return {
    title: "Previsao executiva de custo",
    body: `Se o plano atual for mantido, o custo esperado da obra e ${formatEuro(output.expectedCase)}. O pior cenario estimado e ${formatEuro(output.worstCase)}${biggestIncreaseRisk ? `, com maior risco associado a ${biggestIncreaseRisk}.` : "."}`,
    biggestIncreaseRisk,
  }
}
