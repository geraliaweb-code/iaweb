import type { ConstructionCostSegment } from "./categories"

export type CountryCostRange = {
  min: number
  max: number
}

export type CountryProjectCostMatrix = Record<string, Record<ConstructionCostSegment, CountryCostRange>>

export const portugalCostDatabase: CountryProjectCostMatrix = {
  moradia: {
    economic: { min: 1100, max: 1550 },
    normal: { min: 1550, max: 2100 },
    premium: { min: 2100, max: 2500 },
  },
  remodelacao: {
    economic: { min: 300, max: 700 },
    normal: { min: 700, max: 1250 },
    premium: { min: 1250, max: 1800 },
  },
  creche: {
    economic: { min: 1400, max: 1800 },
    normal: { min: 1800, max: 2250 },
    premium: { min: 2250, max: 2600 },
  },
  hotel: {
    economic: { min: 1800, max: 2600 },
    normal: { min: 2600, max: 3600 },
    premium: { min: 3600, max: 4500 },
  },
  pavilhao_industrial: {
    economic: { min: 600, max: 900 },
    normal: { min: 900, max: 1200 },
    premium: { min: 1200, max: 1500 },
  },
  restaurante: {
    economic: { min: 1000, max: 1550 },
    normal: { min: 1550, max: 2300 },
    premium: { min: 2300, max: 3000 },
  },
  lar: {
    economic: { min: 1600, max: 2100 },
    normal: { min: 2100, max: 2700 },
    premium: { min: 2700, max: 3200 },
  },
  industria: {
    economic: { min: 800, max: 1200 },
    normal: { min: 1200, max: 1700 },
    premium: { min: 1700, max: 2200 },
  },
  comercio: {
    economic: { min: 800, max: 1200 },
    normal: { min: 1200, max: 1800 },
    premium: { min: 1800, max: 2500 },
  },
}
