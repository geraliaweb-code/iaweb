import { buildExecutiveSummary, resolveProjectStatus } from "./executive-summary"
import { buildDecisionActions } from "./decision-engine"
import { buildProjectIntelligenceSnapshot } from "./project-intelligence"
import type { ConstructionIntelligenceOSInput, ConstructionIntelligenceOSResult } from "./types"

function topRisksFrom(input: ReturnType<typeof buildProjectIntelligenceSnapshot>) {
  const alertRisks = input.healthCheck.alerts.map((alert) => alert.title)
  const advisorRisks = input.advisor.criticalRisks.map((insight) => insight.title)
  const procurementRisks = input.procurement.criticalItems.map((item) => `${item.material}: ${item.procurementWindow}`)
  const timelineRisks = input.timeline.delayRisks.map((risk) => risk.title)
  const blockedRisks = input.unlock.blockedItems.length ? ["Oportunidades executivas bloqueadas pela analise parcial"] : []

  return [...timelineRisks, ...advisorRisks, ...alertRisks, ...procurementRisks, ...blockedRisks].slice(0, 5)
}

function topSavingsFrom(input: ReturnType<typeof buildProjectIntelligenceSnapshot>) {
  const advisorSavings = input.advisor.insights
    .filter((insight) => (insight.estimatedSavings ?? 0) > 0)
    .map((insight) => ({ title: insight.title, amount: insight.estimatedSavings ?? null }))
  const supplierSavings = input.supplier.recommendations
    .filter((supplier) => supplier.estimatedCostImpact !== undefined)
    .map((supplier) => ({ title: `Fornecedor ${supplier.supplierName}`, amount: supplier.estimatedCostImpact ?? null }))

  return [...advisorSavings, ...supplierSavings].sort((left, right) => (right.amount ?? 0) - (left.amount ?? 0)).slice(0, 5)
}

function blockedOpportunitiesFrom(input: ReturnType<typeof buildProjectIntelligenceSnapshot>) {
  const blocked = [...input.unlock.blockedItems]
  if (input.benchmark.isBlocked) blocked.push("Benchmark europeu completo")
  if (input.unlock.canViewSuppliers === false) blocked.push("Supplier Intelligence completa")
  if (input.unlock.canDownloadPdf === false) blocked.push("PDF Executivo Premium")
  return [...new Set(blocked)]
}

export function buildConstructionIntelligence(input: ConstructionIntelligenceOSInput): ConstructionIntelligenceOSResult {
  const snapshot = buildProjectIntelligenceSnapshot(input)
  const executiveSummary = buildExecutiveSummary(snapshot)
  const projectStatus = resolveProjectStatus(snapshot)
  const nextBestActions = buildDecisionActions(snapshot)
  const blockedOpportunities = blockedOpportunitiesFrom(snapshot)

  return {
    executiveSummary,
    projectStatus,
    confidenceScore: executiveSummary.confidence,
    topRisks: topRisksFrom(snapshot),
    topSavings: topSavingsFrom(snapshot),
    supplierRecommendations: snapshot.supplier.recommendations.slice(0, 5),
    procurementActions: snapshot.procurement.criticalItems.length ? snapshot.procurement.criticalItems.slice(0, 5) : snapshot.procurement.highPriorityItems.slice(0, 5),
    timelineSummary: {
      estimatedMonths: snapshot.timeline.estimatedMonths,
      primaryDelayRisk: snapshot.timeline.delayRisks[0]?.title ?? null,
      criticalPathLength: snapshot.timeline.criticalPath.length,
    },
    timelineForecast: snapshot.timeline.forecast,
    delayRisks: snapshot.timeline.delayRisks,
    criticalPath: snapshot.timeline.criticalPath,
    nextBestActions: nextBestActions.slice(0, 7),
    blockedOpportunities,
    commercialCTA: blockedOpportunities.length
      ? {
          label: "Desbloquear Analise Completa",
          title: "Oportunidades bloqueadas",
          body: "Desbloqueie custo completo, benchmark, fornecedores, procurement e PDF executivo.",
          href: "/construction/billing",
        }
      : null,
    projectIntelligenceSnapshot: snapshot,
    warnings: [
      ...snapshot.costIntelligence.warnings,
      ...(snapshot.healthCheck.available ? [] : ["Health Check indisponivel ou ainda nao gerado."]),
      ...(snapshot.costIntelligence.available ? [] : ["Cost Intelligence indisponivel neste resultado parcial."]),
    ],
  }
}
