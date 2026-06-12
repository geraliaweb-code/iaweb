"use client"

import { useEffect, useMemo, useState } from "react"
import { BrainCircuit, Gauge, PiggyBank, ShieldAlert } from "lucide-react"
import AdvisorActionsPanel from "./AdvisorActionsPanel"
import AdvisorInsightCard from "./AdvisorInsightCard"
import type { AdvisorActionKey, ConstructionAdvisorResult } from "@/lib/construction/advisor"

type ConstructionAdvisorPanelProps = {
  projectId: string
  advisor: ConstructionAdvisorResult | null
  warnings?: string[]
}

const actionCategories: Record<AdvisorActionKey, Array<ConstructionAdvisorResult["insights"][number]["category"]>> = {
  reduce_costs: ["cost"],
  largest_risk: ["risk"],
  increase_confidence: ["documents"],
  above_average: ["benchmark", "cost"],
}

export default function ConstructionAdvisorPanel({ projectId, advisor, warnings = [] }: ConstructionAdvisorPanelProps) {
  const [activeAction, setActiveAction] = useState<AdvisorActionKey | "all">("all")

  useEffect(() => {
    void trackAdvisorEvent(projectId, "advisor_opened", { source: "advisor-panel" })
  }, [projectId])

  const visibleInsights = useMemo(() => {
    if (!advisor) return []
    if (activeAction === "all") return advisor.insights

    const categories = actionCategories[activeAction]
    return advisor.insights.filter((insight) => categories.includes(insight.category))
  }, [activeAction, advisor])

  function handleAction(action: AdvisorActionKey) {
    setActiveAction(action)
    void trackAdvisorEvent(projectId, "advisor_action_clicked", { action })
  }

  function handleInsightViewed(id: string) {
    void trackAdvisorEvent(projectId, "advisor_recommendation_viewed", { insightId: id, action: activeAction })
  }

  if (!advisor) {
    return (
      <section className="rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(3,10,24,0.98),rgba(8,33,61,0.86)_62%,rgba(126,92,20,0.34))] p-5 text-white shadow-[0_24px_80px_rgba(2,8,23,0.4)] md:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-100">Advisor Intelligence Layer</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">Construction Cost Advisor</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">Ainda nao existem dados suficientes para gerar recomendacoes executivas.</p>
      </section>
    )
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(3,10,24,0.98),rgba(8,33,61,0.88)_58%,rgba(126,92,20,0.4))] p-5 text-white shadow-[0_24px_80px_rgba(2,8,23,0.45)] md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-100">
            <BrainCircuit className="h-4 w-4" aria-hidden="true" />
            Advisor Intelligence Layer V1
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">Construction Cost Advisor</h2>
          <p className="mt-3 text-sm leading-6 text-slate-200">
            Identificamos oportunidades de otimizacao, riscos e acoes recomendadas.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <Metric icon={PiggyBank} label="Poupanca" value={formatEuro(advisor.totalPotentialSavings)} />
          <Metric icon={ShieldAlert} label="Riscos" value={String(advisor.criticalRisks.length)} />
          <Metric icon={Gauge} label="Confianca" value={`+${advisor.confidenceImprovementPotential}`} />
        </div>
      </div>

      <div className="mt-6">
        <AdvisorActionsPanel activeAction={activeAction} onAction={handleAction} insights={advisor.insights} />
      </div>

      {warnings.length ? (
        <p className="mt-4 rounded-lg border border-amber-200/20 bg-amber-200/10 px-4 py-3 text-xs leading-5 text-amber-50">
          Alguns sinais sao indicativos: {warnings.slice(0, 2).join(" ")}
        </p>
      ) : null}

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {visibleInsights.length ? (
          visibleInsights.map((insight) => (
            <button key={insight.id} type="button" onClick={() => handleInsightViewed(insight.id)} className="block text-left">
              <AdvisorInsightCard insight={insight} />
            </button>
          ))
        ) : (
          <div className="rounded-xl border border-white/10 bg-white/[0.045] p-5 text-sm text-slate-300">
            Sem insights para esta pergunta neste momento.
          </div>
        )}
      </div>
    </section>
  )
}

function Metric({ icon: Icon, label, value }: { icon: typeof PiggyBank; label: string; value: string }) {
  return (
    <div className="min-w-24 rounded-xl border border-white/10 bg-white/[0.055] p-3">
      <Icon className="mx-auto h-4 w-4 text-amber-100" aria-hidden="true" />
      <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-bold text-white">{value}</p>
    </div>
  )
}

async function trackAdvisorEvent(projectId: string, eventType: "advisor_opened" | "advisor_recommendation_viewed" | "advisor_action_clicked", metadata: Record<string, unknown>) {
  try {
    await fetch(`/api/construction/projects/${projectId}/advisor-events`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ eventType, metadata }),
    })
  } catch {
    // Analytics must never block the advisor experience.
  }
}

function formatEuro(value: number) {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value)
}
