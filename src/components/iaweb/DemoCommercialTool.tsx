"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  Flame,
  Gem,
  KeyRound,
  Loader2,
  Mail,
  MoveRight,
  Phone,
  RefreshCcw,
  Send,
  Sparkles,
  Target,
  XCircle,
} from "lucide-react"
import DemoOpportunityLoss from "@/components/iaweb/DemoOpportunityLoss"
import DemoRecommendedPlan from "@/components/iaweb/DemoRecommendedPlan"
import DemoScoreCard from "@/components/iaweb/DemoScoreCard"
import { calculateFinanceImpact, formatEuro, type FinanceImpact } from "@/lib/finance-impact"
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
  financeImpact: FinanceImpact
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

  const packageName = getPackage(scoreFinal, form.objetivo)
  const financeImpact = calculateFinanceImpact({
    niche: form.nicho,
    packageName,
    score: scoreFinal,
  })

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
    packageName,
    financeImpact,
  }
}

function inputClass() {
  return "mt-2 h-12 w-full rounded-2xl border border-white/10 bg-[#050816]/70 px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-[#00A3FF]/60 focus:bg-[#081120]/90 focus:ring-4 focus:ring-[#00A3FF]/10"
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

function FinanceMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="demo-metric-card rounded-2xl border border-[#00A3FF]/30 bg-[#050816]/70 p-4">
      <div className="text-xs font-black uppercase tracking-[0.18em] text-[#3AB8FF]">{label}</div>
      <div className="demo-count mt-2 text-xl font-black tracking-[-0.04em] text-white">{value}</div>
    </div>
  )
}

export default function DemoCommercialTool() {
  const [form, setForm] = useState<DemoFormData>(initialForm)
  const [analysis, setAnalysis] = useState<DemoAnalysis | null>(null)
  const [crmStatus, setCrmStatus] = useState("")
  const [savingLead, setSavingLead] = useState(false)
  const nicheInsight = useMemo(() => getNicheEngine(form.nicho), [form.nicho])

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
    <main className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      <style jsx global>{`
        @keyframes demo-drift {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.42; }
          50% { transform: translate3d(18px, -22px, 0) scale(1.08); opacity: 0.78; }
        }
        @keyframes demo-grid-flow {
          from { background-position: 0 0; }
          to { background-position: 72px 72px; }
        }
        @keyframes demo-slide-up {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes demo-pulse-glow {
          0%, 100% { box-shadow: 0 0 28px rgba(0, 163, 255, 0.22), inset 0 0 24px rgba(0, 123, 255, 0.08); }
          50% { box-shadow: 0 0 54px rgba(0, 163, 255, 0.42), inset 0 0 34px rgba(255, 184, 0, 0.12); }
        }
        @keyframes demo-shine {
          from { transform: translateX(-120%) skewX(-18deg); }
          to { transform: translateX(220%) skewX(-18deg); }
        }
        @keyframes demo-energy {
          from { transform: translateX(-30%); opacity: 0; }
          20%, 80% { opacity: 0.8; }
          to { transform: translateX(130%); opacity: 0; }
        }
        .demo-grid-bg {
          background-image:
            linear-gradient(90deg, rgba(0, 163, 255, 0.08) 1px, transparent 1px),
            linear-gradient(180deg, rgba(0, 163, 255, 0.08) 1px, transparent 1px);
          background-size: 72px 72px;
          animation: demo-grid-flow 22s linear infinite;
          mask-image: radial-gradient(circle at center, black, transparent 78%);
        }
        .demo-particle {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 999px;
          background: #3AB8FF;
          box-shadow: 0 0 18px #00A3FF;
          animation: demo-drift 9s ease-in-out infinite;
        }
        .demo-premium-card,
        .demo-metric-card {
          position: relative;
          overflow: hidden;
          animation: demo-slide-up 0.55s ease both;
          box-shadow: 0 0 0 1px rgba(0, 163, 255, 0.08), 0 24px 90px rgba(0, 0, 0, 0.38);
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .demo-premium-card::before,
        .demo-metric-card::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.12) 38%, transparent 58%);
          transform: translateX(-120%) skewX(-18deg);
        }
        .demo-premium-card:hover,
        .demo-metric-card:hover {
          transform: translateY(-3px);
          border-color: rgba(0, 163, 255, 0.48);
          box-shadow: 0 0 42px rgba(0, 163, 255, 0.2), 0 24px 90px rgba(0, 0, 0, 0.42);
        }
        .demo-premium-card:hover::before,
        .demo-metric-card:hover::before {
          animation: demo-shine 0.9s ease;
        }
        .demo-gold-glow {
          box-shadow: 0 0 38px rgba(255, 184, 0, 0.2), inset 0 0 26px rgba(255, 184, 0, 0.08);
        }
        .demo-blue-glow {
          box-shadow: 0 0 38px rgba(0, 163, 255, 0.22), inset 0 0 26px rgba(0, 123, 255, 0.08);
        }
        .demo-count {
          animation: demo-slide-up 0.7s ease both;
        }
      `}</style>
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_17%_22%,rgba(0,163,255,0.32),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(255,184,0,0.18),transparent_26%),radial-gradient(circle_at_72%_78%,rgba(0,123,255,0.18),transparent_30%),linear-gradient(180deg,#050816_0%,#081120_48%,#0B1325_100%)]" />
        <div className="demo-grid-bg absolute inset-0" />
        <div className="absolute left-0 top-1/3 h-px w-full bg-gradient-to-r from-transparent via-[#00A3FF]/55 to-transparent opacity-60 [animation:demo-energy_7s_linear_infinite]" />
        <div className="absolute bottom-1/4 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#FFB800]/45 to-transparent opacity-50 [animation:demo-energy_9s_linear_infinite_1.8s]" />
        {[
          ["left-[4%] top-[16%]", "0s"],
          ["left-[24%] top-[78%]", "1.4s"],
          ["left-[46%] top-[18%]", "2.2s"],
          ["left-[68%] top-[70%]", "0.8s"],
          ["left-[88%] top-[35%]", "3s"],
          ["left-[12%] top-[55%]", "2.8s"],
        ].map(([position, delay]) => (
          <span key={position} className={`demo-particle ${position}`} style={{ animationDelay: delay }} />
        ))}
      </div>

      <section className="relative z-10 px-5 py-6 sm:px-8 lg:px-12">
        <nav className="demo-premium-card mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-[#00A3FF]/25 bg-[#050816]/70 px-4 py-3 shadow-[0_18px_70px_rgba(0,0,0,0.32)] backdrop-blur-2xl">
          <Link href="/" className="text-sm font-black tracking-[-0.02em] text-white">
            IAWEB
          </Link>
          <span className="rounded-full border border-cyan-200/15 bg-cyan-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-cyan-100">
            Growth Engine Demo
          </span>
        </nav>

        <div className="mx-auto grid max-w-7xl gap-8 py-12 lg:grid-cols-[0.92fr_1.08fr] lg:py-16">
          <div className="lg:sticky lg:top-6 lg:self-start">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#00A3FF]/35 bg-[#007BFF]/15 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-[#BFEAFF] shadow-[0_0_24px_rgba(0,163,255,0.18)]">
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

            <form onSubmit={handleSubmit} className="demo-premium-card mt-8 rounded-[26px] border border-[#00A3FF]/20 bg-[#050816]/75 p-5 shadow-[0_24px_100px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-6">
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
                className="demo-blue-glow mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#00A3FF]/50 bg-gradient-to-r from-[#007BFF] via-[#00A3FF] to-[#FFB800] px-6 py-4 text-sm font-black text-white shadow-[0_16px_60px_rgba(0,163,255,0.28)] transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#3AB8FF]/40"
              >
                Analisar Empresa
                <ArrowRight size={16} />
              </button>
            </form>

            {analysis ? (
              <section className="demo-premium-card mt-5 rounded-[26px] border border-[#00A3FF]/20 bg-[#050816]/75 p-5 backdrop-blur-2xl sm:p-6">
                <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-[#3AB8FF]">
                  <Gem size={16} />
                  Inteligencia do nicho
                </div>
                <div className="grid gap-3">
                  <div className="rounded-2xl border border-[#FFB800]/20 bg-[#FFB800]/[0.06] p-4">
                    <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#FFB800]">
                      <Flame size={14} />
                      Dor principal
                    </div>
                    <p className="text-sm leading-6 text-slate-200">{nicheInsight.pains[0]}</p>
                  </div>
                  <div className="rounded-2xl border border-[#00A3FF]/20 bg-[#00A3FF]/[0.06] p-4">
                    <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#3AB8FF]">
                      <Target size={14} />
                      Oportunidade
                    </div>
                    <p className="text-sm leading-6 text-slate-200">{nicheInsight.opportunities[0]}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                      <KeyRound size={14} />
                      Palavras-chave valiosas
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {nicheInsight.keywords.slice(0, 5).map((keyword) => (
                        <span key={keyword} className="rounded-full border border-[#00A3FF]/20 bg-[#00A3FF]/10 px-3 py-1 text-xs font-bold text-[#BFEAFF]">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            ) : null}
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

                <section className="demo-premium-card rounded-[26px] border border-[#00A3FF]/20 bg-[#050816]/75 p-5 backdrop-blur-2xl sm:p-6">
                  <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-sky-100">
                    <ClipboardList size={16} />
                    Diagnostico comercial
                  </div>
                  <p className="text-lg font-semibold leading-8 text-white">{analysis.diagnostico}</p>
                </section>

                <section className="demo-premium-card rounded-[26px] border border-[#00A3FF]/20 bg-[#050816]/75 p-5 backdrop-blur-2xl sm:p-6">
                  <div className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-cyan-100">
                    Oportunidades por nicho
                  </div>
                  <div className="grid gap-3 md:grid-cols-3">
                    {analysis.opportunities.map((opportunity) => (
                      <div key={opportunity} className="demo-premium-card rounded-2xl border border-[#00A3FF]/25 bg-[#00A3FF]/[0.07] p-4 text-sm font-semibold leading-6 text-cyan-50">
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

                <section className="demo-premium-card rounded-[26px] border border-[#00A3FF]/30 bg-[#050816]/80 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur-2xl sm:p-6">
                  <div className="mb-4 text-sm font-black uppercase tracking-[0.16em] text-[#3AB8FF]">
                    Impacto Financeiro
                  </div>
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    <FinanceMetric
                      label="Oportunidades perdidas/mes"
                      value={`${analysis.financeImpact.lostLeadsMonthly.min}-${analysis.financeImpact.lostLeadsMonthly.max} ${analysis.financeImpact.opportunityLabel}`}
                    />
                    <FinanceMetric
                      label="Ticket medio estimado"
                      value={`${formatEuro(analysis.financeImpact.averageTicket.min)}-${formatEuro(analysis.financeImpact.averageTicket.max)}`}
                    />
                    <FinanceMetric
                      label="Potencial nao capturado/mes"
                      value={`${formatEuro(analysis.financeImpact.lostRevenueMonthly.min)}-${formatEuro(analysis.financeImpact.lostRevenueMonthly.max)}`}
                    />
                    <FinanceMetric
                      label="Potencial nao capturado/ano"
                      value={`${formatEuro(analysis.financeImpact.lostRevenueAnnual.min)}-${formatEuro(analysis.financeImpact.lostRevenueAnnual.max)}`}
                    />
                    <FinanceMetric
                      label="ROI potencial"
                      value={`${analysis.financeImpact.potentialRoi.min}x-${analysis.financeImpact.potentialRoi.max}x`}
                    />
                    <FinanceMetric label="Payback estimado" value={analysis.financeImpact.estimatedPayback} />
                  </div>
                  <p className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-7 text-emerald-50/90">
                    {analysis.financeImpact.impactPhrase} Valores apresentados como estimativas conservadoras, sem garantia de resultado.
                  </p>
                </section>

                <section className="demo-premium-card rounded-[26px] border border-white/10 bg-[#050816]/75 p-5 backdrop-blur-2xl">
                  <div className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
                    <div className="rounded-[24px] border border-[#FFB800]/25 bg-[#FFB800]/[0.06] p-5">
                      <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-[#FFB800]">
                        <XCircle size={17} />
                        Antes
                      </div>
                      <p className="text-sm leading-7 text-slate-300">
                        Pedidos, marcacoes, reservas ou contratos chegam por canais dispersos, com seguimento manual e oportunidades nao capturadas.
                      </p>
                    </div>
                    <div className="demo-gold-glow flex h-12 w-12 items-center justify-center rounded-full border border-[#FFB800]/40 bg-[#FFB800]/15 text-[#FFB800]">
                      <MoveRight size={24} />
                    </div>
                    <div className="rounded-[24px] border border-[#00A3FF]/30 bg-[#00A3FF]/[0.07] p-5">
                      <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-[#3AB8FF]">
                        <CheckCircle2 size={17} />
                        Depois
                      </div>
                      <p className="text-sm leading-7 text-cyan-50">
                        A marca apresenta valor com clareza, capta contactos qualificados e conduz cada oportunidade para o proximo passo comercial.
                      </p>
                    </div>
                  </div>
                </section>

                <DemoRecommendedPlan packageName={analysis.packageName} recommendations={analysis.recommendations} />

                <section className="grid gap-3 md:grid-cols-3">
                  <button
                    type="button"
                    onClick={handleSaveLead}
                    disabled={savingLead}
                    className="demo-premium-card inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-emerald-300/25 bg-emerald-300/10 px-4 py-3 text-sm font-black text-emerald-100 transition hover:bg-emerald-300/15 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {savingLead ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                    Guardar Lead no CRM
                  </button>
                  <Link
                    href={`/simulador-site${futureParams ? `?${futureParams}` : ""}`}
                    className="demo-premium-card inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-[#00A3FF]/30 bg-[#00A3FF]/10 px-4 py-3 text-sm font-black text-cyan-100 transition hover:bg-cyan-300/15"
                  >
                    <ExternalLink size={16} />
                    Simular Novo Website
                  </Link>
                  <Link
                    href={`/proposta${futureParams ? `?${futureParams}` : ""}`}
                    className="demo-gold-glow inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-[#FFB800]/40 bg-gradient-to-r from-[#FFB800] to-[#D79B00] px-4 py-3 text-sm font-black text-[#050816] transition hover:-translate-y-0.5"
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
              <section className="demo-premium-card flex min-h-[34rem] flex-col justify-between rounded-[26px] border border-[#00A3FF]/20 bg-[#050816]/75 p-6 shadow-[0_24px_100px_rgba(0,0,0,0.34)] backdrop-blur-2xl">
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
                    <div key={String(title)} className="demo-premium-card rounded-2xl border border-white/10 bg-black/20 p-4">
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
