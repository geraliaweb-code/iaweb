"use client"

import { useCallback, useEffect, useState } from "react"
import { BrainCircuit, CheckCircle2, FileSearch, Loader2, TriangleAlert } from "lucide-react"
import { getConstructionRequestError, readConstructionApiJson } from "@/lib/construction/client-api"
import type { ConstructionDetectedDocument } from "@/lib/construction/types"

type DocumentAnalysisPanelProps = {
  projectId: string
}

type AnalysisState = {
  isAnalyzing: boolean
  error: string | null
  message: string | null
}

export default function DocumentAnalysisPanel({ projectId }: DocumentAnalysisPanelProps) {
  const [documents, setDocuments] = useState<ConstructionDetectedDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [state, setState] = useState<AnalysisState>({
    isAnalyzing: false,
    error: null,
    message: null,
  })

  const loadDocuments = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/construction/projects/${projectId}/analyze-documents`, { cache: "no-store" })
      const result = await readConstructionApiJson<{ documents?: ConstructionDetectedDocument[] }>(response)
      setDocuments(result.documents ?? [])

      if (!response.ok || result.error) {
        setState((current) => ({ ...current, error: result.error ?? "Nao foi possivel carregar a analise documental." }))
      }
    } catch (error) {
      setState((current) => ({
        ...current,
        error: getConstructionRequestError(error, "Falha de rede ao carregar a analise documental."),
      }))
    } finally {
      setIsLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    void loadDocuments()
  }, [loadDocuments])

  async function analyzeDocuments() {
    setState({
      isAnalyzing: true,
      error: null,
      message: "A classificar documentos por filename, extensao e metadata...",
    })

    try {
      const response = await fetch(`/api/construction/projects/${projectId}/analyze-documents`, {
        method: "POST",
      })
      const result = await readConstructionApiJson<{ documents?: ConstructionDetectedDocument[] }>(response)

      if (!response.ok) {
        setState({
          isAnalyzing: false,
          error: result.error ?? "Nao foi possivel analisar documentos.",
          message: null,
        })
        return
      }

      setDocuments(result.documents ?? [])
      setState({
        isAnalyzing: false,
        error: null,
        message: `${result.documents?.length ?? 0} documento${result.documents?.length === 1 ? "" : "s"} analisado${result.documents?.length === 1 ? "" : "s"}.`,
      })
      window.dispatchEvent(new CustomEvent("construction-files-updated"))
    } catch (error) {
      setState({
        isAnalyzing: false,
        error: getConstructionRequestError(error, "Falha de rede ao analisar documentos."),
        message: null,
      })
    }
  }

  return (
    <section className="iaweb-premium-card rounded-2xl p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200">Document Intelligence Engine V2</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Classificacao documental</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
            Camada opcional de IA sobre filename, extensao, MIME e metadata simples, com fallback automatico para regras locais.
          </p>
        </div>
        <button
          type="button"
          onClick={analyzeDocuments}
          disabled={state.isAnalyzing}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-300 to-amber-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {state.isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <BrainCircuit className="h-4 w-4" aria-hidden="true" />}
          Analisar Documentos
        </button>
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
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{state.error}</span>
          </div>
          <button type="button" onClick={loadDocuments} className="rounded-full border border-red-200/30 px-3 py-1 text-xs font-semibold text-red-50">
            Tentar novamente
          </button>
        </div>
      ) : null}

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 className="font-semibold text-white">Resultados detetados</h3>
          <span className="text-sm text-slate-400">{documents.length} resultado{documents.length === 1 ? "" : "s"}</span>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-slate-300">A carregar resultados...</div>
        ) : documents.length ? (
          <div className="grid gap-3">
            {documents.map((document) => (
              <DocumentRow key={document.id} document={document} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
            <FileSearch className="mx-auto h-7 w-7 text-sky-200" aria-hidden="true" />
            <p className="mt-3 font-semibold text-white">Ainda nao existem documentos classificados.</p>
            <p className="mt-2 text-sm text-slate-400">Envia ficheiros e executa a primeira classificacao documental V1.</p>
          </div>
        )}
      </div>
    </section>
  )
}

function DocumentRow({ document }: { document: ConstructionDetectedDocument }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate font-semibold text-white">{document.title ?? document.document_type}</p>
          <p className="mt-1 text-sm text-slate-400">
            {document.country ?? "unknown"} · {document.specialty ?? "unknown"}
          </p>
        </div>
        <div className="rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-xs font-semibold text-sky-100">
          {document.confidence_score}/100
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Info label="Tipo" value={document.document_type} />
        <Info label="Pais" value={document.country ?? "unknown"} />
        <Info label="Especialidade" value={document.specialty ?? "unknown"} />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Info label="IA" value={document.ai_analysis_status ?? "not_configured"} />
        <Info label="Entidades" value={summarizeEntities(document.detected_entities)} />
      </div>
      {document.ai_summary ? <p className="mt-4 rounded-xl border border-sky-300/20 bg-sky-300/10 p-3 text-sm leading-6 text-sky-50">{document.ai_summary}</p> : null}
      {document.notes ? <p className="mt-4 text-sm leading-6 text-slate-400">{document.notes}</p> : null}
    </article>
  )
}

function summarizeEntities(entities: Record<string, unknown>) {
  const elements = Array.isArray(entities.construction_elements) ? entities.construction_elements : []
  const risks = Array.isArray(entities.documentary_risks) ? entities.documentary_risks : []
  const total = elements.length + risks.length

  if (!total) return "Sem entidades"
  return `${elements.length} elementos, ${risks.length} riscos`
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-200">{value}</p>
    </div>
  )
}
