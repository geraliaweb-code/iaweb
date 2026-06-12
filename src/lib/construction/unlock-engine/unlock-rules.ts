import type { ConstructionAccessLevel, ConstructionUnlockInput } from "./types"

export function hasActiveConstructionPlan(input: ConstructionUnlockInput) {
  const status = input.billingStatus ?? input.subscription?.status
  if (status === "active") return true
  return Boolean(input.subscription?.stripeReady && status !== "past_due" && status !== "cancelled")
}

export function resolveConstructionAccessLevel(input: ConstructionUnlockInput): ConstructionAccessLevel {
  if (input.forcedAccessLevel) return input.forcedAccessLevel
  if (hasActiveConstructionPlan(input)) return "full_unlocked"
  if ((input.subscription?.remainingThisMonth ?? 0) > 0 && input.subscription?.status === "trial") return "partial_unlocked"
  return "free_preview"
}

export function resolveUnlockedPercentage(accessLevel: ConstructionAccessLevel, itemCount: number) {
  if (accessLevel === "full_unlocked") return 100
  if (accessLevel === "partial_unlocked") return 30
  if (itemCount <= 2) return 30
  return 25
}

export function resolveVisibleSpecialtyCount(accessLevel: ConstructionAccessLevel, itemCount: number) {
  if (accessLevel === "full_unlocked") return itemCount
  if (accessLevel === "partial_unlocked") return Math.max(1, Math.min(2, itemCount))
  return Math.max(1, Math.min(2, Math.ceil(itemCount * 0.25)))
}

export function canViewPremiumConstructionFeature(accessLevel: ConstructionAccessLevel) {
  return accessLevel === "full_unlocked"
}
