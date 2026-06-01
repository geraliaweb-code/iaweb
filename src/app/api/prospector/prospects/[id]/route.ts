import { NextResponse } from "next/server"
import { assertCrmAccess } from "@/lib/crm-auth"
import { getProspectorSupabaseClient } from "@/lib/prospector/db"

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function PATCH(request: Request, context: RouteContext) {
  const access = await assertCrmAccess()

  if (!access.ok) {
    return NextResponse.json({ error: "Autenticacao do CRM obrigatoria." }, { status: 401 })
  }

  const client = getProspectorSupabaseClient()

  if (!client.ok) {
    return NextResponse.json({ error: client.error.message }, { status: 503 })
  }

  const { id } = await context.params
  const payload = (await request.json().catch(() => ({}))) as { status?: string }
  const fields = {
    ...(payload.status ? { status: payload.status } : {}),
    updated_at: new Date().toISOString(),
  }
  const { data, error } = await client.supabase.from("prospects").update(fields).eq("id", id).select("*").single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ prospect: data })
}
