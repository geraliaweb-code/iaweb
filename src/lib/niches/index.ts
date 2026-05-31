import { accountingNiche } from "./accounting"
import { constructionNiche } from "./construction"
import { dentistNiche } from "./dentist"
import { lawyerNiche } from "./lawyer"
import { realEstateNiche } from "./real_estate"
import { restaurantNiche } from "./restaurant"
import type { NicheEngine } from "./types"

const fallbackNiche: NicheEngine = {
  id: "outro",
  label: "Outro",
  pains: [
    "A proposta de valor nao fica clara nos primeiros segundos.",
    "Contactos chegam por canais dispersos e sem seguimento estruturado.",
    "A empresa depende demasiado de recomendacao e esforco manual.",
  ],
  opportunities: [
    "Clarificar oferta, prova e CTA principal.",
    "Criar um funil simples para captar e acompanhar leads.",
    "Transformar website e WhatsApp num sistema comercial mais previsivel.",
  ],
  objections: [
    "Ja temos redes sociais.",
    "Ainda nao e prioridade investir no digital.",
    "Nao sabemos que retorno esperar.",
  ],
  salesArguments: [
    "O digital deve reduzir friccao comercial, nao apenas ficar bonito.",
    "Um sistema simples ajuda a medir procura e responder mais rapido.",
    "A primeira melhoria pode ser pequena, direta e orientada a ROI.",
  ],
  estimatedRoi: "EUR 1.000-10.000/mes em oportunidades que podem perder-se por falta de clareza, captacao e seguimento.",
  keywords: ["website profissional", "leads", "automacao", "CRM", "presenca digital"],
  personalizedDiagnosis:
    "A principal oportunidade esta em transformar presenca digital dispersa num percurso claro de captacao e seguimento.",
}

export const niches: Record<string, NicheEngine> = {
  [constructionNiche.id]: constructionNiche,
  [dentistNiche.id]: dentistNiche,
  [realEstateNiche.id]: realEstateNiche,
  [restaurantNiche.id]: restaurantNiche,
  [lawyerNiche.id]: lawyerNiche,
  [accountingNiche.id]: accountingNiche,
  outro: fallbackNiche,
}

const aliases: Record<string, string> = {
  construçao: "construcao",
  construção: "construcao",
  clinica: "clinicas",
  clinicas: "clinicas",
  clínicas: "clinicas",
  dentista: "clinicas",
  dentistas: "clinicas",
  imobiliário: "imobiliario",
  imobiliario: "imobiliario",
  restaurante: "restaurantes",
  restaurantes: "restaurantes",
  industria: "industria",
  indústria: "industria",
  "serviços b2b": "servicos B2B",
  "servicos b2b": "servicos B2B",
  advocacia: "advocacia",
  advogado: "advocacia",
  advogados: "advocacia",
  contabilidade: "contabilidade",
  contabilista: "contabilidade",
  contabilistas: "contabilidade",
  "comercio local": "outro",
  "comércio local": "outro",
}

export function getNicheEngine(niche: string): NicheEngine {
  const trimmed = niche.trim()
  const key = aliases[trimmed.toLowerCase()] ?? trimmed

  return niches[key] ?? fallbackNiche
}

export type { NicheEngine }
