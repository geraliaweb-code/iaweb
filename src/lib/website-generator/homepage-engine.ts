import { getNicheEngine } from "@/lib/niches"
import { buildWebsiteComparison } from "./comparison-engine"
import { projectWebsiteScore } from "./score-projection"
import { getWebsiteTemplate } from "./templates"
import type { GeneratedHomepage, WebsiteGenerationResult, WebsiteGeneratorInput } from "./types"

function displayCompany(company: string) {
  return company.trim() || "A sua empresa"
}

export function generateHomepage(input: WebsiteGeneratorInput): GeneratedHomepage {
  const company = displayCompany(input.company)
  const template = getWebsiteTemplate(input.niche)
  const niche = getNicheEngine(input.niche)
  const services = Array.from(new Set([...template.services, ...niche.opportunities.slice(0, 2)])).slice(0, 4)
  const differentiators = Array.from(new Set([...template.differentiators, ...niche.salesArguments.slice(0, 2)])).slice(0, 5)

  return {
    templateId: template.id,
    niche: input.niche,
    palette: template.palette,
    structure: template.structure,
    salesArguments: niche.salesArguments,
    packageName: template.packageName,
    copy: {
      headline: template.headline(company),
      subheadline: `${template.subheadline(company)} ${niche.personalizedDiagnosis}`,
      cta: template.cta,
      services,
      about: template.about(company),
      differentiators,
      testimonials: template.testimonials,
      faq: template.faq,
      contactCta: template.contactCta(company),
      footer: template.footer(company),
    },
  }
}

export function generateWebsiteTransformation(input: WebsiteGeneratorInput): WebsiteGenerationResult {
  const homepage = generateHomepage(input)
  const projection = projectWebsiteScore(input, homepage.templateId)
  const comparison = buildWebsiteComparison(input, projection)

  return {
    homepage,
    projection,
    comparison,
  }
}
