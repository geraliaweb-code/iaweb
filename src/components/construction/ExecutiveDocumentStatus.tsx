import { FileCheck2, FileWarning } from "lucide-react"

type ExecutiveDocumentStatusProps = {
  hasAnalysis: boolean
  documentsFound: number
  missingDocuments: string[]
  specialties: string[]
}

export default function ExecutiveDocumentStatus({ hasAnalysis, documentsFound, missingDocuments, specialties }: ExecutiveDocumentStatusProps) {
  const complete = hasAnalysis && missingDocuments.length === 0
  const status = !hasAnalysis ? "Por analisar" : complete ? "Documentacao sem faltas criticas" : "Documentacao incompleta"

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Estado da documentacao</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-950">{status}</h2>
        </div>
        {complete ? <FileCheck2 className="h-5 w-5 text-emerald-700" aria-hidden="true" /> : <FileWarning className="h-5 w-5 text-amber-700" aria-hidden="true" />}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Metric label="Documentos encontrados" value={hasAnalysis ? String(documentsFound) : "0"} />
        <Metric label="Documentos em falta" value={hasAnalysis ? String(missingDocuments.length) : "Pendente"} />
        <Metric label="Especialidades encontradas" value={hasAnalysis ? String(specialties.length) : "Pendente"} />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <List title="Documentos em falta" empty={hasAnalysis ? "Sem faltas criticas." : "Gerar Health Check para identificar faltas."} items={missingDocuments} />
        <List title="Especialidades encontradas" empty={hasAnalysis ? "Nenhuma especialidade identificada." : "Executar Document Intelligence para classificar especialidades."} items={specialties} />
      </div>
    </section>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-slate-950">{value}</p>
    </div>
  )
}

function List({ title, empty, items }: { title: string; empty: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{title}</p>
      {items.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {items.slice(0, 8).map((item) => (
            <span key={item} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm leading-5 text-slate-600">{empty}</p>
      )}
    </div>
  )
}
