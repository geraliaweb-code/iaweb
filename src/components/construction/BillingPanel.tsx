"use client"

import ConstructionPlansSection from "./ConstructionPlansSection"
import {
  ConstructionElementLibrary,
  ConstructionEuropeanBlock,
  ConstructionLegalFooter,
  ConstructionScenarioSection,
  ConstructionTrustCenter,
} from "./ConstructionMarketingSections"
import type { ConstructionBillingUsage } from "@/lib/construction/billing/usage"
import { useConstructionLocale } from "./useConstructionLocale"

type BillingPanelProps = {
  usage: ConstructionBillingUsage | null
  warning?: string
}

export default function BillingPanel({ usage, warning }: BillingPanelProps) {
  const { copy } = useConstructionLocale()
  const ui = copy.ui

  return (
    <div className="py-10">
      <section className="construction-glass-card grid gap-8 rounded-xl p-6 md:p-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-300">Billing Construction Intelligence</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-white md:text-6xl">
            {ui.pages.billingTitle}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            {ui.pages.billingBody}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Portugal", "France", "Espana", "PT", "FR", "ES", "RGPD", "Benchmark Europeu"].map((item) => (
              <span key={item} className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-200">
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-950/70 p-6 text-white shadow-xl shadow-slate-950/10">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-300">Uso mensal</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              ["Plano", usage?.planName ?? "Home"],
              ["Estado", usage?.status ?? "trial"],
              ["Restantes", String(usage?.remainingThisMonth ?? usage?.monthlyLimit ?? 3)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
                <p className="mt-2 text-2xl font-semibold capitalize">{value}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm leading-6 text-slate-300">
            Checkout cria uma subscription real na Stripe. O Customer Portal fica disponivel quando existir cliente Stripe associado.
          </p>
        </div>
      </section>

      <ConstructionPlansSection usage={usage} warning={warning} compact />
      <ConstructionElementLibrary />
      <div className="py-14">
        <ConstructionScenarioSection />
      </div>
      <ConstructionEuropeanBlock />
      <ConstructionTrustCenter />
      <div className="py-10">
        <ConstructionLegalFooter />
      </div>
    </div>
  )
}
