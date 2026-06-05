"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Building2, Loader2 } from "lucide-react"
import type { ConstructionOrganization } from "@/lib/construction/types"

type ConstructionOrganizationFormProps = {
  organization: ConstructionOrganization | null
}

const inputClass = "mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-amber-300/60"

export default function ConstructionOrganizationForm({ organization }: ConstructionOrganizationFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setMessage(null)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const response = await fetch("/api/construction/organization", {
      method: organization ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(formData.get("name") ?? ""),
        nif: String(formData.get("nif") ?? ""),
        country: String(formData.get("country") ?? "Portugal"),
        address: String(formData.get("address") ?? ""),
      }),
    })
    const result = (await response.json().catch(() => ({}))) as { error?: string }

    setIsSubmitting(false)

    if (!response.ok) {
      setError(result.error ?? "Nao foi possivel guardar a organizacao.")
      return
    }

    setMessage("Organizacao guardada.")
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="iaweb-premium-card rounded-2xl p-6 md:p-8">
      <div className="flex items-start gap-4">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-amber-300 text-slate-950">
          <Building2 className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-200">Organizacao</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">{organization ? "Editar organizacao" : "Criar organizacao"}</h2>
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <Label label="Nome">
          <input name="name" required defaultValue={organization?.name ?? ""} className={inputClass} placeholder="Nome da empresa" />
        </Label>
        <Label label="NIF">
          <input name="nif" defaultValue={organization?.nif ?? ""} className={inputClass} placeholder="NIF ou VAT" />
        </Label>
        <Label label="Pais">
          <select name="country" required defaultValue={organization?.country ?? "Portugal"} className={inputClass}>
            <option value="Portugal">Portugal</option>
            <option value="França">Franca</option>
            <option value="Espanha">Espanha</option>
          </select>
        </Label>
        <Label label="Plano atual">
          <input disabled value={organization?.subscription_plan ?? "home"} className={`${inputClass} disabled:opacity-70`} />
        </Label>
        <div className="md:col-span-2">
          <Label label="Morada">
            <input name="address" defaultValue={organization?.address ?? ""} className={inputClass} placeholder="Morada fiscal" />
          </Label>
        </div>
      </div>

      {message ? <p className="mt-5 rounded-xl border border-emerald-300/20 bg-emerald-300/10 p-3 text-sm text-emerald-100">{message}</p> : null}
      {error ? <p className="mt-5 rounded-xl border border-red-300/20 bg-red-300/10 p-3 text-sm text-red-100">{error}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-300 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Building2 className="h-4 w-4" aria-hidden="true" />}
        Guardar organizacao
      </button>
    </form>
  )
}

function Label({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label>
      <span className="text-sm font-medium text-slate-200">{label}</span>
      {children}
    </label>
  )
}
