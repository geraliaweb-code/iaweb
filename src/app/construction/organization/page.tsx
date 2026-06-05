import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { ShieldCheck, UsersRound } from "lucide-react"
import ConstructionShell from "@/components/construction/ConstructionShell"
import ConstructionOrganizationForm from "@/components/construction/ConstructionOrganizationForm"
import { getConstructionAccountContext, getConstructionAuthUser } from "@/lib/construction/auth"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Organizacao Construction | IAWEB",
}

export default async function ConstructionOrganizationPage() {
  const { user } = await getConstructionAuthUser()

  if (!user) {
    redirect("/construction/login")
  }

  const context = await getConstructionAccountContext(user)

  return (
    <ConstructionShell eyebrow="Organizacao">
      <section className="py-10">
        <div className="mb-6 grid gap-5 lg:grid-cols-[1fr_0.8fr]">
          <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-200">Multiempresa</p>
            <h1 className="mt-3 text-3xl font-semibold text-white md:text-5xl">
              {context.organization?.name ?? "Organizacao Construction"}
            </h1>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Empresas podem ter multiplos utilizadores por organizacao. Particulares continuam com 1 utilizador e projetos associados diretamente ao perfil.
            </p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <UsersRound className="h-6 w-6 text-amber-200" aria-hidden="true" />
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Membro atual</p>
            <p className="mt-2 text-lg font-semibold text-white">{context.membership?.role ?? "sem organizacao"}</p>
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-300/20 bg-emerald-300/10 p-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-200" aria-hidden="true" />
              <p className="text-sm leading-5 text-emerald-50">RLS preparado para limitar leitura por utilizador ou organizacao.</p>
            </div>
          </article>
        </div>
        <ConstructionOrganizationForm organization={context.organization} />
      </section>
    </ConstructionShell>
  )
}
