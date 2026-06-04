"use client"

import { useState } from "react"
import { Download, FileText, Loader2, TriangleAlert } from "lucide-react"
import { getConstructionRequestError, readConstructionApiJson } from "@/lib/construction/client-api"

type GenerateReportButtonProps = {
  projectId: string
  compact?: boolean
}

export default function GenerateReportButton({ projectId, compact = false }: GenerateReportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function generateReport() {
    setIsGenerating(true)
    setMessage(null)
    setError(null)

    try {
      const response = await fetch(`/api/construction/projects/${projectId}/report`, {
        method: "POST",
      })

      if (!response.ok) {
        const result = await readConstructionApiJson<Record<string, never>>(response)
        setIsGenerating(false)
        setError(result.error ?? "Nao foi possivel gerar o relatorio executivo.")
        return
      }

      const blob = await response.blob()
      const disposition = response.headers.get("Content-Disposition") ?? ""
      const filename = disposition.match(/filename="([^"]+)"/)?.[1] ?? "iaweb-construction-executive-report.pdf"
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)

      setIsGenerating(false)
      setMessage("Relatorio executivo gerado e descarregado.")
    } catch (error) {
      setIsGenerating(false)
      setError(getConstructionRequestError(error, "Falha de rede ao gerar o relatorio executivo."))
    }
  }

  return (
    <div className={compact ? "grid gap-3" : "grid gap-4"}>
      <button
        type="button"
        onClick={generateReport}
        disabled={isGenerating}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-300 to-amber-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <FileText className="h-4 w-4" aria-hidden="true" />}
        Gerar Relatorio Executivo
        {!isGenerating ? <Download className="h-4 w-4" aria-hidden="true" /> : null}
      </button>

      {message ? <p className="text-sm text-emerald-100">{message}</p> : null}
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
