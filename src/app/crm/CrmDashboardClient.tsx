"use client"

import { DragEvent, useMemo, useState } from "react"
import {
  Activity,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Copy,
  LayoutDashboard,
  Mail,
  MessageCircle,
  Search,
  SlidersHorizontal,
  Sparkles,
  Target,
  X,
} from "lucide-react"
import type { CrmLead, CrmSortDirection, CrmSortField, CrmStatus } from "@/lib/crm"
import { crmStatuses, getCrmStatusLabel } from "@/lib/crm"

type CrmDashboardClientProps = {
  initialLeads: CrmLead[]
  authEnabled?: boolean
}

type StatusFilter = "todos" | CrmStatus
type SortOption = `${CrmSortField}:${CrmSortDirection}`

const allStatuses = ["todos", ...crmStatuses] as const

const sortOptions: Array<{ value: SortOption; label: string }> = [
  { value: "created_at:desc", label: "Mais recentes" },
  { value: "created_at:asc", label: "Mais antigos" },
  { value: "score_geral:desc", label: "Score maior" },
  { value: "score_geral:asc", label: "Score menor" },
]

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-PT", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value))
}

function formatEuro(value: number) {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value)
}

function includesSearch(lead: CrmLead, search: string) {
  const value = search.trim().toLowerCase()

  if (!value) return true

  return [lead.empresa, lead.email, lead.telefone, lead.setor, lead.plano_recomendado].some((field) =>
    (field || "").toLowerCase().includes(value),
  )
}

function getLeadPotential(lead: CrmLead) {
  if (lead.perda_mensal_estimada > 0) return lead.perda_mensal_estimada

  const impact = lead.impacto_financeiro as { lostRevenueMonthly?: { min?: number; max?: number } } | null
  return impact?.lostRevenueMonthly?.max ?? 0
}

function getPriority(lead: CrmLead) {
  const potential = getLeadPotential(lead)

  if (lead.score_geral >= 70 || potential >= 15000) {
    return {
      label: "Alta",
      className: "border-emerald-300/30 bg-emerald-300/10 text-emerald-100",
    }
  }

  if (lead.score_geral >= 45 || potential >= 5000) {
    return {
      label: "Media",
      className: "border-[#FFB800]/35 bg-[#FFB800]/10 text-[#FFE3A3]",
    }
  }

  return {
    label: "Nutrir",
    className: "border-white/10 bg-white/[0.04] text-slate-300",
  }
}

function getStatusGlow(status: string) {
  if (status === "fechado") return "border-emerald-300/30 bg-emerald-300/[0.06]"
  if (status === "perdido") return "border-rose-300/25 bg-rose-300/[0.05]"
  if (status === "proposta" || status === "negociacao") return "border-[#FFB800]/30 bg-[#FFB800]/[0.06]"
  return "border-[#00A3FF]/22 bg-[#00A3FF]/[0.045]"
}

function formatObjectionKey(value: string) {
  const labels: Record<string, string> = {
    nao_tenho_interesse_agora: "Nao tenho interesse agora",
    ja_tenho_site: "Ja tenho site",
    esta_caro: "Esta caro",
    tenho_alguem: "Tenho alguem",
    depois_vejo: "Depois vejo",
    nao_acredito: "Nao acredito",
  }

  return labels[value] ?? value.replaceAll("_", " ")
}

function CommercialMessageCard({
  title,
  message,
  copied,
  icon,
  onCopy,
}: {
  title: string
  message: string | null | undefined
  copied: boolean
  icon: "whatsapp" | "email" | "followup"
  onCopy: () => void
}) {
  const Icon = icon === "email" ? Mail : icon === "followup" ? Clock3 : MessageCircle

  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-2">
          <Icon size={16} className="mt-0.5 shrink-0 text-[#3AB8FF]" />
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">{title}</p>
            <p className="mt-2 line-clamp-4 text-xs leading-5 text-slate-300">{message || "Mensagem ainda nao gerada."}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onCopy}
          disabled={!message}
          className="shrink-0 rounded-lg border border-[#00A3FF]/25 bg-[#00A3FF]/10 px-2 py-1 text-xs font-bold text-[#BFEAFF] transition hover:bg-[#00A3FF]/15 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {copied ? "Copiado" : "Copiar"}
        </button>
      </div>
    </div>
  )
}

export function CrmDashboardClient({ initialLeads, authEnabled = false }: CrmDashboardClientProps) {
  const [leads, setLeads] = useState(initialLeads)
  const [filter, setFilter] = useState<StatusFilter>("todos")
  const [nicheFilter, setNicheFilter] = useState("todos")
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState<SortOption>("created_at:desc")
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)
  const [noteDraft, setNoteDraft] = useState("")
  const [error, setError] = useState<string | null>(null)

  const selectedLead = useMemo(() => leads.find((lead) => lead.id === selectedLeadId) ?? null, [leads, selectedLeadId])

  const niches = useMemo(() => {
    return Array.from(new Set(leads.map((lead) => lead.setor).filter(Boolean))).sort()
  }, [leads])

  const metrics = useMemo(() => {
    const total = leads.length
    const propostas = leads.filter((lead) => lead.status === "proposta" || lead.status === "negociacao").length
    const fechados = leads.filter((lead) => lead.status === "fechado").length
    const valorPotencial = leads.reduce((sum, lead) => sum + getLeadPotential(lead), 0)

    return { total, propostas, fechados, valorPotencial }
  }, [leads])

  const filteredLeads = useMemo(() => {
    const [sortField, direction] = sort.split(":") as [CrmSortField, CrmSortDirection]

    return [
      ...leads
        .filter((lead) => filter === "todos" || lead.status === filter)
        .filter((lead) => nicheFilter === "todos" || lead.setor === nicheFilter)
        .filter((lead) => includesSearch(lead, search)),
    ].sort((a, b) => {
      const directionMultiplier = direction === "asc" ? 1 : -1

      if (sortField === "score_geral") {
        return (a.score_geral - b.score_geral) * directionMultiplier
      }

      return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) * directionMultiplier
    })
  }, [filter, leads, nicheFilter, search, sort])

  const columns = useMemo(() => {
    return crmStatuses.map((status) => ({
      status,
      leads: filteredLeads.filter((lead) => lead.status === status),
      value: filteredLeads.filter((lead) => lead.status === status).reduce((sum, lead) => sum + getLeadPotential(lead), 0),
    }))
  }, [filteredLeads])
  const criticalLeads = useMemo(
    () =>
      [...leads]
        .filter((lead) => lead.score_geral <= 45 || getLeadPotential(lead) >= 15000)
        .sort((a, b) => getLeadPotential(b) - getLeadPotential(a))
        .slice(0, 4),
    [leads],
  )

  async function patchLead(id: string, payload: { status?: CrmStatus; notas?: string; proxima_acao?: string }) {
    setUpdatingId(id)
    setError(null)

    try {
      const response = await fetch(`/api/crm/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = (await response.json()) as { error?: string }

      if (!response.ok) {
        throw new Error(result.error || "Nao foi possivel atualizar a lead.")
      }

      setLeads((current) =>
        current.map((lead) =>
          lead.id === id
            ? {
                ...lead,
                ...payload,
                updated_at: new Date().toISOString(),
              }
            : lead,
        ),
      )
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Nao foi possivel atualizar a lead.")
    } finally {
      setUpdatingId(null)
    }
  }

  function handleDrop(event: DragEvent<HTMLElement>, status: CrmStatus) {
    event.preventDefault()
    const id = event.dataTransfer.getData("text/plain") || draggedId
    const lead = leads.find((item) => item.id === id)

    setDraggedId(null)

    if (!id || !lead || lead.status === status) return

    setLeads((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
              updated_at: new Date().toISOString(),
            }
          : item,
      ),
    )
    void patchLead(id, { status })
  }

  async function copyWhatsAppMessage(lead: CrmLead) {
    if (!lead.whatsapp_message) {
      setError("Esta lead ainda nao tem mensagem de WhatsApp preparada.")
      return
    }

    await copyCommercialMessage(`${lead.id}:whatsapp`, lead.whatsapp_message)
  }

  async function copyCommercialMessage(key: string, message: string | null | undefined) {
    if (!message) {
      setError("Esta mensagem ainda nao foi gerada para a lead.")
      return
    }

    try {
      await navigator.clipboard.writeText(message)
      setCopiedId(key)
      setError(null)
      window.setTimeout(() => setCopiedId(null), 1800)
    } catch {
      setError("Nao foi possivel copiar a mensagem para o clipboard.")
    }
  }

  async function saveNote(lead: CrmLead) {
    const note = noteDraft.trim()

    if (!note) return

    const nextNotes = [lead.notas, `${new Date().toLocaleString("pt-PT")} - ${note}`].filter(Boolean).join("\n")
    await patchLead(lead.id, { notas: nextNotes })
    setNoteDraft("")
  }

  async function logout() {
    await fetch("/api/crm/auth/logout", { method: "POST" })
    window.location.href = "/crm/login"
  }

  return (
    <div className="iaweb-cinematic-shell px-4 py-8 sm:px-6 lg:px-8">
      <div className="iaweb-cinematic-bg">
        <div className="iaweb-cinematic-grid" />
        <div className="iaweb-lightning top-[16%] left-[-10%]" />
        <div className="iaweb-lightning" />
        <div className="iaweb-lightning" />
        <div className="iaweb-lightning-field" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[96rem] flex-col gap-6">
        <header className="iaweb-premium-card flex flex-col justify-between gap-4 rounded-2xl p-5 md:flex-row md:items-end">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#00A3FF]/30 bg-[#007BFF]/15 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[#BFEAFF]">
              <LayoutDashboard size={14} />
              IAWEB CRM
            </p>
            <h1 className="iaweb-hero-title mt-4 text-3xl font-black text-white md:text-5xl">
              Command <span className="iaweb-glow-text">Center</span>
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Pipeline visual com drag & drop, atualizacao imediata no Supabase e detalhes comerciais em drawer lateral.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-300">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Acesso</p>
            <div className="mt-1 flex items-center gap-3">
              <p className="text-slate-200">{authEnabled ? "Sessao autenticada" : "Aberto em desenvolvimento"}</p>
              {authEnabled ? (
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-md border border-white/10 px-2.5 py-1 text-xs text-slate-300 transition hover:border-white/20 hover:bg-white/[0.06]"
                >
                  Sair
                </button>
              ) : null}
            </div>
          </div>
        </header>

        <section className="grid gap-3 md:grid-cols-4">
          {[
            { label: "Leads totais", value: String(metrics.total), icon: Target },
            { label: "Propostas", value: String(metrics.propostas), icon: Sparkles },
            { label: "Valor potencial", value: formatEuro(metrics.valorPotencial), icon: CircleDollarSign },
            { label: "Fechados", value: String(metrics.fechados), icon: CheckCircle2 },
          ].map((metric) => {
            const Icon = metric.icon

            return (
              <div key={metric.label} className="iaweb-premium-card rounded-2xl px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">{metric.label}</p>
                  <Icon size={18} className="text-[#3AB8FF]" />
                </div>
                <p className="mt-2 text-3xl font-black tracking-[-0.04em] text-white">{metric.value}</p>
              </div>
            )
          })}
        </section>

        <section className="iaweb-premium-card rounded-2xl p-4">
          <div className="grid gap-3 lg:grid-cols-[minmax(240px,1fr)_180px_220px]">
            <label className="flex flex-col gap-2 text-sm text-slate-300">
              <span className="flex items-center gap-2">
                <Search size={15} className="text-[#3AB8FF]" />
                Pesquisar
              </span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Empresa, email, telefone, nicho..."
                className="h-11 rounded-xl border border-white/10 bg-[#081120] px-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-[#00A3FF]"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-slate-300">
              Nicho
              <select
                value={nicheFilter}
                onChange={(event) => setNicheFilter(event.target.value)}
                className="h-11 rounded-xl border border-white/10 bg-[#081120] px-3 text-sm text-white outline-none transition focus:border-[#00A3FF]"
              >
                <option value="todos">Todos</option>
                {niches.map((niche) => (
                  <option key={niche} value={niche}>
                    {niche}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm text-slate-300">
              <span className="flex items-center gap-2">
                <SlidersHorizontal size={15} className="text-[#FFB800]" />
                Ordenar
              </span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortOption)}
                className="h-11 rounded-xl border border-white/10 bg-[#081120] px-3 text-sm text-white outline-none transition focus:border-[#00A3FF]"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {allStatuses.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilter(status)}
                className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                  filter === status
                    ? "border-[#00A3FF] bg-[#00A3FF]/15 text-[#BFEAFF] shadow-[0_0_24px_rgba(0,163,255,0.16)]"
                    : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20 hover:bg-white/[0.06]"
                }`}
              >
                {status === "todos" ? "Todos" : getCrmStatusLabel(status)}
              </button>
            ))}
          </div>

          {error ? (
            <div className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
              {error}
            </div>
          ) : null}
        </section>

        <section className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
          <div className="iaweb-premium-card rounded-2xl p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#FFB800]">Leads criticas</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {criticalLeads.map((lead) => (
                <button
                  type="button"
                  key={lead.id}
                  onClick={() => setSelectedLeadId(lead.id)}
                  className="rounded-2xl border border-[#FFB800]/20 bg-[#FFB800]/10 p-4 text-left transition hover:-translate-y-1 hover:border-[#FFB800]/45 hover:shadow-[0_0_34px_rgba(255,184,0,0.16)]"
                >
                  <p className="text-sm font-black text-white">{lead.empresa}</p>
                  <p className="mt-1 text-xs text-slate-400">{lead.setor} - score {lead.score_geral}/100</p>
                  <p className="mt-3 text-xl font-black text-[#FFB800]">{formatEuro(getLeadPotential(lead))}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="iaweb-premium-card rounded-2xl p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#3AB8FF]">Valor potencial por coluna</p>
            <div className="mt-5 grid grid-cols-8 gap-2">
              {columns.map((column) => {
                const maxValue = Math.max(1, ...columns.map((item) => item.value))
                return (
                  <div key={column.status} className="flex min-h-40 flex-col justify-end gap-2">
                    <div
                      className="rounded-t-xl border border-[#00A3FF]/25 bg-gradient-to-t from-[#007BFF] to-[#FFB800] shadow-[0_0_24px_rgba(0,163,255,0.18)]"
                      style={{ height: `${Math.max(18, (column.value / maxValue) * 140)}px` }}
                    />
                    <p className="truncate text-center text-[10px] uppercase tracking-[0.1em] text-slate-500">{getCrmStatusLabel(column.status)}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="overflow-x-auto pb-4">
          <div className="grid min-w-[1400px] grid-cols-8 gap-4">
            {columns.map((column) => (
              <section
                key={column.status}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => handleDrop(event, column.status)}
                className={`iaweb-premium-card min-h-[34rem] rounded-2xl p-3 ${getStatusGlow(column.status)}`}
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-black uppercase tracking-[0.14em] text-white">{getCrmStatusLabel(column.status)}</h2>
                    <p className="mt-1 text-xs text-slate-500">{column.leads.length} leads - {formatEuro(column.value)}</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.05] px-2 py-1 text-xs text-slate-300">
                    {column.leads.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {column.leads.map((lead) => {
                    const priority = getPriority(lead)

                    return (
                      <article
                        key={lead.id}
                        draggable
                        onDragStart={(event) => {
                          event.dataTransfer.setData("text/plain", lead.id)
                          setDraggedId(lead.id)
                        }}
                        onDragEnd={() => setDraggedId(null)}
                        onClick={() => {
                          setSelectedLeadId(lead.id)
                          setNoteDraft("")
                        }}
                        className={`cursor-grab rounded-2xl border border-white/10 bg-[#050816]/85 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] transition hover:-translate-y-1 hover:border-[#00A3FF]/45 hover:shadow-[0_0_38px_rgba(0,163,255,0.16)] active:cursor-grabbing ${
                          draggedId === lead.id ? "opacity-50" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="line-clamp-2 text-sm font-black leading-5 text-white">{lead.empresa || "Empresa sem nome"}</h3>
                            <p className="mt-1 text-xs text-slate-500">{lead.setor || "sem nicho"}</p>
                          </div>
                          <span className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${priority.className}`}>
                            {priority.label}
                          </span>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                          <div className="rounded-xl border border-[#00A3FF]/20 bg-[#00A3FF]/10 p-2">
                            <p className="text-slate-500">Score</p>
                            <p className="mt-1 font-black text-white">{lead.score_geral}/100</p>
                          </div>
                          <div className="rounded-xl border border-[#FFB800]/20 bg-[#FFB800]/10 p-2">
                            <p className="text-slate-500">Potencial</p>
                            <p className="mt-1 font-black text-white">{formatEuro(getLeadPotential(lead))}</p>
                          </div>
                        </div>

                        <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-400">{lead.plano_recomendado || lead.objetivo || "Plano a definir"}</p>

                        <div className="mt-3 flex items-center justify-between gap-2 text-[11px] text-slate-500">
                          <span className="inline-flex items-center gap-1">
                            <Clock3 size={12} />
                            {formatDate(lead.updated_at || lead.created_at)}
                          </span>
                          {updatingId === lead.id ? <span className="text-[#3AB8FF]">a gravar...</span> : null}
                        </div>
                      </article>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
        </section>

        {filteredLeads.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-6 py-12 text-center text-sm text-slate-400">
            Nao ha leads para os filtros selecionados.
          </div>
        ) : null}
      </div>

      {selectedLead ? (
        <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col border-l border-[#00A3FF]/20 bg-[#050816]/95 p-5 text-white shadow-[-28px_0_90px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
          <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#3AB8FF]">Detalhe do lead</p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">{selectedLead.empresa || "Empresa sem nome"}</h2>
              <p className="mt-1 text-sm text-slate-400">{selectedLead.setor || "sem nicho"} - {selectedLead.origem || "origem indefinida"}</p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedLeadId(null)}
              className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-slate-300 transition hover:bg-white/[0.08]"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto py-5">
            <section className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#00A3FF]/20 bg-[#00A3FF]/10 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Score</p>
                <p className="mt-2 text-2xl font-black">{selectedLead.score_geral}/100</p>
              </div>
              <div className="rounded-2xl border border-[#FFB800]/20 bg-[#FFB800]/10 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Potencial</p>
                <p className="mt-2 text-2xl font-black">{formatEuro(getLeadPotential(selectedLead))}</p>
              </div>
              <div className={`rounded-2xl border p-4 ${getPriority(selectedLead).className}`}>
                <p className="text-xs uppercase tracking-[0.16em] opacity-70">Prioridade</p>
                <p className="mt-2 text-2xl font-black">{getPriority(selectedLead).label}</p>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-500">Pipeline</p>
              <select
                value={crmStatuses.includes(selectedLead.status as CrmStatus) ? selectedLead.status : "novo"}
                onChange={(event) => patchLead(selectedLead.id, { status: event.target.value as CrmStatus })}
                className="h-11 w-full rounded-xl border border-white/10 bg-[#081120] px-3 text-sm text-white outline-none transition focus:border-[#00A3FF]"
              >
                {crmStatuses.map((status) => (
                  <option key={status} value={status}>
                    {getCrmStatusLabel(status)}
                  </option>
                ))}
              </select>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-slate-300">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-500">Dados principais</p>
              <p>{selectedLead.nome_contacto || "Sem contacto"}</p>
              <p>{selectedLead.email || "Sem email"}</p>
              <p>{selectedLead.telefone || "Sem telefone"}</p>
              {selectedLead.website ? (
                <a className="text-[#3AB8FF] hover:text-white" href={selectedLead.website} target="_blank" rel="noreferrer">
                  {selectedLead.website}
                </a>
              ) : null}
              <p className="mt-3 text-slate-400">{selectedLead.objetivo || "Sem objetivo indicado"}</p>
              <p className="mt-2 font-semibold text-white">{selectedLead.plano_recomendado || "Plano a definir"}</p>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-500">Diagnostico</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  ["Website", selectedLead.score_website],
                  ["Google", selectedLead.score_google],
                  ["Conversao", selectedLead.score_conversao],
                  ["CRM", selectedLead.score_crm],
                  ["Automacao", selectedLead.score_automacao],
                ].map(([label, score]) => (
                  <div key={String(label)} className="rounded-xl border border-white/10 bg-black/20 p-3">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{String(label)}</span>
                      <span>{Number(score)}/100</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#007BFF] to-[#FFB800]" style={{ width: `${Number(score)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-[#00A3FF]/20 bg-[#00A3FF]/[0.045] p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#BFEAFF]">Transformacao projetada</p>
                <span className="rounded-full border border-[#FFB800]/25 bg-[#FFB800]/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#FFB800]">
                  {selectedLead.template_utilizado || "template"}
                </span>
              </div>
              <div className="grid gap-2 sm:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <p className="text-xs text-slate-500">Score atual</p>
                  <p className="mt-1 text-xl font-black text-white">{selectedLead.score_geral}/100</p>
                </div>
                <div className="rounded-xl border border-[#00A3FF]/20 bg-[#00A3FF]/10 p-3">
                  <p className="text-xs text-slate-500">Score projetado</p>
                  <p className="mt-1 text-xl font-black text-white">{selectedLead.score_projetado || "--"}/100</p>
                </div>
                <div className="rounded-xl border border-[#FFB800]/20 bg-[#FFB800]/10 p-3">
                  <p className="text-xs text-slate-500">Melhoria</p>
                  <p className="mt-1 text-xl font-black text-white">+{selectedLead.melhoria_prevista || 0} pts</p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-[#FFB800]/20 bg-[#FFB800]/[0.045] p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#FFB800]">Agente Comercial</p>
                  <p className="mt-1 text-xs text-slate-500">Mensagens geradas. Nada e enviado automaticamente.</p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.05] px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-slate-300">
                  {selectedLead.sales_agent_status || "pendente"}
                </span>
              </div>

              <div className="space-y-3">
                <CommercialMessageCard
                  title="WhatsApp inicial"
                  icon="whatsapp"
                  message={selectedLead.whatsapp_message}
                  copied={copiedId === `${selectedLead.id}:whatsapp`}
                  onCopy={() => copyCommercialMessage(`${selectedLead.id}:whatsapp`, selectedLead.whatsapp_message)}
                />
                <CommercialMessageCard
                  title={selectedLead.email_subject ? `Email: ${selectedLead.email_subject}` : "Email inicial"}
                  icon="email"
                  message={selectedLead.email_body}
                  copied={copiedId === `${selectedLead.id}:email`}
                  onCopy={() =>
                    copyCommercialMessage(
                      `${selectedLead.id}:email`,
                      [selectedLead.email_subject ? `Assunto: ${selectedLead.email_subject}` : "", selectedLead.email_body].filter(Boolean).join("\n\n"),
                    )
                  }
                />
                <div className="grid gap-3">
                  {([
                    ["Follow-up 3 dias", selectedLead.followup_3d, "followup3"],
                    ["Follow-up 7 dias", selectedLead.followup_7d, "followup7"],
                    ["Follow-up 15 dias", selectedLead.followup_15d, "followup15"],
                  ] as Array<[string, string | null, string]>).map(([title, message, key]) => (
                    <CommercialMessageCard
                      key={key}
                      title={title}
                      icon="followup"
                      message={message}
                      copied={copiedId === `${selectedLead.id}:${key}`}
                      onCopy={() => copyCommercialMessage(`${selectedLead.id}:${key}`, message)}
                    />
                  ))}
                </div>

                <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-500">Objecoes</p>
                  <div className="space-y-2">
                    {Object.entries(selectedLead.objection_responses ?? {}).map(([key, message]) => (
                      <div key={key} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">{formatObjectionKey(key)}</p>
                          <button
                            type="button"
                            onClick={() => copyCommercialMessage(`${selectedLead.id}:objection:${key}`, message)}
                            className="rounded-lg border border-white/10 px-2 py-1 text-xs font-bold text-slate-300 transition hover:bg-white/[0.06]"
                          >
                            {copiedId === `${selectedLead.id}:objection:${key}` ? "Copiado" : "Copiar"}
                          </button>
                        </div>
                        <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-400">{message}</p>
                      </div>
                    ))}
                    {Object.keys(selectedLead.objection_responses ?? {}).length === 0 ? (
                      <p className="text-sm text-slate-500">Sem respostas a objecoes geradas.</p>
                    ) : null}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-500">Timeline comercial</p>
              <div className="space-y-3">
                <div className="flex gap-3 text-sm text-slate-300">
                  <Activity size={16} className="mt-0.5 shrink-0 text-[#3AB8FF]" />
                  <span>Lead criado em {formatDate(selectedLead.created_at)}.</span>
                </div>
                <div className="flex gap-3 text-sm text-slate-300">
                  <ArrowRight size={16} className="mt-0.5 shrink-0 text-[#FFB800]" />
                  <span>Status atual: {getCrmStatusLabel(selectedLead.status)}.</span>
                </div>
                <div className="flex gap-3 text-sm text-slate-300">
                  <CalendarClock size={16} className="mt-0.5 shrink-0 text-emerald-300" />
                  <span>Ultima atualizacao: {formatDate(selectedLead.updated_at || selectedLead.created_at)}.</span>
                </div>
                {selectedLead.notas
                  .split("\n")
                  .filter(Boolean)
                  .slice(-4)
                  .map((note) => (
                    <div key={note} className="flex gap-3 text-sm text-slate-300">
                      <MessageCircle size={16} className="mt-0.5 shrink-0 text-slate-400" />
                      <span>{note}</span>
                    </div>
                  ))}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <label className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Proxima acao</label>
              <input
                value={selectedLead.proxima_acao || ""}
                onChange={(event) =>
                  setLeads((current) =>
                    current.map((item) => (item.id === selectedLead.id ? { ...item, proxima_acao: event.target.value } : item)),
                  )
                }
                onBlur={(event) => patchLead(selectedLead.id, { proxima_acao: event.target.value })}
                className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-[#081120] px-3 text-sm text-white outline-none transition focus:border-[#00A3FF]"
                placeholder="Ex.: ligar amanha e enviar proposta"
              />
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Adicionar nota</p>
              <textarea
                value={noteDraft}
                onChange={(event) => setNoteDraft(event.target.value)}
                rows={4}
                className="mt-3 w-full rounded-xl border border-white/10 bg-[#081120] px-3 py-3 text-sm text-white outline-none transition focus:border-[#00A3FF]"
                placeholder="Nota comercial simples..."
              />
              <button
                type="button"
                onClick={() => saveNote(selectedLead)}
                className="mt-3 inline-flex items-center gap-2 rounded-xl border border-[#00A3FF]/30 bg-[#00A3FF]/10 px-4 py-2 text-sm font-black text-[#BFEAFF] transition hover:bg-[#00A3FF]/15"
              >
                Guardar nota
                <CheckCircle2 size={16} />
              </button>
            </section>
          </div>

          <div className="grid gap-3 border-t border-white/10 pt-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => copyWhatsAppMessage(selectedLead)}
              disabled={!selectedLead.whatsapp_message}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#00A3FF]/30 bg-[#00A3FF]/10 px-4 py-2 text-sm font-black text-[#BFEAFF] transition hover:bg-[#00A3FF]/15 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Copy size={16} />
              {copiedId === `${selectedLead.id}:whatsapp` ? "Copiado" : "Copiar WhatsApp"}
            </button>
            <button
              type="button"
              onClick={() => setSelectedLeadId(null)}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-black text-slate-200 transition hover:bg-white/[0.08]"
            >
              Fechar drawer
              <X size={16} />
            </button>
          </div>
        </aside>
      ) : null}
    </div>
  )
}
