import { CrmLoginForm } from "@/app/crm/login/CrmLoginForm"
import { getCrmAccessContext, hasValidCrmSession } from "@/lib/crm-auth"
import OfficialLogo from "@/components/iaweb/OfficialLogo"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function CrmLoginPage() {
  const context = await getCrmAccessContext()

  if (!context.enabled || (context.configured && (await hasValidCrmSession()))) {
    redirect("/crm")
  }

  return (
    <main className="iaweb-cinematic-shell px-4 py-10 text-slate-50 sm:px-6 lg:px-8">
      <div className="iaweb-cinematic-bg">
        <div className="iaweb-cinematic-grid" />
        <div className="iaweb-lightning top-[16%] left-[-10%]" />
        <div className="iaweb-lightning" />
        <div className="iaweb-lightning" />
        <div className="iaweb-lightning-field" />
      </div>
      <div className="iaweb-premium-card relative z-10 mx-auto flex w-full max-w-md flex-col rounded-2xl p-6">
        <OfficialLogo compact className="mb-5 max-w-[190px]" />
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-sky-200">CRM protegido</p>
        <h1 className="mt-3 text-2xl font-semibold text-white">Acesso protegido</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Introduz a password ou token configurado para abrir o pipeline comercial.
        </p>

        <CrmLoginForm authConfigured={context.configured} />
      </div>
    </main>
  )
}
