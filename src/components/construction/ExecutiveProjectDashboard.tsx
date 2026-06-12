import { ArrowRight, BadgeEuro, Building2, CalendarClock, CheckCircle2, Gauge, MapPin, ShieldAlert } from "lucide-react"
import { constructionClientTypeLabels, constructionProjectTypeLabels } from "@/lib/construction/constants"
import type { ConstructionAdvisorResult } from "@/lib/construction/advisor"
import type { BenchmarkV2Result } from "@/lib/construction/benchmark-v2"
import type { CostForecastOutput } from "@/lib/construction/cost-forecasting"
import type { ConstructionRiskReport } from "@/lib/construction/risk-v2"
import type { TimelineOutput } from "@/lib/construction/timeline"
import type { ConstructionHealthCheckResult, ConstructionProject } from "@/lib/construction/types"
import PartialBudgetPreview from "./PartialBudgetPreview"

type HealthCheckV2Intelligence = {
  timeline?: TimelineOutput | null
  riskReport?: ConstructionRiskReport | null
  forecast?: CostForecastOutput | null
  benchmark?: BenchmarkV2Result | null
  advisor?: ConstructionAdvisorResult | null
}

type ExecutiveProjectDashboardProps = {
  project: ConstructionProject
  healthCheck: ConstructionHealthCheckResult | null
  intelligence?: HealthCheckV2Intelligence | null
  warning?: string | null
}

type SpecialtyStatus = "presente" | "parcial" | "ausente"

const technicalCountryLabels: Record<string, string> = {
  portugal: "Portugal",
  france: "Franca",
  spain: "Espanha",
}

const severityRank: Record<string, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
}

const requiredSpecialties = ["arquitetura", "estruturas", "medicoes", "avac", "eletricidade", "scie"]

export default function ExecutiveProjectDashboard({ project, healthCheck, intelligence, warning }: ExecutiveProjectDashboardProps) {
  const hasAnalysis = Boolean(
    healthCheck?.scores.length ||
      healthCheck?.documentsFound ||
      project.maturity_score ||
      project.risk_score ||
      project.complexity_score ||
      project.confidence_score,
  )
  const confidence = buildConfidenceTrio(project, healthCheck, intelligence)
  const learningConfidence = healthCheck?.learningConfidence ?? null
  const activeConfidence = learningConfidence
    ? {
        document: learningConfidence.documentConfidence,
        estimation: learningConfidence.estimationConfidence,
        benchmark: learningConfidence.benchmarkConfidence,
      }
    : confidence
  const healthScore = learningConfidence?.healthScore ?? Math.round(activeConfidence.document * 0.45 + activeConfidence.estimation * 0.4 + activeConfidence.benchmark * 0.15)
  const tier = getOfficialTier(healthScore)
  const visualClass = getVisualClass(healthScore)
  const topRisks = getTopRisks(healthCheck, intelligence?.riskReport ?? null)
  const nextAction = getNextAction(healthCheck, intelligence)
  const cost = getCostRange(healthCheck, intelligence?.forecast ?? null)
  const timeline = intelligence?.timeline?.forecast ?? healthCheck?.scheduleEstimate
  const timelineRange = timeline ? {
    min: getBestMonths(timeline),
    probable: getExpectedMonths(timeline),
    max: getWorstMonths(timeline),
  } : null
  const specialties = getSpecialtyStatuses(healthCheck)
  const lastLearningEvent = healthCheck?.lastLearningEvent ?? healthCheck?.learningEvents?.[0] ?? null

  return (
    <div className="py-10">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">Health Check V2</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">{project.name}</h1>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Diagnostico executivo com identidade, confianca, custo, prazo, risco e proxima acao numa unica leitura.
            </p>
          </div>
          <span className={`rounded-full border px-4 py-2 text-sm font-semibold ${hasAnalysis ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-amber-200 bg-amber-50 text-amber-800"}`}>
            {hasAnalysis ? "Analise disponivel" : "Analise pendente"}
          </span>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-5">
          <Info icon={Building2} label="Tipologia" value={constructionProjectTypeLabels[project.project_type]} />
          <Info icon={MapPin} label="Localizacao" value={project.city} />
          <Info icon={MapPin} label="Pais" value={project.country} />
          <Info icon={Gauge} label="Area estimada" value={project.estimated_area_m2 ? `c. ${project.estimated_area_m2} m2` : "Por definir"} />
          <Info icon={CheckCircle2} label="Sistema construtivo" value={resolveConstructionSystem(project, healthCheck)} />
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <article className="rounded-lg border border-slate-200 bg-slate-950 p-5 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">Health Score</p>
            <div className="mt-4 flex items-end gap-3">
              <p className="text-6xl font-semibold tracking-tight">{healthScore}</p>
              <p className="pb-2 text-lg text-slate-300">/100</p>
            </div>
            <p className="mt-4 text-xl font-semibold">{tier.label}</p>
            <span className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ${visualClass.className}`}>
              {visualClass.label}
            </span>
            <p className="mt-2 text-sm leading-6 text-slate-300">{tier.verdict}</p>
          </article>

          <div className="grid gap-4 sm:grid-cols-3">
            <ScoreCard label="Document Confidence" value={activeConfidence.document} />
            <ScoreCard label="Estimation Confidence" value={activeConfidence.estimation} />
            <ScoreCard label="Benchmark Confidence" value={activeConfidence.benchmark} />
          </div>
        </div>

        {lastLearningEvent ? (
          <article className="mt-6 rounded-lg border border-sky-200 bg-sky-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">Ultimo evento recebido</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">{learningEventTitle(lastLearningEvent.type)}</p>
              </div>
              <span className="rounded-full border border-sky-200 bg-white px-3 py-1 text-sm font-semibold text-sky-800">
                {relativeLearningTime(lastLearningEvent.timestamp)}
              </span>
            </div>
            {learningConfidence ? (
              <p className="mt-3 text-sm text-slate-600">
                Evolucao: +{Math.max(0, learningConfidence.healthScore - learningConfidence.previousHealthScore)} pontos - {learningDecisionLabel(learningConfidence.decision)}
              </p>
            ) : null}
          </article>
        ) : null}

        <div className="mt-6 grid gap-5 xl:grid-cols-3">
          <DecisionCard
            icon={BadgeEuro}
            eyebrow="Cost Intelligence"
            title={cost ? formatEuro(cost.probable) : "Aguardando custo"}
            rows={[
              ["Minimo", cost ? formatEuro(cost.min) : "Sem dados"],
              ["Provavel", cost ? formatEuro(cost.probable) : "Sem dados"],
              ["Maximo", cost ? formatEuro(cost.max) : "Sem dados"],
            ]}
            range={cost ? {
              min: cost.min,
              mid: cost.probable,
              max: cost.max,
              minLabel: "Minimo",
              midLabel: "Provavel",
              maxLabel: "Maximo",
            } : null}
          />
          <DecisionCard
            icon={CalendarClock}
            eyebrow="Timeline Intelligence"
            title={timeline ? `${getExpectedMonths(timeline)} meses` : "Aguardando prazo"}
            rows={[
              ["Best case", timeline ? `${getBestMonths(timeline)} meses` : "Sem dados"],
              ["Expected", timeline ? `${getExpectedMonths(timeline)} meses` : "Sem dados"],
              ["Worst case", timeline ? `${getWorstMonths(timeline)} meses` : "Sem dados"],
            ]}
            range={timelineRange ? {
              min: timelineRange.min,
              mid: timelineRange.probable,
              max: timelineRange.max,
              minLabel: "Best",
              midLabel: "Expected",
              maxLabel: "Worst",
            } : null}
          />
          <DecisionCard
            icon={ArrowRight}
            eyebrow="Proxima acao"
            title={nextAction.title}
            rows={[
              ["Ganho", nextAction.gain ? `+${nextAction.gain} confianca` : "Maior aumento disponivel"],
              ["Origem", nextAction.source],
              ["Acao", nextAction.body],
            ]}
          />
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-lg border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-700" aria-hidden="true" />
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Top Risks</p>
            </div>
            <div className="mt-4 grid gap-3">
              {topRisks.length ? topRisks.slice(0, 4).map((risk) => (
                <article key={risk.id} className="rounded-lg border border-slate-200 bg-white p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-950">{risk.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{risk.source}</p>
                    </div>
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">{risk.severity}</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">
                    {formatEuro(risk.financialImpact)} · {risk.timelineImpactWeeks} semanas · -{risk.confidenceReduction} confianca
                  </p>
                </article>
              )) : (
                <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">Sem riscos principais calculados.</p>
              )}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Especialidades</p>
            <div className="mt-4 grid gap-3">
              {specialties.map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
                  <p className="text-sm font-semibold capitalize text-slate-950">{item.label}</p>
                  <span className={getSpecialtyClass(item.status)}>{item.status}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-950">
            Base tecnica: {technicalCountryLabels[project.technical_country] ?? project.technical_country} · {constructionClientTypeLabels[project.client_type]} · Health Check + Timeline + Risk V2 + Cost Forecasting + Advisor + Benchmark + Knowledge Graph.
          </p>
        </div>

        {!hasAnalysis ? (
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-5">
            <p className="font-semibold text-amber-900">Ainda nao existe analise executiva para esta obra.</p>
            <p className="mt-2 text-sm leading-6 text-amber-800">
              Faz upload da documentacao tecnica, executa Document Intelligence e gera o Health Check para preencher scores, riscos, custo, prazo e confianca.
            </p>
          </div>
        ) : null}

        {warning ? (
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">{warning}</div>
        ) : null}
      </section>

      <PartialBudgetPreview project={project} healthCheck={healthCheck} />
    </div>
  )
}

function buildConfidenceTrio(project: ConstructionProject, healthCheck: ConstructionHealthCheckResult | null, intelligence?: HealthCheckV2Intelligence | null) {
  const document = clamp(healthCheck?.confidenceScore ?? project.confidence_score ?? 0)
  const costConfidence = healthCheck?.costEstimate?.costConfidence ?? intelligence?.forecast?.scenarios.find((scenario) => scenario.label === "expected_case")?.confidence ?? null
  const scheduleConfidence = healthCheck?.scheduleEstimate?.scheduleConfidence ?? intelligence?.timeline?.forecast.confidence ?? null
  const estimation = clamp(averageDefined([costConfidence, scheduleConfidence, document]))
  const benchmark = clamp(intelligence?.benchmark?.confidenceScore ?? Math.round((document + estimation) / 2))
  return { document, estimation, benchmark }
}

function getOfficialTier(score: number) {
  if (score <= 25) return { label: "Nao estimar", verdict: "A base atual nao sustenta estimativa responsavel." }
  if (score <= 50) return { label: "Estimativa exploratoria", verdict: "Utilizar apenas para triagem e alinhamento inicial." }
  if (score <= 75) return { label: "Estimativa operacional", verdict: "Suficiente para decisao interna com ressalvas documentais." }
  return { label: "Alta confianca", verdict: "Base consistente para decisao executiva e proposta." }
}

function getVisualClass(score: number) {
  if (score >= 76) return { label: "Classe A", className: "border-emerald-300 bg-emerald-400/15 text-emerald-100" }
  if (score >= 51) return { label: "Classe B", className: "border-sky-300 bg-sky-400/15 text-sky-100" }
  if (score >= 26) return { label: "Classe C", className: "border-amber-300 bg-amber-400/15 text-amber-100" }
  return { label: "Classe D", className: "border-red-300 bg-red-400/15 text-red-100" }
}

function learningEventTitle(type: string) {
  if (type === "LE-04") return "Documento recebido"
  if (type === "LE-06") return "Novo orcamento recebido"
  if (type === "LE-09") return "Area confirmada"
  if (type === "PROJECT_CANCELLED") return "Projeto cancelado"
  return "Evento de aprendizagem recebido"
}

function learningDecisionLabel(decision: string) {
  if (decision === "automatico") return "calibracao automatica"
  if (decision === "revisao_recomendada") return "revisao recomendada"
  return "aprovacao obrigatoria"
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

function getCostRange(healthCheck: ConstructionHealthCheckResult | null, forecast: CostForecastOutput | null) {
  if (forecast) return { min: forecast.bestCase, probable: forecast.expectedCase, max: forecast.worstCase }
  if (!healthCheck?.costEstimate) return null
  return {
    min: healthCheck.costEstimate.estimatedCostMin,
    probable: healthCheck.costEstimate.estimatedCostMid,
    max: healthCheck.costEstimate.estimatedCostMax,
  }
}

function getTopRisks(healthCheck: ConstructionHealthCheckResult | null, report: ConstructionRiskReport | null) {
  const v2 = report?.risks.map((risk) => ({
    id: risk.id,
    title: risk.title,
    severity: risk.severity,
    source: risk.source,
    financialImpact: risk.impact.financialImpactExpected,
    timelineImpactWeeks: risk.impact.timelineImpactWeeks,
    confidenceReduction: risk.impact.confidenceReduction,
  })) ?? []
  const healthRisks = healthCheck?.alerts.map((alert, index) => ({
    id: `${alert.type}-${index}`,
    title: alert.title,
    severity: alert.severity,
    source: "health_check",
    financialImpact: 0,
    timelineImpactWeeks: alert.severity === "high" ? 4 : 2,
    confidenceReduction: alert.severity === "high" ? 10 : 5,
  })) ?? []

  return [...v2, ...healthRisks].sort((left, right) => {
    const severity = (severityRank[right.severity] ?? 0) - (severityRank[left.severity] ?? 0)
    if (severity) return severity
    const financial = right.financialImpact - left.financialImpact
    if (financial) return financial
    return right.timelineImpactWeeks - left.timelineImpactWeeks
  })
}

function getNextAction(healthCheck: ConstructionHealthCheckResult | null, intelligence?: HealthCheckV2Intelligence | null) {
  const candidates = [
    ...(intelligence?.riskReport?.recommendations.map((item) => ({
      title: item.title,
      body: item.action,
      gain: item.confidenceGain,
      source: "Risk Intelligence V2",
    })) ?? []),
    ...(intelligence?.advisor?.insights.map((item) => ({
      title: item.title,
      body: item.recommendation,
      gain: item.category === "documents" ? Math.max(8, item.confidence) : Math.round(item.confidence / 10),
      source: "Advisor",
    })) ?? []),
    ...(healthCheck?.missingCriticalDocuments.map((document) => ({
      title: `Adicionar ${document}`,
      body: "Completar a lacuna documental com maior impacto na confianca.",
      gain: 12,
      source: "Health Check",
    })) ?? []),
    ...(intelligence?.timeline?.nextActions.map((item) => ({
      title: item.title,
      body: item.recommendation,
      gain: Math.max(4, item.impactWeeks),
      source: "Timeline Intelligence",
    })) ?? []),
  ]

  return candidates.sort((left, right) => right.gain - left.gain)[0] ?? {
    title: "Gerar Health Check",
    body: "Classificar documentos e calcular a primeira base de confianca.",
    gain: 0,
    source: "Health Check",
  }
}

function getSpecialtyStatuses(healthCheck: ConstructionHealthCheckResult | null): Array<{ label: string; status: SpecialtyStatus }> {
  const present = new Set((healthCheck?.identifiedSpecialties ?? []).map((item) => normalize(item)))
  return requiredSpecialties.map((specialty) => {
    const normalized = normalize(specialty)
    const isPresent = present.has(normalized) || (normalized === "medicoes" && present.has("mapa de quantidades"))
    const status: SpecialtyStatus = isPresent ? "presente" : healthCheck?.documentsFound ? "parcial" : "ausente"
    return { label: specialty, status }
  })
}

function resolveConstructionSystem(project: ConstructionProject, healthCheck: ConstructionHealthCheckResult | null) {
  if (project.project_type === "creche") return "Remodelacao + Ampliacao"
  if (healthCheck?.knowledgeGraph?.mainEntities.some((entity) => normalize(entity).includes("ampliacao"))) return "Remodelacao + Ampliacao"
  return "Sistema tradicional"
}

function getBestMonths(value: TimelineOutput["forecast"] | NonNullable<ConstructionHealthCheckResult["scheduleEstimate"]>) {
  return "bestCaseMonths" in value ? value.bestCaseMonths : value.estimatedMonthsMin
}

function getExpectedMonths(value: TimelineOutput["forecast"] | NonNullable<ConstructionHealthCheckResult["scheduleEstimate"]>) {
  return "expectedMonths" in value ? value.expectedMonths : value.estimatedMonthsMid
}

function getWorstMonths(value: TimelineOutput["forecast"] | NonNullable<ConstructionHealthCheckResult["scheduleEstimate"]>) {
  return "worstCaseMonths" in value ? value.worstCaseMonths : value.estimatedMonthsMax
}

function ScoreCard({ label, value }: { label: string; value: number }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-slate-50 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">{value}<span className="text-lg text-slate-400">/100</span></p>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-sky-500" style={{ width: `${value}%` }} />
      </div>
    </article>
  )
}

function DecisionCard({
  icon: Icon,
  eyebrow,
  title,
  rows,
  range,
}: {
  icon: typeof BadgeEuro
  eyebrow: string
  title: string
  rows: Array<[string, string]>
  range?: { min: number; mid: number; max: number; minLabel: string; midLabel: string; maxLabel: string } | null
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">{eyebrow}</p>
        <Icon className="h-5 w-5 text-slate-500" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">{title}</h2>
      {range ? <RangeBar range={range} /> : null}
      <div className="mt-4 grid gap-2">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-start justify-between gap-3 border-t border-slate-100 pt-2 text-sm">
            <span className="text-slate-500">{label}</span>
            <span className="max-w-[62%] text-right font-semibold text-slate-900">{value}</span>
          </div>
        ))}
      </div>
    </article>
  )
}

function RangeBar({ range }: { range: { min: number; mid: number; max: number; minLabel: string; midLabel: string; maxLabel: string } }) {
  const span = Math.max(1, range.max - range.min)
  const midPercent = Math.max(8, Math.min(92, ((range.mid - range.min) / span) * 100))

  return (
    <div className="mt-5">
      <div className="relative h-3 rounded-full bg-slate-200">
        <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-amber-400" style={{ width: `${midPercent}%` }} />
        <span className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-slate-950 shadow-sm" style={{ left: `${midPercent}%` }} />
      </div>
      <div className="mt-2 grid grid-cols-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
        <span>{range.minLabel}</span>
        <span className="text-center text-slate-900">{range.midLabel}</span>
        <span className="text-right">{range.maxLabel}</span>
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

function getSpecialtyClass(status: SpecialtyStatus) {
  if (status === "presente") return "rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800"
  if (status === "parcial") return "rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800"
  return "rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
}

function averageDefined(values: Array<number | null | undefined>) {
  const defined = values.filter((value): value is number => typeof value === "number" && Number.isFinite(value))
  return defined.length ? defined.reduce((total, value) => total + value, 0) / defined.length : 0
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)))
}

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()
}

function formatEuro(value: number) {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value)
}
