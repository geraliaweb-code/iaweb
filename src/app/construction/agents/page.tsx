import type { Metadata } from "next"
import { Activity, Bot, CheckCircle2, Clock3, Database, PauseCircle, Send, ShieldCheck } from "lucide-react"
import ConstructionShell from "@/components/construction/ConstructionShell"
import {
  constructionAgentActivation,
  constructionAgentQualityGates,
  getConstructionAgentNetworkSnapshot,
  type ConstructionAgentStatus,
} from "@/lib/construction/agent-network"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Agent Network | IAWEB Construction",
}

const statusStyles: Record<ConstructionAgentStatus, string> = {
  active: "border-emerald-400/35 bg-emerald-500/12 text-emerald-100",
  scheduled: "border-sky-400/35 bg-sky-500/12 text-sky-100",
  standby: "border-slate-400/25 bg-slate-500/12 text-slate-200",
}

const statusIcons = {
  active: CheckCircle2,
  scheduled: Clock3,
  standby: PauseCircle,
}

export default async function ConstructionAgentsPage() {
  const snapshot = await getConstructionAgentNetworkSnapshot()
  const activeCount = snapshot.runtime.online ? snapshot.runtime.activeAgents.length : constructionAgentActivation.filter((agent) => agent.status === "active").length
  const scheduledCount = constructionAgentActivation.filter((agent) => agent.status === "scheduled").length

  return (
    <ConstructionShell eyebrow="Agent Network">
      <section className="py-8 sm:py-12">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="construction-glass-card rounded-lg p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">Sprint 45</p>
                <h1 className="mt-3 max-w-3xl text-3xl font-bold text-white sm:text-5xl">Construction Agent Network Foundation</h1>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                  Infraestrutura staging para receber propostas PT, normalizar materiais com regras deterministicas,
                  auditar qualidade e colocar a aprovacao Diego/Governor antes de qualquer escrita DataMoat.
                </p>
              </div>
              <div className="rounded-lg border border-amber-400/25 bg-amber-500/10 px-4 py-3 text-sm font-semibold text-amber-100">
                Ciclos automaticos: {snapshot.runtime.automaticCyclesEnabled ? "ON" : "OFF"}
              </div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {[
                { label: "Ativos Semana 1", value: activeCount, icon: Bot },
                { label: "Agendados", value: scheduledCount, icon: Clock3 },
                { label: snapshot.runtime.online ? "VPS Online" : "Propostas PT", value: snapshot.runtime.online ? "24/7" : snapshot.proposals.length, icon: Activity },
              ].map((metric) => {
                const Icon = metric.icon
                return (
                  <div key={metric.label} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                    <Icon className="h-5 w-5 text-amber-300" aria-hidden="true" />
                    <p className="mt-3 text-2xl font-bold text-white">{metric.value}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{metric.label}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="construction-glass-card rounded-lg p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-emerald-300" aria-hidden="true" />
              <h2 className="text-xl font-bold text-white">Quality Gates</h2>
            </div>
            <div className="mt-5 space-y-3">
              {constructionAgentQualityGates.map((gate) => (
                <div key={gate} className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm text-slate-200">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" aria-hidden="true" />
                  <span>{gate}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {snapshot.warning ? (
          <div className="mt-5 rounded-lg border border-amber-400/25 bg-amber-500/10 p-4 text-sm text-amber-100">{snapshot.warning}</div>
        ) : snapshot.runtime.online ? (
          <div className="mt-5 rounded-lg border border-emerald-400/25 bg-emerald-500/10 p-4 text-sm text-emerald-100">
            VPS Agent Network online em {snapshot.runtime.endpoint}. Ativos: {snapshot.runtime.activeAgents.join(", ")}.
          </div>
        ) : null}

        <div className="mt-5 grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
          <section className="construction-glass-card rounded-lg p-6">
            <div className="flex items-center gap-3">
              <Database className="h-6 w-6 text-sky-300" aria-hidden="true" />
              <h2 className="text-xl font-bold text-white">Ativacao Progressiva</h2>
            </div>
            <div className="mt-5 grid gap-3">
              {constructionAgentActivation.map((agent) => {
                const Icon = statusIcons[agent.status]
                return (
                  <div key={agent.code} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-white">{agent.label}</p>
                        <p className="mt-1 text-sm text-slate-400">{agent.role}</p>
                      </div>
                      <span className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] ${statusStyles[agent.status]}`}>
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        {agent.week}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="construction-glass-card rounded-lg p-6">
            <div className="flex items-center gap-3">
              <Send className="h-6 w-6 text-amber-300" aria-hidden="true" />
              <h2 className="text-xl font-bold text-white">Propostas e Workflow</h2>
            </div>
            <div className="mt-5 overflow-hidden rounded-lg border border-white/10">
              <div className="grid grid-cols-[1.2fr_0.8fr_0.8fr_0.6fr] bg-white/[0.06] px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-300">
                <span>Fonte</span>
                <span>Status</span>
                <span>Valor</span>
                <span>Audit</span>
              </div>
              {snapshot.proposals.map((proposal) => (
                <div key={proposal.id} className="grid grid-cols-[1.2fr_0.8fr_0.8fr_0.6fr] gap-3 border-t border-white/10 px-4 py-4 text-sm text-slate-200">
                  <span className="min-w-0">
                    <strong className="block truncate text-white">{proposal.source}</strong>
                    <span className="text-xs text-slate-400">{proposal.country} / {proposal.id}</span>
                  </span>
                  <span>{proposal.status}</span>
                  <span>{proposal.value}</span>
                  <span className="font-bold text-emerald-300">{proposal.auditScore}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3">
              {snapshot.logs.map((log) => (
                <div key={log.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                    <span className="text-amber-300">{log.agent}</span>
                    <span>{log.stage}</span>
                  </div>
                  <p className="mt-2 text-slate-200">{log.message}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </ConstructionShell>
  )
}
