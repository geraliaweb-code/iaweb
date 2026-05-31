import { NextResponse } from "next/server"
import { assertCrmAccess } from "@/lib/crm-auth"
import type { CrmStatus } from "@/lib/crm"
import { isCrmStatus, updateCrmLead } from "@/lib/crm"

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

export async function PATCH(request: Request, context: RouteContext) {
  const access = await assertCrmAccess()

  if (!access.ok) {
    return NextResponse.json(
      {
        error:
          access.mode === "not-configured"
            ? "Autenticacao do CRM nao esta configurada."
            : "Autenticacao do CRM obrigatoria.",
      },
      { status: 401 },
    )
  }

  const { id } = await context.params
  const payload = (await request.json()) as { status?: string; notas?: string; proxima_acao?: string }

  if (payload.status !== undefined && !isCrmStatus(payload.status)) {
    return NextResponse.json({ error: "Status invalido." }, { status: 400 })
  }

  const { data, error } = await updateCrmLead(id, {
    status: payload.status as CrmStatus | undefined,
    notas: typeof payload.notas === "string" ? payload.notas : undefined,
    proxima_acao: typeof payload.proxima_acao === "string" ? payload.proxima_acao : undefined,
  })

  if (error) {
    return NextResponse.json({ error: error.message, code: error.code }, { status: error.code === "SUPABASE_NOT_CONFIGURED" ? 503 : 500 })
  }

  return NextResponse.json({ lead: data })
}
