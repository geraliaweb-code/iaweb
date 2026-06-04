import type { ConstructionDetectedDocument, ConstructionFileRecord } from "./types"
import { getConstructionProject, getConstructionSupabaseClient } from "./db"
import { buildCountryAwarePrompt } from "./country-intelligence"
import { getDocumentClassificationRules } from "./dataset"
import { getConstructionFileExtension } from "./file-rules"
import { listConstructionProjectFiles } from "./storage"

type ClassificationRule = {
  country: "Portugal" | "Franca" | "Espanha" | "Europa"
  documentType: string
  specialty: string
  keywords: string[]
  extensions?: string[]
  baseConfidence: number
}

export type DocumentClassification = {
  fileId: string
  filename: string
  documentType: string
  country: string
  specialty: string
  confidenceScore: number
  notes: string
  matchedKeywords: string[]
  aiAnalysisStatus?: "not_configured" | "success" | "failed" | "fallback"
  aiSummary?: string | null
  detectedEntities?: Record<string, unknown>
}

type AIDocumentAnalysis = {
  document_type: string
  country: string
  specialty: string
  construction_elements: string[]
  documentary_risks: string[]
  confidence_score: number
  executive_summary: string
}

const fallbackRules: ClassificationRule[] = [
  { country: "Portugal", documentType: "arquitetura", specialty: "arquitetura", keywords: ["arquitetura", "arquitectura", "arq", "plantas", "planta", "alçados", "alcados", "cortes"], extensions: ["pdf", "dwg", "dxf", "dwf", "dwfx"], baseConfidence: 76 },
  { country: "Portugal", documentType: "estruturas", specialty: "estruturas", keywords: ["estruturas", "estrutura", "estabilidade", "betao", "betão", "fundacoes", "fundações", "armaduras"], extensions: ["pdf", "dwg", "dxf", "ifc"], baseConfidence: 78 },
  { country: "Portugal", documentType: "medicoes", specialty: "medicoes", keywords: ["medicoes", "medições", "medicao", "medição", "autos", "quantidades"], extensions: ["xls", "xlsx", "pdf"], baseConfidence: 74 },
  { country: "Portugal", documentType: "mapa de quantidades", specialty: "medicoes", keywords: ["mapa de quantidades", "mq", "quantidades", "boq"], extensions: ["xls", "xlsx", "pdf"], baseConfidence: 82 },
  { country: "Portugal", documentType: "caderno de encargos", specialty: "caderno de encargos", keywords: ["caderno de encargos", "encargos", "condicoes tecnicas", "condições técnicas", "ct"], extensions: ["pdf", "docx"], baseConfidence: 80 },
  { country: "Portugal", documentType: "AVAC", specialty: "avac", keywords: ["avac", "hvac", "climatizacao", "climatização", "ventilacao", "ventilação"], extensions: ["pdf", "dwg", "dxf"], baseConfidence: 82 },
  { country: "Portugal", documentType: "ITED", specialty: "ited", keywords: ["ited", "telecomunicacoes", "telecomunicações", "telecom"], extensions: ["pdf", "dwg", "dxf"], baseConfidence: 88 },
  { country: "Portugal", documentType: "SCIE", specialty: "scie", keywords: ["scie", "incendio", "incêndio", "seguranca contra incendio", "segurança contra incêndio"], extensions: ["pdf", "dwg", "dxf"], baseConfidence: 88 },
  { country: "Portugal", documentType: "aguas e esgotos", specialty: "aguas e esgotos", keywords: ["aguas", "águas", "esgotos", "drenagem", "abastecimento", "redes prediais"], extensions: ["pdf", "dwg", "dxf"], baseConfidence: 80 },
  { country: "Portugal", documentType: "eletricidade", specialty: "eletricidade", keywords: ["eletricidade", "electricidade", "eletrico", "elétrico", "energia", "quadros eletricos"], extensions: ["pdf", "dwg", "dxf"], baseConfidence: 80 },

  { country: "Franca", documentType: "CCTP", specialty: "cahier des clauses techniques", keywords: ["cctp", "cahier clauses techniques", "clauses techniques"], extensions: ["pdf", "docx"], baseConfidence: 90 },
  { country: "Franca", documentType: "DPGF", specialty: "decomposition prix global forfaitaire", keywords: ["dpgf", "decomposition prix", "décomposition prix"], extensions: ["xls", "xlsx", "pdf"], baseConfidence: 90 },
  { country: "Franca", documentType: "DQE", specialty: "detail quantitatif estimatif", keywords: ["dqe", "detail quantitatif", "détail quantitatif"], extensions: ["xls", "xlsx", "pdf"], baseConfidence: 90 },
  { country: "Franca", documentType: "Plans d'Execution", specialty: "execution", keywords: ["plans execution", "plans d execution", "plans d'execution", "exe", "execution"], extensions: ["pdf", "dwg", "dxf"], baseConfidence: 84 },
  { country: "Franca", documentType: "Etude de Sol", specialty: "geotechnique", keywords: ["etude de sol", "étude de sol", "geotechnique", "géotechnique", "g1", "g2"], extensions: ["pdf"], baseConfidence: 88 },

  { country: "Espanha", documentType: "Mediciones", specialty: "mediciones", keywords: ["mediciones", "medicion", "medición"], extensions: ["xls", "xlsx", "pdf"], baseConfidence: 86 },
  { country: "Espanha", documentType: "Presupuesto", specialty: "presupuesto", keywords: ["presupuesto", "budget", "coste"], extensions: ["xls", "xlsx", "pdf"], baseConfidence: 86 },
  { country: "Espanha", documentType: "Pliego", specialty: "pliego", keywords: ["pliego", "pliego de condiciones"], extensions: ["pdf", "docx"], baseConfidence: 86 },
  { country: "Espanha", documentType: "Proyecto Basico", specialty: "proyecto", keywords: ["proyecto basico", "proyecto básico", "pb"], extensions: ["pdf"], baseConfidence: 82 },
  { country: "Espanha", documentType: "Proyecto de Ejecucion", specialty: "ejecucion", keywords: ["proyecto de ejecucion", "proyecto de ejecución", "pe"], extensions: ["pdf", "dwg", "dxf"], baseConfidence: 84 },
]

const datasetRules = getDocumentClassificationRules() as ClassificationRule[]
const rules: ClassificationRule[] = datasetRules.length ? datasetRules : fallbackRules

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[_./\\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function scoreRule(file: ConstructionFileRecord, rule: ClassificationRule) {
  const extension = getConstructionFileExtension(file.original_filename)
  const metadataText = JSON.stringify(file.metadata ?? {})
  const haystack = normalize(`${file.original_filename} ${file.mime_type ?? ""} ${metadataText}`)
  const matchedKeywords = rule.keywords.filter((keyword) => haystack.includes(normalize(keyword)))

  if (!matchedKeywords.length) {
    return null
  }

  const extensionBoost = rule.extensions?.includes(extension) ? 8 : 0
  const keywordBoost = Math.min(matchedKeywords.length * 5, 14)
  const confidenceScore = Math.min(rule.baseConfidence + extensionBoost + keywordBoost, 98)

  return {
    rule,
    confidenceScore,
    matchedKeywords,
  }
}

export function classifyConstructionFile(file: ConstructionFileRecord): DocumentClassification {
  const candidates = rules
    .map((rule) => scoreRule(file, rule))
    .filter((result): result is NonNullable<typeof result> => Boolean(result))
    .sort((a, b) => b.confidenceScore - a.confidenceScore)

  const best = candidates[0]

  if (!best) {
    const extension = getConstructionFileExtension(file.original_filename)
    const isTechnicalExtension = ["dwg", "dxf", "dwf", "dwfx", "ifc", "pdf", "xls", "xlsx", "docx"].includes(extension)

    return {
      fileId: file.id,
      filename: file.original_filename,
      documentType: "unknown",
      country: "unknown",
      specialty: "unknown",
      confidenceScore: isTechnicalExtension ? 28 : 18,
      notes: "Classificacao heuristica nao encontrou keywords suficientes no nome, extensao ou metadata.",
      matchedKeywords: [],
    }
  }

  return {
    fileId: file.id,
    filename: file.original_filename,
    documentType: best.rule.documentType,
    country: best.rule.country,
    specialty: best.rule.specialty,
    confidenceScore: best.confidenceScore,
    notes: `Classificacao por filename/metadata. Keywords: ${best.matchedKeywords.join(", ")}.`,
    matchedKeywords: best.matchedKeywords,
  }
}

function buildAIPrompt(file: ConstructionFileRecord, localClassification: DocumentClassification, country?: string | null, language = "pt") {
  return [
    buildCountryAwarePrompt(country, language === "fr" || language === "es" ? language : "pt"),
    "És um especialista europeu em documentação técnica de construção.",
    "Classifica o documento usando apenas filename, extensão, MIME e metadata fornecida.",
    "Não assumas leitura OCR, não inventes conteúdo interno e não faças análise BIM/CAD.",
    "Devolve exclusivamente JSON válido com esta estrutura:",
    '{ "document_type": string, "country": string, "specialty": string, "construction_elements": string[], "documentary_risks": string[], "confidence_score": number, "executive_summary": string }',
    "",
    "Taxonomia preferencial Portugal: arquitetura, estruturas, medições, mapa de quantidades, caderno de encargos, AVAC, ITED, SCIE, águas e esgotos, eletricidade.",
    "Taxonomia França: CCTP, DPGF, DQE, Plans d'Exécution, Étude de Sol.",
    "Taxonomia Espanha: Mediciones, Presupuesto, Pliego, Proyecto Básico, Proyecto de Ejecución.",
    "",
    `Filename: ${file.original_filename}`,
    `MIME: ${file.mime_type ?? "unknown"}`,
    `Extensão: ${getConstructionFileExtension(file.original_filename)}`,
    `Metadata: ${JSON.stringify(file.metadata ?? {})}`,
    `Classificação local fallback: ${JSON.stringify(localClassification)}`,
  ].join("\n")
}

function parseAIJson(content: string): AIDocumentAnalysis | null {
  const cleaned = content.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "")
  const parsed = JSON.parse(cleaned) as Partial<AIDocumentAnalysis>

  if (!parsed.document_type || !parsed.country || !parsed.specialty || typeof parsed.confidence_score !== "number") {
    return null
  }

  return {
    document_type: parsed.document_type,
    country: parsed.country,
    specialty: parsed.specialty,
    construction_elements: Array.isArray(parsed.construction_elements) ? parsed.construction_elements.map(String).slice(0, 20) : [],
    documentary_risks: Array.isArray(parsed.documentary_risks) ? parsed.documentary_risks.map(String).slice(0, 20) : [],
    confidence_score: Math.max(0, Math.min(100, Math.round(parsed.confidence_score))),
    executive_summary: typeof parsed.executive_summary === "string" ? parsed.executive_summary.slice(0, 600) : "",
  }
}

export async function analyzeDocumentWithAI(file: ConstructionFileRecord, localClassification: DocumentClassification, country?: string | null, language = "pt"): Promise<DocumentClassification> {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    return {
      ...localClassification,
      aiAnalysisStatus: "not_configured",
      aiSummary: null,
      detectedEntities: {
        construction_elements: [],
        documentary_risks: [],
      },
    }
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.CONSTRUCTION_AI_MODEL ?? "gpt-4o-mini",
        temperature: 0.1,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "Responde apenas com JSON válido. És um motor de Document Intelligence para construção europeia. Sê conservador quando os sinais forem fracos.",
          },
          {
            role: "user",
            content: buildAIPrompt(file, localClassification, country, language),
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error(`AI request failed: ${response.status}`)
    }

    const payload = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> }
    const content = payload.choices?.[0]?.message?.content

    if (!content) {
      throw new Error("AI response without content")
    }

    const parsed = parseAIJson(content)

    if (!parsed) {
      throw new Error("AI response did not match schema")
    }

    return {
      ...localClassification,
      documentType: parsed.document_type,
      country: parsed.country,
      specialty: parsed.specialty,
      confidenceScore: parsed.confidence_score,
      notes: `Classificacao IA V2 com fallback local disponivel. ${localClassification.notes}`,
      aiAnalysisStatus: "success",
      aiSummary: parsed.executive_summary,
      detectedEntities: {
        construction_elements: parsed.construction_elements,
        documentary_risks: parsed.documentary_risks,
      },
    }
  } catch (error) {
    return {
      ...localClassification,
      notes: `${localClassification.notes} IA indisponivel ou invalida; aplicado fallback local.`,
      aiAnalysisStatus: "fallback",
      aiSummary: null,
      detectedEntities: {
        construction_elements: [],
        documentary_risks: [error instanceof Error ? error.message : "AI analysis failed"],
      },
    }
  }
}

export async function listConstructionDetectedDocuments(projectId: string) {
  const client = getConstructionSupabaseClient()

  if (!client.ok) {
    return { data: [] as ConstructionDetectedDocument[], error: client.error }
  }

  const { data, error } = await client.supabase
    .from("construction_detected_documents")
    .select("id,project_id,file_id,document_type,country,specialty,confidence_score,notes,ai_analysis_status,ai_summary,detected_entities,title,version,detected_confidence,page_count,extracted_data,created_at")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })

  if (error) {
    return { data: [] as ConstructionDetectedDocument[], error: { code: "SUPABASE_QUERY_FAILED", message: error.message } }
  }

  return { data: (data ?? []) as ConstructionDetectedDocument[], error: null }
}

export async function analyzeConstructionProjectDocuments(projectId: string) {
  const project = await getConstructionProject(projectId)

  if (project.error) {
    return { data: [] as ConstructionDetectedDocument[], error: project.error }
  }

  const filesResult = await listConstructionProjectFiles(projectId)

  if (filesResult.error) {
    return { data: [] as ConstructionDetectedDocument[], error: filesResult.error }
  }

  const client = getConstructionSupabaseClient()

  if (!client.ok) {
    return { data: [] as ConstructionDetectedDocument[], error: client.error }
  }

  if (!filesResult.data.length) {
    return { data: [] as ConstructionDetectedDocument[], error: null }
  }

  const detected: ConstructionDetectedDocument[] = []

  for (const file of filesResult.data) {
    const localClassification = classifyConstructionFile(file)
    const classification = await analyzeDocumentWithAI(file, localClassification, project.data?.country)

    await client.supabase.from("construction_files").update({ processing_status: "processing" }).eq("id", file.id)
    await client.supabase.from("construction_detected_documents").delete().eq("project_id", projectId).eq("file_id", file.id)

    const { data, error } = await client.supabase
      .from("construction_detected_documents")
      .insert({
        project_id: projectId,
        file_id: file.id,
        document_type: classification.documentType,
        country: classification.country,
        specialty: classification.specialty,
        confidence_score: classification.confidenceScore,
        notes: classification.notes,
        ai_analysis_status: classification.aiAnalysisStatus ?? "failed",
        ai_summary: classification.aiSummary ?? null,
        detected_entities: classification.detectedEntities ?? {},
        title: classification.filename,
        detected_confidence: classification.confidenceScore,
        extracted_data: {
          engine: "document-intelligence-v1",
          ai_engine: "document-intelligence-v2",
          source: classification.aiAnalysisStatus === "success" ? "ai-with-local-fallback" : "filename-extension-metadata",
          matched_keywords: classification.matchedKeywords,
          original_filename: file.original_filename,
          extension: getConstructionFileExtension(file.original_filename),
        },
      })
      .select("id,project_id,file_id,document_type,country,specialty,confidence_score,notes,ai_analysis_status,ai_summary,detected_entities,title,version,detected_confidence,page_count,extracted_data,created_at")
      .single()

    if (error) {
      await client.supabase.from("construction_files").update({ processing_status: "failed" }).eq("id", file.id)
      return { data: detected, error: { code: "SUPABASE_INSERT_FAILED", message: error.message } }
    }

    await client.supabase.from("construction_files").update({ processing_status: "analyzed" }).eq("id", file.id)
    detected.push(data as ConstructionDetectedDocument)
  }

  await client.supabase
    .from("construction_projects")
    .update({
      analyses_count: filesResult.data.length,
      updated_at: new Date().toISOString(),
    })
    .eq("id", projectId)

  return { data: detected, error: null }
}
