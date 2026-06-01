import { calculateFinanceImpact } from "@/lib/finance-impact"
import { generateSalesAgentMessages } from "@/lib/sales-agent"
import { generateWebsiteTransformation } from "@/lib/website-generator"
import { analyzeDigitalPresence } from "./digital-analysis-engine"
import { generateSimulatedCompanies } from "./lead-enrichment"
import { calculateOpportunityScore } from "./opportunity-score"
import type { ProspectCompany, ProspectorFilters, ProspectorResult } from "./types"

function getPlan(score: number, niche: string) {
  if (score < 40) return "Homepage Premium desde EUR 299"
  if (niche === "imobiliario" || niche === "contabilidade") return "IAWEB Growth Engine"
  if (score < 65) return "Sistema Comercial"
  return "Website Profissional"
}

export function analyzeProspect(company: ProspectCompany): ProspectorResult {
  const digitalAnalysis = analyzeDigitalPresence(company)
  const plan = getPlan(digitalAnalysis.scoreDigital, company.nicho)
  const financialImpact = calculateFinanceImpact({
    niche: company.nicho,
    packageName: plan,
    score: digitalAnalysis.scoreDigital,
  })
  const opportunity = calculateOpportunityScore(company, digitalAnalysis, financialImpact.lostRevenueMonthly.max)
  const website = generateWebsiteTransformation({
    company: company.empresa,
    niche: company.nicho,
    objective: "Gerar mais oportunidades comerciais",
    website: company.website,
    currentScore: digitalAnalysis.scoreDigital,
  })

  generateSalesAgentMessages({
    company: company.empresa,
    contactName: company.contacto,
    niche: company.nicho,
    city: company.cidade,
    currentScore: digitalAnalysis.scoreDigital,
    projectedScore: website.projection.projectedScore,
    improvementPoints: website.projection.improvementPoints,
    financialImpact,
    recommendedPlan: plan,
    generatedHomepage: website.homepage,
    templateUsed: website.homepage.templateId,
    problems: digitalAnalysis.detectedProblems,
    opportunities: digitalAnalysis.opportunities,
  })

  return {
    company,
    digitalAnalysis,
    opportunity,
    financialImpact,
    homepage: website.homepage,
    projectedScore: website.projection.projectedScore,
    improvement: website.projection.improvementPoints,
    templateUsed: website.homepage.templateId,
  }
}

export function generateProspects(filters: ProspectorFilters = {}) {
  return generateSimulatedCompanies(filters)
    .map(analyzeProspect)
    .filter((result) => result.opportunity.score >= (filters.scoreMin ?? 0))
    .filter((result) => result.opportunity.score <= (filters.scoreMax ?? 100))
}
