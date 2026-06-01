import { CrmDashboardClient } from "@/app/crm/CrmDashboardClient"
import { assertCrmAccess } from "@/lib/crm-auth"
import { listCrmLeads } from "@/lib/crm"
import OfficialLogo from "@/components/iaweb/OfficialLogo"
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
      <main className="iaweb-cinematic-shell px-4 py-10 text-slate-50 sm:px-6 lg:px-8">
        <div className="iaweb-cinematic-bg">
          <div className="iaweb-cinematic-grid" />
          <div className="iaweb-lightning top-[16%] left-[-10%]" />
          <div className="iaweb-lightning" />
          <div className="iaweb-lightning" />
          <div className="iaweb-lightning-field" />
        </div>
        <div className="iaweb-premium-card relative z-10 mx-auto max-w-3xl rounded-2xl border-amber-400/20 p-6">
          <OfficialLogo compact className="mb-5 max-w-[190px]" />
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
