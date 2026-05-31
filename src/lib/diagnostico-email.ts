import type { DiagnosticoFormData, DiagnosticoResult } from "@/lib/diagnostico"

type SendDiagnosticoEmailParams = {
  lead: DiagnosticoFormData
  result: DiagnosticoResult
}

const RESEND_API_URL = "https://api.resend.com/emails"

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

function getResumo(result: DiagnosticoResult) {
  return `${result.classificacao.message} Potencial estimado: ${result.potencialEstimado}.`
}

function getTopOportunidades(result: DiagnosticoResult) {
  return result.recomendacoes.slice(0, 3)
}

function buildPlainTextEmail(lead: DiagnosticoFormData, result: DiagnosticoResult, bookingUrl?: string) {
  const oportunidades = getTopOportunidades(result)
    .map((oportunidade, index) => `${index + 1}. ${oportunidade}`)
    .join("\n")
  const cta = bookingUrl
    ? `Pode responder diretamente a este email ou agendar uma conversa aqui: ${bookingUrl}`
    : "Pode responder diretamente a este email para agendarmos uma conversa."

  return [
    `Ola ${lead.nome},`,
    "",
    `Obrigado por preencher o Diagnostico Digital da ${lead.empresa}.`,
    "",
    `Score geral: ${result.scoreFinal}/100`,
    "",
    "Resumo curto do diagnostico:",
    getResumo(result),
    "",
    "3 principais oportunidades identificadas:",
    oportunidades || "Vamos rever o diagnostico consigo para identificar as melhores prioridades.",
    "",
    cta,
    "",
    "Cumprimentos,",
    "Equipa IAWEB",
  ].join("\n")
}

function buildHtmlEmail(lead: DiagnosticoFormData, result: DiagnosticoResult, bookingUrl?: string) {
  const oportunidades = getTopOportunidades(result)
  const safeName = escapeHtml(lead.nome)
  const safeCompany = escapeHtml(lead.empresa)
  const safeResumo = escapeHtml(getResumo(result))
  const safeBookingUrl = bookingUrl ? escapeHtml(bookingUrl) : null

  return `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6; max-width: 640px;">
      <p>Ola ${safeName},</p>
      <p>Obrigado por preencher o Diagnostico Digital da <strong>${safeCompany}</strong>.</p>

      <div style="background: #f3f4f6; border-radius: 12px; padding: 18px 20px; margin: 24px 0;">
        <p style="margin: 0; color: #4b5563; font-size: 14px;">Score geral</p>
        <p style="margin: 4px 0 0; font-size: 32px; font-weight: 700;">${result.scoreFinal}/100</p>
      </div>

      <p><strong>Resumo curto do diagnostico</strong><br />${safeResumo}</p>

      <p><strong>3 principais oportunidades identificadas</strong></p>
      <ol>
        ${
          oportunidades.length > 0
            ? oportunidades.map((oportunidade) => `<li>${escapeHtml(oportunidade)}</li>`).join("")
            : "<li>Vamos rever o diagnostico consigo para identificar as melhores prioridades.</li>"
        }
      </ol>

      <p>
        ${
          safeBookingUrl
            ? `Pode responder diretamente a este email ou <a href="${safeBookingUrl}" style="color: #2563eb;">agendar uma conversa aqui</a>.`
            : "Pode responder diretamente a este email para agendarmos uma conversa."
        }
      </p>

      <p>Cumprimentos,<br /><strong>Equipa IAWEB</strong></p>
    </div>
  `
}

export async function sendDiagnosticoLeadEmail({ lead, result }: SendDiagnosticoEmailParams) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.DIAGNOSTICO_EMAIL_FROM
  const replyTo = process.env.DIAGNOSTICO_EMAIL_REPLY_TO
  const bookingUrl = process.env.DIAGNOSTICO_BOOKING_URL

  if (!apiKey || !from) {
    throw new Error("Resend email is not configured.")
  }

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [lead.email],
      reply_to: replyTo,
      subject: `Diagnostico Digital da ${lead.empresa}`,
      text: buildPlainTextEmail(lead, result, bookingUrl),
      html: buildHtmlEmail(lead, result, bookingUrl),
    }),
  })

  if (!response.ok) {
    const details = await response.text()
    throw new Error(`Resend email failed: ${response.status} ${details}`)
  }
}
