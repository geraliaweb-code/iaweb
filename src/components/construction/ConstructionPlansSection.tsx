"use client"

import { useState } from "react"
import { AlertTriangle, ArrowRight, CheckCircle2, CreditCard, Loader2 } from "lucide-react"
import { constructionBillingPlans, formatConstructionPlanPrice } from "@/lib/construction/billing/plans"
import type { ConstructionBillingUsage } from "@/lib/construction/billing/usage"
import { readConstructionLocalePreference } from "./ConstructionLocaleSelector"

type ConstructionPlansSectionProps = {
  usage?: ConstructionBillingUsage | null
  warning?: string
  compact?: boolean
}

const planCopy: Record<string, { label: string; body: string }> = {
  home: {
    label: "Particular",
    body: "Ideal para validar documentacao, identificar riscos e obter uma primeira visao antes de pedir orcamentos.",
  },
  builder: {
    label: "Construtor",
    body: "Analise recorrente de documentacao, riscos, prazos e estimativas por cenario.",
  },
  architect: {
    label: "Arquitetura & Engenharia",
    body: "Apoio tecnico para validacoes, relatorios e recomendacoes aos clientes.",
  },
  engineering: {
    label: "Business",
    body: "Mais capacidade de analise, benchmark e inteligencia documental avancada.",
  },
  enterprise: {
    label: "Enterprise",
    body: "Multiplos utilizadores, API, White Label e maior capacidade operacional.",
  },
}

const statusLabels: Record<string, string> = {
  trial: "Parcial gratuita",
  active: "Ativo",
  past_due: "Pagamento em atraso",
  cancelled: "Cancelado",
}

export default function ConstructionPlansSection({ usage, warning, compact = false }: ConstructionPlansSectionProps) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const used = usage?.usedThisMonth ?? 0
  const limit = usage?.monthlyLimit ?? constructionBillingPlans[0].monthlyAnalysisLimit
  const remaining = usage?.remainingThisMonth ?? limit
  const width = limit ? Math.min(100, Math.round((used / limit) * 100)) : 0

  async function startCheckout(planId: string) {
    setLoadingPlan(planId)
    setActionError(null)

    try {
      const response = await fetch("/api/construction/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, language: readConstructionLocalePreference().language }),
      })
      const result = (await response.json().catch(() => ({}))) as { url?: string; error?: string }

      if (!response.ok || !result.url) {
        setActionError(result.error ?? "Nao foi possivel iniciar Checkout Stripe.")
        setLoadingPlan(null)
        return
      }

      window.location.href = result.url
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Falha de rede ao iniciar Checkout Stripe.")
      setLoadingPlan(null)
    }
  }

  async function openPortal() {
    if (!usage?.stripeCustomerId) {
      setActionError("Ainda nao existe cliente Stripe associado a esta subscricao.")
      return
    }

    setLoadingPlan("portal")
    setActionError(null)

    try {
      const response = await fetch("/api/construction/billing/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: usage.stripeCustomerId }),
      })
      const result = (await response.json().catch(() => ({}))) as { url?: string; error?: string }

      if (!response.ok || !result.url) {
        setActionError(result.error ?? "Nao foi possivel abrir Customer Portal.")
        setLoadingPlan(null)
        return
      }

      window.location.href = result.url
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Falha de rede ao abrir Customer Portal.")
      setLoadingPlan(null)
    }
  }

  return (
    <section className={compact ? "py-10" : "py-14"}>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-300">Planos Construction Intelligence</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">Escolha o nivel de inteligencia que pretende para a sua obra.</h2>
          <p className="mt-4 text-base leading-7 text-slate-300">
            Sem trial de 7 dias: particulares e empresas recebem 1 analise parcial gratuita. Para continuar a analisar projetos e documentacao tecnica, ative um plano Construction Intelligence.
          </p>
        </div>
        {usage?.stripeCustomerId ? (
          <button
            type="button"
            onClick={openPortal}
            disabled={Boolean(loadingPlan)}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-700 px-5 py-3 text-sm font-bold text-white transition hover:from-amber-400 hover:to-amber-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loadingPlan === "portal" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <CreditCard className="h-4 w-4" aria-hidden="true" />}
            Gerir plano
          </button>
        ) : null}
      </div>

      {usage || warning || actionError ? (
        <div className="mt-8 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="construction-glass-card rounded-xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Plano atual</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">{usage?.planName ?? "Home"}</h3>
                <p className="mt-2 text-sm text-slate-300">Estado: {statusLabels[usage?.status ?? "trial"]}</p>
              </div>
              <span className="rounded-full border border-amber-700/20 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">
                {remaining} restantes
              </span>
            </div>
            <div className="mt-6">
              <div className="mb-2 flex justify-between text-sm text-slate-600">
                <span>Analises usadas este mes</span>
                <span>{used}/{limit}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-amber-400" style={{ width: `${width}%` }} />
              </div>
            </div>
          </article>

          <article className="rounded-xl border border-amber-300/20 bg-amber-300/10 p-6 text-sm leading-6 text-amber-50">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <p>{actionError ?? warning ?? "Analise parcial gratuita ativa. O Customer Portal permite gerir ou cancelar a subscricao quando existir cliente Stripe associado."}</p>
            </div>
          </article>
        </div>
      ) : null}

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {constructionBillingPlans.map((plan) => {
          const active = usage?.planId === plan.id || (!usage && plan.id === "home")
          return (
            <article key={plan.id} className={`construction-glass-card flex min-h-[25rem] flex-col rounded-xl p-5 transition hover:-translate-y-1 ${active ? "border-amber-300/40" : ""}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">{planCopy[plan.id]?.label ?? plan.name}</h3>
                  <p className="mt-2 text-3xl font-semibold text-white">{formatConstructionPlanPrice(plan.monthlyPriceEur)}</p>
                  <p className="mt-1 text-xs font-medium text-slate-400">por mes</p>
                </div>
                {active ? <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden="true" /> : null}
              </div>
              <p className="mt-5 text-sm leading-6 text-slate-300">{planCopy[plan.id]?.body}</p>
              <p className="mt-5 text-sm font-bold text-white">{plan.monthlyAnalysisLimit} analises/mes</p>
              <div className="mt-4 grid gap-2">
                {plan.features.map((feature) => (
                  <p key={feature} className="text-sm leading-5 text-slate-300">{feature}</p>
                ))}
              </div>
              <button
                type="button"
                onClick={() => startCheckout(plan.id)}
                disabled={Boolean(loadingPlan)}
                className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-700 px-4 py-3 text-sm font-bold text-white transition hover:from-amber-400 hover:to-amber-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loadingPlan === plan.id ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
                Ativar Inteligencia
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </article>
          )
        })}
      </div>
    </section>
  )
}
