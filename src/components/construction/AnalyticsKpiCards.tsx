import { BarChart3, CreditCard, Eye, MousePointerClick, ReceiptText, Unlock, FolderKanban } from "lucide-react"
import type { ConstructionAnalyticsKpis } from "@/lib/construction/analytics/types"

type AnalyticsKpiCardsProps = {
  kpis: ConstructionAnalyticsKpis
}

const cards = [
  { key: "projects", label: "Projetos", icon: FolderKanban, format: "number" },
  { key: "previews", label: "Previews", icon: Eye, format: "number" },
  { key: "unlockClicks", label: "Unlock Clicks", icon: MousePointerClick, format: "number" },
  { key: "checkouts", label: "Checkouts", icon: CreditCard, format: "number" },
  { key: "payments", label: "Pagamentos", icon: ReceiptText, format: "number" },
  { key: "unlockRate", label: "Unlock Rate", icon: Unlock, format: "percent" },
] as const

export default function AnalyticsKpiCards({ kpis }: AnalyticsKpiCardsProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
      {cards.map((card) => {
        const Icon = card.icon
        const value = kpis[card.key]

        return (
          <article key={card.key} className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 shadow-[0_18px_55px_rgba(2,8,23,0.22)] backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <Icon className="h-5 w-5 text-amber-100" aria-hidden="true" />
              <BarChart3 className="h-4 w-4 text-sky-200/70" aria-hidden="true" />
            </div>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{card.format === "percent" ? `${value}%` : formatNumber(value)}</p>
          </article>
        )
      })}
    </section>
  )
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-PT", { maximumFractionDigits: 0 }).format(value)
}
