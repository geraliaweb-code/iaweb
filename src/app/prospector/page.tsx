import ProspectorClient from "./ProspectorClient"
import { assertCrmAccess } from "@/lib/crm-auth"
import { getProspectorSupabaseClient } from "@/lib/prospector/db"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function ProspectorPage() {
  const access = await assertCrmAccess()

  if (!access.ok) {
    redirect("/crm/login")
  }

  const client = getProspectorSupabaseClient()

  if (!client.ok) {
    return <ProspectorClient initialProspects={[]} initialWarning="Supabase nao configurado. Pode gerar prospects simulados no browser, mas nao promover para CRM." />
  }

  const { data, error } = await client.supabase
    .from("prospects")
    .select("*")
    .order("opportunity_score", { ascending: false })
    .limit(100)

  return <ProspectorClient initialProspects={(data ?? []) as never[]} initialWarning={error?.message} />
}
