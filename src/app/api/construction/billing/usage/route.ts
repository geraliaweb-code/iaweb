import { NextResponse } from "next/server"
import { getConstructionBillingUsage } from "@/lib/construction/billing/usage"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const projectId = url.searchParams.get("projectId")
  const { data, error } = await getConstructionBillingUsage(projectId)

  if (error) {
    return NextResponse.json({ usage: data, error: error.message }, { status: error.code === "SUPABASE_NOT_CONFIGURED" ? 200 : 500 })
  }

  return NextResponse.json({ usage: data })
}
