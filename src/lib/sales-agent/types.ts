export type SalesAgentInput = {
  company: string
  contactName?: string
  niche: string
  city?: string
  currentScore: number
  projectedScore?: number
  improvementPoints?: number
  financialImpact?: {
    lostRevenueMonthly?: {
      min?: number
      max?: number
    }
    lostRevenueAnnual?: {
      min?: number
      max?: number
    }
    impactPhrase?: string
    opportunityLabel?: string
  } | null
  recommendedPlan?: string
  generatedHomepage?: Record<string, unknown> | null
  templateUsed?: string
  problems: string[]
  opportunities: string[]
}

export type ObjectionKey =
  | "nao_tenho_interesse_agora"
  | "ja_tenho_site"
  | "esta_caro"
  | "tenho_alguem"
  | "depois_vejo"
  | "nao_acredito"

export type SalesAgentMessages = {
  whatsappMessage: string
  emailSubject: string
  emailBody: string
  followup3d: string
  followup7d: string
  followup15d: string
  objectionResponses: Record<ObjectionKey, string>
  postProposalMessage: string
  postMeetingMessage: string
  status: "gerado"
}
