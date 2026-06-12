"use client"

import { useState } from "react"
import { Download, FileText, Lock, Loader2, Sparkles, TriangleAlert } from "lucide-react"
import { getConstructionRequestError, readConstructionApiJson } from "@/lib/construction/client-api"

type GenerateReportV2ButtonProps = {
  projectId: string
  compact?: boolean
}

type BlockedReportV2Response = {
  blocked?: boolean
  reason?: string
  cta?: string
  message?: string
  error?: string
}

export default function GenerateReportV2Button({ projectId, compact = false }: GenerateReportV2ButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [blocked, setBlocked] = useState<BlockedReportV2Response | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function generateReport() {
    setIsGenerating(true)
    setMessage(null)
    setBlocked(null)
    setError(null)

    try {
      const response = await fetch(`/api/construction/projects/${projectId}/report-v2`, {
        method: "POST",
      })

      const contentType = response.headers.get("Content-Type") ?? ""

      if (contentType.includes("application/json")) {
        const result = await readConstructionApiJson<BlockedReportV2Response>(response)
        setIsGenerating(false)

        if (result.blocked || result.reason === "full_pdf_locked") {
          setBlocked(result)
          return
        }

        setError(result.error ?? "Nao foi possivel gerar o PDF Executivo V2.")
        return
      }

      if (!response.ok) {
        setIsGenerating(false)
        setError("Nao foi possivel gerar o PDF Executivo V2.")
        return
      }

      const blob = await response.blob()
      const disposition = response.headers.get("Content-Disposition") ?? ""
      const filename = disposition.match(/filename="([^"]+)"/)?.[1] ?? "iaweb-construction-executive-v2.pdf"
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)

      setIsGenerating(false)
      setMessage("PDF Executivo Premium V2 gerado e descarregado.")
    } catch (error) {
      setIsGenerating(false)
      setError(getConstructionRequestError(error, "Falha de rede ao gerar o PDF Executivo V2."))
    }
  }

  return (
    <div className={compact ? "grid gap-3" : "grid gap-4"}>
      <button
        type="button"
        onClick={generateReport}
        disabled={isGenerating}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-200/30 bg-[linear-gradient(135deg,rgba(8,22,48,0.96),rgba(13,43,76,0.96)_52%,rgba(214,172,83,0.92))] px-5 py-3 text-sm font-bold text-amber-50 shadow-[0_18px_45px_rgba(3,10,24,0.35)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <FileText className="h-4 w-4" aria-hidden="true" />}
        Gerar PDF Premium V2
        {!isGenerating ? <Download className="h-4 w-4" aria-hidden="true" /> : null}
      </button>

      {message ? (
        <p className="inline-flex items-center gap-2 text-sm text-emerald-100">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          {message}
        </p>
      ) : null}

      {blocked ? (
        <div className="grid gap-3 rounded-2xl border border-amber-200/25 bg-slate-950/85 p-4 text-sm text-slate-100 shadow-[0_18px_45px_rgba(2,8,23,0.32)]">
          <p className="inline-flex items-start gap-2 font-semibold text-amber-100">
            <Lock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {blocked.cta ?? "Desbloquear Análise Completa"}
          </p>
          <p className="text-slate-300">{blocked.message ?? "O PDF Executivo completo esta disponivel apenas na analise completa."}</p>
          <a
            href="/construction/billing"
            className="justify-self-start rounded-full bg-amber-200 px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-amber-100"
          >
            Desbloquear Análise Completa
          </a>
        </div>
      ) : null}

      {error ? (
        <div className="grid gap-2 rounded-2xl border border-red-300/20 bg-red-300/10 p-3 text-sm text-red-100">
          <p className="inline-flex items-start gap-2">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {error}
          </p>
          <button type="button" onClick={generateReport} className="justify-self-start rounded-full border border-red-200/30 px-3 py-1 text-xs font-semibold text-red-50">
            Tentar novamente
          </button>
        </div>
      ) : null}
    </div>
  )
}
