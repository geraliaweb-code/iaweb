import type { SupabaseClient } from "@supabase/supabase-js"
import { getSupabaseServerClient } from "@/lib/supabase-server"

export type ProspectorSupabaseError = {
  code: "SUPABASE_NOT_CONFIGURED" | "SUPABASE_QUERY_FAILED"
  message: string
}

type ProspectorSupabaseClientResult =
  | { ok: true; supabase: SupabaseClient }
  | { ok: false; error: ProspectorSupabaseError }

export function getProspectorSupabaseClient(): ProspectorSupabaseClientResult {
  const client = getSupabaseServerClient()

  if (!client.ok) {
    return {
      ok: false,
      error: {
        code: client.error.code,
        message: client.error.message,
      } satisfies ProspectorSupabaseError,
    }
  }

  return {
    ok: true,
    supabase: client.supabase,
  }
}
