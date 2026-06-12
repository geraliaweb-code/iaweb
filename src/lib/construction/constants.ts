import type { ConstructionClientType, ConstructionEngineId, ConstructionProjectType } from "./types"

export const constructionProjectTypeLabels: Record<ConstructionProjectType, string> = {
  moradia: "Moradia",
  remodelacao: "Remodelacao + Ampliacao",
  creche: "Equipamento Social",
  hotel: "Hotel",
  pavilhao_industrial: "Pavilhao industrial",
  restaurante: "Restaurante",
  lar: "Lar",
  industria: "Industria",
  comercio: "Comercio",
}

export const constructionCountryLabels: Record<string, string> = {
  Portugal: "Portugal",
  Franca: "Franca",
  "FranÃ§a": "Franca",
  Espanha: "Espanha",
}

export const constructionClientTypeLabels: Record<ConstructionClientType, string> = {
  particular: "Particular",
  construtora: "Construtora",
  arquiteto: "Arquiteto",
  engenheiro: "Engenheiro",
  promotor_imobiliario: "Promotor imobiliario",
  gabinete_tecnico: "Gabinete tecnico",
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
