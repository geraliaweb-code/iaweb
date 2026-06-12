import type { ConstructionProject } from "../types"
import type { ConstructionDetectedElementV2, ConstructionSpecialtySeed } from "./types"

function normalize(value: string | null | undefined) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}

function findDetectedQuantity(input: {
  detectedElements: ConstructionDetectedElementV2[]
  specialty: string
  fallback: number
}) {
  const specialty = normalize(input.specialty)
  const match = input.detectedElements.find((element) => {
    const haystack = normalize(`${element.element_type} ${element.label} ${element.unit ?? ""}`)
    return haystack.includes(specialty) || specialty.includes(normalize(element.element_type))
  })

  return match?.quantity && Number(match.quantity) > 0 ? Number(match.quantity) : input.fallback
}

export function estimateConstructionQuantitiesV2(input: {
  project: ConstructionProject
  detectedElements?: ConstructionDetectedElementV2[]
}): ConstructionSpecialtySeed[] {
  const area = Number(input.project.estimated_area_m2 ?? 0) || 120
  const detectedElements = input.detectedElements ?? []
  const structureQuantity = findDetectedQuantity({
    detectedElements,
    specialty: "estruturas",
    fallback: Math.max(45, Math.round(area * 0.48)),
  })

  return [
    {
      specialty: "Estruturas",
      itemName: "Betao estrutural C30/37",
      materialQuery: "Betao C30/37",
      laborSpecialty: "Estruturas",
      equipmentName: "Bombagem de betao",
      unit: "m3",
      quantity: structureQuantity,
      confidenceScore: detectedElements.length ? 74 : 58,
    },
    {
      specialty: "Pintura",
      itemName: "Pintura interior mate",
      materialQuery: "Tinta",
      laborSpecialty: "Pintura interior",
      equipmentName: "Andaime interior movel",
      unit: "m2",
      quantity: findDetectedQuantity({ detectedElements, specialty: "pintura", fallback: Math.round(area * 3.2) }),
      confidenceScore: detectedElements.length ? 72 : 56,
    },
    {
      specialty: "ETICS",
      itemName: "Sistema ETICS EPS 60 mm",
      materialQuery: "ETICS",
      laborSpecialty: "ETICS",
      equipmentName: "Andaime interior movel",
      unit: "m2",
      quantity: findDetectedQuantity({ detectedElements, specialty: "etics", fallback: Math.round(area * 0.82) }),
      confidenceScore: detectedElements.length ? 70 : 54,
    },
    {
      specialty: "Pladur",
      itemName: "Paredes e tetos em gesso laminado",
      materialQuery: "Pladur",
      laborSpecialty: "Pladur",
      unit: "m2",
      quantity: findDetectedQuantity({ detectedElements, specialty: "pladur", fallback: Math.round(area * 0.42) }),
      confidenceScore: detectedElements.length ? 70 : 54,
    },
    {
      specialty: "Pavimentos",
      itemName: "Pavimento ceramico medio formato",
      materialQuery: "Pavimentos",
      laborSpecialty: "Pavimentos",
      unit: "m2",
      quantity: findDetectedQuantity({ detectedElements, specialty: "pavimentos", fallback: Math.round(area * 0.92) }),
      confidenceScore: detectedElements.length ? 68 : 52,
    },
    {
      specialty: "Caixilharias",
      itemName: "Caixilharia aluminio com ruptura termica",
      materialQuery: "Caixilharia",
      laborSpecialty: "Caixilharia",
      unit: "m2",
      quantity: findDetectedQuantity({ detectedElements, specialty: "caixilharia", fallback: Math.round(area * 0.18) }),
      confidenceScore: detectedElements.length ? 66 : 50,
    },
  ]
}
