import type { ConstructionConversionEventType } from "./conversion-events"

export type ConstructionAnalyticsProjectRow = {
  id: string
  organization_id: string | null
  name: string
  project_type: string
  country: string
  estimated_area_m2: number | null
  created_at: string
  updated_at: string
}

export type ConstructionAnalyticsEventRow = {
  project_id: string | null
  organization_id: string | null
  user_id: string | null
  event_type: ConstructionConversionEventType | string
  metadata: Record<string, unknown>
  created_at: string
}

export type ConstructionAnalyticsOrganizationRow = {
  id: string
  name: string
  country: string | null
  created_at: string
}

export type ConstructionAnalyticsBenchmarkRow = {
  project_id: string
  benchmark_type: string
  benchmark_value: number
  project_value: number
  difference_percent: number
  created_at: string
}

export type ConstructionAnalyticsReportRow = {
  project_id: string
  report_type: string
  status: string
  payload: Record<string, unknown>
  generated_at: string | null
  created_at: string
}

export type ConstructionAnalyticsUploadRow = {
  project_id: string
  created_at: string
}

export type ConstructionAnalyticsFunnel = {
  uploads: number
  previewViewed: number
  unlockClicks: number
  checkoutStarted: number
  checkoutCompleted: number
}

export type ConstructionAnalyticsKpis = {
  projects: number
  previews: number
  unlockClicks: number
  checkouts: number
  payments: number
  unlockRate: number
  checkoutConversionRate: number
  previewToCheckoutRate: number
  previewToPaymentRate: number
}

export type ConstructionAnalyticsRevenue = {
  estimatedRevenuePotential: number
  estimatedLockedValue: number
  estimatedUnlockedValue: number
  activeProjects: number
}

export type ConstructionTopProjectMetric = {
  projectId: string
  projectName: string
  typology: string
  country: string
  estimatedValue: number
  lastActivity: string | null
  conversionProbability: number
}

export type ConstructionTopOrganizationMetric = {
  organizationId: string | null
  organizationName: string
  projects: number
  unlocks: number
  checkouts: number
  estimatedRevenuePotential: number
}

export type ConstructionSegmentPerformanceMetric = {
  label: string
  projects: number
  unlocks: number
  checkouts: number
  conversionRate: number
  estimatedRevenuePotential: number
}

export type ConstructionAnalyticsData = {
  generatedAt: string
  funnel: ConstructionAnalyticsFunnel
  kpis: ConstructionAnalyticsKpis
  revenue: ConstructionAnalyticsRevenue
  topProjects: ConstructionTopProjectMetric[]
  topOrganizations: ConstructionTopOrganizationMetric[]
  countryPerformance: ConstructionSegmentPerformanceMetric[]
  typologyPerformance: ConstructionSegmentPerformanceMetric[]
  warnings: string[]
}

export type ConstructionAnalyticsSourceData = {
  projects: ConstructionAnalyticsProjectRow[]
  events: ConstructionAnalyticsEventRow[]
  organizations: ConstructionAnalyticsOrganizationRow[]
  benchmarks: ConstructionAnalyticsBenchmarkRow[]
  reports: ConstructionAnalyticsReportRow[]
  uploads: ConstructionAnalyticsUploadRow[]
}
