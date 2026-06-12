import type { ConstructionCostBreakdownV2 } from "../cost-engine-v2"
import type { PlannedMaterial } from "./types"

function normalizeCategory(specialty: string, material: string) {
  const value = `${specialty} ${material}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

  if (value.includes("betao") || value.includes("beto") || value.includes("aco") || value.includes("estrutura")) return "STRUCTURE"
  if (value.includes("alvenaria") || value.includes("tijolo") || value.includes("bloco")) return "MASONRY"
  if (value.includes("etics") || value.includes("sate")) return "ETICS"
  if (value.includes("pladur") || value.includes("gesso") || value.includes("plaster")) return "PLASTERBOARD"
  if (value.includes("pint")) return "PAINTING"
  if (value.includes("pavimento") || value.includes("ceram")) return "FLOORING"
  if (value.includes("caixilh") || value.includes("window") || value.includes("aluminio")) return "WINDOWS"
  if (value.includes("avac") || value.includes("hvac")) return "HVAC"
  if (value.includes("eletric") || value.includes("electric")) return "ELECTRICAL"
  if (value.includes("ited")) return "ITED"
  if (value.includes("scie") || value.includes("incend")) return "SCIE"
  return "MASONRY"
}

export function planMaterials(costBreakdown: ConstructionCostBreakdownV2): PlannedMaterial[] {
  return costBreakdown.items.map((line) => ({
    material: line.materialName || line.itemName,
    quantity: line.quantity,
    unit: line.unit,
    specialty: line.specialty,
    category: normalizeCategory(line.specialty, `${line.materialName} ${line.itemName}`),
    estimatedCost: line.subtotal,
    confidenceScore: line.confidenceScore,
    sourceLine: line,
  }))
}
