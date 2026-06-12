import type { AutomaticDiagnosis, DigitalAnalysis, ProspectClassification, ProspectCompany, ProspectScore } from "./types"

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)))
}

export function classifyProspect(score: number): ProspectClassification {
  if (score <= 40) return "Critico"
  if (score <= 70) return "Oportunidade"
  return "Forte"
}

export function calculateProspectScore(company: ProspectCompany, analysis: DigitalAnalysis): ProspectScore {
  const visibleContacts = Boolean(company.email || company.telefone || analysis.whatsappVisible)
  const speedScore = Math.min(12, Math.round((analysis.perceivedSpeed / 100) * 12))
  const score = clamp(
    (analysis.websiteExists ? 12 : 0) +
      (analysis.httpsEnabled ? 8 : 0) +
      (analysis.mobileFriendly ? 12 : 0) +
      (analysis.googlePresence ? 10 : 0) +
      (analysis.socialPresence ? 8 : 0) +
      speedScore +
      (visibleContacts ? 10 : 0) +
      (analysis.contactForm ? 10 : 0) +
      (analysis.clearCta ? 10 : 0) +
      (analysis.basicSeo ? 10 : 0),
  )

  return {
    score,
    classification: classifyProspect(score),
    signals: {
      website: analysis.websiteExists,
      https: analysis.httpsEnabled,
      mobile: analysis.mobileFriendly,
      googleBusiness: analysis.googlePresence,
      social: analysis.socialPresence,
      speed: analysis.perceivedSpeed,
      visibleContacts,
      form: analysis.contactForm,
      cta: analysis.clearCta,
      seo: analysis.basicSeo,
    },
  }
}

export function generateAutomaticDiagnosis(
  company: ProspectCompany,
  analysis: DigitalAnalysis,
  prospectScore: ProspectScore,
  monthlyPotential: number,
): AutomaticDiagnosis {
  const problemas = [
    ...analysis.detectedProblems,
    !analysis.httpsEnabled ? "HTTPS ausente ou nao confirmado." : "",
    !analysis.googlePresence ? "Google Business Profile ausente ou fraco." : "",
    !analysis.socialPresence ? "Redes sociais pouco conectadas ao funil comercial." : "",
  ].filter(Boolean)

  const oportunidades = [
    ...analysis.opportunities,
    prospectScore.score <= 70 ? "Priorizar uma experiencia mobile com contacto imediato." : "",
    monthlyPotential >= 5000 ? "Ativar abordagem comercial urgente pelo valor mensal estimado." : "Criar cadencia comercial leve para validar interesse.",
  ].filter(Boolean)

  const proximaAcao =
    prospectScore.classification === "Critico"
      ? "Contactar em 24h com diagnostico curto e proposta de recuperacao digital."
      : prospectScore.classification === "Oportunidade"
        ? "Enviar abordagem consultiva com melhoria projetada e prova visual."
        : "Validar decisor e propor otimizacao premium para escalar captacao."

  return {
    problemas,
    oportunidades,
    potencialEstimadoMensal: monthlyPotential,
    resumoExecutivo: `${company.empresa} foi classificada como ${prospectScore.classification} com score ${prospectScore.score}/100. O maior ganho esta em corrigir os sinais digitais que travam contacto, prova e conversao.`,
    proximaAcao,
  }
}
