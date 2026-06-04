"use client"

import { useEffect, useState } from "react"
import type { ConstructionLanguage, ConstructionTechnicalCountry } from "@/lib/construction/types"

export const constructionLocaleEvent = "iaweb-construction-locale"

const languageOptions: Array<{ value: ConstructionLanguage; label: string }> = [
  { value: "pt", label: "PT" },
  { value: "fr", label: "FR" },
  { value: "es", label: "ES" },
]

const countryOptions: Array<{ value: ConstructionTechnicalCountry; label: string; legacyCountry: string }> = [
  { value: "portugal", label: "Portugal", legacyCountry: "Portugal" },
  { value: "france", label: "France", legacyCountry: "FranÃ§a" },
  { value: "spain", label: "Espana", legacyCountry: "Espanha" },
]

export function getLegacyConstructionCountry(country: ConstructionTechnicalCountry) {
  return countryOptions.find((option) => option.value === country)?.legacyCountry ?? "Portugal"
}

export function getLanguageForTechnicalCountry(country: ConstructionTechnicalCountry): ConstructionLanguage {
  if (country === "france") return "fr"
  if (country === "spain") return "es"
  return "pt"
}

export function readConstructionLocalePreference(): { language: ConstructionLanguage; technicalCountry: ConstructionTechnicalCountry } {
  if (typeof window === "undefined") {
    return { language: "pt" as ConstructionLanguage, technicalCountry: "portugal" as ConstructionTechnicalCountry }
  }

  const language = window.localStorage.getItem("iaweb-construction-language")
  const technicalCountry = window.localStorage.getItem("iaweb-construction-technical-country")

  return {
    language: language === "fr" || language === "es" || language === "pt" ? language : "pt",
    technicalCountry: technicalCountry === "france" || technicalCountry === "spain" || technicalCountry === "portugal" ? technicalCountry : "portugal",
  }
}

function persistLocale(language: ConstructionLanguage, technicalCountry: ConstructionTechnicalCountry) {
  window.localStorage.setItem("iaweb-construction-language", language)
  window.localStorage.setItem("iaweb-construction-technical-country", technicalCountry)
  document.cookie = `iaweb-construction-language=${language}; path=/; max-age=31536000; samesite=lax`
  document.cookie = `iaweb-construction-technical-country=${technicalCountry}; path=/; max-age=31536000; samesite=lax`
  window.dispatchEvent(new CustomEvent(constructionLocaleEvent, { detail: { language, technicalCountry } }))
}

export default function ConstructionLocaleSelector() {
  const [language, setLanguage] = useState<ConstructionLanguage>("pt")
  const [technicalCountry, setTechnicalCountry] = useState<ConstructionTechnicalCountry>("portugal")

  useEffect(() => {
    const preference = readConstructionLocalePreference()
    setLanguage(preference.language)
    setTechnicalCountry(preference.technicalCountry)
  }, [])

  function chooseLanguage(value: ConstructionLanguage) {
    setLanguage(value)
    persistLocale(value, technicalCountry)
  }

  function chooseCountry(value: ConstructionTechnicalCountry) {
    const nextLanguage = getLanguageForTechnicalCountry(value)
    setTechnicalCountry(value)
    setLanguage(nextLanguage)
    persistLocale(nextLanguage, value)
  }

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Construction language and country selectors">
      <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm">
        {languageOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => chooseLanguage(option.value)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${language === option.value ? "bg-slate-950 text-white" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"}`}
            aria-pressed={language === option.value}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm">
        {countryOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => chooseCountry(option.value)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${technicalCountry === option.value ? "bg-amber-700 text-white" : "text-slate-500 hover:bg-amber-50 hover:text-amber-900"}`}
            aria-pressed={technicalCountry === option.value}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
