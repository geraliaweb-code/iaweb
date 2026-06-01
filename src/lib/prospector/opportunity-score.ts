import type { DigitalAnalysis, OpportunityScore, ProspectCompany } from "./types"

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)))
}

export function calculateOpportunityScore(company: ProspectCompany, analysis: DigitalAnalysis, monthlyPotential: number): OpportunityScore {
  const weakDigital = 100 - analysis.scoreDigital
  const ticketBoost = Math.min(20, (company.estimatedTicket ?? 500) / 500)
  const financeBoost = Math.min(22, monthlyPotential / 1500)
  const contactBoost = company.email || company.telefone ? 12 : 0
  const activeButWeakBoost = analysis.googlePresence && analysis.scoreDigital < 55 ? 12 : 0
  const outdatedBoost = !analysis.websiteExists || !analysis.modernWebsite ? 14 : 0
  const score = clamp(weakDigital * 0.45 + ticketBoost + financeBoost + contactBoost + activeButWeakBoost + outdatedBoost)
  const priorityLabel = score >= 82 ? "Critica" : score >= 66 ? "Alta" : score >= 45 ? "Media" : "Baixa"

  return {
    score,
    priorityLabel,
    reasons: [
      analysis.scoreDigital < 55 ? "Presenca digital fraca com margem comercial clara." : "Presenca digital com otimizacoes possiveis.",
      monthlyPotential > 5000 ? "Potencial financeiro relevante para contacto prioritario." : "Potencial financeiro moderado.",
      contactBoost ? "Contacto disponivel para abordagem comercial." : "Contacto a validar antes da abordagem.",
    ],
  }
}
