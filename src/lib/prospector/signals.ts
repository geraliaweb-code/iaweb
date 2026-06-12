import type { SupabaseClient } from "@supabase/supabase-js"
import type { AgentName } from "./observability"
import { createAgentEvent } from "./observability"

export type ProspectSignalInput = {
  prospectId?: string | null
  company?: string | null
  signalType: string
  signalText: string
  signalScore?: number | null
  source?: string | null
  sourceUrl?: string | null
  agentName?: AgentName
}

export async function persistProspectSignals(
  supabase: SupabaseClient,
  signals: ProspectSignalInput[],
) {
  const validSignals = signals.filter((signal) => signal.prospectId && signal.signalText.trim())

  if (validSignals.length === 0) {
    return { ok: true, count: 0 }
  }

  const rows = validSignals.map((signal) => ({
    prospect_id: signal.prospectId,
    signal_type: signal.signalType,
    signal_text: signal.signalText,
    signal_score: signal.signalScore ?? null,
    source: signal.source ?? "prospector",
    source_url: signal.sourceUrl ?? null,
  }))
  const { error } = await supabase.from("prospect_signals").insert(rows)

  if (error) {
    return { ok: false, error: error.message }
  }

  await Promise.all(
    validSignals.map((signal) =>
      createAgentEvent({
        agentName: signal.agentName ?? "Pain Intelligence",
        eventType: "pain_signal_detected",
        companyId: signal.prospectId ?? undefined,
        metadata: {
          company: signal.company,
          signal_type: signal.signalType,
          signal_text: signal.signalText,
          signal_score: signal.signalScore,
          source: signal.source ?? "prospector",
        },
      }),
    ),
  )

  return { ok: true, count: validSignals.length }
}
