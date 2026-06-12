"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowRight, CalendarClock, Clock3, GitBranch, Loader2, ShieldAlert, TriangleAlert } from "lucide-react"
import { getConstructionRequestError, readConstructionApiJson } from "@/lib/construction/client-api"
import type { TimelineOutput } from "@/lib/construction/timeline"

type ConstructionTimelinePanelProps = {
  projectId: string
}

type TimelineResponse = TimelineOutput & {
  warnings?: string[]
  error?: string
}

export default function ConstructionTimelinePanel({ projectId }: ConstructionTimelinePanelProps) {
  const [timeline, setTimeline] = useState<TimelineOutput | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadTimeline() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/construction/projects/${projectId}/timeline`, { cache: "no-store" })
        const result = await readConstructionApiJson<TimelineResponse>(response)

        if (!active) return

        if (!response.ok || !result.forecast) {
          setError(result.error ?? "Nao foi possivel carregar a Timeline Intelligence.")
          setTimeline(null)
          return
        }

        setTimeline({
          estimatedDuration: result.estimatedDuration,
          phases: result.phases,
          dependencies: result.dependencies,
          criticalPath: result.criticalPath,
          delayRisks: result.delayRisks,
          forecast: result.forecast,
          nextActions: result.nextActions,
        })
      } catch (error) {
        if (active) setError(getConstructionRequestError(error, "Falha de rede ao carregar a Timeline Intelligence."))
      } finally {
        if (active) setIsLoading(false)
      }
    }

    void loadTimeline()

    return () => {
      active = false
    }
  }, [projectId])

  const nextAction = timeline?.nextActions[0] ?? null

  useEffect(() => {
    if (!nextAction) return
    void trackTimelineEvent(projectId, "timeline_action_viewed", { actionId: nextAction.id, impactWeeks: nextAction.impactWeeks })
  }, [nextAction, projectId])

  const headline = useMemo(() => {
    if (!timeline) return null
    return `${timeline.forecast.expectedMonths} meses previstos`
  }, [timeline])

  return (
    <section className="overflow-hidden rounded-2xl border border-amber-200/20 bg-[linear-gradient(135deg,rgba(2,8,23,0.98),rgba(6,29,52,0.92)_52%,rgba(153,105,24,0.34))] text-white shadow-[0_24px_80px_rgba(2,8,23,0.48)]">
      <div className="border-b border-white/10 bg-white/[0.035] p-5 backdrop-blur md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-100">
              <CalendarClock className="h-4 w-4" aria-hidden="true" />
              Timeline Intelligence
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">{headline ?? "Previsao temporal da obra"}</h2>
            {timeline ? (
              <p className="mt-3 text-sm leading-6 text-slate-200">
                Caminho critico com {timeline.criticalPath.length} fases e confianca temporal de {timeline.forecast.confidence}/100.
              </p>
            ) : null}
          </div>
          {timeline ? (
            <span className="rounded-full border border-amber-200/25 bg-amber-200/10 px-4 py-2 text-xs font-bold text-amber-100">
              {timeline.estimatedDuration.weeks} semanas
            </span>
          ) : null}
        </div>
      </div>

      <div className="p-5 md:p-6">
        {isLoading ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.045] p-5 text-sm text-slate-300">
            <p className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              A calcular fases, dependencias, caminho critico e riscos de atraso...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-300/20 bg-red-300/10 p-5 text-sm text-red-100">
            <p className="inline-flex items-start gap-2">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {error}
            </p>
          </div>
        ) : timeline ? (
          <div className="grid gap-5">
            <div className="grid gap-3 md:grid-cols-4">
              <Metric label="Melhor cenario" value={`${timeline.forecast.bestCaseMonths} meses`} icon={Clock3} />
              <Metric label="Cenario esperado" value={`${timeline.forecast.expectedMonths} meses`} icon={CalendarClock} />
              <Metric label="Pior cenario" value={`${timeline.forecast.worstCaseMonths} meses`} icon={ShieldAlert} />
              <Metric label="Confianca" value={`${timeline.forecast.confidence}/100`} icon={GitBranch} />
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <article className="rounded-xl border border-white/10 bg-white/[0.045] p-5">
                <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-sky-100">
                  <GitBranch className="h-4 w-4" aria-hidden="true" />
                  Caminho critico
                </p>
                <div className="mt-4 grid gap-3">
                  {timeline.criticalPath.slice(0, 6).map((item) => (
                    <div key={item.phaseId} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-950/45 px-4 py-3">
                      <div>
                        <p className="font-semibold text-white">{item.phaseName}</p>
                        <p className="mt-1 text-xs text-slate-400">{item.estimatedWeeks} semanas</p>
                      </div>
                      <span className="rounded-full border border-amber-200/20 px-3 py-1 text-xs font-semibold text-amber-100">{item.riskLevel}</span>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-xl border border-amber-200/20 bg-amber-200/10 p-5">
                <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-amber-100">
                  <ShieldAlert className="h-4 w-4" aria-hidden="true" />
                  Principal risco
                </p>
                <h3 className="mt-3 text-xl font-semibold text-white">{timeline.delayRisks[0]?.title ?? "Sem atraso critico identificado"}</h3>
                <p className="mt-2 text-sm leading-6 text-amber-50/85">
                  {timeline.delayRisks[0]?.recommendation ?? "A Timeline nao encontrou riscos temporais materiais com os dados atuais."}
                </p>
                {nextAction ? (
                  <button
                    type="button"
                    onClick={() => void trackTimelineEvent(projectId, "timeline_action_clicked", { actionId: nextAction.id, impactWeeks: nextAction.impactWeeks })}
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-amber-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-200"
                  >
                    Reduzir {nextAction.impactWeeks} semanas
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                ) : null}
              </article>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {timeline.nextActions.slice(0, 3).map((action) => (
                <article key={action.id} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Acao {action.priority}</p>
                  <p className="mt-3 text-sm font-semibold leading-6 text-white">{action.title}</p>
                  <p className="mt-2 text-xs text-sky-100">Impacto estimado: {action.impactWeeks} semanas</p>
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

function Metric({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Clock3 }) {
  return (
    <article className="rounded-xl border border-white/10 bg-white/[0.055] p-4">
      <Icon className="h-4 w-4 text-amber-100" aria-hidden="true" />
      <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </article>
  )
}

async function trackTimelineEvent(projectId: string, eventType: "timeline_action_viewed" | "timeline_action_clicked", metadata: Record<string, unknown>) {
  try {
    await fetch(`/api/construction/projects/${projectId}/timeline`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ eventType, metadata }),
    })
  } catch {
    // Analytics must never block the timeline experience.
  }
}
