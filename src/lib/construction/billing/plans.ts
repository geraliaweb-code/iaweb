export type ConstructionBillingPlanId = "home" | "builder" | "architect" | "engineering" | "enterprise"

export type ConstructionBillingStatus = "trial" | "active" | "past_due" | "cancelled"

export type ConstructionBillingPlan = {
  id: ConstructionBillingPlanId
  name: string
  monthlyPriceEur: number
  monthlyAnalysisLimit: number
  usersIncluded: number
  features: string[]
  stripePriceIdEnv?: string
}

export const constructionBillingPlans: ConstructionBillingPlan[] = [
  {
    id: "home",
    name: "Home",
    monthlyPriceEur: 49.9,
    monthlyAnalysisLimit: 3,
    usersIncluded: 1,
    features: ["3 analises por mes", "Health Check", "PDF executivo"],
    stripePriceIdEnv: "STRIPE_HOME_PRICE_ID",
  },
  {
    id: "builder",
    name: "Builder",
    monthlyPriceEur: 149,
    monthlyAnalysisLimit: 10,
    usersIncluded: 1,
    features: ["10 analises por mes", "Benchmark V1", "PDF executivo"],
    stripePriceIdEnv: "STRIPE_BUILDER_PRICE_ID",
  },
  {
    id: "architect",
    name: "Architect",
    monthlyPriceEur: 299,
    monthlyAnalysisLimit: 20,
    usersIncluded: 2,
    features: ["20 analises por mes", "Knowledge Graph V1", "Relatorios executivos"],
    stripePriceIdEnv: "STRIPE_ARCHITECT_PRICE_ID",
  },
  {
    id: "engineering",
    name: "Engineering",
    monthlyPriceEur: 399,
    monthlyAnalysisLimit: 40,
    usersIncluded: 3,
    features: ["40 analises por mes", "Motores tecnicos", "Uso profissional recorrente"],
    stripePriceIdEnv: "STRIPE_ENGINEERING_PRICE_ID",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthlyPriceEur: 599,
    monthlyAnalysisLimit: 100,
    usersIncluded: 5,
    features: ["100 analises por mes", "5 utilizadores", "API preparada", "White Label preparado"],
    stripePriceIdEnv: "STRIPE_ENTERPRISE_PRICE_ID",
  },
]

export const constructionTrialDays = 7

export function getConstructionBillingPlan(planId: string | null | undefined) {
  return constructionBillingPlans.find((plan) => plan.id === planId) ?? constructionBillingPlans[0]
}

export function formatConstructionPlanPrice(value: number) {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: value % 1 ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(value)
}
