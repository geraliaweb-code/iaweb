import type { ConstructionScheduleReferenceSeed } from "./ingestion-types"

export const constructionScheduleMatrix: ConstructionScheduleReferenceSeed[] = [
  { projectType: "moradia", minMonths: 8, maxMonths: 18, source: "manual_seed", notes: "Seed V1 indicativo para estimativas preliminares." },
  { projectType: "remodelacao", minMonths: 1, maxMonths: 6, source: "manual_seed", notes: "Seed V1 indicativo para estimativas preliminares." },
  { projectType: "creche", minMonths: 8, maxMonths: 16, source: "manual_seed", notes: "Seed V1 indicativo para estimativas preliminares." },
  { projectType: "hotel", minMonths: 12, maxMonths: 30, source: "manual_seed", notes: "Seed V1 indicativo para estimativas preliminares." },
  { projectType: "pavilhao_industrial", minMonths: 6, maxMonths: 14, source: "manual_seed", notes: "Seed V1 indicativo para estimativas preliminares." },
  { projectType: "restaurante", minMonths: 2, maxMonths: 8, source: "manual_seed", notes: "Seed V1 indicativo para estimativas preliminares." },
  { projectType: "lar", minMonths: 12, maxMonths: 24, source: "manual_seed", notes: "Seed V1 indicativo para estimativas preliminares." },
  { projectType: "industria", minMonths: 8, maxMonths: 24, source: "manual_seed", notes: "Seed V1 indicativo para estimativas preliminares." },
  { projectType: "comercio", minMonths: 2, maxMonths: 9, source: "manual_seed", notes: "Seed V1 indicativo para estimativas preliminares." },
]

export function getConstructionScheduleRange(projectType: string) {
  const item = constructionScheduleMatrix.find((entry) => entry.projectType === projectType) ?? constructionScheduleMatrix[0]
  return { min: item.minMonths, max: item.maxMonths, source: item.source }
}
