import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type { DiagnosticoFormData, DiagnosticoResult } from "@/lib/diagnostico"
import { sendDiagnosticoLeadEmail } from "@/lib/diagnostico-email"
import { generateDiagnosticoWhatsAppMessage } from "@/lib/diagnostico-whatsapp"

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
  }
}

const scoreFields = ["website", "google", "conversao", "automacao"] as const

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
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Supabase nao esta configurado." }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })

    let whatsappMessage: string | null = null
    let whatsappStatus = "pendente"

    try {
      whatsappMessage = generateDiagnosticoWhatsAppMessage({
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
      whatsapp_message: whatsappMessage,
      whatsapp_status: whatsappStatus,
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

    try {
      await sendDiagnosticoLeadEmail({
        lead: formData,
        result: {
          ...result,
          createdAt: result.createdAt ?? new Date().toISOString(),
        },
      })
    } catch (emailError) {
      console.error("Nao foi possivel enviar o email pos-diagnostico.", emailError)
    }

    return NextResponse.json({ ok: true, id: data?.id, status: data?.status ?? "novo" })
  } catch {
    return NextResponse.json({ error: "Pedido invalido." }, { status: 400 })
  }
}
