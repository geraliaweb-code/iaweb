"use client"

import { useEffect, useState } from "react"
import { getConstructionCopy } from "@/lib/construction/i18n"
import type { ConstructionLanguage, ConstructionTechnicalCountry } from "@/lib/construction/types"
import { constructionLocaleEvent, readConstructionLocalePreference } from "./ConstructionLocaleSelector"

export function useConstructionLocale() {
  const [locale, setLocale] = useState<{ language: ConstructionLanguage; technicalCountry: ConstructionTechnicalCountry }>({
    language: "pt",
    technicalCountry: "portugal",
  })

  useEffect(() => {
    setLocale(readConstructionLocalePreference())

    function handleLocale(event: Event) {
      const detail = (event as CustomEvent<{ language: ConstructionLanguage; technicalCountry: ConstructionTechnicalCountry }>).detail
      if (detail) setLocale(detail)
    }

    window.addEventListener(constructionLocaleEvent, handleLocale)
    return () => window.removeEventListener(constructionLocaleEvent, handleLocale)
  }, [])

  return { ...locale, copy: getConstructionCopy(locale.language) }
}
