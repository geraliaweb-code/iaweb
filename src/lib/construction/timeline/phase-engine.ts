import { getConstructionScheduleRange } from "../dataset"
import type { ConstructionPhase, TimelineInput } from "./types"

type PhaseSeed = {
  id: string
  name: string
  weight: number
  specialties: string[]
}

const basePhases: PhaseSeed[] = [
  { id: "preparacao", name: "Preparacao", weight: 0.08, specialties: ["gestao", "seguranca"] },
  { id: "terraplanagem", name: "Terraplanagem", weight: 0.08, specialties: ["terraplanagem"] },
  { id: "fundacoes", name: "Fundacoes", weight: 0.12, specialties: ["estruturas", "betao"] },
  { id: "estruturas", name: "Estruturas", weight: 0.18, specialties: ["estruturas", "betao", "aco"] },
  { id: "alvenarias", name: "Alvenarias", weight: 0.11, specialties: ["alvenarias", "fachadas"] },
  { id: "cobertura", name: "Cobertura", weight: 0.09, specialties: ["cobertura", "impermeabilizacao"] },
  { id: "caixilharias", name: "Caixilharias", weight: 0.08, specialties: ["caixilharias", "vidros"] },
  { id: "instalacoes", name: "Instalacoes", weight: 0.14, specialties: ["avac", "eletricidade", "aguas", "telecomunicacoes"] },
  { id: "acabamentos", name: "Acabamentos", weight: 0.1, specialties: ["acabamentos", "pintura", "revestimentos"] },
  { id: "entrega", name: "Entrega", weight: 0.02, specialties: ["vistoria", "licenciamento"] },
]

const typologyOverrides: Partial<Record<string, PhaseSeed[]>> = {
  remodelacao: [
    { id: "preparacao", name: "Preparacao", weight: 0.1, specialties: ["gestao", "seguranca"] },
    { id: "demolicoes", name: "Demolicoes", weight: 0.14, specialties: ["demolicoes"] },
    { id: "infraestruturas", name: "Infraestruturas", weight: 0.18, specialties: ["avac", "eletricidade", "aguas"] },
    { id: "revestimentos", name: "Revestimentos", weight: 0.24, specialties: ["revestimentos", "pavimentos"] },
    { id: "acabamentos", name: "Acabamentos", weight: 0.24, specialties: ["acabamentos", "pintura"] },
    { id: "entrega", name: "Entrega", weight: 0.08, specialties: ["vistoria"] },
  ],
  hotel: [
    ...basePhases.slice(0, 8),
    { id: "cozinhas_e_quartos", name: "Cozinhas e quartos", weight: 0.09, specialties: ["equipamentos", "acabamentos"] },
    { id: "comissionamento", name: "Comissionamento", weight: 0.05, specialties: ["avac", "seguranca", "licenciamento"] },
    { id: "entrega", name: "Entrega", weight: 0.02, specialties: ["vistoria", "licenciamento"] },
  ],
  pavilhao_industrial: [
    { id: "preparacao", name: "Preparacao", weight: 0.08, specialties: ["gestao"] },
    { id: "terraplanagem", name: "Terraplanagem", weight: 0.12, specialties: ["terraplanagem"] },
    { id: "fundacoes", name: "Fundacoes", weight: 0.16, specialties: ["estruturas", "betao"] },
    { id: "estrutura_metalica", name: "Estrutura metalica", weight: 0.22, specialties: ["aco", "estruturas"] },
    { id: "envolvente", name: "Envolvente", weight: 0.16, specialties: ["cobertura", "fachadas"] },
    { id: "instalacoes", name: "Instalacoes", weight: 0.16, specialties: ["eletricidade", "avac", "seguranca"] },
    { id: "acabamentos", name: "Acabamentos", weight: 0.06, specialties: ["acabamentos"] },
    { id: "entrega", name: "Entrega", weight: 0.04, specialties: ["vistoria"] },
  ],
}

function roundWeeks(value: number) {
  return Math.max(1, Math.round(value))
}

function normalizeWeights(phases: PhaseSeed[]) {
  const total = phases.reduce((sum, phase) => sum + phase.weight, 0) || 1
  return phases.map((phase) => ({ ...phase, weight: phase.weight / total }))
}

function resolveDurationWeeks(input: TimelineInput) {
  const projectType = input.project?.project_type ?? "moradia"
  const matrix = getConstructionScheduleRange(projectType)
  const area = input.project?.estimated_area_m2 ?? 0
  const complexity = input.complexityScore ?? input.healthCheck?.complexityScore ?? input.project?.complexity_score ?? 50
  const risk = input.riskScore ?? input.healthCheck?.riskScore ?? input.project?.risk_score ?? 45
  const confidence = input.confidenceScore ?? input.healthCheck?.confidenceScore ?? input.project?.confidence_score ?? 65
  const areaFactor = area >= 5000 ? 1.22 : area >= 1500 ? 1.14 : area >= 500 ? 1.07 : 1
  const scoreFactor = 1 + Math.max(0, complexity - 55) / 360 + Math.max(0, risk - 55) / 340 + Math.max(0, 62 - confidence) / 420
  const expectedMonths = ((matrix.min + matrix.max) / 2) * areaFactor * scoreFactor

  return {
    weeks: roundWeeks(expectedMonths * 4.345),
    source: matrix.source,
  }
}

export function generateTimelinePhases(input: TimelineInput): ConstructionPhase[] {
  const seeds = normalizeWeights(typologyOverrides[input.project?.project_type ?? ""] ?? basePhases)
  const duration = resolveDurationWeeks(input)
  let cursor = 1

  return seeds.map((seed, index) => {
    const estimatedWeeks = roundWeeks(duration.weeks * seed.weight)
    const phase: ConstructionPhase = {
      id: seed.id,
      name: seed.name,
      order: index + 1,
      estimatedWeeks,
      startWeek: cursor,
      endWeek: cursor + estimatedWeeks - 1,
      specialties: seed.specialties,
      isCritical: false,
    }
    cursor += estimatedWeeks
    return phase
  })
}
