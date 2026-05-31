import { CrmDashboardClient } from "@/app/crm/CrmDashboardClient"
import { assertCrmAccess } from "@/lib/crm-auth"
import { listCrmLeads } from "@/lib/crm"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function CrmPage() {
  const access = await assertCrmAccess()

  if (!access.ok) {
    redirect("/crm/login")
  }

  const { data, error } = await listCrmLeads()

  if (error) {
    return (
      <main className="min-h-screen bg-[#030712] px-4 py-10 text-slate-50 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-lg border border-amber-400/20 bg-amber-400/10 p-6">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-amber-200">CRM indisponivel</p>
          <h1 className="mt-3 text-2xl font-semibold text-white">Nao foi possivel carregar os leads.</h1>
          <p className="mt-3 text-sm leading-6 text-amber-50/90">{error.message}</p>
          <p className="mt-4 text-sm text-slate-300">
            Confirma as variaveis de ambiente do Supabase e volta a abrir esta pagina.
          </p>
        </div>
      </main>
    )
  }

  return <CrmDashboardClient initialLeads={data ?? []} authEnabled={access.mode === "authenticated"} />
}
