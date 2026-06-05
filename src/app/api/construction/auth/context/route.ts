import { NextResponse } from "next/server"
import { getConstructionAccountContext, getConstructionAuthUser } from "@/lib/construction/auth"

export async function GET() {
  const { user } = await getConstructionAuthUser()
  const context = await getConstructionAccountContext(user)

  return NextResponse.json({
    authenticated: Boolean(user),
    profile: context.profile,
    organization: context.organization,
    membership: context.membership,
    planName: context.planName,
  })
}
