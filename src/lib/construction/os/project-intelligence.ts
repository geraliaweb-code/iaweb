import type { AdvisorInsight, ConstructionAdvisorResult } from "../advisor"
import type { SupplierRecommendation, SupplierRecommendationResult } from "../supplier-intelligence"
import type { ConstructionHealthCheckResult, ConstructionScoreRecord } from "../types"
import type { ConstructionIntelligenceOSInput, ProjectIntelligenceSnapshot } from "./types"

function scoreFromRecords(scores: ConstructionScoreRecord[] | null | undefined, engine: string) {
  return scores?.find((score) => score.engine === engine)?.score ?? null
}

function resolveHealthCheck(input: ConstructionIntelligenceOSInput): ConstructionHealthCheckResult | null {
  if (input.healthCheck) return input.healthCheck
  if (input.scores && !Array.isArray(input.scores)) return input.scores
  return null
}

function resolveAdvisor(input: ConstructionIntelligenceOSInput): ProjectIntelligenceSnapshot["advisor"] {
  const empty = {
    available: false,
    insights: [],
    totalPotentialSavings: 0,
    criticalRisks: [],
    missingDocuments: [],
    confidenceImprovementPotential: 0,
  }

  if (!input.advisorInsights) return empty
  if (Array.isArray(input.advisorInsights)) {
    const insights = input.advisorInsights
    return {
      ...empty,
      available: insights.length > 0,
      insights,
      totalPotentialSavings: Math.max(0, ...insights.map((insight) => insight.estimatedSavings ?? 0)),
      criticalRisks: insights.filter((insight) => insight.category === "risk" && ["critical", "high"].includes(insight.priority)),
    }
  }

  const advisor = input.advisorInsights as ConstructionAdvisorResult
  return {
    available: advisor.insights.length > 0,
    insights: advisor.insights,
    totalPotentialSavings: advisor.totalPotentialSavings,
    criticalRisks: advisor.criticalRisks,
    missingDocuments: advisor.missingDocuments,
    confidenceImprovementPotential: advisor.confidenceImprovementPotential,
  }
}

function collectSupplierRecommendations(input: ConstructionIntelligenceOSInput): SupplierRecommendation[] {
  const source = input.supplierRecommendations
  if (!source) return []

  if (Array.isArray(source)) return source

  if ("primarySupplier" in source || "alternativeSuppliers" in source) {
    const result = source as SupplierRecommendationResult
    return [result.primarySupplier, ...(result.alternativeSuppliers ?? [])].filter((item): item is SupplierRecommendation => Boolean(item))
  }

  return Object.values(source).flatMap((value) => {
    if (!value) return []
    if ("primarySupplier" in value || "alternativeSuppliers" in value) {
      const result = value as SupplierRecommendationResult
      return [result.primarySupplier, ...(result.alternativeSuppliers ?? [])].filter((item): item is SupplierRecommendation => Boolean(item))
    }
    return [value as SupplierRecommendation]
  })
}

function uniqueSuppliers(recommendations: SupplierRecommendation[]) {
  const seen = new Set<string>()
  return recommendations.filter((recommendation) => {
    const key = recommendation.supplierId || recommendation.supplierName
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function buildProjectIntelligenceSnapshot(input: ConstructionIntelligenceOSInput): ProjectIntelligenceSnapshot {
  const healthCheck = resolveHealthCheck(input)
  const scoreRecords = Array.isArray(input.scores) ? input.scores : healthCheck?.scores
  const maturityScore = healthCheck?.maturityScore ?? input.project?.maturity_score ?? scoreFromRecords(scoreRecords, "maturity")
  const riskScore = healthCheck?.riskScore ?? input.project?.risk_score ?? scoreFromRecords(scoreRecords, "risk")
  const complexityScore = healthCheck?.complexityScore ?? input.project?.complexity_score ?? scoreFromRecords(scoreRecords, "complexity")
  const confidenceScore = healthCheck?.confidenceScore ?? input.project?.confidence_score ?? scoreFromRecords(scoreRecords, "confidence")
  const costRange = input.costBreakdownV2?.estimatedFullCostRange ?? {
    min: healthCheck?.costEstimate?.estimatedCostMin ?? null,
    max: healthCheck?.costEstimate?.estimatedCostMax ?? null,
  }
  const supplierRecommendations = uniqueSuppliers(collectSupplierRecommendations(input))
  const lockedFeatures = input.unlockStatus?.lockedItems?.map((item) => item.label) ?? []

  return {
    projectId: input.project?.id ?? input.projectId ?? input.costBreakdownV2?.projectId ?? null,
    projectName: input.project?.name ?? null,
    healthCheck: {
      available: Boolean(healthCheck || maturityScore || riskScore || complexityScore || confidenceScore),
      maturityScore,
      riskScore,
      complexityScore,
      confidenceScore,
      missingCriticalDocuments: healthCheck?.missingCriticalDocuments ?? [],
      alerts: healthCheck?.alerts ?? [],
    },
    costIntelligence: {
      available: Boolean(input.costBreakdownV2 || healthCheck?.costEstimate),
      confidenceScore: input.costBreakdownV2?.confidenceScore ?? healthCheck?.costEstimate?.costConfidence ?? null,
      estimatedCostRange: costRange,
      totalEstimatedCost: input.costBreakdownV2?.totalEstimatedCost ?? healthCheck?.costEstimate?.estimatedCostMid ?? null,
      warnings: input.costBreakdownV2?.warnings ?? [],
    },
    benchmark: {
      available: Boolean(input.benchmarkV2),
      isBlocked: input.benchmarkV2?.isBlocked ?? false,
      deviationPercent: input.benchmarkV2?.specialtyComparisons.find((comparison) => !comparison.isLocked)?.differencePercent ?? null,
      position: input.benchmarkV2?.costPosition ?? null,
      insights: input.benchmarkV2?.executiveInsights ?? [],
    },
    advisor: resolveAdvisor(input),
    supplier: {
      available: supplierRecommendations.length > 0,
      recommendations: supplierRecommendations,
      primarySupplier: supplierRecommendations[0] ?? null,
    },
    procurement: {
      available: Boolean(input.procurementPlan),
      items: input.procurementPlan?.procurementItems ?? [],
      criticalItems: input.procurementPlan?.criticalItems ?? [],
      highPriorityItems: input.procurementPlan?.highPriorityItems ?? [],
      totalProcurementValue: input.procurementPlan?.totalProcurementValue ?? 0,
    },
    unlock: {
      available: Boolean(input.unlockStatus),
      accessLevel: input.unlockStatus?.accessLevel ?? null,
      unlockedPercentage: input.unlockStatus?.unlockedPercentage ?? null,
      blockedItems: lockedFeatures,
      canViewSuppliers: input.unlockStatus?.canViewSuppliers ?? null,
      canViewFullBenchmark: input.unlockStatus?.canViewFullBenchmark ?? null,
      canDownloadPdf: input.unlockStatus?.canDownloadFullPdf ?? null,
    },
    timeline: {
      available: Boolean(input.timeline),
      estimatedMonths: input.timeline?.estimatedDuration.months ?? null,
      forecast: input.timeline?.forecast ?? null,
      delayRisks: input.timeline?.delayRisks ?? [],
      criticalPath: input.timeline?.criticalPath ?? [],
      nextActions: input.timeline?.nextActions ?? [],
    },
    knowledgeV2: {
      available: Boolean(input.knowledgeV2),
      dependencies: input.knowledgeV2?.dependencies ?? [],
      recommendations: input.knowledgeV2?.recommendations ?? [],
      costDrivers: input.knowledgeV2?.dependencies.filter((edge) => edge.relation.includes("cost")).map((edge) => edge.evidence) ?? [],
      scheduleDrivers: input.knowledgeV2?.dependencies.filter((edge) => edge.relation.includes("schedule")).map((edge) => edge.evidence) ?? [],
      supplierAlternatives: input.knowledgeV2?.suppliers.map((supplier) => supplier.label) ?? [],
    },
  }
}
