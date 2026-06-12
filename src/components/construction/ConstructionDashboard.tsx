import Link from "next/link"
import { ArrowRight, BarChart3, Building2, FileText, Gauge, Plus, ShieldAlert, Sparkles } from "lucide-react"
import { constructionClientTypeLabels, constructionProjectTypeLabels } from "@/lib/construction/constants"
import type { ConstructionLearningStatus, ConstructionProject, ConstructionStats } from "@/lib/construction/types"

type ConstructionDashboardProps = {
  projects: ConstructionProject[]
  stats: ConstructionStats
  warning?: string
  showProjectSelector?: boolean
  learningStatus?: ConstructionLearningStatus | null
}

const metricCards = [
  { key: "totalProjects", label: "Total de projetos", icon: Building2, suffix: "" },
  { key: "analysesDone", label: "Analises feitas", icon: BarChart3, suffix: "" },
  { key: "averageRisk", label: "Risco medio", icon: ShieldAlert, suffix: "/100" },
  { key: "averageMaturity", label: "Maturidade media", icon: Gauge, suffix: "/100" },
] as const

export default function ConstructionDashboard({ projects, stats, warning, showProjectSelector = true, learningStatus = null }: ConstructionDashboardProps) {
  return (
    <div className="flex flex-1 flex-col py-10">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-200">Executive cockpit</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-5xl">Construction Intelligence</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            Visao consolidada da maturidade documental, risco e confianca dos projetos tecnicos.
          </p>
        </div>
        <Link
          href="/construction/projects/new"
          className="inline-flex items-center gap-2 rounded-full bg-sky-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-sky-300"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Novo Projeto
        </Link>
        {showProjectSelector ? (
          <Link
            href="/construction/projects/demo"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-300 to-sky-300 px-5 py-3 text-sm font-bold text-slate-950 shadow-[0_0_34px_rgba(245,158,11,0.18)] transition hover:scale-[1.02]"
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Ver PT-001
          </Link>
        ) : null}
      </div>

      {warning ? (
        <div className="mt-8 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">{warning}</div>
      ) : null}

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((metric) => {
          const Icon = metric.icon
          const value = stats[metric.key]

          return (
            <article key={metric.key} className="iaweb-premium-card rounded-2xl p-5">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-slate-300">{metric.label}</p>
                <Icon className="h-5 w-5 text-sky-200" aria-hidden="true" />
              </div>
              <p className="mt-5 text-4xl font-semibold tracking-tight text-white">
                {value}
                <span className="text-lg text-slate-400">{metric.suffix}</span>
              </p>
            </article>
          )
        })}
      </section>

      <section className="mt-8 rounded-2xl border border-sky-300/20 bg-sky-300/10 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-200">Learning Status</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Real Project Learning Loop</h2>
          </div>
          <span className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 text-sm font-semibold text-sky-100">
            {learningStatus?.eventsReceived ?? 0} eventos recebidos
          </span>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <LearningMetric label="Eventos recebidos" value={String(learningStatus?.eventsReceived ?? 0)} />
          <LearningMetric label="Ultimo evento" value={learningStatus?.lastEvent ? learningEventTitle(learningStatus.lastEvent.type) : "Sem eventos"} detail={learningStatus?.lastEvent ? relativeLearningTime(learningStatus.lastEvent.timestamp) : "Aguardando LE-04/06/09"} />
          <LearningMetric label="Confianca atual" value={`${learningStatus?.currentConfidence ?? 0}/100`} />
          <LearningMetric label="Evolucao" value={`+${learningStatus?.confidenceEvolution ?? 0}`} detail="desde ultimo evento validado" />
        </div>
      </section>

      {showProjectSelector ? <section className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Link href="/construction/projects/demo" className="iaweb-premium-card rounded-2xl p-6 transition hover:scale-[1.01]">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-amber-200" aria-hidden="true" />
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200">Alfa PT-001</p>
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-white">Equipamento Social</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Remodelacao + Ampliacao em Portugal com Health Check V2, custo, prazo, riscos e proxima acao.
          </p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-sky-200">
            Abrir PT-001
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </Link>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["incompleto", "Sem documentos ou Health Check."],
            ["em analise", "Documentos classificados."],
            ["pronto para relatorio", "Scores, benchmark e PDF."],
          ].map(([label, body]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="font-semibold text-white">{label}</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
            </div>
          ))}
        </div>
      </section> : null}

      {showProjectSelector ? <section className="mt-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-white">Projetos recentes</h2>
          <Link href="/construction" className="text-sm font-medium text-sky-200 hover:text-sky-100">
            Modulo
          </Link>
        </div>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          {projects.length ? (
            <div className="divide-y divide-white/10">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/construction/projects/${project.id}`}
                  className="grid gap-4 p-5 transition hover:bg-white/[0.04] md:grid-cols-[1.3fr_0.8fr_0.7fr_auto]"
                >
                  <div>
                    <p className="font-semibold text-white">{project.name}</p>
                    <p className="mt-1 text-sm text-slate-400">
                      {project.city}, {project.country}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Obra</p>
                    <p className="mt-1 text-sm text-slate-200">{constructionProjectTypeLabels[project.project_type]}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Cliente</p>
                    <p className="mt-1 text-sm text-slate-200">{constructionClientTypeLabels[project.client_type]}</p>
                  </div>
                  <div className="flex items-center justify-end text-sky-200">
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 p-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-lg font-semibold text-white">Ainda nao existem projetos reais.</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Cria um projeto para ligar uploads, Document Intelligence, Health Check, estimativas e PDF executivo.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href="/construction/projects/new" className="rounded-full bg-sky-400 px-5 py-3 text-sm font-bold text-slate-950">
                    Novo Projeto
                  </Link>
                  <Link href="/construction/projects/demo" className="rounded-full border border-white/15 px-5 py-3 text-sm font-bold text-white">
                    Ver PT-001
                  </Link>
                </div>
              </div>
              <div className="rounded-2xl border border-sky-300/20 bg-sky-300/10 p-5">
                <FileText className="h-6 w-6 text-sky-200" aria-hidden="true" />
                <p className="mt-4 font-semibold text-white">Alfa: PT-001</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Fluxo completo com documentos classificados, scores, custo, prazo, riscos e PDF executivo.
                </p>
              </div>
            </div>
          )}
        </div>
      </section> : null}
    </div>
  )
}

function LearningMetric({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <article className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className="mt-2 text-xl font-semibold text-white">{value}</p>
      {detail ? <p className="mt-2 text-xs leading-5 text-slate-300">{detail}</p> : null}
    </article>
  )
}

function learningEventTitle(type: string) {
  if (type === "LE-04") return "Documento recebido"
  if (type === "LE-06") return "Novo orcamento"
  if (type === "LE-09") return "Area confirmada"
  return "Evento recebido"
}

function relativeLearningTime(timestamp: string) {
  const deltaMs = Date.now() - new Date(timestamp).getTime()
  const minutes = Math.max(0, Math.round(deltaMs / 60000))
  if (minutes < 60) return minutes <= 1 ? "agora" : `ha ${minutes} minutos`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return hours === 1 ? "ha 1 hora" : `ha ${hours} horas`
  const days = Math.round(hours / 24)
  if (days <= 1) return "ontem"
  return `ha ${days} dias`
}
