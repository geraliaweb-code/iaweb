"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowRight, BadgeEuro, Building2, Gauge, Loader2, ShieldAlert, Sparkles, TriangleAlert } from "lucide-react"
import { getConstructionRequestError, readConstructionApiJson } from "@/lib/construction/client-api"
import type { ConstructionIntelligenceOSResult, NextBestAction } from "@/lib/construction/os"

type ConstructionOSPanelProps = {
  projectId: string
}

type ConstructionOSResponse = {
  os?: ConstructionIntelligenceOSResult
  error?: string
}

const statusLabels: Record<ConstructionIntelligenceOSResult["projectStatus"], string> = {
  healthy: "Saudavel",
  needs_attention: "Precisa de atencao",
  high_risk: "Alto risco",
  critical: "Critico",
}

export default function ConstructionOSPanel({ projectId }: ConstructionOSPanelProps) {
  const [os, setOs] = useState<ConstructionIntelligenceOSResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadOS() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/construction/projects/${projectId}/os`, { cache: "no-store" })
        const result = await readConstructionApiJson<ConstructionOSResponse>(response)

        if (!active) return

        if (!response.ok || !result.os) {
          setError(result.error ?? "Nao foi possivel carregar o Construction Intelligence OS.")
          setOs(null)
          return
        }

        setOs(result.os)
      } catch (error) {
        if (active) setError(getConstructionRequestError(error, "Falha de rede ao carregar o Construction Intelligence OS."))
      } finally {
        if (active) setIsLoading(false)
      }
    }

    void loadOS()

    return () => {
      active = false
    }
  }, [projectId])

  const nextAction = os?.nextBestActions[0] ?? null

  useEffect(() => {
    if (!nextAction) return
    void trackOSEvent(projectId, "os_action_viewed", { actionId: nextAction.id, priority: nextAction.priority })
  }, [nextAction, projectId])

  const cards = useMemo(() => {
    if (!os) return []

    return [
      { label: "Estado da Obra", value: statusLabels[os.projectStatus], icon: Building2, tone: "text-amber-100" },
      { label: "Confianca", value: `${os.confidenceScore}/100`, icon: Gauge, tone: "text-sky-100" },
      { label: "Principal Risco", value: os.topRisks[0] ?? "Sem risco critico identificado", icon: ShieldAlert, tone: "text-red-100" },
      { label: "Maior Poupanca Potencial", value: formatSaving(os.topSavings[0]), icon: BadgeEuro, tone: "text-emerald-100" },
      { label: "Fornecedor Recomendado", value: os.supplierRecommendations[0]?.supplierName ?? "Aguardando Supplier Intelligence", icon: Sparkles, tone: "text-amber-100" },
      { label: "Proxima Melhor Acao", value: nextAction?.title ?? "Aguardar novos dados do projeto", icon: ArrowRight, tone: "text-sky-100" },
    ]
  }, [nextAction, os])

  return (
    <section className="overflow-hidden rounded-2xl border border-amber-200/20 bg-[linear-gradient(135deg,rgba(2,8,23,0.98),rgba(5,22,43,0.94)_46%,rgba(16,52,83,0.82)_72%,rgba(180,132,33,0.34))] text-white shadow-[0_28px_90px_rgba(2,8,23,0.55)]">
      <div className="border-b border-white/10 bg-white/[0.035] px-5 py-5 backdrop-blur md:px-6">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-100">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Construction Intelligence OS
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">Sistema executivo de decisao</h2>
            {os ? <p className="mt-3 text-sm leading-6 text-slate-200">{os.executiveSummary.shortSummary}</p> : null}
          </div>
          {os ? (
            <span className="rounded-full border border-amber-200/25 bg-amber-200/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-amber-100">
              {statusLabels[os.projectStatus]}
            </span>
          ) : null}
        </div>
      </div>

      <div className="p-5 md:p-6">
        {isLoading ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.045] p-5 text-sm text-slate-300">
            <p className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              A consolidar Health Check, Cost, Benchmark, Advisor, Supplier, Procurement e Unlock...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-300/20 bg-red-300/10 p-5 text-sm text-red-100">
            <p className="inline-flex items-start gap-2">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {error}
            </p>
          </div>
        ) : os ? (
          <div className="grid gap-5">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {cards.map((card) => (
                <article key={card.label} className="rounded-xl border border-white/10 bg-white/[0.055] p-4 backdrop-blur">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">{card.label}</p>
                    <card.icon className={`h-4 w-4 ${card.tone}`} aria-hidden="true" />
                  </div>
                  <p className="mt-3 min-h-11 text-sm font-semibold leading-6 text-white">{card.value}</p>
                </article>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-[1fr_0.82fr]">
              <NextActionCard projectId={projectId} action={nextAction} />
              <BlockedCTA projectId={projectId} os={os} />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

function NextActionCard({ projectId, action }: { projectId: string; action: NextBestAction | null }) {
  if (!action) {
    return (
      <article className="rounded-xl border border-white/10 bg-white/[0.045] p-5">
        <p className="text-sm text-slate-300">Ainda nao existe uma acao prioritaria.</p>
      </article>
    )
  }

  return (
    <article className="rounded-xl border border-sky-200/15 bg-sky-200/10 p-5">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-100">Proxima Melhor Acao</p>
      <h3 className="mt-3 text-xl font-semibold text-white">{action.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-200">{action.description}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-200">
        <span className="rounded-full border border-white/10 bg-white/[0.055] px-3 py-1">Prioridade {action.priority}</span>
        <span className="rounded-full border border-white/10 bg-white/[0.055] px-3 py-1">Categoria {action.category}</span>
      </div>
      {action.href ? (
        <a
          href={action.href}
          onClick={() => void trackOSEvent(projectId, "os_action_clicked", { actionId: action.id, priority: action.priority })}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-amber-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-200"
        >
          {action.ctaLabel ?? "Executar acao"}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      ) : null}
    </article>
  )
}

function BlockedCTA({ projectId, os }: { projectId: string; os: ConstructionIntelligenceOSResult }) {
  if (!os.commercialCTA || !os.blockedOpportunities.length) {
    return (
      <article className="rounded-xl border border-emerald-200/15 bg-emerald-200/10 p-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-100">Oportunidades</p>
        <h3 className="mt-3 text-xl font-semibold text-white">Sem bloqueios relevantes</h3>
        <p className="mt-2 text-sm leading-6 text-slate-200">O OS consegue ler os sinais executivos principais disponiveis neste projeto.</p>
      </article>
    )
  }

  return (
    <article className="rounded-xl border border-amber-200/25 bg-amber-200/10 p-5">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-100">{os.commercialCTA.title}</p>
      <h3 className="mt-3 text-xl font-semibold text-white">{os.blockedOpportunities[0]}</h3>
      <p className="mt-2 text-sm leading-6 text-amber-50/85">{os.commercialCTA.body}</p>
      <a
        href={os.commercialCTA.href}
        onClick={() => void trackOSEvent(projectId, "os_action_clicked", { actionId: "commercial-cta", blockedOpportunities: os.blockedOpportunities })}
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-amber-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-200"
      >
        {os.commercialCTA.label}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </a>
    </article>
  )
}

function formatSaving(saving: ConstructionIntelligenceOSResult["topSavings"][number] | undefined) {
  if (!saving) return "Aguardando oportunidades"
  if (!saving.amount) return saving.title
  return `${formatEuro(saving.amount)} - ${saving.title}`
}

function formatEuro(value: number) {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value)
}

async function trackOSEvent(projectId: string, eventType: "os_action_viewed" | "os_action_clicked", metadata: Record<string, unknown>) {
  try {
    await fetch(`/api/construction/projects/${projectId}/os`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ eventType, metadata }),
    })
  } catch {
    // Analytics must never block the OS panel.
  }
}
