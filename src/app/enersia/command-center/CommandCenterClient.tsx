"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Building2,
  CheckCircle2,
  Clock3,
  Database,
  Mail,
  MapPin,
  PauseCircle,
  Radar,
  RefreshCw,
  Signal,
  Target,
  Zap,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import OfficialLogo from "@/components/iaweb/OfficialLogo"
import type { AgentRunStatus, CommandCenterData } from "@/lib/prospector/observability"

type Props = {
  initialData: CommandCenterData
}

const statusConfig: Record<AgentRunStatus, { label: string; className: string; Icon: LucideIcon }> = {
  active: { label: "Ativo", className: "border-emerald-300/25 bg-emerald-300/10 text-emerald-100", Icon: Activity },
  paused: { label: "Pausado", className: "border-[#FFB800]/30 bg-[#FFB800]/10 text-[#FFE3A3]", Icon: PauseCircle },
  idle: { label: "Idle", className: "border-white/10 bg-white/[0.04] text-slate-300", Icon: Clock3 },
  completed: { label: "Completo", className: "border-[#00A3FF]/25 bg-[#00A3FF]/10 text-[#BFEAFF]", Icon: CheckCircle2 },
  failed: { label: "Erro", className: "border-rose-300/30 bg-rose-300/10 text-rose-100", Icon: AlertTriangle },
}

const eventClasses: Record<string, string> = {
  agent_started: "border-[#00A3FF]/25 bg-[#00A3FF]/10 text-[#BFEAFF]",
  agent_finished: "border-emerald-300/25 bg-emerald-300/10 text-emerald-100",
  company_found: "border-[#FFB800]/25 bg-[#FFB800]/10 text-[#FFE3A3]",
  website_analyzed: "border-[#00A3FF]/25 bg-[#00A3FF]/10 text-[#BFEAFF]",
  email_found: "border-emerald-300/25 bg-emerald-300/10 text-emerald-100",
  pain_signal_detected: "border-rose-300/25 bg-rose-300/10 text-rose-100",
  lead_imported: "border-violet-300/25 bg-violet-300/10 text-violet-100",
  propensity_calculated: "border-[#00A3FF]/25 bg-[#00A3FF]/10 text-[#BFEAFF]",
  propensity_critical: "border-rose-300/30 bg-rose-300/10 text-rose-100",
  propensity_hot: "border-[#FFB800]/35 bg-[#FFB800]/10 text-[#FFE3A3]",
  campaign_intelligence_generated: "border-[#00A3FF]/25 bg-[#00A3FF]/10 text-[#BFEAFF]",
  best_channel_selected: "border-emerald-300/25 bg-emerald-300/10 text-emerald-100",
  high_conversion_detected: "border-[#FFB800]/35 bg-[#FFB800]/10 text-[#FFE3A3]",
  error: "border-rose-300/35 bg-rose-300/10 text-rose-100",
}

function formatDate(value?: string | null) {
  if (!value) return "--"
  return new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value))
}

function formatCount(value: number) {
  return new Intl.NumberFormat("pt-PT").format(value)
}

function formatProbability(value: number) {
  return new Intl.NumberFormat("pt-PT", { style: "percent", maximumFractionDigits: 1 }).format(value)
}

function priorityClass(priority: string) {
  const normalized = priority.toLowerCase()
  if (normalized.includes("crit")) return "border-rose-300/30 bg-rose-300/10 text-rose-100"
  if (normalized.includes("muito quente")) return "border-[#FFB800]/35 bg-[#FFB800]/10 text-[#FFE3A3]"
  if (normalized.includes("oportunidade")) return "border-[#00A3FF]/25 bg-[#00A3FF]/10 text-[#BFEAFF]"
  if (normalized.includes("morno")) return "border-violet-300/25 bg-violet-300/10 text-violet-100"
  if (normalized.includes("baixo")) return "border-white/10 bg-white/[0.04] text-slate-300"
  if (normalized.includes("alta")) return "border-[#FFB800]/30 bg-[#FFB800]/10 text-[#FFE3A3]"
  if (normalized.includes("media")) return "border-[#00A3FF]/25 bg-[#00A3FF]/10 text-[#BFEAFF]"
  return "border-white/10 bg-white/[0.04] text-slate-300"
}

export default function CommandCenterClient({ initialData }: Props) {
  const [data, setData] = useState(initialData)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [refreshing, setRefreshing] = useState(false)

  async function refresh() {
    setRefreshing(true)
    try {
      const response = await fetch("/api/enersia/command-center", { cache: "no-store" })
      const nextData = (await response.json()) as CommandCenterData
      if (response.ok) {
        setData(nextData)
        setLastRefresh(new Date())
      }
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    const timer = window.setInterval(() => {
      void refresh()
    }, 15000)

    return () => window.clearInterval(timer)
  }, [])

  const metrics: Array<[string, number, LucideIcon]> = [
    ["Empresas recolhidas hoje", data.metrics.companiesCollectedToday, Building2],
    ["Leads enriquecidos", data.metrics.enrichedLeads, Database],
    ["Emails encontrados", data.metrics.emailsFound, Mail],
    ["Pain Signals encontrados", data.metrics.painSignalsFound, Zap],
    ["Leads prioridade alta", data.metrics.highPriorityLeads, Target],
    ["Agentes ativos", data.metrics.activeAgents, Signal],
    ["Erros registados", data.metrics.registeredErrors, AlertTriangle],
    ["Prob. media conversao", Math.round(data.metrics.averageConversionProbability * 100), BarChart3],
    ["Conv. esperada media", Math.round(data.metrics.averageExpectedConversion * 100), Target],
    ["Leads P1", data.metrics.p1Leads, Zap],
    ["Leads para chamada", data.metrics.callLeads, Signal],
    ["Leads para visita", data.metrics.visitLeads, MapPin],
    ["Leads para email", data.metrics.emailLeads, Mail],
    ["Leads para nutricao", data.metrics.nurtureLeads, Clock3],
  ]
  const maxSource = useMemo(() => Math.max(1, ...data.topSources.map((source) => source.count)), [data.topSources])
  const maxPropensity = useMemo(() => Math.max(1, ...data.propensityDistribution.map((item) => item.count)), [data.propensityDistribution])
  const maxChannel = useMemo(() => Math.max(1, ...data.channelDistribution.map((item) => item.count)), [data.channelDistribution])
  const maxCampaignPriority = useMemo(() => Math.max(1, ...data.campaignPriorityDistribution.map((item) => item.count)), [data.campaignPriorityDistribution])

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
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
            <div>
              <OfficialLogo compact className="mb-5 max-w-[190px]" />
              <p className="inline-flex items-center gap-2 rounded-full border border-[#00A3FF]/30 bg-[#007BFF]/15 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[#BFEAFF]">
                <Radar size={14} />
                ENERSIA Prospect Intelligence
              </p>
              <h1 className="iaweb-hero-title mt-4 text-4xl font-black text-white md:text-6xl">
                Command <span className="iaweb-glow-text">Center</span>
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
                Observabilidade operacional dos agentes, eventos, fontes e oportunidades da plataforma.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void refresh()}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#00A3FF]/30 bg-[#00A3FF]/10 px-4 text-sm font-black text-[#BFEAFF]"
            >
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
              {formatDate(lastRefresh.toISOString())}
            </button>
          </div>
          {data.warning ? <div className="mt-5 rounded-xl border border-[#FFB800]/25 bg-[#FFB800]/10 px-4 py-3 text-sm text-[#FFE3A3]">{data.warning}</div> : null}
        </header>

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map(([label, value, Icon]) => (
            <div key={label} className="iaweb-premium-card rounded-2xl p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">{label}</p>
                <Icon size={18} className="text-[#3AB8FF]" />
              </div>
              <p className="mt-3 text-3xl font-black tracking-[-0.04em] text-white">{label.includes("Prob.") || label.includes("Conv.") ? `${value}%` : formatCount(value)}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="iaweb-premium-card rounded-2xl p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#3AB8FF]">Painel agentes</p>
                <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-white">Execucao operacional</h2>
              </div>
              <Activity className="text-[#FFB800]" />
            </div>
            <div className="mt-5 grid gap-3 lg:grid-cols-2">
              {data.agents.map((agent) => {
                const config = statusConfig[agent.status]
                const Icon = config.Icon
                return (
                  <article key={agent.agent_name} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-black text-white">{agent.agent_name}</h3>
                        <p className="mt-1 line-clamp-1 text-xs text-slate-500">{agent.current_task ?? "Sem tarefa ativa"}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${config.className}`}>
                        <Icon size={12} />
                        {config.label}
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-4 gap-2">
                      <AgentMetric label="Ultima" value={formatDate(agent.updated_at)} />
                      <AgentMetric label="Proc." value={formatCount(agent.total_processed)} />
                      <AgentMetric label="Sucesso" value={formatCount(agent.total_success)} />
                      <AgentMetric label="Falhas" value={formatCount(agent.total_failed)} />
                    </div>
                    {agent.error_message ? <p className="mt-3 rounded-xl border border-rose-300/20 bg-rose-300/10 p-3 text-xs leading-5 text-rose-100">{agent.error_message}</p> : null}
                  </article>
                )
              })}
            </div>
          </div>

          <div className="iaweb-premium-card rounded-2xl p-5">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#FFB800]">
              <Signal size={15} />
              Feed tempo real
            </p>
            <div className="mt-5 max-h-[31.5rem] space-y-3 overflow-auto pr-1">
              {data.events.length ? (
                data.events.map((event) => (
                  <article key={event.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-black text-white">{event.event_message}</p>
                        <p className="mt-1 text-xs text-slate-500">{event.agent_name} - {formatDate(event.created_at)}</p>
                      </div>
                      <span className={`rounded-full border px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${eventClasses[event.event_type] ?? "border-white/10 bg-white/[0.04] text-slate-300"}`}>
                        {event.event_type.replaceAll("_", " ")}
                      </span>
                    </div>
                  </article>
                ))
              ) : (
                <EmptyState label="Sem eventos registados ainda." />
              )}
            </div>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="iaweb-premium-card rounded-2xl p-5">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#FFB800]">
              <Zap size={15} />
              Empresas mais quentes
            </p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {data.hottestCompanies.length ? (
                data.hottestCompanies.map((lead) => (
                  <article key={lead.id} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-black text-white">{lead.empresa}</h3>
                        <p className="mt-1 text-xs text-slate-500">{lead.cidade ?? "--"} - {lead.origem}</p>
                      </div>
                      <span className={`rounded-full border px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${priorityClass(lead.propensity_label)}`}>
                        {lead.propensity_label}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center gap-4">
                      <div className="iaweb-orbit grid size-16 place-items-center text-lg font-black text-white">
                        <span>{lead.propensity_score}</span>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.14em] text-slate-500">probabilidade</p>
                        <p className="mt-1 text-lg font-black text-[#FFE3A3]">{formatProbability(lead.conversion_probability)}</p>
                        <p className="mt-1 text-xs text-slate-400">{lead.next_best_action}</p>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <EmptyState label="Sem empresas quentes calculadas." />
              )}
            </div>
          </div>

          <div className="iaweb-premium-card rounded-2xl p-5">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#3AB8FF]">
              <BarChart3 size={15} />
              Distribuicao propensity
            </p>
            <div className="mt-5 space-y-3">
              {data.propensityDistribution.length ? (
                data.propensityDistribution.map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-bold uppercase">{item.label}</span>
                      <span>{item.count}</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#00A3FF] via-[#007BFF] to-[#FFB800]" style={{ width: `${(item.count / maxPropensity) * 100}%` }} />
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState label="Sem propensity calculado." />
              )}
            </div>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-2">
          <DistributionPanel
            title="Distribuicao por canal"
            icon={Signal}
            items={data.channelDistribution.map((item) => ({ label: item.channel, count: item.count }))}
            max={maxChannel}
          />
          <DistributionPanel
            title="Distribuicao por prioridade"
            icon={Target}
            items={data.campaignPriorityDistribution.map((item) => ({ label: item.priority, count: item.count }))}
            max={maxCampaignPriority}
          />
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
          <DataTable title="Leads recentes" leads={data.recentLeads} />
          <div className="iaweb-premium-card rounded-2xl p-5">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#3AB8FF]">
              <MapPin size={15} />
              Top fontes
            </p>
            <div className="mt-5 space-y-3">
              {data.topSources.length ? (
                data.topSources.map((source) => (
                  <div key={source.source}>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-bold uppercase">{source.source}</span>
                      <span>{source.count}</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#00A3FF] via-[#007BFF] to-[#FFB800]" style={{ width: `${(source.count / maxSource) * 100}%` }} />
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState label="Sem fontes registadas." />
              )}
            </div>
          </div>
        </section>

        <DataTable title="Top 20 por propensity score" leads={data.topOpportunities} showRank />
      </div>
    </main>
  )
}

function AgentMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-1 truncate text-sm font-black text-white">{value}</p>
    </div>
  )
}

function DataTable({ title, leads, showRank = false }: { title: string; leads: CommandCenterData["recentLeads"]; showRank?: boolean }) {
  return (
    <section className="iaweb-premium-card rounded-2xl p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#3AB8FF]">{title}</p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-white">Prioridade e origem</h2>
        </div>
        <BarChart3 className="text-[#FFB800]" />
      </div>
      <div className="mt-5 overflow-x-auto">
        {leads.length ? (
          <table className="w-full min-w-[1240px] border-separate border-spacing-y-2 text-left">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
                {showRank ? <th className="px-3 py-2">#</th> : null}
                <th className="px-3 py-2">Empresa</th>
                <th className="px-3 py-2">Cidade</th>
                <th className="px-3 py-2">Energy</th>
                <th className="px-3 py-2">Pain</th>
                <th className="px-3 py-2">Propensity</th>
                <th className="px-3 py-2">Prob.</th>
                <th className="px-3 py-2">Canal</th>
                <th className="px-3 py-2">Camp.</th>
                <th className="px-3 py-2">Expected</th>
                <th className="px-3 py-2">Sequencia</th>
                <th className="px-3 py-2">Prioridade</th>
                <th className="px-3 py-2">Next action</th>
                <th className="px-3 py-2">Origem</th>
                <th className="px-3 py-2">Data</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, index) => (
                <tr key={lead.id} className="rounded-2xl bg-white/[0.035] text-sm text-slate-300">
                  {showRank ? <td className="rounded-l-2xl px-3 py-3 font-black text-[#FFB800]">{index + 1}</td> : null}
                  <td className={`${showRank ? "" : "rounded-l-2xl"} px-3 py-3 font-black text-white`}>{lead.empresa}</td>
                  <td className="px-3 py-3">{lead.cidade ?? "--"}</td>
                  <td className="px-3 py-3 font-black text-[#BFEAFF]">{lead.energy_score}</td>
                  <td className="px-3 py-3 font-black text-[#FFE3A3]">{lead.pain_score}</td>
                  <td className="px-3 py-3 font-black text-white">{lead.propensity_score}</td>
                  <td className="px-3 py-3 text-[#BFEAFF]">{formatProbability(lead.conversion_probability)}</td>
                  <td className="px-3 py-3 font-black text-white">{lead.best_channel}</td>
                  <td className="px-3 py-3 font-black text-[#FFE3A3]">{lead.campaign_priority}</td>
                  <td className="px-3 py-3 text-[#BFEAFF]">{formatProbability(lead.expected_conversion)}</td>
                  <td className="max-w-36 truncate px-3 py-3">{lead.recommended_sequence}</td>
                  <td className="px-3 py-3">
                    <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${priorityClass(lead.propensity_label)}`}>
                      {lead.propensity_label}
                    </span>
                  </td>
                  <td className="max-w-44 truncate px-3 py-3">{lead.next_best_action}</td>
                  <td className="px-3 py-3">{lead.origem}</td>
                  <td className="rounded-r-2xl px-3 py-3">{formatDate(lead.data)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState label="Sem leads para mostrar." />
        )}
      </div>
    </section>
  )
}

function DistributionPanel({ title, icon: Icon, items, max }: { title: string; icon: LucideIcon; items: Array<{ label: string; count: number }>; max: number }) {
  return (
    <div className="iaweb-premium-card rounded-2xl p-5">
      <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#3AB8FF]">
        <Icon size={15} />
        {title}
      </p>
      <div className="mt-5 space-y-3">
        {items.length ? (
          items.map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold uppercase">{item.label}</span>
                <span>{item.count}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-[#00A3FF] via-[#007BFF] to-[#FFB800]" style={{ width: `${(item.count / max) * 100}%` }} />
              </div>
            </div>
          ))
        ) : (
          <EmptyState label="Sem dados de campanha." />
        )}
      </div>
    </div>
  )
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="grid min-h-32 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-center text-sm text-slate-500">
      {label}
    </div>
  )
}
