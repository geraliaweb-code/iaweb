import { jsPDF } from "jspdf"
import { constructionProjectTypeLabels } from "./constants"
import { getConstructionProject, getConstructionSupabaseClient } from "./db"
import { listConstructionDetectedDocuments } from "./document-intelligence"
import { listConstructionHealthCheck, runConstructionScores } from "./score-engine"
import { getConstructionLanguage, type ConstructionLanguage } from "./i18n"
import type {
  ConstructionDetectedDocument,
  ConstructionHealthCheckResult,
  ConstructionProject,
  ConstructionReportRecord,
} from "./types"

type PdfReportResult = {
  bytes: Uint8Array
  filename: string
  report: ConstructionReportRecord
}

const page = {
  width: 210,
  height: 297,
  margin: 16,
}

const colors = {
  navy: [3, 7, 18] as const,
  panel: [8, 17, 32] as const,
  sky: [14, 165, 233] as const,
  gold: [245, 158, 11] as const,
  slate: [100, 116, 139] as const,
  white: [248, 250, 252] as const,
  muted: [203, 213, 225] as const,
  red: [248, 113, 113] as const,
  green: [52, 211, 153] as const,
}

const legalDisclaimer =
  "Estimativa baseada na documentacao analisada e em dados de mercado disponiveis a data da analise. Nao constitui orcamento vinculativo nem garantia de custo final."

const pdfCopy: Record<ConstructionLanguage, {
  locale: string
  legal: string
  constructionIntelligence: string
  workType: string
  country: string
  date: string
  executiveSummary: string
  executiveBody: string
  healthCheck: string
  maturity: string
  risk: string
  complexity: string
  confidence: string
  classifications: string
  foundDocuments: string
  specialties: string
  remainingDocuments: string
  missingDocuments: string
  critical: string
  important: string
  recommended: string
  noCriticalMissing: string
  estimate: string
  cost: string
  probableRange: string
  schedule: string
  minimum: string
  average: string
  maximum: string
  months: string
  estimateConfidence: string
  mandatoryNote: string
  mainRisks: string
  noCriticalAlerts: string
  potentialImpact: string
  nextStep: string
  generatedTitle: string
}> = {
  pt: {
    locale: "pt-PT",
    legal: legalDisclaimer,
    constructionIntelligence: "Construction Intelligence",
    workType: "Tipo de obra",
    country: "Pais",
    date: "Data",
    executiveSummary: "Resumo executivo",
    executiveBody: "Relatorio executivo gerado pelo modulo IAWEB Construction Intelligence a partir da documentacao classificada, Health Check, estimativas preliminares e alertas disponiveis no projeto.",
    healthCheck: "Health Check",
    maturity: "Maturidade",
    risk: "Risco",
    complexity: "Complexidade",
    confidence: "Confianca",
    classifications: "Classificacoes",
    foundDocuments: "Documentos encontrados",
    specialties: "Especialidades",
    remainingDocuments: "Restantes documentos classificados",
    missingDocuments: "Documentos em falta",
    critical: "Criticos",
    important: "Importantes",
    recommended: "Recomendados",
    noCriticalMissing: "Sem faltas criticas detetadas",
    estimate: "Estimativa preliminar",
    cost: "Custo",
    probableRange: "Faixa provavel",
    schedule: "Prazo",
    minimum: "Minimo",
    average: "Medio",
    maximum: "Maximo",
    months: "meses",
    estimateConfidence: "Confianca da estimativa",
    mandatoryNote: "Esta estimativa e indicativa e baseada exclusivamente na documentacao analisada.",
    mainRisks: "Principais riscos",
    noCriticalAlerts: "Sem alertas criticos",
    potentialImpact: "Impacto potencial",
    nextStep: "Proximo passo recomendado",
    generatedTitle: "Relatorio Executivo Construction Intelligence",
  },
  fr: {
    locale: "fr-FR",
    legal: "Estimation basee sur la documentation analysee et les donnees de marche disponibles a la date de l'analyse. Elle ne constitue pas un devis ferme ni une garantie de cout final.",
    constructionIntelligence: "Construction Intelligence",
    workType: "Type d'operation",
    country: "Pays",
    date: "Date",
    executiveSummary: "Resume executif",
    executiveBody: "Rapport executif genere par IAWEB Construction Intelligence a partir des documents classes, du Health Check, des estimations preliminaires et des alertes disponibles.",
    healthCheck: "Health Check",
    maturity: "Maturite",
    risk: "Risque",
    complexity: "Complexite",
    confidence: "Confiance",
    classifications: "Classifications",
    foundDocuments: "Documents trouves",
    specialties: "Specialites",
    remainingDocuments: "Autres documents classes",
    missingDocuments: "Documents manquants",
    critical: "Critiques",
    important: "Importants",
    recommended: "Recommandes",
    noCriticalMissing: "Aucun manque critique detecte",
    estimate: "Estimation preliminaire",
    cost: "Cout",
    probableRange: "Fourchette probable",
    schedule: "Delai",
    minimum: "Minimum",
    average: "Moyen",
    maximum: "Maximum",
    months: "mois",
    estimateConfidence: "Confiance de l'estimation",
    mandatoryNote: "Cette estimation est indicative et basee exclusivement sur la documentation analysee.",
    mainRisks: "Principaux risques",
    noCriticalAlerts: "Aucune alerte critique",
    potentialImpact: "Impact potentiel",
    nextStep: "Prochaine etape recommandee",
    generatedTitle: "Rapport Executif Construction Intelligence",
  },
  es: {
    locale: "es-ES",
    legal: "Estimacion basada en la documentacion analizada y datos de mercado disponibles en la fecha del analisis. No constituye presupuesto vinculante ni garantia de coste final.",
    constructionIntelligence: "Construction Intelligence",
    workType: "Tipo de obra",
    country: "Pais",
    date: "Fecha",
    executiveSummary: "Resumen ejecutivo",
    executiveBody: "Informe ejecutivo generado por IAWEB Construction Intelligence a partir de la documentacion clasificada, Health Check, estimaciones preliminares y alertas disponibles.",
    healthCheck: "Health Check",
    maturity: "Madurez",
    risk: "Riesgo",
    complexity: "Complejidad",
    confidence: "Confianza",
    classifications: "Clasificaciones",
    foundDocuments: "Documentos encontrados",
    specialties: "Especialidades",
    remainingDocuments: "Otros documentos clasificados",
    missingDocuments: "Documentos faltantes",
    critical: "Criticos",
    important: "Importantes",
    recommended: "Recomendados",
    noCriticalMissing: "Sin faltas criticas detectadas",
    estimate: "Estimacion preliminar",
    cost: "Coste",
    probableRange: "Rango probable",
    schedule: "Plazo",
    minimum: "Minimo",
    average: "Medio",
    maximum: "Maximo",
    months: "meses",
    estimateConfidence: "Confianza de la estimacion",
    mandatoryNote: "Esta estimacion es indicativa y se basa exclusivamente en la documentacion analizada.",
    mainRisks: "Principales riesgos",
    noCriticalAlerts: "Sin alertas criticas",
    potentialImpact: "Impacto potencial",
    nextStep: "Siguiente paso recomendado",
    generatedTitle: "Informe Ejecutivo Construction Intelligence",
  },
}

function getPdfCopy(project: ConstructionProject) {
  return pdfCopy[getConstructionLanguage(project.language)]
}

function setFill(doc: jsPDF, color: readonly number[]) {
  doc.setFillColor(color[0], color[1], color[2])
}

function setText(doc: jsPDF, color: readonly number[]) {
  doc.setTextColor(color[0], color[1], color[2])
}

function addBackground(doc: jsPDF, copy = pdfCopy.pt) {
  setFill(doc, colors.navy)
  doc.rect(0, 0, page.width, page.height, "F")
  setFill(doc, [4, 22, 43])
  doc.circle(186, 24, 42, "F")
  setFill(doc, [34, 22, 5])
  doc.circle(20, 262, 46, "F")
  setText(doc, colors.slate)
  doc.setFontSize(8)
  doc.text(`IAWEB ${copy.constructionIntelligence}`, page.margin, page.height - 10)
  doc.setFontSize(6.5)
  doc.text(doc.splitTextToSize(copy.legal, 160), page.margin, page.height - 6)
}

function addHeader(doc: jsPDF, title: string, copy = pdfCopy.pt) {
  addBackground(doc, copy)
  setText(doc, colors.white)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(16)
  doc.text(title, page.margin, 22)
  setFill(doc, colors.sky)
  doc.rect(page.margin, 28, 34, 1.2, "F")
  setFill(doc, colors.gold)
  doc.rect(page.margin + 36, 28, 18, 1.2, "F")
}

function writeWrapped(doc: jsPDF, text: string, x: number, y: number, width = 170, lineHeight = 6) {
  const lines = doc.splitTextToSize(text, width)
  doc.text(lines, x, y)
  return y + lines.length * lineHeight
}

function metricBar(doc: jsPDF, label: string, value: number, x: number, y: number, color: readonly number[]) {
  setText(doc, colors.white)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(11)
  doc.text(label, x, y)
  setText(doc, colors.muted)
  doc.text(`${value}/100`, x + 150, y)
  setFill(doc, [15, 23, 42])
  doc.roundedRect(x, y + 5, 168, 6, 2, 2, "F")
  setFill(doc, color)
  doc.roundedRect(x, y + 5, Math.max(4, (168 * value) / 100), 6, 2, 2, "F")
}

function gradeFor(value: number, inverse = false) {
  const score = inverse ? 100 - value : value
  if (score >= 80) return "A"
  if (score >= 65) return "B"
  if (score >= 45) return "C"
  return "D"
}

function formatEuro(value: number, locale = "pt-PT") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value)
}

function addPageOne(doc: jsPDF, project: ConstructionProject, copy = getPdfCopy(project)) {
  addBackground(doc, copy)
  setText(doc, colors.white)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(34)
  doc.text("IAWEB", page.margin, 36)
  setText(doc, colors.sky)
  doc.setFontSize(18)
  doc.text(copy.constructionIntelligence, page.margin, 50)

  setFill(doc, colors.panel)
  doc.roundedRect(page.margin, 72, 178, 92, 4, 4, "F")
  setText(doc, colors.white)
  doc.setFontSize(24)
  doc.text(project.name, page.margin + 8, 92, { maxWidth: 160 })
  doc.setFontSize(11)
  setText(doc, colors.muted)
  doc.text(`${copy.workType}: ${constructionProjectTypeLabels[project.project_type] ?? project.project_type}`, page.margin + 8, 118)
  doc.text(`${copy.country}: ${project.country}`, page.margin + 8, 128)
  doc.text(`${copy.date}: ${new Date().toLocaleDateString(copy.locale)}`, page.margin + 8, 138)

  setText(doc, colors.white)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(15)
  doc.text(copy.executiveSummary, page.margin, 188)
  setText(doc, colors.muted)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(11)
  writeWrapped(
    doc,
    copy.executiveBody,
    page.margin,
    202,
  )
}

function addHealthPage(doc: jsPDF, health: ConstructionHealthCheckResult, copy = pdfCopy.pt) {
  doc.addPage()
  addHeader(doc, copy.healthCheck, copy)
  metricBar(doc, copy.maturity, health.maturityScore, page.margin, 54, colors.sky)
  metricBar(doc, copy.risk, health.riskScore, page.margin, 82, colors.red)
  metricBar(doc, copy.complexity, health.complexityScore, page.margin, 110, colors.gold)
  metricBar(doc, copy.confidence, health.confidenceScore, page.margin, 138, colors.green)

  setText(doc, colors.white)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(14)
  doc.text(copy.classifications, page.margin, 178)
  setText(doc, colors.muted)
  doc.setFontSize(11)
  doc.text(`${copy.maturity}: ${gradeFor(health.maturityScore)}`, page.margin, 194)
  doc.text(`${copy.risk}: ${gradeFor(health.riskScore, true)}`, page.margin, 204)
  doc.text(`${copy.complexity}: ${gradeFor(health.complexityScore, true)}`, page.margin, 214)
  doc.text(`${copy.confidence}: ${gradeFor(health.confidenceScore)}`, page.margin, 224)
}

function addDocumentsPage(doc: jsPDF, documents: ConstructionDetectedDocument[], health: ConstructionHealthCheckResult, copy = pdfCopy.pt) {
  doc.addPage()
  addHeader(doc, copy.foundDocuments, copy)
  const priority = ["arquitetura", "estruturas", "medicoes"]
  const found = new Set(documents.map((document) => document.document_type))
  let y = 52

  setText(doc, colors.white)
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  for (const item of priority) {
    doc.text(`${found.has(item) ? "[OK]" : "[--]"} ${item}`, page.margin, y)
    y += 10
  }

  doc.text(copy.specialties, page.margin, y + 8)
  y += 20
  setText(doc, colors.muted)
  doc.setFont("helvetica", "normal")
  for (const specialty of health.identifiedSpecialties.slice(0, 12)) {
    doc.text(`- ${specialty}`, page.margin, y)
    y += 8
  }

  y += 8
  setText(doc, colors.white)
  doc.setFont("helvetica", "bold")
  doc.text(copy.remainingDocuments, page.margin, y)
  y += 12
  setText(doc, colors.muted)
  doc.setFont("helvetica", "normal")
  for (const document of documents.slice(0, 15)) {
    y = writeWrapped(doc, `- ${document.document_type} (${document.confidence_score}/100) - ${document.title ?? "sem titulo"}`, page.margin, y, 170, 5)
    y += 2
  }
}

function addMissingPage(doc: jsPDF, health: ConstructionHealthCheckResult, copy = pdfCopy.pt) {
  doc.addPage()
  addHeader(doc, copy.missingDocuments, copy)
  const critical = health.missingCriticalDocuments
  const important = health.riskScore >= 60 ? ["Medicoes detalhadas", "Caderno de encargos atualizado"] : ["Validacao tecnica de especialidades"]
  const recommended = ["Mapa de revisoes", "Lista de pressupostos", "Evidencias de compatibilizacao"]
  let y = 54

  for (const section of [
    { title: copy.critical, items: critical.length ? critical : [copy.noCriticalMissing] },
    { title: copy.important, items: important },
    { title: copy.recommended, items: recommended },
  ]) {
    setText(doc, colors.white)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(14)
    doc.text(section.title, page.margin, y)
    y += 12
    setText(doc, colors.muted)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    for (const item of section.items) {
      doc.text(`- ${item}`, page.margin + 4, y)
      y += 8
    }
    y += 8
  }
}

function addEstimatePage(doc: jsPDF, health: ConstructionHealthCheckResult, copy = pdfCopy.pt) {
  doc.addPage()
  addHeader(doc, copy.estimate, copy)
  setText(doc, colors.white)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(15)
  doc.text(copy.cost, page.margin, 54)
  setText(doc, colors.muted)
  doc.setFontSize(12)
  const cost = health.costEstimate
  if (cost?.scenarios?.length) {
    let scenarioY = 72
    for (const scenario of cost.scenarios) {
      doc.text(`${scenario.label}: ${formatEuro(scenario.min, copy.locale)} a ${formatEuro(scenario.max, copy.locale)} (${scenario.confidenceScore}/100)`, page.margin, scenarioY)
      scenarioY += 12
    }
  } else {
    doc.text(`${copy.probableRange}: ${cost ? `${formatEuro(cost.estimatedCostMin, copy.locale)} a ${formatEuro(cost.estimatedCostMax, copy.locale)}` : "Por gerar"}`, page.margin, 72)
  }

  setText(doc, colors.white)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(15)
  doc.text(copy.schedule, page.margin, 124)
  setText(doc, colors.muted)
  doc.setFontSize(12)
  const schedule = health.scheduleEstimate
  doc.text(`${copy.minimum}: ${schedule ? `${schedule.estimatedMonthsMin} ${copy.months}` : "Por gerar"}`, page.margin, 142)
  doc.text(`${copy.average}: ${schedule ? `${schedule.estimatedMonthsMid} ${copy.months}` : "Por gerar"}`, page.margin, 154)
  doc.text(`${copy.maximum}: ${schedule ? `${schedule.estimatedMonthsMax} ${copy.months}` : "Por gerar"}`, page.margin, 166)

  const confidence = Math.round(((cost?.costConfidence ?? 0) + (schedule?.scheduleConfidence ?? 0)) / (cost && schedule ? 2 : 1))
  metricBar(doc, copy.estimateConfidence, confidence, page.margin, 196, colors.sky)
  setText(doc, colors.gold)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(11)
  writeWrapped(doc, copy.mandatoryNote, page.margin, 232, 172)
}

function addRisksPage(doc: jsPDF, health: ConstructionHealthCheckResult, copy = pdfCopy.pt) {
  doc.addPage()
  addHeader(doc, copy.mainRisks, copy)
  let y = 54
  const alerts = health.alerts.length ? health.alerts : [{ title: copy.noCriticalAlerts, severity: "low", recommendation: copy.recommended, type: "none" }]

  for (const alert of alerts.slice(0, 8)) {
    setText(doc, alert.severity === "high" ? colors.red : colors.gold)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(12)
    y = writeWrapped(doc, alert.title, page.margin, y, 172, 6)
    setText(doc, colors.muted)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    y = writeWrapped(doc, `${copy.potentialImpact}: ${alert.severity === "high" ? "Pode comprometer decisoes tecnicas, custo ou viabilidade." : "Pode reduzir confianca e previsibilidade."}`, page.margin + 4, y + 2, 168, 5)
    y = writeWrapped(doc, `${copy.nextStep}: ${alert.recommendation}`, page.margin + 4, y + 1, 168, 5)
    y += 8
  }
}

function buildPdf(project: ConstructionProject, health: ConstructionHealthCheckResult, documents: ConstructionDetectedDocument[]) {
  const doc = new jsPDF({ unit: "mm", format: "a4", compress: true })
  const copy = getPdfCopy(project)
  addPageOne(doc, project, copy)
  addHealthPage(doc, health, copy)
  addDocumentsPage(doc, documents, health, copy)
  addMissingPage(doc, health, copy)
  addEstimatePage(doc, health, copy)
  addRisksPage(doc, health, copy)
  return new Uint8Array(doc.output("arraybuffer"))
}

function reportFilename(project: ConstructionProject) {
  const safe = project.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
  return `iaweb-construction-${safe || "projeto"}-executive-report.pdf`
}

export async function generateConstructionExecutivePdf(projectId: string): Promise<{ data: PdfReportResult | null; error: { code: string; message: string } | null }> {
  const projectResult = await getConstructionProject(projectId)

  if (projectResult.error || !projectResult.data) {
    return { data: null, error: projectResult.error ?? { code: "NOT_FOUND", message: "Projeto nao encontrado." } }
  }

  const healthResult = await listConstructionHealthCheck(projectId)
  const health = healthResult.data?.scores.length ? healthResult.data : (await runConstructionScores(projectId)).data

  if (!health) {
    return { data: null, error: { code: "SUPABASE_QUERY_FAILED", message: "Nao foi possivel carregar ou gerar o Health Check." } }
  }

  const documentsResult = await listConstructionDetectedDocuments(projectId)

  if (documentsResult.error) {
    return { data: null, error: documentsResult.error }
  }

  const bytes = buildPdf(projectResult.data, health, documentsResult.data)
  const client = getConstructionSupabaseClient()

  if (!client.ok) {
    return { data: null, error: client.error }
  }

  const reportId = crypto.randomUUID()
  const reportUrl = `/api/construction/projects/${projectId}/report?reportId=${reportId}`
  const copy = getPdfCopy(projectResult.data)
  const summary = `${copy.generatedTitle} - ${projectResult.data.name}.`
  const { data: report, error } = await client.supabase
    .from("construction_reports")
    .insert({
      id: reportId,
      project_id: projectId,
      report_type: "executive_pdf",
      title: copy.generatedTitle,
      status: "generated",
      summary,
      report_url: reportUrl,
      payload: {
        maturity_score: health.maturityScore,
        risk_score: health.riskScore,
        complexity_score: health.complexityScore,
        confidence_score: health.confidenceScore,
        documents_found: health.documentsFound,
        generated_by: "pdf-report-v1",
      },
      generated_at: new Date().toISOString(),
    })
    .select("id,project_id,report_type,title,status,summary,report_url,payload,generated_at,created_at,updated_at")
    .single()

  if (error) {
    return { data: null, error: { code: "SUPABASE_INSERT_FAILED", message: error.message } }
  }

  return {
    data: {
      bytes,
      filename: reportFilename(projectResult.data),
      report: report as ConstructionReportRecord,
    },
    error: null,
  }
}
