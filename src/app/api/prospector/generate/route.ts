import { NextResponse } from "next/server"
import { assertCrmAccess } from "@/lib/crm-auth"
import { generateProspectsForMode, getProspectorSourceMode, type ProspectorFilters } from "@/lib/prospector"
import { getProspectorSupabaseClient } from "@/lib/prospector/db"
import { createAgentEvent, createAgentRun, updateAgentRun } from "@/lib/prospector/observability"
import { calculateCampaignIntelligence } from "@/lib/prospector/campaign-intelligence"
import { calculatePropensityScore } from "@/lib/prospector/propensity-engine"
import { persistProspectSignals } from "@/lib/prospector/signals"

export async function POST(request: Request) {
  const access = await assertCrmAccess()

  if (!access.ok) {
    return NextResponse.json({ error: "Autenticacao do CRM obrigatoria." }, { status: 401 })
  }

  const payload = (await request.json().catch(() => ({}))) as ProspectorFilters
  const sourceMode = getProspectorSourceMode(payload.sourceMode)
  const run = await createAgentRun({
    agentName: "Maps Collector",
    currentTask: sourceMode === "simulation" ? "Gerar prospects em SIMULATION MODE" : "Gerar prospects em PRODUCTION MODE",
  })
  let results: ReturnType<typeof generateProspectsForMode>

  try {
    results = generateProspectsForMode({ ...payload, limit: payload.limit ?? 30 }, sourceMode)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Fonte de dados indisponivel."

    if (run.ok && "run" in run) {
      await updateAgentRun(run.run.id, {
        status: "failed",
        currentTask: message,
        totalProcessed: 0,
        totalSuccess: 0,
        totalFailed: 0,
        errorMessage: message,
      })
    }

    return NextResponse.json({ error: message, mode: sourceMode }, { status: 501 })
  }
  const records = results.map((result) => {
    const propensity = calculatePropensityScore({
      energy_score: result.opportunity.score,
      pain_score: result.prospectScore.score,
      nicho: result.company.nicho,
      score_digital: result.digitalAnalysis.scoreDigital,
      website: result.company.website,
      email: result.company.email,
      telefone: result.company.telefone,
      problemas_detectados: result.diagnosis.problemas,
      oportunidades: result.diagnosis.oportunidades,
      sinais_score: result.prospectScore.signals,
      priority_label: result.opportunity.priorityLabel,
      classificacao: result.prospectScore.classification,
    })
    const campaign = calculateCampaignIntelligence({
      ...propensity,
      energy_score: result.opportunity.score,
      pain_score: result.prospectScore.score,
      potential_value: result.diagnosis.potencialEstimadoMensal,
      score_digital: result.digitalAnalysis.scoreDigital,
      email: result.company.email,
      telefone: result.company.telefone,
      cidade: result.company.cidade,
      nicho: result.company.nicho,
      empresa: result.company.empresa,
    })

    return {
      empresa: result.company.empresa,
      contacto: result.company.contacto ?? "",
      email: result.company.email ?? "",
      telefone: result.company.telefone ?? "",
      website: result.company.website ?? "",
      cidade: result.company.cidade,
      regiao: result.company.regiao ?? "",
      nicho: result.company.nicho,
      keywords: result.company.keywords,
      prospect_score: result.prospectScore.score,
      classificacao: result.prospectScore.classification,
      sinais_score: result.prospectScore.signals,
      score_digital: result.digitalAnalysis.scoreDigital,
      opportunity_score: result.opportunity.score,
      priority_label: result.opportunity.priorityLabel,
      problemas_detectados: result.diagnosis.problemas,
      oportunidades: result.diagnosis.oportunidades,
      potencial_estimado: result.diagnosis.potencialEstimadoMensal,
      resumo_executivo: result.diagnosis.resumoExecutivo,
      proxima_acao: result.diagnosis.proximaAcao,
      impacto_financeiro: result.financialImpact,
      homepage_gerada: result.homepage,
      score_projetado: result.projectedScore,
      melhoria_prevista: result.improvement,
      template_utilizado: result.templateUsed,
      whatsapp_message: result.commercial.whatsappMessage,
      email_subject: result.commercial.emailSubject,
      email_body: result.commercial.emailBody,
      followup_3d: result.commercial.followup3d,
      followup_7d: result.commercial.followup7d,
      followup_15d: result.commercial.followup15d,
      ...propensity,
      ...campaign,
      status: "novo",
      source: sourceMode === "simulation" ? "simulado" : "production",
      updated_at: new Date().toISOString(),
    }
  })

  const client = getProspectorSupabaseClient()

  if (!client.ok) {
    if (run.ok && "run" in run) {
      await updateAgentRun(run.run.id, {
        status: "completed",
        currentTask: "Prospects gerados sem persistencia Supabase",
        totalProcessed: records.length,
        totalSuccess: records.length,
        totalFailed: 0,
      })
    }
    return NextResponse.json({ prospects: records, mode: sourceMode, warning: client.error.message })
  }

  const { data, error } = await client.supabase.from("prospects").upsert(records, { onConflict: "email" }).select("*")

  if (error) {
    if (run.ok && "run" in run) {
      await updateAgentRun(run.run.id, {
        status: "failed",
        currentTask: "Erro ao gravar prospects",
        totalProcessed: records.length,
        totalSuccess: 0,
        totalFailed: records.length,
        errorMessage: error.message,
      })
      await createAgentEvent({
        agentName: "Maps Collector",
        eventType: "error",
        eventMessage: `Maps Collector falhou ao gravar prospects: ${error.message}`,
        metadata: { error: error.message },
      })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const savedProspects = (data ?? records) as Array<{
    id?: string
    empresa?: string
    website?: string
    email?: string
    problemas_detectados?: string[]
    prospect_score?: number
    source?: string
    propensity_score?: number
    propensity_label?: string
    next_best_action?: string
    best_channel?: string
    campaign_priority?: string
    recommended_sequence?: string
    expected_conversion?: number
  }>
  const signalResult = await persistProspectSignals(
    client.supabase,
    savedProspects.flatMap((prospect) =>
      (prospect.problemas_detectados ?? []).map((problem) => ({
        prospectId: prospect.id,
        company: prospect.empresa,
        signalType: "pain",
        signalText: problem,
        signalScore: prospect.prospect_score,
        source: prospect.source ?? (sourceMode === "simulation" ? "simulado" : "production"),
        sourceUrl: prospect.website,
        agentName: "Pain Intelligence",
      })),
    ),
  )

  if (!signalResult.ok) {
    if (run.ok && "run" in run) {
      await updateAgentRun(run.run.id, {
        status: "failed",
        currentTask: "Erro ao gravar pain signals",
        totalProcessed: records.length,
        totalSuccess: savedProspects.length,
        totalFailed: records.length,
        errorMessage: signalResult.error,
      })
    }
    return NextResponse.json({ error: signalResult.error }, { status: 500 })
  }

  if (run.ok && "run" in run) {
    await updateAgentRun(run.run.id, {
      status: "completed",
      currentTask: "Prospects gerados e gravados",
      totalProcessed: savedProspects.length,
      totalSuccess: savedProspects.length,
      totalFailed: 0,
    })
    await createAgentEvent({
      agentName: "Maps Collector",
      eventType: "agent_finished",
      eventMessage: `Maps Collector recolheu ${savedProspects.length} empresas`,
      metadata: { total: savedProspects.length },
    })
  }
  await Promise.all(
    savedProspects.slice(0, 30).flatMap((prospect) => [
      createAgentEvent({
        agentName: "Maps Collector",
        eventType: "company_found",
        companyId: prospect.id,
        metadata: { company: prospect.empresa },
      }),
      createAgentEvent({
        agentName: "Website Intelligence",
        eventType: "website_analyzed",
        companyId: prospect.id,
        metadata: { company: prospect.empresa, website: prospect.website },
      }),
      prospect.email
        ? createAgentEvent({
            agentName: "Email Discovery",
            eventType: "email_found",
            companyId: prospect.id,
            metadata: { company: prospect.empresa, email: prospect.email },
          })
        : Promise.resolve({ ok: true }),
      createAgentEvent({
        agentName: "Lead Enrichment",
        eventType: "propensity_calculated",
        companyId: prospect.id,
        metadata: {
          company: prospect.empresa,
          propensity_score: prospect.propensity_score,
          propensity_label: prospect.propensity_label,
          next_best_action: prospect.next_best_action,
        },
      }),
      prospect.propensity_label === "Critico"
        ? createAgentEvent({
            agentName: "Lead Enrichment",
            eventType: "propensity_critical",
            companyId: prospect.id,
            metadata: { company: prospect.empresa, propensity_score: prospect.propensity_score },
          })
        : Promise.resolve({ ok: true }),
      prospect.propensity_label === "Muito Quente"
        ? createAgentEvent({
            agentName: "Lead Enrichment",
            eventType: "propensity_hot",
            companyId: prospect.id,
            metadata: { company: prospect.empresa, propensity_score: prospect.propensity_score },
          })
        : Promise.resolve({ ok: true }),
      createAgentEvent({
        agentName: "Lead Enrichment",
        eventType: "campaign_intelligence_generated",
        companyId: prospect.id,
        metadata: {
          company: prospect.empresa,
          best_channel: prospect.best_channel,
          campaign_priority: prospect.campaign_priority,
          expected_conversion: prospect.expected_conversion,
          recommended_sequence: prospect.recommended_sequence,
        },
      }),
      createAgentEvent({
        agentName: "Lead Enrichment",
        eventType: "best_channel_selected",
        companyId: prospect.id,
        metadata: { company: prospect.empresa, best_channel: prospect.best_channel },
      }),
      Number(prospect.expected_conversion ?? 0) >= 0.7
        ? createAgentEvent({
            agentName: "Lead Enrichment",
            eventType: "high_conversion_detected",
            companyId: prospect.id,
            metadata: { company: prospect.empresa, expected_conversion: prospect.expected_conversion },
          })
        : Promise.resolve({ ok: true }),
    ]),
  )

  return NextResponse.json({ prospects: data ?? records, mode: sourceMode, signalsPersisted: signalResult.count })
}
