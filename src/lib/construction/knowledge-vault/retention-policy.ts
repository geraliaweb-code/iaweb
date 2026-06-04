import type { ConstructionRetentionPolicy } from "./vault-types"

export const constructionRetentionPolicies: Record<ConstructionRetentionPolicy, { label: string; days: number | null }> = {
  "30_days": { label: "30 dias", days: 30 },
  "90_days": { label: "90 dias", days: 90 },
  "180_days": { label: "180 dias", days: 180 },
  manual_review: { label: "Revisao manual", days: null },
}

export function getRetentionDeleteDate(policy: ConstructionRetentionPolicy, from = new Date()) {
  const days = constructionRetentionPolicies[policy]?.days
  if (!days) return null
  const date = new Date(from)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString()
}
