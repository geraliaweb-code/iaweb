import { Building2, CheckCircle2, CircleAlert, MapPin } from "lucide-react"
import { constructionClientTypeLabels, constructionProjectTypeLabels } from "@/lib/construction/constants"
import type { ConstructionHealthCheckResult, ConstructionProject } from "@/lib/construction/types"
import ExecutiveCostScenarioCards from "./ExecutiveCostScenarioCards"
import ExecutiveDocumentStatus from "./ExecutiveDocumentStatus"
import ExecutiveNextActions from "./ExecutiveNextActions"
import ExecutiveRiskPanel from "./ExecutiveRiskPanel"
import ExecutiveScoreGrid, { type ExecutiveScore } from "./ExecutiveScoreGrid"

type ExecutiveProjectDashboardProps = {
  project: ConstructionProject
  healthCheck: ConstructionHealthCheckResult | null
  warning?: string | null
}

const technicalCountryLabels: Record<string, string> = {
  portugal: "Portugal",
  france: "Franca",
  spain: "Espanha",
}

export default function ExecutiveProjectDashboard({ project, healthCheck, warning }: ExecutiveProjectDashboardProps) {
  const hasAnalysis = Boolean(
    healthCheck?.scores.length ||
      healthCheck?.documentsFound ||
      project.maturity_score ||
      project.risk_score ||
      project.complexity_score ||
      project.confidence_score,
  )
  const costBasis = healthCheck?.costEstimate?.calculationBasis
  const scores: ExecutiveScore[] = [
    { label: "Maturity Score", value: healthCheck?.maturityScore ?? project.maturity_score, helper: "Qualidade e completude da base documental.", tone: "navy" },
    { label: "Risk Score", value: healthCheck?.riskScore ?? project.risk_score, helper: "Exposicao documental, tecnica e decisional.", tone: "gold" },
    { label: "Complexity Score", value: healthCheck?.complexityScore ?? project.complexity_score, helper: "Complexidade por tipo, pais, area e especialidades.", tone: "slate" },
    { label: "Confidence Score", value: healthCheck?.confidenceScore ?? project.confidence_score, helper: "Confianca agregada da estimativa executiva.", tone: "blue" },
  ]

  return (
    <div className="py-10">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">Executive dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">Resumo Executivo da Obra</h1>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Uma visao clara da maturidade, risco, custo, prazo e confianca da documentacao analisada.
            </p>
          </div>
          <span className={`rounded-full border px-4 py-2 text-sm font-semibold ${hasAnalysis ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-amber-200 bg-amber-50 text-amber-800"}`}>
            {hasAnalysis ? "Analise disponivel" : "Analise pendente"}
          </span>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-4">
          <Info icon={Building2} label="Projeto" value={project.name} />
          <Info icon={MapPin} label="Localizacao" value={`${project.city}, ${project.country}`} />
          <Info icon={CheckCircle2} label="Segmento" value={constructionProjectTypeLabels[project.project_type]} />
          <Info icon={CircleAlert} label="Cliente" value={constructionClientTypeLabels[project.client_type]} />
        </div>

        <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-950">
            Estimativa gerada com base na documentacao analisada, benchmark de mercado e referencias reais do setor da construcao.
          </p>
          <p className="mt-2 text-sm text-slate-600">Quanto melhor a documentacao, mais precisa a estimativa.</p>
        </div>

        {!hasAnalysis ? (
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-5">
            <p className="font-semibold text-amber-900">Ainda nao existe analise executiva para esta obra.</p>
            <p className="mt-2 text-sm leading-6 text-amber-800">
              Faz upload da documentacao tecnica, executa Document Intelligence e gera o Health Check para preencher scores, riscos, custo, prazo e confianca com dados reais do projeto.
            </p>
          </div>
        ) : null}

        {warning ? (
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">{warning}</div>
        ) : null}
      </section>

      <div className="mt-6 grid gap-6">
        <ExecutiveScoreGrid scores={scores} hasAnalysis={hasAnalysis} />

        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <ExecutiveCostScenarioCards costEstimate={healthCheck?.costEstimate ?? null} scheduleEstimate={healthCheck?.scheduleEstimate ?? null} hasAnalysis={hasAnalysis} />
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Base tecnica</p>
            <div className="mt-4 grid gap-3">
              <Basis label="Pais tecnico" value={technicalCountryLabels[project.technical_country] ?? project.technical_country} />
              <Basis label="Segmento" value={costBasis?.marketSegment ?? constructionProjectTypeLabels[project.project_type]} />
              <Basis label="Fornecedor base" value={costBasis?.suppliers?.[0] ?? "Disponivel apos Health Check"} />
              <Basis label="Categoria principal" value={costBasis?.dominantCategory ?? "Disponivel apos Health Check"} />
            </div>
          </section>
        </div>

        <ExecutiveDocumentStatus
          hasAnalysis={hasAnalysis}
          documentsFound={healthCheck?.documentsFound ?? 0}
          missingDocuments={healthCheck?.missingCriticalDocuments ?? []}
          specialties={healthCheck?.identifiedSpecialties ?? []}
        />

        <div className="grid gap-6 xl:grid-cols-2">
          <ExecutiveRiskPanel alerts={healthCheck?.alerts ?? []} hasAnalysis={hasAnalysis} />
          <ExecutiveNextActions
            projectId={project.id}
            hasAnalysis={hasAnalysis}
            missingDocuments={healthCheck?.missingCriticalDocuments ?? []}
            recommendations={healthCheck?.knowledgeGraph?.recommendations ?? []}
          />
        </div>
      </div>
    </div>
  )
}

function Info({ icon: Icon, label, value }: { icon: typeof Building2; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-slate-500">
        <Icon className="h-4 w-4" aria-hidden="true" />
        <p className="text-xs font-semibold uppercase tracking-[0.14em]">{label}</p>
      </div>
      <p className="mt-2 text-sm font-semibold leading-5 text-slate-950">{value}</p>
    </div>
  )
}

function Basis({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold leading-5 text-slate-950">{value}</p>
    </div>
  )
}
