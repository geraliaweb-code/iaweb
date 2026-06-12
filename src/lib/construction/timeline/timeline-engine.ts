import { buildCriticalPath, buildTimelineDependencies } from "./dependency-engine"
import { buildTimelineActions, evaluateDelayRisks } from "./delay-risk-engine"
import { generateTimelinePhases } from "./phase-engine"
import { buildTimelineForecast } from "./timeline-forecast"
import type { TimelineInput, TimelineOutput } from "./types"

export function generateConstructionTimeline(input: TimelineInput): TimelineOutput {
  const phases = generateTimelinePhases(input)
  const dependencies = buildTimelineDependencies(phases)
  const criticalPath = buildCriticalPath(phases, dependencies)
  const criticalPhaseIds = new Set(criticalPath.map((item) => item.phaseId))
  const markedPhases = phases.map((phase) => ({ ...phase, isCritical: criticalPhaseIds.has(phase.id) }))
  const estimatedWeeks = markedPhases.reduce((total, phase) => total + phase.estimatedWeeks, 0)
  const delayRisks = evaluateDelayRisks(input)
  const forecast = buildTimelineForecast(input, estimatedWeeks, delayRisks)
  const nextActions = buildTimelineActions(delayRisks)

  return {
    estimatedDuration: {
      weeks: estimatedWeeks,
      months: forecast.expectedMonths,
      source: "construction_schedule_matrix",
    },
    phases: markedPhases,
    dependencies,
    criticalPath,
    delayRisks,
    forecast,
    nextActions,
  }
}
