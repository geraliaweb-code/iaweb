import Stripe from "stripe"
import { getConstructionSupabaseClient } from "../db"
import { getConstructionLanguage } from "../i18n"
import { getConstructionBillingPlan, type ConstructionBillingPlanId, type ConstructionBillingStatus } from "./plans"

export const stripeApiVersion = "2026-05-27.dahlia"

export function getConstructionStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY

  if (!secretKey) {
    return { stripe: null, error: "STRIPE_SECRET_KEY nao configurada." }
  }

  return {
    stripe: new Stripe(secretKey, { apiVersion: stripeApiVersion }),
    error: null,
  }
}

export function getConstructionStripePriceId(planId: ConstructionBillingPlanId) {
  const plan = getConstructionBillingPlan(planId)
  const envName = plan.stripePriceIdEnv
  const priceId = envName ? process.env[envName] : undefined

  return { plan, priceId, envName }
}

export function getConstructionStripeBaseUrl(requestUrl?: string) {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
  }

  if (requestUrl) {
    const url = new URL(requestUrl)
    return `${url.protocol}//${url.host}`
  }

  return "http://localhost:3000"
}

function mapStripeStatus(status: Stripe.Subscription.Status): ConstructionBillingStatus {
  if (status === "active") return "active"
  if (status === "trialing") return "trial"
  if (status === "past_due" || status === "unpaid" || status === "incomplete" || status === "incomplete_expired") return "past_due"
  return "cancelled"
}

function getPlanIdFromPrice(priceId: string | null | undefined): ConstructionBillingPlanId {
  const match = (["home", "builder", "architect", "engineering", "enterprise"] as ConstructionBillingPlanId[]).find((planId) => {
    const { priceId: configuredPriceId } = getConstructionStripePriceId(planId)
    return configuredPriceId && configuredPriceId === priceId
  })

  return match ?? "home"
}

function unixToIso(value: number | null | undefined) {
  return value ? new Date(value * 1000).toISOString() : null
}

export async function upsertConstructionSubscriptionFromStripe(subscription: Stripe.Subscription) {
  const client = getConstructionSupabaseClient()

  if (!client.ok) {
    return { error: client.error }
  }

  const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id
  const item = subscription.items.data[0]
  const priceId = item?.price.id ?? null
  const planId = getPlanIdFromPrice(priceId)
  const organizationId = typeof subscription.metadata?.organization_id === "string" && subscription.metadata.organization_id
    ? subscription.metadata.organization_id
    : null

  const payload = {
    organization_id: organizationId,
    plan: planId,
    status: mapStripeStatus(subscription.status),
    seats: getConstructionBillingPlan(planId).usersIncluded,
    trial_starts_at: unixToIso(subscription.trial_start),
    trial_ends_at: unixToIso(subscription.trial_end),
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription.id,
    stripe_price_id: priceId,
    current_period_start: unixToIso(item?.current_period_start),
    current_period_end: unixToIso(item?.current_period_end),
    metadata: {
      stripe_status: subscription.status,
      cancel_at_period_end: subscription.cancel_at_period_end,
    },
    updated_at: new Date().toISOString(),
  }

  const { error } = await client.supabase
    .from("construction_subscriptions")
    .upsert(payload, { onConflict: "stripe_subscription_id" })

  return { error: error ? { code: "SUPABASE_INSERT_FAILED" as const, message: error.message } : null }
}

export async function createConstructionCheckoutSession(input: {
  planId: ConstructionBillingPlanId
  requestUrl: string
  customerEmail?: string | null
  organizationId?: string | null
  language?: string | null
}) {
  const { stripe, error } = getConstructionStripe()

  if (!stripe) {
    return { data: null, error }
  }

  const { plan, priceId, envName } = getConstructionStripePriceId(input.planId)

  if (!priceId) {
    return { data: null, error: `${envName ?? "Stripe price id"} nao configurado.` }
  }

  const baseUrl = getConstructionStripeBaseUrl(input.requestUrl)
  const language = getConstructionLanguage(input.language)
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    locale: language,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}/construction/billing?stripe=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/construction/billing?stripe=cancelled`,
    customer_email: input.customerEmail ?? undefined,
    subscription_data: {
      metadata: {
        plan_id: plan.id,
        organization_id: input.organizationId ?? "",
        module: "construction",
      },
    },
    metadata: {
      plan_id: plan.id,
      organization_id: input.organizationId ?? "",
      module: "construction",
    },
  })

  return { data: session, error: null }
}

export async function createConstructionCustomerPortalSession(input: { requestUrl: string; customerId: string }) {
  const { stripe, error } = getConstructionStripe()

  if (!stripe) {
    return { data: null, error }
  }

  const baseUrl = getConstructionStripeBaseUrl(input.requestUrl)
  const session = await stripe.billingPortal.sessions.create({
    customer: input.customerId,
    return_url: `${baseUrl}/construction/billing`,
  })

  return { data: session, error: null }
}

export async function retrieveStripeSubscription(subscriptionId: string) {
  const { stripe, error } = getConstructionStripe()

  if (!stripe) {
    return { data: null, error }
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  return { data: subscription, error: null }
}
