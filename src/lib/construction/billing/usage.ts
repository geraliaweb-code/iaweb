import { getConstructionProject, getConstructionSupabaseClient } from "../db"
import { getConstructionBillingScope, evaluateConstructionUsageLimit, type ConstructionBillableAction } from "./limits"
import { getConstructionBillingPlan, type ConstructionBillingStatus } from "./plans"

type ConstructionBillingError = {
  code: string
  message: string
}

export type ConstructionBillingUsage = {
  planId: string
  planName: string
  status: ConstructionBillingStatus
  monthlyLimit: number
  usedThisMonth: number
  remainingThisMonth: number
  trialEndsAt: string | null
  currentPeriodStart: string
  currentPeriodEnd: string
  stripeReady: boolean
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  stripePriceId: string | null
}

function getCurrentMonthWindow(now = new Date()) {
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0))
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0))
  return { start: start.toISOString(), end: end.toISOString() }
}

type SubscriptionRow = {
  plan: string
  status: ConstructionBillingStatus
  trial_ends_at: string | null
  current_period_start: string | null
  current_period_end: string | null
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  stripe_price_id: string | null
}

async function getSubscriptionForScope(organizationId: string | null) {
  const client = getConstructionSupabaseClient()

  if (!client.ok) {
    return { data: null, error: client.error }
  }

  if (!organizationId) {
    return { data: null, error: null }
  }

  const { data, error } = await client.supabase
    .from("construction_subscriptions")
    .select("plan,status,trial_ends_at,current_period_start,current_period_end,stripe_customer_id,stripe_subscription_id,stripe_price_id")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    return { data: null, error: { code: "SUPABASE_QUERY_FAILED" as const, message: error.message } }
  }

  return { data: data as SubscriptionRow | null, error: null }
}

async function countUsage(input: { organizationId: string | null; projectId?: string | null; periodStart: string; periodEnd: string }) {
  const client = getConstructionSupabaseClient()

  if (!client.ok) {
    return { data: 0, error: client.error }
  }

  let query = client.supabase
    .from("construction_usage_events")
    .select("id", { count: "exact", head: true })
    .gte("created_at", input.periodStart)
    .lt("created_at", input.periodEnd)

  if (input.organizationId) {
    query = query.eq("organization_id", input.organizationId)
  } else if (input.projectId) {
    query = query.eq("project_id", input.projectId)
  }

  const { count, error } = await query

  if (error) {
    return { data: 0, error: { code: "SUPABASE_QUERY_FAILED" as const, message: error.message } }
  }

  return { data: count ?? 0, error: null }
}

export async function getConstructionBillingUsage(projectId?: string | null): Promise<{ data: ConstructionBillingUsage | null; error: ConstructionBillingError | null }> {
  const month = getCurrentMonthWindow()
  let organizationId: string | null = null

  if (projectId) {
    const projectResult = await getConstructionProject(projectId)

    if (projectResult.error) {
      return { data: null, error: projectResult.error }
    }

    organizationId = projectResult.data?.organization_id ?? null
  }

  const subscriptionResult = await getSubscriptionForScope(organizationId)

  if (subscriptionResult.error) {
    return { data: null, error: subscriptionResult.error }
  }

  const subscription = subscriptionResult.data
  const plan = getConstructionBillingPlan(subscription?.plan)
  const usageResult = await countUsage({ organizationId, projectId, periodStart: month.start, periodEnd: month.end })

  if (usageResult.error) {
    return { data: null, error: usageResult.error }
  }

  const status = subscription?.status ?? "trial"
  const trialEndsAt = subscription?.trial_ends_at ?? null
  const decision = evaluateConstructionUsageLimit({
    plan,
    status,
    usedThisMonth: usageResult.data,
    trialEndsAt,
  })

  return {
    data: {
      planId: plan.id,
      planName: plan.name,
      status,
      monthlyLimit: plan.monthlyAnalysisLimit,
      usedThisMonth: usageResult.data,
      remainingThisMonth: decision.remainingThisMonth,
      trialEndsAt,
      currentPeriodStart: subscription?.current_period_start ?? month.start,
      currentPeriodEnd: subscription?.current_period_end ?? month.end,
      stripeReady: Boolean(subscription?.stripe_customer_id && subscription?.stripe_subscription_id),
      stripeCustomerId: subscription?.stripe_customer_id ?? null,
      stripeSubscriptionId: subscription?.stripe_subscription_id ?? null,
      stripePriceId: subscription?.stripe_price_id ?? null,
    },
    error: null,
  }
}

export async function canRunAnalysis(projectId: string) {
  const projectResult = await getConstructionProject(projectId)

  if (projectResult.error || !projectResult.data) {
    return { allowed: false, error: projectResult.error, decision: null }
  }

  const scope = getConstructionBillingScope(projectResult.data)
  const subscriptionResult = await getSubscriptionForScope(scope.organizationId)

  if (subscriptionResult.error) {
    return { allowed: false, error: subscriptionResult.error, decision: null }
  }

  const month = getCurrentMonthWindow()
  const usageResult = await countUsage({
    organizationId: scope.organizationId,
    projectId: scope.organizationId ? null : scope.projectId,
    periodStart: month.start,
    periodEnd: month.end,
  })

  if (usageResult.error) {
    return { allowed: false, error: usageResult.error, decision: null }
  }

  const subscription = subscriptionResult.data
  const plan = getConstructionBillingPlan(subscription?.plan)
  const decision = evaluateConstructionUsageLimit({
    plan,
    status: subscription?.status ?? "trial",
    usedThisMonth: usageResult.data,
    trialEndsAt: subscription?.trial_ends_at ?? null,
  })

  return { allowed: decision.allowed, error: null, decision, project: projectResult.data }
}

export async function recordConstructionUsageEvent(projectId: string, action: ConstructionBillableAction) {
  const projectResult = await getConstructionProject(projectId)

  if (projectResult.error || !projectResult.data) {
    return { error: projectResult.error }
  }

  const client = getConstructionSupabaseClient()

  if (!client.ok) {
    return { error: client.error }
  }

  const { error } = await client.supabase.from("construction_usage_events").insert({
    project_id: projectId,
    organization_id: projectResult.data.organization_id,
    action,
    metadata: {
      source: "construction-billing-v1",
    },
  })

  return { error: error ? { code: "SUPABASE_INSERT_FAILED" as const, message: error.message } : null }
}
