import { NextResponse } from "next/server"
import { assertCrmAccess } from "@/lib/crm-auth"
import type { CrmSortDirection, CrmSortField, CrmStatus } from "@/lib/crm"
import { isCrmSortDirection, isCrmSortField, isCrmStatus, listCrmLeads } from "@/lib/crm"

export async function GET(request: Request) {
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

  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const niche = searchParams.get("niche") ?? undefined
  const search = searchParams.get("q") ?? undefined
  const sort = searchParams.get("sort")
  const direction = searchParams.get("direction")
  let statusFilter: CrmStatus | undefined
  let sortField: CrmSortField | undefined
  let sortDirection: CrmSortDirection | undefined

  if (status && isCrmStatus(status)) {
    statusFilter = status
  } else if (status) {
    return NextResponse.json({ error: "Status invalido." }, { status: 400 })
  }

  if (sort && isCrmSortField(sort)) {
    sortField = sort
  } else if (sort) {
    return NextResponse.json({ error: "Ordenacao invalida." }, { status: 400 })
  }

  if (direction && isCrmSortDirection(direction)) {
    sortDirection = direction
  } else if (direction) {
    return NextResponse.json({ error: "Direcao de ordenacao invalida." }, { status: 400 })
  }

  const { data, error } = await listCrmLeads({
    status: statusFilter,
    niche,
    search,
    sort: sortField,
    direction: sortDirection,
  })

  if (error) {
    return NextResponse.json({ error: error.message, code: error.code }, { status: error.code === "SUPABASE_NOT_CONFIGURED" ? 503 : 500 })
  }

  return NextResponse.json({ leads: data })
}
