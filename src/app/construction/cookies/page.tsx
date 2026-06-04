import type { Metadata } from "next"
import ConstructionShell from "@/components/construction/ConstructionShell"
import { getConstructionCopy } from "@/lib/construction/i18n"

export const metadata: Metadata = { title: "Cookies Construction | IAWEB" }

export default function ConstructionCookiesPage() {
  const copy = getConstructionCopy("pt")
  return (
    <ConstructionShell>
      <section className="mx-auto max-w-4xl py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-200">Cookies</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">Cookies e preferencias</h1>
        <p className="mt-6 text-base leading-8 text-slate-300">{copy.cookies.banner}</p>
        <p className="mt-5 text-base leading-8 text-slate-300">
          Nesta fase, o banner guarda apenas a preferencia local do utilizador. Integracoes analiticas avancadas devem respeitar consentimento explicito.
        </p>
      </section>
    </ConstructionShell>
  )
}
