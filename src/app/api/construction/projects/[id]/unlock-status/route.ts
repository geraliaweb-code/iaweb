import { NextResponse } from "next/server"
import { trackConstructionEvent } from "@/lib/construction/analytics/conversion-events"
import { buildConstructionCommercialAnalysis } from "@/lib/construction/commercial/experience"
import { invalidConstructionProjectResponse, isValidConstructionProjectId } from "@/lib/construction/production"

export const runtime = "nodejs"

type UnlockStatusRouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(request: Request, context: UnlockStatusRouteContext) {
  const { id } = await context.params

  if (!isValidConstructionProjectId(id)) {
    return invalidConstructionProjectResponse()
  }

  const result = await buildConstructionCommercialAnalysis(id)

  if (result.error || !result.data) {
    return NextResponse.json({ status: null, error: result.error?.message ?? "Nao foi possivel carregar unlock status." }, { status: result.error?.code === "NOT_FOUND" ? 404 : 500 })
  }

  const analysis = result.data.unlockedAnalysis
  const source = new URL(request.url).searchParams.get("source")

  if (source === "pdf-preview") {
    await trackConstructionEvent({
      projectId: id,
      eventType: "pdf_preview_viewed",
      metadata: { source: "pdf-preview-panel", accessLevel: analysis.accessLevel, canDownloadPdf: analysis.canDownloadFullPdf },
    })
  }

  return NextResponse.json({
    status: {
      accessLevel: analysis.accessLevel,
      unlockedPercentage: analysis.unlockedPercentage,
      lockedItems: analysis.lockedItems,
      canViewBenchmark: analysis.canViewFullBenchmark,
      canDownloadPdf: analysis.canDownloadFullPdf,
      canViewSuppliers: analysis.canViewSuppliers,
    },
    warnings: result.data.warnings,
  })
}
