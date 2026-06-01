export type ProspectCompany = {
  empresa: string
  contacto?: string
  email?: string
  telefone?: string
  website?: string
  cidade: string
  regiao?: string
  nicho: string
  keywords: string[]
  estimatedTicket?: number
  status?: string
  source?: string
}

export type DigitalAnalysis = {
  websiteExists: boolean
  modernWebsite: boolean
  mobileFriendly: boolean
  googlePresence: boolean
  reviews: number
  socialPresence: boolean
  whatsappVisible: boolean
  contactForm: boolean
  clearCta: boolean
  basicSeo: boolean
  perceivedSpeed: number
  digitalAuthority: number
  scoreDigital: number
  detectedProblems: string[]
  opportunities: string[]
  commercialRisk: "baixo" | "medio" | "alto"
}

export type OpportunityScore = {
  score: number
  priorityLabel: "Critica" | "Alta" | "Media" | "Baixa"
  reasons: string[]
}

export type MarketSegment = {
  niche: string
  label: string
  defaultTicket: number
  keywords: string[]
}

export type ProspectorFilters = {
  nicho?: string
  cidade?: string
  regiao?: string
  keywords?: string[]
  estimatedTicket?: number
  limit?: number
  scoreMin?: number
  scoreMax?: number
  status?: string
}

export type ProspectorResult = {
  company: ProspectCompany
  digitalAnalysis: DigitalAnalysis
  opportunity: OpportunityScore
  financialImpact: Record<string, unknown>
  homepage: Record<string, unknown>
  projectedScore: number
  improvement: number
  templateUsed: string
}
