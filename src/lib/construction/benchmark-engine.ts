import { getConstructionProject, getConstructionSupabaseClient } from "./db"
import { listConstructionHealthCheck, runConstructionScores } from "./score-engine"
import { normalizeConstructionCountry } from "./country-intelligence"
import type { ConstructionBenchmarkRecord, ConstructionBenchmarkResult, ConstructionHealthCheckResult, ConstructionProject, ConstructionProjectType } from "./types"

type BenchmarkSample = {
  projectType: ConstructionProjectType
  country: string
  areaMin: number
  areaMax: number
  maturityScore: number
  riskScore: number
  complexityScore: number
  confidenceScore: number
  estimatedCostMid: number
  estimatedMonthsMid: number
}

type BenchmarkMetric = {
  type: string
  projectValue: number
  benchmarkValue: number
}

const mockBenchmarks: BenchmarkSample[] = [
  { projectType: "moradia", country: "Portugal", areaMin: 120, areaMax: 450, maturityScore: 62, riskScore: 48, complexityScore: 38, confidenceScore: 58, estimatedCostMid: 520000, estimatedMonthsMid: 13 },
  { projectType: "remodelacao", country: "Portugal", areaMin: 60, areaMax: 900, maturityScore: 54, riskScore: 56, complexityScore: 44, confidenceScore: 52, estimatedCostMid: 380000, estimatedMonthsMid: 4 },
  { projectType: "hotel", country: "Portugal", areaMin: 1500, areaMax: 8000, maturityScore: 68, riskScore: 52, complexityScore: 76, confidenceScore: 64, estimatedCostMid: 13800000, estimatedMonthsMid: 24 },
  { projectType: "pavilhao_industrial", country: "Portugal", areaMin: 900, areaMax: 9000, maturityScore: 59, riskScore: 50, complexityScore: 70, confidenceScore: 57, estimatedCostMid: 4200000, estimatedMonthsMid: 11 },
  { projectType: "restaurante", country: "Portugal", areaMin: 120, areaMax: 900, maturityScore: 57, riskScore: 55, complexityScore: 52, confidenceScore: 53, estimatedCostMid: 760000, estimatedMonthsMid: 5 },
  { projectType: "comercio", country: "Portugal", areaMin: 100, areaMax: 2500, maturityScore: 56, riskScore: 53, complexityScore: 50, confidenceScore: 54, estimatedCostMid: 1350000, estimatedMonthsMid: 6 },
  { projectType: "lar", country: "Portugal", areaMin: 900, areaMax: 6000, maturityScore: 66, riskScore: 54, complexityScore: 72, confidenceScore: 62, estimatedCostMid: 8800000, estimatedMonthsMid: 20 },
  { projectType: "industria", country: "Portugal", areaMin: 1000, areaMax: 12000, maturityScore: 61, riskScore: 58, complexityScore: 78, confidenceScore: 58, estimatedCostMid: 7200000, estimatedMonthsMid: 18 },
  { projectType: "creche", country: "Portugal", areaMin: 350, areaMax: 2500, maturityScore: 63, riskScore: 51, complexityScore: 60, confidenceScore: 59, estimatedCostMid: 2500000, estimatedMonthsMid: 12 },
  { projectType: "hotel", country: "França", areaMin: 1500, areaMax: 9000, maturityScore: 71, riskScore: 49, complexityScore: 78, confidenceScore: 67, estimatedCostMid: 18200000, estimatedMonthsMid: 27 },
  { projectType: "comercio", country: "Espanha", areaMin: 100, areaMax: 2500, maturityScore: 58, riskScore: 52, complexityScore: 50, confidenceScore: 56, estimatedCostMid: 1480000, estimatedMonthsMid: 6 },
]

function normalizeCountry(country: string) {
  return normalizeConstructionCountry(country)
}

function isSimilarArea(projectArea: number | null, sample: BenchmarkSample) {
  if (!projectArea) return true
  return projectArea >= sample.areaMin * 0.65 && projectArea <= sample.areaMax * 1.35
}

function average(values: number[]) {
  if (!values.length) return 0
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

function differencePercent(projectValue: number, benchmarkValue: number) {
  if (!benchmarkValue) return 0
  return Math.round(((projectValue - benchmarkValue) / benchmarkValue) * 100)
}

function classifyDifference(type: string, diff: number) {
  const lowerIsBetter = ["risk_score", "estimated_cost_mid", "estimated_months_mid"].includes(type)
  const good = lowerIsBetter ? diff <= -10 : diff >= 10
  const bad = lowerIsBetter ? diff >= 10 : diff <= -10

  if (good) return "acima da media"
  if (bad) return "abaixo da media"
  return "dentro da media"
}

function makeSummary(benchmarks: Array<Omit<ConstructionBenchmarkRecord, "id" | "project_id" | "created_at">>) {
  const risk = benchmarks.find((benchmark) => benchmark.benchmark_type === "risk_score")
  const maturity = benchmarks.find((benchmark) => benchmark.benchmark_type === "maturity_score")

  if (risk && risk.difference_percent >= 10) {
    return `A sua obra apresenta risco ${Math.abs(Math.round(risk.difference_percent))}% superior a media das obras semelhantes.`
  }

  if (maturity && maturity.difference_percent >= 10) {
    return "A sua documentacao esta acima da media do mercado."
  }

  if (risk && risk.difference_percent <= -10) {
    return `A sua obra apresenta risco ${Math.abs(Math.round(risk.difference_percent))}% inferior a media das obras semelhantes.`
  }

  return "A sua obra esta dentro da media das obras semelhantes no dataset inicial de benchmark."
}

function getMetrics(project: ConstructionProject, health: ConstructionHealthCheckResult): BenchmarkMetric[] {
  return [
    { type: "maturity_score", projectValue: health.maturityScore, benchmarkValue: 0 },
    { type: "risk_score", projectValue: health.riskScore, benchmarkValue: 0 },
    { type: "complexity_score", projectValue: health.complexityScore, benchmarkValue: 0 },
    { type: "confidence_score", projectValue: health.confidenceScore, benchmarkValue: 0 },
    { type: "estimated_cost_mid", projectValue: health.costEstimate?.estimatedCostMid ?? 0, benchmarkValue: 0 },
    { type: "estimated_months_mid", projectValue: health.scheduleEstimate?.estimatedMonthsMid ?? 0, benchmarkValue: 0 },
  ].filter((metric) => metric.projectValue > 0)
}

function computeBenchmarkRows(project: ConstructionProject, health: ConstructionHealthCheckResult) {
  const projectTechnicalCountry = normalizeConstructionCountry(project.technical_country ?? project.country)
  const sameTypeCountryArea = mockBenchmarks.filter(
    (sample) => sample.projectType === project.project_type && normalizeCountry(sample.country) === projectTechnicalCountry && isSimilarArea(project.estimated_area_m2, sample),
  )
  const sameType = mockBenchmarks.filter((sample) => sample.projectType === project.project_type)
  const matches = sameTypeCountryArea.length ? sameTypeCountryArea : sameType.length ? sameType : mockBenchmarks
  const metricAverages: Record<string, number> = {
    maturity_score: average(matches.map((sample) => sample.maturityScore)),
    risk_score: average(matches.map((sample) => sample.riskScore)),
    complexity_score: average(matches.map((sample) => sample.complexityScore)),
    confidence_score: average(matches.map((sample) => sample.confidenceScore)),
    estimated_cost_mid: average(matches.map((sample) => sample.estimatedCostMid)),
    estimated_months_mid: average(matches.map((sample) => sample.estimatedMonthsMid)),
  }

  const rows = getMetrics(project, health).map((metric) => {
    const benchmarkValue = Math.round(metricAverages[metric.type] ?? 0)
    const diff = differencePercent(metric.projectValue, benchmarkValue)

    return {
      benchmark_type: metric.type,
      benchmark_value: benchmarkValue,
      project_value: Math.round(metric.projectValue),
      difference_percent: diff,
      notes: `${classifyDifference(metric.type, diff)} face a ${matches.length} obra${matches.length === 1 ? "" : "s"} semelhante${matches.length === 1 ? "" : "s"}.`,
    }
  })

  return { rows, matches: matches.length }
}

export async function listConstructionBenchmarks(projectId: string) {
  const client = getConstructionSupabaseClient()

  if (!client.ok) {
    return { data: null, error: client.error }
  }

  const { data, error } = await client.supabase
    .from("construction_benchmarks")
    .select("id,project_id,benchmark_type,benchmark_value,project_value,difference_percent,notes,created_at")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })

  if (error) {
    return { data: null, error: { code: "SUPABASE_QUERY_FAILED", message: error.message } }
  }

  const benchmarks = (data ?? []) as ConstructionBenchmarkRecord[]

  return {
    data: {
      summary: benchmarks.length ? makeSummary(benchmarks) : "Benchmark ainda nao gerado.",
      matches: 0,
      benchmarks,
    } satisfies ConstructionBenchmarkResult,
    error: null,
  }
}

export async function runConstructionBenchmark(projectId: string) {
  const projectResult = await getConstructionProject(projectId)

  if (projectResult.error || !projectResult.data) {
    return { data: null, error: projectResult.error ?? { code: "NOT_FOUND", message: "Projeto nao encontrado." } }
  }

  const healthResult = await listConstructionHealthCheck(projectId)
  const health = healthResult.data?.scores.length ? healthResult.data : (await runConstructionScores(projectId)).data

  if (!health) {
    return { data: null, error: { code: "SUPABASE_QUERY_FAILED", message: "Nao foi possivel gerar Health Check para benchmark." } }
  }

  const client = getConstructionSupabaseClient()

  if (!client.ok) {
    return { data: null, error: client.error }
  }

  const computed = computeBenchmarkRows(projectResult.data, health)
  await client.supabase.from("construction_benchmarks").delete().eq("project_id", projectId)

  const { data, error } = await client.supabase
    .from("construction_benchmarks")
    .insert(computed.rows.map((row) => ({ ...row, project_id: projectId })))
    .select("id,project_id,benchmark_type,benchmark_value,project_value,difference_percent,notes,created_at")

  if (error) {
    return { data: null, error: { code: "SUPABASE_INSERT_FAILED", message: error.message } }
  }

  const benchmarks = (data ?? []) as ConstructionBenchmarkRecord[]

  return {
    data: {
      summary: makeSummary(benchmarks),
      matches: computed.matches,
      benchmarks,
    } satisfies ConstructionBenchmarkResult,
    error: null,
  }
}
