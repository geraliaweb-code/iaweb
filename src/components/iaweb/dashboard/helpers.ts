import type { CrmLead } from "@/lib/crm"
import type { DashboardProspect } from "./types"

export function formatEuro(value: number) {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value)
}

export function prospectMonthlyPotential(prospect: DashboardProspect) {
  return prospect.impacto_financeiro?.lostRevenueMonthly?.max ?? 0
}

export function prospectAnnualPotential(prospect: DashboardProspect) {
  return prospect.impacto_financeiro?.lostRevenueAnnual?.max ?? prospectMonthlyPotential(prospect) * 12
}

export function leadPotential(lead: CrmLead) {
  if (lead.perda_mensal_estimada > 0) return lead.perda_mensal_estimada
  const impact = lead.impacto_financeiro as { lostRevenueMonthly?: { max?: number } } | null
  return impact?.lostRevenueMonthly?.max ?? 0
}

export function countBy<T extends string>(items: T[]) {
  return items.reduce<Record<string, number>>((acc, item) => {
    acc[item] = (acc[item] ?? 0) + 1
    return acc
  }, {})
}

export function daysSince(value?: string) {
  if (!value) return 0
  const timestamp = new Date(value).getTime()
  if (!Number.isFinite(timestamp)) return 0
  return Math.floor((Date.now() - timestamp) / 86400000)
}
