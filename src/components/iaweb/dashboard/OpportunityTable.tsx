import Link from "next/link"
import { ArrowRight, ExternalLink } from "lucide-react"
import { formatEuro, prospectAnnualPotential, prospectMonthlyPotential } from "./helpers"
import type { DashboardProspect } from "./types"

export default function OpportunityTable({ prospects }: { prospects: DashboardProspect[] }) {
  const sorted = [...prospects].sort((a, b) => b.opportunity_score - a.opportunity_score).slice(0, 20)

  return (
    <section className="iaweb-premium-card rounded-2xl p-5">
      <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#3AB8FF]">Oportunidades</p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-white">Onde esta o dinheiro</h2>
        </div>
        <Link href="/prospector" className="inline-flex items-center gap-2 rounded-xl border border-[#00A3FF]/25 bg-[#00A3FF]/10 px-4 py-2 text-sm font-black text-[#BFEAFF]">
          Abrir Prospector
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="text-xs uppercase tracking-[0.14em] text-slate-500">
            <tr>
              <th className="border-b border-white/10 py-3">Empresa</th>
              <th className="border-b border-white/10 py-3">Nicho</th>
              <th className="border-b border-white/10 py-3">Cidade</th>
              <th className="border-b border-white/10 py-3">Score Digital</th>
              <th className="border-b border-white/10 py-3">Opportunity</th>
              <th className="border-b border-white/10 py-3">Potencial Mensal</th>
              <th className="border-b border-white/10 py-3">Potencial Anual</th>
              <th className="border-b border-white/10 py-3">Status</th>
              <th className="border-b border-white/10 py-3">Acoes</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((prospect) => (
              <tr key={prospect.id} className="text-slate-300">
                <td className="border-b border-white/5 py-3 font-semibold text-white">{prospect.empresa}</td>
                <td className="border-b border-white/5 py-3">{prospect.nicho}</td>
                <td className="border-b border-white/5 py-3">{prospect.cidade || "--"}</td>
                <td className="border-b border-white/5 py-3">{prospect.score_digital}/100</td>
                <td className="border-b border-white/5 py-3 font-black text-[#FFB800]">{prospect.opportunity_score}/100</td>
                <td className="border-b border-white/5 py-3">{formatEuro(prospectMonthlyPotential(prospect))}</td>
                <td className="border-b border-white/5 py-3">{formatEuro(prospectAnnualPotential(prospect))}</td>
                <td className="border-b border-white/5 py-3">{prospect.status}</td>
                <td className="border-b border-white/5 py-3">
                  <div className="flex gap-2">
                    <Link href="/prospector" className="rounded-lg border border-white/10 px-2 py-1 text-xs font-bold text-slate-300">Ver</Link>
                    <Link href="/crm" className="rounded-lg border border-[#00A3FF]/25 bg-[#00A3FF]/10 px-2 py-1 text-xs font-bold text-[#BFEAFF]">CRM</Link>
                    <Link href={`/proposta?empresa=${encodeURIComponent(prospect.empresa)}&nicho=${encodeURIComponent(prospect.nicho)}`} className="rounded-lg border border-[#FFB800]/25 bg-[#FFB800]/10 px-2 py-1 text-xs font-bold text-[#FFE3A3]">
                      Proposta
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-500">
                  Sem prospects carregados. Abra o Prospector e gere oportunidades simuladas.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  )
}
