import { Euro, Landmark, Timer } from "lucide-react"
import type { ConstructionCostEstimate, ConstructionScheduleEstimate } from "@/lib/construction/types"

type ExecutiveCostScenarioCardsProps = {
  costEstimate: ConstructionCostEstimate | null
  scheduleEstimate: ConstructionScheduleEstimate | null
  hasAnalysis: boolean
}

const fallbackScenarios = [
  { id: "economic", label: "Cenario Economico", description: "Faixa economica calculada apos Health Check.", min: null, max: null, confidenceScore: null },
  { id: "normal", label: "Cenario Normal", description: "Faixa normal calculada apos Health Check.", min: null, max: null, confidenceScore: null },
  { id: "premium", label: "Cenario Premium", description: "Faixa premium calculada apos Health Check.", min: null, max: null, confidenceScore: null },
]

const labels: Record<string, string> = {
  economic: "Cenario Economico",
  normal: "Cenario Normal",
  premium: "Cenario Premium",
}

export default function ExecutiveCostScenarioCards({ costEstimate, scheduleEstimate, hasAnalysis }: ExecutiveCostScenarioCardsProps) {
  const scenarios = costEstimate?.scenarios?.length
    ? costEstimate.scenarios.map((scenario) => ({
        id: scenario.id,
        label: labels[scenario.id] ?? scenario.label,
        description: scenario.notes[0] ?? "Faixa de custo por cenario.",
        min: scenario.min,
        max: scenario.max,
        confidenceScore: scenario.confidenceScore,
      }))
    : fallbackScenarios

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Cenarios de custo</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-950">Cenario economico, normal e premium</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Nunca apresentado como numero unico absoluto. A leitura executiva trabalha sempre por faixas e confianca.
          </p>
        </div>
        <Euro className="h-5 w-5 text-amber-700" aria-hidden="true" />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {scenarios.map((scenario) => (
          <article key={scenario.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{scenario.label}</p>
            <p className="mt-3 text-lg font-semibold text-slate-950">
              {hasAnalysis && scenario.min !== null && scenario.max !== null ? `${formatEuro(scenario.min)} a ${formatEuro(scenario.max)}` : "A gerar"}
            </p>
            <p className="mt-2 text-sm leading-5 text-slate-600">{scenario.description}</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
              <div className="h-full rounded-full bg-amber-500" style={{ width: `${scenario.confidenceScore ?? 0}%` }} />
            </div>
            <p className="mt-2 text-xs font-medium text-slate-500">Confianca: {scenario.confidenceScore ?? 0}/100</p>
          </article>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <Meta icon={Landmark} label="Mercado de referencia" value={costEstimate?.calculationBasis?.marketReference ?? "Disponivel apos Health Check"} />
        <Meta
          icon={Timer}
          label="Prazo estimado"
          value={
            scheduleEstimate
              ? `${scheduleEstimate.estimatedMonthsMin} a ${scheduleEstimate.estimatedMonthsMax} meses`
              : "Disponivel apos Health Check"
          }
        />
      </div>
    </section>
  )
}

function Meta({ icon: Icon, label, value }: { icon: typeof Landmark; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2 text-slate-500">
        <Icon className="h-4 w-4" aria-hidden="true" />
        <p className="text-xs font-semibold uppercase tracking-[0.16em]">{label}</p>
      </div>
      <p className="mt-2 text-sm font-semibold leading-5 text-slate-950">{value}</p>
    </div>
  )
}

function formatEuro(value: number) {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value)
}
