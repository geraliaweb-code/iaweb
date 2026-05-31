import { ArrowRight, CalendarDays, CheckCircle2, FileText, ShieldCheck, Sparkles } from "lucide-react"
import type { ProposalPlan } from "@/components/iaweb/ProposalPlanSelector"
import { getNicheEngine } from "@/lib/niches"

export type ProposalData = {
  empresa: string
  responsavel: string
  email: string
  telefone: string
  nicho: string
  objetivo: string
  website: string
  setupValue: string
  monthlyValue: string
  notes: string
}

type ProposalPreviewProps = {
  data: ProposalData
  plan: ProposalPlan
}

function display(value: string, fallback: string) {
  return value.trim() || fallback
}

function getOpportunity(data: ProposalData) {
  const niche = getNicheEngine(data.nicho)

  return `${niche.personalizedDiagnosis} Dor principal: ${niche.pains[0]} Oportunidade imediata: ${niche.opportunities[0]}`
}

export default function ProposalPreview({ data, plan }: ProposalPreviewProps) {
  const niche = getNicheEngine(data.nicho)
  const scopedIncludes = Array.from(new Set([...plan.includes, ...niche.salesArguments.slice(0, 3)]))

  return (
    <article id="proposal-print-area" className="overflow-hidden rounded-[28px] border border-white/10 bg-white text-slate-950 shadow-[0_30px_120px_rgba(0,0,0,0.42)]">
      <section className="relative overflow-hidden bg-[#030712] px-6 py-8 text-white sm:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(56,189,248,0.22),transparent_30%),radial-gradient(circle_at_15%_85%,rgba(245,158,11,0.14),transparent_30%)]" />
        <div className="relative">
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm font-black tracking-[-0.02em]">IAWEB</div>
            <div className="rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-cyan-100">
              Proposta Comercial
            </div>
          </div>
          <div className="mt-12 max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-200">
              <Sparkles size={13} />
              Growth Engine
            </div>
            <h1 className="text-4xl font-black leading-[0.98] tracking-[-0.055em] sm:text-6xl">
              Proposta para {display(data.empresa, "a sua empresa")}
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Uma solucao comercial para melhorar presenca digital, captacao e seguimento de oportunidades.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 p-6 sm:p-8 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 lg:col-span-2">
          <div className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-[0.14em] text-slate-500">
            <FileText size={16} />
            Diagnostico resumido
          </div>
          <p className="text-lg font-bold leading-8 text-slate-950">
            A {display(data.empresa, "empresa")} atua em {display(data.nicho, "mercado definido")} e tem como objetivo
            principal: {display(data.objetivo, "gerar mais oportunidades comerciais")}.
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            {niche.personalizedDiagnosis} Website atual: {display(data.website, "nao indicado")}. Responsavel: {display(data.responsavel, "a definir")}.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-950 p-5 text-white">
          <div className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-[0.14em] text-cyan-100">
            <CalendarDays size={16} />
            Validade
          </div>
          <p className="text-3xl font-black tracking-[-0.05em]">7 dias</p>
          <p className="mt-3 text-sm leading-6 text-slate-300">Condicoes comerciais validas durante 7 dias apos apresentacao.</p>
        </div>
      </section>

      <section className="grid gap-4 px-6 pb-6 sm:px-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-[0.14em] text-slate-500">
            <ShieldCheck size={16} />
            Oportunidade identificada
          </div>
          <p className="text-sm leading-7 text-slate-700">{getOpportunity(data)}</p>
        </div>

        <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-[0.14em] text-cyan-700">
            <ArrowRight size={16} />
            Solucao recomendada
          </div>
          <h2 className="text-2xl font-black tracking-[-0.04em] text-slate-950">{plan.name}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            Implementacao focada em {niche.opportunities[0].toLowerCase()}, com acompanhamento mensal e argumentos
            comerciais alinhados ao nicho.
          </p>
        </div>
      </section>

      <section className="px-6 pb-6 sm:px-8">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-sm font-black uppercase tracking-[0.14em] text-slate-500">Escopo incluido</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {scopedIncludes.map((item) => (
              <div key={item} className="flex gap-3 rounded-xl bg-white p-3 text-sm font-semibold text-slate-700">
                <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-500" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 px-6 pb-6 sm:px-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-black uppercase tracking-[0.14em] text-slate-500">Investimento setup</h3>
          <p className="mt-3 text-4xl font-black tracking-[-0.06em] text-slate-950">{display(data.setupValue, plan.setupLabel)}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-black uppercase tracking-[0.14em] text-slate-500">Mensalidade</h3>
          <p className="mt-3 text-4xl font-black tracking-[-0.06em] text-slate-950">{display(data.monthlyValue, plan.monthlyLabel)}</p>
        </div>
      </section>

      <section className="px-6 pb-8 sm:px-8">
        <div className="rounded-2xl border border-slate-200 bg-slate-950 p-5 text-white">
          <h3 className="text-sm font-black uppercase tracking-[0.14em] text-cyan-100">Proximos passos</h3>
          <ol className="mt-4 grid gap-3 text-sm leading-7 text-slate-200 sm:grid-cols-3">
            <li>1. Aprovar proposta e escopo.</li>
            <li>2. Recolher conteudos e acessos.</li>
            <li>3. Iniciar implementacao IAWEB.</li>
          </ol>
          {data.notes.trim() ? <p className="mt-5 border-t border-white/10 pt-4 text-sm leading-7 text-slate-300">{data.notes}</p> : null}
          <button className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-[#07111F]">
            Aprovar proposta
            <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </article>
  )
}
