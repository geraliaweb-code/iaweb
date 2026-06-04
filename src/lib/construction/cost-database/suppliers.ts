import type { ConstructionTechnicalCountry } from "../types"

export const constructionCostSuppliers: Record<ConstructionTechnicalCountry, string[]> = {
  portugal: [
    "Leroy Merlin Portugal",
    "MaxMat",
    "Bricomarche",
    "BigMat Portugal",
    "Secil",
    "Weber",
    "Revigres",
    "Margres",
  ],
  france: [
    "Point.P",
    "Gedimat",
    "BigMat France",
    "Leroy Merlin France",
    "Castorama",
    "Saint-Gobain Distribution",
  ],
  spain: [
    "Obramat",
    "Leroy Merlin Espana",
    "BigMat Espana",
    "Bauhaus Espana",
  ],
}

export function getConstructionCostSuppliers(country: ConstructionTechnicalCountry, limit = 3) {
  return constructionCostSuppliers[country].slice(0, limit)
}
