import { NextResponse } from "next/server"
import { assertCrmAccess } from "@/lib/crm-auth"
import { getProspectorSupabaseClient } from "@/lib/prospector/db"
import { createAgentEvent } from "@/lib/prospector/observability"
import { calculateCampaignIntelligence } from "@/lib/prospector/campaign-intelligence"
import { calculatePropensityScore } from "@/lib/prospector/propensity-engine"
import { persistProspectSignals } from "@/lib/prospector/signals"

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function PATCH(request: Request, context: RouteContext) {
  const access = await assertCrmAccess()

  if (!access.ok) {
    return NextResponse.json({ error: "Autenticacao do CRM obrigatoria." }, { status: 401 })
  }

  const client = getProspectorSupabaseClient()

  if (!client.ok) {
    return NextResponse.json({ error: client.error.message }, { status: 503 })
  }

  const { id } = await context.params
  const payload = (await request.json().catch(() => ({}))) as {
    status?: string
    energy_score?: number
    pain_score?: number
    opportunity_score?: number
    prospect_score?: number
    propensity_score?: number
    conversion_probability?: number
    email?: string
    telefone?: string
    cidade?: string
  }
  const shouldRecalculatePropensity =
    payload.energy_score !== undefined ||
    payload.pain_score !== undefined ||
    payload.opportunity_score !== undefined ||
    payload.prospect_score !== undefined
  const shouldRecalculateCampaign =
    shouldRecalculatePropensity ||
    payload.propensity_score !== undefined ||
    payload.conversion_probability !== undefined ||
    payload.email !== undefined ||
    payload.telefone !== undefined ||
    payload.cidade !== undefined

  const { data: current, error: currentError } = shouldRecalculateCampaign
    ? await client.supabase.from("prospects").select("*").eq("id", id).single()
    : { data: null, error: null }

  if (currentError) {
    return NextResponse.json({ error: currentError.message }, { status: 500 })
  }

  const prospect = current as
    | {
        empresa?: string
        cidade?: string | null
        email?: string | null
        telefone?: string | null
        website?: string | null
        nicho?: string | null
        score_digital?: number | null
        opportunity_score?: number | null
        prospect_score?: number | null
        propensity_score?: number | null
        conversion_probability?: number | null
        potencial_estimado?: number | null
        priority_label?: string | null
        classificacao?: string | null
        problemas_detectados?: string[] | null
        oportunidades?: string[] | null
        sinais_score?: Record<string, unknown> | null
      }
    | null
  const opportunityScore = payload.opportunity_score ?? payload.energy_score ?? prospect?.opportunity_score
  const prospectScore = payload.prospect_score ?? payload.pain_score ?? prospect?.prospect_score
  const email = payload.email ?? prospect?.email
  const telefone = payload.telefone ?? prospect?.telefone
  const cidade = payload.cidade ?? prospect?.cidade
  const propensity = shouldRecalculatePropensity
    ? calculatePropensityScore({
        energy_score: opportunityScore,
        pain_score: prospectScore,
        nicho: prospect?.nicho,
        score_digital: prospect?.score_digital,
        website: prospect?.website,
        email,
        telefone,
        problemas_detectados: prospect?.problemas_detectados,
        oportunidades: prospect?.oportunidades,
        sinais_score: prospect?.sinais_score,
        priority_label: prospect?.priority_label,
        classificacao: prospect?.classificacao,
      })
    : null
  const campaign = shouldRecalculateCampaign
    ? calculateCampaignIntelligence({
        propensity_score: propensity?.propensity_score ?? payload.propensity_score ?? prospect?.propensity_score,
        conversion_probability: propensity?.conversion_probability ?? payload.conversion_probability ?? prospect?.conversion_probability,
        next_best_action: propensity?.next_best_action,
        energy_score: opportunityScore,
        pain_score: prospectScore,
        potential_value: prospect?.potencial_estimado,
        score_digital: prospect?.score_digital,
        email,
        telefone,
        cidade,
        nicho: prospect?.nicho,
        empresa: prospect?.empresa,
      })
    : null
  const fields = {
    ...(payload.status ? { status: payload.status } : {}),
    ...(payload.email !== undefined ? { email } : {}),
    ...(payload.telefone !== undefined ? { telefone } : {}),
    ...(payload.cidade !== undefined ? { cidade } : {}),
    ...(payload.opportunity_score !== undefined || payload.energy_score !== undefined ? { opportunity_score: opportunityScore } : {}),
    ...(payload.prospect_score !== undefined || payload.pain_score !== undefined ? { prospect_score: prospectScore } : {}),
    ...(payload.propensity_score !== undefined && !propensity ? { propensity_score: payload.propensity_score } : {}),
    ...(payload.conversion_probability !== undefined && !propensity ? { conversion_probability: payload.conversion_probability } : {}),
    ...(propensity ? propensity : {}),
    ...(campaign ? campaign : {}),
    updated_at: new Date().toISOString(),
  }
  const { data, error } = await client.supabase.from("prospects").update(fields).eq("id", id).select("*").single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (propensity) {
    const signalResult = await persistProspectSignals(
      client.supabase,
      (prospect?.problemas_detectados ?? []).map((problem) => ({
        prospectId: id,
        company: prospect?.empresa,
        signalType: "pain",
        signalText: problem,
        signalScore: prospectScore,
        source: "manual_update",
        sourceUrl: prospect?.website,
        agentName: "Pain Intelligence",
      })),
    )

    if (!signalResult.ok) {
      return NextResponse.json({ error: signalResult.error }, { status: 500 })
    }

    await createAgentEvent({
      agentName: "Lead Enrichment",
      eventType: "propensity_calculated",
      companyId: id,
      metadata: {
        company: prospect?.empresa,
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
        companyId: id,
        metadata: { company: prospect?.empresa, propensity_score: propensity.propensity_score },
      })
    }
    if (propensity.propensity_label === "Muito Quente") {
      await createAgentEvent({
        agentName: "Lead Enrichment",
        eventType: "propensity_hot",
        companyId: id,
        metadata: { company: prospect?.empresa, propensity_score: propensity.propensity_score },
      })
    }
  }
  if (campaign) {
    await createAgentEvent({
      agentName: "Lead Enrichment",
      eventType: "campaign_intelligence_generated",
      companyId: id,
      metadata: {
        company: prospect?.empresa,
        best_channel: campaign.best_channel,
        campaign_priority: campaign.campaign_priority,
        expected_conversion: campaign.expected_conversion,
        recommended_sequence: campaign.recommended_sequence,
      },
    })
    await createAgentEvent({
      agentName: "Lead Enrichment",
      eventType: "best_channel_selected",
      companyId: id,
      metadata: { company: prospect?.empresa, best_channel: campaign.best_channel },
    })
    if (campaign.expected_conversion >= 0.7) {
      await createAgentEvent({
        agentName: "Lead Enrichment",
        eventType: "high_conversion_detected",
        companyId: id,
        metadata: { company: prospect?.empresa, expected_conversion: campaign.expected_conversion },
      })
    }
  }

  return NextResponse.json({ prospect: data })
}
