export type CampaignChannel = "CALL" | "VISIT" | "EMAIL" | "WHATSAPP" | "NURTURE"
export type CampaignPriority = "P1" | "P2" | "P3" | "P4"
export type RecommendedSequence = "CALL_FIRST" | "EMAIL_FIRST" | "WHATSAPP_FIRST" | "VISIT_FIRST" | "NURTURE"

type CampaignInput = {
  propensity_score?: number | null
  propensity_label?: string | null
  conversion_probability?: number | null
  energy_score?: number | null
  pain_score?: number | null
  potential_value?: number | null
  score_digital?: number | null
  email?: string | null
  telefone?: string | null
  cidade?: string | null
  setor?: string | null
  nicho?: string | null
  empresa?: string | null
  next_best_action?: string | null
}

export type CampaignIntelligenceResult = {
  best_channel: CampaignChannel
  campaign_priority: CampaignPriority
  recommended_sequence: RecommendedSequence
  expected_conversion: number
  campaign_reason: string
  campaign_updated_at: string
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)))
}

function numeric(value: number | null | undefined, fallback = 0) {
  return Number.isFinite(value) ? Number(value) : fallback
}

function normalizedText(...values: Array<string | null | undefined>) {
  return values.filter(Boolean).join(" ").toLowerCase()
}

function isSmallLocalBusiness(input: CampaignInput) {
  const text = normalizedText(input.setor, input.nicho, input.empresa)
  return ["restaurante", "restaurantes", "clinica", "clinicas", "contabilidade", "retalho", "local", "pme"].some((term) => text.includes(term))
}

function highEnergyPotential(input: CampaignInput) {
  return numeric(input.energy_score) >= 78 || numeric(input.potential_value) >= 5000
}

export function getCampaignPriority(input: CampaignInput): CampaignPriority {
  const propensityScore = numeric(input.propensity_score)
  const conversionProbability = numeric(input.conversion_probability)
  if (propensityScore >= 90 || conversionProbability >= 0.72) return "P1"
  if (propensityScore >= 75) return "P2"
  if (propensityScore >= 55) return "P3"
  return "P4"
}

export function getBestChannel(input: CampaignInput): CampaignChannel {
  const propensityScore = numeric(input.propensity_score)
  const energyScore = numeric(input.energy_score)
  const painScore = numeric(input.pain_score)
  const hasPhone = Boolean(input.telefone)
  const hasEmail = Boolean(input.email)
  const hasCity = Boolean(input.cidade)

  if (propensityScore < 55 || (!hasPhone && !hasEmail)) return "NURTURE"
  if (propensityScore >= 90 && hasPhone && hasCity && highEnergyPotential(input)) return "VISIT"
  if (propensityScore >= 85 && hasPhone && (painScore >= 70 || energyScore >= 70)) return "CALL"
  if (hasPhone && isSmallLocalBusiness(input) && propensityScore >= 60) return "WHATSAPP"
  if (hasEmail && propensityScore >= 55) return "EMAIL"
  if (hasPhone && propensityScore >= 60) return "CALL"
  return "NURTURE"
}

export function getRecommendedSequence(channel: CampaignChannel): RecommendedSequence {
  if (channel === "CALL") return "CALL_FIRST"
  if (channel === "VISIT") return "VISIT_FIRST"
  if (channel === "EMAIL") return "EMAIL_FIRST"
  if (channel === "WHATSAPP") return "WHATSAPP_FIRST"
  return "NURTURE"
}

export function getExpectedConversion(input: CampaignInput & { bestChannel?: CampaignChannel; campaignPriority?: CampaignPriority }) {
  const baseProbability = numeric(input.conversion_probability, numeric(input.propensity_score) / 100)
  const channel = input.bestChannel ?? getBestChannel(input)
  const priority = input.campaignPriority ?? getCampaignPriority(input)
  const channelLift: Record<CampaignChannel, number> = {
    VISIT: 0.1,
    CALL: 0.08,
    WHATSAPP: 0.04,
    EMAIL: 0.02,
    NURTURE: -0.08,
  }
  const priorityLift: Record<CampaignPriority, number> = {
    P1: 0.07,
    P2: 0.04,
    P3: 0.01,
    P4: -0.04,
  }
  const contactPenalty = !input.email && !input.telefone ? -0.12 : 0
  const value = Math.max(0.01, Math.min(0.95, baseProbability + channelLift[channel] + priorityLift[priority] + contactPenalty))
  return Number(value.toFixed(4))
}

export function getCampaignReason(input: CampaignInput & { bestChannel?: CampaignChannel; campaignPriority?: CampaignPriority }) {
  const channel = input.bestChannel ?? getBestChannel(input)
  const priority = input.campaignPriority ?? getCampaignPriority(input)
  const reasons = [
    `propensity ${numeric(input.propensity_score)}/100`,
    `probabilidade ${Math.round(numeric(input.conversion_probability) * 100)}%`,
    input.telefone ? "telefone disponivel" : "telefone em falta",
    input.email ? "email disponivel" : "email em falta",
    input.cidade ? "localizacao conhecida" : "localizacao em falta",
    `canal ${channel}`,
    `prioridade ${priority}`,
  ]
  return reasons.join("; ")
}

export function calculateCampaignIntelligence(input: CampaignInput): CampaignIntelligenceResult {
  const bestChannel = getBestChannel(input)
  const campaignPriority = getCampaignPriority(input)
  const expectedConversion = getExpectedConversion({ ...input, bestChannel, campaignPriority })

  return {
    best_channel: bestChannel,
    campaign_priority: campaignPriority,
    recommended_sequence: getRecommendedSequence(bestChannel),
    expected_conversion: expectedConversion,
    campaign_reason: getCampaignReason({ ...input, bestChannel, campaignPriority }),
    campaign_updated_at: new Date().toISOString(),
  }
}
