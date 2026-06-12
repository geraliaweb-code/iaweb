"use client"

import { useEffect, useState } from "react"
import { BrainCircuit, Loader2, TriangleAlert } from "lucide-react"
import { getConstructionRequestError, readConstructionApiJson } from "@/lib/construction/client-api"
import type { ConstructionCostBreakdownLine } from "@/lib/construction/cost-engine-v2"
import BudgetPreviewPanel from "./BudgetPreviewPanel"
import LockedSpecialtiesPanel from "./LockedSpecialtiesPanel"

type ConstructionCostIntelligencePanelProps = {
  projectId: string
}

type CostPreviewResponse = {
  preview?: {
    visibleSpecialties: ConstructionCostBreakdownLine[]
    lockedSpecialties: ConstructionCostBreakdownLine[]
    visibleCost: number
    estimatedRange: {
      min: number
      max: number
    }
    accessLevel: "free_preview" | "partial_unlocked" | "full_unlocked"
    unlockedPercentage: number
  } | null
  error?: string
}

export default function ConstructionCostIntelligencePanel({ projectId }: ConstructionCostIntelligencePanelProps) {
  const [preview, setPreview] = useState<CostPreviewResponse["preview"]>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadPreview() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/construction/projects/${projectId}/cost-preview`, { cache: "no-store" })
        const result = await readConstructionApiJson<CostPreviewResponse>(response)

        if (!active) return

        if (!response.ok || !result.preview) {
          setError(result.error ?? "Nao foi possivel carregar o orcamento inteligente.")
          setPreview(null)
          return
        }

        setPreview(result.preview)
      } catch (error) {
        if (active) setError(getConstructionRequestError(error, "Falha de rede ao carregar o orcamento inteligente."))
      } finally {
        if (active) setIsLoading(false)
      }
    }

    loadPreview()

    return () => {
      active = false
    }
  }, [projectId])

  return (
    <section className="rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(3,10,24,0.98),rgba(8,33,61,0.9)_58%,rgba(126,92,20,0.44))] p-5 text-white shadow-[0_24px_80px_rgba(2,8,23,0.45)] md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-100">
            <BrainCircuit className="h-4 w-4" aria-hidden="true" />
            Cost Engine V2
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">Orcamento Inteligente da Obra</h2>
          <p className="mt-3 text-sm leading-6 text-slate-200">
            A IA identificou materiais, especialidades e custos estimados com base na documentacao enviada.
          </p>
        </div>
        {preview ? (
          <span className="rounded-full border border-amber-200/25 bg-amber-200/10 px-4 py-2 text-xs font-bold text-amber-100">
            {preview.unlockedPercentage}% visivel
          </span>
        ) : null}
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-sm text-slate-300">
            <p className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              A preparar cost preview...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-300/20 bg-red-300/10 p-5 text-sm text-red-100">
            <p className="inline-flex items-start gap-2">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {error}
            </p>
          </div>
        ) : preview ? (
          <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
            <BudgetPreviewPanel visibleSpecialties={preview.visibleSpecialties} visibleCost={preview.visibleCost} estimatedRange={preview.estimatedRange} />
            <LockedSpecialtiesPanel lockedSpecialties={preview.lockedSpecialties} />
          </div>
        ) : null}
      </div>
    </section>
  )
}
