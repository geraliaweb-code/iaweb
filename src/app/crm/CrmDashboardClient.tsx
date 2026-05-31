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

function getScoreClass(score: number) {
  if (score >= 70) return "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
  if (score >= 41) return "border-amber-400/30 bg-amber-400/10 text-amber-200"
  return "border-rose-400/30 bg-rose-400/10 text-rose-200"
}

function getPriority(score: number) {
  if (score >= 70) {
    return {
      label: "Prioridade alta",
      className: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
    }
  }

  if (score >= 41) {
    return {
      label: "Prioridade media",
      className: "border-amber-400/30 bg-amber-400/10 text-amber-200",
    }
  }

  return {
    label: "Nutrir",
    className: "border-slate-400/20 bg-slate-400/10 text-slate-300",
  }
}

function includesSearch(lead: CrmLead, search: string) {
  const value = search.trim().toLowerCase()

  if (!value) return true

  return [lead.empresa, lead.email, lead.telefone].some((field) => field.toLowerCase().includes(value))
}

function getConversionRate(part: number, total: number) {
  if (total === 0) return "0%"
  return `${Math.round((part / total) * 100)}%`
}

export function CrmDashboardClient({ initialLeads, authEnabled = false }: CrmDashboardClientProps) {
  const [leads, setLeads] = useState(initialLeads)
  const [filter, setFilter] = useState<StatusFilter>("todos")
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState<SortOption>("created_at:desc")
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const metrics = useMemo(() => {
    const total = leads.length
    const novos = leads.filter((lead) => lead.status === "novo").length
    const contactados = leads.filter((lead) => lead.status === "contactado").length
    const propostas = leads.filter((lead) => lead.status === "proposta").length
    const fechados = leads.filter((lead) => lead.status === "fechado").length
    const trabalhados = leads.filter((lead) => lead.status !== "novo").length

    return {
      total,
      novos,
      contactados,
      propostas,
      fechados,
      contactRate: getConversionRate(trabalhados, total),
      proposalRate: getConversionRate(propostas, total),
      closeRate: getConversionRate(fechados, total),
      proposalCloseRate: getConversionRate(fechados, propostas),
    }
  }, [leads])

  const filteredLeads = useMemo(() => {
    const [sortField, direction] = sort.split(":") as [CrmSortField, CrmSortDirection]

    return [...leads
      .filter((lead) => filter === "todos" || lead.status === filter)
      .filter((lead) => includesSearch(lead, search))]
      .sort((a, b) => {
        const directionMultiplier = direction === "asc" ? 1 : -1

        if (sortField === "score_geral") {
          return (a.score_geral - b.score_geral) * directionMultiplier
        }

        return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) * directionMultiplier
      })
  }, [filter, leads, search, sort])

  async function updateStatus(id: string, status: CrmStatus) {
    setUpdatingId(id)
    setError(null)

    try {
      const response = await fetch(`/api/crm/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      const payload = (await response.json()) as { error?: string }

      if (!response.ok) {
        throw new Error(payload.error || "Nao foi possivel atualizar o status.")
      }

      setLeads((current) => current.map((lead) => (lead.id === id ? { ...lead, status } : lead)))
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Nao foi possivel atualizar o status.")
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
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">Operacao comercial</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Pipeline dos diagnosticos com pesquisa, prioridade comercial, conversao e seguimento por WhatsApp.
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

        <section className="grid gap-3 md:grid-cols-5">
          {[
            { label: "Total Leads", value: metrics.total },
            { label: "Novos", value: metrics.novos },
            { label: "Contactados", value: metrics.contactados },
            { label: "Propostas", value: metrics.propostas },
            { label: "Fechados", value: metrics.fechados },
          ].map((metric) => (
            <div key={metric.label} className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{metric.label}</p>
              <p className="mt-2 text-3xl font-semibold text-white">{metric.value}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-3 md:grid-cols-4">
          {[
            { label: "Leads trabalhados", value: metrics.contactRate },
            { label: "Lead para proposta", value: metrics.proposalRate },
            { label: "Lead para fechado", value: metrics.closeRate },
            { label: "Proposta para fechado", value: metrics.proposalCloseRate },
          ].map((metric) => (
            <div key={metric.label} className="rounded-lg border border-sky-300/10 bg-sky-400/[0.04] px-4 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{metric.label}</p>
              <p className="mt-2 text-2xl font-semibold text-sky-100">{metric.value}</p>
            </div>
          ))}
        </section>

        <section className="flex flex-col gap-4 rounded-lg border border-white/10 bg-white/[0.03] p-4">
          <div className="grid gap-3 lg:grid-cols-[minmax(220px,1fr)_220px]">
            <label className="flex flex-col gap-2 text-sm text-slate-300">
              Pesquisar por empresa, email ou telefone
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Ex.: ACME, nome@empresa.pt, 912..."
                className="h-11 rounded-md border border-white/10 bg-[#0a1220] px-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-300"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-slate-300">
              Ordenar por
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

          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <h2 className="text-sm font-semibold text-white">Filtro por status</h2>
              <p className="text-xs text-slate-400">A mostrar {filteredLeads.length} de {leads.length} leads.</p>
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
          </div>

          {error ? (
            <div className="rounded-md border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
              {error}
            </div>
          ) : null}
        </section>

        <section className="overflow-hidden rounded-lg border border-white/10 bg-[#07111f] shadow-2xl shadow-black/20">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1240px] border-collapse text-left">
              <thead className="border-b border-white/10 bg-white/[0.04] text-xs uppercase tracking-[0.18em] text-slate-400">
                <tr>
                  <th className="px-4 py-4">Empresa</th>
                  <th className="px-4 py-4">Contacto</th>
                  <th className="px-4 py-4">Email</th>
                  <th className="px-4 py-4">Telefone</th>
                  <th className="px-4 py-4">Website</th>
                  <th className="px-4 py-4">Score</th>
                  <th className="px-4 py-4">Prioridade</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">WhatsApp</th>
                  <th className="px-4 py-4">Criado</th>
                  <th className="px-4 py-4">Acao</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredLeads.map((lead) => {
                  const priority = getPriority(lead.score_geral)

                  return (
                    <tr key={lead.id} className="align-top text-sm text-slate-200 hover:bg-white/[0.025]">
                      <td className="px-4 py-4 font-medium text-white">{lead.empresa}</td>
                      <td className="px-4 py-4">{lead.nome_contacto}</td>
                      <td className="px-4 py-4 text-slate-300">{lead.email}</td>
                      <td className="px-4 py-4 text-slate-300">{lead.telefone}</td>
                      <td className="px-4 py-4">
                        <a className="text-sky-300 hover:text-sky-200" href={lead.website} target="_blank" rel="noreferrer">
                          {lead.website}
                        </a>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-semibold ${getScoreClass(lead.score_geral)}`}>
                          {lead.score_geral}/100
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-semibold ${priority.className}`}>
                          {priority.label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={crmStatuses.includes(lead.status as CrmStatus) ? lead.status : "novo"}
                          disabled={updatingId === lead.id}
                          onChange={(event) => updateStatus(lead.id, event.target.value as CrmStatus)}
                          className="w-36 rounded-md border border-white/10 bg-[#0a1220] px-3 py-2 text-sm text-white outline-none transition focus:border-sky-300"
                        >
                          {crmStatuses.map((status) => (
                            <option key={status} value={status}>
                              {getCrmStatusLabel(status)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-4">
                        <span className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-slate-300">
                          {lead.whatsapp_status || "pendente"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-400">{formatDate(lead.created_at)}</td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => copyWhatsAppMessage(lead)}
                          className="rounded-md border border-sky-300/30 bg-sky-400/10 px-3 py-2 text-sm font-medium text-sky-100 transition hover:bg-sky-400/15 disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={!lead.whatsapp_message}
                        >
                          {copiedId === lead.id ? "Copiado" : "Copiar WhatsApp"}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {filteredLeads.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-slate-400">Nao ha leads para os filtros selecionados.</div>
          ) : null}
        </section>
      </div>
    </div>
  )
}
