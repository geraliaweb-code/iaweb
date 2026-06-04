import type { CountryProjectCostMatrix } from "./portugal"

export const spainCostDatabase: CountryProjectCostMatrix = {
  moradia: {
    economic: { min: 1150, max: 1650 },
    normal: { min: 1650, max: 2300 },
    premium: { min: 2300, max: 3050 },
  },
  remodelacao: {
    economic: { min: 360, max: 760 },
    normal: { min: 760, max: 1350 },
    premium: { min: 1350, max: 2000 },
  },
  creche: {
    economic: { min: 1500, max: 1950 },
    normal: { min: 1950, max: 2500 },
    premium: { min: 2500, max: 3150 },
  },
  hotel: {
    economic: { min: 1950, max: 2850 },
    normal: { min: 2850, max: 4050 },
    premium: { min: 4050, max: 5200 },
  },
  pavilhao_industrial: {
    economic: { min: 650, max: 980 },
    normal: { min: 980, max: 1380 },
    premium: { min: 1380, max: 1850 },
  },
  restaurante: {
    economic: { min: 1100, max: 1750 },
    normal: { min: 1750, max: 2650 },
    premium: { min: 2650, max: 3600 },
  },
  lar: {
    economic: { min: 1700, max: 2250 },
    normal: { min: 2250, max: 3000 },
    premium: { min: 3000, max: 3900 },
  },
  industria: {
    economic: { min: 850, max: 1280 },
    normal: { min: 1280, max: 1900 },
    premium: { min: 1900, max: 2650 },
  },
  comercio: {
    economic: { min: 850, max: 1300 },
    normal: { min: 1300, max: 2050 },
    premium: { min: 2050, max: 2900 },
  },
}
