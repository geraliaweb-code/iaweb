"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Plus } from "lucide-react"
import { getConstructionRequestError, readConstructionApiJson } from "@/lib/construction/client-api"
import {
  constructionCountryLabels,
  constructionProjectTypeLabels,
} from "@/lib/construction/constants"
import { constructionProjectTypes } from "@/lib/construction/types"
import type { ConstructionLanguage, ConstructionTechnicalCountry } from "@/lib/construction/types"
import ConstructionLocaleSelector, { constructionLocaleEvent, getLegacyConstructionCountry, readConstructionLocalePreference } from "./ConstructionLocaleSelector"

export default function NewProjectForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [language, setLanguage] = useState<ConstructionLanguage>("pt")
  const [technicalCountry, setTechnicalCountry] = useState<ConstructionTechnicalCountry>("portugal")

  useEffect(() => {
    const preference = readConstructionLocalePreference()
    setLanguage(preference.language)
    setTechnicalCountry(preference.technicalCountry)

    function handleLocale(event: Event) {
      const detail = (event as CustomEvent<{ language: ConstructionLanguage; technicalCountry: ConstructionTechnicalCountry }>).detail
      if (detail?.language) setLanguage(detail.language)
      if (detail?.technicalCountry) setTechnicalCountry(detail.technicalCountry)
    }

    window.addEventListener(constructionLocaleEvent, handleLocale)
    return () => window.removeEventListener(constructionLocaleEvent, handleLocale)
  }, [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const leadType = String(formData.get("leadType") ?? "particular")
    const payload = {
      name: String(formData.get("name") ?? ""),
      projectType: String(formData.get("projectType") ?? ""),
      country: String(formData.get("country") ?? getLegacyConstructionCountry(technicalCountry)),
      language: String(formData.get("language") ?? language),
      technicalCountry: String(formData.get("technicalCountry") ?? technicalCountry),
      city: String(formData.get("city") ?? ""),
      estimatedAreaM2: String(formData.get("estimatedAreaM2") ?? ""),
      clientType: leadType === "empresa" ? "construtora" : "particular",
      lead: {
        name: String(formData.get("leadName") ?? ""),
        email: String(formData.get("email") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        company: String(formData.get("company") ?? ""),
        nif: String(formData.get("nif") ?? ""),
        address: String(formData.get("address") ?? ""),
        country: String(formData.get("country") ?? getLegacyConstructionCountry(technicalCountry)),
        leadType,
      },
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
      <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <p className="mb-3 text-sm font-semibold text-white">Idioma e pais tecnico da analise</p>
        <ConstructionLocaleSelector />
        <input type="hidden" name="language" value={language} />
        <input type="hidden" name="technicalCountry" value={technicalCountry} />
        <input type="hidden" name="country" value={getLegacyConstructionCountry(technicalCountry)} />
      </div>
      <div className="mb-6 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
        <p className="text-sm font-semibold text-white">Dados para receber a analise parcial</p>
        <p className="mt-1 text-sm leading-6 text-amber-50/80">
          A primeira analise parcial e gratuita: 1 por particular ou 1 por empresa. Para continuar a analisar projetos e documentacao tecnica, ative um plano Construction Intelligence.
        </p>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <label>
            <span className="text-sm font-medium text-slate-200">Nome</span>
            <input
              name="leadName"
              required
              placeholder="Nome completo"
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-300/60"
            />
          </label>
          <label>
            <span className="text-sm font-medium text-slate-200">Email</span>
            <input
              name="email"
              type="email"
              required
              placeholder="email@empresa.pt"
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-300/60"
            />
          </label>
          <label>
            <span className="text-sm font-medium text-slate-200">Telefone</span>
            <input
              name="phone"
              required
              placeholder="+351 900 000 000"
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-300/60"
            />
          </label>
          <label>
            <span className="text-sm font-medium text-slate-200">Empresa</span>
            <input
              name="company"
              required
              placeholder="Empresa ou Particular"
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-300/60"
            />
          </label>
          <label>
            <span className="text-sm font-medium text-slate-200">NIF</span>
            <input
              name="nif"
              required
              placeholder="NIF ou VAT"
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-300/60"
            />
          </label>
          <label>
            <span className="text-sm font-medium text-slate-200">Tipo</span>
            <select name="leadType" required defaultValue="particular" className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-sky-300/60">
              <option value="particular">Particular</option>
              <option value="empresa">Empresa</option>
            </select>
          </label>
          <label className="md:col-span-2">
            <span className="text-sm font-medium text-slate-200">Morada</span>
            <input
              name="address"
              required
              placeholder="Rua, numero, codigo postal e localidade"
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-300/60"
            />
          </label>
        </div>
      </div>
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
          <div className="mt-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white">
            {constructionCountryLabels[getLegacyConstructionCountry(technicalCountry) as keyof typeof constructionCountryLabels] ?? getLegacyConstructionCountry(technicalCountry)}
          </div>
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

      </div>

      {error ? <p className="mt-5 rounded-xl border border-red-300/20 bg-red-300/10 p-3 text-sm text-red-100">{error}</p> : null}

      <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-slate-400">Depois de criar o projeto, carregue a documentacao para receber a analise parcial.</p>
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
