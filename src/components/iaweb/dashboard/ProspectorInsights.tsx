import { Activity, MapPin, PieChart, Radar } from "lucide-react"
import { countBy } from "./helpers"
import type { DashboardProspect } from "./types"

function InsightList({ title, items }: { title: string; items: Array<[string, number]> }) {
  const max = Math.max(1, ...items.map(([, value]) => value))

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="mb-4 text-xs font-black uppercase tracking-[0.16em] text-slate-500">{title}</p>
      <div className="space-y-3">
        {items.slice(0, 6).map(([label, value]) => (
          <div key={label}>
            <div className="mb-1 flex justify-between gap-3 text-sm">
              <span className="font-semibold text-slate-300">{label || "Sem dados"}</span>
              <span className="text-slate-500">{value}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-[#007BFF] to-[#FFB800]" style={{ width: `${(value / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ProspectorInsights({ prospects }: { prospects: DashboardProspect[] }) {
  const byNiche = Object.entries(countBy(prospects.map((prospect) => prospect.nicho))).sort((a, b) => b[1] - a[1])
  const byCity = Object.entries(countBy(prospects.map((prospect) => prospect.cidade ?? "Sem cidade"))).sort((a, b) => b[1] - a[1])
  const byPriority = Object.entries(countBy(prospects.map((prospect) => prospect.priority_label))).sort((a, b) => b[1] - a[1])
  const averageDigital = Math.round(prospects.reduce((sum, prospect) => sum + prospect.score_digital, 0) / Math.max(1, prospects.length))
  const averageOpportunity = Math.round(prospects.reduce((sum, prospect) => sum + prospect.opportunity_score, 0) / Math.max(1, prospects.length))
  const top = [...prospects].sort((a, b) => b.opportunity_score - a.opportunity_score).slice(0, 10)

  return (
    <section className="iaweb-premium-card rounded-2xl p-5">
      <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#3AB8FF]">
            <Radar size={15} />
            Prospector IA
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-white">Mapa de oportunidades</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-[#00A3FF]/20 bg-[#00A3FF]/10 px-4 py-3">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Score medio</p>
            <p className="mt-1 text-xl font-black text-white">{averageDigital}/100</p>
          </div>
          <div className="rounded-xl border border-[#FFB800]/25 bg-[#FFB800]/10 px-4 py-3">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Opportunity medio</p>
            <p className="mt-1 text-xl font-black text-white">{averageOpportunity}/100</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        <InsightList title="Prospects por nicho" items={byNiche} />
        <InsightList title="Prospects por cidade" items={byCity} />
        <InsightList title="Distribuicao prioridade" items={byPriority} />
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.16em] text-slate-500">Top 10 oportunidades</p>
          <div className="space-y-2">
            {top.map((prospect) => (
              <div key={prospect.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 p-3 text-sm">
                <span className="line-clamp-1 font-semibold text-slate-300">{prospect.empresa}</span>
                <span className="font-black text-[#FFB800]">{prospect.opportunity_score}</span>
              </div>
            ))}
            {top.length === 0 ? <p className="text-sm text-slate-500">Sem prospects carregados.</p> : null}
          </div>
        </div>
      </div>
    </section>
  )
}
