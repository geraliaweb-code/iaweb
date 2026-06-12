import { AlertTriangle, BarChart3, FileText, PiggyBank } from "lucide-react"
import type { AdvisorInsight } from "@/lib/construction/advisor"

type AdvisorInsightCardProps = {
  insight: AdvisorInsight
}

const categoryLabels: Record<AdvisorInsight["category"], string> = {
  cost: "Custo",
  risk: "Risco",
  documents: "Documentos",
  benchmark: "Benchmark",
}

const priorityLabels: Record<AdvisorInsight["priority"], string> = {
  low: "Baixa",
  medium: "Media",
  high: "Alta",
  critical: "Critica",
}

const categoryIcons = {
  cost: PiggyBank,
  risk: AlertTriangle,
  documents: FileText,
  benchmark: BarChart3,
}

export default function AdvisorInsightCard({ insight }: AdvisorInsightCardProps) {
  const Icon = categoryIcons[insight.category]

  return (
    <article className="rounded-xl border border-white/10 bg-white/[0.045] p-4 shadow-[0_16px_45px_rgba(2,8,23,0.28)] backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-sky-200/20 bg-sky-200/10 px-3 py-1 text-xs font-bold text-sky-100">
          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
          {categoryLabels[insight.category]}
        </span>
        <span className="rounded-full border border-amber-200/25 bg-amber-200/10 px-3 py-1 text-xs font-bold text-amber-100">
          {priorityLabels[insight.priority]}
        </span>
      </div>

      <h3 className="mt-4 text-lg font-semibold leading-snug text-white">{insight.title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-200">{insight.recommendation}</p>
      <p className="mt-3 rounded-lg border border-white/10 bg-slate-950/45 px-3 py-2 text-sm leading-5 text-slate-300">{insight.impact}</p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
        <span>Confianca {insight.confidence}%</span>
        {typeof insight.estimatedSavings === "number" ? (
          <span className="text-amber-100">Poupanca {formatEuro(insight.estimatedSavings)}</span>
        ) : null}
      </div>
    </article>
  )
}

function formatEuro(value: number) {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value)
}
