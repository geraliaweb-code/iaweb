import { getConstructionProject } from "../db"
import { listConstructionDetectedDocuments } from "../document-intelligence"
import { getConstructionBillingUsage } from "../billing/usage"
import { generateCostBreakdownV2 } from "../cost-engine-v2"
import { buildUnlockedConstructionAnalysis } from "../unlock-engine"

export const constructionUpgradeCta = {
  title: "Desbloquear Analise Completa",
  subtitle: "Veja o orcamento completo por especialidade, materiais, fornecedores, produtividade e benchmark europeu.",
  buttonText: "Desbloquear Analise Completa",
  benefits: [
    "Orcamento completo por especialidade",
    "Materiais, fornecedores e mao de obra",
    "Produtividade estimada e prazo indicativo",
    "Benchmark europeu completo",
    "PDF Executivo Premium com recomendacoes",
  ],
}

export async function buildConstructionCommercialAnalysis(projectId: string) {
  const projectResult = await getConstructionProject(projectId)

  if (projectResult.error || !projectResult.data) {
    return {
      data: null,
      error: {
        code: projectResult.error?.code === "NOT_FOUND" ? "NOT_FOUND" : "SUPABASE_QUERY_FAILED",
        message: projectResult.error?.message ?? "Projeto nao encontrado.",
      },
    }
  }

  const project = projectResult.data
  const [documentsResult, billingResult] = await Promise.all([
    listConstructionDetectedDocuments(projectId),
    getConstructionBillingUsage(projectId),
  ])

  const costResult = await generateCostBreakdownV2({
    projectId,
    project,
    detectedDocuments: documentsResult.data ?? [],
  })

  if (costResult.error || !costResult.data) {
    return {
      data: null,
      error: { code: "COMMERCIAL_ANALYSIS_FAILED", message: costResult.error ?? "Nao foi possivel gerar Cost Preview V2." },
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

  return {
    data: {
      project,
      costBreakdownV2: costResult.data,
      unlockedAnalysis,
      warnings: [documentsResult.error?.message, billingResult.error?.message].filter((warning): warning is string => Boolean(warning)),
    },
    error: null,
  }
}
