"use client"

import { useCallback, useEffect, useState } from "react"
import { BarChart3, CheckCircle2, Loader2, Scale, TriangleAlert } from "lucide-react"
import { getConstructionRequestError, readConstructionApiJson } from "@/lib/construction/client-api"
import type { ConstructionBenchmarkRecord, ConstructionBenchmarkResult } from "@/lib/construction/types"

type BenchmarkPanelProps = {
  projectId: string
  demoMode?: boolean
}

const demoBenchmark: ConstructionBenchmarkResult = {
  summary: "A sua documentacao esta acima da media do mercado.",
  matches: 1,
  benchmarks: [
    { id: "demo-b-1", project_id: "demo", benchmark_type: "maturity_score", benchmark_value: 68, project_value: 78, difference_percent: 15, notes: "acima da media face a 1 obra semelhante.", created_at: new Date().toISOString() },
    { id: "demo-b-2", project_id: "demo", benchmark_type: "risk_score", benchmark_value: 52, project_value: 36, difference_percent: -31, notes: "acima da media face a 1 obra semelhante.", created_at: new Date().toISOString() },
    { id: "demo-b-3", project_id: "demo", benchmark_type: "complexity_score", benchmark_value: 76, project_value: 74, difference_percent: -3, notes: "dentro da media face a 1 obra semelhante.", created_at: new Date().toISOString() },
    { id: "demo-b-4", project_id: "demo", benchmark_type: "confidence_score", benchmark_value: 64, project_value: 81, difference_percent: 27, notes: "acima da media face a 1 obra semelhante.", created_at: new Date().toISOString() },
    { id: "demo-b-5", project_id: "demo", benchmark_type: "estimated_cost_mid", benchmark_value: 13800000, project_value: 15100000, difference_percent: 9, notes: "dentro da media face a 1 obra semelhante.", created_at: new Date().toISOString() },
    { id: "demo-b-6", project_id: "demo", benchmark_type: "estimated_months_mid", benchmark_value: 24, project_value: 26, difference_percent: 8, notes: "dentro da media face a 1 obra semelhante.", created_at: new Date().toISOString() },
  ],
}

const labels: Record<string, string> = {
  maturity_score: "Maturidade",
  risk_score: "Risco",
  complexity_score: "Complexidade",
  confidence_score: "Confianca",
  estimated_cost_mid: "Custo",
  estimated_months_mid: "Prazo",
}

export default function BenchmarkPanel({ projectId, demoMode = false }: BenchmarkPanelProps) {
  const [benchmark, setBenchmark] = useState<ConstructionBenchmarkResult | null>(demoMode ? demoBenchmark : null)
  const [isLoading, setIsLoading] = useState(!demoMode)
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const loadBenchmark = useCallback(async () => {
    if (demoMode) return
    setIsLoading(true)
    try {
      const response = await fetch(`/api/construction/projects/${projectId}/benchmark`, { cache: "no-store" })
      const result = await readConstructionApiJson<{ benchmark?: ConstructionBenchmarkResult | null }>(response)
      setBenchmark(result.benchmark ?? null)
      setError(!response.ok || result.error ? result.error ?? "Nao foi possivel carregar benchmark." : null)
    } catch (error) {
      setError(getConstructionRequestError(error, "Falha de rede ao carregar benchmark."))
    } finally {
      setIsLoading(false)
    }
  }, [demoMode, projectId])

  useEffect(() => {
    void loadBenchmark()
  }, [loadBenchmark])

  async function runBenchmark() {
    if (demoMode) {
      setMessage("Benchmark demo carregado.")
      return
    }

    setIsRunning(true)
    setMessage(null)
    setError(null)
    try {
      const response = await fetch(`/api/construction/projects/${projectId}/benchmark`, { method: "POST" })
      const result = await readConstructionApiJson<{ benchmark?: ConstructionBenchmarkResult | null }>(response)
      setIsRunning(false)

      if (!response.ok || !result.benchmark) {
        setError(result.error ?? "Nao foi possivel gerar benchmark.")
        return
      }

      setBenchmark(result.benchmark)
      setMessage("Benchmark gerado com sucesso.")
    } catch (error) {
      setIsRunning(false)
      setError(getConstructionRequestError(error, "Falha de rede ao gerar benchmark."))
    }
  }

  return (
    <section className="iaweb-premium-card rounded-2xl p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200">Benchmark Engine V1</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Projeto vs Mercado</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
            Comparacao simulada com obras semelhantes por tipo, pais e faixa de area ate existir base real de mercado.
          </p>
        </div>
        <button
          type="button"
          onClick={runBenchmark}
          disabled={isRunning}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-300 to-amber-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isRunning ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Scale className="h-4 w-4" aria-hidden="true" />}
          Gerar Benchmark
        </button>
      </div>

      {message ? <p className="mt-5 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm text-emerald-100">{message}</p> : null}
      {error ? (
        <div className="mt-5 flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-red-300/20 bg-red-300/10 p-4 text-sm text-red-100">
          <div className="flex items-start gap-2">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
          <button type="button" onClick={loadBenchmark} className="rounded-full border border-red-200/30 px-3 py-1 text-xs font-semibold text-red-50">
            Tentar novamente
          </button>
        </div>
      ) : null}

      {isLoading ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-slate-300">A carregar benchmark...</div>
      ) : benchmark?.benchmarks.length ? (
        <div className="mt-6 grid gap-6">
          <div className="rounded-2xl border border-sky-300/20 bg-sky-300/10 p-5">
            <BarChart3 className="h-5 w-5 text-sky-200" aria-hidden="true" />
            <p className="mt-3 text-lg font-semibold text-white">{benchmark.summary}</p>
            <p className="mt-2 text-sm text-slate-300">{benchmark.matches ? `${benchmark.matches} obras semelhantes no dataset mock.` : "Dataset mock inicial."}</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {benchmark.benchmarks.map((item) => (
              <BenchmarkCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
          <Scale className="mx-auto h-7 w-7 text-sky-200" aria-hidden="true" />
          <p className="mt-3 font-semibold text-white">Benchmark ainda nao gerado.</p>
          <p className="mt-2 text-sm text-slate-400">Gera o Health Check e depois compara o projeto com obras semelhantes.</p>
        </div>
      )}
    </section>
  )
}

function BenchmarkCard({ item }: { item: ConstructionBenchmarkRecord }) {
  const status = item.notes?.split(" face ")[0] ?? "dentro da media"
  const lowerIsBetter = ["risk_score", "estimated_cost_mid", "estimated_months_mid"].includes(item.benchmark_type)
  const isGood = lowerIsBetter ? item.project_value <= item.benchmark_value : item.project_value >= item.benchmark_value
  const projectLabel = formatValue(item.benchmark_type, item.project_value)
  const benchmarkLabel = formatValue(item.benchmark_type, item.benchmark_value)

  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{labels[item.benchmark_type] ?? item.benchmark_type}</p>
          <h3 className="mt-2 font-semibold text-white">Projeto vs Mercado</h3>
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${isGood ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100" : "border-amber-300/20 bg-amber-300/10 text-amber-100"}`}>
          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
          {status}
        </span>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Metric label="Projeto" value={projectLabel} />
        <Metric label="Mercado" value={benchmarkLabel} />
      </div>
      <div className="mt-4 grid gap-2">
        <Bar label="Projeto" value={item.project_value} max={Math.max(item.project_value, item.benchmark_value)} tone="bg-sky-300" />
        <Bar label="Mercado" value={item.benchmark_value} max={Math.max(item.project_value, item.benchmark_value)} tone="bg-amber-300" />
      </div>
      <p className="mt-4 text-sm text-slate-300">
        Diferença: {item.difference_percent > 0 ? "+" : ""}{Math.round(item.difference_percent)}%
      </p>
    </article>
  )
}

function Bar({ label, value, max, tone }: { label: string; value: number; max: number; tone: string }) {
  const width = max ? Math.max(5, Math.round((value / max) * 100)) : 0

  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-slate-500">
        <span>{label}</span>
        <span>{Math.round(width)}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-950/70">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/30 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-white">{value}</p>
    </div>
  )
}

function formatValue(type: string, value: number) {
  if (type === "estimated_cost_mid") {
    return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value)
  }

  if (type === "estimated_months_mid") {
    return `${Math.round(value)} meses`
  }

  return `${Math.round(value)}/100`
}
