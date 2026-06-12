import { createClient } from "@supabase/supabase-js"
import type { SupabaseClient } from "@supabase/supabase-js"

export type SupabaseServerErrorCode = "SUPABASE_NOT_CONFIGURED" | "SUPABASE_QUERY_FAILED"

export type SupabaseServerError = {
  code: SupabaseServerErrorCode
  message: string
}

type SupabaseServerClientResult =
  | { ok: true; supabase: SupabaseClient }
  | { ok: false; error: SupabaseServerError }

export function getSupabaseServerClient(): SupabaseServerClientResult {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const missing = [
    !supabaseUrl ? "NEXT_PUBLIC_SUPABASE_URL" : "",
    !supabaseKey ? "SUPABASE_SERVICE_ROLE_KEY" : "",
  ].filter(Boolean)

  if (!supabaseUrl || !supabaseKey) {
    return {
      ok: false,
      error: {
        code: "SUPABASE_NOT_CONFIGURED",
        message: `Supabase nao esta configurado. Variaveis em falta: ${missing.join(", ")}.`,
      },
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
