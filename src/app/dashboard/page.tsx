import ExecutiveDashboard from "@/components/iaweb/dashboard/ExecutiveDashboard"
import type { DashboardProspect } from "@/components/iaweb/dashboard/types"
import { listCrmLeads } from "@/lib/crm"
import { assertCrmAccess } from "@/lib/crm-auth"
import { getProspectorSupabaseClient } from "@/lib/prospector/db"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

async function loadProspects() {
  const client = getProspectorSupabaseClient()

  if (!client.ok) {
    return {
      prospects: [] as DashboardProspect[],
      warning: "Supabase nao configurado. O dashboard esta sem prospects persistidos.",
    }
  }

  const { data, error } = await client.supabase
    .from("prospects")
    .select("id,empresa,contacto,email,telefone,website,cidade,nicho,score_digital,opportunity_score,priority_label,impacto_financeiro,status,created_at,updated_at")
    .order("opportunity_score", { ascending: false })
    .limit(200)

  if (error) {
    return {
      prospects: [] as DashboardProspect[],
      warning: `Nao foi possivel carregar prospects: ${error.message}`,
    }
  }

  return {
    prospects: (data ?? []) as DashboardProspect[],
    warning: undefined,
  }
}

export default async function DashboardPage() {
  const access = await assertCrmAccess()

  if (!access.ok) {
    redirect("/crm/login")
  }

  const [prospectsResult, crmResult] = await Promise.all([loadProspects(), listCrmLeads()])

  return (
    <ExecutiveDashboard
      data={{
        prospects: prospectsResult.prospects,
        leads: crmResult.data ?? [],
        warning: prospectsResult.warning ?? crmResult.error?.message,
      }}
    />
  )
}
