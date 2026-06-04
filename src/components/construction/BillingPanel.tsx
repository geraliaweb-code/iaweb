"use client"

import { useState } from "react"
import { AlertTriangle, ArrowUpRight, CheckCircle2, CreditCard, Gauge, Loader2 } from "lucide-react"
import { constructionBillingPlans, formatConstructionPlanPrice } from "@/lib/construction/billing/plans"
import type { ConstructionBillingUsage } from "@/lib/construction/billing/usage"

type BillingPanelProps = {
  usage: ConstructionBillingUsage | null
  warning?: string
}

const statusLabels: Record<string, string> = {
  trial: "Trial",
  active: "Ativo",
  past_due: "Pagamento em atraso",
  cancelled: "Cancelado",
}

export default function BillingPanel({ usage, warning }: BillingPanelProps) {
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
        body: JSON.stringify({ planId }),
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
    <div className="py-10">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-200">Billing & Trial</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-5xl">Planos Construction Intelligence</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            Base de monetizacao preparada para Stripe, com trial de 7 dias, limites mensais e controlo de analises.
          </p>
        </div>
        <button
          type="button"
          onClick={() => (usage?.stripeCustomerId ? openPortal() : startCheckout(usage?.planId ?? "builder"))}
          disabled={Boolean(loadingPlan)}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-300 to-amber-300 px-5 py-3 text-sm font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loadingPlan ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <CreditCard className="h-4 w-4" aria-hidden="true" />}
          {usage?.stripeCustomerId ? "Gerir plano" : "Atualizar plano"}
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {warning || actionError ? (
        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{actionError ?? warning}</span>
        </div>
      ) : null}

      <section className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="iaweb-premium-card rounded-2xl p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Plano atual</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">{usage?.planName ?? "Home"}</h2>
              <p className="mt-2 text-sm text-slate-300">Estado: {statusLabels[usage?.status ?? "trial"]}</p>
            </div>
            <span className="rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-xs font-semibold text-sky-100">
              {remaining} restantes
            </span>
          </div>
          <div className="mt-6">
            <div className="mb-2 flex justify-between text-sm text-slate-300">
              <span>Analises usadas este mes</span>
              <span>{used}/{limit}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-950/70">
              <div className="h-full rounded-full bg-sky-300" style={{ width: `${width}%` }} />
            </div>
          </div>
          <div className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-50">
            Trial de 7 dias com Stripe Checkout. O Customer Portal permite gerir ou cancelar a subscricao.
            {usage?.trialEndsAt ? <span> Termina em {new Date(usage.trialEndsAt).toLocaleDateString("pt-PT")}.</span> : null}
          </div>
        </article>

        <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <Gauge className="h-6 w-6 text-sky-200" aria-hidden="true" />
          <h2 className="mt-4 text-xl font-semibold text-white">Limites aplicados</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            O limite mensal e validado antes de Document Intelligence, Health Check, Benchmark e PDF executivo. Se o limite for excedido, a API responde com bloqueio de billing.
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Checkout cria uma subscription real na Stripe e o webhook sincroniza customer, subscription, price, estado e periodo no Supabase.
          </p>
        </article>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {constructionBillingPlans.map((plan) => {
          const active = usage?.planId === plan.id || (!usage && plan.id === "home")
          return (
            <article key={plan.id} className={`rounded-2xl border p-5 ${active ? "border-sky-300/40 bg-sky-300/10" : "border-white/10 bg-white/[0.03]"}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-white">{plan.name}</h3>
                  <p className="mt-2 text-2xl font-semibold text-white">{formatConstructionPlanPrice(plan.monthlyPriceEur)}</p>
                  <p className="mt-1 text-xs text-slate-400">por mes</p>
                </div>
                {active ? <CheckCircle2 className="h-5 w-5 text-emerald-200" aria-hidden="true" /> : null}
              </div>
              <p className="mt-4 text-sm font-medium text-sky-100">{plan.monthlyAnalysisLimit} analises/mes</p>
              <div className="mt-4 grid gap-2">
                {plan.features.map((feature) => (
                  <p key={feature} className="text-sm leading-5 text-slate-300">
                    {feature}
                  </p>
                ))}
              </div>
              <button
                type="button"
                onClick={() => startCheckout(plan.id)}
                disabled={Boolean(loadingPlan)}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:border-sky-300/50 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loadingPlan === plan.id ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
                {active ? "Renovar via Stripe" : "Atualizar plano"}
              </button>
            </article>
          )
        })}
      </section>
    </div>
  )
}
