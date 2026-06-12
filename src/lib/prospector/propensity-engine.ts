type PropensityInput = {
  energy_score?: number | null
  pain_score?: number | null
  setor?: string | null
  nicho?: string | null
  atividade?: string | null
  score_digital?: number | null
  website?: string | null
  email?: string | null
  telefone?: string | null
  whatsapp?: string | null
  problemas_detectados?: string[] | null
  oportunidades?: string[] | null
  sinais_score?: Record<string, unknown> | null
  priority_label?: string | null
  classificacao?: string | null
}

export type PropensityResult = {
  propensity_score: number
  propensity_label: string
  conversion_probability: number
  next_best_action: string
  propensity_updated_at: string
}

const highIntentSectors = ["industria", "hotelaria", "restaurantes", "clinicas", "imobiliario", "retalho", "contabilidade", "construcao"]

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)))
}

function numeric(value: number | null | undefined, fallback = 0) {
  return Number.isFinite(value) ? Number(value) : fallback
}

function sectorScore(input: PropensityInput) {
  const sector = `${input.setor ?? ""} ${input.nicho ?? ""} ${input.atividade ?? ""}`.toLowerCase()
  if (!sector.trim()) return 45
  if (highIntentSectors.some((item) => sector.includes(item))) return 88
  if (sector.includes("servico") || sector.includes("local") || sector.includes("comercio")) return 70
  return 55
}

function digitalQualityScore(input: PropensityInput) {
  const scoreDigital = numeric(input.score_digital, 0)
  if (scoreDigital > 0) return clamp(100 - Math.abs(55 - scoreDigital))
  return input.website ? 58 : 72
}

function contactabilityScore(input: PropensityInput) {
  const contacts = [input.email, input.telefone, input.whatsapp].filter(Boolean).length
  if (contacts >= 2) return 100
  if (contacts === 1) return 72
  return 30
}

function buyingSignalScore(input: PropensityInput) {
  let score = 35
  const priority = (input.priority_label ?? "").toLowerCase()
  const classification = (input.classificacao ?? "").toLowerCase()
  const problems = input.problemas_detectados?.length ?? 0
  const opportunities = input.oportunidades?.length ?? 0
  const signals = input.sinais_score ? Object.values(input.sinais_score).filter(Boolean).length : 0

  if (priority.includes("crit")) score += 30
  else if (priority.includes("alta")) score += 22
  else if (priority.includes("media")) score += 10

  if (classification.includes("crit")) score += 15
  if (classification.includes("oportunidade")) score += 9
  score += Math.min(12, problems * 4)
  score += Math.min(8, opportunities * 2)
  score += Math.min(8, signals)

  return clamp(score)
}

export function getPropensityLabel(score: number) {
  if (score >= 95) return "Critico"
  if (score >= 80) return "Muito Quente"
  if (score >= 60) return "Oportunidade"
  if (score >= 40) return "Morno"
  return "Baixo Interesse"
}

export function calculateConversionProbability(propensityScore: number) {
  const score = clamp(propensityScore)
  if (score >= 95) return 0.82 + (score - 95) * 0.025
  if (score >= 80) return 0.58 + (score - 80) * 0.014
  if (score >= 60) return 0.34 + (score - 60) * 0.012
  if (score >= 40) return 0.16 + (score - 40) * 0.009
  return 0.04 + score * 0.003
}

export function getNextBestAction(input: { propensityScore: number; conversionProbability?: number; hasPhone?: boolean; hasEmail?: boolean; hasWhatsApp?: boolean }) {
  const score = clamp(input.propensityScore)
  if (score >= 95) return input.hasPhone ? "ligar nas proximas 24h" : "visita presencial"
  if (score >= 80) return input.hasEmail ? "enviar email + follow-up" : "ligar nas proximas 24h"
  if (score >= 60) return input.hasWhatsApp ? "enviar WhatsApp" : "enviar email + follow-up"
  if (score >= 40) return "nutricao futura"
  return "nutricao futura"
}

export function calculatePropensityScore(input: PropensityInput): PropensityResult {
  const energyScore = numeric(input.energy_score, 0)
  const painScore = numeric(input.pain_score, 0)
  const score = clamp(
    energyScore * 0.35 +
      painScore * 0.25 +
      sectorScore(input) * 0.15 +
      digitalQualityScore(input) * 0.1 +
      contactabilityScore(input) * 0.1 +
      buyingSignalScore(input) * 0.05,
  )
  const conversionProbability = Number(calculateConversionProbability(score).toFixed(4))

  return {
    propensity_score: score,
    propensity_label: getPropensityLabel(score),
    conversion_probability: conversionProbability,
    next_best_action: getNextBestAction({
      propensityScore: score,
      conversionProbability,
      hasPhone: Boolean(input.telefone),
      hasEmail: Boolean(input.email),
      hasWhatsApp: Boolean(input.whatsapp ?? input.telefone),
    }),
    propensity_updated_at: new Date().toISOString(),
  }
}
