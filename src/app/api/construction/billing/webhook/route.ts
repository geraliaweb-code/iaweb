import { NextResponse } from "next/server"
import type Stripe from "stripe"
import { getConstructionStripe, retrieveStripeSubscription, upsertConstructionSubscriptionFromStripe } from "@/lib/construction/billing/stripe"

export const runtime = "nodejs"

async function syncSubscription(subscription: Stripe.Subscription) {
  const { error } = await upsertConstructionSubscriptionFromStripe(subscription)

  if (error) {
    throw new Error(error.message)
  }
}

async function syncSubscriptionById(subscriptionId: string) {
  const { data, error } = await retrieveStripeSubscription(subscriptionId)

  if (error || !data) {
    throw new Error(error ?? "Nao foi possivel obter subscription Stripe.")
  }

  await syncSubscription(data)
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature")
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  const { stripe, error } = getConstructionStripe()

  if (!stripe) {
    return NextResponse.json({ error }, { status: 500 })
  }

  if (!webhookSecret) {
    return NextResponse.json({ error: "STRIPE_WEBHOOK_SECRET nao configurado." }, { status: 500 })
  }

  if (!signature) {
    return NextResponse.json({ error: "Assinatura Stripe em falta." }, { status: 400 })
  }

  const rawBody = await request.text()
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (constructError) {
    const message = constructError instanceof Error ? constructError.message : "Assinatura Stripe invalida."
    return NextResponse.json({ error: message }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id

        if (subscriptionId) {
          await syncSubscriptionById(subscriptionId)
        }
        break
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        await syncSubscription(event.data.object as Stripe.Subscription)
        break
      }
      case "invoice.payment_succeeded":
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        const invoiceWithSubscription = invoice as Stripe.Invoice & {
          subscription?: string | { id: string }
          parent?: { subscription_details?: { subscription?: string } }
        }
        const subscriptionId =
          typeof invoiceWithSubscription.subscription === "string"
            ? invoiceWithSubscription.subscription
            : invoiceWithSubscription.subscription?.id ?? invoiceWithSubscription.parent?.subscription_details?.subscription

        if (subscriptionId) {
          await syncSubscriptionById(subscriptionId)
        }
        break
      }
      default:
        break
    }
  } catch (syncError) {
    const message = syncError instanceof Error ? syncError.message : "Falha ao sincronizar Stripe."
    return NextResponse.json({ error: message }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
