import type { PlannedMaterial, PlannedPhase } from "./types"

const phaseMap: Record<string, { phase: string; procurementWindow: string; urgencyScore: number }> = {
  STRUCTURE: { phase: "Estruturas", procurementWindow: "Semana 1-6", urgencyScore: 94 },
  MASONRY: { phase: "Alvenarias", procurementWindow: "Semana 5-9", urgencyScore: 82 },
  ETICS: { phase: "ETICS", procurementWindow: "Semana 12-14", urgencyScore: 66 },
  PLASTERBOARD: { phase: "Pladur", procurementWindow: "Semana 10-16", urgencyScore: 70 },
  PAINTING: { phase: "Pintura", procurementWindow: "Semana 18-20", urgencyScore: 46 },
  FLOORING: { phase: "Pavimentos", procurementWindow: "Semana 16-19", urgencyScore: 55 },
  WINDOWS: { phase: "Caixilharias", procurementWindow: "Semana 8-12", urgencyScore: 78 },
  HVAC: { phase: "AVAC", procurementWindow: "Semana 10-17", urgencyScore: 72 },
  ELECTRICAL: { phase: "Eletricidade", procurementWindow: "Semana 7-16", urgencyScore: 74 },
  ITED: { phase: "ITED", procurementWindow: "Semana 11-17", urgencyScore: 64 },
  SCIE: { phase: "SCIE", procurementWindow: "Semana 12-18", urgencyScore: 68 },
}

export function planConstructionPhases(material: PlannedMaterial): PlannedPhase {
  return phaseMap[material.category] ?? { phase: material.specialty, procurementWindow: "Semana 8-16", urgencyScore: 58 }
}
