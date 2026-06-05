"use client"

import { AlertTriangle, Boxes, Building2, FileText, Globe2, Layers3 } from "lucide-react"
import { constructionElements } from "@/lib/construction/dataset/construction-elements"
import { constructionDocumentTaxonomy } from "@/lib/construction/dataset/document-taxonomy"
import { constructionRiskMatrix } from "@/lib/construction/dataset/risk-matrix"

const uniqueSpecialties = new Set(constructionDocumentTaxonomy.map((item) => item.specialty))

const metrics = [
  { label: "Projetos Analisados", value: "12", source: "Fallback demo", icon: Building2 },
  { label: "Documentos Catalogados", value: String(constructionDocumentTaxonomy.length), source: "Dataset local", icon: FileText },
  { label: "Especialidades Identificadas", value: String(uniqueSpecialties.size), source: "Dataset local", icon: Layers3 },
  { label: "Riscos Catalogados", value: String(constructionRiskMatrix.length), source: "Dataset local", icon: AlertTriangle },
  { label: "Elementos Construtivos", value: String(constructionElements.length), source: "Dataset local", icon: Boxes },
  { label: "Países Ativos", value: "3", source: "PT / FR / ES", icon: Globe2 },
]

export default function KnowledgeVaultMetrics() {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
      {metrics.map((metric) => {
        const Icon = metric.icon
        return (
          <article key={metric.label} className="construction-glass-card rounded-xl p-4">
            <div className="flex items-center justify-between gap-3">
              <Icon className="h-5 w-5 text-amber-300" aria-hidden="true" />
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-slate-300">
                {metric.source}
              </span>
            </div>
            <p className="mt-5 text-3xl font-semibold text-white">{metric.value}</p>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{metric.label}</p>
          </article>
        )
      })}
    </section>
  )
}
