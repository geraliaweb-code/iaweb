import type { DelayRisk, TimelineAction, TimelineInput, TimelineSeverity } from "./types"
import type { SupplierRecommendation, SupplierRecommendationResult } from "../supplier-intelligence"

function severityFromImpact(impactWeeks: number): TimelineSeverity {
  if (impactWeeks >= 5) return "critical"
  if (impactWeeks >= 3) return "high"
  if (impactWeeks >= 2) return "medium"
  return "low"
}

function addRisk(risks: DelayRisk[], id: string, title: string, impactWeeks: number, recommendation: string) {
  risks.push({
    id,
    title,
    severity: severityFromImpact(impactWeeks),
    impactWeeks,
    recommendation,
  })
}

function supplierCoverageRisk(input: TimelineInput) {
  const source = input.supplierRecommendations
  if (!source) return 0

  const values = normalizeSupplierValues(source)
  const weakCoverage = values.filter((value) => {
    if (isSupplierResult(value)) return !value.primarySupplier || value.primarySupplier.confidenceScore < 55
    return value.confidenceScore < 55
  })

  return weakCoverage.length
}

function isSupplierResult(value: SupplierRecommendation | SupplierRecommendationResult): value is SupplierRecommendationResult {
  return "primarySupplier" in value
}

function normalizeSupplierValues(source: NonNullable<TimelineInput["supplierRecommendations"]>): Array<SupplierRecommendation | SupplierRecommendationResult> {
  if (Array.isArray(source)) return source
  if (isSupplierResultLike(source)) return [source]
  return Object.values(source).filter((value): value is SupplierRecommendation | SupplierRecommendationResult => Boolean(value))
}

function isSupplierResultLike(value: NonNullable<TimelineInput["supplierRecommendations"]>): value is SupplierRecommendationResult {
  return typeof value === "object" && value !== null && "primarySupplier" in value && "alternativeSuppliers" in value
}

export function evaluateDelayRisks(input: TimelineInput): DelayRisk[] {
  const risks: DelayRisk[] = []
  const missingDocs = input.healthCheck?.missingCriticalDocuments ?? []
  const graphScheduleFactors = input.knowledgeGraph?.scheduleFactors ?? []
  const complexity = input.complexityScore ?? input.healthCheck?.complexityScore ?? input.project?.complexity_score ?? 50
  const riskScore = input.riskScore ?? input.healthCheck?.riskScore ?? input.project?.risk_score ?? 45
  const confidence = input.confidenceScore ?? input.healthCheck?.confidenceScore ?? input.project?.confidence_score ?? 65

  if (missingDocs.some((document) => document.toLowerCase().includes("quantidade") || document.toLowerCase().includes("medicao"))) {
    addRisk(risks, "missing-quantity-map", "Mapa Quantidades em falta", 4, "Adicionar mapa de quantidades antes de fechar cronograma e procurement.")
  }

  if (supplierCoverageRisk(input) > 0) {
    addRisk(risks, "supplier-coverage", "Fornecedor sem cobertura ou baixa confianca", 3, "Comparar fornecedores alternativos para especialidades criticas.")
  }

  if ((input.procurementPlan?.criticalItems.length ?? 0) > 0) {
    addRisk(risks, "procurement-critical", "Procurement atrasado em materiais criticos", 5, "Iniciar aquisicao dos materiais criticos e confirmar janelas de entrega.")
  }

  if (complexity >= 72) {
    addRisk(risks, "high-complexity", "Complexidade elevada", 3, "Validar interfaces entre especialidades antes de iniciar obra.")
  }

  if (riskScore >= 70) {
    addRisk(risks, "high-risk-score", "Risk Score elevado", 4, "Atacar primeiro os riscos documentais e tecnicos com maior impacto em prazo.")
  }

  if (confidence < 55) {
    addRisk(risks, "low-confidence", "Confianca baixa", 3, "Completar documentos e validar especialidades antes de fixar datas contratuais.")
  }

  for (const factor of graphScheduleFactors.slice(0, 2)) {
    addRisk(risks, `knowledge-graph-${factor.toLowerCase().replace(/\W+/g, "-")}`, factor, 2, "Validar fator de prazo identificado pelo Knowledge Graph.")
  }

  return risks.sort((left, right) => right.impactWeeks - left.impactWeeks).slice(0, 6)
}

export function buildTimelineActions(delayRisks: DelayRisk[]): TimelineAction[] {
  return delayRisks.map((risk) => ({
    id: `action-${risk.id}`,
    title: risk.recommendation,
    priority: risk.severity === "critical" ? "critical" : risk.severity === "high" ? "high" : risk.severity === "medium" ? "medium" : "low",
    impactWeeks: Math.max(1, Math.round(risk.impactWeeks * 0.65)),
    recommendation: risk.title,
  }))
}
