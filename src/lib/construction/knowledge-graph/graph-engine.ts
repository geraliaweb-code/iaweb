import { getConstructionProject, getConstructionSupabaseClient } from "../db"
import { listConstructionDetectedDocuments } from "../document-intelligence"
import type { ConstructionProject } from "../types"
import { constructionGraphSeedEdges } from "./graph-edges"
import { constructionGraphSeedNodes } from "./graph-nodes"
import type {
  ConstructionDetectedElementRecord,
  ConstructionGraphEdge,
  ConstructionGraphNode,
  ConstructionGraphObservation,
  ConstructionKnowledgeGraphInput,
  ConstructionKnowledgeGraphSummary,
} from "./graph-types"

function normalize(value: string | null | undefined) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
}

function humanizeRelation(edge: ConstructionGraphEdge, nodeLabels: Map<string, string>) {
  const source = nodeLabels.get(edge.source) ?? edge.source
  const target = nodeLabels.get(edge.target) ?? edge.target
  return `${source} ${edge.relation.replace(/_/g, " ")} ${target}`
}

function uniqueById<T extends { id: string }>(items: T[]) {
  return Array.from(new Map(items.map((item) => [item.id, item])).values())
}

function buildProjectNode(project: ConstructionProject): ConstructionGraphNode {
  return {
    id: `typology:${project.project_type}`,
    type: "typology",
    label: project.project_type,
    country: project.country,
    metadata: {
      city: project.city,
      estimated_area_m2: project.estimated_area_m2,
    },
  }
}

export function buildKnowledgeGraphFromInput(input: ConstructionKnowledgeGraphInput): ConstructionKnowledgeGraphSummary {
  const nodes: ConstructionGraphNode[] = [
    ...constructionGraphSeedNodes,
    buildProjectNode(input.project),
    { id: `country:${normalize(input.project.country)}`, type: "country", label: input.project.country },
  ]
  const edges: ConstructionGraphEdge[] = [...constructionGraphSeedEdges]
  const observations: ConstructionGraphObservation[] = []

  const documentTypes = new Set(input.documents.map((document) => normalize(document.document_type)))
  const specialties = new Set(input.documents.map((document) => normalize(document.specialty)).filter(Boolean))
  const elementLabels = new Set(input.elements.map((element) => normalize(element.label || element.element_type)).filter(Boolean))
  const nodeLabels = new Map<string, string>()

  for (const document of input.documents) {
    const documentId = `document:${normalize(document.document_type)}`
    nodes.push({
      id: documentId,
      type: "document",
      label: document.document_type,
      country: document.country,
      metadata: {
        confidence_score: document.confidence_score,
        file_id: document.file_id,
        ai_analysis_status: document.ai_analysis_status,
      },
    })

    if (document.specialty) {
      const specialtyId = `specialty:${normalize(document.specialty)}`
      nodes.push({ id: specialtyId, type: "specialty", label: document.specialty, country: document.country })
      edges.push({
        id: `edge:${document.id}:belongs_to:${specialtyId}`,
        source: documentId,
        target: specialtyId,
        relation: "belongs_to",
        weight: Math.max(0.35, document.confidence_score / 100),
        evidence: "Documento classificado pelo Document Intelligence.",
      })
    }
  }

  for (const element of input.elements) {
    const elementId = `element:${normalize(element.label || element.element_type)}`
    nodes.push({
      id: elementId,
      type: "element",
      label: element.label,
      metadata: {
        element_type: element.element_type,
        quantity: element.quantity,
        unit: element.unit,
        confidence_score: element.confidence_score,
      },
    })
  }

  const hasMeasurements =
    documentTypes.has("medicoes") ||
    documentTypes.has("mapa_de_quantidades") ||
    documentTypes.has("dqe") ||
    documentTypes.has("mediciones") ||
    documentTypes.has("presupuesto")
  const hasCaderno = documentTypes.has("caderno_de_encargos") || documentTypes.has("cctp") || documentTypes.has("pliego")
  const hasStructures = specialties.has("estruturas") || documentTypes.has("estruturas")
  const hasScie = documentTypes.has("scie")
  const hasEtics = elementLabels.has("etics") || elementLabels.has("isolamento_termico_fachada")
  const hasPiscina = elementLabels.has("piscina")

  if (!hasStructures) {
    observations.push({
      id: `observation:${input.project.id}:missing_structures`,
      projectId: input.project.id,
      edgeId: "edge:missing_structures_risk",
      observationType: "derived_risk",
      title: "Ausencia de estruturas aumenta risco documental.",
      severity: "high",
      recommendation: "Confirmar se existe projeto de estruturas/estabilidade antes de fechar custo e prazo.",
    })
  }

  if (hasMeasurements) {
    observations.push({
      id: `observation:${input.project.id}:measurements_confidence`,
      projectId: input.project.id,
      observationType: "confidence_factor",
      title: "Medicoes ou documento equivalente melhoram confianca.",
      severity: "low",
      recommendation: "Usar medicoes/quantidades como base para estimativas futuras mais granulares.",
    })
  }

  if (hasCaderno) {
    observations.push({
      id: `observation:${input.project.id}:specs_maturity`,
      projectId: input.project.id,
      observationType: "maturity_factor",
      title: "Caderno de encargos ou equivalente melhora maturidade.",
      severity: "low",
      recommendation: "Cruzar especificacoes com quantidades e especialidades antes do relatorio final.",
    })
  }

  if (hasScie) {
    observations.push({
      id: `observation:${input.project.id}:scie_rule`,
      projectId: input.project.id,
      edgeId: "edge:scie_requires_rule",
      observationType: "compliance",
      title: "SCIE exige verificacao de regra de conformidade.",
      severity: "medium",
      recommendation: "Validar categoria de risco, medidas de autoprotecao e requisitos de projeto aplicaveis.",
    })
  }

  if (hasEtics) {
    observations.push({
      id: `observation:${input.project.id}:etics_cost_schedule`,
      projectId: input.project.id,
      observationType: "cost_schedule_factor",
      title: "ETICS influencia custo e prazo de fachada.",
      severity: "medium",
      recommendation: "Isolar ETICS como fator de custo/prazo em estimativas futuras.",
    })
  }

  if (hasPiscina) {
    observations.push({
      id: `observation:${input.project.id}:pool_complexity`,
      projectId: input.project.id,
      observationType: "complexity_factor",
      title: "Piscina aumenta complexidade, custo e prazo.",
      severity: "medium",
      recommendation: "Tratar piscina como pacote tecnico separado no Cost/Schedule Engine futuro.",
    })
  }

  const scoreMap = new Map(input.scores.map((score) => [score.engine, score.score]))

  if ((scoreMap.get("risk") ?? 0) >= 70) {
    observations.push({
      id: `observation:${input.project.id}:high_score_risk`,
      projectId: input.project.id,
      observationType: "score_signal",
      title: "Score de risco elevado reforca revisao documental.",
      severity: "high",
      recommendation: "Resolver documentos em falta antes de apresentar estimativas como decisao executiva.",
    })
  }

  const graphNodes = uniqueById(nodes)
  const graphEdges = uniqueById(edges)

  for (const node of graphNodes) {
    nodeLabels.set(node.id, node.label)
  }

  const mainRelations = graphEdges
    .filter((edge) => edge.weight >= 0.72 || edge.relation === "equivalent_to")
    .slice(0, 8)
    .map((edge) => humanizeRelation(edge, nodeLabels))

  return {
    mainEntities: graphNodes
      .filter((node) => ["document", "specialty", "element", "typology"].includes(node.type))
      .map((node) => node.label)
      .slice(0, 12),
    mainRelations,
    derivedRisks: observations.filter((item) => item.observationType.includes("risk") || item.severity === "high").map((item) => item.title),
    costFactors: observations.filter((item) => item.observationType.includes("cost")).map((item) => item.title),
    scheduleFactors: observations.filter((item) => item.observationType.includes("schedule")).map((item) => item.title),
    recommendations: observations.map((item) => item.recommendation).slice(0, 6),
    nodes: graphNodes,
    edges: graphEdges,
    observations,
  }
}

export async function buildProjectKnowledgeGraph(project: ConstructionProject) {
  const client = getConstructionSupabaseClient()

  if (!client.ok) {
    return { data: buildKnowledgeGraphFromInput({ project, documents: [], elements: [], scores: [] }), error: client.error }
  }

  const [documentsResult, elementsResult, scoresResult] = await Promise.all([
    listConstructionDetectedDocuments(project.id),
    client.supabase
      .from("construction_detected_elements")
      .select("id,project_id,detected_document_id,element_type,label,quantity,unit,source_reference,confidence_score,metadata,created_at")
      .eq("project_id", project.id),
    client.supabase
      .from("construction_scores")
      .select("id,project_id,engine,score,grade,rationale,inputs,created_at")
      .eq("project_id", project.id)
      .order("created_at", { ascending: false }),
  ])

  if (documentsResult.error) {
    return { data: null, error: documentsResult.error }
  }

  if (elementsResult.error) {
    return { data: null, error: { code: "SUPABASE_QUERY_FAILED" as const, message: elementsResult.error.message } }
  }

  if (scoresResult.error) {
    return { data: null, error: { code: "SUPABASE_QUERY_FAILED" as const, message: scoresResult.error.message } }
  }

  return {
    data: buildKnowledgeGraphFromInput({
      project,
      documents: documentsResult.data,
      elements: (elementsResult.data ?? []) as ConstructionDetectedElementRecord[],
      scores: scoresResult.data ?? [],
    }),
    error: null,
  }
}

export async function buildProjectKnowledgeGraphById(projectId: string) {
  const projectResult = await getConstructionProject(projectId)

  if (projectResult.error || !projectResult.data) {
    return { data: null, error: projectResult.error }
  }

  return buildProjectKnowledgeGraph(projectResult.data)
}
