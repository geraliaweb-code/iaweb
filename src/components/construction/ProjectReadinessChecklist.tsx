import { CheckCircle2, Circle, FileSearch, FileText, Gauge, Scale, UploadCloud } from "lucide-react"
import type { ConstructionProject } from "@/lib/construction/types"

type ProjectReadinessChecklistProps = {
  project: ConstructionProject
  demoMode?: boolean
}

type ReadinessStatus = "incompleto" | "em analise" | "pronto para relatorio"

function getStatus(project: ConstructionProject, demoMode: boolean): ReadinessStatus {
  if (demoMode) return "pronto para relatorio"
  if (project.maturity_score || project.risk_score || project.confidence_score) return "pronto para relatorio"
  if (project.analyses_count > 0) return "em analise"
  return "incompleto"
}

export default function ProjectReadinessChecklist({ project, demoMode = false }: ProjectReadinessChecklistProps) {
  const status = getStatus(project, demoMode)
  const hasDocuments = demoMode || project.analyses_count > 0
  const hasHealthCheck = demoMode || Boolean(project.maturity_score || project.risk_score || project.confidence_score)
  const checks = [
    { label: "Ficheiros tecnicos carregados", done: hasDocuments, icon: UploadCloud },
    { label: "Document Intelligence executado", done: hasDocuments, icon: FileSearch },
    { label: "Health Check gerado", done: hasHealthCheck, icon: Gauge },
    { label: "Benchmark comparativo disponivel", done: demoMode, icon: Scale },
    { label: "PDF executivo pronto", done: demoMode, icon: FileText },
  ]

  const statusClass =
    status === "pronto para relatorio"
      ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100"
      : status === "em analise"
        ? "border-amber-300/20 bg-amber-300/10 text-amber-100"
        : "border-slate-300/15 bg-white/[0.04] text-slate-300"

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-white">Checklist de prontidao</p>
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClass}`}>{status}</span>
      </div>
      <div className="mt-4 grid gap-2">
        {checks.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/25 p-3">
              {item.done ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-200" aria-hidden="true" />
              ) : (
                <Circle className="h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
              )}
              <Icon className={item.done ? "h-4 w-4 shrink-0 text-sky-200" : "h-4 w-4 shrink-0 text-slate-500"} aria-hidden="true" />
              <span className={item.done ? "text-sm text-white" : "text-sm text-slate-400"}>{item.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
