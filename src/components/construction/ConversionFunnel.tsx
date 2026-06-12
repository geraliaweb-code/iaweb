import { ArrowDown } from "lucide-react"
import type { ConstructionAnalyticsFunnel } from "@/lib/construction/analytics/types"

type ConversionFunnelProps = {
  funnel: ConstructionAnalyticsFunnel
}

const funnelSteps = [
  { key: "uploads", label: "Uploads" },
  { key: "previewViewed", label: "Previews" },
  { key: "unlockClicks", label: "Unlocks" },
  { key: "checkoutStarted", label: "Checkout" },
  { key: "checkoutCompleted", label: "Pagamento" },
] as const

export default function ConversionFunnel({ funnel }: ConversionFunnelProps) {
  const max = Math.max(...funnelSteps.map((step) => funnel[step.key]), 1)

  return (
    <section className="rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(5,18,38,0.96),rgba(12,39,70,0.86))] p-5 text-white shadow-[0_20px_65px_rgba(2,8,23,0.34)]">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-100">Conversion funnel</p>
      <h2 className="mt-2 text-2xl font-semibold">Funil comercial</h2>

      <div className="mt-6 grid gap-3">
        {funnelSteps.map((step, index) => {
          const value = funnel[step.key]
          const width = Math.max(18, Math.round((value / max) * 100))

          return (
            <div key={step.key}>
              <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold">{step.label}</p>
                  <p className="text-xl font-bold text-amber-100">{formatNumber(value)}</p>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white/10">
                  <div className="h-2 rounded-full bg-[linear-gradient(90deg,#38bdf8,#facc15)]" style={{ width: `${width}%` }} />
                </div>
              </div>
              {index < funnelSteps.length - 1 ? (
                <div className="flex justify-center py-2 text-amber-100">
                  <ArrowDown className="h-4 w-4" aria-hidden="true" />
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
    </section>
  )
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-PT", { maximumFractionDigits: 0 }).format(value)
}
