import { AlertTriangle, Clock3, Gem, MailWarning } from "lucide-react"
import { daysSince, leadPotential, prospectMonthlyPotential } from "./helpers"
import type { ExecutiveDashboardData } from "./types"

export default function CommercialAlerts({ data }: { data: ExecutiveDashboardData }) {
  const criticalNoContact = data.prospects.filter(
    (prospect) => prospect.priority_label === "Critica" && !prospect.email && !prospect.telefone,
  )
  const proposalsWithoutFollowup = data.leads.filter(
    (lead) => lead.status === "proposta" && !lead.followup_3d && !lead.followup_7d,
  )
  const stalled = data.leads.filter((lead) => !["fechado", "perdido"].includes(lead.status) && daysSince(lead.updated_at || lead.created_at) > 7)
  const highValue = [
    ...data.prospects.filter((prospect) => prospectMonthlyPotential(prospect) >= 15000).map((prospect) => prospect.empresa),
    ...data.leads.filter((lead) => leadPotential(lead) >= 15000).map((lead) => lead.empresa),
  ].slice(0, 8)

  const alerts = [
    {
      label: "Empresas criticas sem contacto",
      value: criticalNoContact.length,
      detail: criticalNoContact.slice(0, 3).map((item) => item.empresa).join(", ") || "Sem bloqueios criticos.",
      icon: AlertTriangle,
    },
    {
      label: "Propostas sem follow-up",
      value: proposalsWithoutFollowup.length,
      detail: proposalsWithoutFollowup.slice(0, 3).map((item) => item.empresa).join(", ") || "Follow-ups preparados.",
      icon: MailWarning,
    },
    {
      label: "Leads paradas > 7 dias",
      value: stalled.length,
      detail: stalled.slice(0, 3).map((item) => item.empresa).join(", ") || "Pipeline sem leads antigas relevantes.",
      icon: Clock3,
    },
    {
      label: "Oportunidades alto valor",
      value: highValue.length,
      detail: highValue.join(", ") || "Sem oportunidades acima do limiar.",
      icon: Gem,
    },
  ]

  return (
    <section className="iaweb-premium-card rounded-2xl border-[#FFB800]/25 p-5">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#FFB800]">Alertas IA</p>
      <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-white">Quem deve ser contactado hoje</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {alerts.map((alert) => {
          const Icon = alert.icon

          return (
            <div key={alert.label} className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">{alert.label}</p>
                <Icon size={18} className="text-[#FFB800]" />
              </div>
              <p className="mt-3 text-3xl font-black text-white">{alert.value}</p>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">{alert.detail}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
