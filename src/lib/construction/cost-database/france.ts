import type { CountryProjectCostMatrix } from "./portugal"

export const franceCostDatabase: CountryProjectCostMatrix = {
  moradia: {
    economic: { min: 1450, max: 2050 },
    normal: { min: 2050, max: 2850 },
    premium: { min: 2850, max: 3650 },
  },
  remodelacao: {
    economic: { min: 520, max: 950 },
    normal: { min: 950, max: 1650 },
    premium: { min: 1650, max: 2400 },
  },
  creche: {
    economic: { min: 1750, max: 2300 },
    normal: { min: 2300, max: 3050 },
    premium: { min: 3050, max: 3800 },
  },
  hotel: {
    economic: { min: 2300, max: 3300 },
    normal: { min: 3300, max: 4700 },
    premium: { min: 4700, max: 6100 },
  },
  pavilhao_industrial: {
    economic: { min: 850, max: 1250 },
    normal: { min: 1250, max: 1750 },
    premium: { min: 1750, max: 2350 },
  },
  restaurante: {
    economic: { min: 1350, max: 2100 },
    normal: { min: 2100, max: 3200 },
    premium: { min: 3200, max: 4300 },
  },
  lar: {
    economic: { min: 2050, max: 2750 },
    normal: { min: 2750, max: 3700 },
    premium: { min: 3700, max: 4800 },
  },
  industria: {
    economic: { min: 1050, max: 1550 },
    normal: { min: 1550, max: 2300 },
    premium: { min: 2300, max: 3100 },
  },
  comercio: {
    economic: { min: 1050, max: 1600 },
    normal: { min: 1600, max: 2450 },
    premium: { min: 2450, max: 3400 },
  },
}
