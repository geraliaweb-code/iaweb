"use client"

import { useState } from "react"
import { Mail, RefreshCw, Send, TriangleAlert } from "lucide-react"
import type { EmailHealth } from "@/lib/admin-email"

type EmailControlPanelProps = {
  initialHealth: EmailHealth
}

function boolLabel(value: boolean) {
  return value ? "sim" : "nao"
}

function formatDate(value: string | null) {
  if (!value) return "--"

  return new Intl.DateTimeFormat("pt-PT", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value))
}

export default function EmailControlPanel({ initialHealth }: EmailControlPanelProps) {
  const [health, setHealth] = useState(initialHealth)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  async function refreshHealth() {
    const response = await fetch("/api/admin/email-health", { cache: "no-store" })
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Nao foi possivel atualizar o estado de email.")
    }

    setHealth(data as EmailHealth)
  }

  async function sendTestEmail() {
    setLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/admin/send-test-email", { method: "POST" })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Nao foi possivel enviar o email de teste.")
      }

      setMessage(`Email de teste enviado. Resend ID: ${data.resendEmailId || "sem id"}`)
      await refreshHealth()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Nao foi possivel enviar o email de teste.")
      await refreshHealth().catch(() => null)
    } finally {
      setLoading(false)
    }
  }

  const configItems = [
    ["RESEND configurado", health.resendConfigured],
    ["EMAIL_FROM configurado", health.fromConfigured],
    ["EMAIL_REPLY_TO configurado", health.replyToConfigured],
    ["BOOKING_URL configurado", health.bookingUrlConfigured],
  ] as const

  return (
    <section className="iaweb-premium-card rounded-2xl p-5">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#3AB8FF]">
            <Mail size={15} />
            Email & PDF
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-white">Controlo Resend Producao</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Valida configuracao, entregas, erros e envio controlado de teste sem expor secrets no frontend.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => refreshHealth().catch((error) => setMessage(error instanceof Error ? error.message : "Erro ao atualizar."))}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-black text-slate-200 transition hover:bg-white/[0.08]"
          >
            <RefreshCw size={15} />
            Atualizar
          </button>
          <button
            type="button"
            onClick={sendTestEmail}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#007BFF] to-[#FFB800] px-4 py-2 text-sm font-black text-white shadow-[0_0_28px_rgba(0,163,255,0.2)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send size={15} />
            {loading ? "A enviar..." : "Enviar Email de Teste"}
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        {configItems.map(([label, value]) => (
          <div key={label} className={`rounded-2xl border p-4 ${value ? "border-emerald-300/25 bg-emerald-300/10" : "border-[#FFB800]/30 bg-[#FFB800]/10"}`}>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">{label}</p>
            <p className="mt-2 text-2xl font-black text-white">{boolLabel(value)}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <div className="rounded-2xl border border-[#00A3FF]/20 bg-[#00A3FF]/10 p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Emails enviados</p>
          <p className="mt-2 text-3xl font-black text-white">{health.totalSent}</p>
        </div>
        <div className="rounded-2xl border border-rose-300/20 bg-rose-300/10 p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Emails com erro</p>
          <p className="mt-2 text-3xl font-black text-white">{health.totalErrors}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Ultimo enviado</p>
          <p className="mt-2 text-sm font-black text-white">{formatDate(health.lastSentAt)}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Ultimo erro</p>
          <p className="mt-2 line-clamp-2 text-sm font-semibold text-white">{health.lastError || "--"}</p>
        </div>
      </div>

      {health.supabaseError ? (
        <div className="mt-4 flex gap-3 rounded-2xl border border-[#FFB800]/30 bg-[#FFB800]/10 p-4 text-sm leading-6 text-[#FFE3A3]">
          <TriangleAlert size={18} className="mt-0.5 shrink-0" />
          <span>{health.supabaseError}</span>
        </div>
      ) : null}

      {message ? <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-slate-200">{message}</p> : null}
    </section>
  )
}
