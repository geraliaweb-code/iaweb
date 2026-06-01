import { getNicheEngine } from "@/lib/niches"
import type { SalesAgentInput } from "./types"

export function safeValue(value: string | undefined, fallback: string) {
  return value?.trim() || fallback
}

export function firstName(value: string | undefined) {
  const clean = value?.trim()
  if (!clean) return ""
  return clean.split(/\s+/)[0] ?? ""
}

export function formatEuro(value: number | undefined) {
  if (!value || !Number.isFinite(value)) return ""

  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value)
}

export function buildSalesContext(input: SalesAgentInput) {
  const niche = getNicheEngine(input.niche)
  const company = safeValue(input.company, "a sua empresa")
  const contact = firstName(input.contactName)
  const projectedScore = input.projectedScore ?? Math.min(92, input.currentScore + 34)
  const improvement = input.improvementPoints ?? Math.max(0, projectedScore - input.currentScore)
  const monthlyMax = input.financialImpact?.lostRevenueMonthly?.max
  const annualMax = input.financialImpact?.lostRevenueAnnual?.max
  const potentialMonthly = formatEuro(monthlyMax)
  const potentialAnnual = formatEuro(annualMax)
  const headline =
    typeof input.generatedHomepage?.copy === "object" && input.generatedHomepage.copy !== null && "headline" in input.generatedHomepage.copy
      ? String(input.generatedHomepage.copy.headline)
      : ""

  return {
    niche,
    company,
    contact,
    greeting: contact ? `Ola ${contact}` : "Ola",
    currentScore: input.currentScore,
    projectedScore,
    improvement,
    potentialMonthly,
    potentialAnnual,
    recommendedPlan: safeValue(input.recommendedPlan, "plano recomendado IAWEB"),
    templateUsed: safeValue(input.templateUsed, "template IAWEB"),
    mainProblem: input.problems[0] ?? niche.pains[0] ?? "a presenca digital pode estar a perder oportunidades sem ser evidente",
    mainOpportunity: input.opportunities[0] ?? niche.opportunities[0] ?? "criar mais confianca e pedidos de contacto qualificados",
    visualProof: headline || `uma nova homepage preparada para ${company}`,
    citySuffix: input.city?.trim() ? ` em ${input.city.trim()}` : "",
  }
}
