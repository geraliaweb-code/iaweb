import { NextResponse } from "next/server"

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function isValidConstructionProjectId(projectId: string) {
  return uuidPattern.test(projectId)
}

export function invalidConstructionProjectResponse() {
  return NextResponse.json({ error: "Identificador de projeto invalido." }, { status: 400 })
}

export function getConstructionProductionEnvStatus() {
  const requiredServerVariables = ["OPENAI_API_KEY", "SUPABASE_SERVICE_ROLE_KEY"] as const
  const requiredPublicVariables = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"] as const
  const optionalServerVariables = ["CONSTRUCTION_AI_MODEL"] as const

  return {
    requiredServerVariables,
    requiredPublicVariables,
    optionalServerVariables,
  }
}
