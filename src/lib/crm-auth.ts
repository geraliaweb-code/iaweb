import { createHmac, timingSafeEqual } from "node:crypto"
import { cookies } from "next/headers"

export const crmAuthCookieName = "iaweb_crm_session"
const sessionPayload = "iaweb-crm-session:v1"
const sessionMaxAgeSeconds = 60 * 60 * 8

export type CrmAccessContext = {
  enabled: boolean
  configured: boolean
}

function getCrmCredential() {
  return process.env.CRM_AUTH_TOKEN || process.env.CRM_AUTH_PASSWORD || ""
}

function getCrmSessionSecret() {
  return process.env.CRM_AUTH_COOKIE_SECRET || getCrmCredential()
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)

  if (leftBuffer.length !== rightBuffer.length) {
    return false
  }

  return timingSafeEqual(leftBuffer, rightBuffer)
}

export function createCrmSessionToken() {
  const secret = getCrmSessionSecret()

  if (!secret) {
    return ""
  }

  return createHmac("sha256", secret).update(sessionPayload).digest("hex")
}

export function validateCrmCredential(value: string) {
  const credential = getCrmCredential()

  if (!credential || !value) {
    return false
  }

  return safeEqual(value, credential)
}

export async function getCrmAccessContext(): Promise<CrmAccessContext> {
  const enabled = process.env.CRM_AUTH_ENABLED === "true"

  return {
    enabled,
    configured: Boolean(getCrmCredential()),
  }
}

export async function hasValidCrmSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get(crmAuthCookieName)?.value
  const expected = createCrmSessionToken()

  if (!session || !expected) {
    return false
  }

  return safeEqual(session, expected)
}

export async function setCrmSessionCookie() {
  const cookieStore = await cookies()
  const token = createCrmSessionToken()

  cookieStore.set(crmAuthCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionMaxAgeSeconds,
  })
}

export async function clearCrmSessionCookie() {
  const cookieStore = await cookies()

  cookieStore.delete(crmAuthCookieName)
}

export async function assertCrmAccess() {
  const context = await getCrmAccessContext()

  if (!context.enabled) {
    return { ok: true as const, mode: "open" as const }
  }

  if (!context.configured) {
    return { ok: false as const, mode: "not-configured" as const }
  }

  if (await hasValidCrmSession()) {
    return { ok: true as const, mode: "authenticated" as const }
  }

  return { ok: false as const, mode: "auth-required" as const }
}
