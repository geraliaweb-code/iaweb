"use client"

import { useEffect, useState } from "react"
import { Globe2, Lock, Loader2, Scale } from "lucide-react"
import { getConstructionRequestError, readConstructionApiJson } from "@/lib/construction/client-api"
import type { BenchmarkV2Result } from "@/lib/construction/benchmark-v2"

type BenchmarkPreviewPanelProps = {
  projectId: string
}

type BenchmarkPreviewResponse = {
  benchmark?: BenchmarkV2Result | null
  error?: string
}

const lockedBenchmarkItems = ["Portugal", "Franca", "Espanha", "Produtividade", "Mao de obra"]

export default function BenchmarkPreviewPanel({ projectId }: BenchmarkPreviewPanelProps) {
  const [benchmark, setBenchmark] = useState<BenchmarkV2Result | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadBenchmark() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/construction/projects/${projectId}/benchmark-v2`, { method: "POST" })
        const result = await readConstructionApiJson<BenchmarkPreviewResponse>(response)

        if (!active) return

        if (!response.ok || !result.benchmark) {
          setError(result.error ?? "Nao foi possivel carregar benchmark preview.")
          setBenchmark(null)
          return
        }

        setBenchmark(result.benchmark)
      } catch (error) {
        if (active) setError(getConstructionRequestError(error, "Falha de rede ao carregar benchmark preview."))
      } finally {
        if (active) setIsLoading(false)
      }
    }

    loadBenchmark()

    return () => {
      active = false
    }
  }, [projectId])

  return (
    <section className="rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(5,18,38,0.96),rgba(12,39,70,0.86))] p-5 text-white shadow-[0_20px_65px_rgba(2,8,23,0.35)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-100">
            <Scale className="h-4 w-4" aria-hidden="true" />
            Benchmark preview
          </p>
          <h2 className="mt-2 text-2xl font-semibold">Benchmark Europeu</h2>
        </div>
        {benchmark ? <span className="rounded-full border border-amber-200/25 bg-amber-200/10 px-4 py-2 text-xs font-bold text-amber-100">{benchmark.accessLevel}</span> : null}
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur">
        {isLoading ? (
          <p className="inline-flex items-center gap-2 text-sm text-slate-300">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            A carregar benchmark preview...
          </p>
        ) : error ? (
          <p className="text-sm text-red-100">{error}</p>
        ) : benchmark ? (
          <>
            <p className="text-lg font-semibold text-white">{benchmark.executiveInsights[0] ?? formatBenchmarkSentence(benchmark)}</p>
            {benchmark.isBlocked ? (
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {lockedBenchmarkItems.map((item) => (
                  <div key={item} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-200">
                    {item}
                    <Lock className="h-4 w-4 shrink-0 text-amber-200" aria-hidden="true" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {benchmark.comparedCountries.map((country) => (
                  <div key={country.country} className="rounded-xl border border-sky-200/20 bg-sky-200/10 p-4">
                    <Globe2 className="h-4 w-4 text-sky-100" aria-hidden="true" />
                    <p className="mt-3 font-semibold">{country.label}</p>
                    <p className="mt-1 text-xs text-slate-300">{country.costPerM2Range ? `${formatEuro(country.costPerM2Range.medium)}/m2` : "Bloqueado"}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : null}
      </div>
    </section>
  )
}

function formatBenchmarkSentence(benchmark: BenchmarkV2Result) {
  const delta = Math.round(((benchmark.projectCostPerM2 - benchmark.marketCostPerM2Range.medium) / benchmark.marketCostPerM2Range.medium) * 100)
  const direction = delta >= 0 ? "acima" : "abaixo"
  return `A sua obra encontra-se ${Math.abs(delta)}% ${direction} da media.`
}

function formatEuro(value: number) {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value)
}
