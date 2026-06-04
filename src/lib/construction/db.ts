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

export async function listConstructionProjects(limit = 20) {
  const client = getConstructionSupabaseClient()

  if (!client.ok) {
    return { data: [] as ConstructionProject[], error: client.error }
  }

  const { data, error } = await client.supabase
    .from("construction_projects")
    .select(
      "id,organization_id,name,project_type,country,language,technical_country,city,estimated_area_m2,client_type,status,maturity_score,risk_score,complexity_score,confidence_score,analyses_count,created_at,updated_at",
    )
    .order("created_at", { ascending: false })
    .limit(limit)

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
    .select(
      "id,organization_id,name,project_type,country,language,technical_country,city,estimated_area_m2,client_type,status,maturity_score,risk_score,complexity_score,confidence_score,analyses_count,created_at,updated_at",
    )
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
    })
    .select(
      "id,organization_id,name,project_type,country,language,technical_country,city,estimated_area_m2,client_type,status,maturity_score,risk_score,complexity_score,confidence_score,analyses_count,created_at,updated_at",
    )
    .single()

  if (error) {
    return { data: null, error: { code: "SUPABASE_INSERT_FAILED", message: error.message } }
  }

  return { data: data as ConstructionProject, error: null }
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
