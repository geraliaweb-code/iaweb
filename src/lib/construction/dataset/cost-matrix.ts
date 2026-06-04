import type { ConstructionCostReferenceSeed } from "./ingestion-types"

export const constructionCostMatrix: ConstructionCostReferenceSeed[] = [
  { country: "Portugal", projectType: "moradia", minEuroM2: 1100, maxEuroM2: 2500, source: "manual_seed", notes: "Seed V1 indicativo para estimativas preliminares." },
  { country: "Portugal", projectType: "remodelacao", minEuroM2: 300, maxEuroM2: 1800, source: "manual_seed", notes: "Seed V1 indicativo para estimativas preliminares." },
  { country: "Portugal", projectType: "creche", minEuroM2: 1400, maxEuroM2: 2600, source: "manual_seed", notes: "Seed V1 indicativo para estimativas preliminares." },
  { country: "Portugal", projectType: "hotel", minEuroM2: 1800, maxEuroM2: 4500, source: "manual_seed", notes: "Seed V1 indicativo para estimativas preliminares." },
  { country: "Portugal", projectType: "pavilhao_industrial", minEuroM2: 600, maxEuroM2: 1500, source: "manual_seed", notes: "Seed V1 indicativo para estimativas preliminares." },
  { country: "Portugal", projectType: "restaurante", minEuroM2: 1000, maxEuroM2: 3000, source: "manual_seed", notes: "Seed V1 indicativo para estimativas preliminares." },
  { country: "Portugal", projectType: "lar", minEuroM2: 1600, maxEuroM2: 3200, source: "manual_seed", notes: "Seed V1 indicativo para estimativas preliminares." },
  { country: "Portugal", projectType: "industria", minEuroM2: 800, maxEuroM2: 2200, source: "manual_seed", notes: "Seed V1 indicativo para estimativas preliminares." },
  { country: "Portugal", projectType: "comercio", minEuroM2: 800, maxEuroM2: 2500, source: "manual_seed", notes: "Seed V1 indicativo para estimativas preliminares." },
]

export function getConstructionCostRange(projectType: string, country = "Portugal") {
  const direct = constructionCostMatrix.find((item) => item.projectType === projectType && item.country === country)
  const fallback = constructionCostMatrix.find((item) => item.projectType === projectType && item.country === "Portugal")
  const item = direct ?? fallback ?? constructionCostMatrix[0]

  return { min: item.minEuroM2, max: item.maxEuroM2, source: item.source }
}
