"use client"

import { useMemo, useState } from "react"
import { ArrowRight, Building2, Database, Loader2, Radar, Search, Send, Sparkles, Target, Zap } from "lucide-react"
import type { LucideIcon } from "lucide-react"

type Prospect = {
  id?: string
  empresa: string
  contacto?: string
  email?: string
  telefone?: string
  website?: string
  cidade?: string
  nicho: string
  score_digital: number
  opportunity_score: number
  priority_label: string
  problemas_detectados: string[]
  oportunidades: string[]
  impacto_financeiro: {
    lostRevenueMonthly?: { min?: number; max?: number }
    lostRevenueAnnual?: { min?: number; max?: number }
  }
  homepage_gerada: Record<string, unknown>
  score_projetado: number
  melhoria_prevista: number
  template_utilizado: string
  status: string
}

type ProspectorClientProps = {
  initialProspects: Prospect[]
  initialWarning?: string
}

const nicheOptions = ["", "construcao", "clinicas", "imobiliario", "restaurantes", "advocacia", "contabilidade"]
const priorityOptions = ["", "Critica", "Alta", "Media", "Baixa"]
const statusOptions = ["", "novo", "promovido_crm", "descartado"]

function formatEuro(value: number | undefined) {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value ?? 0)
}

function priorityClass(priority: string) {
  if (priority === "Critica") return "border-rose-300/30 bg-rose-300/10 text-rose-100"
  if (priority === "Alta") return "border-[#FFB800]/35 bg-[#FFB800]/10 text-[#FFE3A3]"
  if (priority === "Media") return "border-[#00A3FF]/30 bg-[#00A3FF]/10 text-[#BFEAFF]"
  return "border-white/10 bg-white/[0.04] text-slate-300"
}

export default function ProspectorClient({ initialProspects, initialWarning }: ProspectorClientProps) {
  const [prospects, setProspects] = useState<Prospect[]>(initialProspects)
  const [selected, setSelected] = useState<Prospect | null>(initialProspects[0] ?? null)
  const [nicho, setNicho] = useState("")
  const [cidade, setCidade] = useState("")
  const [priority, setPriority] = useState("")
  const [status, setStatus] = useState("")
  const [scoreMin, setScoreMin] = useState("0")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(initialWarning ?? "")

  const filteredProspects = useMemo(() => {
    return prospects
      .filter((prospect) => (!nicho ? true : prospect.nicho === nicho))
      .filter((prospect) => (!cidade ? true : (prospect.cidade ?? "").toLowerCase().includes(cidade.toLowerCase())))
      .filter((prospect) => (!priority ? true : prospect.priority_label === priority))
      .filter((prospect) => (!status ? true : prospect.status === status))
      .filter((prospect) => prospect.opportunity_score >= Number(scoreMin || 0))
      .sort((a, b) => b.opportunity_score - a.opportunity_score)
  }, [cidade, nicho, priority, prospects, scoreMin, status])
  const metrics: Array<[string, number, LucideIcon]> = [
    ["Prospects", prospects.length, Database],
    ["Criticas", prospects.filter((item) => item.priority_label === "Critica").length, Zap],
    ["Promovidos", prospects.filter((item) => item.status === "promovido_crm").length, Send],
    ["Score medio", Math.round(prospects.reduce((sum, item) => sum + item.opportunity_score, 0) / Math.max(1, prospects.length)), Target],
  ]
  const topCities = Object.entries(
    filteredProspects.reduce<Record<string, number>>((acc, prospect) => {
      const city = prospect.cidade || "Sem cidade"
      acc[city] = (acc[city] ?? 0) + 1
      return acc
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
  const topProspects = filteredProspects.slice(0, 6)
  const radarScore = Math.round(filteredProspects.reduce((sum, item) => sum + item.opportunity_score, 0) / Math.max(1, filteredProspects.length))

  async function generateProspects() {
    setLoading(true)
    setMessage("")
    const response = await fetch("/api/prospector/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nicho: nicho || undefined, cidade: cidade || undefined, limit: 30, scoreMin: Number(scoreMin || 0) }),
    })
    const data = await response.json()
    setProspects(data.prospects ?? [])
    setSelected(data.prospects?.[0] ?? null)
    setMessage(data.warning ?? (response.ok ? "Prospects gerados com sucesso." : data.error ?? "Erro ao gerar prospects."))
    setLoading(false)
  }

  async function promoteToCrm(prospect: Prospect) {
    if (!prospect.id) {
      setMessage("Este prospect ainda nao esta gravado no Supabase. Gere prospects com Supabase ativo antes de promover.")
      return
    }

    setMessage("A promover prospect para CRM...")
    const response = await fetch("/api/prospector/promote-to-crm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: prospect.id }),
    })
    const data = await response.json()

    if (!response.ok) {
      setMessage(data.error ?? "Nao foi possivel promover para CRM.")
      return
    }

    setProspects((current) => current.map((item) => (item.id === prospect.id ? { ...item, status: "promovido_crm" } : item)))
    setSelected((current) => (current && current.id === prospect.id ? { ...current, status: "promovido_crm" } : current))
    setMessage("Prospect promovido para CRM com mensagens comerciais preparadas.")
  }

  return (
    <main className="iaweb-cinematic-shell px-4 py-8 sm:px-6 lg:px-8">
      <div className="iaweb-cinematic-bg">
        <div className="iaweb-cinematic-grid" />
        <div className="iaweb-lightning top-[16%] left-[-10%]" />
        <div className="iaweb-lightning" />
        <div className="iaweb-lightning" />
        <div className="iaweb-lightning-field" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-[96rem] gap-6">
        <header className="iaweb-premium-card rounded-2xl p-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#00A3FF]/30 bg-[#007BFF]/15 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[#BFEAFF]">
            <Radar size={14} />
            Prospector IA
          </p>
          <h1 className="iaweb-hero-title mt-4 text-4xl font-black text-white md:text-6xl">
            Radar <span className="iaweb-glow-text">Comercial IA</span>
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
            Ranking de oportunidades comerciais simuladas. Sem scraping real, sem envio automatico.
          </p>
        </header>

        <section className="grid gap-3 md:grid-cols-4">
          {metrics.map(([label, value, Icon]) => (
            <div key={label} className="iaweb-premium-card rounded-2xl p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">{String(label)}</p>
                <Icon size={19} className="text-[#3AB8FF]" />
              </div>
              <p className="mt-3 text-4xl font-black tracking-[-0.05em] text-white">{value}</p>
            </div>
          ))}
        </section>

        <section className="iaweb-premium-card rounded-2xl p-4">
          <div className="grid gap-3 lg:grid-cols-[180px_1fr_160px_160px_140px_auto]">
            <select value={nicho} onChange={(event) => setNicho(event.target.value)} className="h-11 rounded-xl border border-white/10 bg-[#081120] px-3 text-sm text-white outline-none">
              {nicheOptions.map((option) => (
                <option key={option || "todos"} value={option}>
                  {option || "Todos nichos"}
                </option>
              ))}
            </select>
            <input value={cidade} onChange={(event) => setCidade(event.target.value)} placeholder="Cidade" className="h-11 rounded-xl border border-white/10 bg-[#081120] px-3 text-sm text-white outline-none" />
            <select value={priority} onChange={(event) => setPriority(event.target.value)} className="h-11 rounded-xl border border-white/10 bg-[#081120] px-3 text-sm text-white outline-none">
              {priorityOptions.map((option) => (
                <option key={option || "todas"} value={option}>
                  {option || "Prioridade"}
                </option>
              ))}
            </select>
            <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-11 rounded-xl border border-white/10 bg-[#081120] px-3 text-sm text-white outline-none">
              {statusOptions.map((option) => (
                <option key={option || "todos"} value={option}>
                  {option || "Status"}
                </option>
              ))}
            </select>
            <input value={scoreMin} onChange={(event) => setScoreMin(event.target.value)} type="number" min="0" max="100" className="h-11 rounded-xl border border-white/10 bg-[#081120] px-3 text-sm text-white outline-none" />
            <button onClick={generateProspects} disabled={loading} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#007BFF] via-[#00A3FF] to-[#FFB800] px-4 text-sm font-black text-white shadow-[0_0_30px_rgba(0,163,255,0.28)] disabled:opacity-60">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              Gerar Prospects
            </button>
          </div>
          {message ? <p className="mt-3 rounded-xl border border-[#FFB800]/20 bg-[#FFB800]/10 px-4 py-3 text-sm text-[#FFE3A3]">{message}</p> : null}
        </section>

        <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr_0.9fr]">
          <div className="iaweb-premium-card rounded-2xl p-5">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#3AB8FF]">
              <Radar size={15} />
              Score radar
            </p>
            <div className="mt-6 flex items-center gap-5">
              <div className="iaweb-orbit grid size-28 place-items-center">
                <span className="text-4xl font-black text-white">{radarScore}</span>
              </div>
              <div>
                <p className="text-sm leading-6 text-slate-400">Media das oportunidades filtradas. Quanto maior, maior urgencia comercial.</p>
                <p className="mt-3 text-xs font-black uppercase tracking-[0.16em] text-[#FFB800]">{filteredProspects.length} sinais ativos</p>
              </div>
            </div>
          </div>

          <div className="iaweb-premium-card rounded-2xl p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#FFB800]">Mapa de oportunidades</p>
            <div className="mt-5 grid grid-cols-6 gap-2">
              {topCities.map(([city, count], index) => (
                <div
                  key={city}
                  className="rounded-2xl border border-[#00A3FF]/20 bg-[#00A3FF]/10 p-3 text-center shadow-[0_0_28px_rgba(0,163,255,0.12)]"
                  style={{ transform: `translateY(${index % 2 ? 12 : 0}px)` }}
                >
                  <p className="text-2xl font-black text-white">{count}</p>
                  <p className="mt-1 truncate text-[10px] uppercase tracking-[0.12em] text-slate-400">{city}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="iaweb-premium-card rounded-2xl p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#3AB8FF]">Risco / oportunidade</p>
            <div className="mt-5 space-y-3">
              {topProspects.slice(0, 4).map((prospect) => (
                <div key={prospect.id ?? prospect.email ?? prospect.empresa}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{prospect.empresa}</span>
                    <span className="text-[#FFB800]">{prospect.opportunity_score}/100</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#00A3FF] to-[#FFB800]" style={{ width: `${prospect.opportunity_score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="iaweb-premium-card rounded-2xl p-4">
            <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-slate-500">
              <Search size={16} />
              Ranking de oportunidades
            </div>
            <div className="space-y-3">
              {filteredProspects.map((prospect) => (
                <article key={prospect.id ?? prospect.email} onClick={() => setSelected(prospect)} className="cursor-pointer rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:-translate-y-1 hover:border-[#00A3FF]/50 hover:bg-[#00A3FF]/[0.055] hover:shadow-[0_0_42px_rgba(0,163,255,0.16)]">
                  <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                    <div>
                      <h2 className="text-lg font-black text-white">{prospect.empresa}</h2>
                      <p className="mt-1 text-sm text-slate-500">{prospect.nicho} - {prospect.cidade} - {prospect.website || "sem website"}</p>
                    </div>
                    <span className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.12em] ${priorityClass(prospect.priority_label)}`}>
                      {prospect.priority_label}
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-5">
                    <Metric label="Digital" value={`${prospect.score_digital}/100`} />
                    <Metric label="Opportunity" value={`${prospect.opportunity_score}/100`} />
                    <Metric label="Mensal" value={formatEuro(prospect.impacto_financeiro?.lostRevenueMonthly?.max)} />
                    <Metric label="Anual" value={formatEuro(prospect.impacto_financeiro?.lostRevenueAnnual?.max)} />
                    <Metric label="Projetado" value={`${prospect.score_projetado}/100`} />
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="iaweb-premium-card rounded-2xl p-5">
            {selected ? (
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#3AB8FF]">Detalhes</p>
                <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-white">{selected.empresa}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">{selected.problemas_detectados?.[0] ?? "Problema principal a validar."}</p>
                <div className="mt-5 grid gap-3">
                  <Metric label="Score digital" value={`${selected.score_digital}/100`} />
                  <Metric label="Opportunity score" value={`${selected.opportunity_score}/100`} />
                  <Metric label="Melhoria prevista" value={`+${selected.melhoria_prevista} pontos`} />
                  <Metric label="Template" value={selected.template_utilizado || "--"} />
                </div>
                <div className="mt-5 space-y-2">
                  {selected.oportunidades?.slice(0, 3).map((item) => (
                    <div key={item} className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm leading-6 text-slate-300">
                      {item}
                    </div>
                  ))}
                </div>
                <div className="mt-5 grid gap-3">
                  <button type="button" onClick={() => promoteToCrm(selected)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#007BFF] to-[#FFB800] px-4 text-sm font-black text-white shadow-[0_0_28px_rgba(255,184,0,0.18)]">
                    Promover para CRM
                    <ArrowRight size={16} />
                  </button>
                  <button type="button" onClick={() => setMessage("Abordagem comercial preparada no motor. Promova para CRM para persistir mensagens.")} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#00A3FF]/30 bg-[#00A3FF]/10 px-4 text-sm font-black text-[#BFEAFF]">
                    Gerar abordagem comercial
                    <Send size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex min-h-96 flex-col items-center justify-center text-center text-slate-500">
                <Building2 size={34} />
                <p className="mt-3 text-sm">Selecione um prospect para ver detalhes.</p>
              </div>
            )}
          </aside>
        </section>
      </div>
    </main>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.035] p-3">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-black text-white">{value}</p>
    </div>
  )
}
