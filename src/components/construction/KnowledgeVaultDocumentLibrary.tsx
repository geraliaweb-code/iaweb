import { BookOpenCheck } from "lucide-react"
import { constructionDocumentTaxonomy } from "@/lib/construction/dataset/document-taxonomy"

const countries = [
  { key: "Portugal", label: "Portugal" },
  { key: "Franca", label: "França" },
  { key: "Espanha", label: "Espanha" },
]

export default function KnowledgeVaultDocumentLibrary() {
  return (
    <section className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-400">Document Library</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">Documentos mais comuns por país.</h2>
        <p className="mt-4 text-sm leading-6 text-slate-300">
          Lista baseada na taxonomia documental local já existente no módulo Construction. Serve para demonstração estratégica e exploração do conhecimento acumulado.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {countries.map((country) => {
          const documents = constructionDocumentTaxonomy.filter((item) => item.country === country.key)
          return (
            <article key={country.key} className="construction-glass-card rounded-xl p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-white">{country.label}</h3>
                <BookOpenCheck className="h-5 w-5 text-amber-300" aria-hidden="true" />
              </div>
              <div className="mt-4 grid gap-2">
                {documents.map((document) => (
                  <div key={`${country.key}-${document.documentType}`} className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
                    <p className="text-sm font-semibold text-slate-100">{document.documentType}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">{document.criticality}</p>
                  </div>
                ))}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
