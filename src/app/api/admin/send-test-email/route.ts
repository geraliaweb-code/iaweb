import { NextResponse } from "next/server"
import { assertCrmAccess } from "@/lib/crm-auth"
import { logEmailEvent, sendProductionTestEmail } from "@/lib/admin-email"

export const dynamic = "force-dynamic"

export async function POST() {
  const access = await assertCrmAccess()

  if (!access.ok) {
    return NextResponse.json({ error: "Autenticacao do CRM obrigatoria." }, { status: 401 })
  }

  try {
    const result = await sendProductionTestEmail()

    await logEmailEvent({
      provider: "resend",
      resend_email_id: result.resendEmailId,
      recipient_email: result.recipient,
      subject: result.subject,
      status: "enviado",
      payload: {
        source: "admin-test",
      },
    })

    return NextResponse.json({ ok: true, resendEmailId: result.resendEmailId })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido."

    await logEmailEvent({
      provider: "resend",
      recipient_email: process.env.DIAGNOSTICO_EMAIL_REPLY_TO || "",
      subject: "Teste IAWEB - Resend Producao",
      status: "erro",
      error_message: message,
      payload: {
        source: "admin-test",
      },
    })

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
