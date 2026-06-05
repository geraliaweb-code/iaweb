import { NextResponse } from "next/server"
import {
  createConstructionOrganization,
  getConstructionAuthUser,
  normalizeConstructionUserType,
  upsertConstructionProfile,
} from "@/lib/construction/auth"
import { isConstructionCountry } from "@/lib/construction/db"

export async function POST(request: Request) {
  const { user, error: authError } = await getConstructionAuthUser()

  if (!user) {
    return NextResponse.json({ error: authError ?? "Utilizador nao autenticado." }, { status: 401 })
  }

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>
  const name = typeof body.name === "string" ? body.name.trim() : ""
  const phone = typeof body.phone === "string" ? body.phone.trim() : ""
  const country = typeof body.country === "string" ? body.country : "Portugal"
  const userType = normalizeConstructionUserType(body.userType)

  if (!name) {
    return NextResponse.json({ error: "Nome obrigatorio." }, { status: 400 })
  }

  if (!isConstructionCountry(country)) {
    return NextResponse.json({ error: "Pais invalido." }, { status: 400 })
  }

  const profileResult = await upsertConstructionProfile({
    id: user.id,
    name,
    email: user.email ?? "",
    phone,
    country,
    userType,
  })

  if (profileResult.error) {
    return NextResponse.json({ error: profileResult.error }, { status: 500 })
  }

  if (userType === "empresa") {
    const organization = typeof body.organization === "object" && body.organization !== null ? (body.organization as Record<string, unknown>) : {}
    const organizationName = typeof organization.name === "string" ? organization.name.trim() : ""
    const nif = typeof organization.nif === "string" ? organization.nif.trim() : ""
    const address = typeof organization.address === "string" ? organization.address.trim() : ""
    const organizationCountry = typeof organization.country === "string" ? organization.country : country

    if (!organizationName) {
      return NextResponse.json({ error: "Nome da organizacao obrigatorio para empresas." }, { status: 400 })
    }

    if (!isConstructionCountry(organizationCountry)) {
      return NextResponse.json({ error: "Pais da organizacao invalido." }, { status: 400 })
    }

    const organizationResult = await createConstructionOrganization({
      ownerId: user.id,
      name: organizationName,
      nif,
      address,
      country: organizationCountry,
    })

    if (organizationResult.error) {
      return NextResponse.json({ error: organizationResult.error }, { status: 500 })
    }

    return NextResponse.json({ profile: profileResult.data, organization: organizationResult.data }, { status: 201 })
  }

  return NextResponse.json({ profile: profileResult.data }, { status: 201 })
}
