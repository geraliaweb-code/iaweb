import { getConstructionProject, getConstructionSupabaseClient } from "./db"
import { constructionTypologies, getCriticalDocumentsForCountry } from "./dataset"
import { listConstructionDetectedDocuments } from "./document-intelligence"
import { generateConstructionCostEstimate } from "./cost-engine"
import { buildProjectKnowledgeGraph } from "./knowledge-graph"
import { generateConstructionScheduleEstimate } from "./schedule-engine"
import type {
  ConstructionDetectedDocument,
  ConstructionEstimateRecord,
  ConstructionHealthCheckResult,
  ConstructionProject,
  ConstructionRiskRecord,
  ConstructionScoreRecord,
} from "./types"

type ScoreComputation = {
  maturityScore: number
  riskScore: number
  complexityScore: number
  confidenceScore: number
  identifiedSpecialties: string[]
  missingCriticalDocuments: string[]
  alerts: ConstructionHealthCheckResult["alerts"]
  rationale: Record<string, string>
}

const projectTypeComplexity: Record<string, number> = Object.fromEntries(
  constructionTypologies.map((typology) => [typology.id, typology.complexityBaseline]),
)

const countryComplexity: Record<string, number> = {
  Portugal: 42,
  Franca: 54,
  Espanha: 50,
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)))
}

function normalize(value: string | null | undefined) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
}

function getCriticalDocuments(project: ConstructionProject) {
  const documents = getCriticalDocumentsForCountry(project.country)
  return documents.length ? documents : getCriticalDocumentsForCountry("Portugal")
}

function hasDocument(documents: ConstructionDetectedDocument[], expected: string) {
  const expectedNormalized = normalize(expected)

  return documents.some((document) => {
    const documentType = normalize(document.document_type)
    const specialty = normalize(document.specialty)
    return documentType === expectedNormalized || specialty === expectedNormalized || documentType.includes(expectedNormalized)
  })
}

function averageConfidence(documents: ConstructionDetectedDocument[]) {
  if (!documents.length) return 0
  return documents.reduce((total, document) => total + (document.confidence_score ?? 0), 0) / documents.length
}

function computeScores(project: ConstructionProject, documents: ConstructionDetectedDocument[]): ScoreComputation {
  const classifiedDocuments = documents.filter((document) => document.document_type !== "unknown")
  const unknownDocuments = documents.length - classifiedDocuments.length
  const identifiedSpecialties = Array.from(
    new Set(classifiedDocuments.map((document) => document.specialty).filter((specialty): specialty is string => Boolean(specialty && specialty !== "unknown"))),
  ).sort()
  const criticalDocuments = getCriticalDocuments(project)
  const missingCriticalDocuments = criticalDocuments.filter((documentType) => !hasDocument(documents, documentType))
  const avgConfidence = averageConfidence(documents)

  const documentationPresence = Math.min(documents.length * 10, 28)
  const criticalCoverage = criticalDocuments.length
    ? ((criticalDocuments.length - missingCriticalDocuments.length) / criticalDocuments.length) * 42
    : 0
  const specialtyCoverage = Math.min(identifiedSpecialties.length * 6, 18)
  const confidenceContribution = Math.min(avgConfidence * 0.12, 12)
  const maturityScore = clampScore(documentationPresence + criticalCoverage + specialtyCoverage + confidenceContribution)

  const missingRisk = missingCriticalDocuments.length * 13
  const confidenceRisk = avgConfidence ? Math.max(0, 78 - avgConfidence) * 0.45 : 28
  const noMeasurementsRisk = criticalDocuments.some((documentType) => normalize(documentType).includes("medic") || normalize(documentType).includes("dpgf") || normalize(documentType).includes("dqe") || normalize(documentType).includes("presupuesto"))
    && !["medicoes", "mapa de quantidades", "DPGF", "DQE", "Mediciones", "Presupuesto"].some((documentType) => hasDocument(documents, documentType))
    ? 16
    : 0
  const noStructuresRisk = !hasDocument(documents, "estruturas") && project.country === "Portugal" ? 14 : 0
  const unknownRisk = unknownDocuments * 5
  const riskScore = clampScore(12 + missingRisk + confidenceRisk + noMeasurementsRisk + noStructuresRisk + unknownRisk)

  const area = project.estimated_area_m2 ?? 0
  const areaComplexity = area >= 5000 ? 28 : area >= 1500 ? 20 : area >= 500 ? 12 : area > 0 ? 6 : 10
  const specialitiesComplexity = Math.min(identifiedSpecialties.length * 5, 25)
  const country = project.country === "França" ? "Franca" : project.country
  const complexityScore = clampScore(
    (projectTypeComplexity[project.project_type] ?? 45) * 0.45 +
      (countryComplexity[country] ?? 45) * 0.2 +
      areaComplexity +
      specialitiesComplexity,
  )

  const documentVolumeConfidence = Math.min(documents.length * 8, 28)
  const criticalConfidence = criticalDocuments.length
    ? ((criticalDocuments.length - missingCriticalDocuments.length) / criticalDocuments.length) * 28
    : 0
  const confidenceScore = clampScore(documentVolumeConfidence + avgConfidence * 0.28 + criticalConfidence + maturityScore * 0.18 - riskScore * 0.18)

  const alerts: ConstructionHealthCheckResult["alerts"] = []

  for (const missingDocument of missingCriticalDocuments) {
    alerts.push({
      type: "missing_document",
      title: `Documento critico em falta: ${missingDocument}`,
      severity: "high",
      recommendation: "Adicionar ou classificar este documento antes de tomar decisoes tecnicas ou comerciais.",
    })
  }

  if (avgConfidence > 0 && avgConfidence < 55) {
    alerts.push({
      type: "low_document_confidence",
      title: "Confianca documental baixa",
      severity: "medium",
      recommendation: "Rever nomes dos ficheiros e metadata; o motor V1 depende de keywords simples.",
    })
  }

  if (riskScore >= 70) {
    alerts.push({
      type: "high_project_risk",
      title: "Risco documental elevado",
      severity: "high",
      recommendation: "Priorizar documentos criticos em falta antes de avancar para custo, prazo ou proposta.",
    })
  }

  if (!documents.length) {
    alerts.push({
      type: "no_documents",
      title: "Sem documentos classificados",
      severity: "high",
      recommendation: "Enviar ficheiros e executar Document Intelligence antes do Health Check.",
    })
  }

  return {
    maturityScore,
    riskScore,
    complexityScore,
    confidenceScore,
    identifiedSpecialties,
    missingCriticalDocuments,
    alerts: alerts.slice(0, 8),
    rationale: {
      maturity: "Baseado em documentos encontrados, cobertura critica, especialidades e confianca media.",
      risk: "Aumenta com documentos criticos em falta, baixa confianca, ausencia de medicoes/caderno/estruturas e documentos unknown.",
      complexity: "Baseado em tipo de obra, pais, area estimada e numero de especialidades identificadas.",
      confidence: "Baseado em volume documental, confianca media, documentos criticos, maturidade e risco.",
    },
  }
}

function grade(score: number, inverse = false) {
  const value = inverse ? 100 - score : score
  if (value >= 80) return "A"
  if (value >= 65) return "B"
  if (value >= 45) return "C"
  return "D"
}

export async function listConstructionHealthCheck(projectId: string) {
  const client = getConstructionSupabaseClient()

  if (!client.ok) {
    return { data: null, error: client.error }
  }

  const [scoresResult, risksResult, estimatesResult, documentsResult] = await Promise.all([
    client.supabase
      .from("construction_scores")
      .select("id,project_id,engine,score,grade,rationale,inputs,created_at")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false }),
    client.supabase
      .from("construction_risks")
      .select("id,project_id,risk_type,title,severity,probability,impact,recommendation,source,status,metadata,created_at,updated_at")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false }),
    client.supabase
      .from("construction_estimates")
      .select("id,project_id,estimate_type,currency,low_amount,expected_amount,high_amount,confidence_score,assumptions,created_at")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false }),
    listConstructionDetectedDocuments(projectId),
  ])

  if (scoresResult.error) {
    return { data: null, error: { code: "SUPABASE_QUERY_FAILED", message: scoresResult.error.message } }
  }

  if (risksResult.error) {
    return { data: null, error: { code: "SUPABASE_QUERY_FAILED", message: risksResult.error.message } }
  }

  if (estimatesResult.error) {
    return { data: null, error: { code: "SUPABASE_QUERY_FAILED", message: estimatesResult.error.message } }
  }

  if (documentsResult.error) {
    return { data: null, error: documentsResult.error }
  }

  const scores = (scoresResult.data ?? []) as ConstructionScoreRecord[]
  const risks = (risksResult.data ?? []) as ConstructionRiskRecord[]
  const estimates = (estimatesResult.data ?? []) as ConstructionEstimateRecord[]
  const latest = new Map(scores.map((score) => [score.engine, score.score]))
  const cost = estimates.find((estimate) => estimate.estimate_type === "cost_v1")
  const schedule = estimates.find((estimate) => estimate.estimate_type === "schedule_v1")
  const missingCriticalDocuments = Array.from(
    new Set(risks.filter((risk) => risk.risk_type === "missing_document").map((risk) => String(risk.metadata?.document_type ?? risk.title))),
  )
  const projectResult = await getConstructionProject(projectId)
  const knowledgeGraphResult = projectResult.data ? await buildProjectKnowledgeGraph(projectResult.data) : { data: null }

  return {
    data: {
      maturityScore: latest.get("maturity") ?? 0,
      riskScore: latest.get("risk") ?? 0,
      complexityScore: latest.get("complexity") ?? 0,
      confidenceScore: latest.get("confidence") ?? 0,
      documentsFound: documentsResult.data.length,
      identifiedSpecialties: Array.from(new Set(documentsResult.data.map((document) => document.specialty).filter(Boolean))) as string[],
      missingCriticalDocuments,
      alerts: risks.slice(0, 8).map((risk) => ({
        type: risk.risk_type,
        title: risk.title,
        severity: risk.severity,
        recommendation: risk.recommendation ?? "Rever este alerta no contexto do projeto.",
      })),
      costEstimate: cost
        ? {
            estimatedCostMin: Number(cost.low_amount ?? 0),
            estimatedCostMax: Number(cost.high_amount ?? 0),
            estimatedCostMid: Number(cost.expected_amount ?? 0),
            costConfidence: cost.confidence_score ?? 0,
            costNotes: Array.isArray(cost.assumptions) ? cost.assumptions.map(String) : [],
          }
        : null,
      scheduleEstimate: schedule
        ? {
            estimatedMonthsMin: Number(schedule.low_amount ?? 0),
            estimatedMonthsMax: Number(schedule.high_amount ?? 0),
            estimatedMonthsMid: Number(schedule.expected_amount ?? 0),
            scheduleConfidence: schedule.confidence_score ?? 0,
            scheduleNotes: Array.isArray(schedule.assumptions) ? schedule.assumptions.map(String) : [],
          }
        : null,
      estimates,
      scores,
      risks,
      knowledgeGraph: knowledgeGraphResult.data
        ? {
            mainEntities: knowledgeGraphResult.data.mainEntities,
            mainRelations: knowledgeGraphResult.data.mainRelations,
            derivedRisks: knowledgeGraphResult.data.derivedRisks,
            costFactors: knowledgeGraphResult.data.costFactors,
            scheduleFactors: knowledgeGraphResult.data.scheduleFactors,
            recommendations: knowledgeGraphResult.data.recommendations,
          }
        : null,
    } satisfies ConstructionHealthCheckResult,
    error: null,
  }
}

export async function runConstructionScores(projectId: string) {
  const projectResult = await getConstructionProject(projectId)

  if (projectResult.error) {
    return { data: null, error: projectResult.error }
  }

  const documentsResult = await listConstructionDetectedDocuments(projectId)

  if (documentsResult.error) {
    return { data: null, error: documentsResult.error }
  }

  const client = getConstructionSupabaseClient()

  if (!client.ok) {
    return { data: null, error: client.error }
  }

  const project = projectResult.data
  const documents = documentsResult.data
  const computed = computeScores(project, documents)
  const costEstimate = generateConstructionCostEstimate(project, computed)
  const scheduleEstimate = generateConstructionScheduleEstimate(project, computed)

  await client.supabase.from("construction_scores").delete().eq("project_id", projectId).in("engine", ["maturity", "risk", "complexity", "confidence"])
  await client.supabase.from("construction_risks").delete().eq("project_id", projectId).in("source", ["score-engine-v1"])
  await client.supabase.from("construction_estimates").delete().eq("project_id", projectId).in("estimate_type", ["cost_v1", "schedule_v1"])

  const scoreRows = [
    {
      project_id: projectId,
      engine: "maturity",
      score: computed.maturityScore,
      grade: grade(computed.maturityScore),
      rationale: computed.rationale.maturity,
      inputs: computed,
    },
    {
      project_id: projectId,
      engine: "risk",
      score: computed.riskScore,
      grade: grade(computed.riskScore, true),
      rationale: computed.rationale.risk,
      inputs: computed,
    },
    {
      project_id: projectId,
      engine: "complexity",
      score: computed.complexityScore,
      grade: grade(computed.complexityScore, true),
      rationale: computed.rationale.complexity,
      inputs: computed,
    },
    {
      project_id: projectId,
      engine: "confidence",
      score: computed.confidenceScore,
      grade: grade(computed.confidenceScore),
      rationale: computed.rationale.confidence,
      inputs: computed,
    },
  ]

  const scoresInsert = await client.supabase
    .from("construction_scores")
    .insert(scoreRows)
    .select("id,project_id,engine,score,grade,rationale,inputs,created_at")

  if (scoresInsert.error) {
    return { data: null, error: { code: "SUPABASE_INSERT_FAILED", message: scoresInsert.error.message } }
  }

  const riskRows = computed.alerts.map((alert) => ({
    project_id: projectId,
    risk_type: alert.type,
    title: alert.title,
    severity: alert.severity,
    probability: alert.type === "missing_document" ? "high" : "medium",
    impact: alert.severity === "high" ? "Pode comprometer decisoes tecnicas, custo ou viabilidade." : "Pode reduzir confianca do Health Check.",
    recommendation: alert.recommendation,
    source: "score-engine-v1",
    status: "open",
    metadata: {
      document_type: alert.title.replace("Documento critico em falta: ", ""),
      maturity_score: computed.maturityScore,
      risk_score: computed.riskScore,
      complexity_score: computed.complexityScore,
      confidence_score: computed.confidenceScore,
    },
  }))

  const risksInsert = riskRows.length
    ? await client.supabase
        .from("construction_risks")
        .insert(riskRows)
        .select("id,project_id,risk_type,title,severity,probability,impact,recommendation,source,status,metadata,created_at,updated_at")
    : { data: [], error: null }

  if (risksInsert.error) {
    return { data: null, error: { code: "SUPABASE_INSERT_FAILED", message: risksInsert.error.message } }
  }

  const estimatesInsert = await client.supabase
    .from("construction_estimates")
    .insert([
      {
        project_id: projectId,
        estimate_type: "cost_v1",
        currency: "EUR",
        low_amount: costEstimate.estimatedCostMin,
        expected_amount: costEstimate.estimatedCostMid,
        high_amount: costEstimate.estimatedCostMax,
        confidence_score: costEstimate.costConfidence,
        assumptions: costEstimate.costNotes,
      },
      {
        project_id: projectId,
        estimate_type: "schedule_v1",
        currency: "MONTHS",
        low_amount: scheduleEstimate.estimatedMonthsMin,
        expected_amount: scheduleEstimate.estimatedMonthsMid,
        high_amount: scheduleEstimate.estimatedMonthsMax,
        confidence_score: scheduleEstimate.scheduleConfidence,
        assumptions: scheduleEstimate.scheduleNotes,
      },
    ])
    .select("id,project_id,estimate_type,currency,low_amount,expected_amount,high_amount,confidence_score,assumptions,created_at")

  if (estimatesInsert.error) {
    return { data: null, error: { code: "SUPABASE_INSERT_FAILED", message: estimatesInsert.error.message } }
  }

  await client.supabase
    .from("construction_projects")
    .update({
      maturity_score: computed.maturityScore,
      risk_score: computed.riskScore,
      complexity_score: computed.complexityScore,
      confidence_score: computed.confidenceScore,
      updated_at: new Date().toISOString(),
    })
    .eq("id", projectId)
  const knowledgeGraphResult = await buildProjectKnowledgeGraph(project)

  return {
    data: {
      maturityScore: computed.maturityScore,
      riskScore: computed.riskScore,
      complexityScore: computed.complexityScore,
      confidenceScore: computed.confidenceScore,
      documentsFound: documents.length,
      identifiedSpecialties: computed.identifiedSpecialties,
      missingCriticalDocuments: computed.missingCriticalDocuments,
      alerts: computed.alerts,
      costEstimate,
      scheduleEstimate,
      estimates: (estimatesInsert.data ?? []) as ConstructionEstimateRecord[],
      scores: (scoresInsert.data ?? []) as ConstructionScoreRecord[],
      risks: (risksInsert.data ?? []) as ConstructionRiskRecord[],
      knowledgeGraph: knowledgeGraphResult.data
        ? {
            mainEntities: knowledgeGraphResult.data.mainEntities,
            mainRelations: knowledgeGraphResult.data.mainRelations,
            derivedRisks: knowledgeGraphResult.data.derivedRisks,
            costFactors: knowledgeGraphResult.data.costFactors,
            scheduleFactors: knowledgeGraphResult.data.scheduleFactors,
            recommendations: knowledgeGraphResult.data.recommendations,
          }
        : null,
    } satisfies ConstructionHealthCheckResult,
    error: null,
  }
}
