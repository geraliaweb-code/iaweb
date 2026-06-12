"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowRight, BadgeEuro, Gauge, Loader2, ShieldAlert, Timer, TriangleAlert } from "lucide-react"
import { getConstructionRequestError, readConstructionApiJson } from "@/lib/construction/client-api"
import type { ConstructionRiskReport, RiskSeverity } from "@/lib/construction/risk-v2"

type ConstructionRiskPanelProps = {
  projectId: string
}

type RiskResponse = ConstructionRiskReport & {
  warnings?: string[]
  error?: string
}

const levelLabels: Record<RiskSeverity, string> = {
  critical: "Critico",
  high: "Alto",
  medium: "Medio",
  low: "Baixo",
}

export default function ConstructionRiskPanel({ projectId }: ConstructionRiskPanelProps) {
  const [report, setReport] = useState<ConstructionRiskReport | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadRisk() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/construction/projects/${projectId}/risk`, { cache: "no-store" })
        const result = await readConstructionApiJson<RiskResponse>(response)

        if (!active) return

        if (!response.ok || typeof result.overallRiskScore !== "number") {
          setError(result.error ?? "Nao foi possivel carregar a Risk Intelligence.")
          setReport(null)
          return
        }

        setReport({
          overallRiskScore: result.overallRiskScore,
          riskLevel: result.riskLevel,
          risks: result.risks,
          topFinancialRisks: result.topFinancialRisks,
          topTimelineRisks: result.topTimelineRisks,
          topConfidenceRisks: result.topConfidenceRisks,
          recommendations: result.recommendations,
        })
      } catch (error) {
        if (active) setError(getConstructionRequestError(error, "Falha de rede ao carregar a Risk Intelligence."))
      } finally {
        if (active) setIsLoading(false)
      }
    }

    void loadRisk()

    return () => {
      active = false
    }
  }, [projectId])

  const mainRisk = report?.risks[0] ?? null
  const bestRecommendation = report?.recommendations[0] ?? null

  useEffect(() => {
    if (!mainRisk) return
    void trackRiskEvent(projectId, "risk_viewed", { riskId: mainRisk.id, severity: mainRisk.severity })
  }, [mainRisk, projectId])

  const metrics = useMemo(() => {
    if (!report) return []

    return [
      { label: "Risco global", value: `${report.overallRiskScore}/100`, detail: levelLabels[report.riskLevel], icon: Gauge },
      { label: "Risco financeiro", value: formatEuro(report.topFinancialRisks[0]?.impact ?? 0), detail: report.topFinancialRisks[0]?.title ?? "Sem risco financeiro material", icon: BadgeEuro },
      { label: "Risco de atraso", value: `${report.topTimelineRisks[0]?.impactWeeks ?? 0} semanas`, detail: report.topTimelineRisks[0]?.title ?? "Sem atraso critico", icon: Timer },
      { label: "Impacto confianca", value: `-${report.topConfidenceRisks[0]?.confidenceReduction ?? 0}`, detail: report.topConfidenceRisks[0]?.title ?? "Sem queda relevante", icon: ShieldAlert },
    ]
  }, [report])

  return (
    <section className="overflow-hidden rounded-2xl border border-amber-200/20 bg-[linear-gradient(135deg,rgba(2,8,23,0.98),rgba(24,38,58,0.94)_48%,rgba(142,48,35,0.34)_76%,rgba(183,132,31,0.28))] text-white shadow-[0_24px_80px_rgba(2,8,23,0.5)]">
      <div className="border-b border-white/10 bg-white/[0.035] p-5 backdrop-blur md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-100">
              <ShieldAlert className="h-4 w-4" aria-hidden="true" />
              Risk Intelligence V2
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
              {report ? `Risco ${levelLabels[report.riskLevel].toLowerCase()} da obra` : "Risco executivo da obra"}
            </h2>
            {mainRisk ? <p className="mt-3 text-sm leading-6 text-slate-200">Risco mais urgente: {mainRisk.title}.</p> : null}
          </div>
          {report ? (
            <span className="rounded-full border border-amber-200/25 bg-amber-200/10 px-4 py-2 text-xs font-bold text-amber-100">
              {report.overallRiskScore}/100
            </span>
          ) : null}
        </div>
      </div>

      <div className="p-5 md:p-6">
        {isLoading ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.045] p-5 text-sm text-slate-300">
            <p className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              A calcular risco financeiro, prazo, confianca e recomendacoes...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-300/20 bg-red-300/10 p-5 text-sm text-red-100">
            <p className="inline-flex items-start gap-2">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {error}
            </p>
          </div>
        ) : report ? (
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
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-100">Top riscos</p>
                <div className="mt-4 grid gap-3">
                  {report.risks.slice(0, 4).map((risk) => (
                    <div key={risk.id} className="rounded-xl border border-white/10 bg-slate-950/45 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-white">{risk.title}</p>
                          <p className="mt-1 text-xs text-slate-400">
                            {risk.category} · {risk.probability}
                          </p>
                        </div>
                        <span className="rounded-full border border-amber-200/20 px-3 py-1 text-xs font-semibold text-amber-100">
                          {levelLabels[risk.severity]}
                        </span>
                      </div>
                      <p className="mt-3 text-xs text-slate-300">
                        {formatEuro(risk.impact.financialImpactExpected)} · {risk.impact.timelineImpactWeeks} semanas · -{risk.impact.confidenceReduction} confianca
                      </p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-xl border border-amber-200/20 bg-amber-200/10 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-100">Recomendacao principal</p>
                <h3 className="mt-3 text-xl font-semibold text-white">{bestRecommendation?.title ?? "Sem recomendacao prioritaria"}</h3>
                <p className="mt-2 text-sm leading-6 text-amber-50/85">
                  {bestRecommendation?.action ?? "Ainda nao existem sinais suficientes para uma recomendacao executiva de risco."}
                </p>
                {bestRecommendation ? (
                  <button
                    type="button"
                    onClick={() => void trackRiskEvent(projectId, "risk_action_clicked", { recommendation: bestRecommendation.title })}
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-amber-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-200"
                  >
                    Reduzir risco
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

async function trackRiskEvent(projectId: string, eventType: "risk_viewed" | "risk_action_clicked", metadata: Record<string, unknown>) {
  try {
    await fetch(`/api/construction/projects/${projectId}/risk`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ eventType, metadata }),
    })
  } catch {
    // Analytics must never block the risk experience.
  }
}
