import type { ConstructionTopOrganizationMetric } from "@/lib/construction/analytics/types"

type TopOrganizationsPanelProps = {
  organizations: ConstructionTopOrganizationMetric[]
}

export default function TopOrganizationsPanel({ organizations }: TopOrganizationsPanelProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 text-white backdrop-blur">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-100">Organizations</p>
      <h2 className="mt-2 text-2xl font-semibold">Organizacoes comerciais</h2>
      <div className="mt-5 grid gap-3">
        {organizations.map((organization) => (
          <article key={organization.organizationId ?? "none"} className="rounded-xl border border-white/10 bg-slate-950/60 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold">{organization.organizationName}</p>
                <p className="mt-1 text-xs text-slate-400">{organization.projects} projetos</p>
              </div>
              <p className="font-bold text-amber-100">{formatEuro(organization.estimatedRevenuePotential)}</p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <Metric label="Unlocks" value={organization.unlocks} />
              <Metric label="Checkouts" value={organization.checkouts} />
            </div>
          </article>
        ))}
        {!organizations.length ? <p className="rounded-xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-400">Sem organizacoes para apresentar.</p> : null}
      </div>
    </section>
  )
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
      <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-white">{value}</p>
    </div>
  )
}

function formatEuro(value: number) {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value)
}
