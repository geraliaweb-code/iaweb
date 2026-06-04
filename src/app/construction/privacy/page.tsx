import type { Metadata } from "next"
import ConstructionShell from "@/components/construction/ConstructionShell"
import { getConstructionCopy } from "@/lib/construction/i18n"

export const metadata: Metadata = { title: "Privacidade Construction | IAWEB" }

export default function ConstructionPrivacyPage() {
  const copy = getConstructionCopy("pt")
  return (
    <ConstructionShell>
      <section className="mx-auto max-w-4xl py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-200">Privacidade</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">Privacidade e dados de projeto</h1>
        <p className="mt-6 text-base leading-8 text-slate-300">{copy.legal.full}</p>
        <p className="mt-5 text-base leading-8 text-slate-300">
          Documentos originais pertencem ao cliente. Qualquer aprendizagem anonima deve respeitar consentimento, retencao e remocao de dados pessoais.
        </p>
      </section>
    </ConstructionShell>
  )
}
