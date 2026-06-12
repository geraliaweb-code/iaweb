import { NextResponse } from "next/server"
import { assertCrmAccess } from "@/lib/crm-auth"
import { getCommandCenterData } from "@/lib/prospector/observability"

export const dynamic = "force-dynamic"

export async function GET() {
  const access = await assertCrmAccess()

  if (!access.ok) {
    return NextResponse.json({ error: "Autenticacao do CRM obrigatoria." }, { status: 401 })
  }

  const data = await getCommandCenterData()
  return NextResponse.json(data)
}
