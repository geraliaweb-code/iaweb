export type FinanceImpactInput = {
  niche: string
  packageName: string
  score?: number
}

export type FinanceImpact = {
  nicheId: string
  lostLeadsMonthly: {
    min: number
    max: number
  }
  averageTicket: {
    min: number
    max: number
  }
  lostRevenueMonthly: {
    min: number
    max: number
  }
  lostRevenueAnnual: {
    min: number
    max: number
  }
  recommendedInvestment: {
    min: number
    max: number
  }
  potentialRoi: {
    min: number
    max: number
  }
  estimatedPayback: string
  impactPhrase: string
  opportunityLabel: string
}

type FinanceRange = {
  lostLeadsMonthly: {
    min: number
    max: number
  }
  averageTicket: {
    min: number
    max: number
  }
  opportunityLabel: string
}

const financeRanges: Record<string, FinanceRange> = {
  construction: {
    lostLeadsMonthly: { min: 3, max: 12 },
    averageTicket: { min: 4000, max: 12000 },
    opportunityLabel: "pedidos de orcamento",
  },
  dentist: {
    lostLeadsMonthly: { min: 10, max: 40 },
    averageTicket: { min: 150, max: 1500 },
    opportunityLabel: "marcacoes",
  },
  real_estate: {
    lostLeadsMonthly: { min: 2, max: 8 },
    averageTicket: { min: 3000, max: 8000 },
    opportunityLabel: "contratos",
  },
  restaurant: {
    lostLeadsMonthly: { min: 80, max: 400 },
    averageTicket: { min: 18, max: 45 },
    opportunityLabel: "reservas e pedidos",
  },
  lawyer: {
    lostLeadsMonthly: { min: 4, max: 20 },
    averageTicket: { min: 250, max: 2500 },
    opportunityLabel: "consultas e processos",
  },
  accounting: {
    lostLeadsMonthly: { min: 3, max: 15 },
    averageTicket: { min: 150, max: 800 },
    opportunityLabel: "clientes recorrentes",
  },
  outro: {
    lostLeadsMonthly: { min: 5, max: 25 },
    averageTicket: { min: 100, max: 1000 },
    opportunityLabel: "oportunidades comerciais",
  },
}

const nicheAliases: Record<string, string> = {
  construcao: "construction",
  construction: "construction",
  clinicas: "dentist",
  dentist: "dentist",
  dentista: "dentist",
  imobiliario: "real_estate",
  real_estate: "real_estate",
  restaurantes: "restaurant",
  restaurant: "restaurant",
  advocacia: "lawyer",
  lawyer: "lawyer",
  contabilidade: "accounting",
  accounting: "accounting",
}

function normalizeNiche(niche: string) {
  return nicheAliases[niche.trim().toLowerCase()] ?? "outro"
}

function getInvestmentRange(packageName: string) {
  const normalized = packageName.toLowerCase()

  if (normalized.includes("growth")) return { min: 3000, max: 7500 }
  if (normalized.includes("sistema")) return { min: 1500, max: 2500 }
  if (normalized.includes("homepage")) return { min: 299, max: 799 }

  return { min: 799, max: 1200 }
}

function clampRisk(score?: number) {
  if (typeof score !== "number") return 0.72
  return Math.max(0.45, Math.min(1, (100 - score) / 70))
}

function roundTo(value: number, step: number) {
  return Math.round(value / step) * step
}

function getPayback(monthlyMin: number, investmentMin: number) {
  if (monthlyMin <= 0) return "a validar"

  const months = Math.max(1, Math.ceil(investmentMin / monthlyMin))

  if (months <= 1) return "menos de 1 mes"
  if (months <= 3) return "1 a 3 meses"
  if (months <= 6) return "3 a 6 meses"

  return "6+ meses"
}

export function formatEuro(value: number) {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value)
}

export function calculateFinanceImpact({ niche, packageName, score }: FinanceImpactInput): FinanceImpact {
  const nicheId = normalizeNiche(niche)
  const range = financeRanges[nicheId] ?? financeRanges.outro
  const investment = getInvestmentRange(packageName)
  const riskFactor = clampRisk(score)
  const lostLeadsMonthly = {
    min: Math.max(1, Math.floor(range.lostLeadsMonthly.min * riskFactor)),
    max: Math.max(1, Math.ceil(range.lostLeadsMonthly.max * riskFactor)),
  }
  const lostRevenueMonthly = {
    min: roundTo(lostLeadsMonthly.min * range.averageTicket.min, 100),
    max: roundTo(lostLeadsMonthly.max * range.averageTicket.max, 100),
  }
  const lostRevenueAnnual = {
    min: lostRevenueMonthly.min * 12,
    max: lostRevenueMonthly.max * 12,
  }
  const potentialRoi = {
    min: Math.max(1, Math.round(lostRevenueMonthly.min / investment.max)),
    max: Math.max(1, Math.round(lostRevenueMonthly.max / investment.min)),
  }

  return {
    nicheId,
    lostLeadsMonthly,
    averageTicket: range.averageTicket,
    lostRevenueMonthly,
    lostRevenueAnnual,
    recommendedInvestment: investment,
    potentialRoi,
    estimatedPayback: getPayback(lostRevenueMonthly.min, investment.min),
    impactPhrase: `Com base no cenario analisado, podem existir ${lostLeadsMonthly.min}-${lostLeadsMonthly.max} ${range.opportunityLabel} nao capturadas por mes, representando um potencial estimado de ${formatEuro(lostRevenueMonthly.min)}-${formatEuro(lostRevenueMonthly.max)} mensais.`,
    opportunityLabel: range.opportunityLabel,
  }
}
