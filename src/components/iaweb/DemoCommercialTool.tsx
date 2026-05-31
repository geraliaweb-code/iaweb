"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  Loader2,
  Mail,
  Phone,
  RefreshCcw,
  Send,
  Sparkles,
} from "lucide-react"
import DemoOpportunityLoss from "@/components/iaweb/DemoOpportunityLoss"
import DemoRecommendedPlan from "@/components/iaweb/DemoRecommendedPlan"
import DemoScoreCard from "@/components/iaweb/DemoScoreCard"
import { getNicheEngine } from "@/lib/niches"

type DemoFormData = {
  empresa: string
  nicho: string
  website: string
  telefone: string
  email: string
  objetivo: string
}

type DemoAnalysis = {
  scoreFinal: number
  scores: {
    website: number
    google: number
    conversao: number
    crm: number
    automacao: number
  }
  diagnostico: string
  lossRange: {
    min: number
    max: number
  }
  monthlyLoss: number
  lossReason: string
  opportunities: string[]
  recommendations: string[]
  packageName: string
}

const initialForm: DemoFormData = {
  empresa: "",
  nicho: "outro",
  website: "",
  telefone: "",
  email: "",
  objetivo: "Gerar mais leads qualificados",
}

const nicheOptions = [
  "construcao",
  "clinicas",
  "imobiliario",
  "restaurantes",
  "industria",
  "servicos B2B",
  "advocacia",
  "contabilidade",
  "comercio local",
  "outro",
]

const objectiveOptions = [
  "Gerar mais leads qualificados",
  "Melhorar website atual",
  "Aparecer melhor no Google",
  "Organizar contactos e follow-up",
  "Automatizar WhatsApp e CRM",
]

const lossRanges: Record<string, { min: number; max: number }> = {
  construcao: { min: 3000, max: 24000 },
  clinicas: { min: 2000, max: 15000 },
  imobiliario: { min: 3000, max: 30000 },
  restaurantes: { min: 1000, max: 8000 },
  industria: { min: 5000, max: 50000 },
  "servicos B2B": { min: 2000, max: 20000 },
  advocacia: { min: 2000, max: 20000 },
  contabilidade: { min: 2000, max: 20000 },
  "comercio local": { min: 800, max: 6000 },
  outro: { min: 1000, max: 10000 },
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)))
}

function hasWebsite(value: string) {
  const trimmed = value.trim().toLowerCase()
  return trimmed.includes(".") && !trimmed.includes(" ")
}

function hasProfessionalEmail(value: string) {
  const domain = value.split("@")[1]?.toLowerCase() ?? ""
  return Boolean(domain) && !["gmail.com", "hotmail.com", "outlook.com", "icloud.com", "yahoo.com"].includes(domain)
}

function getPackage(score: number, objective: string) {
  if (score < 42) return "Homepage Premium desde EUR 299"
  if (score < 62) return "Website Profissional"
  if (objective.includes("Organizar") || objective.includes("CRM")) return "Sistema Comercial"
  return "IAWEB Growth Engine"
}

function calculateDemoAnalysis(form: DemoFormData): DemoAnalysis {
  const nicheEngine = getNicheEngine(form.nicho)
  const websiteReady = hasWebsite(form.website)
  const professionalEmail = hasProfessionalEmail(form.email)
  const hasPhone = form.telefone.trim().length >= 9
  const wantsGoogle = form.objetivo.includes("Google")
  const wantsCrm = form.objetivo.includes("contactos") || form.objetivo.includes("CRM")
  const wantsAutomation = form.objetivo.includes("Automatizar")

  const scores = {
    website: clampScore(28 + (websiteReady ? 26 : 0) + (professionalEmail ? 8 : 0) + (form.objetivo.includes("website") ? 16 : 0)),
    google: clampScore(24 + (websiteReady ? 14 : 0) + (wantsGoogle ? 24 : 0)),
    conversao: clampScore(30 + (hasPhone ? 12 : 0) + (professionalEmail ? 8 : 0) + (form.objetivo.includes("leads") ? 18 : 0)),
    crm: clampScore(18 + (hasPhone ? 10 : 0) + (wantsCrm ? 24 : 0)),
    automacao: clampScore(14 + (hasPhone ? 8 : 0) + (wantsAutomation ? 28 : 0)),
  }

  const scoreFinal = clampScore(
    scores.website * 0.24 + scores.google * 0.18 + scores.conversao * 0.24 + scores.crm * 0.18 + scores.automacao * 0.16,
  )
  const lossRange = lossRanges[form.nicho] ?? lossRanges.outro
  const riskFactor = Math.max(0.18, (100 - scoreFinal) / 100)
  const monthlyLoss = Math.round((lossRange.min + (lossRange.max - lossRange.min) * riskFactor) / 100) * 100
  const weakAreas = Object.entries(scores)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 3)
    .map(([key]) => key)

  const recommendations = [
    nicheEngine.opportunities[0],
    nicheEngine.opportunities[1],
    scores.website < 70 ? "Reforcar a primeira dobra com proposta de valor, prova e CTA visivel." : nicheEngine.salesArguments[0],
    scores.crm < 70 ? "Centralizar leads num funil simples com status, prioridade e proxima acao." : nicheEngine.salesArguments[1],
  ].filter(Boolean).slice(0, 4)
  const topPain = nicheEngine.pains[0]
  const topOpportunity = nicheEngine.opportunities[0]

  return {
    scoreFinal,
    scores,
    diagnostico:
      scoreFinal < 45
        ? `${nicheEngine.personalizedDiagnosis} Na ${form.empresa || "empresa"}, o bloqueio principal parece ser: ${topPain} As areas mais frageis sao ${weakAreas.join(", ")}.`
        : scoreFinal < 70
          ? `${nicheEngine.personalizedDiagnosis} A oportunidade mais rapida e: ${topOpportunity} O ganho operacional esta em ${weakAreas.join(", ")}.`
          : `${nicheEngine.personalizedDiagnosis} A ${form.empresa || "empresa"} ja tem uma boa base; agora deve escalar com ${nicheEngine.salesArguments[0].toLowerCase()}`,
    lossRange,
    monthlyLoss,
    lossReason:
      `${nicheEngine.estimatedRoi} Esta estimativa combina o potencial medio do nicho com o risco comercial indicado pelo score. Serve para enquadrar a conversa, nao como promessa de resultado.`,
    opportunities: nicheEngine.opportunities.slice(0, 3),
    recommendations,
    packageName: getPackage(scoreFinal, form.objetivo),
  }
}

function inputClass() {
  return "mt-2 h-12 w-full rounded-2xl border border-white/10 bg-white/[0.065] px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-200/40 focus:bg-white/[0.095] focus:ring-4 focus:ring-cyan-300/10"
}

function DemoField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  placeholder?: string
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-300">{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={inputClass()} />
    </label>
  )
}

function DemoSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-300">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className={`${inputClass()} bg-[#0b1220]`}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

export default function DemoCommercialTool() {
  const [form, setForm] = useState<DemoFormData>(initialForm)
  const [analysis, setAnalysis] = useState<DemoAnalysis | null>(null)
  const [crmStatus, setCrmStatus] = useState("")
  const [savingLead, setSavingLead] = useState(false)

  const futureParams = useMemo(() => {
    const params = new URLSearchParams()
    if (form.empresa.trim()) params.set("empresa", form.empresa.trim())
    if (form.nicho.trim()) params.set("nicho", form.nicho.trim())
    if (form.objetivo.trim()) params.set("objetivo", form.objetivo.trim())
    if (form.website.trim()) params.set("website", form.website.trim())
    return params.toString()
  }, [form.empresa, form.nicho, form.objetivo, form.website])

  useEffect(() => {
    if (!analysis) return
    setAnalysis(calculateDemoAnalysis(form))
    setCrmStatus("")
  }, [form])

  function updateField(field: keyof DemoFormData, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setCrmStatus("")
    setAnalysis(calculateDemoAnalysis(form))
  }

  async function handleSaveLead() {
    if (!analysis) return

    setSavingLead(true)
    setCrmStatus("")

    const payload = {
      formData: {
        nome: form.empresa || "Lead Demo",
        empresa: form.empresa || "Empresa sem nome",
        email: form.email || "demo@iaweb.pt",
        whatsapp: form.telefone || "000000000",
        website: form.website || "nao indicado",
        setor: form.nicho,
        objetivo: form.objetivo,
      },
      result: {
        scoreFinal: analysis.scoreFinal,
        categorias: {
          website: analysis.scores.website,
          google: analysis.scores.google,
          conversao: analysis.scores.conversao,
          automacao: analysis.scores.automacao,
        },
        classificacao: {
          label: analysis.scoreFinal <= 40 ? "Critico" : analysis.scoreFinal <= 70 ? "Em Desenvolvimento" : "Forte",
          message: analysis.diagnostico,
        },
        potencialEstimado: `Perda mensal estimada: EUR ${analysis.monthlyLoss.toLocaleString("pt-PT")}`,
        recomendacoes: analysis.recommendations,
        createdAt: new Date().toISOString(),
      },
    }

    try {
      const response = await fetch("/api/diagnostico/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await response.json().catch(() => null)

      if (!response.ok) {
        setCrmStatus(data?.error ?? "TODO: ajustar payload do demo para o CRM quando houver schema proprio.")
        return
      }

      setCrmStatus("Lead preparado e enviado para o CRM atraves da API existente.")
    } catch {
      setCrmStatus("TODO: CRM indisponivel ou schema futuro necessario para leads do demo.")
    } finally {
      setSavingLead(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030712] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(14,165,233,0.18),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(245,158,11,0.12),transparent_28%),linear-gradient(180deg,rgba(3,7,18,0),#030712_78%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />
      </div>

      <section className="relative z-10 px-5 py-6 sm:px-8 lg:px-12">
        <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 shadow-[0_18px_70px_rgba(0,0,0,0.32)] backdrop-blur-2xl">
          <Link href="/" className="text-sm font-black tracking-[-0.02em] text-white">
            IAWEB
          </Link>
          <span className="rounded-full border border-cyan-200/15 bg-cyan-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-cyan-100">
            Growth Engine Demo
          </span>
        </nav>

        <div className="mx-auto grid max-w-7xl gap-8 py-12 lg:grid-cols-[0.92fr_1.08fr] lg:py-16">
          <div className="lg:sticky lg:top-6 lg:self-start">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.08] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-cyan-100">
              <Sparkles size={14} />
              Ferramenta presencial
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-[0.98] tracking-[-0.055em] text-white sm:text-6xl">
              Analise comercial ao vivo para fechar proximos passos.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300">
              Criada para Diego e equipa conduzirem reunioes com clareza: score, perda estimada, recomendacoes e pacote
              recomendado numa unica tela.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 rounded-[26px] border border-white/10 bg-white/[0.055] p-5 shadow-[0_24px_100px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <DemoField label="Nome da empresa" value={form.empresa} onChange={(value) => updateField("empresa", value)} placeholder="Ex: Clinica Central" />
                <DemoSelect label="Nicho" value={form.nicho} options={nicheOptions} onChange={(value) => updateField("nicho", value)} />
                <DemoField label="Website atual" value={form.website} onChange={(value) => updateField("website", value)} placeholder="https://empresa.pt" />
                <DemoField label="Telefone" value={form.telefone} onChange={(value) => updateField("telefone", value)} placeholder="+351 912 345 678" />
                <DemoField label="Email" type="email" value={form.email} onChange={(value) => updateField("email", value)} placeholder="cliente@empresa.pt" />
                <DemoSelect label="Objetivo principal" value={form.objetivo} options={objectiveOptions} onChange={(value) => updateField("objetivo", value)} />
              </div>

              <button
                type="submit"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-black text-[#07111F] shadow-[0_16px_60px_rgba(78,140,255,0.22)] transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white/30"
              >
                Analisar Empresa
                <ArrowRight size={16} />
              </button>
            </form>
          </div>

          <div className="space-y-5">
            {analysis ? (
              <>
                <DemoScoreCard
                  score={analysis.scoreFinal}
                  scores={[
                    { label: "Website", value: analysis.scores.website },
                    { label: "Google", value: analysis.scores.google },
                    { label: "Conversao", value: analysis.scores.conversao },
                    { label: "CRM", value: analysis.scores.crm },
                    { label: "Automacao", value: analysis.scores.automacao },
                  ]}
                />

                <section className="rounded-[26px] border border-white/10 bg-white/[0.055] p-5 backdrop-blur-2xl sm:p-6">
                  <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-sky-100">
                    <ClipboardList size={16} />
                    Diagnostico comercial
                  </div>
                  <p className="text-lg font-semibold leading-8 text-white">{analysis.diagnostico}</p>
                </section>

                <section className="rounded-[26px] border border-white/10 bg-white/[0.055] p-5 backdrop-blur-2xl sm:p-6">
                  <div className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-cyan-100">
                    Oportunidades por nicho
                  </div>
                  <div className="grid gap-3 md:grid-cols-3">
                    {analysis.opportunities.map((opportunity) => (
                      <div key={opportunity} className="rounded-2xl border border-cyan-200/15 bg-cyan-300/[0.07] p-4 text-sm font-semibold leading-6 text-cyan-50">
                        {opportunity}
                      </div>
                    ))}
                  </div>
                </section>

                <DemoOpportunityLoss
                  niche={form.nicho}
                  lossRange={analysis.lossRange}
                  monthlyLoss={analysis.monthlyLoss}
                  reason={analysis.lossReason}
                />

                <DemoRecommendedPlan packageName={analysis.packageName} recommendations={analysis.recommendations} />

                <section className="grid gap-3 md:grid-cols-3">
                  <button
                    type="button"
                    onClick={handleSaveLead}
                    disabled={savingLead}
                    className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm font-black text-emerald-100 transition hover:bg-emerald-300/15 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {savingLead ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                    Guardar Lead no CRM
                  </button>
                  <Link
                    href={`/simulador-site${futureParams ? `?${futureParams}` : ""}`}
                    className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-cyan-200/20 bg-cyan-300/10 px-4 py-3 text-sm font-black text-cyan-100 transition hover:bg-cyan-300/15"
                  >
                    <ExternalLink size={16} />
                    Simular Novo Website
                  </Link>
                  <Link
                    href={`/proposta${futureParams ? `?${futureParams}` : ""}`}
                    className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-[#07111F] transition hover:-translate-y-0.5"
                  >
                    <Send size={16} />
                    Gerar Proposta
                  </Link>
                </section>

                {crmStatus ? (
                  <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm leading-6 text-slate-300">{crmStatus}</div>
                ) : null}
              </>
            ) : (
              <section className="flex min-h-[34rem] flex-col justify-between rounded-[26px] border border-white/10 bg-white/[0.055] p-6 shadow-[0_24px_100px_rgba(0,0,0,0.34)] backdrop-blur-2xl">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-sky-100">
                    <Building2 size={14} />
                    Pronto para analisar
                  </div>
                  <h2 className="mt-5 text-3xl font-black tracking-[-0.04em] text-white">
                    Preenche os dados e gera uma leitura comercial em segundos.
                  </h2>
                  <p className="mt-4 max-w-2xl leading-7 text-slate-400">
                    A analise e 100% client-side nesta fase. Nao usa IA externa e nao altera os modulos de diagnostico ou CRM.
                  </p>
                </div>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {[
                    [Phone, "Contacto", "Telefone e email para seguimento"],
                    [Mail, "Nicho", "Perda estimada por setor"],
                    [RefreshCcw, "Plano", "Pacote recomendado na hora"],
                  ].map(([Icon, title, text]) => (
                    <div key={String(title)} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <Icon size={18} className="text-cyan-100" />
                      <div className="mt-3 font-bold text-white">{String(title)}</div>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{String(text)}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
