import { BadgeEuro, BriefcaseBusiness, Lock, Unlock } from "lucide-react"
import type { ConstructionAnalyticsRevenue } from "@/lib/construction/analytics/types"

type RevenuePanelProps = {
  revenue: ConstructionAnalyticsRevenue
}

export default function RevenuePanel({ revenue }: RevenuePanelProps) {
  const cards = [
    { label: "Receita Potencial", value: formatEuro(revenue.estimatedRevenuePotential), icon: BadgeEuro, tone: "text-amber-100" },
    { label: "Valor Bloqueado", value: formatEuro(revenue.estimatedLockedValue), icon: Lock, tone: "text-red-100" },
    { label: "Valor Desbloqueado", value: formatEuro(revenue.estimatedUnlockedValue), icon: Unlock, tone: "text-emerald-100" },
    { label: "Projetos Ativos", value: formatNumber(revenue.activeProjects), icon: BriefcaseBusiness, tone: "text-sky-100" },
  ]

  return (
    <section className="rounded-2xl border border-amber-200/20 bg-[linear-gradient(145deg,rgba(251,191,36,0.11),rgba(15,23,42,0.72))] p-5 text-white backdrop-blur">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-100">Revenue analytics</p>
      <h2 className="mt-2 text-2xl font-semibold">Receita e valor bloqueado</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <article key={card.label} className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
              <Icon className={`h-5 w-5 ${card.tone}`} aria-hidden="true" />
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{card.label}</p>
              <p className="mt-2 text-xl font-semibold">{card.value}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function formatEuro(value: number) {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value)
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-PT", { maximumFractionDigits: 0 }).format(value)
}
