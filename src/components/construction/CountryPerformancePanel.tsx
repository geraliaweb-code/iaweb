import type { ConstructionSegmentPerformanceMetric } from "@/lib/construction/analytics/types"

type CountryPerformancePanelProps = {
  countries: ConstructionSegmentPerformanceMetric[]
}

export default function CountryPerformancePanel({ countries }: CountryPerformancePanelProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 text-white backdrop-blur">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-100">Country performance</p>
      <h2 className="mt-2 text-2xl font-semibold">Performance por pais</h2>
      <div className="mt-5 grid gap-3">
        {countries.map((country) => (
          <article key={country.label} className="rounded-xl border border-white/10 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold">{country.label}</p>
              <p className="text-sm font-bold text-amber-100">{country.conversionRate}% conversao</p>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
              <Metric label="Projetos" value={country.projects} />
              <Metric label="Unlocks" value={country.unlocks} />
              <Metric label="Checkouts" value={country.checkouts} />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
      <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-white">{value}</p>
    </div>
  )
}
