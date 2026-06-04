import Link from "next/link"
import { Activity, FileSearch, Gauge, UploadCloud } from "lucide-react"

type ExecutiveNextActionsProps = {
  projectId: string
  hasAnalysis: boolean
  missingDocuments: string[]
  recommendations: string[]
}

export default function ExecutiveNextActions({ projectId, hasAnalysis, missingDocuments, recommendations }: ExecutiveNextActionsProps) {
  const actions = hasAnalysis
    ? [
        ...(missingDocuments.length ? [`Adicionar documentos em falta: ${missingDocuments.slice(0, 3).join(", ")}.`] : []),
        ...recommendations,
        "Validar cenarios com equipa tecnica antes de proposta comercial.",
      ]
    : [
        "Fazer upload dos documentos tecnicos disponiveis.",
        "Executar Document Intelligence para classificar documentos e especialidades.",
        "Gerar Health Check para calcular scores, riscos, custo e prazo.",
      ]

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Proximas acoes recomendadas</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-950">Sequencia executiva</h2>
        </div>
        <Activity className="h-5 w-5 text-slate-800" aria-hidden="true" />
      </div>

      <div className="mt-5 grid gap-3">
        {actions.slice(0, 5).map((action, index) => (
          <div key={`${action}-${index}`} className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white">{index + 1}</span>
            <p className="text-sm leading-6 text-slate-700">{action}</p>
          </div>
        ))}
      </div>

      {!hasAnalysis ? (
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href={`/construction/projects/${projectId}`} className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
            <UploadCloud className="h-4 w-4" aria-hidden="true" />
            Ir para Upload
          </Link>
          <Link href={`/construction/projects/${projectId}`} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800">
            <Gauge className="h-4 w-4" aria-hidden="true" />
            Gerar Health Check
          </Link>
          <span className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800">
            <FileSearch className="h-4 w-4" aria-hidden="true" />
            Analise pendente
          </span>
        </div>
      ) : null}
    </section>
  )
}
