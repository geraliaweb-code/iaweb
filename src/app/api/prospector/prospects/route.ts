import { NextResponse } from "next/server"
import { assertCrmAccess } from "@/lib/crm-auth"
import { getProspectorSupabaseClient } from "@/lib/prospector/db"

export async function GET(request: Request) {
  const access = await assertCrmAccess()

  if (!access.ok) {
    return NextResponse.json({ error: "Autenticacao do CRM obrigatoria." }, { status: 401 })
  }

  const client = getProspectorSupabaseClient()

  if (!client.ok) {
    return NextResponse.json({ prospects: [], error: client.error.message }, { status: 200 })
  }

  const { searchParams } = new URL(request.url)
  let query = client.supabase.from("prospects").select("*").order("opportunity_score", { ascending: false })

  const nicho = searchParams.get("nicho")
  const cidade = searchParams.get("cidade")
  const priority = searchParams.get("priority")
  const status = searchParams.get("status")
  const scoreMin = Number(searchParams.get("scoreMin") ?? "")

  if (nicho) query = query.eq("nicho", nicho)
  if (cidade) query = query.ilike("cidade", `%${cidade}%`)
  if (priority) query = query.eq("priority_label", priority)
  if (status) query = query.eq("status", status)
  if (Number.isFinite(scoreMin) && scoreMin > 0) query = query.gte("opportunity_score", scoreMin)

  const { data, error } = await query.limit(100)

  if (error) {
    return NextResponse.json({ prospects: [], error: error.message }, { status: 500 })
  }

  return NextResponse.json({ prospects: data ?? [] })
}
