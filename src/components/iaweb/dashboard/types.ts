import type { CrmLead } from "@/lib/crm"

export type DashboardProspect = {
  id: string
  empresa: string
  contacto?: string | null
  email?: string | null
  telefone?: string | null
  website?: string | null
  cidade?: string | null
  nicho: string
  score_digital: number
  opportunity_score: number
  priority_label: string
  impacto_financeiro: {
    lostRevenueMonthly?: { min?: number; max?: number }
    lostRevenueAnnual?: { min?: number; max?: number }
  } | null
  status: string
  created_at?: string
  updated_at?: string
}

export type ExecutiveDashboardData = {
  prospects: DashboardProspect[]
  leads: CrmLead[]
  warning?: string
}
