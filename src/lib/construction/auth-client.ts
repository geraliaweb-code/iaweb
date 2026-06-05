"use client"

import { createBrowserClient } from "@supabase/ssr"

export function createConstructionBrowserAuthClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase Auth nao esta configurado. Define NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.")
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
