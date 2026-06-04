import { es } from "./es"
import { fr } from "./fr"
import { pt } from "./pt"

export type ConstructionLanguage = "pt" | "fr" | "es"

export const constructionI18n = { pt, fr, es }

export function getConstructionLanguage(value?: string | null): ConstructionLanguage {
  return value === "fr" || value === "es" || value === "pt" ? value : "pt"
}

export function getConstructionCopy(language?: string | null) {
  return constructionI18n[getConstructionLanguage(language)]
}
