import type { Metadata } from "next"
import Link from "next/link"
import ConstructionShell from "@/components/construction/ConstructionShell"
import { EngineCardGrid, PrimaryConstructionCta } from "@/components/construction/ConstructionCards"
import { FileSearch, FileText, Gauge, Scale, UploadCloud } from "lucide-react"

export const metadata: Metadata = {
  title: "Construction Intelligence OS | IAWEB",
  description: "Transforme documentacao tecnica em decisoes inteligentes.",
}

export default function ConstructionPage() {
  const flow = [
    { title: "Upload", body: "Centraliza PDFs, CAD, IFC, folhas e documentos tecnicos.", icon: UploadCloud },
    { title: "Document Intelligence", body: "Classifica tipo, pais, especialidade e confianca.", icon: FileSearch },
    { title: "Health Check", body: "Calcula maturidade, risco, complexidade, custo e prazo.", icon: Gauge },
    { title: "Benchmark", body: "Compara o projeto com obras semelhantes por tipo, pais e area.", icon: Scale },
    { title: "PDF Executivo", body: "Entrega relatorio premium pronto para decisao.", icon: FileText },
  ]

  return (
    <ConstructionShell>
      <section className="flex flex-1 flex-col justify-center py-14 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-amber-200">IAWEB premium module</p>
            <h1 className="iaweb-hero-title mt-5 text-5xl font-black leading-[0.95] text-white md:text-7xl">
              Construction Intelligence OS
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-200">
              Transforme documentacao tecnica em decisoes inteligentes.
            </p>
            <div className="mt-6 grid max-w-3xl gap-3 sm:grid-cols-3">
              {["Demo comercial pronta", "Health Check executivo", "PDF premium em 1 clique"].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-slate-100">
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-8">
              <PrimaryConstructionCta />
            </div>
          </div>

          <div className="iaweb-premium-card rounded-2xl p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-200">Executive demo flow</p>
            <div className="mt-5 grid gap-3">
              {flow.map((step, index) => {
                const Icon = step.icon
                return (
                  <div key={step.title} className="grid grid-cols-[auto_1fr] gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-300/10 text-sky-200">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{index + 1}. {step.title}</p>
                      <p className="mt-1 text-sm leading-5 text-slate-400">{step.body}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            <Link href="/construction/dashboard" className="mt-5 inline-flex text-sm font-semibold text-sky-200 hover:text-sky-100">
              Abrir cockpit executivo
            </Link>
          </div>
        </div>

        <div className="mt-14">
          <EngineCardGrid />
        </div>
      </section>
    </ConstructionShell>
  )
}
