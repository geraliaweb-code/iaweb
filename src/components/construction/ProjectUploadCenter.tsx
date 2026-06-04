"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { AlertTriangle, CheckCircle2, FileArchive, FileText, Loader2, UploadCloud, XCircle } from "lucide-react"
import type { ConstructionFileRecord, ConstructionFileStatus } from "@/lib/construction/types"
import { getConstructionRequestError, readConstructionApiJson } from "@/lib/construction/client-api"
import {
  constructionAcceptAttribute,
  formatConstructionFileSize,
  validateConstructionFile,
} from "@/lib/construction/file-rules"

type ProjectUploadCenterProps = {
  projectId: string
}

type UploadState = {
  isUploading: boolean
  progress: number
  message: string | null
  error: string | null
}

const statusLabels: Record<ConstructionFileStatus, string> = {
  uploaded: "uploaded",
  processing: "processing",
  analyzed: "analyzed",
  failed: "failed",
}

const statusClasses: Record<ConstructionFileStatus, string> = {
  uploaded: "border-sky-300/20 bg-sky-300/10 text-sky-100",
  processing: "border-amber-300/20 bg-amber-300/10 text-amber-100",
  analyzed: "border-emerald-300/20 bg-emerald-300/10 text-emerald-100",
  failed: "border-red-300/20 bg-red-300/10 text-red-100",
}

export default function ProjectUploadCenter({ projectId }: ProjectUploadCenterProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [files, setFiles] = useState<ConstructionFileRecord[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [upload, setUpload] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    message: null,
    error: null,
  })

  const loadFiles = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/construction/projects/${projectId}/files`, { cache: "no-store" })
      const result = await readConstructionApiJson<{ files?: ConstructionFileRecord[] }>(response)
      setFiles(result.files ?? [])

      if (!response.ok || result.error) {
        setUpload((current) => ({ ...current, error: result.error ?? "Nao foi possivel carregar os ficheiros." }))
      }
    } catch (error) {
      setUpload((current) => ({
        ...current,
        error: getConstructionRequestError(error, "Falha de rede ao carregar ficheiros."),
      }))
    } finally {
      setIsLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    void loadFiles()
    window.addEventListener("construction-files-updated", loadFiles)

    return () => window.removeEventListener("construction-files-updated", loadFiles)
  }, [loadFiles])

  function uploadFiles(selectedFiles: FileList | File[]) {
    const candidates = Array.from(selectedFiles)

    if (!candidates.length) return

    for (const file of candidates) {
      const validation = validateConstructionFile(file)

      if (!validation.ok) {
        setUpload({
          isUploading: false,
          progress: 0,
          message: null,
          error: validation.error.message,
        })
        return
      }
    }

    const formData = new FormData()
    candidates.forEach((file) => formData.append("files", file))

    const request = new XMLHttpRequest()
    request.open("POST", `/api/construction/projects/${projectId}/files`)

    request.upload.onprogress = (event) => {
      if (!event.lengthComputable) return
      setUpload((current) => ({
        ...current,
        isUploading: true,
        progress: Math.round((event.loaded / event.total) * 100),
        message: `A enviar ${candidates.length} ficheiro${candidates.length > 1 ? "s" : ""}...`,
        error: null,
      }))
    }

    request.onload = () => {
      let result: { files?: ConstructionFileRecord[]; error?: string } = {}

      try {
        result = JSON.parse(request.responseText || "{}") as { files?: ConstructionFileRecord[]; error?: string }
      } catch {
        result = { error: "Resposta invalida do servidor durante o upload." }
      }

      if (request.status >= 200 && request.status < 300) {
        setFiles((current) => (result.files ? [...result.files, ...current] : current))
        setUpload({
          isUploading: false,
          progress: 100,
          message: "Upload concluido.",
          error: null,
        })
        void loadFiles()
        return
      }

      setUpload({
        isUploading: false,
        progress: 0,
        message: null,
        error: result.error ?? "Nao foi possivel enviar os ficheiros.",
      })
    }

    request.onerror = () => {
      setUpload({
        isUploading: false,
        progress: 0,
        message: null,
        error: "Falha de rede durante o upload.",
      })
    }

    setUpload({
      isUploading: true,
      progress: 0,
      message: "A preparar upload...",
      error: null,
    })
    request.send(formData)
  }

  return (
    <section className="iaweb-premium-card rounded-2xl p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200">Upload Center</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Ficheiros tecnicos do projeto</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
            PDF, ZIP, DWG, DXF, DWF, DWFX, IFC, XLS, XLSX, DOCX, JPG, PNG e WEBP ate 100 MB por ficheiro.
          </p>
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={upload.isUploading}
          className="inline-flex items-center gap-2 rounded-full bg-sky-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {upload.isUploading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <UploadCloud className="h-4 w-4" aria-hidden="true" />}
          Selecionar ficheiros
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={constructionAcceptAttribute}
        className="hidden"
        onChange={(event) => {
          if (event.target.files) uploadFiles(event.target.files)
          event.target.value = ""
        }}
      />

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") inputRef.current?.click()
        }}
        onDragEnter={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragOver={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={(event) => {
          event.preventDefault()
          setIsDragging(false)
        }}
        onDrop={(event) => {
          event.preventDefault()
          setIsDragging(false)
          uploadFiles(event.dataTransfer.files)
        }}
        className={`mt-6 flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center transition ${
          isDragging ? "border-sky-300 bg-sky-300/10" : "border-white/15 bg-white/[0.03] hover:border-sky-300/50"
        }`}
      >
        <UploadCloud className="h-10 w-10 text-sky-200" aria-hidden="true" />
        <p className="mt-4 text-lg font-semibold text-white">Arrasta ficheiros para aqui</p>
        <p className="mt-2 text-sm text-slate-400">ou clica para selecionar multiplos documentos tecnicos.</p>
      </div>

      {upload.isUploading || upload.message ? (
        <div className="mt-5 rounded-2xl border border-sky-300/20 bg-sky-300/10 p-4">
          <div className="flex items-center justify-between gap-4 text-sm text-sky-100">
            <span>{upload.message}</span>
            <span className="font-semibold">{upload.progress}%</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-950/70">
            <div className="h-full rounded-full bg-sky-300 transition-all" style={{ width: `${upload.progress}%` }} />
          </div>
        </div>
      ) : null}

      {upload.error ? (
        <div className="mt-5 flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-red-300/20 bg-red-300/10 p-4 text-sm text-red-100">
          <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{upload.error}</span>
          </div>
          <button type="button" onClick={loadFiles} className="rounded-full border border-red-200/30 px-3 py-1 text-xs font-semibold text-red-50">
            Tentar novamente
          </button>
        </div>
      ) : null}

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 className="font-semibold text-white">Ficheiros enviados</h3>
          <span className="text-sm text-slate-400">{files.length} ficheiro{files.length === 1 ? "" : "s"}</span>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-slate-300">A carregar ficheiros...</div>
        ) : files.length ? (
          <div className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
            {files.map((file) => (
              <FileRow key={file.id} file={file} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
            <p className="font-semibold text-white">Sem ficheiros enviados.</p>
            <p className="mt-2 text-sm text-slate-400">Este projeto ainda nao tem documentacao tecnica no bucket construction-files.</p>
          </div>
        )}
      </div>
    </section>
  )
}

function FileRow({ file }: { file: ConstructionFileRecord }) {
  const extension = file.original_filename.split(".").pop()?.toUpperCase() ?? "FILE"
  const status = file.processing_status
  const Icon = extension === "ZIP" ? FileArchive : FileText

  return (
    <div className="grid gap-4 p-4 md:grid-cols-[auto_1fr_auto] md:items-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-sky-300/20 bg-sky-300/10 text-sky-200">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="truncate font-medium text-white">{file.original_filename}</p>
        <p className="mt-1 text-sm text-slate-400">
          {extension} · {formatConstructionFileSize(file.size_bytes)} · {new Date(file.created_at).toLocaleDateString("pt-PT")}
        </p>
      </div>
      <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${statusClasses[status] ?? statusClasses.uploaded}`}>
        {status === "failed" ? <XCircle className="h-3.5 w-3.5" aria-hidden="true" /> : <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />}
        {statusLabels[status] ?? status}
      </div>
    </div>
  )
}
