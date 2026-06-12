import { NextResponse } from "next/server"
import type { SupabaseClient } from "@supabase/supabase-js"
import { assertCrmAccess } from "@/lib/crm-auth"
import { generateSalesAgentMessages } from "@/lib/sales-agent"
import { getProspectorSupabaseClient } from "@/lib/prospector/db"
import { createAgentEvent, createAgentRun, updateAgentRun } from "@/lib/prospector/observability"
import { calculateCampaignIntelligence } from "@/lib/prospector/campaign-intelligence"
import { calculatePropensityScore } from "@/lib/prospector/propensity-engine"

type ProspectRecord = {
  id: string
  empresa: string
  contacto: string | null
  email: string | null
  telefone: string | null
  website: string | null
  cidade: string | null
  nicho: string
  prospect_score?: number | null
  classificacao?: string | null
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
  potencial_estimado?: number | null
  resumo_executivo?: string | null
  proxima_acao?: string | null
  whatsapp_message?: string | null
  email_subject?: string | null
  email_body?: string | null
  followup_3d?: string | null
  followup_7d?: string | null
  followup_15d?: string | null
  propensity_score?: number | null
  propensity_label?: string | null
  conversion_probability?: number | null
  next_best_action?: string | null
  best_channel?: string | null
  campaign_priority?: string | null
  recommended_sequence?: string | null
  expected_conversion?: number | null
  campaign_reason?: string | null
}

function classify(score: number) {
  if (score <= 40) return "Critico"
  if (score <= 70) return "Oportunidade"
  return "Forte"
}

async function assertCrmDatabaseReady(supabase: SupabaseClient) {
  const { error } = await supabase.from("diagnosticos").select("id", { head: true, count: "exact" }).limit(1)

  if (error) {
    return {
      ok: false,
      error: `CRM Supabase nao esta pronto. Confirma public.diagnosticos e a migration diagnosticos_prospect_crm_readiness.sql. Detalhe: ${error.message}`,
    }
  }

  return { ok: true }
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

  const crmReady = await assertCrmDatabaseReady(client.supabase)

  if (!crmReady.ok) {
    return NextResponse.json({ error: crmReady.error }, { status: 503 })
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
  const run = await createAgentRun({
    agentName: "CRM Import",
    currentTask: `Importar ${record.empresa} para CRM`,
  })
  const salesMessages = record.whatsapp_message && record.email_subject && record.email_body
    ? {
        whatsappMessage: record.whatsapp_message,
        emailSubject: record.email_subject,
        emailBody: record.email_body,
        followup3d: record.followup_3d ?? "",
        followup7d: record.followup_7d ?? "",
        followup15d: record.followup_15d ?? "",
        objectionResponses: {},
        postProposalMessage: "",
        postMeetingMessage: "",
        status: "gerado" as const,
      }
    : generateSalesAgentMessages({
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
  const prospectScore = record.prospect_score ?? record.score_digital
  const classificacao = record.classificacao ?? classify(prospectScore)
  const potencialEstimado = record.potencial_estimado ?? record.impacto_financeiro?.lostRevenueMonthly?.max ?? 0
  const proximaAcao = record.proxima_acao ?? "Validar prospect e enviar abordagem comercial personalizada"
  const propensity = calculatePropensityScore({
    energy_score: record.opportunity_score,
    pain_score: prospectScore,
    nicho: record.nicho,
    score_digital: record.score_digital,
    website: record.website,
    email: record.email,
    telefone: record.telefone,
    problemas_detectados: record.problemas_detectados,
    oportunidades: record.oportunidades,
    priority_label: record.priority_label,
    classificacao,
  })
  const campaign = calculateCampaignIntelligence({
    ...propensity,
    energy_score: record.opportunity_score,
    pain_score: prospectScore,
    potential_value: potencialEstimado,
    score_digital: record.score_digital,
    email: record.email,
    telefone: record.telefone,
    cidade: record.cidade,
    nicho: record.nicho,
    empresa: record.empresa,
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
    score_geral: prospectScore,
    score_website: record.score_digital,
    score_google: Math.max(0, record.score_digital - 8),
    score_conversao: Math.max(0, record.score_digital - 4),
    score_automacao: Math.max(0, record.score_digital - 18),
    score_crm: record.opportunity_score,
    classificacao,
    potencial_estimado: `${potencialEstimado} EUR/mes`,
    recomendacoes: record.oportunidades ?? [],
    origem: "prospector",
    proxima_acao: proximaAcao,
    notas: [
      `Cidade: ${record.cidade ?? ""}`,
      `Resumo executivo: ${record.resumo_executivo ?? ""}`,
      `Prioridade: ${record.priority_label}`,
      `Classificacao: ${classificacao}`,
      `Prospect score: ${prospectScore}/100`,
      `Template: ${record.template_utilizado}`,
      `Score projetado: ${record.score_projetado}`,
    ].join("\n"),
    perda_mensal_estimada: potencialEstimado,
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
    if (run.ok && "run" in run) {
      await updateAgentRun(run.run.id, {
        status: "failed",
        currentTask: "Erro ao importar lead para CRM",
        totalProcessed: 1,
        totalSuccess: 0,
        totalFailed: 1,
        errorMessage: crmError.message,
      })
      await createAgentEvent({
        agentName: "CRM Import",
        eventType: "error",
        eventMessage: `CRM Import falhou para ${record.empresa}: ${crmError.message}`,
        companyId: record.id,
        metadata: { company: record.empresa, error: crmError.message },
      })
    }
    const readinessHint = crmError.message.toLowerCase().includes("conflict") || crmError.message.toLowerCase().includes("constraint")
      ? " Verifica se diagnosticos_email_unique_idx existe para suportar onConflict=email."
      : ""

    return NextResponse.json({ error: `${crmError.message}${readinessHint}` }, { status: 500 })
  }

  await client.supabase
    .from("prospects")
    .update({ status: "promovido_crm", ...propensity, ...campaign, updated_at: new Date().toISOString() })
    .eq("id", record.id)

  if (run.ok && "run" in run) {
    await updateAgentRun(run.run.id, {
      status: "completed",
      currentTask: "Lead importado para CRM",
      totalProcessed: 1,
      totalSuccess: 1,
      totalFailed: 0,
    })
    await createAgentEvent({
      agentName: "CRM Import",
      eventType: "lead_imported",
      companyId: record.id,
      metadata: { company: record.empresa, crmLeadId: crmLead?.id },
    })
    await createAgentEvent({
      agentName: "Lead Enrichment",
      eventType: "propensity_calculated",
      companyId: record.id,
      metadata: {
        company: record.empresa,
        propensity_score: propensity.propensity_score,
        propensity_label: propensity.propensity_label,
        conversion_probability: propensity.conversion_probability,
        next_best_action: propensity.next_best_action,
      },
    })
    if (propensity.propensity_label === "Critico") {
      await createAgentEvent({
        agentName: "Lead Enrichment",
        eventType: "propensity_critical",
        companyId: record.id,
        metadata: { company: record.empresa, propensity_score: propensity.propensity_score },
      })
    }
    if (propensity.propensity_label === "Muito Quente") {
      await createAgentEvent({
        agentName: "Lead Enrichment",
        eventType: "propensity_hot",
        companyId: record.id,
        metadata: { company: record.empresa, propensity_score: propensity.propensity_score },
      })
    }
    await createAgentEvent({
      agentName: "Lead Enrichment",
      eventType: "campaign_intelligence_generated",
      companyId: record.id,
      metadata: {
        company: record.empresa,
        best_channel: campaign.best_channel,
        campaign_priority: campaign.campaign_priority,
        expected_conversion: campaign.expected_conversion,
        recommended_sequence: campaign.recommended_sequence,
      },
    })
    await createAgentEvent({
      agentName: "Lead Enrichment",
      eventType: "best_channel_selected",
      companyId: record.id,
      metadata: { company: record.empresa, best_channel: campaign.best_channel },
    })
    if (campaign.expected_conversion >= 0.7) {
      await createAgentEvent({
        agentName: "Lead Enrichment",
        eventType: "high_conversion_detected",
        companyId: record.id,
        metadata: { company: record.empresa, expected_conversion: campaign.expected_conversion },
      })
    }
  }

  return NextResponse.json({ ok: true, crmLeadId: crmLead?.id })
}
