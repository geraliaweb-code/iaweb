import { NextResponse } from "next/server"
import { createConstructionCustomerPortalSession } from "@/lib/construction/billing/stripe"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { customerId?: string }

  if (!body.customerId) {
    return NextResponse.json({ error: "Cliente Stripe em falta." }, { status: 400 })
  }

  const { data, error } = await createConstructionCustomerPortalSession({
    requestUrl: request.url,
    customerId: body.customerId,
  })

  if (error || !data?.url) {
    return NextResponse.json({ error: error ?? "Nao foi possivel abrir Customer Portal." }, { status: 500 })
  }

  return NextResponse.json({ url: data.url })
}
