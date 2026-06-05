"use client"

import { Boxes } from "lucide-react"
import { constructionElements } from "@/lib/construction/dataset/construction-elements"
import { constructionGraphSeedNodes } from "@/lib/construction/knowledge-graph/graph-nodes"

const requestedElements = ["Fundação", "Sapata", "Pilar", "Viga", "Laje", "Cobertura", "ETICS", "AVAC", "ITED", "SCIE", "Caixilharia", "Piscina"]

function resolveElementSource(label: string) {
  const value = label.toLowerCase()
  const datasetMatch = constructionElements.find((element) => {
    const haystack = [element.label, element.family, ...element.keywords].join(" ").toLowerCase()
    return haystack.includes(value) || value.includes(element.family.toLowerCase())
  })

  if (datasetMatch) {
    return { source: "Dataset local", family: datasetMatch.family, unit: datasetMatch.unit }
  }

  const graphMatch = constructionGraphSeedNodes.find((node) => node.type === "element" && node.label.toLowerCase() === value)
  if (graphMatch) {
    return { source: "Knowledge graph", family: "element", unit: "relacional" }
  }

  return { source: "Fallback demo", family: "referência visual", unit: "demo" }
}

export default function KnowledgeVaultConstructionElements() {
  return (
    <section className="py-12">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-400">Elementos Construtivos</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">Vocabulário técnico pesquisável.</h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-slate-300">Elementos combinados a partir do dataset local, knowledge graph e fallback demonstrativo identificado.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        {requestedElements.map((label) => {
          const item = resolveElementSource(label)
          return (
            <article key={label} className="rounded-xl border border-white/10 bg-white/[0.04] p-4 shadow-lg shadow-black/10 backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <Boxes className="h-5 w-5 text-amber-300" aria-hidden="true" />
                <span className="rounded-full border border-white/10 px-2 py-1 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-slate-400">{item.source}</span>
              </div>
              <h3 className="mt-4 text-base font-semibold text-white">{label}</h3>
              <p className="mt-2 text-xs capitalize text-slate-400">{item.family}</p>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-amber-300 to-sky-300" style={{ width: item.source === "Fallback demo" ? "42%" : "78%" }} />
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
