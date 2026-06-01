import { NextResponse } from "next/server"
import { assertCrmAccess } from "@/lib/crm-auth"
import { getEmailHealth } from "@/lib/admin-email"

export const dynamic = "force-dynamic"

export async function GET() {
  const access = await assertCrmAccess()

  if (!access.ok) {
    return NextResponse.json({ error: "Autenticacao do CRM obrigatoria." }, { status: 401 })
  }

  const health = await getEmailHealth()

  return NextResponse.json(health)
}
