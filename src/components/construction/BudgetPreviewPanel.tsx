"use client"

import { BarChart3 } from "lucide-react"
import type { ConstructionCostBreakdownLine } from "@/lib/construction/cost-engine-v2"

type BudgetPreviewPanelProps = {
  visibleSpecialties: ConstructionCostBreakdownLine[]
  visibleCost: number
  estimatedRange: {
    min: number
    max: number
  }
}

export default function BudgetPreviewPanel({ visibleSpecialties, visibleCost, estimatedRange }: BudgetPreviewPanelProps) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 shadow-[0_18px_55px_rgba(2,8,23,0.24)] backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-100">Budget preview</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Especialidades desbloqueadas</h3>
        </div>
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-sky-200/20 bg-sky-200/10 text-sky-100">
          <BarChart3 className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {visibleSpecialties.length ? (
          visibleSpecialties.map((item) => (
            <div key={`${item.specialty}-${item.itemName}`} className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-slate-950/55 px-4 py-3">
              <div>
                <p className="font-semibold text-white">{item.specialty}</p>
                <p className="mt-1 text-xs text-slate-400">{item.itemName}</p>
              </div>
              <p className="text-lg font-bold text-amber-100">{formatEuro(item.subtotal)}</p>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-white/10 bg-slate-950/55 p-4 text-sm text-slate-300">Ainda nao ha especialidades visiveis.</div>
        )}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Metric label="Total identificado" value={formatEuro(visibleCost)} />
        <Metric label="Faixa estimada da obra" value={`${formatEuro(estimatedRange.min)} - ${formatEuro(estimatedRange.max)}`} />
      </div>
    </article>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-amber-200/15 bg-amber-200/10 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-100/80">{label}</p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  )
}

function formatEuro(value: number) {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value)
}
