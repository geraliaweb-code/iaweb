import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { calculateDiagnostico, type DiagnosticoFormData } from "@/lib/diagnostico"

const requiredFields: Array<keyof DiagnosticoFormData> = [
  "nome",
  "empresa",
  "email",
  "whatsapp",
  "website",
  "setor",
  "objetivo",
]

function validateLead(payload: Partial<DiagnosticoFormData>) {
  const missing = requiredFields.filter((field) => !payload[field]?.trim())

  if (missing.length > 0) {
    return `Campos obrigatorios em falta: ${missing.join(", ")}.`
  }

  if (!payload.email?.includes("@")) {
    return "Email invalido."
  }

  return null
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<DiagnosticoFormData>
    const validationError = validateLead(payload)

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 })
    }

    const lead = payload as DiagnosticoFormData
    const createdAt = new Date().toISOString()
    const result = calculateDiagnostico(lead)

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: "Supabase nao esta configurado. Define NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY." },
        { status: 500 },
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })

    const { data, error } = await supabase
      .from("diagnostico_digital_leads")
      .insert({
        nome: lead.nome,
        empresa: lead.empresa,
        email: lead.email,
        whatsapp: lead.whatsapp,
        website: lead.website,
        setor: lead.setor,
        objetivo: lead.objetivo,
        score_total: result.scoreFinal,
        score_website: result.categorias.website,
        score_google: result.categorias.google,
        score_conversao: result.categorias.conversao,
        score_automacao: result.categorias.automacao,
        classificacao: result.classificacao.label,
        potencial_estimado: result.potencialEstimado,
        recomendacoes: result.recomendacoes,
        created_at: createdAt,
      })
      .select("id")
      .single()

    if (error) {
      return NextResponse.json(
        {
          error:
            "Nao foi possivel guardar a lead no Supabase. Confirma a tabela diagnostico_digital_leads e as permissoes.",
          details: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      ...result,
      id: data?.id,
      createdAt,
    })
  } catch {
    return NextResponse.json({ error: "Pedido invalido." }, { status: 400 })
  }
}
