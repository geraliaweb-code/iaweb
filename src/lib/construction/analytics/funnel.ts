import type { ConstructionAnalyticsEventRow, ConstructionAnalyticsFunnel, ConstructionAnalyticsUploadRow } from "./types"

function countEvents(events: ConstructionAnalyticsEventRow[], eventType: string) {
  return events.filter((event) => event.event_type === eventType).length
}

export function buildConstructionAnalyticsFunnel(input: {
  uploads: ConstructionAnalyticsUploadRow[]
  events: ConstructionAnalyticsEventRow[]
}): ConstructionAnalyticsFunnel {
  return {
    uploads: input.uploads.length,
    previewViewed: countEvents(input.events, "preview_viewed"),
    unlockClicks: countEvents(input.events, "unlock_clicked"),
    checkoutStarted: countEvents(input.events, "checkout_started"),
    checkoutCompleted: countEvents(input.events, "checkout_completed"),
  }
}
