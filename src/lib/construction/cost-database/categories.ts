export const constructionCostCategories = [
  "Estrutura",
  "Betao",
  "Cofragem",
  "Aco",
  "Alvenaria",
  "Cobertura",
  "Isolamentos",
  "ETICS",
  "Caixilharia",
  "Pavimentos",
  "Revestimentos",
  "Carpintarias",
  "Pinturas",
  "AVAC",
  "Eletricidade",
  "Canalizacao",
  "ITED",
  "SCIE",
  "Piscinas",
  "Arranjos Exteriores",
] as const

export type ConstructionCostCategory = (typeof constructionCostCategories)[number]
export type ConstructionCostSegment = "economic" | "normal" | "premium"

export const constructionCostSegmentLabels: Record<ConstructionCostSegment, string> = {
  economic: "Economico",
  normal: "Normal",
  premium: "Premium",
}

export const dominantCategoryByProjectType: Record<string, ConstructionCostCategory> = {
  moradia: "Estrutura",
  remodelacao: "Revestimentos",
  creche: "SCIE",
  hotel: "AVAC",
  pavilhao_industrial: "Estrutura",
  restaurante: "AVAC",
  lar: "SCIE",
  industria: "Estrutura",
  comercio: "Revestimentos",
}
