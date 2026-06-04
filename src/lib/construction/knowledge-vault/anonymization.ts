import type { ConstructionKnowledgeVaultPayload } from "./vault-types"

export function anonymizeConstructionPayload(payload: ConstructionKnowledgeVaultPayload) {
  return {
    country: payload.country,
    typology: payload.typology,
    area_m2: payload.areaM2,
    document_count: payload.documentCount,
    specialties_detected: payload.specialtiesDetected,
    risks_summary: payload.risksSummary.map((risk) => ({ title: risk.title, severity: risk.severity })),
    cost_scenarios: payload.costScenarios,
    schedule_scenario: payload.scheduleScenario,
    confidence_score: payload.confidenceScore,
    benchmark: payload.benchmark,
  }
}
