import { getConstructionProject, getConstructionSupabaseClient } from "../db"
import { listConstructionDetectedDocuments } from "../document-intelligence"
import { normalizeCostDatabaseCountry, roundCurrency } from "../cost-database-v2"
import { resolveConstructionCostScenarioV2, resolveUnlockedRatioV2 } from "./cost-scenario-resolver"
import { estimateConstructionQuantitiesV2 } from "./quantity-estimator"
import { generateSpecialtyCostLinesV2 } from "./specialty-cost-engine"
import type { ConstructionCostBreakdownInput, ConstructionCostBreakdownV2, ConstructionDetectedElementV2, LoadedCostBreakdownContext } from "./types"

async function listConstructionDetectedElementsV2(projectId: string) {
  const client = getConstructionSupabaseClient()

  if (!client.ok) {
    return { data: [] as ConstructionDetectedElementV2[], error: client.error.message }
  }

  const { data, error } = await client.supabase
    .from("construction_detected_elements")
    .select("id,project_id,detected_document_id,element_type,label,quantity,unit,source_reference,confidence_score,metadata,created_at")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })

  return { data: (data ?? []) as ConstructionDetectedElementV2[], error: error?.message ?? null }
}

async function loadCostBreakdownContextV2(input: ConstructionCostBreakdownInput): Promise<
  | { data: LoadedCostBreakdownContext; error: null }
  | { data: null; error: string }
> {
  if (input.project) {
    return {
      data: {
        project: input.project,
        detectedDocuments: input.detectedDocuments ?? [],
        detectedElements: input.detectedElements ?? [],
      },
      error: null,
    }
  }

  if (!input.projectId) {
    return { data: null, error: "generateCostBreakdownV2 requer projectId ou project." }
  }

  const projectResult = await getConstructionProject(input.projectId)

  if (projectResult.error || !projectResult.data) {
    return { data: null, error: projectResult.error?.message ?? "Projeto nao encontrado." }
  }

  const documentsResult = input.detectedDocuments
    ? { data: input.detectedDocuments, error: null }
    : await listConstructionDetectedDocuments(input.projectId)
  const elementsResult = input.detectedElements
    ? { data: input.detectedElements, error: null }
    : await listConstructionDetectedElementsV2(input.projectId)

  return {
    data: {
      project: projectResult.data,
      detectedDocuments: documentsResult.data ?? [],
      detectedElements: elementsResult.data ?? [],
    },
    error: null,
  }
}

function averageLineConfidence(items: Array<{ confidenceScore: number }>) {
  if (!items.length) return 0
  return Math.round(items.reduce((total, item) => total + item.confidenceScore, 0) / items.length)
}

export async function generateCostBreakdownV2(input: ConstructionCostBreakdownInput): Promise<
  | { data: ConstructionCostBreakdownV2; error: null }
  | { data: null; error: string }
> {
  const context = await loadCostBreakdownContextV2(input)

  if (!context.data) {
    return { data: null, error: context.error }
  }

  const { project, detectedDocuments, detectedElements } = context.data
  const country = normalizeCostDatabaseCountry(project.technical_country ?? project.country)
  const scenario = resolveConstructionCostScenarioV2({
    project,
    detectedDocuments,
    requestedScenario: input.scenario,
  })
  const seeds = estimateConstructionQuantitiesV2({ project, detectedElements })
  const items = generateSpecialtyCostLinesV2({ country, seeds, scenario })
  const totalEstimatedCost = roundCurrency(items.reduce((total, item) => total + item.subtotal, 0))
  const unlockedRatio = resolveUnlockedRatioV2({
    unlockRatio: input.unlockRatio,
    documentsFound: detectedDocuments.length,
  })
  const unlockedCount = Math.max(1, Math.min(items.length, Math.ceil(items.length * unlockedRatio)))
  const unlockedItems = items.slice(0, unlockedCount)
  const lockedItems = items.slice(unlockedCount)
  const totalUnlockedCost = roundCurrency(unlockedItems.reduce((total, item) => total + item.subtotal, 0))
  const estimatedFullCostRange = {
    min: roundCurrency(totalEstimatedCost * 0.9),
    max: roundCurrency(totalEstimatedCost * 1.22),
  }

  return {
    data: {
      projectId: project.id,
      country,
      scenario,
      typology: project.project_type,
      areaM2: project.estimated_area_m2,
      documentsAnalyzed: detectedDocuments.length,
      elementsAnalyzed: detectedElements.length,
      items,
      unlockedItems,
      lockedItems,
      totalUnlockedCost,
      estimatedFullCostRange,
      totalEstimatedCost,
      confidenceScore: averageLineConfidence(items),
      engineVersion: "cost-engine-v2",
      warnings: [
        "Cost Engine V2 e indicativo e nao substitui orcamento final validado por medicoes e fornecedores.",
      ].filter(Boolean),
    },
    error: null,
  }
}
