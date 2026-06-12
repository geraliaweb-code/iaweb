import { NextResponse } from "next/server"
import { trackConstructionEvent } from "@/lib/construction/analytics/conversion-events"
import { generateBenchmarkV2 } from "@/lib/construction/benchmark-v2"
import { invalidConstructionProjectResponse, isValidConstructionProjectId } from "@/lib/construction/production"

export const runtime = "nodejs"

type BenchmarkV2RouteContext = {
  params: Promise<{ id: string }>
}

export async function POST(_request: Request, context: BenchmarkV2RouteContext) {
  const { id } = await context.params

  if (!isValidConstructionProjectId(id)) {
    return invalidConstructionProjectResponse()
  }

  const result = await generateBenchmarkV2({ projectId: id })

  if (result.error || !result.data) {
    return NextResponse.json(
      { benchmark: null, warnings: result.warnings, error: result.error?.message ?? "Nao foi possivel gerar Benchmark Europeu V2." },
      { status: result.error?.code === "NOT_FOUND" ? 404 : 500 },
    )
  }

  await trackConstructionEvent({
    projectId: id,
    eventType: "benchmark_preview_viewed",
    metadata: { source: "benchmark-v2-api", accessLevel: result.data.accessLevel, isBlocked: result.data.isBlocked },
  })

  return NextResponse.json({ benchmark: result.data, warnings: result.warnings })
}
