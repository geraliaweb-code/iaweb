import { jsPDF } from "jspdf"
import type { DiagnosticoFormData, DiagnosticoResult } from "@/lib/diagnostico"

const page = {
  width: 210,
  height: 297,
  margin: 16,
}

const colors = {
  ink: "#0f172a",
  muted: "#64748b",
  soft: "#f8fafc",
  line: "#e2e8f0",
  brand: "#0f4cff",
  cyan: "#06b6d4",
  success: "#059669",
  warning: "#d97706",
}

const categoryLabels = {
  website: "Website",
  google: "Google",
  conversao: "Conversao",
  automacao: "Automacao",
}

type PdfContext = {
  formData: DiagnosticoFormData
  result: DiagnosticoResult
}

export function downloadDiagnosticoPdf(context: PdfContext) {
  const doc = createDiagnosticoPdf(context)
  const company = sanitizeFilename(context.formData.empresa || "empresa")

  doc.save(`relatorio-estrategico-iaweb-${company}.pdf`)
}

export function createDiagnosticoPdf({ formData, result }: PdfContext) {
  const doc = new jsPDF({ unit: "mm", format: "a4" })
  let y = 18

  drawHero(doc, formData, result)
  y = 82

  y = drawLeadSummary(doc, formData, y)
  y = drawScoreSection(doc, result, y + 6)
  y = drawRecommendations(doc, result.recomendacoes, y + 8)
  y = drawNextSteps(doc, y + 8)
  drawFinalCta(doc)

  return doc
}

function drawHero(doc: jsPDF, formData: DiagnosticoFormData, result: DiagnosticoResult) {
  doc.setFillColor(5, 9, 21)
  doc.rect(0, 0, page.width, 72, "F")

  doc.setFillColor(20, 91, 255)
  doc.circle(182, 18, 32, "F")
  doc.setFillColor(6, 182, 212)
  doc.circle(164, 56, 22, "F")

  doc.setTextColor("#ffffff")
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.text("IAWEB", page.margin, 18)

  doc.setFontSize(26)
  doc.text("Relatório Estratégico", page.margin, 34)
  doc.text("de Presença Digital", page.margin, 45)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.setTextColor("#cbd5e1")
  doc.text("Diagnóstico Digital Gratuito", page.margin, 56)
  doc.text(`Empresa: ${safe(formData.empresa)}`, page.margin, 63)

  drawScoreBadge(doc, result.scoreFinal, 154, 27, 31)
}

function drawLeadSummary(doc: jsPDF, formData: DiagnosticoFormData, y: number) {
  drawSectionTitle(doc, "Resumo da empresa", y)
  y += 9

  const items = [
    ["Contacto", formData.nome],
    ["Email", formData.email],
    ["WhatsApp", formData.whatsapp],
    ["Website", formData.website],
    ["Setor", formData.setor],
    ["Objetivo", formData.objetivo],
  ]

  const colWidth = 88
  items.forEach(([label, value], index) => {
    const col = index % 2
    const row = Math.floor(index / 2)
    const x = page.margin + col * (colWidth + 8)
    const itemY = y + row * 18

    doc.setFillColor(colors.soft)
    doc.roundedRect(x, itemY, colWidth, 14, 2.5, 2.5, "F")
    doc.setTextColor(colors.muted)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(7)
    doc.text(label.toUpperCase(), x + 4, itemY + 5)
    doc.setTextColor(colors.ink)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(9)
    doc.text(fitText(doc, safe(value), colWidth - 8), x + 4, itemY + 10)
  })

  return y + 56
}

function drawScoreSection(doc: jsPDF, result: DiagnosticoResult, y: number) {
  drawSectionTitle(doc, "Leitura estratégica", y)
  y += 9

  doc.setFillColor("#eff6ff")
  doc.roundedRect(page.margin, y, 178, 38, 4, 4, "F")
  doc.setTextColor(colors.ink)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(14)
  doc.text(result.classificacao.label, page.margin + 6, y + 10)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(colors.muted)
  doc.setFontSize(9)
  const message = doc.splitTextToSize(result.classificacao.message, 110)
  doc.text(message, page.margin + 6, y + 18)

  drawScoreBadge(doc, result.scoreFinal, 166, y + 19, 15)

  y += 47
  drawBodyText(
    doc,
    "Este resultado mostra quanto potencial pode estar a ficar fora do funil comercial. Quando a presenca digital nao transmite confianca, clareza e resposta rapida, potenciais clientes desistem antes de pedir contacto.",
    y,
  )
  y += 22

  const entries = Object.entries(result.categorias) as Array<[keyof typeof categoryLabels, number]>
  entries.forEach(([key, score]) => {
    drawScoreBar(doc, categoryLabels[key], score, y)
    y += 13
  })

  doc.setFillColor("#ecfeff")
  doc.roundedRect(page.margin, y + 2, 178, 18, 3, 3, "F")
  doc.setTextColor(colors.cyan)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(9)
  doc.text("Potencial estimado", page.margin + 5, y + 9)
  doc.setTextColor(colors.ink)
  doc.setFontSize(13)
  doc.text(result.potencialEstimado, page.margin + 54, y + 9)

  return y + 25
}

function drawRecommendations(doc: jsPDF, recommendations: string[], y: number) {
  if (y > 220) {
    doc.addPage()
    y = 18
  }

  drawSectionTitle(doc, "Recomendações automáticas", y)
  y += 9

  const strategicText = recommendations.length
    ? recommendations.map(rewriteRecommendation)
    : ["Criar um plano simples para aumentar confianca, facilitar o pedido de contacto e reduzir oportunidades perdidas."]

  strategicText.forEach((text, index) => {
    const lines = doc.splitTextToSize(text, 154)
    const height = Math.max(18, lines.length * 5 + 10)

    doc.setFillColor("#ffffff")
    doc.setDrawColor(colors.line)
    doc.roundedRect(page.margin, y, 178, height, 3, 3, "FD")
    doc.setFillColor(index === 0 ? colors.brand : colors.cyan)
    doc.circle(page.margin + 7, y + 8, 2.2, "F")
    doc.setTextColor(colors.ink)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(9)
    doc.text(`Prioridade ${index + 1}`, page.margin + 13, y + 8)
    doc.setTextColor(colors.muted)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(9)
    doc.text(lines, page.margin + 13, y + 15)

    y += height + 5
  })

  return y
}

function drawNextSteps(doc: jsPDF, y: number) {
  if (y > 235) {
    doc.addPage()
    y = 18
  }

  drawSectionTitle(doc, "Próximos passos recomendados", y)
  y += 10

  const steps = [
    ["1", "Validar onde os potenciais clientes estao a abandonar o percurso."],
    ["2", "Reforcar credibilidade, prova e clareza nas primeiras interacoes."],
    ["3", "Criar um caminho mais direto para pedido de contacto ou conversa."],
    ["4", "Definir um plano de melhoria com foco em crescimento e faturacao."],
  ]

  steps.forEach(([number, text]) => {
    doc.setFillColor("#f8fafc")
    doc.roundedRect(page.margin, y, 178, 12, 2.5, 2.5, "F")
    doc.setFillColor(colors.ink)
    doc.circle(page.margin + 7, y + 6, 3.2, "F")
    doc.setTextColor("#ffffff")
    doc.setFont("helvetica", "bold")
    doc.setFontSize(8)
    doc.text(number, page.margin + 5.8, y + 7)
    doc.setTextColor(colors.ink)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(9)
    doc.text(text, page.margin + 15, y + 7)
    y += 15
  })

  return y
}

function drawFinalCta(doc: jsPDF) {
  const y = 258

  doc.setFillColor(5, 9, 21)
  doc.roundedRect(page.margin, y, 178, 24, 4, 4, "F")
  doc.setTextColor("#ffffff")
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.text("Agendar Diagnóstico Estratégico Gratuito", page.margin + 7, y + 9)
  doc.setFont("helvetica", "normal")
  doc.setTextColor("#cbd5e1")
  doc.setFontSize(8.5)
  doc.text("Transforme este score num plano pratico para gerar mais contactos, confianca e crescimento.", page.margin + 7, y + 16)
  doc.setTextColor("#67e8f9")
  doc.setFont("helvetica", "bold")
  doc.text("WhatsApp: +351 913 837 004", page.margin + 7, y + 21)
}

function drawSectionTitle(doc: jsPDF, title: string, y: number) {
  doc.setTextColor(colors.ink)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(13)
  doc.text(title, page.margin, y)
  doc.setDrawColor(colors.line)
  doc.line(page.margin, y + 3, page.width - page.margin, y + 3)
}

function drawBodyText(doc: jsPDF, text: string, y: number) {
  doc.setTextColor(colors.muted)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(9.5)
  doc.text(doc.splitTextToSize(text, 178), page.margin, y)
}

function drawScoreBadge(doc: jsPDF, score: number, x: number, y: number, radius: number) {
  const scoreColor = score <= 40 ? colors.warning : score <= 70 ? colors.brand : colors.success

  doc.setFillColor("#ffffff")
  doc.circle(x, y, radius, "F")
  doc.setFillColor(scoreColor)
  doc.circle(x, y, radius - 4, "F")
  doc.setTextColor("#ffffff")
  doc.setFont("helvetica", "bold")
  doc.setFontSize(radius > 20 ? 22 : 14)
  doc.text(String(score), x, y + (radius > 20 ? 3 : 2), { align: "center" })
  doc.setFontSize(radius > 20 ? 7 : 5)
  doc.text("/100", x, y + (radius > 20 ? 11 : 8), { align: "center" })
}

function drawScoreBar(doc: jsPDF, label: string, score: number, y: number) {
  const barX = page.margin + 42
  const barWidth = 104
  const scoreColor = score <= 40 ? colors.warning : score <= 70 ? colors.brand : colors.success

  doc.setTextColor(colors.ink)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(9)
  doc.text(label, page.margin, y + 4)

  doc.setFillColor("#e2e8f0")
  doc.roundedRect(barX, y, barWidth, 5, 2.5, 2.5, "F")
  doc.setFillColor(scoreColor)
  doc.roundedRect(barX, y, (barWidth * score) / 100, 5, 2.5, 2.5, "F")

  doc.setTextColor(colors.muted)
  doc.setFont("helvetica", "bold")
  doc.text(`${score}/100`, barX + barWidth + 10, y + 4)
}

function rewriteRecommendation(text: string) {
  return text
    .replace("Rever a primeira dobra do website para comunicar valor, prova e CTA em menos de cinco segundos.", "Melhorar a primeira impressao do website para que o visitante perceba rapidamente valor, confianca e o proximo passo.")
    .replace("Otimizar Google Business e sinais locais para aumentar visibilidade nas pesquisas de maior intencao.", "Reforcar a presenca no Google para que mais potenciais clientes encontrem a empresa quando ja estao prontos para pedir ajuda.")
    .replace("Criar um caminho de conversao mais direto com CTA claro, formulario curto e resposta rapida.", "Simplificar o pedido de contacto para reduzir desistencias e transformar mais visitantes em conversas reais.")
    .replace("Ligar formularios e WhatsApp a um processo de seguimento para reduzir oportunidades perdidas.", "Garantir resposta e seguimento rapido para evitar que contactos interessados fiquem sem retorno.")
    .replace("Mapear tarefas repetitivas e comecar por uma automacao simples de resposta ou follow-up.", "Comecar por um sistema simples de resposta e acompanhamento para libertar tempo e proteger oportunidades comerciais.")
}

function safe(value: string | undefined) {
  return value?.trim() || "Nao indicado"
}

function fitText(doc: jsPDF, text: string, width: number) {
  const lines = doc.splitTextToSize(text, width)
  return lines[0] ?? text
}

function sanitizeFilename(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
}
