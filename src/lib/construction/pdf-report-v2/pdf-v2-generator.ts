import { jsPDF } from "jspdf"
import { getConstructionProject, getConstructionSupabaseClient } from "../db"
import { listConstructionDetectedDocuments } from "../document-intelligence"
import { generateCostBreakdownV2 } from "../cost-engine-v2"
import { getConstructionBillingUsage } from "../billing/usage"
import { listConstructionHealthCheck } from "../score-engine"
import { buildUnlockedConstructionAnalysis } from "../unlock-engine"
import type { ConstructionHealthCheckResult, ConstructionProject, ConstructionReportRecord } from "../types"
import { canGenerateConstructionPdfV2, getConstructionPdfV2BlockedResponse } from "./pdf-v2-access"
import { safePdfV2Filename } from "./pdf-v2-formatters"
import {
  addPdfV2BudgetBySpecialty,
  addPdfV2Cover,
  addPdfV2Disclaimer,
  addPdfV2Equipment,
  addPdfV2ExecutiveSummary,
  addPdfV2LaborProductivity,
  addPdfV2MaterialsSuppliers,
  addPdfV2RisksRecommendations,
} from "./pdf-v2-sections"
import type { ConstructionPdfV2Context, ConstructionPdfV2ProjectScores, ConstructionPdfV2Result } from "./types"

function getScores(project: ConstructionProject, health: ConstructionHealthCheckResult | null): ConstructionPdfV2ProjectScores {
  return {
    maturityScore: health?.maturityScore || project.maturity_score || 0,
    riskScore: health?.riskScore || project.risk_score || 0,
    complexityScore: health?.complexityScore || project.complexity_score || 0,
    confidenceScore: health?.confidenceScore || project.confidence_score || 0,
  }
}

function buildPdfV2(context: ConstructionPdfV2Context) {
  const doc = new jsPDF({ unit: "mm", format: "a4", compress: true })

  addPdfV2Cover(doc, context)
  addPdfV2ExecutiveSummary(doc, context)
  addPdfV2BudgetBySpecialty(doc, context)
  addPdfV2MaterialsSuppliers(doc, context)
  addPdfV2LaborProductivity(doc, context)
  addPdfV2Equipment(doc, context)
  addPdfV2RisksRecommendations(doc, context)
  addPdfV2Disclaimer(doc)

  return new Uint8Array(doc.output("arraybuffer"))
}

async function recordPdfV2Report(context: ConstructionPdfV2Context) {
  const client = getConstructionSupabaseClient()

  if (!client.ok) {
    return { data: null as ConstructionReportRecord | null, warning: client.error.message }
  }

  const { data, error } = await client.supabase
    .from("construction_reports")
    .insert({
      project_id: context.project.id,
      report_type: "executive_v2",
      title: `PDF Executivo Premium V2 - ${context.project.name}`,
      status: "generated",
      summary: "Relatorio premium V2 gerado com Cost Engine V2 e Unlock Engine.",
      report_url: null,
      payload: {
        engine: "pdf-report-v2",
        cost_engine: context.costBreakdown.engineVersion,
        access_level: context.unlockedAnalysis.accessLevel,
        estimated_full_cost_range: context.costBreakdown.estimatedFullCostRange,
        total_estimated_cost: context.costBreakdown.totalEstimatedCost,
        documents_found: context.detectedDocuments.length,
        generated_at: context.generatedAt.toISOString(),
      },
      generated_at: context.generatedAt.toISOString(),
    })
    .select("id,project_id,report_type,title,status,summary,report_url,payload,generated_at,created_at,updated_at")
    .single()

  if (error) {
    return { data: null, warning: error.message }
  }

  return { data: data as ConstructionReportRecord, warning: null }
}

export async function generateConstructionExecutivePdfV2(projectId: string): Promise<ConstructionPdfV2Result> {
  try {
    const projectResult = await getConstructionProject(projectId)

    if (projectResult.error || !projectResult.data) {
      return {
        data: null,
        blocked: null,
        error: {
          code: projectResult.error?.code === "NOT_FOUND" ? "NOT_FOUND" : "SUPABASE_QUERY_FAILED",
          message: projectResult.error?.message ?? "Projeto nao encontrado.",
        },
      }
    }

    const project = projectResult.data
    const [healthResult, documentsResult, billingResult] = await Promise.all([
      listConstructionHealthCheck(projectId),
      listConstructionDetectedDocuments(projectId),
      getConstructionBillingUsage(projectId),
    ])

    if (documentsResult.error) {
      return {
        data: null,
        blocked: null,
        error: {
          code: documentsResult.error.code === "SUPABASE_NOT_CONFIGURED" ? "SUPABASE_NOT_CONFIGURED" : "SUPABASE_QUERY_FAILED",
          message: documentsResult.error.message,
        },
      }
    }

    const costResult = await generateCostBreakdownV2({
      project,
      projectId,
      detectedDocuments: documentsResult.data,
    })

    if (costResult.error || !costResult.data) {
      return {
        data: null,
        blocked: null,
        error: { code: "PDF_GENERATION_FAILED", message: costResult.error ?? "Nao foi possivel gerar o Cost Breakdown V2." },
      }
    }

    const billing = billingResult.data
    const unlockedAnalysis = buildUnlockedConstructionAnalysis({
      projectId,
      project,
      userId: project.user_id ?? null,
      organizationId: project.organization_id,
      costBreakdownV2: costResult.data,
      subscription: billing
        ? {
            status: billing.status,
            planId: billing.planId,
            planName: billing.planName,
            stripeReady: billing.stripeReady,
            remainingThisMonth: billing.remainingThisMonth,
          }
        : null,
      billingStatus: billing?.status ?? null,
    })

    if (!canGenerateConstructionPdfV2(unlockedAnalysis)) {
      return { data: null, blocked: getConstructionPdfV2BlockedResponse(), error: null }
    }

    const generatedAt = new Date()
    const context: ConstructionPdfV2Context = {
      project,
      health: healthResult.data ?? null,
      scores: getScores(project, healthResult.data ?? null),
      detectedDocuments: documentsResult.data,
      costBreakdown: costResult.data,
      unlockedAnalysis,
      generatedAt,
    }
    const bytes = buildPdfV2(context)
    const reportResult = await recordPdfV2Report(context)

    return {
      data: {
        bytes,
        filename: `iaweb-construction-executive-v2-${safePdfV2Filename(project.name)}.pdf`,
        report: reportResult.data,
        warnings: [reportResult.warning, healthResult.error?.message, billingResult.error?.message].filter((warning): warning is string => Boolean(warning)),
      },
      blocked: null,
      error: null,
    }
  } catch (error) {
    return {
      data: null,
      blocked: null,
      error: {
        code: "PDF_GENERATION_FAILED",
        message: error instanceof Error ? error.message : "Falha inesperada ao gerar PDF Executivo V2.",
      },
    }
  }
}
