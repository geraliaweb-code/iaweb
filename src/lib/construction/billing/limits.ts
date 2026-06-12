import type { ConstructionProject } from "../types"
import type { ConstructionBillingPlan, ConstructionBillingStatus } from "./plans"

export type ConstructionBillableAction = "analyze_documents" | "run_health_check" | "run_benchmark" | "generate_pdf"

export type ConstructionUsageDecision = {
  allowed: boolean
  reason: string | null
  status: ConstructionBillingStatus
  plan: ConstructionBillingPlan
  usedThisMonth: number
  remainingThisMonth: number
  monthlyLimit: number
  trialEndsAt: string | null
}

export function getConstructionBillingScope(project: ConstructionProject | { id: string; organization_id?: string | null }) {
  return {
    organizationId: project.organization_id ?? null,
    projectId: project.id,
    scopeKey: project.organization_id ? `organization:${project.organization_id}` : `project:${project.id}`,
  }
}

export function evaluateConstructionUsageLimit(input: {
  plan: ConstructionBillingPlan
  status: ConstructionBillingStatus
  usedThisMonth: number
  trialEndsAt: string | null
  now?: Date
}): ConstructionUsageDecision {
  const blockedStatus = input.status === "past_due" || input.status === "cancelled"
  const remainingThisMonth = Math.max(0, input.plan.monthlyAnalysisLimit - input.usedThisMonth)
  const limitReached = remainingThisMonth <= 0

  return {
    allowed: !blockedStatus && !limitReached,
    reason: blockedStatus
      ? "Subscricao indisponivel. Regulariza o plano para continuar."
      : limitReached
        ? "Analise parcial gratuita usada. Ative um plano Construction Intelligence para continuar."
        : null,
    status: input.status,
    plan: input.plan,
    usedThisMonth: input.usedThisMonth,
    remainingThisMonth,
    monthlyLimit: input.plan.monthlyAnalysisLimit,
    trialEndsAt: input.trialEndsAt,
  }
}
