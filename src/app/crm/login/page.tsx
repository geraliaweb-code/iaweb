import { CrmLoginForm } from "@/app/crm/login/CrmLoginForm"
import { getCrmAccessContext, hasValidCrmSession } from "@/lib/crm-auth"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function CrmLoginPage() {
  const context = await getCrmAccessContext()

  if (!context.enabled || (context.configured && (await hasValidCrmSession()))) {
    redirect("/crm")
  }

  return (
    <main className="min-h-screen bg-[#030712] px-4 py-10 text-slate-50 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-md flex-col rounded-lg border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-sky-200">IAWEB CRM</p>
        <h1 className="mt-3 text-2xl font-semibold text-white">Acesso protegido</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Introduz a password ou token configurado para abrir o pipeline comercial.
        </p>

        <CrmLoginForm authConfigured={context.configured} />
      </div>
    </main>
  )
}
