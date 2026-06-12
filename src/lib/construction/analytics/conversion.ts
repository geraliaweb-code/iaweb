import type { ConstructionAnalyticsFunnel, ConstructionAnalyticsKpis } from "./types"

export function percent(part: number, total: number) {
  if (!total) return 0
  return Math.round((part / total) * 1000) / 10
}

export function buildConstructionAnalyticsKpis(input: {
  projects: number
  funnel: ConstructionAnalyticsFunnel
}): ConstructionAnalyticsKpis {
  return {
    projects: input.projects,
    previews: input.funnel.previewViewed,
    unlockClicks: input.funnel.unlockClicks,
    checkouts: input.funnel.checkoutStarted,
    payments: input.funnel.checkoutCompleted,
    unlockRate: percent(input.funnel.unlockClicks, input.funnel.previewViewed),
    checkoutConversionRate: percent(input.funnel.checkoutCompleted, input.funnel.checkoutStarted),
    previewToCheckoutRate: percent(input.funnel.checkoutStarted, input.funnel.previewViewed),
    previewToPaymentRate: percent(input.funnel.checkoutCompleted, input.funnel.previewViewed),
  }
}

export function estimateConversionProbability(input: {
  previewViewed: number
  benchmarkViewed: number
  pdfViewed: number
  unlockClicks: number
  checkoutStarted: number
  checkoutCompleted: number
}) {
  const score =
    input.previewViewed * 18 +
    input.benchmarkViewed * 14 +
    input.pdfViewed * 12 +
    input.unlockClicks * 26 +
    input.checkoutStarted * 18 +
    input.checkoutCompleted * 12

  return Math.max(4, Math.min(98, score))
}
