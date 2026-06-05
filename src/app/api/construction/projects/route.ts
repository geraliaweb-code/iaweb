import { NextResponse } from "next/server"
import {
  createConstructionLead,
  createConstructionProject,
  listConstructionProjects,
  validateConstructionLeadInput,
  validateConstructionProjectInput,
} from "@/lib/construction/db"
import { getConstructionAccountContext, getConstructionAuthUser } from "@/lib/construction/auth"

export async function GET() {
  const { user } = await getConstructionAuthUser()
  const context = await getConstructionAccountContext(user)
  const { data, error } = await listConstructionProjects(100, {
    userId: user?.id ?? null,
    organizationId: context.organization?.id ?? null,
  })

  if (error) {
    return NextResponse.json({ projects: data, error: error.message }, { status: error.code === "SUPABASE_NOT_CONFIGURED" ? 200 : 500 })
  }

  return NextResponse.json({ projects: data })
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>
  const validation = validateConstructionProjectInput(body)
  const leadBody = typeof body.lead === "object" && body.lead !== null ? (body.lead as Record<string, unknown>) : null
  const { user } = await getConstructionAuthUser()
  const context = await getConstructionAccountContext(user)

  if (!validation.ok) {
    return NextResponse.json({ error: validation.error.message }, { status: 400 })
  }

  const leadValidation = leadBody ? validateConstructionLeadInput(leadBody) : null

  if (leadValidation && !leadValidation.ok) {
    return NextResponse.json({ error: leadValidation.error.message }, { status: 400 })
  }

  const { data, error } = await createConstructionProject({
    ...validation.data,
    userId: context.organization?.id ? null : user?.id ?? null,
    organizationId: context.organization?.id ?? null,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.code === "SUPABASE_NOT_CONFIGURED" ? 503 : 500 })
  }

  if (!leadValidation) {
    return NextResponse.json({ project: data }, { status: 201 })
  }

  const leadResult = await createConstructionLead(leadValidation.data, data?.id ?? null)

  if (leadResult.error) {
    return NextResponse.json({ error: leadResult.error.message }, { status: leadResult.error.code === "SUPABASE_NOT_CONFIGURED" ? 503 : 500 })
  }

  return NextResponse.json({ project: data, lead: leadResult.data }, { status: 201 })
}
