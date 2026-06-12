import type { DigitalAnalysis, ProspectCompany } from "./types"

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)))
}

function signal(seed: string, mod: number) {
  return seed.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) % mod
}

export function analyzeDigitalPresence(company: ProspectCompany): DigitalAnalysis {
  const base = `${company.empresa}-${company.cidade}-${company.nicho}`
  const hasWebsite = Boolean(company.website?.includes("."))
  const entropy = signal(base, 100)
  const websiteExists = hasWebsite && entropy % 9 !== 0
  const httpsEnabled = websiteExists && company.website?.startsWith("https://") === true
  const modernWebsite = websiteExists && entropy % 4 !== 0
  const mobileFriendly = websiteExists && entropy % 5 !== 0
  const googlePresence = entropy % 6 !== 0
  const socialPresence = entropy % 3 !== 0
  const whatsappVisible = Boolean(company.telefone) && entropy % 4 !== 1
  const contactForm = websiteExists && entropy % 4 !== 2
  const clearCta = websiteExists && entropy % 5 === 0
  const basicSeo = websiteExists && entropy % 3 === 0
  const reviews = googlePresence ? 5 + signal(base, 95) : 0
  const perceivedSpeed = clamp(35 + signal(`${base}-speed`, 58))
  const digitalAuthority = clamp((reviews > 30 ? 20 : 8) + (socialPresence ? 20 : 5) + (basicSeo ? 28 : 8))
  const scoreDigital = clamp(
    (websiteExists ? 18 : 0) +
      (modernWebsite ? 12 : 0) +
      (mobileFriendly ? 12 : 0) +
      (googlePresence ? 12 : 0) +
      (reviews > 20 ? 8 : 3) +
      (whatsappVisible ? 8 : 0) +
      (contactForm ? 8 : 0) +
      (clearCta ? 10 : 0) +
      (basicSeo ? 8 : 0) +
      perceivedSpeed * 0.04 +
      digitalAuthority * 0.02,
  )
  const detectedProblems = [
    !websiteExists ? "Website inexistente ou dificil de encontrar." : "",
    websiteExists && !modernWebsite ? "Website com percecao visual ultrapassada." : "",
    !mobileFriendly ? "Experiencia mobile abaixo do esperado." : "",
    !clearCta ? "CTA pouco claro para pedido de contacto." : "",
    !basicSeo ? "SEO basico e sinais de pesquisa incompletos." : "",
    !whatsappVisible ? "WhatsApp pouco visivel no percurso comercial." : "",
  ].filter(Boolean)
  const opportunities = [
    "Gerar uma homepage orientada a credibilidade e contacto.",
    "Transformar procura digital em oportunidades comerciais.",
    "Criar abordagem comercial personalizada com prova visual.",
  ]

  return {
    websiteExists,
    httpsEnabled,
    modernWebsite,
    mobileFriendly,
    googlePresence,
    reviews,
    socialPresence,
    whatsappVisible,
    contactForm,
    clearCta,
    basicSeo,
    perceivedSpeed,
    digitalAuthority,
    scoreDigital,
    detectedProblems,
    opportunities,
    commercialRisk: scoreDigital < 45 ? "alto" : scoreDigital < 70 ? "medio" : "baixo",
  }
}
