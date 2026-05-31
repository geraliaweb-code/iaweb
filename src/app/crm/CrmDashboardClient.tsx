"use client"

import { useMemo, useState } from "react"
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

function getScoreClass(score: number) {
  if (score >= 70) return "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
  if (score >= 41) return "border-amber-400/30 bg-amber-400/10 text-amber-200"
  return "border-rose-400/30 bg-rose-400/10 text-rose-200"
}

function getLeadPotential(lead: CrmLead) {
  if (lead.perda_mensal_estimada > 0) return lead.perda_mensal_estimada

  const impact = lead.impacto_financeiro as { lostRevenueMonthly?: { min?: number; max?: number } } | null
  return impact?.lostRevenueMonthly?.max ?? 0
}

export function CrmDashboardClient({ initialLeads, authEnabled = false }: CrmDashboardClientProps) {
  const [leads, setLeads] = useState(initialLeads)
  const [filter, setFilter] = useState<StatusFilter>("todos")
  const [nicheFilter, setNicheFilter] = useState("todos")
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState<SortOption>("created_at:desc")
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)

  const niches = useMemo(() => {
    return Array.from(new Set(leads.map((lead) => lead.setor).filter(Boolean))).sort()
  }, [leads])

  const metrics = useMemo(() => {
    const total = leads.length
    const propostas = leads.filter((lead) => lead.status === "proposta" || lead.status === "negociacao").length
    const fechados = leads.filter((lead) => lead.status === "fechado").length
    const valorPotencial = leads.reduce((sum, lead) => sum + getLeadPotential(lead), 0)

    return {
      total,
      propostas,
      fechados,
      valorPotencial,
    }
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

  async function copyWhatsAppMessage(lead: CrmLead) {
    if (!lead.whatsapp_message) {
      setError("Esta lead ainda nao tem mensagem de WhatsApp preparada.")
      return
    }

    try {
      await navigator.clipboard.writeText(lead.whatsapp_message)
      setCopiedId(lead.id)
      setError(null)
      window.setTimeout(() => setCopiedId(null), 1800)
    } catch {
      setError("Nao foi possivel copiar a mensagem para o clipboard.")
    }
  }

  async function saveNote(lead: CrmLead) {
    const note = noteDrafts[lead.id]?.trim()

    if (!note) return

    const nextNotes = [lead.notas, `${new Date().toLocaleString("pt-PT")} - ${note}`].filter(Boolean).join("\n")
    await patchLead(lead.id, { notas: nextNotes })
    setNoteDrafts((current) => ({ ...current, [lead.id]: "" }))
  }

  async function logout() {
    await fetch("/api/crm/auth/logout", { method: "POST" })
    window.location.href = "/crm/login"
  }

  return (
    <div className="min-h-screen bg-[#030712] px-4 py-8 text-slate-50 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-sky-300">IAWEB CRM</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">Pipeline comercial</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Leads da demo, diagnostico e propostas organizadas por status, nicho, valor potencial e proxima acao.
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
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
            { label: "Leads totais", value: String(metrics.total) },
            { label: "Propostas", value: String(metrics.propostas) },
            { label: "Valor potencial", value: formatEuro(metrics.valorPotencial) },
            { label: "Fechados", value: String(metrics.fechados) },
          ].map((metric) => (
            <div key={metric.label} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{metric.label}</p>
              <p className="mt-2 text-3xl font-semibold text-white">{metric.value}</p>
            </div>
          ))}
        </section>

        <section className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="grid gap-3 lg:grid-cols-[minmax(220px,1fr)_180px_220px]">
            <label className="flex flex-col gap-2 text-sm text-slate-300">
              Pesquisar
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Empresa, email, telefone, nicho..."
                className="h-11 rounded-md border border-white/10 bg-[#0a1220] px-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-300"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-slate-300">
              Nicho
              <select
                value={nicheFilter}
                onChange={(event) => setNicheFilter(event.target.value)}
                className="h-11 rounded-md border border-white/10 bg-[#0a1220] px-3 text-sm text-white outline-none transition focus:border-sky-300"
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
              Ordenar
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortOption)}
                className="h-11 rounded-md border border-white/10 bg-[#0a1220] px-3 text-sm text-white outline-none transition focus:border-sky-300"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            {allStatuses.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilter(status)}
                className={`rounded-md border px-3 py-2 text-sm transition ${
                  filter === status
                    ? "border-sky-300 bg-sky-400/15 text-sky-100"
                    : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20 hover:bg-white/[0.06]"
                }`}
              >
                {status === "todos" ? "Todos" : getCrmStatusLabel(status)}
              </button>
            ))}
          </div>

          {error ? (
            <div className="rounded-md border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
              {error}
            </div>
          ) : null}
        </section>

        <section className="grid gap-4 xl:grid-cols-2">
          {filteredLeads.map((lead) => (
            <article key={lead.id} className="rounded-2xl border border-white/10 bg-[#07111f] p-5 shadow-2xl shadow-black/20">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-semibold text-white">{lead.empresa || "Empresa sem nome"}</h2>
                    <span className="rounded-full border border-sky-300/20 bg-sky-400/10 px-2.5 py-1 text-xs font-semibold text-sky-100">
                      {lead.origem || "diagnostico"}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-slate-300">
                      {lead.setor || "sem nicho"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{lead.objetivo || "Sem objetivo indicado"}</p>
                </div>

                <select
                  value={crmStatuses.includes(lead.status as CrmStatus) ? lead.status : "novo"}
                  disabled={updatingId === lead.id}
                  onChange={(event) => patchLead(lead.id, { status: event.target.value as CrmStatus })}
                  className="h-10 rounded-md border border-white/10 bg-[#0a1220] px-3 text-sm text-white outline-none transition focus:border-sky-300"
                >
                  {crmStatuses.map((status) => (
                    <option key={status} value={status}>
                      {getCrmStatusLabel(status)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-4">
                <div className={`rounded-xl border px-3 py-3 ${getScoreClass(lead.score_geral)}`}>
                  <p className="text-xs uppercase tracking-[0.16em] opacity-80">Score</p>
                  <p className="mt-1 text-xl font-semibold">{lead.score_geral}/100</p>
                </div>
                <div className="rounded-xl border border-amber-300/20 bg-amber-300/10 px-3 py-3 text-amber-100">
                  <p className="text-xs uppercase tracking-[0.16em] opacity-80">Potencial</p>
                  <p className="mt-1 text-xl font-semibold">{formatEuro(getLeadPotential(lead))}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-slate-200 sm:col-span-2">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Plano</p>
                  <p className="mt-1 text-sm font-semibold">{lead.plano_recomendado || "A definir"}</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-slate-300">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Contacto</p>
                  <p>{lead.nome_contacto || "Sem contacto"}</p>
                  <p>{lead.email || "Sem email"}</p>
                  <p>{lead.telefone || "Sem telefone"}</p>
                  {lead.website ? (
                    <a className="text-sky-300 hover:text-sky-200" href={lead.website} target="_blank" rel="noreferrer">
                      {lead.website}
                    </a>
                  ) : null}
                </div>
                <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-slate-300">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Diagnostico</p>
                  <p>Website {lead.score_website}/100 · Google {lead.score_google}/100</p>
                  <p>Conversao {lead.score_conversao}/100 · CRM {lead.score_crm}/100</p>
                  <p>Automacao {lead.score_automacao}/100</p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">
                <label className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Proxima acao</label>
                <input
                  value={lead.proxima_acao || ""}
                  onChange={(event) =>
                    setLeads((current) => current.map((item) => (item.id === lead.id ? { ...item, proxima_acao: event.target.value } : item)))
                  }
                  onBlur={(event) => patchLead(lead.id, { proxima_acao: event.target.value })}
                  className="mt-2 h-10 w-full rounded-md border border-white/10 bg-[#0a1220] px-3 text-sm text-white outline-none transition focus:border-sky-300"
                  placeholder="Ex.: Ligar amanha e apresentar proposta"
                />
              </div>

              <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Notas</p>
                {lead.notas ? <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-white/[0.03] p-3 text-xs leading-5 text-slate-300">{lead.notas}</pre> : null}
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <input
                    value={noteDrafts[lead.id] ?? ""}
                    onChange={(event) => setNoteDrafts((current) => ({ ...current, [lead.id]: event.target.value }))}
                    className="h-10 flex-1 rounded-md border border-white/10 bg-[#0a1220] px-3 text-sm text-white outline-none transition focus:border-sky-300"
                    placeholder="Adicionar nota simples"
                  />
                  <button
                    type="button"
                    onClick={() => saveNote(lead)}
                    className="rounded-md border border-sky-300/30 bg-sky-400/10 px-4 py-2 text-sm font-medium text-sky-100 transition hover:bg-sky-400/15"
                  >
                    Guardar nota
                  </button>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                <span>Criado: {formatDate(lead.created_at)}</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => copyWhatsAppMessage(lead)}
                    className="rounded-md border border-sky-300/30 bg-sky-400/10 px-3 py-2 text-sm font-medium text-sky-100 transition hover:bg-sky-400/15 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!lead.whatsapp_message}
                  >
                    {copiedId === lead.id ? "Copiado" : "Copiar WhatsApp"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>

        {filteredLeads.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-6 py-12 text-center text-sm text-slate-400">
            Nao ha leads para os filtros selecionados.
          </div>
        ) : null}
      </div>
    </div>
  )
}
