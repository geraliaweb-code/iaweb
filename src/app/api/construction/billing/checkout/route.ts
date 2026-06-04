import { NextResponse } from "next/server"
import type { ConstructionBillingPlanId } from "@/lib/construction/billing/plans"
import { constructionBillingPlans } from "@/lib/construction/billing/plans"
import { createConstructionCheckoutSession } from "@/lib/construction/billing/stripe"

export const runtime = "nodejs"

function isPlanId(value: string): value is ConstructionBillingPlanId {
  return constructionBillingPlans.some((plan) => plan.id === value)
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    planId?: string
    customerEmail?: string
    organizationId?: string
  }

  if (!body.planId || !isPlanId(body.planId)) {
    return NextResponse.json({ error: "Plano invalido." }, { status: 400 })
  }

  const { data, error } = await createConstructionCheckoutSession({
    planId: body.planId,
    requestUrl: request.url,
    customerEmail: body.customerEmail,
    organizationId: body.organizationId,
  })

  if (error || !data?.url) {
    return NextResponse.json({ error: error ?? "Nao foi possivel criar Checkout Stripe." }, { status: 500 })
  }

  return NextResponse.json({ url: data.url })
}
