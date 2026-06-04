import type { ConstructionTechnicalCountry } from "../types"
import type { ConstructionCostSegment } from "./categories"

export type ConstructionLaborRoleRate = {
  role: string
  hourlyRate: Record<ConstructionCostSegment, number>
}

export const constructionLaborRates: Record<ConstructionTechnicalCountry, ConstructionLaborRoleRate[]> = {
  portugal: [
    { role: "Pedreiro", hourlyRate: { economic: 14, normal: 19, premium: 27 } },
    { role: "Servente", hourlyRate: { economic: 10, normal: 14, premium: 19 } },
    { role: "Carpinteiro", hourlyRate: { economic: 15, normal: 21, premium: 30 } },
    { role: "Eletricista", hourlyRate: { economic: 18, normal: 25, premium: 36 } },
    { role: "Canalizador", hourlyRate: { economic: 17, normal: 24, premium: 34 } },
    { role: "Pintor", hourlyRate: { economic: 13, normal: 18, premium: 25 } },
    { role: "Chefe de Obra", hourlyRate: { economic: 28, normal: 40, premium: 58 } },
  ],
  france: [
    { role: "Macon", hourlyRate: { economic: 30, normal: 42, premium: 58 } },
    { role: "Electricien", hourlyRate: { economic: 36, normal: 50, premium: 68 } },
    { role: "Plombier", hourlyRate: { economic: 34, normal: 48, premium: 65 } },
    { role: "Charpentier", hourlyRate: { economic: 35, normal: 50, premium: 70 } },
    { role: "Chef de Chantier", hourlyRate: { economic: 48, normal: 66, premium: 88 } },
  ],
  spain: [
    { role: "Albanil", hourlyRate: { economic: 18, normal: 26, premium: 36 } },
    { role: "Electricista", hourlyRate: { economic: 24, normal: 34, premium: 46 } },
    { role: "Fontanero", hourlyRate: { economic: 23, normal: 32, premium: 44 } },
    { role: "Carpintero", hourlyRate: { economic: 22, normal: 31, premium: 43 } },
    { role: "Jefe de Obra", hourlyRate: { economic: 34, normal: 48, premium: 66 } },
  ],
}

export function getAverageLaborRate(country: ConstructionTechnicalCountry, segment: ConstructionCostSegment) {
  const rates = constructionLaborRates[country].map((item) => item.hourlyRate[segment])
  return Math.round(rates.reduce((sum, value) => sum + value, 0) / rates.length)
}
