import { BarChart3, BrainCircuit, Flame, Radar, TrendingUp } from "lucide-react"
import CommercialAlerts from "./CommercialAlerts"
import ExecutiveMetrics from "./ExecutiveMetrics"
import OpportunityTable from "./OpportunityTable"
import PipelineOverview from "./PipelineOverview"
import ProspectorInsights from "./ProspectorInsights"
import type { ExecutiveDashboardData } from "./types"

export default function ExecutiveDashboard({ data }: { data: ExecutiveDashboardData }) {
  const whatsapps = data.leads.filter((lead) => lead.whatsapp_message).length
  const emails = data.leads.filter((lead) => lead.email_body).length
  const followups = data.leads.reduce(
    (sum, lead) => sum + [lead.followup_3d, lead.followup_7d, lead.followup_15d].filter(Boolean).length,
    0,
  )
  const homepages = data.leads.filter((lead) => lead.homepage_gerada && Object.keys(lead.homepage_gerada).length > 0).length
  const diagnostics = data.leads.filter((lead) => lead.score_geral > 0).length
  const topOpportunities = [...data.prospects].sort((a, b) => b.opportunity_score - a.opportunity_score).slice(0, 5)
  const heatmap = topOpportunities.length ? topOpportunities : data.prospects.slice(0, 5)
  const pipelineStages = ["novo", "contactado", "reuniao", "simulacao", "proposta", "negociacao", "fechado"] as const
  const maxPipeline = Math.max(1, ...pipelineStages.map((stage) => data.leads.filter((lead) => lead.status === stage).length))
  const monthlyPotential = data.prospects.reduce((sum, prospect) => {
    const impact = prospect.impacto_financeiro as { lostRevenueMonthly?: { max?: number } } | null
    return sum + (impact?.lostRevenueMonthly?.max ?? 0)
  }, 0)
  const nicheRadar = Object.entries(
    data.prospects.reduce<Record<string, number>>((acc, prospect) => {
      acc[prospect.nicho] = (acc[prospect.nicho] ?? 0) + prospect.opportunity_score
      return acc
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)

  return (
    <main className="iaweb-cinematic-shell px-4 py-8 sm:px-6 lg:px-8">
      <div className="iaweb-cinematic-bg">
        <div className="iaweb-cinematic-grid" />
        <div className="iaweb-lightning top-[16%] left-[-10%]" />
        <div className="iaweb-lightning" />
        <div className="iaweb-lightning" />
        <div className="iaweb-lightning-field" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-[96rem] flex-col gap-6">
        <header className="iaweb-premium-card rounded-2xl p-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#00A3FF]/30 bg-[#007BFF]/15 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[#BFEAFF]">
            <BrainCircuit size={14} />
            IAWEB Intelligence
          </p>
          <h1 className="iaweb-hero-title mt-4 text-4xl font-black text-white md:text-6xl">
            Centro de <span className="iaweb-glow-text">Inteligencia IA</span>
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
            Um painel executivo para perceber onde esta o dinheiro, quais oportunidades devem ser contactadas hoje e
            como o pipeline esta a evoluir.
          </p>
          {data.warning ? (
            <div className="mt-5 rounded-xl border border-[#FFB800]/25 bg-[#FFB800]/10 px-4 py-3 text-sm text-[#FFE3A3]">
              {data.warning}
            </div>
          ) : null}
        </header>

        <ExecutiveMetrics data={data} />

        <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr_0.9fr]">
          <div className="iaweb-premium-card rounded-2xl p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#3AB8FF]">Heatmap de oportunidades</p>
                <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-white">Onde esta o dinheiro</h2>
              </div>
              <Flame className="text-[#FFB800]" size={24} />
            </div>
            <div className="mt-5 grid grid-cols-5 gap-2">
              {heatmap.map((prospect, index) => (
                <div
                  key={prospect.id ?? prospect.email ?? prospect.empresa}
                  className="min-h-28 rounded-2xl border border-[#00A3FF]/20 bg-[#00A3FF]/10 p-3 shadow-[0_0_24px_rgba(0,163,255,0.12)]"
                  style={{ opacity: 0.58 + Math.min(0.38, prospect.opportunity_score / 260), transform: `translateY(${index % 2 ? 10 : 0}px)` }}
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#BFEAFF]">{prospect.nicho}</p>
                  <p className="mt-2 text-3xl font-black text-white">{prospect.opportunity_score}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-400">{prospect.empresa}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="iaweb-premium-card rounded-2xl p-5">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#FFB800]">
              <BarChart3 size={15} />
              Grafico de pipeline
            </p>
            <div className="mt-5 flex h-40 items-end gap-2">
              {pipelineStages.map((stage) => {
                const count = data.leads.filter((lead) => lead.status === stage).length
                return (
                  <div key={stage} className="flex flex-1 flex-col items-center gap-2">
                    <div
                      className="w-full rounded-t-xl border border-[#00A3FF]/25 bg-gradient-to-t from-[#007BFF] to-[#3AB8FF] shadow-[0_0_24px_rgba(0,163,255,0.24)]"
                      style={{ height: `${Math.max(12, (count / maxPipeline) * 138)}px` }}
                    />
                    <span className="text-[10px] uppercase text-slate-500">{stage.slice(0, 3)}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="iaweb-premium-card rounded-2xl p-5">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#3AB8FF]">
              <Radar size={15} />
              Radar de nichos
            </p>
            <div className="mt-5 space-y-3">
              {nicheRadar.map(([niche, score]) => (
                <div key={niche}>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-bold uppercase">{niche}</span>
                    <span>{score}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#00A3FF] via-[#007BFF] to-[#FFB800]" style={{ width: `${Math.min(100, score / 5)}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-[#FFB800]/20 bg-[#FFB800]/10 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-[#FFB800]">Receita potencial mensal</p>
              <p className="mt-2 text-3xl font-black text-white">
                {new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(monthlyPotential)}
              </p>
            </div>
          </div>
        </section>

        <section className="iaweb-premium-card rounded-2xl p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#3AB8FF]">Top oportunidades em destaque</p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-white">Contactar hoje</h2>
            </div>
            <TrendingUp className="text-[#FFB800]" />
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-5">
            {topOpportunities.map((prospect) => (
              <div key={prospect.id ?? prospect.email ?? prospect.empresa} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                <p className="text-sm font-black text-white">{prospect.empresa}</p>
                <p className="mt-1 text-xs text-slate-500">{prospect.cidade} - {prospect.nicho}</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="iaweb-orbit grid size-14 place-items-center text-sm font-black text-white">
                    <span>{prospect.opportunity_score}</span>
                  </div>
                  <p className="text-xs leading-5 text-slate-400">score de oportunidade</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <ProspectorInsights prospects={data.prospects} />
        <PipelineOverview leads={data.leads} />

        <section className="iaweb-premium-card rounded-2xl p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#3AB8FF]">Performance</p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-white">Ativos comerciais gerados</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
            {[
              ["WhatsApps Gerados", whatsapps],
              ["Emails Gerados", emails],
              ["Follow-ups Gerados", followups],
              ["Homepages Geradas", homepages],
              ["PDFs Gerados", diagnostics],
              ["Diagnosticos Criados", diagnostics],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">{label}</p>
                <p className="mt-3 text-3xl font-black text-white">{String(value)}</p>
              </div>
            ))}
          </div>
        </section>

        <OpportunityTable prospects={data.prospects} />
        <CommercialAlerts data={data} />
      </div>
    </main>
  )
}
