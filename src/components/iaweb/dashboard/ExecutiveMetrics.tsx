import { BarChart3, CircleDollarSign, Gem, Handshake, Target, TrendingUp, Users, Zap } from "lucide-react"
import { formatEuro, leadPotential, prospectAnnualPotential, prospectMonthlyPotential } from "./helpers"
import type { ExecutiveDashboardData } from "./types"

export default function ExecutiveMetrics({ data }: { data: ExecutiveDashboardData }) {
  const totalProspects = data.prospects.length
  const totalLeads = data.leads.length
  const critical = data.prospects.filter((prospect) => prospect.priority_label === "Critica").length
  const pipelinePotential = data.leads.reduce((sum, lead) => sum + leadPotential(lead), 0)
  const monthlyPotential =
    data.prospects.reduce((sum, prospect) => sum + prospectMonthlyPotential(prospect), 0) + pipelinePotential
  const annualPotential = data.prospects.reduce((sum, prospect) => sum + prospectAnnualPotential(prospect), 0) + pipelinePotential * 12
  const proposals = data.leads.filter((lead) => lead.status === "proposta").length
  const negotiations = data.leads.filter((lead) => lead.status === "negociacao").length
  const closed = data.leads.filter((lead) => lead.status === "fechado").length

  const metrics = [
    ["Total Prospects", String(totalProspects), Target],
    ["Total Leads CRM", String(totalLeads), Users],
    ["Oportunidades Criticas", String(critical), Zap],
    ["Pipeline Potencial", formatEuro(pipelinePotential), BarChart3],
    ["Receita Mensal", formatEuro(monthlyPotential), CircleDollarSign],
    ["Receita Anual", formatEuro(annualPotential), TrendingUp],
    ["Propostas Abertas", String(proposals), Gem],
    ["Negociacoes", String(negotiations), Handshake],
    ["Fechados", String(closed), Gem],
  ] as const

  return (
    <section className="grid gap-3 md:grid-cols-3 xl:grid-cols-9">
      {metrics.map(([label, value, Icon]) => (
        <div key={label} className="iaweb-premium-card rounded-2xl p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">{label}</p>
            <Icon size={17} className="text-[#3AB8FF]" />
          </div>
          <p className="mt-3 text-2xl font-black tracking-[-0.05em] text-white">{value}</p>
        </div>
      ))}
    </section>
  )
}
