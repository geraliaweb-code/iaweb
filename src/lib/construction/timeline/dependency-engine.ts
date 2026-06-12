import type { ConstructionPhase, CriticalPathItem, TimelineDependency, TimelineSeverity } from "./types"

function dependencyLabel(from: ConstructionPhase, to: ConstructionPhase) {
  return `${from.name} deve estar concluida antes de iniciar ${to.name}.`
}

function riskLevelForPhase(phase: ConstructionPhase): TimelineSeverity {
  if (["fundacoes", "estruturas", "estrutura_metalica", "instalacoes"].includes(phase.id)) return "high"
  if (["cobertura", "caixilharias", "envolvente"].includes(phase.id)) return "medium"
  return "low"
}

export function buildTimelineDependencies(phases: ConstructionPhase[]): TimelineDependency[] {
  return phases.slice(1).map((phase, index) => {
    const previous = phases[index]
    return {
      id: `${previous.id}-to-${phase.id}`,
      fromPhaseId: previous.id,
      toPhaseId: phase.id,
      type: "finish_to_start",
      rationale: dependencyLabel(previous, phase),
    }
  })
}

export function buildCriticalPath(phases: ConstructionPhase[], dependencies: TimelineDependency[]): CriticalPathItem[] {
  const criticalPhaseIds = new Set(["fundacoes", "estruturas", "estrutura_metalica", "cobertura", "envolvente", "caixilharias", "instalacoes", "acabamentos", "comissionamento"])
  const path = phases.filter((phase) => criticalPhaseIds.has(phase.id) || phase.estimatedWeeks >= 6)

  return path.map((phase) => ({
    phaseId: phase.id,
    phaseName: phase.name,
    order: phase.order,
    estimatedWeeks: phase.estimatedWeeks,
    dependencyIds: dependencies.filter((dependency) => dependency.toPhaseId === phase.id || dependency.fromPhaseId === phase.id).map((dependency) => dependency.id),
    riskLevel: riskLevelForPhase(phase),
  }))
}
