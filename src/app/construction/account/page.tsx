import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Building2, Mail, Phone, UserRound } from "lucide-react"
import ConstructionShell from "@/components/construction/ConstructionShell"
import { ConstructionLogoutButton } from "@/components/construction/ConstructionAuthForms"
import { getConstructionAccountContext, getConstructionAuthUser } from "@/lib/construction/auth"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Conta Construction | IAWEB",
}

export default async function ConstructionAccountPage() {
  const { user } = await getConstructionAuthUser()

  if (!user) {
    redirect("/construction/login")
  }

  const context = await getConstructionAccountContext(user)
  const profile = context.profile

  return (
    <ConstructionShell eyebrow="Perfil">
      <section className="py-10">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="iaweb-premium-card rounded-2xl p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-200">Perfil</p>
            <h1 className="mt-3 text-3xl font-semibold text-white md:text-5xl">{profile?.name ?? user.email}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
              Perfil Construction associado ao Supabase Auth. Particulares trabalham por utilizador; empresas trabalham por organizacao.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ConstructionLogoutButton />
              <Link href="/construction/organization" className="inline-flex rounded-lg bg-amber-300 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-amber-200">
                Organizacao
              </Link>
            </div>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Info icon={UserRound} label="Tipo" value={profile?.user_type === "empresa" ? "Empresa" : "Particular"} />
              <Info icon={Mail} label="Email" value={profile?.email ?? user.email ?? "Sem email"} />
              <Info icon={Phone} label="Telefone" value={profile?.phone ?? "Por completar"} />
              <Info icon={Building2} label="Plano atual" value={context.planName} />
            </div>
          </article>
        </div>
      </section>
    </ConstructionShell>
  )
}

function Info({ icon: Icon, label, value }: { icon: typeof UserRound; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
      <Icon className="h-4 w-4 text-amber-200" aria-hidden="true" />
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold leading-5 text-white">{value}</p>
    </div>
  )
}
