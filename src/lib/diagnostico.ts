export type DiagnosticoFormData = {
  nome: string
  empresa: string
  email: string
  whatsapp: string
  website: string
  setor: string
  objetivo: string
}

export type ScoreCategory = "website" | "google" | "conversao" | "automacao"

export type DiagnosticoScores = Record<ScoreCategory, number>

export type DiagnosticoClassification = {
  label: "Critico" | "Em Desenvolvimento" | "Forte"
  message: string
}

export type DiagnosticoResult = {
  id?: string
  scoreFinal: number
  categorias: DiagnosticoScores
  classificacao: DiagnosticoClassification
  potencialEstimado: string
  recomendacoes: string[]
  createdAt: string
}

const objectiveSignals: Record<string, Partial<DiagnosticoScores>> = {
  "Mais contactos": { conversao: 18, website: 8 },
  "Melhorar website": { website: 18, conversao: 10 },
  "Aparecer no Google": { google: 20, website: 6 },
  "Automatizar tarefas": { automacao: 24, conversao: 4 },
  "Organizar leads": { automacao: 14, conversao: 12 },
  "Nao sei por onde comecar": { website: 4, google: 4, conversao: 4, automacao: 4 },
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)))
}

function hasLikelyWebsite(value: string) {
  const trimmed = value.trim().toLowerCase()
  if (!trimmed) return false

  return trimmed.includes(".") && !trimmed.includes(" ")
}

function hasProfessionalEmail(email: string) {
  const domain = email.split("@")[1]?.toLowerCase() ?? ""
  if (!domain) return false

  return !["gmail.com", "hotmail.com", "outlook.com", "icloud.com", "yahoo.com"].includes(domain)
}

export function calculateDiagnostico(data: DiagnosticoFormData): Omit<DiagnosticoResult, "id" | "createdAt"> {
  const hasWebsite = hasLikelyWebsite(data.website)
  const professionalEmail = hasProfessionalEmail(data.email)
  const hasWhatsApp = data.whatsapp.trim().length >= 9
  const hasSetor = data.setor.trim().length > 0
  const hasObjective = data.objetivo.trim().length > 0
  const signal = objectiveSignals[data.objetivo] ?? {}

  const categorias: DiagnosticoScores = {
    website: clampScore(32 + (hasWebsite ? 28 : 0) + (professionalEmail ? 8 : 0) + (signal.website ?? 0)),
    google: clampScore(25 + (hasWebsite ? 16 : 0) + (hasSetor ? 10 : 0) + (signal.google ?? 0)),
    conversao: clampScore(30 + (hasWebsite ? 12 : 0) + (hasWhatsApp ? 10 : 0) + (hasObjective ? 8 : 0) + (signal.conversao ?? 0)),
    automacao: clampScore(10 + (hasWhatsApp ? 6 : 0) + (hasObjective ? 6 : 0) + (signal.automacao ?? 0)),
  }

  const scoreFinal = clampScore(
    categorias.website * 0.3 +
      categorias.google * 0.22 +
      categorias.conversao * 0.28 +
      categorias.automacao * 0.2,
  )

  return {
    scoreFinal,
    categorias,
    classificacao: classifyScore(scoreFinal),
    potencialEstimado: estimatePotential(scoreFinal),
    recomendacoes: buildRecommendations(categorias, data.objetivo),
  }
}

export function classifyScore(score: number): DiagnosticoClassification {
  if (score <= 40) {
    return {
      label: "Critico",
      message:
        "A presenca digital tem bloqueios importantes. Oportunidades podem estar a ser perdidas por falta de clareza, visibilidade ou seguimento.",
    }
  }

  if (score <= 70) {
    return {
      label: "Em Desenvolvimento",
      message:
        "Ja existe uma base digital, mas ha margem clara para melhorar confianca, captacao e processo comercial.",
    }
  }

  return {
    label: "Forte",
    message:
      "A presenca digital ja tem bons fundamentos. O maior ganho esta em otimizar conversao, automacao e crescimento continuo.",
  }
}

function estimatePotential(score: number) {
  if (score <= 40) return "+25% a +50% mais contactos"
  if (score <= 70) return "+15% a +35% mais contactos"
  return "+8% a +20% mais contactos qualificados"
}

function buildRecommendations(scores: DiagnosticoScores, objetivo: string) {
  const recommendations: string[] = []

  if (scores.website < 70) {
    recommendations.push("Rever a primeira dobra do website para comunicar valor, prova e CTA em menos de cinco segundos.")
  }

  if (scores.google < 70) {
    recommendations.push("Otimizar Google Business e sinais locais para aumentar visibilidade nas pesquisas de maior intencao.")
  }

  if (scores.conversao < 70) {
    recommendations.push("Criar um caminho de conversao mais direto com CTA claro, formulario curto e resposta rapida.")
  }

  if (scores.automacao < 70) {
    recommendations.push("Ligar formularios e WhatsApp a um processo de seguimento para reduzir oportunidades perdidas.")
  }

  if (objetivo === "Automatizar tarefas") {
    recommendations.unshift("Mapear tarefas repetitivas e comecar por uma automacao simples de resposta ou follow-up.")
  }

  return recommendations.slice(0, 4)
}
