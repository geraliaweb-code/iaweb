import type { ConstructionCostBreakdownLine, ConstructionCostBreakdownV2 } from "../cost-engine-v2"
import { constructionLockedFeatures, constructionUnlockCopy } from "./locked-items"
import {
  canViewPremiumConstructionFeature,
  resolveConstructionAccessLevel,
  resolveUnlockedPercentage,
  resolveVisibleSpecialtyCount,
} from "./unlock-rules"
import type { ConstructionUnlockInput, ConstructionUpgradeCTA, UnlockedConstructionAnalysis } from "./types"

function roundCurrency(value: number) {
  return Math.round(value * 100) / 100
}

function maskLineForPreview(line: ConstructionCostBreakdownLine, canViewFullDetails: boolean): ConstructionCostBreakdownLine {
  if (canViewFullDetails) return line

  return {
    ...line,
    supplierName: line.supplierName ? "Bloqueado" : null,
    productivityRate: line.productivityRate ? null : line.productivityRate,
    notes: [
      "Linha parcial visivel na previa gratuita.",
      "Fornecedor, produtividade detalhada e recomendacoes completas ficam bloqueados.",
    ],
  }
}

export function buildConstructionUpgradeCTA(): ConstructionUpgradeCTA {
  return {
    label: constructionUnlockCopy.label,
    title: constructionUnlockCopy.title,
    body: constructionUnlockCopy.body,
    href: constructionUnlockCopy.href,
  }
}

export function buildUnlockedPreviewFromBreakdown(input: ConstructionUnlockInput): UnlockedConstructionAnalysis {
  const accessLevel = resolveConstructionAccessLevel(input)
  const canViewFullDetails = canViewPremiumConstructionFeature(accessLevel)
  const breakdown: ConstructionCostBreakdownV2 = input.costBreakdownV2
  const visibleCount = resolveVisibleSpecialtyCount(accessLevel, breakdown.items.length)
  const unlockedPercentage = resolveUnlockedPercentage(accessLevel, breakdown.items.length)
  const visibleSpecialties = breakdown.items.slice(0, visibleCount).map((line) => maskLineForPreview(line, canViewFullDetails))
  const lockedSpecialties = canViewFullDetails ? [] : breakdown.items.slice(visibleCount)
  const totalVisibleCost = roundCurrency(visibleSpecialties.reduce((total, item) => total + item.subtotal, 0))

  return {
    accessLevel,
    unlockedPercentage,
    unlockedItems: visibleSpecialties,
    lockedItems: canViewFullDetails ? [] : constructionLockedFeatures,
    visibleSpecialties,
    lockedSpecialties,
    totalVisibleCost,
    estimatedFullCostRange: breakdown.estimatedFullCostRange,
    upgradeCTA: buildConstructionUpgradeCTA(),
    canDownloadFullPdf: canViewFullDetails,
    canViewFullBenchmark: canViewFullDetails,
    canViewSuppliers: canViewFullDetails,
    canViewProductivity: canViewFullDetails,
    canViewAIRecommendations: canViewFullDetails,
    projectId: input.projectId ?? input.project?.id ?? breakdown.projectId,
    userId: input.userId ?? null,
    organizationId: input.organizationId ?? input.project?.organization_id ?? null,
    planName: input.subscription?.planName ?? input.subscription?.planId ?? null,
  }
}
