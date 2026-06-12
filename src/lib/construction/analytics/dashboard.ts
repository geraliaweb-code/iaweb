import { getConstructionSupabaseClient } from "../db"
import { buildConstructionAnalyticsKpis, estimateConversionProbability, percent } from "./conversion"
import { buildConstructionAnalyticsFunnel } from "./funnel"
import { buildConstructionRevenueMetrics, estimateConstructionProjectValue } from "./revenue"
import type {
  ConstructionAnalyticsBenchmarkRow,
  ConstructionAnalyticsData,
  ConstructionAnalyticsEventRow,
  ConstructionAnalyticsOrganizationRow,
  ConstructionAnalyticsProjectRow,
  ConstructionAnalyticsReportRow,
  ConstructionAnalyticsSourceData,
  ConstructionAnalyticsUploadRow,
  ConstructionSegmentPerformanceMetric,
  ConstructionTopOrganizationMetric,
  ConstructionTopProjectMetric,
} from "./types"

async function safeSelect<T>(input: {
  table: string
  select: string
  order?: string
  ascending?: boolean
  warnings: string[]
}) {
  const client = getConstructionSupabaseClient()

  if (!client.ok) {
    input.warnings.push(client.error.message)
    return [] as T[]
  }

  let query = client.supabase.from(input.table).select(input.select)

  if (input.order) {
    query = query.order(input.order, { ascending: input.ascending ?? false })
  }

  const { data, error } = await query

  if (error) {
    input.warnings.push(`${input.table}: ${error.message}`)
    return [] as T[]
  }

  return (data ?? []) as T[]
}

async function loadConstructionAnalyticsSourceData(warnings: string[]): Promise<ConstructionAnalyticsSourceData> {
  const [projects, events, organizations, benchmarks, reports, uploads] = await Promise.all([
    safeSelect<ConstructionAnalyticsProjectRow>({
      table: "construction_projects",
      select: "id,organization_id,name,project_type,country,estimated_area_m2,created_at,updated_at",
      order: "created_at",
      warnings,
    }),
    safeSelect<ConstructionAnalyticsEventRow>({
      table: "construction_conversion_events",
      select: "project_id,organization_id,user_id,event_type,metadata,created_at",
      order: "created_at",
      warnings,
    }),
    safeSelect<ConstructionAnalyticsOrganizationRow>({
      table: "construction_organizations",
      select: "id,name,country,created_at",
      order: "created_at",
      warnings,
    }),
    safeSelect<ConstructionAnalyticsBenchmarkRow>({
      table: "construction_benchmarks",
      select: "project_id,benchmark_type,benchmark_value,project_value,difference_percent,created_at",
      order: "created_at",
      warnings,
    }),
    safeSelect<ConstructionAnalyticsReportRow>({
      table: "construction_reports",
      select: "project_id,report_type,status,payload,generated_at,created_at",
      order: "created_at",
      warnings,
    }),
    safeSelect<ConstructionAnalyticsUploadRow>({
      table: "construction_files",
      select: "project_id,created_at",
      order: "created_at",
      warnings,
    }),
  ])

  return { projects, events, organizations, benchmarks, reports, uploads }
}

function countProjectEvents(events: ConstructionAnalyticsEventRow[], projectId: string, eventType: string) {
  return events.filter((event) => event.project_id === projectId && event.event_type === eventType).length
}

function getLastActivity(project: ConstructionAnalyticsProjectRow, events: ConstructionAnalyticsEventRow[]) {
  const latestEvent = events
    .filter((event) => event.project_id === project.id)
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))[0]

  return latestEvent?.created_at ?? project.updated_at ?? project.created_at ?? null
}

function buildTopProjects(data: ConstructionAnalyticsSourceData): ConstructionTopProjectMetric[] {
  return data.projects
    .map((project) => {
      const previewViewed = countProjectEvents(data.events, project.id, "preview_viewed")
      const benchmarkViewed = countProjectEvents(data.events, project.id, "benchmark_preview_viewed")
      const pdfViewed = countProjectEvents(data.events, project.id, "pdf_preview_viewed")
      const unlockClicks = countProjectEvents(data.events, project.id, "unlock_clicked")
      const checkoutStarted = countProjectEvents(data.events, project.id, "checkout_started")
      const checkoutCompleted = countProjectEvents(data.events, project.id, "checkout_completed")

      return {
        projectId: project.id,
        projectName: project.name,
        typology: project.project_type,
        country: project.country,
        estimatedValue: estimateConstructionProjectValue({ project, benchmarks: data.benchmarks, reports: data.reports }),
        lastActivity: getLastActivity(project, data.events),
        conversionProbability: estimateConversionProbability({
          previewViewed,
          benchmarkViewed,
          pdfViewed,
          unlockClicks,
          checkoutStarted,
          checkoutCompleted,
        }),
      }
    })
    .sort((a, b) => b.conversionProbability - a.conversionProbability || b.estimatedValue - a.estimatedValue)
    .slice(0, 8)
}

function buildTopOrganizations(data: ConstructionAnalyticsSourceData): ConstructionTopOrganizationMetric[] {
  const organizationsById = new Map(data.organizations.map((organization) => [organization.id, organization]))
  const organizationIds = new Set<string | null>(data.projects.map((project) => project.organization_id ?? null))

  return Array.from(organizationIds)
    .map((organizationId) => {
      const projects = data.projects.filter((project) => (project.organization_id ?? null) === organizationId)
      const projectIds = new Set(projects.map((project) => project.id))
      const events = data.events.filter((event) => (event.organization_id && event.organization_id === organizationId) || (event.project_id && projectIds.has(event.project_id)))
      const estimatedRevenuePotential = projects.reduce((total, project) => {
        return total + estimateConstructionProjectValue({ project, benchmarks: data.benchmarks, reports: data.reports })
      }, 0)
      const organization = organizationId ? organizationsById.get(organizationId) : null

      return {
        organizationId,
        organizationName: organization?.name ?? "Projetos sem organizacao",
        projects: projects.length,
        unlocks: events.filter((event) => event.event_type === "unlock_clicked").length,
        checkouts: events.filter((event) => event.event_type === "checkout_started" || event.event_type === "checkout_completed").length,
        estimatedRevenuePotential,
      }
    })
    .sort((a, b) => b.estimatedRevenuePotential - a.estimatedRevenuePotential)
    .slice(0, 8)
}

function buildSegmentPerformance(input: {
  labels: string[]
  projects: ConstructionAnalyticsProjectRow[]
  events: ConstructionAnalyticsEventRow[]
  benchmarks: ConstructionAnalyticsBenchmarkRow[]
  reports: ConstructionAnalyticsReportRow[]
  getLabel: (project: ConstructionAnalyticsProjectRow) => string
}): ConstructionSegmentPerformanceMetric[] {
  return input.labels.map((label) => {
    const projects = input.projects.filter((project) => input.getLabel(project) === label)
    const projectIds = new Set(projects.map((project) => project.id))
    const events = input.events.filter((event) => event.project_id && projectIds.has(event.project_id))
    const unlocks = events.filter((event) => event.event_type === "unlock_clicked").length
    const checkouts = events.filter((event) => event.event_type === "checkout_completed").length
    const estimatedRevenuePotential = projects.reduce((total, project) => {
      return total + estimateConstructionProjectValue({ project, benchmarks: input.benchmarks, reports: input.reports })
    }, 0)

    return {
      label,
      projects: projects.length,
      unlocks,
      checkouts,
      conversionRate: percent(checkouts, Math.max(1, unlocks)),
      estimatedRevenuePotential,
    }
  })
}

export async function getConstructionAnalytics(): Promise<ConstructionAnalyticsData> {
  const warnings: string[] = []
  const source = await loadConstructionAnalyticsSourceData(warnings)
  const funnel = buildConstructionAnalyticsFunnel({ uploads: source.uploads, events: source.events })
  const kpis = buildConstructionAnalyticsKpis({ projects: source.projects.length, funnel })
  const revenue = buildConstructionRevenueMetrics({
    projects: source.projects,
    benchmarks: source.benchmarks,
    reports: source.reports,
    events: source.events,
  })

  return {
    generatedAt: new Date().toISOString(),
    funnel,
    kpis,
    revenue,
    topProjects: buildTopProjects(source),
    topOrganizations: buildTopOrganizations(source),
    countryPerformance: buildSegmentPerformance({
      labels: ["Portugal", "FranÃ§a", "Espanha"],
      projects: source.projects,
      events: source.events,
      benchmarks: source.benchmarks,
      reports: source.reports,
      getLabel: (project) => project.country,
    }),
    typologyPerformance: buildSegmentPerformance({
      labels: ["moradia", "hotel", "industria", "restaurante", "lar", "comercio"],
      projects: source.projects,
      events: source.events,
      benchmarks: source.benchmarks,
      reports: source.reports,
      getLabel: (project) => project.project_type,
    }),
    warnings,
  }
}
