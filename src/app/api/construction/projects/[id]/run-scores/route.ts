import { NextResponse } from "next/server"
import { canRunAnalysis, recordConstructionUsageEvent } from "@/lib/construction/billing/usage"
import { invalidConstructionProjectResponse, isValidConstructionProjectId } from "@/lib/construction/production"
import { listConstructionHealthCheck, runConstructionScores } from "@/lib/construction/score-engine"

export const runtime = "nodejs"

type RunScoresRouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(_request: Request, context: RunScoresRouteContext) {
  const { id } = await context.params

  if (!isValidConstructionProjectId(id)) {
    return invalidConstructionProjectResponse()
  }

  const { data, error } = await listConstructionHealthCheck(id)

  if (error) {
    return NextResponse.json({ healthCheck: data, error: error.message }, { status: error.code === "SUPABASE_NOT_CONFIGURED" ? 200 : 500 })
  }

  return NextResponse.json({ healthCheck: data })
}

export async function POST(_request: Request, context: RunScoresRouteContext) {
  const { id } = await context.params

  if (!isValidConstructionProjectId(id)) {
    return invalidConstructionProjectResponse()
  }

  const billing = await canRunAnalysis(id)

  if (!billing.allowed) {
    return NextResponse.json({ healthCheck: null, error: billing.decision?.reason ?? billing.error?.message ?? "Limite de billing atingido." }, { status: 402 })
  }

  const { data, error } = await runConstructionScores(id)

  if (error) {
    return NextResponse.json({ healthCheck: data, error: error.message }, { status: error.code === "NOT_FOUND" ? 404 : 500 })
  }

  await recordConstructionUsageEvent(id, "run_health_check")

  return NextResponse.json({ healthCheck: data })
}
