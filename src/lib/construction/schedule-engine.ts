import type { ConstructionProject, ConstructionScheduleEstimate } from "./types"
import { getConstructionScheduleRange } from "./dataset"

type ScheduleContext = {
  maturityScore: number
  riskScore: number
  complexityScore: number
  confidenceScore: number
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)))
}

function roundMonth(value: number) {
  return Math.max(1, Math.round(value))
}

export function generateConstructionScheduleEstimate(project: ConstructionProject, context: ScheduleContext): ConstructionScheduleEstimate {
  const matrix = getConstructionScheduleRange(project.project_type)
  const area = project.estimated_area_m2 ?? 0
  const areaFactor = area >= 5000 ? 1.25 : area >= 1500 ? 1.15 : area >= 500 ? 1.08 : 1
  const riskFactor = 1 + Math.max(0, context.riskScore - 45) / 240
  const complexityFactor = 1 + Math.max(0, context.complexityScore - 50) / 260
  const lowMaturitySpread = Math.max(0, 70 - context.maturityScore) / 180
  const lowConfidenceSpread = Math.max(0, 75 - context.confidenceScore) / 190
  const estimatedMonthsMin = roundMonth(matrix.min * areaFactor * Math.max(0.9, 1 - lowConfidenceSpread * 0.12))
  const estimatedMonthsMax = roundMonth(matrix.max * areaFactor * riskFactor * complexityFactor * (1 + lowMaturitySpread + lowConfidenceSpread))
  const estimatedMonthsMid = roundMonth((estimatedMonthsMin + estimatedMonthsMax) / 2)
  const scheduleConfidence = clampScore(context.confidenceScore * 0.5 + context.maturityScore * 0.35 - context.riskScore * 0.12)
  const scheduleNotes = [
    "Estimativa preliminar inteligente, nao substitui planeamento de obra nem cronograma contratual.",
    `Base de prazo usada: ${matrix.min} a ${matrix.max} meses ajustada por area, risco, complexidade, maturidade e confianca.`,
  ]

  if (context.riskScore >= 70) {
    scheduleNotes.push("Risco alto aumentou a faixa superior de prazo.")
  }

  if (context.complexityScore >= 70) {
    scheduleNotes.push("Complexidade alta aumentou a duracao provavel.")
  }

  if (context.confidenceScore < 50) {
    scheduleNotes.push("Confianca baixa aumentou a margem de variacao.")
  }

  return {
    estimatedMonthsMin,
    estimatedMonthsMax,
    estimatedMonthsMid,
    scheduleConfidence,
    scheduleNotes,
  }
}
