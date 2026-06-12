import type { ConstructionProject } from "../types"
import type { ConstructionCostBreakdownLine, ConstructionCostBreakdownV2 } from "../cost-engine-v2"

export type ConstructionAccessLevel = "free_preview" | "partial_unlocked" | "full_unlocked"

export type ConstructionUnlockBillingStatus = "trial" | "active" | "past_due" | "cancelled" | string

export type ConstructionUnlockSubscriptionInput = {
  status?: ConstructionUnlockBillingStatus | null
  planId?: string | null
  planName?: string | null
  stripeReady?: boolean | null
  remainingThisMonth?: number | null
}

export type ConstructionUnlockInput = {
  projectId?: string | null
  project?: ConstructionProject | null
  userId?: string | null
  organizationId?: string | null
  costBreakdownV2: ConstructionCostBreakdownV2
  subscription?: ConstructionUnlockSubscriptionInput | null
  billingStatus?: ConstructionUnlockBillingStatus | null
  forcedAccessLevel?: ConstructionAccessLevel | null
}

export type ConstructionUpgradeCTA = {
  label: "Desbloquear Analise Completa"
  title: string
  body: string
  href: string
}

export type ConstructionLockedFeature = {
  key: string
  label: string
  description: string
}

export type UnlockedConstructionAnalysis = {
  accessLevel: ConstructionAccessLevel
  unlockedPercentage: number
  unlockedItems: ConstructionCostBreakdownLine[]
  lockedItems: ConstructionLockedFeature[]
  visibleSpecialties: ConstructionCostBreakdownLine[]
  lockedSpecialties: ConstructionCostBreakdownLine[]
  totalVisibleCost: number
  estimatedFullCostRange: {
    min: number
    max: number
  }
  upgradeCTA: ConstructionUpgradeCTA
  canDownloadFullPdf: boolean
  canViewFullBenchmark: boolean
  canViewSuppliers: boolean
  canViewProductivity: boolean
  canViewAIRecommendations: boolean
  projectId: string | null
  userId: string | null
  organizationId: string | null
  planName: string | null
}
