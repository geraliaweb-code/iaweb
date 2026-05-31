"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"

type CrmLoginFormProps = {
  authConfigured: boolean
}

export function CrmLoginForm({ authConfigured }: CrmLoginFormProps) {
  const router = useRouter()
  const [credential, setCredential] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/crm/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential }),
      })

      const payload = (await response.json()) as { error?: string }

      if (!response.ok) {
        throw new Error(payload.error || "Nao foi possivel autenticar.")
      }

      router.replace("/crm")
      router.refresh()
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Nao foi possivel autenticar.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
      <label className="flex flex-col gap-2 text-sm text-slate-300">
        Password ou token
        <input
          type="password"
          value={credential}
          onChange={(event) => setCredential(event.target.value)}
          disabled={!authConfigured || isSubmitting}
          autoComplete="current-password"
          className="h-11 rounded-md border border-white/10 bg-[#0a1220] px-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
          placeholder="CRM_AUTH_TOKEN ou CRM_AUTH_PASSWORD"
        />
      </label>

      {error ? (
        <div className="rounded-md border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
          {error}
        </div>
      ) : null}

      {!authConfigured ? (
        <div className="rounded-md border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
          Define CRM_AUTH_TOKEN ou CRM_AUTH_PASSWORD antes de ativar CRM_AUTH_ENABLED=true.
        </div>
      ) : null}

      <button
        type="submit"
        disabled={!authConfigured || isSubmitting || !credential.trim()}
        className="h-11 rounded-md border border-sky-300/30 bg-sky-400/15 px-4 text-sm font-medium text-sky-100 transition hover:bg-sky-400/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "A autenticar..." : "Entrar no CRM"}
      </button>
    </form>
  )
}
