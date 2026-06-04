"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Plus } from "lucide-react"
import { getConstructionRequestError, readConstructionApiJson } from "@/lib/construction/client-api"
import {
  constructionClientTypeLabels,
  constructionCountryLabels,
  constructionProjectTypeLabels,
} from "@/lib/construction/constants"
import { constructionClientTypes, constructionCountries, constructionProjectTypes } from "@/lib/construction/types"

export default function NewProjectForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const payload = {
      name: String(formData.get("name") ?? ""),
      projectType: String(formData.get("projectType") ?? ""),
      country: String(formData.get("country") ?? ""),
      city: String(formData.get("city") ?? ""),
      estimatedAreaM2: String(formData.get("estimatedAreaM2") ?? ""),
      clientType: String(formData.get("clientType") ?? ""),
    }

    try {
      const response = await fetch("/api/construction/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const result = await readConstructionApiJson<{ project?: { id: string } }>(response)

      setIsSubmitting(false)

      if (!response.ok || !result.project?.id) {
        setError(result.error ?? "Nao foi possivel criar o projeto.")
        return
      }

      router.push(`/construction/projects/${result.project.id}`)
      router.refresh()
    } catch (submitError) {
      setIsSubmitting(false)
      setError(getConstructionRequestError(submitError, "Falha de rede ao criar o projeto."))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="iaweb-premium-card mx-auto w-full max-w-4xl rounded-2xl p-6 sm:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="md:col-span-2">
          <span className="text-sm font-medium text-slate-200">Nome do projeto</span>
          <input
            name="name"
            required
            placeholder="Ex: Hotel Atlantico - Fase de licenciamento"
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-300/60"
          />
        </label>

        <label>
          <span className="text-sm font-medium text-slate-200">Tipo de obra</span>
          <select name="projectType" required defaultValue="moradia" className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-sky-300/60">
            {constructionProjectTypes.map((type) => (
              <option key={type} value={type}>
                {constructionProjectTypeLabels[type]}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="text-sm font-medium text-slate-200">País</span>
          <select name="country" required defaultValue="Portugal" className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-sky-300/60">
            {constructionCountries.map((country) => (
              <option key={country} value={country}>
                {constructionCountryLabels[country]}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="text-sm font-medium text-slate-200">Cidade</span>
          <input
            name="city"
            required
            placeholder="Lisboa"
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-300/60"
          />
        </label>

        <label>
          <span className="text-sm font-medium text-slate-200">Área estimada m²</span>
          <input
            name="estimatedAreaM2"
            type="number"
            min="1"
            inputMode="decimal"
            placeholder="250"
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-300/60"
          />
        </label>

        <label className="md:col-span-2">
          <span className="text-sm font-medium text-slate-200">Tipo de cliente</span>
          <select name="clientType" required defaultValue="particular" className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-sky-300/60">
            {constructionClientTypes.map((type) => (
              <option key={type} value={type}>
                {constructionClientTypeLabels[type]}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error ? <p className="mt-5 rounded-xl border border-red-300/20 bg-red-300/10 p-3 text-sm text-red-100">{error}</p> : null}

      <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-slate-400">Sprint 1 cria apenas a fundacao do projeto e estrutura de intelligence.</p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-full bg-sky-400 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
          Criar projeto
        </button>
      </div>
    </form>
  )
}
