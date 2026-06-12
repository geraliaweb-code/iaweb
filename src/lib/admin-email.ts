import { getSupabaseServerClient } from "@/lib/supabase-server"

const RESEND_API_URL = "https://api.resend.com/emails"

export type EmailHealth = {
  resendConfigured: boolean
  fromConfigured: boolean
  replyToConfigured: boolean
  bookingUrlConfigured: boolean
  totalSent: number
  totalErrors: number
  lastSentAt: string | null
  lastError: string | null
  supabaseConfigured: boolean
  supabaseError: string | null
}

type EmailEventInsert = {
  provider?: string
  resend_email_id?: string | null
  recipient_email: string
  subject: string
  status: "pendente" | "a_enviar" | "enviado" | "erro"
  error_message?: string | null
  pdf_filename?: string | null
  payload?: Record<string, unknown>
}

function getSupabaseClient() {
  const client = getSupabaseServerClient()

  if (!client.ok) {
    return { supabase: null, error: client.error.message }
  }

  return {
    supabase: client.supabase,
    error: null,
  }
}

export function getEmailConfigStatus() {
  return {
    resendConfigured: Boolean(process.env.RESEND_API_KEY),
    fromConfigured: Boolean(process.env.DIAGNOSTICO_EMAIL_FROM),
    replyToConfigured: Boolean(process.env.DIAGNOSTICO_EMAIL_REPLY_TO),
    bookingUrlConfigured: Boolean(process.env.DIAGNOSTICO_BOOKING_URL || process.env.NEXT_PUBLIC_DIAGNOSTICO_BOOKING_URL),
  }
}

export async function getEmailHealth(): Promise<EmailHealth> {
  const config = getEmailConfigStatus()
  const client = getSupabaseClient()

  if (!client.supabase) {
    return {
      ...config,
      totalSent: 0,
      totalErrors: 0,
      lastSentAt: null,
      lastError: null,
      supabaseConfigured: false,
      supabaseError: client.error,
    }
  }

  const [sent, errors, lastSent, lastError] = await Promise.all([
    client.supabase.from("diagnostico_email_events").select("id", { count: "exact", head: true }).eq("status", "enviado"),
    client.supabase.from("diagnostico_email_events").select("id", { count: "exact", head: true }).eq("status", "erro"),
    client.supabase.from("diagnostico_email_events").select("created_at").eq("status", "enviado").order("created_at", { ascending: false }).limit(1).maybeSingle(),
    client.supabase
      .from("diagnostico_email_events")
      .select("created_at,error_message")
      .eq("status", "erro")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  const supabaseError = sent.error?.message || errors.error?.message || lastSent.error?.message || lastError.error?.message || null

  return {
    ...config,
    totalSent: sent.count ?? 0,
    totalErrors: errors.count ?? 0,
    lastSentAt: (lastSent.data as { created_at?: string } | null)?.created_at ?? null,
    lastError: (lastError.data as { error_message?: string } | null)?.error_message ?? null,
    supabaseConfigured: true,
    supabaseError,
  }
}

export async function logEmailEvent(event: EmailEventInsert) {
  const client = getSupabaseClient()

  if (!client.supabase) return

  await client.supabase.from("diagnostico_email_events").insert({
    provider: event.provider ?? "resend",
    resend_email_id: event.resend_email_id ?? null,
    recipient_email: event.recipient_email,
    subject: event.subject,
    status: event.status,
    error_message: event.error_message ?? null,
    pdf_filename: event.pdf_filename ?? null,
    payload: event.payload ?? {},
  })
}

export async function sendProductionTestEmail() {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.DIAGNOSTICO_EMAIL_FROM
  const replyTo = process.env.DIAGNOSTICO_EMAIL_REPLY_TO
  const subject = "Teste IAWEB - Resend Producao"

  if (!apiKey || !from || !replyTo) {
    throw new Error("Resend, remetente ou email de destino nao configurado.")
  }

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [replyTo],
      reply_to: replyTo,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 620px; background: #050816; color: #f8fafc; padding: 28px; border-radius: 18px;">
          <p style="margin: 0 0 8px; color: #3AB8FF; font-size: 12px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase;">IAWEB Resend Health</p>
          <h1 style="margin: 0 0 14px; font-size: 28px;">Teste de email em producao</h1>
          <p style="line-height: 1.7; color: #cbd5e1;">Este email confirma que o Resend esta configurado para enviar comunicacoes transacionais da IAWEB.</p>
          <div style="height: 2px; margin: 24px 0; background: linear-gradient(90deg,#00A3FF,#FFB800);"></div>
          <p style="font-size: 13px; color: #94a3b8;">Nenhuma chave ou segredo foi exposto neste teste.</p>
        </div>
      `,
      text: "Teste IAWEB - Resend Producao. Este email confirma que o Resend esta configurado.",
    }),
  })

  const responseText = await response.text()

  if (!response.ok) {
    throw new Error(`Resend test failed: ${response.status} ${responseText}`)
  }

  const data = responseText ? (JSON.parse(responseText) as { id?: string }) : {}

  return {
    resendEmailId: data.id ?? null,
    recipient: replyTo,
    subject,
  }
}
