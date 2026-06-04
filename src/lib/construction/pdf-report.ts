import { jsPDF } from "jspdf"
import { constructionProjectTypeLabels } from "./constants"
import { getConstructionProject, getConstructionSupabaseClient } from "./db"
import { listConstructionDetectedDocuments } from "./document-intelligence"
import { listConstructionHealthCheck, runConstructionScores } from "./score-engine"
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

function setFill(doc: jsPDF, color: readonly number[]) {
  doc.setFillColor(color[0], color[1], color[2])
}

function setText(doc: jsPDF, color: readonly number[]) {
  doc.setTextColor(color[0], color[1], color[2])
}

function addBackground(doc: jsPDF) {
  setFill(doc, colors.navy)
  doc.rect(0, 0, page.width, page.height, "F")
  setFill(doc, [4, 22, 43])
  doc.circle(186, 24, 42, "F")
  setFill(doc, [34, 22, 5])
  doc.circle(20, 262, 46, "F")
  setText(doc, colors.slate)
  doc.setFontSize(8)
  doc.text("IAWEB Construction Intelligence", page.margin, page.height - 10)
  doc.setFontSize(6.5)
  doc.text(doc.splitTextToSize(legalDisclaimer, 160), page.margin, page.height - 6)
}

function addHeader(doc: jsPDF, title: string) {
  addBackground(doc)
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

function formatEuro(value: number) {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value)
}

function addPageOne(doc: jsPDF, project: ConstructionProject) {
  addBackground(doc)
  setText(doc, colors.white)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(34)
  doc.text("IAWEB", page.margin, 36)
  setText(doc, colors.sky)
  doc.setFontSize(18)
  doc.text("Construction Intelligence", page.margin, 50)

  setFill(doc, colors.panel)
  doc.roundedRect(page.margin, 72, 178, 92, 4, 4, "F")
  setText(doc, colors.white)
  doc.setFontSize(24)
  doc.text(project.name, page.margin + 8, 92, { maxWidth: 160 })
  doc.setFontSize(11)
  setText(doc, colors.muted)
  doc.text(`Tipo de obra: ${constructionProjectTypeLabels[project.project_type] ?? project.project_type}`, page.margin + 8, 118)
  doc.text(`Pais: ${project.country}`, page.margin + 8, 128)
  doc.text(`Data: ${new Date().toLocaleDateString("pt-PT")}`, page.margin + 8, 138)

  setText(doc, colors.white)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(15)
  doc.text("Resumo executivo", page.margin, 188)
  setText(doc, colors.muted)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(11)
  writeWrapped(
    doc,
    "Relatorio executivo gerado pelo modulo IAWEB Construction Intelligence a partir da documentacao classificada, Health Check, estimativas preliminares e alertas disponiveis no projeto.",
    page.margin,
    202,
  )
}

function addHealthPage(doc: jsPDF, health: ConstructionHealthCheckResult) {
  doc.addPage()
  addHeader(doc, "Health Check")
  metricBar(doc, "Maturidade", health.maturityScore, page.margin, 54, colors.sky)
  metricBar(doc, "Risco", health.riskScore, page.margin, 82, colors.red)
  metricBar(doc, "Complexidade", health.complexityScore, page.margin, 110, colors.gold)
  metricBar(doc, "Confianca", health.confidenceScore, page.margin, 138, colors.green)

  setText(doc, colors.white)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(14)
  doc.text("Classificacoes", page.margin, 178)
  setText(doc, colors.muted)
  doc.setFontSize(11)
  doc.text(`Maturidade: ${gradeFor(health.maturityScore)}`, page.margin, 194)
  doc.text(`Risco: ${gradeFor(health.riskScore, true)}`, page.margin, 204)
  doc.text(`Complexidade: ${gradeFor(health.complexityScore, true)}`, page.margin, 214)
  doc.text(`Confianca: ${gradeFor(health.confidenceScore)}`, page.margin, 224)
}

function addDocumentsPage(doc: jsPDF, documents: ConstructionDetectedDocument[], health: ConstructionHealthCheckResult) {
  doc.addPage()
  addHeader(doc, "Documentos encontrados")
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

  doc.text("Especialidades", page.margin, y + 8)
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
  doc.text("Restantes documentos classificados", page.margin, y)
  y += 12
  setText(doc, colors.muted)
  doc.setFont("helvetica", "normal")
  for (const document of documents.slice(0, 15)) {
    y = writeWrapped(doc, `- ${document.document_type} (${document.confidence_score}/100) - ${document.title ?? "sem titulo"}`, page.margin, y, 170, 5)
    y += 2
  }
}

function addMissingPage(doc: jsPDF, health: ConstructionHealthCheckResult) {
  doc.addPage()
  addHeader(doc, "Documentos em falta")
  const critical = health.missingCriticalDocuments
  const important = health.riskScore >= 60 ? ["Medicoes detalhadas", "Caderno de encargos atualizado"] : ["Validacao tecnica de especialidades"]
  const recommended = ["Mapa de revisoes", "Lista de pressupostos", "Evidencias de compatibilizacao"]
  let y = 54

  for (const section of [
    { title: "Criticos", items: critical.length ? critical : ["Sem faltas criticas detetadas"] },
    { title: "Importantes", items: important },
    { title: "Recomendados", items: recommended },
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

function addEstimatePage(doc: jsPDF, health: ConstructionHealthCheckResult) {
  doc.addPage()
  addHeader(doc, "Estimativa preliminar")
  setText(doc, colors.white)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(15)
  doc.text("Custo", page.margin, 54)
  setText(doc, colors.muted)
  doc.setFontSize(12)
  const cost = health.costEstimate
  if (cost?.scenarios?.length) {
    let scenarioY = 72
    for (const scenario of cost.scenarios) {
      doc.text(`${scenario.label}: ${formatEuro(scenario.min)} a ${formatEuro(scenario.max)} (${scenario.confidenceScore}/100)`, page.margin, scenarioY)
      scenarioY += 12
    }
  } else {
    doc.text(`Faixa provavel: ${cost ? `${formatEuro(cost.estimatedCostMin)} a ${formatEuro(cost.estimatedCostMax)}` : "Por gerar"}`, page.margin, 72)
  }

  setText(doc, colors.white)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(15)
  doc.text("Prazo", page.margin, 124)
  setText(doc, colors.muted)
  doc.setFontSize(12)
  const schedule = health.scheduleEstimate
  doc.text(`Minimo: ${schedule ? `${schedule.estimatedMonthsMin} meses` : "Por gerar"}`, page.margin, 142)
  doc.text(`Medio: ${schedule ? `${schedule.estimatedMonthsMid} meses` : "Por gerar"}`, page.margin, 154)
  doc.text(`Maximo: ${schedule ? `${schedule.estimatedMonthsMax} meses` : "Por gerar"}`, page.margin, 166)

  const confidence = Math.round(((cost?.costConfidence ?? 0) + (schedule?.scheduleConfidence ?? 0)) / (cost && schedule ? 2 : 1))
  metricBar(doc, "Confianca da estimativa", confidence, page.margin, 196, colors.sky)
  setText(doc, colors.gold)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(11)
  writeWrapped(doc, "Esta estimativa e indicativa e baseada exclusivamente na documentacao analisada.", page.margin, 232, 172)
}

function addRisksPage(doc: jsPDF, health: ConstructionHealthCheckResult) {
  doc.addPage()
  addHeader(doc, "Principais riscos")
  let y = 54
  const alerts = health.alerts.length ? health.alerts : [{ title: "Sem alertas criticos", severity: "low", recommendation: "Manter revisao documental antes de decisoes finais.", type: "none" }]

  for (const alert of alerts.slice(0, 8)) {
    setText(doc, alert.severity === "high" ? colors.red : colors.gold)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(12)
    y = writeWrapped(doc, alert.title, page.margin, y, 172, 6)
    setText(doc, colors.muted)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    y = writeWrapped(doc, `Impacto potencial: ${alert.severity === "high" ? "Pode comprometer decisoes tecnicas, custo ou viabilidade." : "Pode reduzir confianca e previsibilidade."}`, page.margin + 4, y + 2, 168, 5)
    y = writeWrapped(doc, `Proximo passo recomendado: ${alert.recommendation}`, page.margin + 4, y + 1, 168, 5)
    y += 8
  }
}

function buildPdf(project: ConstructionProject, health: ConstructionHealthCheckResult, documents: ConstructionDetectedDocument[]) {
  const doc = new jsPDF({ unit: "mm", format: "a4", compress: true })
  addPageOne(doc, project)
  addHealthPage(doc, health)
  addDocumentsPage(doc, documents, health)
  addMissingPage(doc, health)
  addEstimatePage(doc, health)
  addRisksPage(doc, health)
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
  const summary = `Relatorio executivo Construction Intelligence para ${projectResult.data.name}.`
  const { data: report, error } = await client.supabase
    .from("construction_reports")
    .insert({
      id: reportId,
      project_id: projectId,
      report_type: "executive_pdf",
      title: "Relatorio Executivo Construction Intelligence",
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
