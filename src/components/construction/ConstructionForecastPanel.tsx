"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowRight, BadgeEuro, Loader2, TrendingDown, TrendingUp, TriangleAlert } from "lucide-react"
import { getConstructionRequestError, readConstructionApiJson } from "@/lib/construction/client-api"
import type { CostForecastOutput } from "@/lib/construction/cost-forecasting"

type ConstructionForecastPanelProps = {
  projectId: string
}

type ForecastResponse = CostForecastOutput & {
  warnings?: string[]
  error?: string
}

export default function ConstructionForecastPanel({ projectId }: ConstructionForecastPanelProps) {
  const [forecast, setForecast] = useState<CostForecastOutput | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadForecast() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/construction/projects/${projectId}/forecast`, { cache: "no-store" })
        const result = await readConstructionApiJson<ForecastResponse>(response)

        if (!active) return

        if (!response.ok || typeof result.currentCost !== "number") {
          setError(result.error ?? "Nao foi possivel carregar o Cost Forecasting.")
          setForecast(null)
          return
        }

        setForecast({
          currentCost: result.currentCost,
          bestCase: result.bestCase,
          expectedCase: result.expectedCase,
          worstCase: result.worstCase,
          scenarios: result.scenarios,
          costVariation: result.costVariation,
          delayImpacts: result.delayImpacts,
          forecastRisks: result.forecastRisks,
          recommendations: result.recommendations,
          summary: result.summary,
        })
      } catch (error) {
        if (active) setError(getConstructionRequestError(error, "Falha de rede ao carregar o Cost Forecasting."))
      } finally {
        if (active) setIsLoading(false)
      }
    }

    void loadForecast()

    return () => {
      active = false
    }
  }, [projectId])

  const mainRecommendation = forecast?.recommendations[0] ?? null

  useEffect(() => {
    if (!forecast) return
    void trackForecastEvent(projectId, "forecast_viewed", { expectedCase: forecast.expectedCase, worstCase: forecast.worstCase })
  }, [forecast, projectId])

  const metrics = useMemo(() => {
    if (!forecast) return []
    return [
      { label: "Custo atual", value: formatEuro(forecast.currentCost), detail: "Base Cost Intelligence", icon: BadgeEuro },
      { label: "Melhor cenario", value: formatEuro(forecast.bestCase), detail: formatDelta(forecast.costVariation.optimisticDelta), icon: TrendingDown },
      { label: "Cenario esperado", value: formatEuro(forecast.expectedCase), detail: formatDelta(forecast.costVariation.expectedDelta), icon: BadgeEuro },
      { label: "Pior cenario", value: formatEuro(forecast.worstCase), detail: formatDelta(forecast.costVariation.pessimisticDelta), icon: TrendingUp },
    ]
  }, [forecast])

  return (
    <section className="overflow-hidden rounded-2xl border border-amber-200/20 bg-[linear-gradient(135deg,rgba(2,8,23,0.98),rgba(6,35,55,0.94)_48%,rgba(78,91,35,0.34)_72%,rgba(185,132,30,0.28))] text-white shadow-[0_24px_80px_rgba(2,8,23,0.48)]">
      <div className="border-b border-white/10 bg-white/[0.035] p-5 backdrop-blur md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-100">
              <BadgeEuro className="h-4 w-4" aria-hidden="true" />
              Construction Cost Forecasting
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
              {forecast ? formatEuro(forecast.expectedCase) : "Previsao futura de custo"}
            </h2>
            {forecast ? <p className="mt-3 text-sm leading-6 text-slate-200">{forecast.summary.body}</p> : null}
          </div>
          {forecast ? (
            <span className="rounded-full border border-amber-200/25 bg-amber-200/10 px-4 py-2 text-xs font-bold text-amber-100">
              Pior {formatEuro(forecast.worstCase)}
            </span>
          ) : null}
        </div>
      </div>

      <div className="p-5 md:p-6">
        {isLoading ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.045] p-5 text-sm text-slate-300">
            <p className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              A projetar custo atual, cenarios, atrasos e risco futuro...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-300/20 bg-red-300/10 p-5 text-sm text-red-100">
            <p className="inline-flex items-start gap-2">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {error}
            </p>
          </div>
        ) : forecast ? (
          <div className="grid gap-5">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {metrics.map((metric) => (
                <article key={metric.label} className="rounded-xl border border-white/10 bg-white/[0.055] p-4">
                  <metric.icon className="h-4 w-4 text-amber-100" aria-hidden="true" />
                  <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">{metric.label}</p>
                  <p className="mt-2 text-lg font-semibold text-white">{metric.value}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-300">{metric.detail}</p>
                </article>
              ))}
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
              <article className="rounded-xl border border-white/10 bg-white/[0.045] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-100">Impacto dos atrasos</p>
                <div className="mt-4 grid gap-3">
                  {forecast.delayImpacts.length ? forecast.delayImpacts.slice(0, 4).map((impact) => (
                    <div key={impact.title} className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-slate-950/45 p-4">
                      <div>
                        <p className="font-semibold text-white">{impact.title}</p>
                        <p className="mt-1 text-xs text-slate-400">{impact.delayWeeks} semanas · +{impact.impactPercent}%</p>
                      </div>
                      <span className="text-sm font-bold text-amber-100">{formatEuro(impact.impact)}</span>
                    </div>
                  )) : (
                    <p className="rounded-xl border border-white/10 bg-slate-950/45 p-4 text-sm text-slate-300">Sem atrasos materiais identificados.</p>
                  )}
                </div>
              </article>

              <article className="rounded-xl border border-amber-200/20 bg-amber-200/10 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-100">Reducao de custo futuro</p>
                <h3 className="mt-3 text-xl font-semibold text-white">{mainRecommendation?.title ?? "Sem recomendacao prioritaria"}</h3>
                <p className="mt-2 text-sm leading-6 text-amber-50/85">
                  {mainRecommendation ? `Reducao esperada estimada: ${mainRecommendation.expectedReduction}%.` : "Ainda nao existem sinais suficientes para estimar reducao futura."}
                </p>
                {mainRecommendation ? (
                  <button
                    type="button"
                    onClick={() => void trackForecastEvent(projectId, "forecast_action_clicked", { recommendation: mainRecommendation.title })}
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-amber-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-200"
                  >
                    Reduzir custo futuro
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                ) : null}
              </article>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

function formatEuro(value: number) {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value)
}

function formatDelta(value: number) {
  if (value === 0) return "Sem variacao"
  return `${value > 0 ? "+" : ""}${formatEuro(value)}`
}

async function trackForecastEvent(projectId: string, eventType: "forecast_viewed" | "forecast_action_clicked", metadata: Record<string, unknown>) {
  try {
    await fetch(`/api/construction/projects/${projectId}/forecast`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ eventType, metadata }),
    })
  } catch {
    // Analytics must never block the forecast experience.
  }
}
