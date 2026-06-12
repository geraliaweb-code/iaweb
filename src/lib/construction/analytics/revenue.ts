import type {
  ConstructionAnalyticsBenchmarkRow,
  ConstructionAnalyticsEventRow,
  ConstructionAnalyticsProjectRow,
  ConstructionAnalyticsReportRow,
  ConstructionAnalyticsRevenue,
} from "./types"

function toNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null
}

export function estimateConstructionProjectValue(input: {
  project: ConstructionAnalyticsProjectRow
  benchmarks: ConstructionAnalyticsBenchmarkRow[]
  reports: ConstructionAnalyticsReportRow[]
}) {
  const latestReport = input.reports
    .filter((report) => report.project_id === input.project.id)
    .sort((a, b) => Date.parse(b.generated_at ?? b.created_at) - Date.parse(a.generated_at ?? a.created_at))[0]
  const reportValue = toNumber(latestReport?.payload?.total_estimated_cost)

  if (reportValue) return Math.round(reportValue)

  const benchmark = input.benchmarks
    .filter((item) => item.project_id === input.project.id)
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))[0]
  const area = Number(input.project.estimated_area_m2 ?? 0) || 120

  if (benchmark?.benchmark_type === "benchmark_v2_cost_per_m2" && benchmark.project_value) {
    return Math.round(Number(benchmark.project_value) * area)
  }

  if (benchmark?.project_value) {
    const rawValue = Number(benchmark.project_value)
    return Math.round(rawValue > 10000 ? rawValue : rawValue * area)
  }

  return Math.round(area * 1320)
}

export function buildConstructionRevenueMetrics(input: {
  projects: ConstructionAnalyticsProjectRow[]
  benchmarks: ConstructionAnalyticsBenchmarkRow[]
  reports: ConstructionAnalyticsReportRow[]
  events: ConstructionAnalyticsEventRow[]
}): ConstructionAnalyticsRevenue {
  const estimatedRevenuePotential = input.projects.reduce((total, project) => {
    return total + estimateConstructionProjectValue({ project, benchmarks: input.benchmarks, reports: input.reports })
  }, 0)
  const paidProjectIds = new Set(input.events.filter((event) => event.event_type === "checkout_completed").map((event) => event.project_id).filter(Boolean))
  const unlockedProjectIds = new Set(input.events.filter((event) => event.event_type === "unlock_clicked").map((event) => event.project_id).filter(Boolean))
  const estimatedUnlockedValue = input.projects.reduce((total, project) => {
    if (!paidProjectIds.has(project.id) && !unlockedProjectIds.has(project.id)) return total
    return total + estimateConstructionProjectValue({ project, benchmarks: input.benchmarks, reports: input.reports })
  }, 0)

  return {
    estimatedRevenuePotential,
    estimatedLockedValue: Math.max(0, estimatedRevenuePotential - estimatedUnlockedValue),
    estimatedUnlockedValue,
    activeProjects: input.projects.length,
  }
}
