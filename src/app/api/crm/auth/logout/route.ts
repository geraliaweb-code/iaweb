import { NextResponse } from "next/server"
import { clearCrmSessionCookie } from "@/lib/crm-auth"

export async function POST() {
  await clearCrmSessionCookie()

  return NextResponse.json({ ok: true })
}
