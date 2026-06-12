import { NextResponse } from "next/server"
import { trackConstructionEvent, type ConstructionConversionEventType } from "@/lib/construction/analytics/conversion-events"
import { invalidConstructionProjectResponse, isValidConstructionProjectId } from "@/lib/construction/production"

export const runtime = "nodejs"

type AdvisorEventsRouteContext = {
  params: Promise<{ id: string }>
}

const advisorEvents = new Set<ConstructionConversionEventType>([
  "advisor_opened",
  "advisor_recommendation_viewed",
  "advisor_action_clicked",
])

export async function POST(request: Request, context: AdvisorEventsRouteContext) {
  const { id } = await context.params

  if (!isValidConstructionProjectId(id)) {
    return invalidConstructionProjectResponse()
  }

  const body = (await request.json().catch(() => null)) as {
    eventType?: ConstructionConversionEventType
    metadata?: Record<string, unknown>
  } | null

  if (!body?.eventType || !advisorEvents.has(body.eventType)) {
    return NextResponse.json({ ok: false, error: "Evento de advisor invalido." }, { status: 400 })
  }

  const result = await trackConstructionEvent({
    projectId: id,
    eventType: body.eventType,
    metadata: {
      source: "advisor-panel",
      ...(body.metadata ?? {}),
    },
  })

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error ?? "Nao foi possivel registar evento." }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
