import { NextResponse } from "next/server"
import { assertCrmAccess } from "@/lib/crm-auth"
import { generateProspects, type ProspectorFilters } from "@/lib/prospector"
import { getProspectorSupabaseClient } from "@/lib/prospector/db"

export async function POST(request: Request) {
  const access = await assertCrmAccess()

  if (!access.ok) {
    return NextResponse.json({ error: "Autenticacao do CRM obrigatoria." }, { status: 401 })
  }

  const payload = (await request.json().catch(() => ({}))) as ProspectorFilters
  const results = generateProspects({ ...payload, limit: payload.limit ?? 30 })
  const records = results.map((result) => ({
    empresa: result.company.empresa,
    contacto: result.company.contacto ?? "",
    email: result.company.email ?? "",
    telefone: result.company.telefone ?? "",
    website: result.company.website ?? "",
    cidade: result.company.cidade,
    regiao: result.company.regiao ?? "",
    nicho: result.company.nicho,
    keywords: result.company.keywords,
    score_digital: result.digitalAnalysis.scoreDigital,
    opportunity_score: result.opportunity.score,
    priority_label: result.opportunity.priorityLabel,
    problemas_detectados: result.digitalAnalysis.detectedProblems,
    oportunidades: result.digitalAnalysis.opportunities,
    impacto_financeiro: result.financialImpact,
    homepage_gerada: result.homepage,
    score_projetado: result.projectedScore,
    melhoria_prevista: result.improvement,
    template_utilizado: result.templateUsed,
    status: "novo",
    source: "simulado",
    updated_at: new Date().toISOString(),
  }))

  const client = getProspectorSupabaseClient()

  if (!client.ok) {
    return NextResponse.json({ prospects: records, warning: client.error.message })
  }

  const { data, error } = await client.supabase.from("prospects").upsert(records, { onConflict: "email" }).select("*")

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ prospects: data ?? records })
}
