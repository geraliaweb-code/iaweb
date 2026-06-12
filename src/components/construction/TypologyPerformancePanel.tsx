import type { ConstructionSegmentPerformanceMetric } from "@/lib/construction/analytics/types"
import { constructionProjectTypeLabels } from "@/lib/construction/constants"
import type { ConstructionProjectType } from "@/lib/construction/types"

type TypologyPerformancePanelProps = {
  typologies: ConstructionSegmentPerformanceMetric[]
}

export default function TypologyPerformancePanel({ typologies }: TypologyPerformancePanelProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 text-white backdrop-blur">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-100">Typology performance</p>
      <h2 className="mt-2 text-2xl font-semibold">Performance por tipologia</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {typologies.map((typology) => (
          <article key={typology.label} className="rounded-xl border border-white/10 bg-slate-950/60 p-4">
            <p className="font-semibold">{formatTypology(typology.label)}</p>
            <p className="mt-3 text-2xl font-bold text-amber-100">{typology.conversionRate}%</p>
            <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">Conversao</p>
            <p className="mt-4 text-sm text-slate-300">Receita potencial: <span className="font-semibold text-white">{formatEuro(typology.estimatedRevenuePotential)}</span></p>
          </article>
        ))}
      </div>
    </section>
  )
}

function formatTypology(value: string) {
  return constructionProjectTypeLabels[value as ConstructionProjectType] ?? value
}

function formatEuro(value: number) {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value)
}
