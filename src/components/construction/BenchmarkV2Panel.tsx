"use client"

import { useState } from "react"
import { ArrowRight, BarChart3, Globe2, Lock, Loader2, ShieldAlert, Sparkles, Timer, TriangleAlert } from "lucide-react"
import { getConstructionRequestError, readConstructionApiJson } from "@/lib/construction/client-api"
import type { BenchmarkV2Result } from "@/lib/construction/benchmark-v2"

type BenchmarkV2PanelProps = {
  projectId: string
}

type BenchmarkV2ApiResponse = {
  benchmark?: BenchmarkV2Result | null
  warnings?: string[]
  error?: string
}

export default function BenchmarkV2Panel({ projectId }: BenchmarkV2PanelProps) {
  const [benchmark, setBenchmark] = useState<BenchmarkV2Result | null>(null)
  const [warnings, setWarnings] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function generateBenchmark() {
    setIsLoading(true)
    setError(null)
    setWarnings([])

    try {
      const response = await fetch(`/api/construction/projects/${projectId}/benchmark-v2`, { method: "POST" })
      const result = await readConstructionApiJson<BenchmarkV2ApiResponse>(response)

      setWarnings(result.warnings ?? [])

      if (!response.ok || !result.benchmark) {
        setBenchmark(null)
        setError(result.error ?? "Nao foi possivel gerar Benchmark Europeu V2.")
        return
      }

      setBenchmark(result.benchmark)
    } catch (error) {
      setError(getConstructionRequestError(error, "Falha de rede ao gerar Benchmark Europeu V2."))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-amber-200/20 bg-slate-950 text-white shadow-[0_24px_80px_rgba(2,8,23,0.45)]">
      <div className="border-b border-white/10 bg-[linear-gradient(135deg,#061427,#0b2b4a_54%,#9a741d)] p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-100">
              <Globe2 className="h-4 w-4" aria-hidden="true" />
              Benchmark Europeu Real V2
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-4xl">Projeto vs mercado europeu</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200">
              Comparacao isolada com Cost Database V2, Cost Engine V2 e Unlock Engine.
            </p>
          </div>

          <button
            type="button"
            onClick={generateBenchmark}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-200 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Sparkles className="h-4 w-4" aria-hidden="true" />}
            Gerar Benchmark V2
          </button>
        </div>
      </div>

      <div className="p-6 md:p-8">
        {error ? (
          <div className="rounded-xl border border-red-300/25 bg-red-300/10 p-4 text-sm text-red-100">
            <p className="inline-flex items-start gap-2">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {error}
            </p>
          </div>
        ) : null}

        {warnings.length ? (
          <div className="mb-5 rounded-xl border border-amber-200/20 bg-amber-200/10 p-4 text-sm text-amber-50">
            {warnings.slice(0, 2).map((warning) => (
              <p key={warning}>{warning}</p>
            ))}
          </div>
        ) : null}

        {!benchmark ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-sm text-slate-300">
            Prima para gerar a comparacao europeia V2 deste projeto.
          </div>
        ) : (
          <div className="grid gap-6">
            <div className="grid gap-4 lg:grid-cols-3">
              <MetricCard label="Custo projeto" value={formatEuro(benchmark.projectCostPerM2)} detail="por m2" icon={BarChart3} />
              <MetricCard
                label="Mercado europeu"
                value={`${formatEuro(benchmark.marketCostPerM2Range.low)} - ${formatEuro(benchmark.marketCostPerM2Range.high)}`}
                detail={`media ${formatEuro(benchmark.marketCostPerM2Range.medium)}`}
                icon={Globe2}
              />
              <MetricCard label="Posicao" value={formatPosition(benchmark.costPosition)} detail={`${benchmark.confidenceScore}% confianca`} icon={ShieldAlert} />
            </div>

            <div className="grid gap-4 lg:grid-cols-[1fr_0.86fr]">
              <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <h3 className="text-lg font-semibold">Insights comerciais</h3>
                <div className="mt-4 grid gap-3">
                  {benchmark.executiveInsights.map((insight) => (
                    <p key={insight} className="rounded-xl border border-amber-200/15 bg-amber-200/10 p-4 text-sm leading-6 text-amber-50">
                      {insight}
                    </p>
                  ))}
                </div>
              </article>

              <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <h3 className="text-lg font-semibold">Paises</h3>
                <div className="mt-4 grid gap-3">
                  {benchmark.comparedCountries.map((country) => (
                    <div key={country.country} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-950/55 px-4 py-3">
                      <div>
                        <p className="font-semibold">{country.label}</p>
                        <p className="text-xs text-slate-400">
                          {country.costPerM2Range ? `${formatEuro(country.costPerM2Range.low)} - ${formatEuro(country.costPerM2Range.high)}/m2` : "Bloqueado"}
                        </p>
                      </div>
                      {country.isLocked ? <Lock className="h-4 w-4 text-amber-200" aria-hidden="true" /> : <Globe2 className="h-4 w-4 text-sky-200" aria-hidden="true" />}
                    </div>
                  ))}
                </div>
              </article>
            </div>

            {benchmark.isBlocked ? <LockedBenchmarkSections benchmark={benchmark} /> : <FullBenchmarkSections benchmark={benchmark} />}
          </div>
        )}
      </div>
    </section>
  )
}

function FullBenchmarkSections({ benchmark }: { benchmark: BenchmarkV2Result }) {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 xl:col-span-2">
        <h3 className="text-lg font-semibold">Especialidades</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {benchmark.specialtyComparisons.map((item) => (
            <div key={item.specialty} className="rounded-xl border border-white/10 bg-slate-950/55 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-100">{item.specialty}</p>
              <p className="mt-2 text-lg font-semibold">{formatEuro(item.projectCostPerM2)}/m2</p>
              <p className="mt-1 text-xs text-slate-400">Mercado {formatEuro(item.marketCostPerM2)}/m2 - {item.differencePercent}%</p>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
        <h3 className="text-lg font-semibold">Produtividade e prazo</h3>
        <div className="mt-4 grid gap-3">
          {benchmark.productivityComparisons.slice(0, 4).map((item) => (
            <div key={item.specialty} className="rounded-xl border border-white/10 bg-slate-950/55 p-4">
              <p className="font-semibold">{item.specialty}</p>
              <p className="mt-1 text-xs text-slate-400">
                Projeto {item.projectProductivityPerDay ?? "-"} / Mercado {item.marketProductivityPerDay} por dia
              </p>
            </div>
          ))}
          {benchmark.scheduleComparison ? (
            <div className="rounded-xl border border-sky-200/20 bg-sky-200/10 p-4 text-sm text-sky-50">
              <Timer className="mb-2 h-4 w-4" aria-hidden="true" />
              Prazo indicativo: {benchmark.scheduleComparison.projectIndicativeMonths} meses vs {benchmark.scheduleComparison.marketIndicativeMonths} meses no mercado.
            </div>
          ) : null}
        </div>
      </article>
    </div>
  )
}

function LockedBenchmarkSections({ benchmark }: { benchmark: BenchmarkV2Result }) {
  return (
    <article className="rounded-2xl border border-amber-200/25 bg-[linear-gradient(135deg,rgba(251,191,36,0.12),rgba(15,23,42,0.78))] p-5">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-bold text-amber-100">
            <Lock className="h-4 w-4" aria-hidden="true" />
            Benchmark completo bloqueado
          </p>
          <h3 className="mt-3 text-2xl font-semibold">{benchmark.upgradeCTA}</h3>
        </div>
        <a href="/construction/billing" className="inline-flex items-center gap-2 rounded-full bg-amber-200 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-100">
          Desbloquear
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {benchmark.lockedSections.map((section) => (
          <div key={section} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-200">
            {section}
            <Lock className="h-4 w-4 shrink-0 text-amber-200" aria-hidden="true" />
          </div>
        ))}
      </div>
    </article>
  )
}

function MetricCard({ label, value, detail, icon: Icon }: { label: string; value: string; detail: string; icon: typeof BarChart3 }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <Icon className="h-5 w-5 text-amber-100" aria-hidden="true" />
      <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-sm text-slate-400">{detail}</p>
    </article>
  )
}

function formatEuro(value: number) {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value)
}

function formatPosition(position: BenchmarkV2Result["costPosition"]) {
  if (position === "acima_da_media") return "Acima da media"
  if (position === "abaixo_da_media") return "Abaixo da media"
  return "Dentro da media"
}
