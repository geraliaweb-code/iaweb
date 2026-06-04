import Link from "next/link"
import { ArrowRight, BarChart3, BrainCircuit, Euro, FileSearch, Gauge, ShieldAlert } from "lucide-react"
import { constructionEngineCards } from "@/lib/construction/constants"

const icons = {
  "document-intelligence": FileSearch,
  risk: ShieldAlert,
  cost: Euro,
  schedule: BarChart3,
  confidence: Gauge,
  maturity: BrainCircuit,
  benchmark: BarChart3,
}

export function EngineCardGrid() {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {constructionEngineCards.map((engine) => {
        const Icon = icons[engine.id]

        return (
          <article key={engine.id} className="iaweb-premium-card rounded-2xl p-5">
            <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-sky-300/20 bg-sky-300/10 text-sky-200">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
              {engine.status === "foundation" ? "Sprint 1" : "Preparado"}
            </p>
            <h2 className="mt-2 text-lg font-semibold text-white">{engine.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">{engine.description}</p>
          </article>
        )
      })}
    </section>
  )
}

export function PrimaryConstructionCta() {
  return (
    <div className="flex flex-wrap gap-3">
      <Link
        href="/construction/projects/new"
        className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-300 via-sky-400 to-amber-300 px-6 py-3 text-sm font-bold text-slate-950 shadow-[0_0_34px_rgba(14,165,233,0.22)] transition hover:scale-[1.02]"
      >
        Criar novo projeto
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
      <Link
        href="/construction/projects/demo"
        className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-bold text-white transition hover:border-sky-300/50 hover:bg-white/[0.08]"
      >
        Ver Projeto Demo
      </Link>
    </div>
  )
}
