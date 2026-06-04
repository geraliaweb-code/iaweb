import { NextResponse } from "next/server"
import { canRunAnalysis, recordConstructionUsageEvent } from "@/lib/construction/billing/usage"
import { listConstructionBenchmarks, runConstructionBenchmark } from "@/lib/construction/benchmark-engine"
import { invalidConstructionProjectResponse, isValidConstructionProjectId } from "@/lib/construction/production"

export const runtime = "nodejs"

type BenchmarkRouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(_request: Request, context: BenchmarkRouteContext) {
  const { id } = await context.params

  if (!isValidConstructionProjectId(id)) {
    return invalidConstructionProjectResponse()
  }

  const { data, error } = await listConstructionBenchmarks(id)

  if (error) {
    return NextResponse.json({ benchmark: data, error: error.message }, { status: error.code === "SUPABASE_NOT_CONFIGURED" ? 200 : 500 })
  }

  return NextResponse.json({ benchmark: data })
}

export async function POST(_request: Request, context: BenchmarkRouteContext) {
  const { id } = await context.params

  if (!isValidConstructionProjectId(id)) {
    return invalidConstructionProjectResponse()
  }

  const billing = await canRunAnalysis(id)

  if (!billing.allowed) {
    return NextResponse.json({ benchmark: null, error: billing.decision?.reason ?? billing.error?.message ?? "Limite de billing atingido." }, { status: 402 })
  }

  const { data, error } = await runConstructionBenchmark(id)

  if (error) {
    return NextResponse.json({ benchmark: data, error: error.message }, { status: error.code === "NOT_FOUND" ? 404 : 500 })
  }

  await recordConstructionUsageEvent(id, "run_benchmark")

  return NextResponse.json({ benchmark: data })
}
