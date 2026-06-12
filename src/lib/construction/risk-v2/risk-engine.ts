import type { DelayRisk } from "../timeline"
import type { SupplierRecommendation, SupplierRecommendationResult } from "../supplier-intelligence"
import { classifyOverallRisk, classifyRisk, probabilityScore, severityScore } from "./risk-classifier"
import { estimateConfidenceImpact } from "./risk-confidence-impact"
import { estimateFinancialImpact } from "./risk-financial-impact"
import { prioritizeRisks } from "./risk-prioritizer"
import { buildRiskRecommendation, uniqueRiskRecommendations } from "./risk-recommendation-engine"
import { estimateTimelineImpact } from "./risk-timeline-impact"
import type { ConstructionRiskInput, ConstructionRiskReport, RiskAssessment, RiskCategory, RiskProbability, RiskSeverity } from "./types"

function slug(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

function probabilityFromSignals(input: ConstructionRiskInput, base: RiskProbability): RiskProbability {
  const riskScore = input.healthCheck?.riskScore ?? input.project?.risk_score ?? 45
  const confidence = input.healthCheck?.confidenceScore ?? input.project?.confidence_score ?? 65
  if (riskScore >= 78 || confidence < 45) return "almost_certain"
  if (riskScore >= 62 || confidence < 58) return base === "rare" ? "possible" : "likely"
  return base
}

function impactScore(financialExpected: number, timelineWeeks: number, confidenceReduction: number) {
  const financial = Math.min(100, financialExpected / 600)
  const timeline = Math.min(100, timelineWeeks * 12)
  const confidence = Math.min(100, confidenceReduction * 5)
  return Math.round(financial * 0.42 + timeline * 0.34 + confidence * 0.24)
}

function makeRisk(
  input: ConstructionRiskInput,
  title: string,
  category: RiskCategory,
  baseProbability: RiskProbability,
  source: RiskAssessment["source"],
  sourceDelayRisk?: DelayRisk | null,
): RiskAssessment {
  const probability = probabilityFromSignals(input, baseProbability)
  const provisionalSeverity = classifyRisk(probability, sourceDelayRisk ? Math.min(100, sourceDelayRisk.impactWeeks * 16) : 58)
  const financial = estimateFinancialImpact(input, category, provisionalSeverity)
  const timeline = estimateTimelineImpact(category, provisionalSeverity, sourceDelayRisk)
  const confidence = estimateConfidenceImpact(input, category, provisionalSeverity)
  const computedImpactScore = impactScore(financial.expected, timeline.weeks, confidence.confidenceReduction)
  const severity = classifyRisk(probability, computedImpactScore)
  const finalFinancial = estimateFinancialImpact(input, category, severity)
  const finalTimeline = estimateTimelineImpact(category, severity, sourceDelayRisk)
  const finalConfidence = estimateConfidenceImpact(input, category, severity)
  const totalScore = Math.round((probabilityScore(probability) * computedImpactScore) / 100)

  return {
    id: `${source}-${slug(title)}`,
    title,
    category,
    severity,
    probability,
    score: {
      probabilityScore: probabilityScore(probability),
      impactScore: computedImpactScore,
      totalScore,
    },
    impact: {
      financialImpactMin: finalFinancial.min,
      financialImpactExpected: finalFinancial.expected,
      financialImpactMax: finalFinancial.max,
      timelineImpactWeeks: finalTimeline.weeks,
      timelineImpactMonths: finalTimeline.months,
      confidenceReduction: finalConfidence.confidenceReduction,
      confidenceAfter: finalConfidence.confidenceAfter,
    },
    recommendation: buildRiskRecommendation(title, category, severity, finalTimeline.weeks),
    source,
  }
}

function supplierRiskTitles(input: ConstructionRiskInput) {
  const source = input.supplierRecommendations
  if (!source) return []
  const values = normalizeSupplierValues(source)
  return values.flatMap((value) => {
    if (isSupplierResult(value)) {
      if (!value.primarySupplier) return ["Fornecedor sem cobertura para especialidade critica"]
      return value.primarySupplier.confidenceScore < 60 ? [`Baixa confianca no fornecedor ${value.primarySupplier.supplierName}`] : []
    }
    return value.confidenceScore < 60 ? [`Baixa confianca no fornecedor ${value.supplierName}`] : []
  })
}

function normalizeSupplierValues(source: NonNullable<ConstructionRiskInput["supplierRecommendations"]>): Array<SupplierRecommendation | SupplierRecommendationResult> {
  if (Array.isArray(source)) return source
  if (isSupplierResultLike(source)) return [source]
  return Object.values(source).filter((value): value is SupplierRecommendation | SupplierRecommendationResult => Boolean(value))
}

function isSupplierResult(value: SupplierRecommendation | SupplierRecommendationResult): value is SupplierRecommendationResult {
  return "primarySupplier" in value
}

function isSupplierResultLike(value: NonNullable<ConstructionRiskInput["supplierRecommendations"]>): value is SupplierRecommendationResult {
  return typeof value === "object" && value !== null && "primarySupplier" in value && "alternativeSuppliers" in value
}

function rawRisks(input: ConstructionRiskInput) {
  const risks: RiskAssessment[] = []
  const missingDocuments = input.healthCheck?.missingCriticalDocuments ?? []

  for (const document of missingDocuments.slice(0, 4)) {
    risks.push(makeRisk(input, `${document} em falta`, "documental", "likely", "health_check"))
  }

  for (const alert of input.healthCheck?.alerts.slice(0, 4) ?? []) {
    risks.push(makeRisk(input, alert.title, alert.type?.includes("compliance") ? "compliance" : "execucao", "possible", "health_check"))
  }

  for (const delayRisk of input.timeline?.delayRisks ?? []) {
    risks.push(makeRisk(input, delayRisk.title, delayRisk.title.toLowerCase().includes("procurement") ? "procurement" : "prazo", delayRisk.severity === "critical" ? "almost_certain" : "likely", "timeline", delayRisk))
  }

  for (const item of input.procurementPlan?.criticalItems ?? input.procurementActions ?? []) {
    risks.push(makeRisk(input, `Procurement critico: ${item.material}`, "procurement", item.risk === "critical" ? "almost_certain" : "likely", "procurement"))
  }

  for (const title of supplierRiskTitles(input).slice(0, 3)) {
    risks.push(makeRisk(input, title, "fornecedor", "possible", "supplier"))
  }

  if (input.benchmarkV2?.costPosition === "acima_da_media") {
    risks.push(makeRisk(input, "Desvio acima da media face ao benchmark", "benchmark", "likely", "benchmark"))
  }

  const benchmarkDeviation = input.benchmarkV2?.specialtyComparisons.find((comparison) => !comparison.isLocked && comparison.differencePercent > 15)
  if (benchmarkDeviation) {
    risks.push(makeRisk(input, `${benchmarkDeviation.specialty} acima do benchmark`, "financeiro", "likely", "benchmark"))
  }

  for (const warning of input.costBreakdownV2?.warnings.slice(0, 3) ?? []) {
    risks.push(makeRisk(input, warning, "financeiro", "possible", "cost_intelligence"))
  }

  for (const risk of input.knowledgeGraph?.derivedRisks?.slice(0, 3) ?? []) {
    risks.push(makeRisk(input, risk, "especialidades", "possible", "knowledge_graph"))
  }

  for (const risk of input.constructionOS?.topRisks.slice(0, 3) ?? []) {
    risks.push(makeRisk(input, risk, "execucao", "possible", "construction_os"))
  }

  if (!risks.length) {
    risks.push(makeRisk(input, "Risco executivo ainda pouco caracterizado", "execucao", "possible", "construction_os"))
  }

  return risks
}

function uniqueRisks(risks: RiskAssessment[]) {
  const seen = new Set<string>()
  return risks.filter((risk) => {
    const key = `${risk.category}-${slug(risk.title)}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function generateConstructionRiskReport(input: ConstructionRiskInput): ConstructionRiskReport {
  const risks = prioritizeRisks(uniqueRisks(rawRisks(input))).slice(0, 12)
  const overallRiskScore = Math.round(
    risks.reduce((total, risk, index) => total + risk.score.totalScore * (index < 3 ? 1.25 : 1), 0) / Math.max(1, risks.length),
  )
  const riskLevel = classifyOverallRisk(overallRiskScore)

  return {
    overallRiskScore,
    riskLevel,
    risks,
    topFinancialRisks: risks
      .slice()
      .sort((left, right) => right.impact.financialImpactExpected - left.impact.financialImpactExpected)
      .slice(0, 5)
      .map((risk) => ({ title: risk.title, impact: risk.impact.financialImpactExpected })),
    topTimelineRisks: risks
      .slice()
      .sort((left, right) => right.impact.timelineImpactWeeks - left.impact.timelineImpactWeeks)
      .slice(0, 5)
      .map((risk) => ({ title: risk.title, impactWeeks: risk.impact.timelineImpactWeeks })),
    topConfidenceRisks: risks
      .slice()
      .sort((left, right) => right.impact.confidenceReduction - left.impact.confidenceReduction)
      .slice(0, 5)
      .map((risk) => ({ title: risk.title, confidenceReduction: risk.impact.confidenceReduction })),
    recommendations: uniqueRiskRecommendations(risks).slice(0, 6),
  }
}
