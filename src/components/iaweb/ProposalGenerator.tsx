"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, Download, Loader2, MessageCircle, Save, Send, Sparkles } from "lucide-react"
import ProposalInvestmentCard from "@/components/iaweb/ProposalInvestmentCard"
import ProposalPlanSelector, {
  getPlanByName,
  proposalPlans,
  type ProposalPlan,
} from "@/components/iaweb/ProposalPlanSelector"
import ProposalPreview, { type ProposalData } from "@/components/iaweb/ProposalPreview"
import { getNicheEngine } from "@/lib/niches"

const defaultData: ProposalData = {
  empresa: "",
  responsavel: "",
  email: "",
  telefone: "",
  nicho: "outro",
  objetivo: "Gerar mais leads qualificados",
  website: "",
  setupValue: "EUR 799",
  monthlyValue: "EUR 99/mes",
  notes: "",
  scoreAtual: "",
  scoreProjetado: "",
  template: "",
  headline: "",
}

const nicheOptions = ["clinicas", "construcao", "imobiliario", "restaurantes", "industria", "servicos B2B", "advocacia", "contabilidade", "comercio local", "outro"]
const objectiveOptions = [
  "Gerar mais leads qualificados",
  "Melhorar percecao de valor",
  "Aumentar marcacoes",
  "Receber pedidos de orcamento",
  "Organizar funil comercial",
]

function inputClass() {
  return "mt-2 h-12 w-full rounded-2xl border border-white/10 bg-white/[0.065] px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-200/40 focus:bg-white/[0.095] focus:ring-4 focus:ring-cyan-300/10"
}

function getInitialPlan(niche: string, objective: string) {
  const objectiveLower = objective.toLowerCase()
  if (objectiveLower.includes("funil")) return proposalPlans[3]
  if (objectiveLower.includes("orcamento")) return proposalPlans[2]
  if (niche === "restaurantes" || niche === "comercio local") return proposalPlans[0]
  if (niche === "industria" || niche === "servicos B2B") return proposalPlans[3]
  return proposalPlans[1]
}

function setupFromPlan(plan: ProposalPlan) {
  if (plan.key === "homepage") return "EUR 299"
  if (plan.key === "website") return "EUR 799"
  if (plan.key === "sistema") return "EUR 1.500"
  return "EUR 3.000"
}

function monthlyFromPlan(plan: ProposalPlan) {
  if (plan.key === "homepage") return "EUR 49/mes"
  if (plan.key === "website") return "EUR 99/mes"
  if (plan.key === "sistema") return "EUR 199/mes"
  return "EUR 499/mes"
}

export default function ProposalGenerator() {
  const searchParams = useSearchParams()
  const [data, setData] = useState<ProposalData>(defaultData)
  const [plan, setPlan] = useState<ProposalPlan>(proposalPlans[1])
  const [status, setStatus] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const empresa = searchParams.get("empresa") ?? ""
    const nicho = searchParams.get("nicho") ?? defaultData.nicho
    const objetivo = searchParams.get("objetivo") ?? defaultData.objetivo
    const website = searchParams.get("website") ?? ""
    const scoreAtual = searchParams.get("scoreAtual") ?? ""
    const scoreProjetado = searchParams.get("scoreProjetado") ?? ""
    const template = searchParams.get("template") ?? ""
    const headline = searchParams.get("headline") ?? ""
    const packageParam = searchParams.get("pacote")
    const selectedPlan = packageParam ? getPlanByName(packageParam) : getInitialPlan(nicho, objetivo)

    setPlan(selectedPlan)
    setData((current) => ({
      ...current,
      empresa,
      nicho,
      objetivo,
      website,
      scoreAtual,
      scoreProjetado,
      template,
      headline,
      setupValue: setupFromPlan(selectedPlan),
      monthlyValue: monthlyFromPlan(selectedPlan),
    }))
  }, [searchParams])

  const simulatorParams = useMemo(() => {
    const params = new URLSearchParams()
    if (data.empresa.trim()) params.set("empresa", data.empresa.trim())
    if (data.nicho.trim()) params.set("nicho", data.nicho.trim())
    if (data.objetivo.trim()) params.set("objetivo", data.objetivo.trim())
    if (data.website.trim()) params.set("website", data.website.trim())
    return params.toString()
  }, [data])

  const whatsAppHref = useMemo(() => {
    const niche = getNicheEngine(data.nicho)
    const message = [
      `Ola${data.responsavel ? ` ${data.responsavel}` : ""},`,
      `preparei a proposta da IAWEB para ${data.empresa || "a sua empresa"}.`,
      `Dor principal identificada: ${niche.pains[0]}`,
      `Oportunidade: ${niche.opportunities[0]}`,
      `Pacote recomendado: ${plan.name}.`,
      `Setup: ${data.setupValue || plan.setupLabel}. Mensalidade: ${data.monthlyValue || plan.monthlyLabel}.`,
      "A proposta tem validade de 7 dias. Posso enviar os proximos passos?",
    ].join("\n\n")

    return `https://wa.me/${data.telefone.replace(/\D/g, "") || "351913837004"}?text=${encodeURIComponent(message)}`
  }, [data, plan])

  function updateField(field: keyof ProposalData, value: string) {
    setData((current) => ({ ...current, [field]: value }))
  }

  function handlePlanChange(nextPlan: ProposalPlan) {
    setPlan(nextPlan)
    setData((current) => ({
      ...current,
      setupValue: setupFromPlan(nextPlan),
      monthlyValue: monthlyFromPlan(nextPlan),
    }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("Proposta atualizada no preview.")
  }

  function handlePrint() {
    window.print()
  }

  async function handleSaveCrm() {
    setSaving(true)
    setStatus("")
    await new Promise((resolve) => setTimeout(resolve, 300))
    setSaving(false)
    setStatus("TODO: guardar proposta no CRM quando existir tabela/API propria para propostas.")
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030712] text-white">
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #proposal-print-area,
          #proposal-print-area * {
            visibility: visible;
          }
          #proposal-print-area {
            position: absolute;
            inset: 0;
            width: 100%;
            border: 0 !important;
            box-shadow: none !important;
          }
        }
      `}</style>
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(14,165,233,0.18),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(245,158,11,0.12),transparent_28%),linear-gradient(180deg,rgba(3,7,18,0),#030712_78%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />
      </div>

      <section className="relative z-10 px-5 py-6 sm:px-8 lg:px-12">
        <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 shadow-[0_18px_70px_rgba(0,0,0,0.32)] backdrop-blur-2xl">
          <Link
            href={`/simulador-site${simulatorParams ? `?${simulatorParams}` : ""}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-200 transition hover:text-white"
          >
            <ArrowLeft size={15} />
            Voltar ao Simulador
          </Link>
          <span className="rounded-full border border-cyan-200/15 bg-cyan-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-cyan-100">
            Gerador de Proposta
          </span>
        </nav>

        <div className="mx-auto grid max-w-7xl gap-8 py-12 lg:grid-cols-[0.88fr_1.12fr] lg:py-16">
          <div className="space-y-5 lg:sticky lg:top-6 lg:self-start">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.08] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-cyan-100">
                <Sparkles size={14} />
                Sprint 3 Growth Engine
              </div>
              <h1 className="text-4xl font-black leading-[0.98] tracking-[-0.055em] text-white sm:text-6xl">
                Gerar proposta comercial pronta para fechar.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300">
                Edite os dados, ajuste investimento e apresente uma proposta premium com proximos passos claros.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="rounded-[26px] border border-white/10 bg-white/[0.055] p-5 shadow-[0_24px_100px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-bold text-slate-300">Nome da empresa</span>
                  <input value={data.empresa} onChange={(event) => updateField("empresa", event.target.value)} className={inputClass()} />
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-slate-300">Responsavel</span>
                  <input value={data.responsavel} onChange={(event) => updateField("responsavel", event.target.value)} className={inputClass()} />
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-slate-300">Email</span>
                  <input type="email" value={data.email} onChange={(event) => updateField("email", event.target.value)} className={inputClass()} />
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-slate-300">Telefone</span>
                  <input value={data.telefone} onChange={(event) => updateField("telefone", event.target.value)} className={inputClass()} />
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-slate-300">Nicho</span>
                  <select value={data.nicho} onChange={(event) => updateField("nicho", event.target.value)} className={`${inputClass()} bg-[#0b1220]`}>
                    {nicheOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-slate-300">Objetivo</span>
                  <select value={data.objetivo} onChange={(event) => updateField("objetivo", event.target.value)} className={`${inputClass()} bg-[#0b1220]`}>
                    {objectiveOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-sm font-bold text-slate-300">Website atual</span>
                  <input value={data.website} onChange={(event) => updateField("website", event.target.value)} className={inputClass()} />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-sm font-bold text-slate-300">Observacoes</span>
                  <textarea
                    value={data.notes}
                    onChange={(event) => updateField("notes", event.target.value)}
                    rows={4}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.065] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-200/40 focus:bg-white/[0.095] focus:ring-4 focus:ring-cyan-300/10"
                  />
                </label>
              </div>
              <button type="submit" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-black text-[#07111F]">
                Atualizar Preview
                <Send size={16} />
              </button>
            </form>

            <ProposalPlanSelector selectedKey={plan.key} onChange={handlePlanChange} />
            <ProposalInvestmentCard
              setupValue={data.setupValue}
              monthlyValue={data.monthlyValue}
              onSetupChange={(value) => updateField("setupValue", value)}
              onMonthlyChange={(value) => updateField("monthlyValue", value)}
            />
          </div>

          <div className="space-y-5">
            <ProposalPreview data={data} plan={plan} />

            <section className="grid gap-3 md:grid-cols-4">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-[#07111F] transition hover:-translate-y-0.5"
              >
                <Download size={16} />
                Baixar Proposta PDF
              </button>
              <button
                type="button"
                onClick={handleSaveCrm}
                disabled={saving}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm font-black text-emerald-100 transition hover:bg-emerald-300/15 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Guardar no CRM
              </button>
              <Link
                href={`/simulador-site${simulatorParams ? `?${simulatorParams}` : ""}`}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-cyan-200/20 bg-cyan-300/10 px-4 py-3 text-sm font-black text-cyan-100 transition hover:bg-cyan-300/15"
              >
                <ArrowLeft size={16} />
                Voltar ao Simulador
              </Link>
              <a
                href={whatsAppHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-green-300/20 bg-green-300/10 px-4 py-3 text-sm font-black text-green-100 transition hover:bg-green-300/15"
              >
                <MessageCircle size={16} />
                Abrir WhatsApp
              </a>
            </section>

            {status ? <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm leading-6 text-slate-300">{status}</div> : null}
          </div>
        </div>
      </section>
    </main>
  )
}
