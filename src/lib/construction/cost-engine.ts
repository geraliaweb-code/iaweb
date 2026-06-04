import type { ConstructionCostEstimate, ConstructionProject } from "./types"
import { getConstructionCostRange } from "./dataset"
import { buildCostScenarios, getCountryPriceFactor } from "./cost-intelligence"
import { getConstructionCountryProfile } from "./country-intelligence"

type CostContext = {
  maturityScore: number
  riskScore: number
  complexityScore: number
  confidenceScore: number
}

const countryMultiplier: Record<string, number> = {
  Portugal: 1,
  França: 1.22,
  Espanha: 1.05,
}

function roundToHundreds(value: number) {
  return Math.round(value / 100) * 100
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)))
}

export function generateConstructionCostEstimate(project: ConstructionProject, context: CostContext): ConstructionCostEstimate {
  const area = project.estimated_area_m2 ?? 0
  const matrix = getConstructionCostRange(project.project_type, project.country)
  const countryFactor = getCountryPriceFactor(project.country)
  const countryProfile = getConstructionCountryProfile(project.country)
  const riskFactor = 1 + Math.max(0, context.riskScore - 45) / 220
  const complexityFactor = 1 + Math.max(0, context.complexityScore - 50) / 260
  const lowMaturitySpread = Math.max(0, 70 - context.maturityScore) / 220
  const lowConfidenceSpread = Math.max(0, 75 - context.confidenceScore) / 180
  const spreadFactor = 1 + lowMaturitySpread + lowConfidenceSpread
  const effectiveArea = area > 0 ? area : 100

  const baseMin = effectiveArea * matrix.min * countryFactor
  const baseMax = effectiveArea * matrix.max * countryFactor
  const estimatedCostMin = roundToHundreds(baseMin * Math.max(0.82, 1 - lowConfidenceSpread * 0.2))
  const estimatedCostMax = roundToHundreds(baseMax * riskFactor * complexityFactor * spreadFactor)
  const estimatedCostMid = roundToHundreds((estimatedCostMin + estimatedCostMax) / 2)
  const costConfidence = clampScore(context.confidenceScore * 0.55 + context.maturityScore * 0.3 - context.riskScore * 0.15)
  const scenarios = buildCostScenarios({
    baseMin: estimatedCostMin,
    baseMax: estimatedCostMax,
    country: project.country,
    confidenceScore: costConfidence,
  })
  const costNotes = [
    "Estimativa preliminar inteligente, nao substitui orçamento final nem consulta a empreiteiros.",
    `Base €/m2 usada: ${matrix.min} a ${matrix.max} ajustada por pais, risco, complexidade, maturidade e confianca.`,
  ]

  if (!area) {
    costNotes.push("Area estimada ausente; usado valor tecnico conservador de 100 m2 apenas para nao bloquear o motor V1.")
  }

  if (context.riskScore >= 70) {
    costNotes.push("Risco alto aumentou a faixa superior de custo.")
  }

  if (context.confidenceScore < 50) {
    costNotes.push("Confianca baixa aumentou o intervalo estimado.")
  }

  return {
    estimatedCostMin,
    estimatedCostMax,
    estimatedCostMid,
    costConfidence,
    costNotes,
    scenarios,
    calculationBasis: {
      technicalCountry: countryProfile.id,
      marketReference: countryProfile.publicSources.slice(0, 3).join(", "),
      documentsAnalyzed: project.analyses_count ?? 0,
      benchmarkUsed: "Benchmark V1 / dataset interno",
      missingDocuments: [],
    },
  }
}
