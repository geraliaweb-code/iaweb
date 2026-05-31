import { NextResponse } from "next/server"
import { getCrmAccessContext, setCrmSessionCookie, validateCrmCredential } from "@/lib/crm-auth"

export async function POST(request: Request) {
  const context = await getCrmAccessContext()

  if (!context.enabled) {
    return NextResponse.json({ ok: true, mode: "open" })
  }

  if (!context.configured) {
    return NextResponse.json(
      { error: "Autenticacao do CRM nao esta configurada." },
      { status: 503 },
    )
  }

  const payload = (await request.json().catch(() => null)) as { credential?: string } | null
  const credential = payload?.credential?.trim() ?? ""

  if (!validateCrmCredential(credential)) {
    return NextResponse.json({ error: "Credenciais invalidas." }, { status: 401 })
  }

  await setCrmSessionCookie()

  return NextResponse.json({ ok: true })
}
