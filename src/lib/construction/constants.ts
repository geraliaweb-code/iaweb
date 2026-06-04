import type { ConstructionClientType, ConstructionCountry, ConstructionEngineId, ConstructionProjectType } from "./types"

export const constructionProjectTypeLabels: Record<ConstructionProjectType, string> = {
  moradia: "Moradia",
  remodelacao: "Remodelação",
  creche: "Creche",
  hotel: "Hotel",
  pavilhao_industrial: "Pavilhao industrial",
  restaurante: "Restaurante",
  lar: "Lar",
  industria: "Indústria",
  comercio: "Comércio",
}

export const constructionCountryLabels: Record<ConstructionCountry, string> = {
  Portugal: "Portugal",
  França: "França",
  Espanha: "Espanha",
}

export const constructionClientTypeLabels: Record<ConstructionClientType, string> = {
  particular: "Particular",
  construtora: "Construtora",
  arquiteto: "Arquiteto",
  engenheiro: "Engenheiro",
  promotor_imobiliario: "Promotor imobiliário",
  gabinete_tecnico: "Gabinete técnico",
}

export const constructionEngineCards: Array<{
  id: ConstructionEngineId
  title: string
  description: string
  status: "foundation" | "planned"
}> = [
  {
    id: "document-intelligence",
    title: "Document Intelligence",
    description: "Classificacao, leitura tecnica e deteccao de lacunas documentais.",
    status: "foundation",
  },
  {
    id: "risk",
    title: "Risk Engine",
    description: "Sinais de risco tecnico, financeiro e regulatorio para decisao executiva.",
    status: "planned",
  },
  {
    id: "cost",
    title: "Cost Engine",
    description: "Base preparada para estimativas, cenarios e impacto de decisao.",
    status: "planned",
  },
  {
    id: "schedule",
    title: "Schedule Engine",
    description: "Preparado para maturidade temporal sem planeamento avancado de obra.",
    status: "planned",
  },
  {
    id: "confidence",
    title: "Confidence Engine",
    description: "Nivel de confianca agregado por dados, documentos e consistencia.",
    status: "planned",
  },
]

export const futureConstructionEngines = [
  "Document Intelligence Engine",
  "Maturity Engine",
  "Risk Engine",
  "Cost Engine",
  "Schedule Engine",
  "Confidence Engine",
  "Benchmark Engine",
]
