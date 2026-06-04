"use client"

import { useCallback, useEffect, useState } from "react"
import { AlertTriangle, BarChart3, BrainCircuit, CalendarClock, CheckCircle2, Euro, Gauge, Loader2, ShieldAlert } from "lucide-react"
import { getConstructionRequestError, readConstructionApiJson } from "@/lib/construction/client-api"
import type { ConstructionHealthCheckResult, ConstructionLanguage } from "@/lib/construction/types"
import GenerateReportButton from "./GenerateReportButton"

type HealthCheckPanelProps = {
  projectId: string
  language?: ConstructionLanguage | null
}

type PanelState = {
  isRunning: boolean
  error: string | null
  message: string | null
}

const metricConfig = [
  { key: "maturityScore", labelKey: "maturity", icon: Gauge, tone: "text-sky-100" },
  { key: "riskScore", labelKey: "risk", icon: ShieldAlert, tone: "text-amber-100" },
  { key: "complexityScore", labelKey: "complexity", icon: BarChart3, tone: "text-violet-100" },
  { key: "confidenceScore", labelKey: "confidence", icon: BrainCircuit, tone: "text-emerald-100" },
] as const

const healthCopy = {
  pt: { title: "Health Check documental", generate: "Gerar Health Check", maturity: "Maturidade", risk: "Risco", complexity: "Complexidade", confidence: "Confianca", documents: "Documentos encontrados", specialties: "Especialidades identificadas", missing: "Criticos em falta", cost: "Estimativa de custo", probable: "Faixa provavel", schedule: "Prazo estimado", months: "meses", alerts: "Alertas principais" },
  fr: { title: "Health Check documentaire", generate: "Generer Health Check", maturity: "Maturite", risk: "Risque", complexity: "Complexite", confidence: "Confiance", documents: "Documents trouves", specialties: "Specialites identifiees", missing: "Critiques manquants", cost: "Estimation du cout", probable: "Fourchette probable", schedule: "Delai estime", months: "mois", alerts: "Alertes principales" },
  es: { title: "Health Check documental", generate: "Generar Health Check", maturity: "Madurez", risk: "Riesgo", complexity: "Complejidad", confidence: "Confianza", documents: "Documentos encontrados", specialties: "Especialidades identificadas", missing: "Criticos faltantes", cost: "Estimacion de coste", probable: "Rango probable", schedule: "Plazo estimado", months: "meses", alerts: "Alertas principales" },
}

function localeFromLanguage(language?: ConstructionLanguage | null) {
  if (language === "fr") return "fr-FR"
  if (language === "es") return "es-ES"
  return "pt-PT"
}

export default function HealthCheckPanel({ projectId, language = "pt" }: HealthCheckPanelProps) {
  const copy = healthCopy[language ?? "pt"]
  const [healthCheck, setHealthCheck] = useState<ConstructionHealthCheckResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [state, setState] = useState<PanelState>({
    isRunning: false,
    error: null,
    message: null,
  })

  const loadHealthCheck = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/construction/projects/${projectId}/run-scores`, { cache: "no-store" })
      const result = await readConstructionApiJson<{ healthCheck?: ConstructionHealthCheckResult | null }>(response)
      setHealthCheck(result.healthCheck ?? null)

      if (!response.ok || result.error) {
        setState((current) => ({ ...current, error: result.error ?? "Nao foi possivel carregar o Health Check." }))
      }
    } catch (error) {
      setState((current) => ({
        ...current,
        error: getConstructionRequestError(error, "Falha de rede ao carregar o Health Check."),
      }))
    } finally {
      setIsLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    void loadHealthCheck()
  }, [loadHealthCheck])

  async function runHealthCheck() {
    setState({
      isRunning: true,
      error: null,
      message: "A calcular scores, custo preliminar e prazo estimado...",
    })

    try {
      const response = await fetch(`/api/construction/projects/${projectId}/run-scores`, {
        method: "POST",
      })
      const result = await readConstructionApiJson<{ healthCheck?: ConstructionHealthCheckResult | null }>(response)

      if (!response.ok || !result.healthCheck) {
        setState({
          isRunning: false,
          error: result.error ?? "Nao foi possivel gerar o Health Check.",
          message: null,
        })
        return
      }

      setHealthCheck(result.healthCheck)
      setState({
        isRunning: false,
        error: null,
        message: "Health Check gerado com sucesso.",
      })
    } catch (error) {
      setState({
        isRunning: false,
        error: getConstructionRequestError(error, "Falha de rede ao gerar o Health Check."),
        message: null,
      })
    }
  }

  const hasScores = Boolean(healthCheck?.scores.length)

  return (
    <section className="iaweb-premium-card rounded-2xl p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200">Scores Engine V1</p>
          <h2 className="mt-2 text-xl font-semibold text-white">{copy.title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
            Calcula scores iniciais a partir dos documentos classificados. Sem custo detalhado, prazo detalhado, benchmark ou IA externa.
          </p>
        </div>
        <button
          type="button"
          onClick={runHealthCheck}
          disabled={state.isRunning}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-300 to-amber-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {state.isRunning ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Gauge className="h-4 w-4" aria-hidden="true" />}
          {copy.generate}
        </button>
      </div>

      <div className="mt-5">
        <GenerateReportButton projectId={projectId} compact />
      </div>

      {state.message ? (
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-sky-300/20 bg-sky-300/10 p-4 text-sm text-sky-100">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{state.message}</span>
        </div>
      ) : null}

      {state.error ? (
        <div className="mt-5 flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-red-300/20 bg-red-300/10 p-4 text-sm text-red-100">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{state.error}</span>
          </div>
          <button type="button" onClick={loadHealthCheck} className="rounded-full border border-red-200/30 px-3 py-1 text-xs font-semibold text-red-50">
            Tentar novamente
          </button>
        </div>
      ) : null}

      {isLoading ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-slate-300">A carregar Health Check...</div>
      ) : hasScores && healthCheck ? (
        <div className="mt-6 grid gap-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metricConfig.map((metric) => {
              const Icon = metric.icon
              const value = healthCheck[metric.key]

              return (
                <article key={metric.key} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm text-slate-300">{copy[metric.labelKey]}</p>
                    <Icon className={`h-5 w-5 ${metric.tone}`} aria-hidden="true" />
                  </div>
                  <p className="mt-5 text-4xl font-semibold tracking-tight text-white">
                    {value}
                    <span className="text-lg text-slate-400">/100</span>
                  </p>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-950/70">
                    <div className="h-full rounded-full bg-sky-300" style={{ width: `${value}%` }} />
                  </div>
                </article>
              )
            })}
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <InfoCard title={copy.documents} value={String(healthCheck.documentsFound)} />
            <InfoCard title={copy.specialties} value={healthCheck.identifiedSpecialties.length ? healthCheck.identifiedSpecialties.join(", ") : "Nenhuma"} />
            <InfoCard title={copy.missing} value={healthCheck.missingCriticalDocuments.length ? healthCheck.missingCriticalDocuments.join(", ") : "Sem faltas criticas"} />
          </div>

          <EstimateSection healthCheck={healthCheck} language={language} />
          <KnowledgeGraphSection healthCheck={healthCheck} />

          <div>
            <h3 className="font-semibold text-white">{copy.alerts}</h3>
            {healthCheck.alerts.length ? (
              <div className="mt-4 grid gap-3">
                {healthCheck.alerts.map((alert, index) => (
                  <article key={`${alert.type}-${index}`} className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">{alert.title}</p>
                        <p className="mt-2 text-sm leading-6 text-amber-50/80">{alert.recommendation}</p>
                      </div>
                      <span className="rounded-full border border-amber-200/20 px-3 py-1 text-xs font-semibold text-amber-100">
                        {alert.severity}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm text-emerald-100">
                Sem alertas principais registados pelo Scores Engine V1.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
          <Gauge className="mx-auto h-7 w-7 text-sky-200" aria-hidden="true" />
          <p className="mt-3 font-semibold text-white">Health Check ainda nao gerado.</p>
          <p className="mt-2 text-sm text-slate-400">Classifica documentos e executa o primeiro Scores Engine V1.</p>
        </div>
      )}
    </section>
  )
}

function KnowledgeGraphSection({ healthCheck }: { healthCheck: ConstructionHealthCheckResult }) {
  const graph = healthCheck.knowledgeGraph

  if (!graph) {
    return (
      <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Inteligencia Relacional</p>
        <h3 className="mt-2 font-semibold text-white">Knowledge Graph V1</h3>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          Gera o Health Check para ligar documentos, especialidades, elementos, riscos, custo e prazo numa leitura relacional.
        </p>
      </article>
    )
  }

  return (
    <article className="rounded-2xl border border-sky-300/20 bg-sky-300/10 p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-amber-200">Inteligencia Relacional</p>
      <h3 className="mt-2 font-semibold text-white">Knowledge Graph V1</h3>
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <GraphList title="Entidades principais" items={graph.mainEntities} />
        <GraphList title="Relacoes principais" items={graph.mainRelations} />
        <GraphList title="Recomendacoes" items={graph.recommendations} />
      </div>
      {(graph.derivedRisks.length || graph.costFactors.length || graph.scheduleFactors.length) ? (
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          <GraphList title="Riscos derivados" items={graph.derivedRisks} />
          <GraphList title="Fatores de custo" items={graph.costFactors} />
          <GraphList title="Fatores de prazo" items={graph.scheduleFactors} />
        </div>
      ) : null}
    </article>
  )
}

function GraphList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/30 p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{title}</p>
      {items.length ? (
        <div className="mt-3 grid gap-2">
          {items.slice(0, 4).map((item) => (
            <p key={item} className="text-sm leading-5 text-slate-200">
              {item}
            </p>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm text-slate-400">Sem sinais suficientes.</p>
      )}
    </div>
  )
}

function EstimateSection({ healthCheck, language = "pt" }: { healthCheck: ConstructionHealthCheckResult; language?: ConstructionLanguage | null }) {
  const copy = healthCopy[language ?? "pt"]
  const locale = localeFromLanguage(language)

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{copy.cost}</p>
            <h3 className="mt-2 font-semibold text-white">Faixa preliminar inteligente</h3>
          </div>
          <Euro className="h-5 w-5 text-amber-100" aria-hidden="true" />
        </div>
        {healthCheck.costEstimate ? (
          <div className="mt-5">
            <p className="text-3xl font-semibold tracking-tight text-white">{formatEuro(healthCheck.costEstimate.estimatedCostMid, locale)}</p>
            <p className="mt-2 text-sm text-slate-300">
              {copy.probable}: {formatEuro(healthCheck.costEstimate.estimatedCostMin, locale)} a {formatEuro(healthCheck.costEstimate.estimatedCostMax, locale)}
            </p>
            <p className="mt-3 text-sm text-sky-100">Confianca: {healthCheck.costEstimate.costConfidence}/100</p>
            {healthCheck.costEstimate.scenarios?.length ? (
              <div className="mt-4 grid gap-2">
                {healthCheck.costEstimate.scenarios.map((scenario) => (
                  <div key={scenario.id} className="rounded-xl border border-white/10 bg-slate-950/30 p-3">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{scenario.label}</p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {formatEuro(scenario.min, locale)} a {formatEuro(scenario.max, locale)}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}
            {healthCheck.costEstimate.calculationBasis ? (
              <div className="mt-4 grid gap-2 rounded-xl border border-white/10 bg-slate-950/30 p-3 text-xs leading-5 text-slate-300">
                <p>Mercado de Referencia: {healthCheck.costEstimate.calculationBasis.marketReference}</p>
                <p>Segmento: {healthCheck.costEstimate.calculationBasis.marketSegment ?? "Normal"}</p>
                <p>Fornecedor Base: {healthCheck.costEstimate.calculationBasis.suppliers?.[0] ?? "Base interna IAWEB"}</p>
                <p>Categoria Principal: {healthCheck.costEstimate.calculationBasis.dominantCategory ?? "Estrutura"}</p>
              </div>
            ) : null}
            <Notes notes={healthCheck.costEstimate.costNotes} />
          </div>
        ) : (
          <p className="mt-5 text-sm text-slate-400">Gera o Health Check para criar uma estimativa preliminar de custo.</p>
        )}
      </article>

      <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{copy.schedule}</p>
            <h3 className="mt-2 font-semibold text-white">Faixa provavel de prazo</h3>
          </div>
          <CalendarClock className="h-5 w-5 text-sky-100" aria-hidden="true" />
        </div>
        {healthCheck.scheduleEstimate ? (
          <div className="mt-5">
            <p className="text-3xl font-semibold tracking-tight text-white">{healthCheck.scheduleEstimate.estimatedMonthsMid} {copy.months}</p>
            <p className="mt-2 text-sm text-slate-300">
              {copy.probable}: {healthCheck.scheduleEstimate.estimatedMonthsMin} a {healthCheck.scheduleEstimate.estimatedMonthsMax} {copy.months}
            </p>
            <p className="mt-3 text-sm text-sky-100">Confianca: {healthCheck.scheduleEstimate.scheduleConfidence}/100</p>
            <Notes notes={healthCheck.scheduleEstimate.scheduleNotes} />
          </div>
        ) : (
          <p className="mt-5 text-sm text-slate-400">Gera o Health Check para criar uma estimativa preliminar de prazo.</p>
        )}
      </article>
    </div>
  )
}

function Notes({ notes }: { notes: string[] }) {
  if (!notes.length) return null

  return (
    <div className="mt-4 grid gap-2">
      {notes.slice(0, 4).map((note) => (
        <p key={note} className="rounded-xl border border-white/10 bg-slate-950/30 p-3 text-xs leading-5 text-slate-300">
          {note}
        </p>
      ))}
    </div>
  )
}

function formatEuro(value: number, locale = "pt-PT") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value)
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{title}</p>
      <p className="mt-3 text-sm font-medium leading-6 text-white">{value}</p>
    </article>
  )
}
