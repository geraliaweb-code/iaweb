import { NextResponse } from "next/server"
import type { DiagnosticoFormData, DiagnosticoResult } from "@/lib/diagnostico"
import { sendDiagnosticoLeadEmail } from "@/lib/diagnostico-email"
import { generateDiagnosticoWhatsAppMessage } from "@/lib/diagnostico-whatsapp"
import { generateSalesAgentMessages } from "@/lib/sales-agent"
import { getSupabaseServerClient } from "@/lib/supabase-server"

type LeadPayload = {
  formData?: Partial<DiagnosticoFormData>
  result?: Partial<DiagnosticoResult> & Partial<CommercialCrmFields>
}

type CommercialCrmFields = {
  crmScore?: number
  crm?: {
    origem?: string
    proximaAcao?: string
    notas?: string
    perdaMensalEstimada?: number
    impactoFinanceiro?: Record<string, unknown>
    planoRecomendado?: string
    homepageGerada?: Record<string, unknown>
    scoreProjetado?: number
    melhoriaPrevista?: number
    templateUtilizado?: string
  }
}

const scoreFields = ["website", "google", "conversao", "automacao"] as const

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Erro desconhecido."
}

function buildEmailIdempotencyKey(formData: DiagnosticoFormData, result: DiagnosticoResult) {
  const source = result.id ?? `${formData.email}-${result.createdAt ?? result.scoreFinal}`

  return `diagnostico-${source}`
}

function isValidScore(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100
}

function validatePayload(payload: LeadPayload) {
  const formData = payload.formData
  const result = payload.result

  if (!formData || !result) {
    return "Payload invalido."
  }

  const requiredFormFields: Array<keyof DiagnosticoFormData> = [
    "nome",
    "empresa",
    "email",
    "whatsapp",
    "website",
    "setor",
    "objetivo",
  ]

  const missing = requiredFormFields.filter((field) => !formData[field]?.trim())

  if (missing.length > 0) {
    return `Campos obrigatorios em falta: ${missing.join(", ")}.`
  }

  if (!formData.email?.includes("@")) {
    return "Email invalido."
  }

  if (!isValidScore(result.scoreFinal)) {
    return "Score geral invalido."
  }

  for (const field of scoreFields) {
    if (!isValidScore(result.categorias?.[field])) {
      return `Score ${field} invalido.`
    }
  }

  if (!result.classificacao?.label || !result.potencialEstimado || !Array.isArray(result.recomendacoes)) {
    return "Resultado do diagnostico invalido."
  }

  return null
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as LeadPayload
    const validationError = validatePayload(payload)

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 })
    }

    const formData = payload.formData as DiagnosticoFormData
    const result = payload.result as DiagnosticoResult & CommercialCrmFields
    const client = getSupabaseServerClient()

    if (!client.ok) {
      return NextResponse.json({ error: client.error.message }, { status: 500 })
    }

    const supabase = client.supabase

    let whatsappMessage: string | null = null
    let whatsappStatus = "pendente"
    const salesAgentMessages = generateSalesAgentMessages({
      company: formData.empresa,
      contactName: formData.nome,
      niche: formData.setor,
      currentScore: result.scoreFinal,
      projectedScore: result.crm?.scoreProjetado,
      improvementPoints: result.crm?.melhoriaPrevista,
      financialImpact: result.crm?.impactoFinanceiro as {
        lostRevenueMonthly?: { min?: number; max?: number }
        lostRevenueAnnual?: { min?: number; max?: number }
        impactPhrase?: string
        opportunityLabel?: string
      } | null,
      recommendedPlan: result.crm?.planoRecomendado,
      generatedHomepage: result.crm?.homepageGerada,
      templateUsed: result.crm?.templateUtilizado,
      problems: [result.classificacao.message],
      opportunities: result.recomendacoes,
    })

    try {
      whatsappMessage = salesAgentMessages.whatsappMessage || generateDiagnosticoWhatsAppMessage({
        lead: formData,
        result,
      })
    } catch (whatsappError) {
      whatsappStatus = "erro"
      console.error("Nao foi possivel preparar a mensagem de WhatsApp pos-diagnostico.", whatsappError)
    }

    const record = {
      diagnostico_digital_lead_id: result.id ?? null,
      empresa: formData.empresa,
      nome_contacto: formData.nome,
      email: formData.email,
      telefone: formData.whatsapp,
      website: formData.website,
      setor: formData.setor,
      objetivo: formData.objetivo,
      score_geral: result.scoreFinal,
      score_website: result.categorias.website,
      score_google: result.categorias.google,
      score_conversao: result.categorias.conversao,
      score_automacao: result.categorias.automacao,
      score_crm: typeof result.crmScore === "number" ? result.crmScore : 0,
      classificacao: result.classificacao.label,
      potencial_estimado: result.potencialEstimado,
      recomendacoes: result.recomendacoes,
      origem: result.crm?.origem ?? "diagnostico",
      proxima_acao: result.crm?.proximaAcao ?? "",
      notas: result.crm?.notas ?? "",
      perda_mensal_estimada: result.crm?.perdaMensalEstimada ?? 0,
      impacto_financeiro: result.crm?.impactoFinanceiro ?? {},
      plano_recomendado: result.crm?.planoRecomendado ?? "",
      homepage_gerada: result.crm?.homepageGerada ?? {},
      score_projetado: result.crm?.scoreProjetado ?? 0,
      melhoria_prevista: result.crm?.melhoriaPrevista ?? 0,
      template_utilizado: result.crm?.templateUtilizado ?? "",
      whatsapp_message: whatsappMessage,
      email_subject: salesAgentMessages.emailSubject,
      email_body: salesAgentMessages.emailBody,
      followup_3d: salesAgentMessages.followup3d,
      followup_7d: salesAgentMessages.followup7d,
      followup_15d: salesAgentMessages.followup15d,
      objection_responses: salesAgentMessages.objectionResponses,
      post_proposal_message: salesAgentMessages.postProposalMessage,
      post_meeting_message: salesAgentMessages.postMeetingMessage,
      sales_agent_status: salesAgentMessages.status,
      whatsapp_status: whatsappStatus,
      email_provider: "resend",
      email_status: "pendente",
      email_error: null,
      pdf_status: "pendente",
      status: "novo",
      updated_at: new Date().toISOString(),
    }

    const query = result.id
      ? supabase.from("diagnosticos").upsert(record, { onConflict: "diagnostico_digital_lead_id" })
      : supabase.from("diagnosticos").insert(record)

    const { data, error } = await query.select("id,status").single()

    if (error) {
      return NextResponse.json(
        {
          error: "Nao foi possivel guardar o diagnostico no funil comercial.",
          details: error.message,
        },
        { status: 500 },
      )
    }

    const diagnosticoId = data?.id
    let emailStatus: "pendente" | "a_enviar" | "enviado" | "erro" = "pendente"

    if (diagnosticoId) {
      const attemptAt = new Date().toISOString()

      await supabase
        .from("diagnosticos")
        .update({
          email_status: "a_enviar",
          email_last_attempt_at: attemptAt,
          email_error: null,
          pdf_status: "a_gerar",
          updated_at: attemptAt,
        })
        .eq("id", diagnosticoId)

      await supabase.from("diagnostico_email_events").insert({
        diagnostico_id: diagnosticoId,
        diagnostico_digital_lead_id: result.id ?? null,
        provider: "resend",
        recipient_email: formData.email,
        subject: `Relatorio Executivo IAWEB - ${formData.empresa}`,
        status: "a_enviar",
        payload: {
          score: result.scoreFinal,
          empresa: formData.empresa,
          origem: "diagnostico",
        },
      })
    }

    try {
      const emailResult = await sendDiagnosticoLeadEmail({
        lead: formData,
        result: {
          ...result,
          createdAt: result.createdAt ?? new Date().toISOString(),
        },
        idempotencyKey: buildEmailIdempotencyKey(formData, result),
      })

      emailStatus = "enviado"

      if (diagnosticoId) {
        await supabase
          .from("diagnosticos")
          .update({
            email_status: "enviado",
            email_sent_at: emailResult.sentAt,
            email_error: null,
            email_resend_id: emailResult.resendEmailId,
            pdf_status: "gerado",
            pdf_filename: emailResult.attachment.filename,
            pdf_generated_at: emailResult.attachment.generatedAt,
            updated_at: new Date().toISOString(),
          })
          .eq("id", diagnosticoId)

        await supabase.from("diagnostico_email_events").insert({
          diagnostico_id: diagnosticoId,
          diagnostico_digital_lead_id: result.id ?? null,
          provider: emailResult.provider,
          resend_email_id: emailResult.resendEmailId,
          recipient_email: formData.email,
          subject: emailResult.subject,
          status: "enviado",
          pdf_filename: emailResult.attachment.filename,
          payload: {
            attachment_size: emailResult.attachment.size,
            score: result.scoreFinal,
            empresa: formData.empresa,
          },
        })
      }
    } catch (emailError) {
      const errorMessage = getErrorMessage(emailError)
      emailStatus = "erro"
      console.error("Nao foi possivel enviar o email pos-diagnostico.", emailError)

      if (diagnosticoId) {
        await supabase
          .from("diagnosticos")
          .update({
            email_status: "erro",
            email_error: errorMessage,
            pdf_status: errorMessage.includes("Resend email is not configured") ? "pendente" : "erro",
            updated_at: new Date().toISOString(),
          })
          .eq("id", diagnosticoId)

        await supabase.from("diagnostico_email_events").insert({
          diagnostico_id: diagnosticoId,
          diagnostico_digital_lead_id: result.id ?? null,
          provider: "resend",
          recipient_email: formData.email,
          subject: `Relatorio Executivo IAWEB - ${formData.empresa}`,
          status: "erro",
          error_message: errorMessage,
          payload: {
            score: result.scoreFinal,
            empresa: formData.empresa,
          },
        })
      }
    }

    return NextResponse.json({ ok: true, id: data?.id, status: data?.status ?? "novo", emailStatus })
  } catch {
    return NextResponse.json({ error: "Pedido invalido." }, { status: 400 })
  }
}
