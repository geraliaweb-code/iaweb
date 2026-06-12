"use client"

import { BarChart3, CircleHelp, FileSearch, ShieldAlert } from "lucide-react"
import type { AdvisorActionKey, AdvisorInsight } from "@/lib/construction/advisor"

type AdvisorActionsPanelProps = {
  activeAction: AdvisorActionKey | "all"
  onAction: (action: AdvisorActionKey) => void
  insights: AdvisorInsight[]
}

const actions: Array<{
  key: AdvisorActionKey
  label: string
  categories: AdvisorInsight["category"][]
  icon: typeof CircleHelp
}> = [
  { key: "reduce_costs", label: "Como reduzir custos?", categories: ["cost"], icon: CircleHelp },
  { key: "largest_risk", label: "Onde esta o maior risco?", categories: ["risk"], icon: ShieldAlert },
  { key: "increase_confidence", label: "O que falta para aumentar a confianca?", categories: ["documents"], icon: FileSearch },
  { key: "above_average", label: "Porque estou acima da media?", categories: ["benchmark", "cost"], icon: BarChart3 },
]

export default function AdvisorActionsPanel({ activeAction, onAction, insights }: AdvisorActionsPanelProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {actions.map((action) => {
        const Icon = action.icon
        const count = insights.filter((insight) => action.categories.includes(insight.category)).length
        const active = activeAction === action.key

        return (
          <button
            key={action.key}
            type="button"
            onClick={() => onAction(action.key)}
            className={`flex min-h-24 items-start gap-3 rounded-xl border p-4 text-left transition ${
              active
                ? "border-amber-200/50 bg-amber-200/15 text-white"
                : "border-white/10 bg-slate-950/35 text-slate-200 hover:border-amber-200/30 hover:bg-white/[0.06]"
            }`}
          >
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-300 text-slate-950">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm font-bold leading-5">{action.label}</span>
              <span className="mt-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{count} insight(s)</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
