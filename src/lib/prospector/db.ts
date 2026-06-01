import { createClient } from "@supabase/supabase-js"
import type { SupabaseClient } from "@supabase/supabase-js"

export type ProspectorSupabaseError = {
  code: "SUPABASE_NOT_CONFIGURED" | "SUPABASE_QUERY_FAILED"
  message: string
}

type ProspectorSupabaseClientResult =
  | { ok: true; supabase: SupabaseClient }
  | { ok: false; error: ProspectorSupabaseError }

export function getProspectorSupabaseClient(): ProspectorSupabaseClientResult {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    return {
      ok: false,
      error: {
        code: "SUPABASE_NOT_CONFIGURED",
        message: "Supabase nao esta configurado.",
      } satisfies ProspectorSupabaseError,
    }
  }

  return {
    ok: true,
    supabase: createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }),
  }
}
