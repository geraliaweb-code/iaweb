import { jsPDF } from "jspdf"
import QRCode from "qrcode"
import type { DiagnosticoFormData, DiagnosticoResult, ScoreCategory } from "@/lib/diagnostico"
import { calculateFinanceImpact, formatEuro, type FinanceImpact } from "@/lib/finance-impact"
import { getNicheEngine, type NicheEngine } from "@/lib/niches"
import { iawebPdfBranding } from "./branding"

type PdfContext = {
  formData: DiagnosticoFormData
  result: DiagnosticoResult
}

type ScoreKey = ScoreCategory | "seo" | "whatsapp" | "redesSociais"

type PlanTier = {
  name: "Homepage Premium" | "Website Profissional" | "Sistema Comercial" | "IAWEB Growth Engine"
  setup: string
  monthly: string
  benefits: string[]
  expectedResult: string
  priority: "Imediata" | "Alta" | "Estrategica"
}

type DetailedSection = {
  title: string
  score: number
  currentState: string
  problem: string
  impact: string
  recommendation: string
}

type ExecutivePdfModel = {
  company: string
  contactName: string
  email: string
  whatsapp: string
  website: string
  sector: string
  objective: string
  dateLabel: string
  score: number
  scores: Record<ScoreKey, number>
  classification: string
  executiveSummary: {
    failures: string[]
    opportunities: string[]
    estimatedImpact: string
  }
  niche: NicheEngine
  plan: PlanTier
  finance: FinanceImpact
  detailedSections: DetailedSection[]
}

type PageRenderer = (doc: jsPDF, model: ExecutivePdfModel) => void

const page = {
  width: 210,
  height: 297,
  margin: 16,
}

const brand = {
  bg: iawebPdfBranding.colors.background,
  bg2: iawebPdfBranding.colors.backgroundAlt,
  panel: iawebPdfBranding.colors.panel,
  panelSoft: "#101A31",
  electric: iawebPdfBranding.colors.electric,
  blue: iawebPdfBranding.colors.blue,
  blueSoft: iawebPdfBranding.colors.blueSoft,
  gold: iawebPdfBranding.colors.gold,
  goldDark: iawebPdfBranding.colors.goldDark,
  white: iawebPdfBranding.colors.white,
  muted: iawebPdfBranding.colors.muted,
  subtle: iawebPdfBranding.colors.subtle,
  line: iawebPdfBranding.colors.line,
  danger: iawebPdfBranding.colors.danger,
  success: iawebPdfBranding.colors.success,
}

const reportLayouts: Record<"executive", PageRenderer[]> = {
  executive: [
    renderCoverPage,
    renderSummaryPage,
    renderFinancePage,
    renderDetailedPage,
    renderPlanPage,
    renderNextStepsPage,
    renderInstitutionalPage,
  ],
}

const totalPages = reportLayouts.executive.length

const scoreLabels: Record<ScoreKey, string> = {
  website: "Website",
  google: "Google",
  conversao: "Conversao",
  automacao: "Automacao",
  seo: "SEO",
  whatsapp: "WhatsApp",
  redesSociais: "Redes Sociais",
}

export function downloadDiagnosticoPdf(context: PdfContext) {
  const doc = createDiagnosticoPdf(context)
  const company = sanitizeFilename(context.formData.empresa || "empresa")

  doc.save(`relatorio-executivo-iaweb-${company}.pdf`)
}

export function createDiagnosticoPdf(context: PdfContext) {
  const doc = new jsPDF({ unit: "mm", format: "a4", compress: true })
  const model = buildExecutivePdfModel(context)

  doc.setProperties({
    title: `Relatorio Executivo IAWEB - ${model.company}`,
    author: iawebPdfBranding.pdfMetadata.author,
    creator: iawebPdfBranding.pdfMetadata.creator,
    subject: iawebPdfBranding.pdfMetadata.subject,
    keywords: iawebPdfBranding.pdfMetadata.keywords,
  })

  reportLayouts.executive.forEach((renderPage, index) => {
    if (index > 0) doc.addPage()
    drawPremiumBackground(doc, index)
    drawWatermark(doc)
    drawInstitutionalHeader(doc)
    renderPage(doc, model)
    drawFooter(doc, index + 1)
  })

  return doc
}

function buildExecutivePdfModel({ formData, result }: PdfContext): ExecutivePdfModel {
  const sector = mapDiagnosticoSectorToNiche(formData.setor)
  const niche = getNicheEngine(sector)
  const plan = selectRecommendedPlan(result.scoreFinal, formData.objetivo)
  const scores = buildExtendedScores(formData, result)
  const finance = calculateFinanceImpact({ niche: sector, packageName: plan.name, score: result.scoreFinal })
  const detailedSections = buildDetailedSections(scores, niche)

  return {
    company: safe(formData.empresa, "Empresa analisada"),
    contactName: safe(formData.nome, "Responsavel"),
    email: safe(formData.email, "Email a confirmar"),
    whatsapp: safe(formData.whatsapp, "WhatsApp a confirmar"),
    website: safe(formData.website, "Sem website indicado"),
    sector: safe(formData.setor, niche.label),
    objective: safe(formData.objetivo, "Crescimento comercial"),
    dateLabel: new Intl.DateTimeFormat("pt-PT", { day: "2-digit", month: "long", year: "numeric" }).format(new Date()),
    score: result.scoreFinal,
    scores,
    classification: result.classificacao.label,
    executiveSummary: {
      failures: buildExecutiveFailures(scores, niche),
      opportunities: buildExecutiveOpportunities(niche, result.recomendacoes),
      estimatedImpact: finance.impactPhrase,
    },
    niche,
    plan,
    finance,
    detailedSections,
  }
}

function renderCoverPage(doc: jsPDF, model: ExecutivePdfModel) {
  drawLogo(doc, 16, 20)
  drawPill(doc, 16, 42, "RELATORIO EXECUTIVO PREMIUM", brand.electric, 58)

  doc.setTextColor(brand.white)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(31)
  doc.text("Diagnostico", 16, 78)
  doc.text("Estrategico Digital", 16, 91)

  doc.setFont("helvetica", "normal")
  doc.setTextColor(brand.muted)
  doc.setFontSize(12)
  doc.text(doc.splitTextToSize("Analise de presenca digital, oportunidades de crescimento e potencial financeiro.", 112), 16, 106)

  drawGlassPanel(doc, 16, 132, 116, 62, "Analise preparada para")
  doc.setTextColor(brand.white)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(21)
  doc.text(fitText(doc, model.company, 98), 24, 153)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(brand.muted)
  doc.setFontSize(10)
  doc.text(`Setor: ${model.sector}`, 24, 166)
  doc.text(`Objetivo: ${fitText(doc, model.objective, 84)}`, 24, 174)
  doc.text(`Data: ${model.dateLabel}`, 24, 182)

  drawLargeScore(doc, 154, 78, model.score)
  drawMetricCard(doc, 144, 132, 48, 22, "Score Digital", `${model.score}/100`, brand.electric)
  drawMetricCard(doc, 144, 160, 48, 22, "Plano sugerido", model.plan.name, brand.gold, 8)
  drawStrategyStatement(doc, 16, 218, model)
}

function renderSummaryPage(doc: jsPDF, model: ExecutivePdfModel) {
  drawPageTitle(doc, "Resumo Executivo", "Leitura de negocio para decisao rapida.")
  drawMetricCard(doc, 16, 54, 38, 26, "Score Geral", `${model.score}/100`, brand.electric)
  drawMetricCard(doc, 60, 54, 38, 26, "Website", `${model.scores.website}/100`, getScoreColor(model.scores.website))
  drawMetricCard(doc, 104, 54, 38, 26, "Google", `${model.scores.google}/100`, getScoreColor(model.scores.google))
  drawMetricCard(doc, 148, 54, 46, 26, "Redes Sociais", `${model.scores.redesSociais}/100`, getScoreColor(model.scores.redesSociais))

  let y = 96
  ;(["website", "google", "conversao", "automacao", "redesSociais"] as ScoreKey[]).forEach((key) => {
    drawScoreRow(doc, scoreLabels[key], model.scores[key], 16, y, 82)
    y += 17
  })

  drawGlassPanel(doc, 112, 96, 82, 67, "Resumo automatico")
  doc.setTextColor(brand.white)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.text("Principais falhas", 120, 114)
  drawBulletList(doc, model.executiveSummary.failures, 120, 124, 64, brand.danger)

  drawGlassPanel(doc, 16, 194, 82, 58, "Impacto estimado")
  doc.setTextColor(brand.white)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(13)
  doc.text("Oportunidades nao capturadas", 24, 213)
  doc.setTextColor(brand.muted)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.text(doc.splitTextToSize(model.executiveSummary.estimatedImpact, 65), 24, 225)

  drawGlassPanel(doc, 108, 180, 86, 72, "Oportunidades")
  drawBulletList(doc, model.executiveSummary.opportunities, 116, 198, 66, brand.electric)
}

function renderFinancePage(doc: jsPDF, model: ExecutivePdfModel) {
  drawPageTitle(doc, "Impacto Financeiro", "Estimativas conservadoras com base no cenario analisado.")

  const financeCards = [
    ["Oportunidades perdidas", `${model.finance.lostLeadsMonthly.min}-${model.finance.lostLeadsMonthly.max} ${model.finance.opportunityLabel}`, brand.electric],
    ["Potencial mensal", `${formatEuro(model.finance.lostRevenueMonthly.min)}-${formatEuro(model.finance.lostRevenueMonthly.max)}`, brand.gold],
    ["Potencial anual", `${formatEuro(model.finance.lostRevenueAnnual.min)}-${formatEuro(model.finance.lostRevenueAnnual.max)}`, brand.electric],
    ["ROI estimado", `${model.finance.potentialRoi.min}x-${model.finance.potentialRoi.max}x`, brand.gold],
    ["Payback", model.finance.estimatedPayback, brand.electric],
    ["Investimento", `${formatEuro(model.finance.recommendedInvestment.min)}-${formatEuro(model.finance.recommendedInvestment.max)}`, brand.gold],
  ] as const

  financeCards.forEach(([label, value, color], index) => {
    const x = 16 + (index % 2) * 92
    const y = 58 + Math.floor(index / 2) * 42
    drawMetricCard(doc, x, y, 86, 30, label, value, color, 9)
  })

  drawGlassPanel(doc, 16, 194, 178, 54, "Leitura comercial")
  doc.setTextColor(brand.white)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(15)
  doc.text("Potencial estimado, nao promessa de resultado.", 24, 214)
  doc.setTextColor(brand.muted)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.text(
    doc.splitTextToSize(
      `${model.finance.impactPhrase} Estes valores devem ser tratados como uma janela de oportunidade para orientar prioridades, proposta e proxima acao comercial.`,
      154,
    ),
    24,
    229,
  )

  drawProgressInsight(doc, 24, 264, "Maturidade digital atual", model.score)
}

function renderDetailedPage(doc: jsPDF, model: ExecutivePdfModel) {
  drawPageTitle(doc, "Analise Detalhada", "Estado atual, problema, impacto e recomendacao por area.")

  model.detailedSections.forEach((section, index) => {
    const x = 16 + (index % 2) * 92
    const y = 54 + Math.floor(index / 2) * 69
    drawAnalysisCard(doc, x, y, 86, 58, section)
  })
}

function renderPlanPage(doc: jsPDF, model: ExecutivePdfModel) {
  drawPageTitle(doc, "Plano Recomendado", "Sequencia comercial para transformar diagnostico em execucao.")

  drawGlassPanel(doc, 16, 54, 178, 62, "Recomendacao IAWEB")
  doc.setTextColor(brand.gold)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(11)
  doc.text(model.plan.priority.toUpperCase(), 24, 72)
  doc.setTextColor(brand.white)
  doc.setFontSize(23)
  doc.text(model.plan.name, 24, 86)
  doc.setTextColor(brand.muted)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.text(`Setup: ${model.plan.setup}  |  Mensalidade: ${model.plan.monthly}`, 24, 99)
  doc.text(doc.splitTextToSize(model.plan.expectedResult, 128), 24, 109)
  drawScoreBadge(doc, 166, 83, model.score, 22)

  const plans = getPlanTiers()
  plans.forEach((plan, index) => {
    const x = 16 + (index % 2) * 92
    const y = 136 + Math.floor(index / 2) * 58
    drawPlanCard(doc, x, y, 86, 47, plan, plan.name === model.plan.name)
  })

  drawGlassPanel(doc, 16, 260, 178, 22, "Escopo orientado ao nicho")
  drawInlineChips(doc, model.niche.salesArguments.slice(0, 3), 24, 275, 154)
}

function renderNextStepsPage(doc: jsPDF, model: ExecutivePdfModel) {
  drawPageTitle(doc, "Proximos Passos", "A decisao agora e transformar potencial em acao comercial.")

  drawGlassPanel(doc, 16, 58, 178, 50, "Mensagem executiva")
  doc.setTextColor(brand.white)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(17)
  doc.text(doc.splitTextToSize("Enquanto este relatorio era gerado, potenciais clientes continuaram a procurar pelos seus concorrentes.", 154), 24, 78)

  const steps = [
    "Validar prioridades criticas numa reuniao estrategica.",
    "Definir primeira melhoria comercial com impacto mensuravel.",
    "Ligar website, WhatsApp e CRM num percurso simples.",
    "Acompanhar resultados e iterar com base em dados reais.",
  ]
  drawGlassPanel(doc, 16, 128, 108, 76, "Sequencia recomendada")
  drawNumberedList(doc, steps, 24, 148, 82)

  drawGlassPanel(doc, 136, 128, 58, 76, "QR Code")
  drawQrCode(doc, 150, 145, 30)
  doc.setTextColor(brand.muted)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(7)
  doc.text("Agendar reuniao", 165, 184, { align: "center" })

  drawContactCard(doc, 16, 224, model)
  drawVisualButton(doc, 54, 261, 102, 14, "Agendar Reuniao Estrategica")
}

function renderInstitutionalPage(doc: jsPDF) {
  drawLogo(doc, 78, 58, 3.2)
  drawPill(doc, 67, 82, "CONSULTORIA DIGITAL PREMIUM", brand.electric, 76)

  doc.setTextColor(brand.white)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(28)
  doc.text("Transformamos presenca", page.width / 2, 118, { align: "center" })
  doc.text("digital em crescimento real.", page.width / 2, 131, { align: "center" })

  doc.setTextColor(brand.muted)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(11)
  doc.text("Diagnostico  |  Automacao  |  CRM  |  Aquisicao de Clientes  |  Inteligencia Artificial", page.width / 2, 150, {
    align: "center",
  })

  drawGlassPanel(doc, 35, 178, 86, 58, "Contacto institucional")
  doc.setTextColor(brand.white)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(10)
  doc.text(`Website: ${iawebPdfBranding.website}`, 44, 198)
  doc.text(`Email: ${iawebPdfBranding.email}`, 44, 210)
  doc.text(`WhatsApp: ${iawebPdfBranding.whatsapp}`, 44, 222)

  drawGlassPanel(doc, 132, 178, 43, 58, "QR Code")
  drawQrCode(doc, 141, 193, 26)

  drawVisualButton(doc, 54, 254, 102, 14, "Agendar Reuniao Estrategica")
}

function buildExtendedScores(formData: DiagnosticoFormData, result: DiagnosticoResult): Record<ScoreKey, number> {
  const hasWebsite = formData.website.trim().includes(".")
  const hasWhatsApp = formData.whatsapp.trim().length >= 9
  const seo = clamp(Math.round(result.categorias.google * 0.72 + result.categorias.website * 0.18 + (hasWebsite ? 6 : 0)))
  const whatsapp = clamp(Math.round(result.categorias.conversao * 0.58 + result.categorias.automacao * 0.24 + (hasWhatsApp ? 12 : 0)))
  const redesSociais = clamp(Math.round(result.categorias.google * 0.5 + result.categorias.conversao * 0.28 + 12))

  return {
    ...result.categorias,
    seo,
    whatsapp,
    redesSociais,
  }
}

function buildExecutiveFailures(scores: Record<ScoreKey, number>, niche: NicheEngine) {
  const weakAreas = (Object.entries(scores) as Array<[ScoreKey, number]>)
    .filter(([, score]) => score < 70)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 3)
    .map(([key]) => `${scoreLabels[key]} abaixo do necessario para captar com previsibilidade.`)

  return (weakAreas.length ? weakAreas : niche.pains.slice(0, 3)).slice(0, 3)
}

function buildExecutiveOpportunities(niche: NicheEngine, recommendations: string[]) {
  return [...niche.opportunities, ...recommendations.map(rewriteRecommendation)].slice(0, 4)
}

function buildDetailedSections(scores: Record<ScoreKey, number>, niche: NicheEngine): DetailedSection[] {
  const primaryPain = niche.pains[0] ?? "A jornada digital ainda cria friccao antes do contacto."
  const primaryOpportunity = niche.opportunities[0] ?? "Criar um percurso claro ate ao pedido de contacto."

  return [
    createDetailedSection("Website", scores.website, primaryPain, "Visitantes podem abandonar antes de perceber valor.", primaryOpportunity),
    createDetailedSection("Google", scores.google, "Visibilidade e prova local ainda nao parecem suficientemente fortes.", "Procura com alta intencao pode ir para concorrentes.", "Reforcar Google Business, prova social e sinais de autoridade."),
    createDetailedSection("SEO", scores.seo, "Conteudo e estrutura podem nao cobrir pesquisas comerciais relevantes.", "Menos trafego qualificado e maior dependencia de canais pagos.", `Trabalhar palavras-chave como ${niche.keywords.slice(0, 3).join(", ")}.`),
    createDetailedSection("Conversao", scores.conversao, "O caminho entre interesse e pedido de contacto pode ter friccao.", "Leads quentes desistem antes de falar com a empresa.", "Clarificar CTA, formulario curto, WhatsApp e prova no momento certo."),
    createDetailedSection("Automacao", scores.automacao, "Seguimento comercial depende de tarefas manuais.", "Oportunidades ficam sem resposta ou sem prioridade.", "Criar follow-up simples e registo automatico no CRM."),
    createDetailedSection("WhatsApp", scores.whatsapp, "O canal existe, mas pode nao estar integrado no funil.", "Conversas perdem contexto e velocidade.", "Usar mensagem inicial, tracking e proxima acao por lead."),
  ]
}

function createDetailedSection(title: string, score: number, problem: string, impact: string, recommendation: string): DetailedSection {
  return {
    title,
    score,
    currentState: score >= 70 ? "Base forte" : score >= 45 ? "Base parcial" : "Critico",
    problem,
    impact,
    recommendation,
  }
}

function selectRecommendedPlan(score: number, objective: string): PlanTier {
  const normalized = objective.toLowerCase()
  const plans = getPlanTiers()

  if (score <= 42) return plans[0]
  if (score <= 62) return plans[1]
  if (normalized.includes("automatizar") || normalized.includes("organizar")) return plans[2]
  return plans[3]
}

function getPlanTiers(): PlanTier[] {
  return [
    {
      name: "Homepage Premium",
      setup: "desde EUR 299",
      monthly: "EUR 49-EUR 99",
      benefits: ["Homepage", "WhatsApp", "Formulario", "SEO base"],
      expectedResult: "Reposicionar a primeira impressao digital e criar um caminho direto para contacto.",
      priority: "Imediata",
    },
    {
      name: "Website Profissional",
      setup: "EUR 799-EUR 1.200",
      monthly: "EUR 99-EUR 199",
      benefits: ["Ate 5 paginas", "SEO base", "Google Maps", "Mobile"],
      expectedResult: "Construir uma presenca completa para gerar confianca, pesquisa e conversao.",
      priority: "Alta",
    },
    {
      name: "Sistema Comercial",
      setup: "EUR 1.500-EUR 2.500",
      monthly: "EUR 199-EUR 499",
      benefits: ["Website", "CRM", "Funil", "Automacoes"],
      expectedResult: "Organizar captacao, seguimento e proxima acao comercial num unico sistema.",
      priority: "Alta",
    },
    {
      name: "IAWEB Growth Engine",
      setup: "EUR 3.000-EUR 7.500+",
      monthly: "EUR 499-EUR 1.500+",
      benefits: ["CRM", "Automacao", "Agentes IA", "Relatorios"],
      expectedResult: "Criar uma maquina de aquisicao com dados, automacao e acompanhamento estrategico.",
      priority: "Estrategica",
    },
  ]
}

function mapDiagnosticoSectorToNiche(sector: string) {
  const normalized = sector.toLowerCase()

  if (normalized.includes("clinica") || normalized.includes("saude") || normalized.includes("estetica")) return "clinicas"
  if (normalized.includes("imobiliario")) return "imobiliario"
  if (normalized.includes("construcao")) return "construcao"
  if (normalized.includes("advocacia")) return "advocacia"
  if (normalized.includes("contabilidade")) return "contabilidade"
  if (normalized.includes("servicos b2b") || normalized.includes("consultoria")) return "servicos B2B"
  if (normalized.includes("industria")) return "industria"
  if (normalized.includes("turismo") || normalized.includes("alojamento")) return "restaurantes"

  return "outro"
}

function drawPremiumBackground(doc: jsPDF, pageIndex: number) {
  doc.setFillColor(brand.bg)
  doc.rect(0, 0, page.width, page.height, "F")

  doc.setFillColor(pageIndex % 2 === 0 ? brand.bg2 : brand.panel)
  doc.rect(0, 0, page.width, page.height, "F")

  for (let x = 0; x <= page.width; x += 14) {
    doc.setDrawColor("#0F2345")
    doc.setLineWidth(0.08)
    doc.line(x, 0, x, page.height)
  }

  for (let y = 0; y <= page.height; y += 14) {
    doc.setDrawColor("#0F2345")
    doc.setLineWidth(0.08)
    doc.line(0, y, page.width, y)
  }

  doc.setFillColor("#062C5C")
  doc.circle(178, 28, 42, "F")
  doc.setFillColor("#171B34")
  doc.circle(48, 268, 48, "F")
  doc.setFillColor("#3A2504")
  doc.circle(204, 190, 34, "F")

  doc.setDrawColor(pageIndex % 2 === 0 ? brand.electric : brand.gold)
  doc.setLineWidth(0.35)
  doc.line(0, 112 + pageIndex * 3, 210, 72 + pageIndex * 8)
  doc.setDrawColor("#174A7C")
  doc.setLineWidth(0.18)
  doc.line(8, 238, 196, 210)
}

function drawWatermark(doc: jsPDF) {
  if (!iawebPdfBranding.watermark.enabled) return

  doc.setTextColor("#0B1A2F")
  doc.setFont("helvetica", "bold")
  doc.setFontSize(54)
  doc.text(iawebPdfBranding.watermark.text, page.width / 2, 151, {
    align: "center",
    angle: -18,
  })
}

function drawInstitutionalHeader(doc: jsPDF) {
  drawLogo(doc, 16, 20, 1)
  doc.setTextColor(brand.subtle)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(7)
  doc.text(iawebPdfBranding.tagline, 178, 20, { align: "right" })
}

function drawFooter(doc: jsPDF, pageNumber: number) {
  if (!iawebPdfBranding.footer.enabled) return

  doc.setDrawColor(brand.line)
  doc.line(page.margin, 282, page.width - page.margin, 282)
  doc.setTextColor(brand.subtle)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(7)
  doc.text(iawebPdfBranding.companyName, page.margin, 287)
  doc.text(iawebPdfBranding.footer.text, page.margin + 22, 287)
  doc.text(`${iawebPdfBranding.website}  |  ${iawebPdfBranding.email}`, page.margin, 292)
  doc.text(`Pagina ${pageNumber} de ${totalPages}`, page.width - page.margin, 289, { align: "right" })
}

function drawLogo(doc: jsPDF, x: number, y: number, scale = 1) {
  doc.setFont("helvetica", "bold")
  doc.setFontSize(13 * scale)
  doc.setTextColor(brand.white)
  doc.text("I", x, y)
  doc.setTextColor(brand.electric)
  doc.text("A", x + 3.3 * scale, y)
  doc.setTextColor(brand.gold)
  doc.text("WEB", x + 11 * scale, y)
}

function drawPageTitle(doc: jsPDF, title: string, subtitle: string) {
  drawLogo(doc, 16, 20)
  drawPill(doc, 144, 15, "EXECUTIVE REPORT", brand.electric, 50)
  doc.setTextColor(brand.white)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(24)
  doc.text(title, 16, 40)
  doc.setTextColor(brand.muted)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.text(subtitle, 16, 49)
}

function drawGlassPanel(doc: jsPDF, x: number, y: number, width: number, height: number, label?: string) {
  doc.setFillColor("#08162B")
  doc.setDrawColor(brand.line)
  doc.setLineWidth(0.35)
  doc.roundedRect(x, y, width, height, 4, 4, "FD")
  doc.setDrawColor("#164E86")
  doc.line(x + 2, y + 1, x + width - 2, y + 1)

  if (label) {
    doc.setTextColor(brand.blueSoft)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(7)
    doc.text(label.toUpperCase(), x + 7, y + 8)
  }
}

function drawPill(doc: jsPDF, x: number, y: number, label: string, color: string, width: number) {
  doc.setFillColor("#0A1C34")
  doc.setDrawColor(color)
  doc.roundedRect(x, y, width, 9, 4.5, 4.5, "FD")
  doc.setTextColor(brand.white)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(6.5)
  doc.text(label, x + width / 2, y + 6, { align: "center" })
}

function drawLargeScore(doc: jsPDF, x: number, y: number, score: number) {
  doc.setFillColor("#071021")
  doc.setDrawColor(brand.electric)
  doc.setLineWidth(1.2)
  doc.circle(x, y, 31, "FD")
  drawRingProgress(doc, x, y, 26, score, brand.gold)
  doc.setTextColor(brand.white)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(28)
  doc.text(String(score), x, y + 3, { align: "center" })
  doc.setTextColor(brand.muted)
  doc.setFontSize(8)
  doc.text("/100", x, y + 13, { align: "center" })
}

function drawRingProgress(doc: jsPDF, x: number, y: number, radius: number, score: number, color: string) {
  const segments = Math.max(8, Math.round((score / 100) * 56))
  const start = -90
  const end = start + score * 3.6
  const step = (end - start) / segments

  doc.setDrawColor(color)
  doc.setLineWidth(2.4)

  for (let index = 0; index < segments; index += 1) {
    const angleA = ((start + step * index) * Math.PI) / 180
    const angleB = ((start + step * (index + 0.72)) * Math.PI) / 180
    doc.line(x + Math.cos(angleA) * radius, y + Math.sin(angleA) * radius, x + Math.cos(angleB) * radius, y + Math.sin(angleB) * radius)
  }
}

function drawScoreBadge(doc: jsPDF, x: number, y: number, score: number, radius: number) {
  doc.setFillColor("#071021")
  doc.setDrawColor(getScoreColor(score))
  doc.setLineWidth(0.8)
  doc.circle(x, y, radius, "FD")
  doc.setTextColor(brand.white)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(16)
  doc.text(String(score), x, y + 2, { align: "center" })
  doc.setTextColor(brand.muted)
  doc.setFontSize(6)
  doc.text("/100", x, y + 9, { align: "center" })
}

function drawMetricCard(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number,
  label: string,
  value: string,
  color: string,
  valueSize = 12,
) {
  drawGlassPanel(doc, x, y, width, height)
  doc.setTextColor(color)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(6.5)
  doc.text(label.toUpperCase(), x + 5, y + 8)
  doc.setTextColor(brand.white)
  doc.setFontSize(valueSize)
  doc.text(doc.splitTextToSize(value, width - 10), x + 5, y + 18)
}

function drawScoreRow(doc: jsPDF, label: string, score: number, x: number, y: number, width: number) {
  doc.setTextColor(brand.white)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(9)
  doc.text(label, x, y)
  doc.setTextColor(brand.muted)
  doc.text(`${score}/100`, x + width, y, { align: "right" })
  drawProgress(doc, x, y + 5, width, 4, score, getScoreColor(score))
}

function drawProgressInsight(doc: jsPDF, x: number, y: number, label: string, score: number) {
  doc.setTextColor(brand.muted)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(8)
  doc.text(label.toUpperCase(), x, y)
  drawProgress(doc, x + 58, y - 3.5, 92, 4.5, score, getScoreColor(score))
  doc.setTextColor(brand.white)
  doc.text(`${score}/100`, x + 158, y)
}

function drawProgress(doc: jsPDF, x: number, y: number, width: number, height: number, score: number, color: string) {
  doc.setFillColor("#152238")
  doc.roundedRect(x, y, width, height, height / 2, height / 2, "F")
  doc.setFillColor(color)
  doc.roundedRect(x, y, Math.max(3, (width * score) / 100), height, height / 2, height / 2, "F")
}

function drawBulletList(doc: jsPDF, items: string[], x: number, y: number, width: number, color: string) {
  let currentY = y
  items.slice(0, 4).forEach((item) => {
    doc.setFillColor(color)
    doc.circle(x, currentY - 1.5, 1.3, "F")
    doc.setTextColor(brand.muted)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(8)
    const lines = doc.splitTextToSize(item, width)
    doc.text(lines, x + 5, currentY)
    currentY += Math.max(8, lines.length * 4.2 + 3)
  })
}

function drawNumberedList(doc: jsPDF, items: string[], x: number, y: number, width: number) {
  let currentY = y
  items.forEach((item, index) => {
    doc.setFillColor(index === 0 ? brand.gold : brand.electric)
    doc.circle(x + 3, currentY - 2, 3.2, "F")
    doc.setTextColor(brand.bg)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(7)
    doc.text(String(index + 1), x + 3, currentY, { align: "center" })
    doc.setTextColor(brand.muted)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(8.5)
    doc.text(doc.splitTextToSize(item, width), x + 11, currentY)
    currentY += 13
  })
}

function drawAnalysisCard(doc: jsPDF, x: number, y: number, width: number, height: number, section: DetailedSection) {
  drawGlassPanel(doc, x, y, width, height)
  doc.setTextColor(brand.white)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(11)
  doc.text(section.title, x + 6, y + 10)
  drawProgress(doc, x + 47, y + 6, 30, 3, section.score, getScoreColor(section.score))
  doc.setTextColor(getScoreColor(section.score))
  doc.setFontSize(7)
  doc.text(section.currentState.toUpperCase(), x + 6, y + 20)
  doc.setTextColor(brand.muted)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(7.4)
  doc.text(doc.splitTextToSize(`Problema: ${section.problem}`, width - 12), x + 6, y + 29)
  doc.text(doc.splitTextToSize(`Impacto: ${section.impact}`, width - 12), x + 6, y + 42)
  doc.setTextColor(brand.white)
  doc.text(doc.splitTextToSize(`Recomendacao: ${section.recommendation}`, width - 12), x + 6, y + 55)
}

function drawPlanCard(doc: jsPDF, x: number, y: number, width: number, height: number, plan: PlanTier, active: boolean) {
  drawGlassPanel(doc, x, y, width, height)
  if (active) {
    doc.setDrawColor(brand.gold)
    doc.setLineWidth(0.8)
    doc.roundedRect(x, y, width, height, 4, 4, "S")
  }
  doc.setTextColor(active ? brand.gold : brand.white)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(10)
  doc.text(plan.name, x + 6, y + 11)
  doc.setTextColor(brand.muted)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(7.3)
  doc.text(`${plan.setup} | ${plan.monthly}`, x + 6, y + 20)
  drawInlineChips(doc, plan.benefits.slice(0, 3), x + 6, y + 31, width - 12)
}

function drawInlineChips(doc: jsPDF, items: string[], x: number, y: number, maxWidth: number) {
  let cursorX = x
  let cursorY = y

  items.forEach((item) => {
    const width = Math.min(maxWidth, doc.getTextWidth(item) + 8)
    if (cursorX + width > x + maxWidth) {
      cursorX = x
      cursorY += 9
    }
    doc.setFillColor("#0D2745")
    doc.setDrawColor("#1E5C92")
    doc.roundedRect(cursorX, cursorY - 5, width, 7, 3.5, 3.5, "FD")
    doc.setTextColor(brand.muted)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(6)
    doc.text(fitText(doc, item, width - 5), cursorX + 4, cursorY)
    cursorX += width + 3
  })
}

function drawStrategyStatement(doc: jsPDF, x: number, y: number, model: ExecutivePdfModel) {
  drawGlassPanel(doc, x, y, 178, 40, "Sintese estrategica")
  doc.setTextColor(brand.white)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.text(doc.splitTextToSize(model.niche.personalizedDiagnosis, 148), x + 8, y + 16)
  doc.setTextColor(brand.gold)
  doc.setFontSize(8)
  doc.text(`Proxima conversa: ${model.plan.name}`, x + 8, y + 34)
}

function drawQrCode(doc: jsPDF, x: number, y: number, size: number) {
  const targetUrl = getQrTargetUrl()
  const qr = QRCode.create(targetUrl, { errorCorrectionLevel: "M" })
  const moduleCount = qr.modules.size
  const quietZone = 2
  const totalModules = moduleCount + quietZone * 2
  const cellSize = size / totalModules

  doc.setFillColor(brand.white)
  doc.roundedRect(x, y, size, size, 2, 2, "F")
  doc.setFillColor(brand.bg)

  for (let row = 0; row < moduleCount; row += 1) {
    for (let col = 0; col < moduleCount; col += 1) {
      if (qr.modules.get(row, col)) {
        doc.rect(x + (col + quietZone) * cellSize, y + (row + quietZone) * cellSize, cellSize, cellSize, "F")
      }
    }
  }
}

function getQrTargetUrl() {
  const bookingUrl = process.env.NEXT_PUBLIC_DIAGNOSTICO_BOOKING_URL || process.env.NEXT_PUBLIC_BOOKING_URL || process.env.DIAGNOSTICO_BOOKING_URL

  if (bookingUrl) return normalizeExternalUrl(bookingUrl)

  const websiteUrl = normalizeExternalUrl(iawebPdfBranding.website)

  if (websiteUrl) return websiteUrl

  const whatsappDigits = iawebPdfBranding.whatsapp.replace(/\D/g, "")

  return whatsappDigits ? `https://wa.me/${whatsappDigits}` : "https://www.iaweb.pt"
}

function normalizeExternalUrl(value: string) {
  const trimmed = value.trim()

  if (!trimmed) return ""
  if (/^https?:\/\//i.test(trimmed)) return trimmed

  return `https://${trimmed}`
}

function drawContactCard(doc: jsPDF, x: number, y: number, model: ExecutivePdfModel) {
  drawGlassPanel(doc, x, y, 178, 26, "Contacto")
  doc.setTextColor(brand.white)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(9)
  doc.text("WhatsApp: +351 913 837 004", x + 8, y + 14)
  doc.text("Email: geral@iaweb.pt", x + 75, y + 14)
  doc.text("Website: iaweb.pt", x + 132, y + 14)
  doc.setTextColor(brand.muted)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(7)
  doc.text(`Lead: ${model.contactName} | ${model.email} | ${model.whatsapp}`, x + 8, y + 22)
}

function drawVisualButton(doc: jsPDF, x: number, y: number, width: number, height: number, label: string) {
  doc.setFillColor(brand.blue)
  doc.setDrawColor(brand.gold)
  doc.roundedRect(x, y, width, height, 7, 7, "FD")
  doc.setTextColor(brand.white)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(9)
  doc.text(label, x + width / 2, y + 9, { align: "center" })
}

function getScoreColor(score: number) {
  if (score <= 40) return brand.danger
  if (score <= 70) return brand.gold
  return brand.success
}

function rewriteRecommendation(text: string) {
  return text
    .replace("Rever a primeira dobra do website para comunicar valor, prova e CTA em menos de cinco segundos.", "Melhorar a primeira impressao para comunicar valor, prova e proximo passo.")
    .replace("Otimizar Google Business e sinais locais para aumentar visibilidade nas pesquisas de maior intencao.", "Reforcar Google Business e sinais locais nas pesquisas de maior intencao.")
    .replace("Criar um caminho de conversao mais direto com CTA claro, formulario curto e resposta rapida.", "Reduzir friccao entre visita, pedido de contacto e resposta comercial.")
    .replace("Ligar formularios e WhatsApp a um processo de seguimento para reduzir oportunidades perdidas.", "Ligar formularios e WhatsApp a seguimento estruturado no CRM.")
}

function fitText(doc: jsPDF, text: string, width: number) {
  const lines = doc.splitTextToSize(text, width)
  return lines[0] ?? text
}

function safe(value: string | undefined, fallback: string) {
  return value?.trim() || fallback
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)))
}

function sanitizeFilename(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
}
