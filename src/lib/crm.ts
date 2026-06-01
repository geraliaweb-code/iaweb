import { createClient } from "@supabase/supabase-js"

export const crmStatuses = ["novo", "contactado", "reuniao", "simulacao", "proposta", "negociacao", "fechado", "perdido"] as const
export const crmSortFields = ["created_at", "score_geral"] as const
export const crmSortDirections = ["asc", "desc"] as const

export type CrmStatus = (typeof crmStatuses)[number]
export type CrmSortField = (typeof crmSortFields)[number]
export type CrmSortDirection = (typeof crmSortDirections)[number]

export type ListCrmLeadsOptions = {
  status?: CrmStatus
  search?: string
  niche?: string
  sort?: CrmSortField
  direction?: CrmSortDirection
}

export type CrmLead = {
  id: string
  empresa: string
  nome_contacto: string
  email: string
  telefone: string
  website: string
  setor: string
  objetivo: string
  score_geral: number
  score_website: number
  score_google: number
  score_conversao: number
  score_automacao: number
  score_crm: number
  status: string
  origem: string
  proxima_acao: string
  notas: string
  perda_mensal_estimada: number
  impacto_financeiro: Record<string, unknown> | null
  plano_recomendado: string
  homepage_gerada: Record<string, unknown> | null
  score_projetado: number
  melhoria_prevista: number
  template_utilizado: string
  whatsapp_status: string | null
  whatsapp_message: string | null
  email_subject: string | null
  email_body: string | null
  followup_3d: string | null
  followup_7d: string | null
  followup_15d: string | null
  objection_responses: Record<string, string> | null
  post_proposal_message: string | null
  post_meeting_message: string | null
  sales_agent_status: string | null
  created_at: string
  updated_at: string
}

export type CrmSupabaseConfigError = {
  code: "SUPABASE_NOT_CONFIGURED"
  message: string
}

export function isCrmStatus(value: string): value is CrmStatus {
  return crmStatuses.includes(value as CrmStatus)
}

export function isCrmSortField(value: string): value is CrmSortField {
  return crmSortFields.includes(value as CrmSortField)
}

export function isCrmSortDirection(value: string): value is CrmSortDirection {
  return crmSortDirections.includes(value as CrmSortDirection)
}

export function getCrmStatusLabel(status: string) {
  if (status === "reuniao") return "Reuniao"
  if (status === "simulacao") return "Simulacao"
  if (status === "negociacao") return "Negociacao"
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    return {
      error: {
        code: "SUPABASE_NOT_CONFIGURED",
        message: "Supabase nao esta configurado. Define NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.",
      } satisfies CrmSupabaseConfigError,
    }
  }

  return {
    supabase: createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }),
  }
}

export async function listCrmLeads(options: ListCrmLeadsOptions = {}) {
  const client = getSupabaseClient()

  if ("error" in client) {
    return { data: null, error: client.error }
  }

  const sort = options.sort ?? "created_at"
  const direction = options.direction ?? "desc"

  let query = client.supabase
    .from("diagnosticos")
    .select(
      "id,empresa,nome_contacto,email,telefone,website,setor,objetivo,score_geral,score_website,score_google,score_conversao,score_automacao,score_crm,status,origem,proxima_acao,notas,perda_mensal_estimada,impacto_financeiro,plano_recomendado,homepage_gerada,score_projetado,melhoria_prevista,template_utilizado,whatsapp_status,whatsapp_message,email_subject,email_body,followup_3d,followup_7d,followup_15d,objection_responses,post_proposal_message,post_meeting_message,sales_agent_status,created_at,updated_at",
    )
    .order(sort, { ascending: direction === "asc" })

  if (options.status) {
    query = query.eq("status", options.status)
  }

  if (options.niche?.trim()) {
    query = query.eq("setor", options.niche.trim())
  }

  if (options.search?.trim()) {
    const search = options.search.trim().replaceAll("%", "\\%").replaceAll("_", "\\_")
    query = query.or(`empresa.ilike.%${search}%,email.ilike.%${search}%,telefone.ilike.%${search}%`)
  }

  const { data, error } = await query

  if (error) {
    return { data: null, error: { code: "SUPABASE_QUERY_FAILED", message: error.message } }
  }

  return { data: (data ?? []) as CrmLead[], error: null }
}

export async function updateCrmLeadStatus(id: string, status: CrmStatus) {
  return updateCrmLead(id, { status })
}

export async function updateCrmLead(id: string, fields: { status?: CrmStatus; notas?: string; proxima_acao?: string }) {
  const client = getSupabaseClient()

  if ("error" in client) {
    return { data: null, error: client.error }
  }

  const { data, error } = await client.supabase
    .from("diagnosticos")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id,status,notas,proxima_acao")
    .single()

  if (error) {
    return { data: null, error: { code: "SUPABASE_UPDATE_FAILED", message: error.message } }
  }

  return { data, error: null }
}
