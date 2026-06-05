import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import type { User } from "@supabase/supabase-js"
import { getConstructionSupabaseClient } from "./db"
import type {
  ConstructionAccountContext,
  ConstructionCountry,
  ConstructionOrganization,
  ConstructionOrganizationMember,
  ConstructionOrganizationRole,
  ConstructionUserProfile,
  ConstructionUserType,
} from "./types"

export function getConstructionAuthConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      ok: false as const,
      error: "Supabase Auth nao esta configurado. Define NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    }
  }

  return { ok: true as const, supabaseUrl, supabaseAnonKey }
}

export async function createConstructionServerAuthClient() {
  const config = getConstructionAuthConfig()

  if (!config.ok) {
    return { data: null, error: config.error }
  }

  const cookieStore = await cookies()
  const supabase = createServerClient(config.supabaseUrl, config.supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Server Components can read auth cookies but cannot always set them.
        }
      },
    },
  })

  return { data: supabase, error: null }
}

export async function getConstructionAuthUser() {
  const client = await createConstructionServerAuthClient()

  if (!client.data) {
    return { user: null, error: client.error }
  }

  const { data, error } = await client.data.auth.getUser()
  return { user: data.user, error: error?.message ?? null }
}

export function normalizeConstructionUserType(value: unknown): ConstructionUserType {
  return value === "empresa" ? "empresa" : "particular"
}

export function normalizeConstructionOrganizationRole(value: unknown): ConstructionOrganizationRole {
  if (value === "admin" || value === "manager" || value === "viewer") return value
  return "owner"
}

export async function getConstructionProfile(userId: string) {
  const client = getConstructionSupabaseClient()

  if (!client.ok) {
    return { data: null, error: client.error.message }
  }

  const { data, error } = await client.supabase
    .from("construction_profiles")
    .select("id,name,email,phone,country,user_type,created_at,updated_at")
    .eq("id", userId)
    .maybeSingle()

  return { data: (data as ConstructionUserProfile | null) ?? null, error: error?.message ?? null }
}

export async function upsertConstructionProfile(input: {
  id: string
  name: string
  email: string
  phone?: string | null
  country: ConstructionCountry
  userType: ConstructionUserType
}) {
  const client = getConstructionSupabaseClient()

  if (!client.ok) {
    return { data: null, error: client.error.message }
  }

  const { data, error } = await client.supabase
    .from("construction_profiles")
    .upsert(
      {
        id: input.id,
        name: input.name,
        email: input.email,
        phone: input.phone ?? null,
        country: input.country,
        user_type: input.userType,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    )
    .select("id,name,email,phone,country,user_type,created_at,updated_at")
    .single()

  return { data: data as ConstructionUserProfile | null, error: error?.message ?? null }
}

export async function getConstructionPrimaryMembership(userId: string) {
  const client = getConstructionSupabaseClient()

  if (!client.ok) {
    return { membership: null, organization: null, error: client.error.message }
  }

  const { data: membership, error: membershipError } = await client.supabase
    .from("construction_organization_members")
    .select("id,organization_id,user_id,role,created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle()

  if (membershipError || !membership) {
    return { membership: null, organization: null, error: membershipError?.message ?? null }
  }

  const { data: organization, error: organizationError } = await client.supabase
    .from("construction_organizations")
    .select("id,name,nif,country,address,subscription_plan,created_at")
    .eq("id", membership.organization_id)
    .maybeSingle()

  return {
    membership: membership as ConstructionOrganizationMember,
    organization: (organization as ConstructionOrganization | null) ?? null,
    error: organizationError?.message ?? null,
  }
}

export async function createConstructionOrganization(input: {
  ownerId: string
  name: string
  nif?: string | null
  country: ConstructionCountry
  address?: string | null
}) {
  const client = getConstructionSupabaseClient()

  if (!client.ok) {
    return { data: null, error: client.error.message }
  }

  const { data: organization, error: organizationError } = await client.supabase
    .from("construction_organizations")
    .insert({
      name: input.name,
      nif: input.nif ?? null,
      country: input.country,
      address: input.address ?? null,
      subscription_plan: "home",
    })
    .select("id,name,nif,country,address,subscription_plan,created_at")
    .single()

  if (organizationError || !organization) {
    return { data: null, error: organizationError?.message ?? "Nao foi possivel criar a organizacao." }
  }

  const { error: memberError } = await client.supabase.from("construction_organization_members").insert({
    organization_id: organization.id,
    user_id: input.ownerId,
    role: "owner",
  })

  if (memberError) {
    return { data: null, error: memberError.message }
  }

  return { data: organization as ConstructionOrganization, error: null }
}

export async function getConstructionAccountContext(user: User | null): Promise<ConstructionAccountContext> {
  if (!user) {
    return { profile: null, organization: null, membership: null, planName: "Visitante" }
  }

  const profileResult = await getConstructionProfile(user.id)
  const membershipResult = await getConstructionPrimaryMembership(user.id)
  const planName = membershipResult.organization?.subscription_plan ?? "particular"

  return {
    profile: profileResult.data,
    organization: membershipResult.organization,
    membership: membershipResult.membership,
    planName,
  }
}
