export const constructionProjectTypes = [
  "moradia",
  "remodelacao",
  "creche",
  "hotel",
  "pavilhao_industrial",
  "restaurante",
  "lar",
  "industria",
  "comercio",
] as const

export const constructionCountries = ["Portugal", "França", "Espanha"] as const

export const constructionClientTypes = [
  "particular",
  "construtora",
  "arquiteto",
  "engenheiro",
  "promotor_imobiliario",
  "gabinete_tecnico",
] as const

export const constructionEngineIds = [
  "document-intelligence",
  "maturity",
  "risk",
  "cost",
  "schedule",
  "confidence",
  "benchmark",
] as const

export type ConstructionProjectType = (typeof constructionProjectTypes)[number]
export type ConstructionCountry = (typeof constructionCountries)[number]
export type ConstructionClientType = (typeof constructionClientTypes)[number]
export type ConstructionEngineId = (typeof constructionEngineIds)[number]

export type ConstructionProject = {
  id: string
  organization_id: string | null
  name: string
  project_type: ConstructionProjectType
  country: ConstructionCountry
  city: string
  estimated_area_m2: number | null
  client_type: ConstructionClientType
  status: string
  maturity_score: number | null
  risk_score: number | null
  complexity_score: number | null
  confidence_score: number | null
  analyses_count: number
  created_at: string
  updated_at: string
}

export type ConstructionFileStatus = "uploaded" | "processing" | "analyzed" | "failed"

export type ConstructionFileRecord = {
  id: string
  project_id: string
  bucket: string
  storage_path: string
  original_filename: string
  mime_type: string | null
  size_bytes: number | null
  uploaded_by: string | null
  processing_status: ConstructionFileStatus
  checksum: string | null
  metadata: Record<string, unknown>
  created_at: string
}

export type ConstructionDetectedDocument = {
  id: string
  project_id: string
  file_id: string | null
  document_type: string
  country: string | null
  specialty: string | null
  confidence_score: number
  notes: string | null
  ai_analysis_status: "not_configured" | "success" | "failed" | "fallback" | null
  ai_summary: string | null
  detected_entities: Record<string, unknown>
  title: string | null
  version: string | null
  detected_confidence: number | null
  page_count: number | null
  extracted_data: Record<string, unknown>
  created_at: string
}

export type ConstructionScoreRecord = {
  id: string
  project_id: string
  engine: string
  score: number
  grade: string | null
  rationale: string | null
  inputs: Record<string, unknown>
  created_at: string
}

export type ConstructionRiskRecord = {
  id: string
  project_id: string
  risk_type: string
  title: string
  severity: string
  probability: string
  impact: string | null
  recommendation: string | null
  source: string | null
  status: string
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export type ConstructionEstimateRecord = {
  id: string
  project_id: string
  estimate_type: string
  currency: string
  low_amount: number | null
  expected_amount: number | null
  high_amount: number | null
  confidence_score: number | null
  assumptions: Record<string, unknown> | Array<unknown>
  created_at: string
}

export type ConstructionReportRecord = {
  id: string
  project_id: string
  report_type: string
  title: string
  status: string
  summary: string | null
  report_url: string | null
  payload: Record<string, unknown>
  generated_at: string | null
  created_at: string
  updated_at: string
}

export type ConstructionBenchmarkRecord = {
  id: string
  project_id: string
  benchmark_type: string
  benchmark_value: number
  project_value: number
  difference_percent: number
  notes: string | null
  created_at: string
}

export type ConstructionBenchmarkResult = {
  summary: string
  matches: number
  benchmarks: ConstructionBenchmarkRecord[]
}

export type ConstructionCostEstimate = {
  estimatedCostMin: number
  estimatedCostMax: number
  estimatedCostMid: number
  costConfidence: number
  costNotes: string[]
}

export type ConstructionScheduleEstimate = {
  estimatedMonthsMin: number
  estimatedMonthsMax: number
  estimatedMonthsMid: number
  scheduleConfidence: number
  scheduleNotes: string[]
}

export type ConstructionHealthCheckResult = {
  maturityScore: number
  riskScore: number
  complexityScore: number
  confidenceScore: number
  documentsFound: number
  identifiedSpecialties: string[]
  missingCriticalDocuments: string[]
  alerts: Array<{
    type: string
    title: string
    severity: string
    recommendation: string
  }>
  costEstimate: ConstructionCostEstimate | null
  scheduleEstimate: ConstructionScheduleEstimate | null
  estimates: ConstructionEstimateRecord[]
  scores: ConstructionScoreRecord[]
  risks: ConstructionRiskRecord[]
  knowledgeGraph: {
    mainEntities: string[]
    mainRelations: string[]
    derivedRisks: string[]
    costFactors: string[]
    scheduleFactors: string[]
    recommendations: string[]
  } | null
}

export type ConstructionProjectInput = {
  name: string
  projectType: ConstructionProjectType
  country: ConstructionCountry
  city: string
  estimatedAreaM2?: number | null
  clientType: ConstructionClientType
}

export type ConstructionStats = {
  totalProjects: number
  analysesDone: number
  averageRisk: number
  averageMaturity: number
}

export type ConstructionSupabaseConfigError = {
  code: "SUPABASE_NOT_CONFIGURED"
  message: string
}

export type ConstructionQueryError = {
  code: "SUPABASE_QUERY_FAILED" | "SUPABASE_INSERT_FAILED" | "SUPABASE_STORAGE_FAILED" | "VALIDATION_FAILED" | "NOT_FOUND"
  message: string
}
