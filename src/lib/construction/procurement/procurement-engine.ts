import { normalizeSupplierCountry } from "../supplier-intelligence"
import { planMaterials } from "./material-planner"
import { planConstructionPhases } from "./phase-planner"
import { scoreProcurement } from "./procurement-scoring"
import { planSuppliers } from "./supplier-planner"
import type { ProcurementItem, ProcurementPlanInput, ProcurementPlanResult } from "./types"

function roundCurrency(value: number) {
  return Math.round(value * 100) / 100
}

export function buildProcurementPlan(input: ProcurementPlanInput): ProcurementPlanResult {
  const country = normalizeSupplierCountry(input.project?.technical_country ?? input.project?.country ?? input.costBreakdown.country)
  const materials = planMaterials(input.costBreakdown)
  const procurementItems: ProcurementItem[] = materials.map((material) => {
    const supplier = planSuppliers({
      country,
      material,
      supplierRecommendations: input.supplierRecommendations,
    })
    const phase = planConstructionPhases(material)
    const score = scoreProcurement({ material, supplier, phase })

    return {
      material: material.material,
      quantity: material.quantity,
      unit: material.unit,
      supplier: supplier.supplier,
      alternativeSuppliers: supplier.alternativeSuppliers,
      phase: phase.phase,
      procurementWindow: phase.procurementWindow,
      estimatedCost: roundCurrency(material.estimatedCost),
      priority: score.procurementPriority,
      risk: score.procurementRisk,
    }
  })

  return {
    procurementItems,
    totalProcurementValue: roundCurrency(procurementItems.reduce((total, item) => total + item.estimatedCost, 0)),
    highPriorityItems: procurementItems.filter((item) => item.priority === "high" || item.priority === "critical"),
    criticalItems: procurementItems.filter((item) => item.priority === "critical" || item.risk === "critical"),
  }
}
