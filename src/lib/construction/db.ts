import { createClient } from "@supabase/supabase-js"
import {
  constructionClientTypes,
  constructionCountries,
  constructionLanguages,
  constructionProjectTypes,
  constructionTechnicalCountries,
  type ConstructionClientType,
  type ConstructionCountry,
  type ConstructionLanguage,
  type ConstructionLeadInput,
  type ConstructionLeadRecord,
  type ConstructionLeadType,
  type ConstructionProject,
  type ConstructionProjectInput,
  type ConstructionProjectType,
  type ConstructionQueryError,
  type ConstructionStats,
  type ConstructionSupabaseConfigError,
  type ConstructionTechnicalCountry,
} from "./types"

type ConstructionSupabaseClient = ReturnType<typeof createClient<any, "public", any>>

type ConstructionClientResult =
  | {
      ok: true
      supabase: ConstructionSupabaseClient
    }
  | {
      ok: false
      error: ConstructionSupabaseConfigError
    }

export function getConstructionSupabaseClient(): ConstructionClientResult {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    return {
      ok: false,
      error: {
        code: "SUPABASE_NOT_CONFIGURED",
        message: "Supabase nao esta configurado. Define NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.",
      },
    }
  }

  return {
    ok: true,
    supabase: createClient<any, "public", any>(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }),
  }
}

export function isConstructionProjectType(value: string): value is ConstructionProjectType {
  return constructionProjectTypes.includes(value as ConstructionProjectType)
}

export function isConstructionCountry(value: string): value is ConstructionCountry {
  return constructionCountries.includes(value as ConstructionCountry)
}

export function isConstructionClientType(value: string): value is ConstructionClientType {
  return constructionClientTypes.includes(value as ConstructionClientType)
}

export function isConstructionLeadType(value: string): value is ConstructionLeadType {
  return value === "particular" || value === "empresa"
}

export function isConstructionLanguage(value: string): value is ConstructionLanguage {
  return constructionLanguages.includes(value as ConstructionLanguage)
}

export function isConstructionTechnicalCountry(value: string): value is ConstructionTechnicalCountry {
  return constructionTechnicalCountries.includes(value as ConstructionTechnicalCountry)
}

export function validateConstructionProjectInput(input: Record<string, unknown>):
  | { ok: true; data: ConstructionProjectInput }
  | { ok: false; error: ConstructionQueryError } {
  const name = typeof input.name === "string" ? input.name.trim() : ""
  const projectType = typeof input.projectType === "string" ? input.projectType : ""
  const country = typeof input.country === "string" ? input.country : ""
  const language = typeof input.language === "string" ? input.language : "pt"
  const technicalCountry = typeof input.technicalCountry === "string" ? input.technicalCountry : "portugal"
  const city = typeof input.city === "string" ? input.city.trim() : ""
  const clientType = typeof input.clientType === "string" ? input.clientType : ""
  const rawArea = input.estimatedAreaM2
  const estimatedAreaM2 =
    rawArea === null || rawArea === undefined || rawArea === ""
      ? null
      : typeof rawArea === "number"
        ? rawArea
        : Number(rawArea)

  if (!name) {
    return { ok: false, error: { code: "VALIDATION_FAILED", message: "Nome do projeto obrigatorio." } }
  }

  if (!isConstructionProjectType(projectType)) {
    return { ok: false, error: { code: "VALIDATION_FAILED", message: "Tipo de obra invalido." } }
  }

  if (!isConstructionCountry(country)) {
    return { ok: false, error: { code: "VALIDATION_FAILED", message: "Pais invalido." } }
  }

  if (!isConstructionLanguage(language)) {
    return { ok: false, error: { code: "VALIDATION_FAILED", message: "Idioma invalido." } }
  }

  if (!isConstructionTechnicalCountry(technicalCountry)) {
    return { ok: false, error: { code: "VALIDATION_FAILED", message: "Pais tecnico invalido." } }
  }

  if (!city) {
    return { ok: false, error: { code: "VALIDATION_FAILED", message: "Cidade obrigatoria." } }
  }

  if (!isConstructionClientType(clientType)) {
    return { ok: false, error: { code: "VALIDATION_FAILED", message: "Tipo de cliente invalido." } }
  }

  if (estimatedAreaM2 !== null && (!Number.isFinite(estimatedAreaM2) || estimatedAreaM2 <= 0)) {
    return { ok: false, error: { code: "VALIDATION_FAILED", message: "Area estimada invalida." } }
  }

  return {
    ok: true,
    data: {
      name,
      projectType,
      country,
      language,
      technicalCountry,
      city,
      estimatedAreaM2,
      clientType,
    },
  }
}

export function validateConstructionLeadInput(input: Record<string, unknown>):
  | { ok: true; data: ConstructionLeadInput }
  | { ok: false; error: ConstructionQueryError } {
  const name = typeof input.name === "string" ? input.name.trim() : ""
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : ""
  const phone = typeof input.phone === "string" ? input.phone.trim() : ""
  const company = typeof input.company === "string" ? input.company.trim() : ""
  const nif = typeof input.nif === "string" ? input.nif.trim() : ""
  const address = typeof input.address === "string" ? input.address.trim() : ""
  const country = typeof input.country === "string" ? input.country : ""
  const leadType = typeof input.leadType === "string" ? input.leadType : ""

  if (!name) {
    return { ok: false, error: { code: "VALIDATION_FAILED", message: "Nome obrigatorio." } }
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: { code: "VALIDATION_FAILED", message: "Email invalido." } }
  }

  if (!phone) {
    return { ok: false, error: { code: "VALIDATION_FAILED", message: "Telefone obrigatorio." } }
  }

  if (!company) {
    return { ok: false, error: { code: "VALIDATION_FAILED", message: "Empresa obrigatoria." } }
  }

  if (!nif) {
    return { ok: false, error: { code: "VALIDATION_FAILED", message: "NIF obrigatorio." } }
  }

  if (!address) {
    return { ok: false, error: { code: "VALIDATION_FAILED", message: "Morada obrigatoria." } }
  }

  if (!isConstructionCountry(country)) {
    return { ok: false, error: { code: "VALIDATION_FAILED", message: "Pais invalido." } }
  }

  if (!isConstructionLeadType(leadType)) {
    return { ok: false, error: { code: "VALIDATION_FAILED", message: "Tipo de lead invalido." } }
  }

  return {
    ok: true,
    data: {
      name,
      email,
      phone,
      company,
      nif,
      address,
      country,
      leadType,
    },
  }
}

type ConstructionProjectScope = {
  userId?: string | null
  organizationId?: string | null
}

const constructionProjectSelect =
  "id,organization_id,user_id,name,project_type,country,language,technical_country,city,estimated_area_m2,client_type,status,maturity_score,risk_score,complexity_score,confidence_score,analyses_count,created_at,updated_at"

export async function listConstructionProjects(limit = 20, scope?: ConstructionProjectScope) {
  const client = getConstructionSupabaseClient()

  if (!client.ok) {
    return { data: [] as ConstructionProject[], error: client.error }
  }

  let query = client.supabase
    .from("construction_projects")
    .select(constructionProjectSelect)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (scope?.organizationId) {
    query = query.eq("organization_id", scope.organizationId)
  } else if (scope?.userId) {
    query = query.eq("user_id", scope.userId)
  }

  const { data, error } = await query

  if (error) {
    return { data: [] as ConstructionProject[], error: { code: "SUPABASE_QUERY_FAILED", message: error.message } }
  }

  return { data: (data ?? []) as ConstructionProject[], error: null }
}

export async function getConstructionProject(id: string) {
  const client = getConstructionSupabaseClient()

  if (!client.ok) {
    return { data: null, error: client.error }
  }

  const { data, error } = await client.supabase
    .from("construction_projects")
    .select(constructionProjectSelect)
    .eq("id", id)
    .single()

  if (error) {
    return { data: null, error: { code: error.code === "PGRST116" ? "NOT_FOUND" : "SUPABASE_QUERY_FAILED", message: error.message } }
  }

  return { data: data as ConstructionProject, error: null }
}

export async function createConstructionProject(input: ConstructionProjectInput) {
  const client = getConstructionSupabaseClient()

  if (!client.ok) {
    return { data: null, error: client.error }
  }

  const { data, error } = await client.supabase
    .from("construction_projects")
    .insert({
      name: input.name,
      project_type: input.projectType,
      country: input.country,
      language: input.language,
      technical_country: input.technicalCountry,
      city: input.city,
      estimated_area_m2: input.estimatedAreaM2,
      client_type: input.clientType,
      user_id: input.userId ?? null,
      organization_id: input.organizationId ?? null,
    })
    .select(constructionProjectSelect)
    .single()

  if (error) {
    return { data: null, error: { code: "SUPABASE_INSERT_FAILED", message: error.message } }
  }

  return { data: data as ConstructionProject, error: null }
}

export async function createConstructionLead(input: ConstructionLeadInput, projectId: string | null) {
  const client = getConstructionSupabaseClient()

  if (!client.ok) {
    return { data: null, error: client.error }
  }

  const { data, error } = await client.supabase
    .from("construction_leads")
    .insert({
      name: input.name,
      email: input.email,
      phone: input.phone,
      company: input.company,
      nif: input.nif,
      address: input.address,
      country: input.country,
      lead_type: input.leadType,
      project_id: projectId,
    })
    .select("id,name,email,phone,company,nif,address,country,lead_type,project_id,created_at")
    .single()

  if (error) {
    return { data: null, error: { code: "SUPABASE_INSERT_FAILED" as const, message: error.message } }
  }

  return { data: data as ConstructionLeadRecord, error: null }
}

export function getConstructionStats(projects: ConstructionProject[]): ConstructionStats {
  const riskScores = projects.map((project) => project.risk_score).filter((score): score is number => typeof score === "number")
  const maturityScores = projects
    .map((project) => project.maturity_score)
    .filter((score): score is number => typeof score === "number")

  return {
    totalProjects: projects.length,
    analysesDone: projects.reduce((total, project) => total + (project.analyses_count ?? 0), 0),
    averageRisk: riskScores.length ? Math.round(riskScores.reduce((total, score) => total + score, 0) / riskScores.length) : 0,
    averageMaturity: maturityScores.length
      ? Math.round(maturityScores.reduce((total, score) => total + score, 0) / maturityScores.length)
      : 0,
  }
}
