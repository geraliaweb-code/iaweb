import type { jsPDF } from "jspdf"
import type { ConstructionCostBreakdownLine } from "../cost-engine-v2"
import type { ConstructionPdfV2Context } from "./types"
import {
  compactPdfV2Text,
  formatPdfV2Currency,
  formatPdfV2Date,
  formatPdfV2Percent,
  formatPdfV2Range,
  formatPdfV2Score,
} from "./pdf-v2-formatters"

const page = {
  width: 210,
  height: 297,
  margin: 16,
}

const colors = {
  navy: [7, 18, 38] as const,
  panel: [12, 31, 58] as const,
  gold: [214, 172, 83] as const,
  sky: [125, 211, 252] as const,
  text: [239, 246, 255] as const,
  muted: [166, 189, 214] as const,
  line: [54, 80, 112] as const,
}

function setFill(doc: jsPDF, rgb: readonly [number, number, number]) {
  doc.setFillColor(rgb[0], rgb[1], rgb[2])
}

function setText(doc: jsPDF, rgb: readonly [number, number, number]) {
  doc.setTextColor(rgb[0], rgb[1], rgb[2])
}

function addBackground(doc: jsPDF) {
  setFill(doc, colors.navy)
  doc.rect(0, 0, page.width, page.height, "F")
  setFill(doc, [10, 35, 72])
  doc.rect(0, 0, page.width, 42, "F")
  setFill(doc, colors.gold)
  doc.rect(0, 41, page.width, 1.2, "F")
}

function addPage(doc: jsPDF, title: string) {
  doc.addPage()
  addBackground(doc)
  setText(doc, colors.gold)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(14)
  doc.text(title, page.margin, 24)
  setText(doc, colors.muted)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.text("IAWEB Construction Intelligence | Executive PDF V2", page.width - page.margin, 24, { align: "right" })
}

function addWrappedText(doc: jsPDF, text: string, x: number, y: number, maxWidth: number, lineHeight = 5) {
  const lines = doc.splitTextToSize(text, maxWidth)
  doc.text(lines, x, y)
  return y + lines.length * lineHeight
}

function addMetric(doc: jsPDF, label: string, value: string, x: number, y: number, width = 42) {
  setFill(doc, colors.panel)
  doc.roundedRect(x, y, width, 24, 2, 2, "F")
  setText(doc, colors.muted)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(7)
  doc.text(label, x + 4, y + 8)
  setText(doc, colors.text)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.text(value, x + 4, y + 18)
}

function addLineTableHeader(doc: jsPDF, y: number) {
  setFill(doc, [18, 43, 75])
  doc.rect(page.margin, y, page.width - page.margin * 2, 8, "F")
  setText(doc, colors.sky)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(6.5)
  doc.text("Especialidade / Item", page.margin + 2, y + 5)
  doc.text("Material / Marca / Fornecedor", 58, y + 5)
  doc.text("Qtd.", 116, y + 5)
  doc.text("M.O.", 133, y + 5)
  doc.text("Equip.", 151, y + 5)
  doc.text("Subtotal", 171, y + 5)
  return y + 10
}

function addBudgetLine(doc: jsPDF, item: ConstructionCostBreakdownLine, y: number) {
  setText(doc, colors.text)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(7)
  doc.text(doc.splitTextToSize(`${item.specialty} | ${item.itemName}`, 38), page.margin + 2, y)

  setText(doc, colors.muted)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(6.5)
  doc.text(doc.splitTextToSize(`${item.materialName} | ${compactPdfV2Text(item.brand)} | ${compactPdfV2Text(item.supplierName)}`, 54), 58, y)
  doc.text(`${item.quantity} ${item.unit}`, 116, y)
  doc.text(formatPdfV2Currency(item.laborCost), 133, y)
  doc.text(formatPdfV2Currency(item.equipmentCost), 151, y)
  setText(doc, colors.gold)
  doc.setFont("helvetica", "bold")
  doc.text(formatPdfV2Currency(item.subtotal), 171, y)
  setText(doc, colors.muted)
  doc.setFont("helvetica", "normal")
  doc.text(`Prod.: ${compactPdfV2Text(item.productivityRate)} | Conf.: ${formatPdfV2Score(item.confidenceScore)}`, 58, y + 6)
}

export function addPdfV2Cover(doc: jsPDF, context: ConstructionPdfV2Context) {
  addBackground(doc)
  setText(doc, colors.gold)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(18)
  doc.text("IAWEB Construction Intelligence", page.margin, 60)

  setText(doc, colors.text)
  doc.setFontSize(26)
  doc.text(doc.splitTextToSize(context.project.name, 170), page.margin, 82)

  setText(doc, colors.muted)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(11)
  doc.text(`Pais: ${context.project.country}`, page.margin, 116)
  doc.text(`Tipologia: ${context.project.project_type}`, page.margin, 124)
  doc.text(`Data: ${formatPdfV2Date(context.generatedAt)}`, page.margin, 132)

  setFill(doc, colors.panel)
  doc.roundedRect(page.margin, 154, page.width - page.margin * 2, 42, 3, 3, "F")
  setText(doc, colors.text)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.text("PDF Executivo Premium V2", page.margin + 6, 169)
  setText(doc, colors.muted)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  addWrappedText(doc, "Estimativa indicativa baseada na documentacao analisada.", page.margin + 6, 181, 160, 5)
}

export function addPdfV2ExecutiveSummary(doc: jsPDF, context: ConstructionPdfV2Context) {
  addPage(doc, "Resumo Executivo")
  addMetric(doc, "Maturidade", formatPdfV2Score(context.scores.maturityScore), page.margin, 48)
  addMetric(doc, "Risco", formatPdfV2Score(context.scores.riskScore), page.margin + 46, 48)
  addMetric(doc, "Complexidade", formatPdfV2Score(context.scores.complexityScore), page.margin + 92, 48)
  addMetric(doc, "Confianca", formatPdfV2Score(context.scores.confidenceScore), page.margin + 138, 48)

  setText(doc, colors.text)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.text("Estimativa completa", page.margin, 92)
  setText(doc, colors.gold)
  doc.setFontSize(18)
  doc.text(formatPdfV2Range(context.costBreakdown.estimatedFullCostRange), page.margin, 104)

  setText(doc, colors.muted)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.text(`Percentagem desbloqueada: ${formatPdfV2Percent(context.unlockedAnalysis.unlockedPercentage)}`, page.margin, 117)
  doc.text(`Documentos identificados: ${context.detectedDocuments.length}`, page.margin, 126)
  doc.text(`Engine: ${context.costBreakdown.engineVersion} | Cenario: ${context.costBreakdown.scenario}`, page.margin, 135)

  const notes = [
    "Relatorio premium gerado a partir do Cost Engine V2 e validado pelo Unlock Engine.",
    "Os valores sao faixas indicativas de mercado e pressupostos automaticos, nao precos exatos.",
  ]
  let y = 156
  for (const note of notes) {
    y = addWrappedText(doc, note, page.margin, y, 176, 6) + 2
  }
}

export function addPdfV2BudgetBySpecialty(doc: jsPDF, context: ConstructionPdfV2Context) {
  addPage(doc, "Orcamento por Especialidade")
  let y = addLineTableHeader(doc, 46)

  for (const item of context.costBreakdown.items) {
    if (y > 266) {
      addPage(doc, "Orcamento por Especialidade")
      y = addLineTableHeader(doc, 46)
    }

    addBudgetLine(doc, item, y)
    setText(doc, colors.line)
    doc.line(page.margin, y + 10, page.width - page.margin, y + 10)
    y += 16
  }
}

export function addPdfV2MaterialsSuppliers(doc: jsPDF, context: ConstructionPdfV2Context) {
  addPage(doc, "Materiais e Fornecedores")
  const unique = new Map<string, ConstructionCostBreakdownLine>()

  for (const item of context.costBreakdown.items) {
    unique.set(`${item.materialName}-${item.brand}-${item.supplierName}`, item)
  }

  let y = 48
  for (const item of Array.from(unique.values())) {
    if (y > 260) {
      addPage(doc, "Materiais e Fornecedores")
      y = 48
    }

    setText(doc, colors.text)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(9)
    doc.text(item.materialName, page.margin, y)
    setText(doc, colors.muted)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(8)
    doc.text(`Marca: ${compactPdfV2Text(item.brand)} | Fornecedor: ${compactPdfV2Text(item.supplierName)} | Pais/Regiao: ${item.country}`, page.margin, y + 6)
    y += 15
  }
}

export function addPdfV2LaborProductivity(doc: jsPDF, context: ConstructionPdfV2Context) {
  addPage(doc, "Mao de Obra e Produtividade")
  let y = 48

  for (const item of context.costBreakdown.items) {
    if (y > 260) {
      addPage(doc, "Mao de Obra e Produtividade")
      y = 48
    }

    setText(doc, colors.text)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(9)
    doc.text(`${item.specialty} | ${compactPdfV2Text(item.laborRole)}`, page.margin, y)
    setText(doc, colors.muted)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(8)
    doc.text(`Produtividade: ${compactPdfV2Text(item.productivityRate)} | Unidade: ${item.unit} | Custo estimado: ${formatPdfV2Currency(item.laborCost)}`, page.margin, y + 6)
    y += 15
  }
}

export function addPdfV2Equipment(doc: jsPDF, context: ConstructionPdfV2Context) {
  addPage(doc, "Equipamentos")
  let y = 48

  for (const item of context.costBreakdown.items) {
    if (y > 260) {
      addPage(doc, "Equipamentos")
      y = 48
    }

    setText(doc, colors.text)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(9)
    doc.text(compactPdfV2Text(item.equipmentName, "Equipamento geral"), page.margin, y)
    setText(doc, colors.muted)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(8)
    doc.text(`${item.specialty} | Dias estimados: indicativo | Custo estimado: ${formatPdfV2Currency(item.equipmentCost)}`, page.margin, y + 6)
    y += 15
  }
}

export function addPdfV2RisksRecommendations(doc: jsPDF, context: ConstructionPdfV2Context) {
  addPage(doc, "Riscos e Recomendacoes")
  const alerts = context.health?.alerts.length ? context.health.alerts : [
    {
      title: "Validacao tecnica pendente",
      severity: "medium",
      recommendation: "Rever medicoes, mapas de quantidades e fornecedores antes de fechar proposta.",
    },
  ]
  const recommendations = context.health?.knowledgeGraph?.recommendations ?? [
    "Confirmar quantidades reais com medicoes tecnicas.",
    "Solicitar cotacoes atualizadas a fornecedores locais.",
    "Validar produtividade e prazo com equipa de obra.",
  ]

  let y = 48
  setText(doc, colors.gold)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(11)
  doc.text("Principais riscos detectados", page.margin, y)
  y += 10

  for (const alert of alerts.slice(0, 7)) {
    setText(doc, colors.text)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(8.5)
    doc.text(`${alert.title} (${alert.severity})`, page.margin, y)
    setText(doc, colors.muted)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(8)
    y = addWrappedText(doc, alert.recommendation, page.margin, y + 6, 172, 5) + 3
  }

  y += 4
  setText(doc, colors.gold)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(11)
  doc.text("Proximos passos", page.margin, y)
  y += 10

  for (const recommendation of recommendations.slice(0, 8)) {
    setText(doc, colors.muted)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(8)
    y = addWrappedText(doc, `- ${recommendation}`, page.margin, y, 172, 5) + 2
  }
}

export function addPdfV2Disclaimer(doc: jsPDF) {
  addPage(doc, "Disclaimer")
  const disclaimers = [
    "Este relatorio nao substitui orcamento tecnico validado por profissional habilitado.",
    "Os valores apresentados sao faixas indicativas baseadas na documentacao fornecida, bases de custo internas e pressupostos automaticos.",
    "A precisao depende da qualidade, maturidade e completude dos documentos enviados.",
  ]

  let y = 58
  setText(doc, colors.text)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(13)
  doc.text("Notas importantes", page.margin, y)
  y += 14

  setText(doc, colors.muted)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  for (const disclaimer of disclaimers) {
    y = addWrappedText(doc, disclaimer, page.margin, y, 170, 6) + 8
  }
}
