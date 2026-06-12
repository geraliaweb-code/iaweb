import type { NextBestAction, ProjectIntelligenceSnapshot } from "./types"
import { deriveActionPriority, prioritizeActions } from "./action-prioritizer"

function makeAction(snapshot: ProjectIntelligenceSnapshot, action: Omit<NextBestAction, "priority">): NextBestAction {
  return {
    ...action,
    priority: deriveActionPriority(action, snapshot),
  }
}

export function buildDecisionActions(snapshot: ProjectIntelligenceSnapshot): NextBestAction[] {
  const actions: NextBestAction[] = []
  const missingDocuments = snapshot.healthCheck.missingCriticalDocuments.map((document) => document.toLowerCase())

  if (missingDocuments.some((document) => document.includes("quantidade") || document.includes("medicao"))) {
    actions.push(makeAction(snapshot, {
      id: "add-quantity-map",
      title: "Adicionar Mapa de Quantidades",
      description: "Aumenta a precisao do custo e reduz incerteza nas especialidades principais.",
      category: "documents",
      riskImpact: 72,
      financialImpact: 82,
      confidenceImpact: 90,
      procurementUrgency: 42,
      unlockImpact: 20,
    }))
  }

  if (snapshot.healthCheck.missingCriticalDocuments.length > 0 && !actions.some((action) => action.id === "add-quantity-map")) {
    actions.push(makeAction(snapshot, {
      id: "add-critical-documents",
      title: "Adicionar Mapa de Quantidades",
      description: "Completar documentos criticos para elevar a confianca executiva da obra.",
      category: "documents",
      riskImpact: 62,
      financialImpact: 68,
      confidenceImpact: 88,
      procurementUrgency: 35,
      unlockImpact: 20,
    }))
  }

  if (snapshot.healthCheck.alerts.some((alert) => `${alert.title} ${alert.recommendation}`.toLowerCase().includes("avac"))) {
    actions.push(makeAction(snapshot, {
      id: "validate-hvac",
      title: "Validar Projeto AVAC",
      description: "Confirmar requisitos AVAC antes de fechar custo, prazo e compras tecnicas.",
      category: "technical",
      riskImpact: 82,
      financialImpact: 58,
      confidenceImpact: 60,
      procurementUrgency: 54,
      unlockImpact: 10,
    }))
  }

  if (snapshot.costIntelligence.warnings.some((warning) => warning.toLowerCase().includes("etics")) || snapshot.advisor.insights.some((insight) => insight.title.toLowerCase().includes("etics"))) {
    actions.push(makeAction(snapshot, {
      id: "review-etics",
      title: "Rever ETICS",
      description: "Validar solucao de fachada para evitar derrapagens de materiais e execucao.",
      category: "technical",
      riskImpact: 64,
      financialImpact: 64,
      confidenceImpact: 38,
      procurementUrgency: 48,
      unlockImpact: 10,
    }))
  }

  if (snapshot.supplier.recommendations.some((supplier) => supplier.specialties.some((specialty) => specialty.toLowerCase().includes("caixilh")))) {
    actions.push(makeAction(snapshot, {
      id: "compare-window-suppliers",
      title: "Comparar fornecedores de caixilharias",
      description: "Comparar fornecedor recomendado com alternativas antes de fechar encomenda.",
      category: "supplier",
      riskImpact: 48,
      financialImpact: 72,
      confidenceImpact: 34,
      procurementUrgency: 60,
      unlockImpact: snapshot.unlock.canViewSuppliers === false ? 80 : 20,
    }))
  }

  if (snapshot.procurement.criticalItems.length || snapshot.procurement.highPriorityItems.length) {
    actions.push(makeAction(snapshot, {
      id: "start-critical-procurement",
      title: "Iniciar aquisicao de materiais criticos",
      description: "Antecipar compras de materiais com maior risco de prazo, custo ou disponibilidade.",
      category: "procurement",
      riskImpact: 76,
      financialImpact: 70,
      confidenceImpact: 30,
      procurementUrgency: 92,
      unlockImpact: 20,
    }))
  }

  if (snapshot.timeline.delayRisks.length) {
    const mainRisk = snapshot.timeline.delayRisks[0]
    actions.push(makeAction(snapshot, {
      id: "reduce-timeline-risk",
      title: mainRisk.recommendation,
      description: `${mainRisk.title}: pode reduzir ate ${Math.max(1, Math.round(mainRisk.impactWeeks * 0.65))} semanas de risco temporal.`,
      category: "timeline",
      riskImpact: mainRisk.severity === "critical" ? 92 : mainRisk.severity === "high" ? 78 : 58,
      financialImpact: 44,
      confidenceImpact: 48,
      procurementUrgency: mainRisk.title.toLowerCase().includes("procurement") ? 94 : 46,
      unlockImpact: 10,
    }))
  }

  if (snapshot.benchmark.position === "acima_da_media" || snapshot.advisor.totalPotentialSavings > 0) {
    actions.push(makeAction(snapshot, {
      id: "review-cost-outliers",
      title: "Rever desvios face ao benchmark",
      description: "Priorizar rubricas acima da media e oportunidades de poupanca ja identificadas.",
      category: "cost",
      riskImpact: 46,
      financialImpact: 94,
      confidenceImpact: 42,
      procurementUrgency: 36,
      unlockImpact: snapshot.benchmark.isBlocked ? 80 : 20,
    }))
  }

  if (snapshot.unlock.accessLevel === "free_preview" || snapshot.unlock.blockedItems.length > 0 || snapshot.benchmark.isBlocked) {
    actions.push(makeAction(snapshot, {
      id: "unlock-full-analysis",
      title: "Desbloquear Analise Completa",
      description: "Abrir custo completo, fornecedores, benchmark, PDF executivo e oportunidades bloqueadas.",
      category: "unlock",
      riskImpact: 38,
      financialImpact: 86,
      confidenceImpact: 72,
      procurementUrgency: 44,
      unlockImpact: 100,
      ctaLabel: "Desbloquear Analise Completa",
      href: "/construction/billing",
    }))
  }

  if (!actions.length) {
    actions.push(makeAction(snapshot, {
      id: "keep-monitoring",
      title: "Manter monitorizacao executiva",
      description: "Reavaliar a obra quando novos documentos, custos ou fornecedores forem adicionados.",
      category: "technical",
      riskImpact: 22,
      financialImpact: 20,
      confidenceImpact: 30,
      procurementUrgency: 18,
      unlockImpact: 0,
    }))
  }

  return prioritizeActions(actions)
}
