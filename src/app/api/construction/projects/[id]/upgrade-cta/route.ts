import { NextResponse } from "next/server"
import { trackConstructionEvent } from "@/lib/construction/analytics/conversion-events"
import { constructionUpgradeCta } from "@/lib/construction/commercial/experience"
import { invalidConstructionProjectResponse, isValidConstructionProjectId } from "@/lib/construction/production"

export const runtime = "nodejs"

type UpgradeCtaRouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(_request: Request, context: UpgradeCtaRouteContext) {
  const { id } = await context.params

  if (!isValidConstructionProjectId(id)) {
    return invalidConstructionProjectResponse()
  }

  return NextResponse.json(constructionUpgradeCta)
}

export async function POST(request: Request, context: UpgradeCtaRouteContext) {
  const { id } = await context.params

  if (!isValidConstructionProjectId(id)) {
    return invalidConstructionProjectResponse()
  }

  let metadata: Record<string, unknown> = { source: "upgrade-cta-api" }

  try {
    const body = (await request.json()) as Record<string, unknown>
    metadata = { ...metadata, ...body }
  } catch {
  }

  const result = await trackConstructionEvent({
    projectId: id,
    eventType: "unlock_clicked",
    metadata,
  })

  return NextResponse.json({ ok: result.ok })
}
