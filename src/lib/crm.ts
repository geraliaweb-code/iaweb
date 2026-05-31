import { createClient } from "@supabase/supabase-js"

export const crmStatuses = ["novo", "contactado", "reuniao", "proposta", "fechado", "perdido"] as const
export const crmSortFields = ["created_at", "score_geral"] as const
export const crmSortDirections = ["asc", "desc"] as const

export type CrmStatus = (typeof crmStatuses)[number]
export type CrmSortField = (typeof crmSortFields)[number]
export type CrmSortDirection = (typeof crmSortDirections)[number]

export type ListCrmLeadsOptions = {
  status?: CrmStatus
  search?: string
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
  score_geral: number
  status: string
  whatsapp_status: string | null
  whatsapp_message: string | null
  created_at: string
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
  if (status === "reuniao") return "Reunião"
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
      "id,empresa,nome_contacto,email,telefone,website,score_geral,status,whatsapp_status,whatsapp_message,created_at",
    )
    .order(sort, { ascending: direction === "asc" })

  if (options.status) {
    query = query.eq("status", options.status)
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
  const client = getSupabaseClient()

  if ("error" in client) {
    return { data: null, error: client.error }
  }

  const { data, error } = await client.supabase
    .from("diagnosticos")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id,status")
    .single()

  if (error) {
    return { data: null, error: { code: "SUPABASE_UPDATE_FAILED", message: error.message } }
  }

  return { data, error: null }
}
