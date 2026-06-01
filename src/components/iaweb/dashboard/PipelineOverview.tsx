import { crmStatuses, getCrmStatusLabel } from "@/lib/crm"
import type { CrmLead } from "@/lib/crm"

const colors: Record<string, string> = {
  novo: "border-[#00A3FF]/30 bg-[#00A3FF]/10",
  contactado: "border-[#00A3FF]/25 bg-[#00A3FF]/[0.07]",
  reuniao: "border-[#FFB800]/30 bg-[#FFB800]/10",
  simulacao: "border-[#3AB8FF]/30 bg-[#3AB8FF]/10",
  proposta: "border-[#FFB800]/35 bg-[#FFB800]/10",
  negociacao: "border-emerald-300/25 bg-emerald-300/10",
  fechado: "border-emerald-300/35 bg-emerald-300/10",
  perdido: "border-rose-300/25 bg-rose-300/10",
}

export default function PipelineOverview({ leads }: { leads: CrmLead[] }) {
  return (
    <section className="iaweb-premium-card rounded-2xl p-5">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#3AB8FF]">CRM</p>
      <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-white">Pipeline resumido</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-4 xl:grid-cols-8">
        {crmStatuses.map((status) => {
          const count = leads.filter((lead) => lead.status === status).length

          return (
            <div key={status} className={`min-h-28 rounded-2xl border p-4 ${colors[status]}`}>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">{getCrmStatusLabel(status)}</p>
              <p className="mt-3 text-4xl font-black tracking-[-0.05em] text-white">{count}</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-[#007BFF] to-[#FFB800]" style={{ width: `${Math.min(100, count * 18)}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
