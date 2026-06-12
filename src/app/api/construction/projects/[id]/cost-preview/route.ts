import { NextResponse } from "next/server"
import { trackConstructionEvent } from "@/lib/construction/analytics/conversion-events"
import { buildConstructionCommercialAnalysis } from "@/lib/construction/commercial/experience"
import { invalidConstructionProjectResponse, isValidConstructionProjectId } from "@/lib/construction/production"

export const runtime = "nodejs"

type CostPreviewRouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(_request: Request, context: CostPreviewRouteContext) {
  const { id } = await context.params

  if (!isValidConstructionProjectId(id)) {
    return invalidConstructionProjectResponse()
  }

  const result = await buildConstructionCommercialAnalysis(id)

  if (result.error || !result.data) {
    return NextResponse.json({ preview: null, error: result.error?.message ?? "Nao foi possivel carregar cost preview." }, { status: result.error?.code === "NOT_FOUND" ? 404 : 500 })
  }

  await trackConstructionEvent({ projectId: id, eventType: "preview_viewed", metadata: { source: "cost-preview-api", accessLevel: result.data.unlockedAnalysis.accessLevel } })

  return NextResponse.json({
    preview: {
      visibleSpecialties: result.data.unlockedAnalysis.visibleSpecialties,
      lockedSpecialties: result.data.unlockedAnalysis.lockedSpecialties,
      visibleCost: result.data.unlockedAnalysis.totalVisibleCost,
      estimatedRange: result.data.unlockedAnalysis.estimatedFullCostRange,
      accessLevel: result.data.unlockedAnalysis.accessLevel,
      unlockedPercentage: result.data.unlockedAnalysis.unlockedPercentage,
    },
    warnings: result.data.warnings,
  })
}
