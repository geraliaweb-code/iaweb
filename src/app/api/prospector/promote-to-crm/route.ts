import { NextResponse } from "next/server"
import { assertCrmAccess } from "@/lib/crm-auth"
import { generateSalesAgentMessages } from "@/lib/sales-agent"
import { getProspectorSupabaseClient } from "@/lib/prospector/db"

type ProspectRecord = {
  id: string
  empresa: string
  contacto: string | null
  email: string | null
  telefone: string | null
  website: string | null
  cidade: string | null
  nicho: string
  score_digital: number
  opportunity_score: number
  priority_label: string
  problemas_detectados: string[]
  oportunidades: string[]
  impacto_financeiro: {
    lostRevenueMonthly?: { min?: number; max?: number }
    lostRevenueAnnual?: { min?: number; max?: number }
    impactPhrase?: string
    opportunityLabel?: string
  }
  homepage_gerada: Record<string, unknown>
  score_projetado: number
  melhoria_prevista: number
  template_utilizado: string
}

function classify(score: number) {
  if (score <= 40) return "Critico"
  if (score <= 70) return "Em Desenvolvimento"
  return "Forte"
}

export async function POST(request: Request) {
  const access = await assertCrmAccess()

  if (!access.ok) {
    return NextResponse.json({ error: "Autenticacao do CRM obrigatoria." }, { status: 401 })
  }

  const client = getProspectorSupabaseClient()

  if (!client.ok) {
    return NextResponse.json({ error: client.error.message }, { status: 503 })
  }

  const payload = (await request.json().catch(() => ({}))) as { id?: string }

  if (!payload.id) {
    return NextResponse.json({ error: "ID do prospect em falta." }, { status: 400 })
  }

  const { data: prospect, error: prospectError } = await client.supabase
    .from("prospects")
    .select("*")
    .eq("id", payload.id)
    .single()

  if (prospectError || !prospect) {
    return NextResponse.json({ error: prospectError?.message ?? "Prospect nao encontrado." }, { status: 404 })
  }

  const record = prospect as ProspectRecord
  const salesMessages = generateSalesAgentMessages({
    company: record.empresa,
    contactName: record.contacto ?? "",
    niche: record.nicho,
    city: record.cidade ?? "",
    currentScore: record.score_digital,
    projectedScore: record.score_projetado,
    improvementPoints: record.melhoria_prevista,
    financialImpact: record.impacto_financeiro,
    recommendedPlan: record.score_digital < 45 ? "Homepage Premium desde EUR 299" : "Sistema Comercial",
    generatedHomepage: record.homepage_gerada,
    templateUsed: record.template_utilizado,
    problems: record.problemas_detectados ?? [],
    opportunities: record.oportunidades ?? [],
  })

  const crmRecord = {
    empresa: record.empresa,
    nome_contacto: record.contacto ?? "",
    email: record.email || `prospect-${record.id}@iaweb.pt`,
    telefone: record.telefone ?? "",
    website: record.website ?? "",
    cidade: record.cidade ?? "",
    setor: record.nicho,
    objetivo: "Prospect identificado pelo Prospector IA",
    score_geral: record.score_digital,
    score_website: record.score_digital,
    score_google: Math.max(0, record.score_digital - 8),
    score_conversao: Math.max(0, record.score_digital - 4),
    score_automacao: Math.max(0, record.score_digital - 18),
    score_crm: record.opportunity_score,
    classificacao: classify(record.score_digital),
    potencial_estimado: `Opportunity score: ${record.opportunity_score}/100`,
    recomendacoes: record.oportunidades ?? [],
    origem: "prospector",
    proxima_acao: "Validar prospect e enviar abordagem comercial personalizada",
    notas: [
      `Cidade: ${record.cidade ?? ""}`,
      `Prioridade: ${record.priority_label}`,
      `Template: ${record.template_utilizado}`,
      `Score projetado: ${record.score_projetado}`,
    ].join("\n"),
    perda_mensal_estimada: record.impacto_financeiro?.lostRevenueMonthly?.max ?? 0,
    impacto_financeiro: record.impacto_financeiro ?? {},
    plano_recomendado: record.score_digital < 45 ? "Homepage Premium desde EUR 299" : "Sistema Comercial",
    homepage_gerada: record.homepage_gerada ?? {},
    score_projetado: record.score_projetado,
    melhoria_prevista: record.melhoria_prevista,
    template_utilizado: record.template_utilizado,
    whatsapp_status: "pendente",
    whatsapp_message: salesMessages.whatsappMessage,
    email_subject: salesMessages.emailSubject,
    email_body: salesMessages.emailBody,
    followup_3d: salesMessages.followup3d,
    followup_7d: salesMessages.followup7d,
    followup_15d: salesMessages.followup15d,
    objection_responses: salesMessages.objectionResponses,
    post_proposal_message: salesMessages.postProposalMessage,
    post_meeting_message: salesMessages.postMeetingMessage,
    sales_agent_status: salesMessages.status,
    status: "novo",
    updated_at: new Date().toISOString(),
  }

  const { data: crmLead, error: crmError } = await client.supabase
    .from("diagnosticos")
    .upsert(crmRecord, { onConflict: "email" })
    .select("id")
    .single()

  if (crmError) {
    return NextResponse.json({ error: crmError.message }, { status: 500 })
  }

  await client.supabase
    .from("prospects")
    .update({ status: "promovido_crm", updated_at: new Date().toISOString() })
    .eq("id", record.id)

  return NextResponse.json({ ok: true, crmLeadId: crmLead?.id })
}
