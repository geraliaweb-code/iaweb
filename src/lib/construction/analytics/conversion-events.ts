import { getConstructionProject, getConstructionSupabaseClient } from "../db"

export type ConstructionConversionEventType =
  | "preview_viewed"
  | "benchmark_preview_viewed"
  | "pdf_preview_viewed"
  | "unlock_clicked"
  | "checkout_started"
  | "checkout_completed"
  | "advisor_opened"
  | "advisor_recommendation_viewed"
  | "advisor_action_clicked"
  | "os_opened"
  | "os_action_viewed"
  | "os_action_clicked"
  | "timeline_opened"
  | "timeline_action_viewed"
  | "timeline_action_clicked"
  | "risk_opened"
  | "risk_viewed"
  | "risk_action_clicked"
  | "forecast_opened"
  | "forecast_viewed"
  | "forecast_action_clicked"

export type TrackConstructionEventInput = {
  projectId?: string | null
  organizationId?: string | null
  userId?: string | null
  eventType: ConstructionConversionEventType
  metadata?: Record<string, unknown>
}

export async function trackConstructionEvent(input: TrackConstructionEventInput) {
  const client = getConstructionSupabaseClient()

  if (!client.ok) {
    return { ok: false, error: client.error.message }
  }

  let organizationId = input.organizationId ?? null
  let userId = input.userId ?? null

  if (input.projectId && (!organizationId || !userId)) {
    const projectResult = await getConstructionProject(input.projectId)
    organizationId = organizationId ?? projectResult.data?.organization_id ?? null
    userId = userId ?? projectResult.data?.user_id ?? null
  }

  const { error } = await client.supabase.from("construction_conversion_events").insert({
    project_id: input.projectId ?? null,
    organization_id: organizationId,
    user_id: userId,
    event_type: input.eventType,
    metadata: input.metadata ?? {},
  })

  return { ok: !error, error: error?.message ?? null }
}
