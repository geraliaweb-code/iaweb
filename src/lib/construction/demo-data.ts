import type { ConstructionDetectedDocument, ConstructionHealthCheckResult, ConstructionLearningEvent, ConstructionProject } from "./types"

const now = new Date().toISOString()
const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
const fiveHoursAgo = new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()

export const constructionDemoProject: ConstructionProject = {
  id: "demo",
  organization_id: null,
  name: "PT-001 - Equipamento Social",
  project_type: "creche",
  country: "Portugal",
  language: "pt",
  technical_country: "portugal",
  city: "Lisboa",
  estimated_area_m2: 1280,
  client_type: "gabinete_tecnico",
  status: "alfa",
  maturity_score: 78,
  risk_score: 36,
  complexity_score: 74,
  confidence_score: 81,
  analyses_count: 12,
  created_at: now,
  updated_at: now,
}

function demoDocument(input: {
  id: string
  documentType: string
  specialty: string
  confidence: number
  title: string
  summary?: string | null
  risks?: string[]
}): ConstructionDetectedDocument {
  return {
    id: input.id,
    project_id: "demo",
    file_id: `${input.id}-file`,
    document_type: input.documentType,
    country: "Portugal",
    specialty: input.specialty,
    confidence_score: input.confidence,
    notes: "Classificacao demo por keywords tecnicas.",
    ai_analysis_status: input.summary ? "success" : "fallback",
    ai_summary: input.summary ?? null,
    detected_entities: {
      construction_elements: [input.documentType, input.specialty],
      documentary_risks: input.risks ?? [],
    },
    title: input.title,
    version: null,
    detected_confidence: input.confidence,
    page_count: null,
    extracted_data: {},
    created_at: now,
  }
}

export const constructionDemoDocuments: ConstructionDetectedDocument[] = [
  demoDocument({
    id: "demo-doc-arq",
    documentType: "arquitetura",
    specialty: "arquitetura",
    confidence: 92,
    title: "PT-001_ARQ_Remodelacao_Ampliacao.pdf",
    summary: "Projeto de arquitetura para equipamento social com remodelacao e ampliacao identificadas.",
  }),
  demoDocument({
    id: "demo-doc-est",
    documentType: "estruturas",
    specialty: "estruturas",
    confidence: 88,
    title: "PT-001_EST_Estruturas.pdf",
    summary: "Documentacao estrutural com fundacoes, reforcos e estrutura principal identificadas.",
  }),
  demoDocument({
    id: "demo-doc-mq",
    documentType: "mapa de quantidades",
    specialty: "medicoes",
    confidence: 86,
    title: "PT-001_MQ_Remodelacao_Ampliacao.xlsx",
    summary: "Mapa de quantidades pronto para suportar estimativa preliminar.",
  }),
  demoDocument({
    id: "demo-doc-avac",
    documentType: "AVAC",
    specialty: "avac",
    confidence: 83,
    title: "PT-001_AVAC_Projeto_Base.pdf",
    summary: "Especialidade AVAC identificada com potenciais implicacoes em custo e prazo.",
    risks: ["compatibilizacao com arquitetura"],
  }),
  demoDocument({
    id: "demo-doc-ele",
    documentType: "eletricidade",
    specialty: "eletricidade",
    confidence: 81,
    title: "PT-001_ELE_Quadros_Iluminacao.pdf",
    summary: "Especialidade eletrica identificada com quadros e iluminacao.",
  }),
  demoDocument({
    id: "demo-doc-scie",
    documentType: "SCIE",
    specialty: "scie",
    confidence: 84,
    title: "PT-001_SCIE_Medidas_Autoprotecao.pdf",
    summary: "Documento SCIE identificado, importante para licenciamento e seguranca.",
    risks: ["validacao regulamentar"],
  }),
  demoDocument({
    id: "demo-doc-ce",
    documentType: "caderno de encargos",
    specialty: "caderno de encargos",
    confidence: 61,
    title: "PT-001_CE_Condicoes_Tecnicas_Preliminar.docx",
    risks: ["versao preliminar"],
  }),
]

export const constructionDemoHealthCheck: ConstructionHealthCheckResult = {
  maturityScore: 78,
  riskScore: 36,
  complexityScore: 74,
  confidenceScore: 81,
  documentsFound: 12,
  identifiedSpecialties: ["arquitetura", "estruturas", "medicoes", "avac", "eletricidade", "scie"],
  missingCriticalDocuments: ["caderno de encargos final"],
  alerts: [
    {
      type: "missing_document",
      title: "Documento critico em falta: caderno de encargos final",
      severity: "high",
      recommendation: "Adicionar versao final do caderno de encargos antes de fechar estimativa comercial ou proposta.",
    },
    {
      type: "scope_alignment",
      title: "Remodelacao + ampliacao com compatibilizacao parcial",
      severity: "medium",
      recommendation: "Validar compatibilizacao entre arquitetura, estruturas, AVAC e SCIE antes da proxima fase.",
    },
  ],
  costEstimate: {
    estimatedCostMin: 1790000,
    estimatedCostMid: 2360000,
    estimatedCostMax: 3110000,
    costConfidence: 77,
    costNotes: [
      "Estimativa preliminar inteligente, nao substitui orcamento final.",
      "Remodelacao + ampliacao aumenta incerteza nas interfaces existentes.",
    ],
  },
  scheduleEstimate: {
    estimatedMonthsMin: 8,
    estimatedMonthsMid: 12,
    estimatedMonthsMax: 17,
    scheduleConfidence: 75,
    scheduleNotes: [
      "Estimativa preliminar inteligente, nao substitui planeamento contratual.",
      "SCIE, AVAC e compatibilizacao podem condicionar o prazo provavel.",
    ],
  },
  estimates: [],
  scores: [],
  risks: [],
  knowledgeGraph: {
    mainEntities: ["equipamento social", "remodelacao", "ampliacao", "arquitetura", "estruturas", "mapa de quantidades", "SCIE", "AVAC"],
    mainRelations: [
      "mapa de quantidades suporta estimativa operacional",
      "SCIE exige validacao regulamentar",
      "caderno de encargos final aumenta confianca documental",
      "AVAC e eletricidade dependem de compatibilizacao com arquitetura",
    ],
    derivedRisks: ["Documento critico em falta: caderno de encargos final"],
    costFactors: ["Remodelacao + ampliacao, AVAC e SCIE influenciam custo tecnico do equipamento social."],
    scheduleFactors: ["Compatibilizacao de especialidades pode influenciar prazo."],
    recommendations: [
      "Fechar caderno de encargos final antes da proposta.",
      "Validar SCIE com requisitos de licenciamento.",
      "Cruzar mapa de quantidades com especialidades tecnicas.",
    ],
  },
  learningEvents: [
    {
      id: "demo-LE-09-area-confirmed",
      projectId: "demo",
      type: "LE-09",
      timestamp: twoDaysAgo,
      source: "project-record",
      status: "validated",
    },
    {
      id: "demo-LE-06-budget-received",
      projectId: "demo",
      type: "LE-06",
      timestamp: now,
      source: "cost-intelligence",
      status: "validated",
    },
    {
      id: "demo-LE-04-document-received",
      projectId: "demo",
      type: "LE-04",
      timestamp: fiveHoursAgo,
      source: "document-intelligence",
      status: "validated",
    },
  ],
  learningConfidence: {
    documentConfidence: 86,
    estimationConfidence: 86,
    benchmarkConfidence: 84,
    healthScore: 86,
    previousHealthScore: 80,
    deltaPercent: 8,
    decision: "automatico",
  },
  lastLearningEvent: {
    id: "demo-LE-06-budget-received",
    projectId: "demo",
    type: "LE-06",
    timestamp: now,
    source: "cost-intelligence",
    status: "validated",
  },
}

export const constructionPt002Project: ConstructionProject = {
  id: "pt-002",
  organization_id: null,
  name: "PT-002 - Area Confirmada",
  project_type: "remodelacao",
  country: "Portugal",
  language: "pt",
  technical_country: "portugal",
  city: "Porto",
  estimated_area_m2: 980,
  client_type: "gabinete_tecnico",
  status: "alfa",
  maturity_score: 64,
  risk_score: 44,
  complexity_score: 58,
  confidence_score: 67,
  analyses_count: 4,
  created_at: twoDaysAgo,
  updated_at: now,
}

export const constructionTartasProject: ConstructionProject = {
  id: "tartas",
  organization_id: null,
  name: "TARTAS - Projeto Consolidado",
  project_type: "hotel",
  country: "França",
  language: "fr",
  technical_country: "france",
  city: "Tartas",
  estimated_area_m2: 4200,
  client_type: "gabinete_tecnico",
  status: "alfa_consolidado",
  maturity_score: 71,
  risk_score: 49,
  complexity_score: 78,
  confidence_score: 72,
  analyses_count: 9,
  created_at: twoDaysAgo,
  updated_at: now,
}

export const constructionTartasDocuments: ConstructionDetectedDocument[] = [
  {
    ...demoDocument({
    id: "tartas-doc-cctp",
    documentType: "CCTP",
    specialty: "cahier des clauses techniques",
    confidence: 90,
    title: "TARTAS_CCTP_Consolide.pdf",
    summary: "Entrada documental TARTAS consolidada para benchmark, timeline e custo FR.",
    }),
    project_id: "tartas",
  },
  {
    ...demoDocument({
    id: "tartas-doc-dpgf",
    documentType: "DPGF",
    specialty: "decomposition prix global forfaitaire",
    confidence: 88,
    title: "TARTAS_DPGF_Consolide.xlsx",
    summary: "Orcamento TARTAS consolidado como fonte FR.",
    }),
    project_id: "tartas",
  },
]

export const constructionAlphaLearningProjects = [
  constructionDemoProject,
  constructionPt002Project,
  constructionTartasProject,
]

export const constructionPt002LearningEvent: ConstructionLearningEvent = {
  id: "pt-002-LE-09-area-confirmed",
  projectId: "pt-002",
  type: "LE-09",
  timestamp: now,
  source: "project-record",
  status: "validated",
}

export const constructionPt002HealthCheck: ConstructionHealthCheckResult = {
  maturityScore: 64,
  riskScore: 44,
  complexityScore: 58,
  confidenceScore: 67,
  documentsFound: 5,
  identifiedSpecialties: ["arquitetura", "medicoes", "estruturas"],
  missingCriticalDocuments: ["caderno de encargos final"],
  alerts: [
    {
      type: "area_confirmed",
      title: "Area confirmada para PT-002",
      severity: "low",
      recommendation: "Usar area confirmada para recalcular custo, prazo e benchmark sem alterar arquitetura.",
    },
  ],
  costEstimate: {
    estimatedCostMin: 760000,
    estimatedCostMid: 980000,
    estimatedCostMax: 1250000,
    costConfidence: 64,
    costNotes: ["Area m2 confirmada permite reduzir incerteza de estimativa."],
  },
  scheduleEstimate: {
    estimatedMonthsMin: 5,
    estimatedMonthsMid: 8,
    estimatedMonthsMax: 11,
    scheduleConfidence: 62,
    scheduleNotes: ["Prazo recalculado com area confirmada."],
  },
  estimates: [],
  scores: [],
  risks: [],
  knowledgeGraph: {
    mainEntities: ["PT-002", "area confirmada", "remodelacao", "medicoes"],
    mainRelations: ["area confirmada improves confidence", "medicoes supports cost estimate"],
    derivedRisks: ["Caderno de encargos final em falta"],
    costFactors: ["Area confirmada estabiliza custo por m2."],
    scheduleFactors: ["Area confirmada estabiliza duracao base."],
    recommendations: ["Validar caderno de encargos final."],
  },
  learningEvents: [constructionPt002LearningEvent],
  learningConfidence: {
    documentConfidence: 69,
    estimationConfidence: 69,
    benchmarkConfidence: 70,
    healthScore: 69,
    previousHealthScore: 64,
    deltaPercent: 8,
    decision: "automatico",
  },
  lastLearningEvent: constructionPt002LearningEvent,
}

export const constructionTartasHealthCheck: ConstructionHealthCheckResult = {
  maturityScore: 71,
  riskScore: 49,
  complexityScore: 78,
  confidenceScore: 72,
  documentsFound: constructionTartasDocuments.length,
  identifiedSpecialties: ["cahier des clauses techniques", "decomposition prix global forfaitaire"],
  missingCriticalDocuments: [],
  alerts: [
    {
      type: "tartas_consolidated",
      title: "Entradas TARTAS consolidadas",
      severity: "low",
      recommendation: "Usar TARTAS como fonte unica para Benchmark FR, Timeline FR e Cost FR.",
    },
  ],
  costEstimate: {
    estimatedCostMin: 6100000,
    estimatedCostMid: 8020000,
    estimatedCostMax: 10400000,
    costConfidence: 73,
    costNotes: ["Custo FR consolidado a partir de CCTP e DPGF TARTAS."],
  },
  scheduleEstimate: {
    estimatedMonthsMin: 15,
    estimatedMonthsMid: 22,
    estimatedMonthsMax: 30,
    scheduleConfidence: 72,
    scheduleNotes: ["Timeline FR consolidada por entradas documentais TARTAS."],
  },
  estimates: [],
  scores: [],
  risks: [],
  knowledgeGraph: {
    mainEntities: ["TARTAS", "CCTP", "DPGF", "Benchmark FR", "Timeline FR", "Cost FR"],
    mainRelations: [
      "TARTAS consolidates multiple document entries",
      "DPGF supports Benchmark FR",
      "CCTP supports Timeline FR",
      "CCTP and DPGF support Cost FR",
    ],
    derivedRisks: [],
    costFactors: ["DPGF consolidado alimenta custo FR."],
    scheduleFactors: ["CCTP consolidado alimenta timeline FR."],
    recommendations: ["Manter TARTAS como projeto logico unico."],
  },
  learningEvents: [
    {
      id: "tartas-LE-04-document-received",
      projectId: "tartas",
      type: "LE-04",
      timestamp: fiveHoursAgo,
      source: "document-intelligence",
      status: "validated",
    },
    {
      id: "tartas-LE-06-budget-received",
      projectId: "tartas",
      type: "LE-06",
      timestamp: now,
      source: "cost-intelligence",
      status: "validated",
    },
  ],
  learningConfidence: {
    documentConfidence: 77,
    estimationConfidence: 80,
    benchmarkConfidence: 78,
    healthScore: 78,
    previousHealthScore: 72,
    deltaPercent: 8,
    decision: "automatico",
  },
  lastLearningEvent: {
    id: "tartas-LE-06-budget-received",
    projectId: "tartas",
    type: "LE-06",
    timestamp: now,
    source: "cost-intelligence",
    status: "validated",
  },
}
