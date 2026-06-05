"use client"

import { useEffect, useState } from "react"
import type { ConstructionLanguage, ConstructionTechnicalCountry } from "@/lib/construction/types"

export const constructionLocaleEvent = "iaweb-construction-locale"

const languageOptions: Array<{ value: ConstructionLanguage; label: string; flag: string }> = [
  { value: "pt", label: "PT", flag: "PT" },
  { value: "fr", label: "FR", flag: "FR" },
  { value: "es", label: "ES", flag: "ES" },
]

const countryOptions: Array<{ value: ConstructionTechnicalCountry; label: string; legacyCountry: string; flag: string }> = [
  { value: "portugal", label: "Portugal", legacyCountry: "Portugal", flag: "PT" },
  { value: "france", label: "France", legacyCountry: "França", flag: "FR" },
  { value: "spain", label: "España", legacyCountry: "Espanha", flag: "ES" },
]

const flagClasses: Record<string, string> = {
  PT: "bg-[linear-gradient(90deg,#047857_0_42%,#dc2626_42%)]",
  FR: "bg-[linear-gradient(90deg,#1d4ed8_0_33%,#ffffff_33%_66%,#dc2626_66%)]",
  ES: "bg-[linear-gradient(180deg,#dc2626_0_25%,#facc15_25%_75%,#dc2626_75%)]",
}

const technicalCountryLabels: Record<ConstructionTechnicalCountry, string> = {
  portugal: "Portugal",
  france: "France",
  spain: "España",
}

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

function Flag({ code }: { code: string }) {
  return <span aria-hidden="true" className={`h-3.5 w-5 rounded-[2px] border border-white/20 shadow-sm ${flagClasses[code]}`} />
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
    setTechnicalCountry(value)
    persistLocale(language, value)
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2" aria-label="Construction language and country selectors">
      <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] p-1 shadow-sm backdrop-blur" aria-label="Language selector">
        {languageOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => chooseLanguage(option.value)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition ${
              language === option.value ? "bg-amber-500 text-slate-950" : "text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
            aria-pressed={language === option.value}
          >
            <Flag code={option.flag} />
            {option.label}
          </button>
        ))}
      </div>
      <div className="hidden rounded-full border border-white/10 bg-white/[0.04] p-1 shadow-sm backdrop-blur xl:inline-flex" aria-label="Technical country selector">
        {countryOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => chooseCountry(option.value)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition ${
              technicalCountry === option.value ? "bg-white text-slate-950" : "text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
            aria-pressed={technicalCountry === option.value}
          >
            <Flag code={option.flag} />
            {technicalCountryLabels[option.value]}
          </button>
        ))}
      </div>
    </div>
  )
}
