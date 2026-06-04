import ConstructionPlansSection from "./ConstructionPlansSection"
import {
  ConstructionElementLibrary,
  ConstructionEuropeanBlock,
  ConstructionLegalFooter,
  ConstructionScenarioSection,
  ConstructionTrustCenter,
} from "./ConstructionMarketingSections"
import type { ConstructionBillingUsage } from "@/lib/construction/billing/usage"

type BillingPanelProps = {
  usage: ConstructionBillingUsage | null
  warning?: string
}

export default function BillingPanel({ usage, warning }: BillingPanelProps) {
  return (
    <div className="py-10">
      <section className="grid gap-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-700">Billing Construction Intelligence</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-slate-950 md:text-6xl">
            Ative inteligencia documental para cada decisao de obra.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Planos para particulares, construtores, arquitetos, engenheiros, gabinetes tecnicos, promotores e empresas que precisam de analisar documentacao tecnica com rigor europeu.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Portugal", "France", "Espana", "PT", "FR", "ES", "RGPD", "Benchmark Europeu"].map((item) => (
              <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-700">
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-[1.5rem] bg-slate-950 p-6 text-white shadow-xl shadow-slate-950/10">
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
