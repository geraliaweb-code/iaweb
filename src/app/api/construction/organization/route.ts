import { NextResponse } from "next/server"
import {
  createConstructionOrganization,
  getConstructionAuthUser,
  getConstructionPrimaryMembership,
} from "@/lib/construction/auth"
import { getConstructionSupabaseClient, isConstructionCountry } from "@/lib/construction/db"

function readOrganizationPayload(body: Record<string, unknown>) {
  const name = typeof body.name === "string" ? body.name.trim() : ""
  const nif = typeof body.nif === "string" ? body.nif.trim() : ""
  const country = typeof body.country === "string" ? body.country : "Portugal"
  const address = typeof body.address === "string" ? body.address.trim() : ""
  return { name, nif, country, address }
}

export async function POST(request: Request) {
  const { user, error: authError } = await getConstructionAuthUser()

  if (!user) {
    return NextResponse.json({ error: authError ?? "Utilizador nao autenticado." }, { status: 401 })
  }

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>
  const payload = readOrganizationPayload(body)

  if (!payload.name) {
    return NextResponse.json({ error: "Nome da organizacao obrigatorio." }, { status: 400 })
  }

  if (!isConstructionCountry(payload.country)) {
    return NextResponse.json({ error: "Pais invalido." }, { status: 400 })
  }

  const organizationResult = await createConstructionOrganization({
    ownerId: user.id,
    name: payload.name,
    nif: payload.nif,
    country: payload.country,
    address: payload.address,
  })

  if (organizationResult.error) {
    return NextResponse.json({ error: organizationResult.error }, { status: 500 })
  }

  return NextResponse.json({ organization: organizationResult.data }, { status: 201 })
}

export async function PATCH(request: Request) {
  const { user, error: authError } = await getConstructionAuthUser()

  if (!user) {
    return NextResponse.json({ error: authError ?? "Utilizador nao autenticado." }, { status: 401 })
  }

  const membershipResult = await getConstructionPrimaryMembership(user.id)

  if (!membershipResult.membership || !membershipResult.organization) {
    return NextResponse.json({ error: "Sem organizacao associada." }, { status: 404 })
  }

  if (!["owner", "admin"].includes(membershipResult.membership.role)) {
    return NextResponse.json({ error: "Sem permissao para editar a organizacao." }, { status: 403 })
  }

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>
  const payload = readOrganizationPayload(body)

  if (!payload.name) {
    return NextResponse.json({ error: "Nome da organizacao obrigatorio." }, { status: 400 })
  }

  if (!isConstructionCountry(payload.country)) {
    return NextResponse.json({ error: "Pais invalido." }, { status: 400 })
  }

  const client = getConstructionSupabaseClient()

  if (!client.ok) {
    return NextResponse.json({ error: client.error.message }, { status: 503 })
  }

  const { data, error } = await client.supabase
    .from("construction_organizations")
    .update({
      name: payload.name,
      nif: payload.nif || null,
      country: payload.country,
      address: payload.address || null,
    })
    .eq("id", membershipResult.organization.id)
    .select("id,name,nif,country,address,subscription_plan,created_at")
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ organization: data })
}
