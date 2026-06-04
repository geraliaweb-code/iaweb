import Link from "next/link"
import { BarChart3, BrainCircuit, CalendarClock, CheckCircle2, Euro, FileText, Gauge, UploadCloud } from "lucide-react"
import { constructionDemoDocuments, constructionDemoHealthCheck } from "@/lib/construction/demo-data"

export function DemoUploadAnalysisPanel() {
  return (
    <div className="grid gap-6">
      <section className="iaweb-premium-card rounded-2xl p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200">Demo Upload Center</p>
        <h2 className="mt-2 text-xl font-semibold text-white">Documentos tecnicos carregados</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Caso demo com arquitetura, estruturas, medicoes, AVAC, eletricidade, SCIE e caderno de encargos preliminar.
        </p>
        <div className="mt-5 grid gap-3">
          {constructionDemoDocuments.map((document) => (
            <div key={document.id} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center gap-3">
                <UploadCloud className="h-5 w-5 text-sky-200" aria-hidden="true" />
                <div>
                  <p className="font-medium text-white">{document.title}</p>
                  <p className="text-sm text-slate-400">uploaded · analyzed</p>
                </div>
              </div>
              <CheckCircle2 className="h-5 w-5 text-emerald-200" aria-hidden="true" />
            </div>
          ))}
        </div>
      </section>

      <section className="iaweb-premium-card rounded-2xl p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200">Document Intelligence Engine V1</p>
        <h2 className="mt-2 text-xl font-semibold text-white">Classificacao concluida</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {constructionDemoDocuments.map((document) => (
            <article key={document.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="font-semibold text-white">{document.document_type}</p>
              <p className="mt-1 text-sm text-slate-400">{document.specialty}</p>
              <p className="mt-3 text-sm text-sky-100">{document.confidence_score}/100 confianca</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export function DemoHealthCheckPanel() {
  const metrics = [
    { label: "Maturidade", value: constructionDemoHealthCheck.maturityScore, icon: Gauge },
    { label: "Risco", value: constructionDemoHealthCheck.riskScore, icon: BarChart3 },
    { label: "Complexidade", value: constructionDemoHealthCheck.complexityScore, icon: BrainCircuit },
    { label: "Confianca", value: constructionDemoHealthCheck.confidenceScore, icon: CheckCircle2 },
  ]

  return (
    <section className="iaweb-premium-card rounded-2xl p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200">Demo Health Check</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Resultado executivo pronto para venda consultiva</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
            Scores, documentos criticos, custo e prazo preliminar preparados para conversa comercial.
          </p>
        </div>
        <Link href="/construction/projects/new" className="rounded-full bg-sky-400 px-5 py-3 text-sm font-bold text-slate-950">
          Criar projeto real
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <article key={metric.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <Icon className="h-5 w-5 text-sky-200" aria-hidden="true" />
              <p className="mt-4 text-sm text-slate-300">{metric.label}</p>
              <p className="mt-2 text-4xl font-semibold text-white">{metric.value}<span className="text-lg text-slate-400">/100</span></p>
            </article>
          )
        })}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <Euro className="h-5 w-5 text-amber-100" aria-hidden="true" />
          <p className="mt-3 text-sm text-slate-300">Custo preliminar</p>
          <p className="mt-2 text-2xl font-semibold text-white">9.7M EUR - 20.5M EUR</p>
        </article>
        <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <CalendarClock className="h-5 w-5 text-sky-100" aria-hidden="true" />
          <p className="mt-3 text-sm text-slate-300">Prazo preliminar</p>
          <p className="mt-2 text-2xl font-semibold text-white">18 - 34 meses</p>
        </article>
      </div>
    </section>
  )
}

export function DemoReportPanel() {
  return (
    <section className="iaweb-premium-card rounded-2xl p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200">PDF Executivo Premium</p>
      <h2 className="mt-2 text-xl font-semibold text-white">Relatorio demo pronto</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
        A demo mostra a historia completa: documentos entram, intelligence classifica, Health Check orienta decisao, PDF fecha a apresentacao executiva.
      </p>
      <div className="mt-5 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm leading-6 text-emerald-100">
        Estado demo: pronto para relatorio e reuniao executiva.
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {["6 paginas", "Scores visuais", "Riscos e proximos passos"].map((item) => (
          <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <FileText className="h-5 w-5 text-sky-200" aria-hidden="true" />
            <p className="mt-3 font-medium text-white">{item}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
