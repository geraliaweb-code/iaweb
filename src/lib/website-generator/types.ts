export type WebsiteGeneratorInput = {
  company: string
  niche: string
  objective: string
  tone?: string
  website?: string
  currentScore?: number
}

export type GeneratedHomepage = {
  templateId: string
  niche: string
  palette: {
    name: string
    colors: string[]
    labels: string[]
  }
  copy: {
    headline: string
    subheadline: string
    cta: string
    services: string[]
    about: string
    differentiators: string[]
    testimonials: string[]
    faq: Array<{
      question: string
      answer: string
    }>
    contactCta: string
    footer: string
  }
  structure: string[]
  salesArguments: string[]
  packageName: string
}

export type ScoreProjection = {
  currentScore: number
  projectedScore: number
  improvementPoints: number
  improvementPercent: number
  areas: {
    conversion: number
    credibility: number
    acquisition: number
    automation: number
    mobile: number
  }
}

export type WebsiteComparison = {
  before: {
    title: string
    score: number
    problems: string[]
    areas: Record<"conversion" | "seo" | "google" | "automation" | "mobile", string>
  }
  after: {
    title: string
    score: number
    improvements: string[]
    areas: Record<"conversion" | "credibility" | "acquisition" | "automation" | "mobile", string>
  }
}

export type WebsiteGenerationResult = {
  homepage: GeneratedHomepage
  projection: ScoreProjection
  comparison: WebsiteComparison
}

export type WebsiteTemplate = {
  id: string
  nicheAliases: string[]
  palette: GeneratedHomepage["palette"]
  headline: (company: string) => string
  subheadline: (company: string) => string
  cta: string
  services: string[]
  about: (company: string) => string
  differentiators: string[]
  testimonials: string[]
  faq: GeneratedHomepage["copy"]["faq"]
  contactCta: (company: string) => string
  footer: (company: string) => string
  structure: string[]
  packageName: string
}
