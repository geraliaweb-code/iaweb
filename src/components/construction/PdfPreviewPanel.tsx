"use client"

import { useEffect, useState } from "react"
import { Check, FileText, Lock, Loader2 } from "lucide-react"
import { readConstructionApiJson } from "@/lib/construction/client-api"

type PdfPreviewPanelProps = {
  projectId: string
}

type UnlockStatusResponse = {
  status?: {
    accessLevel: "free_preview" | "partial_unlocked" | "full_unlocked"
    canDownloadPdf: boolean
  } | null
}

const pdfItems = ["Custos", "Benchmark", "Fornecedores", "Produtividade", "Recomendacoes"]

export default function PdfPreviewPanel({ projectId }: PdfPreviewPanelProps) {
  const [canDownloadPdf, setCanDownloadPdf] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadStatus() {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/construction/projects/${projectId}/unlock-status?source=pdf-preview`, { cache: "no-store" })
        const result = await readConstructionApiJson<UnlockStatusResponse>(response)
        if (active) setCanDownloadPdf(Boolean(result.status?.canDownloadPdf))
      } finally {
        if (active) setIsLoading(false)
      }
    }

    loadStatus()

    return () => {
      active = false
    }
  }, [projectId])

  return (
    <section className="rounded-2xl border border-white/10 bg-slate-950/92 p-5 text-white shadow-[0_20px_65px_rgba(2,8,23,0.36)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-100">
            <FileText className="h-4 w-4" aria-hidden="true" />
            PDF preview
          </p>
          <h2 className="mt-2 text-2xl font-semibold">PDF Executivo Premium</h2>
        </div>
        {!canDownloadPdf ? (
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-200/25 bg-amber-200/10 px-4 py-2 text-xs font-bold text-amber-100">
            {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <Lock className="h-3.5 w-3.5" aria-hidden="true" />}
            Disponivel na Analise Completa
          </span>
        ) : null}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-5">
        {pdfItems.map((item) => (
          <div key={item} className="rounded-xl border border-white/10 bg-white/[0.045] p-4 backdrop-blur">
            <Check className="h-4 w-4 text-emerald-200" aria-hidden="true" />
            <p className="mt-3 text-sm font-semibold text-white">{item}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
