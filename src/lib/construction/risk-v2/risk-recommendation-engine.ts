import type { RiskAssessment, RiskCategory, RiskRecommendation, RiskSeverity } from "./types"

const categoryAction: Record<RiskCategory, string> = {
  documental: "Completar documentacao critica e validar coerencia entre pecas tecnicas.",
  financeiro: "Rever rubricas com maior variacao e negociar alternativas antes de adjudicar.",
  prazo: "Atacar dependencias do caminho critico e atualizar o plano temporal.",
  fornecedor: "Comparar fornecedor recomendado com alternativas de cobertura superior.",
  procurement: "Iniciar procurement dos materiais criticos e confirmar janelas de entrega.",
  especialidades: "Validar interfaces entre especialidades antes de bloquear custo e prazo.",
  compliance: "Confirmar requisitos regulamentares e licenciamento aplicaveis.",
  benchmark: "Rever desvios face ao benchmark e justificar rubricas acima da media.",
  execucao: "Criar plano de execucao por fase com responsaveis e pontos de controlo.",
  mercado: "Rever exposicao a variacao de precos e disponibilidade no mercado.",
}

const severityFinancialReduction: Record<RiskSeverity, number> = {
  critical: 24,
  high: 18,
  medium: 11,
  low: 6,
}

export function buildRiskRecommendation(title: string, category: RiskCategory, severity: RiskSeverity, timelineWeeks: number): RiskRecommendation {
  return {
    title: categoryAction[category],
    action: `${categoryAction[category]} Esta acao pode reduzir o risco "${title}".`,
    expectedFinancialReductionPercent: severityFinancialReduction[severity],
    expectedWeeksReduction: Math.max(1, Math.round(timelineWeeks * 0.62)),
    confidenceGain: severity === "critical" ? 12 : severity === "high" ? 8 : severity === "medium" ? 5 : 2,
  }
}

export function uniqueRiskRecommendations(risks: RiskAssessment[]) {
  const seen = new Set<string>()
  return risks.map((risk) => risk.recommendation).filter((recommendation) => {
    if (seen.has(recommendation.title)) return false
    seen.add(recommendation.title)
    return true
  })
}
