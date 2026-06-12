import type { SupabaseClient } from "@supabase/supabase-js"
import { getProspectorSupabaseClient } from "./db"

export const COMMAND_CENTER_AGENTS = [
  "Maps Collector",
  "Website Intelligence",
  "Email Discovery",
  "Lead Enrichment",
  "Pain Intelligence",
  "CRM Import",
] as const

export type AgentName = (typeof COMMAND_CENTER_AGENTS)[number] | string
export type AgentRunStatus = "active" | "paused" | "idle" | "completed" | "failed"
export type AgentEventType =
  | "agent_started"
  | "agent_finished"
  | "company_found"
  | "website_analyzed"
  | "email_found"
  | "pain_signal_detected"
  | "lead_imported"
  | "propensity_calculated"
  | "propensity_critical"
  | "propensity_hot"
  | "campaign_intelligence_generated"
  | "best_channel_selected"
  | "high_conversion_detected"
  | "error"

export type AgentRun = {
  id: string
  agent_name: string
  status: AgentRunStatus
  current_task: string | null
  started_at: string | null
  finished_at: string | null
  total_processed: number
  total_success: number
  total_failed: number
  error_message: string | null
  created_at: string
  updated_at: string
}

export type AgentEvent = {
  id: string
  agent_name: string
  event_type: AgentEventType
  event_message: string
  company_id: string | null
  metadata: Record<string, unknown>
  created_at: string
}

export type CommandCenterLead = {
  id: string
  empresa: string
  cidade: string | null
  energy_score: number
  pain_score: number
  final_priority: string
  propensity_score: number
  propensity_label: string
  conversion_probability: number
  next_best_action: string
  best_channel: string
  campaign_priority: string
  recommended_sequence: string
  expected_conversion: number
  campaign_reason: string
  origem: string
  data: string | null
}

export type CommandCenterData = {
  metrics: {
    companiesCollectedToday: number
    enrichedLeads: number
    emailsFound: number
    painSignalsFound: number
    highPriorityLeads: number
    activeAgents: number
    registeredErrors: number
    averageConversionProbability: number
    averageExpectedConversion: number
    p1Leads: number
    callLeads: number
    visitLeads: number
    emailLeads: number
    nurtureLeads: number
  }
  agents: AgentRun[]
  events: AgentEvent[]
  recentLeads: CommandCenterLead[]
  topSources: Array<{ source: string; count: number }>
  topOpportunities: CommandCenterLead[]
  propensityDistribution: Array<{ label: string; count: number }>
  channelDistribution: Array<{ channel: string; count: number }>
  campaignPriorityDistribution: Array<{ priority: string; count: number }>
  hottestCompanies: CommandCenterLead[]
  warning?: string
}

type AgentRunMutationResult = { ok: true; run: AgentRun } | { ok: false; error: string }
type AgentEventMutationResult = { ok: true; event: AgentEvent } | { ok: false; error: string }

type ProspectRecord = {
  id: string
  empresa: string
  email: string | null
  cidade: string | null
  source: string | null
  prospect_score: number | null
  opportunity_score: number | null
  priority_label: string | null
  propensity_score: number | null
  propensity_label: string | null
  conversion_probability: number | null
  next_best_action: string | null
  best_channel: string | null
  campaign_priority: string | null
  recommended_sequence: string | null
  expected_conversion: number | null
  campaign_reason: string | null
  problemas_detectados: unknown
  status: string | null
  created_at: string | null
  updated_at: string | null
}

function isToday(value?: string | null) {
  if (!value) return false
  const date = new Date(value)
  if (!Number.isFinite(date.getTime())) return false
  const now = new Date()
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate()
}

function priorityRank(priority: string) {
  const normalized = priority.toLowerCase()
  if (normalized.includes("crit")) return 4
  if (normalized.includes("alta")) return 3
  if (normalized.includes("media")) return 2
  return 1
}

function sourceLabel(source?: string | null) {
  const value = (source || "manual").toLowerCase()
  if (value.includes("google")) return "Google Maps"
  if (value.includes("outscraper")) return "Outscraper"
  if (value.includes("csv")) return "CSV"
  if (value.includes("simulado")) return "Manual"
  if (value.includes("manual")) return "Manual"
  return "Outras futuras"
}

function eventMessage(agentName: string, eventType: AgentEventType, metadata?: Record<string, unknown>) {
  const company = String(metadata?.company ?? metadata?.empresa ?? "empresa")
  const website = String(metadata?.website ?? "")
  const email = String(metadata?.email ?? "")
  if (eventType === "company_found") return `${agentName} encontrou ${company}`
  if (eventType === "website_analyzed") return website ? `${agentName} analisou ${website}` : `${agentName} analisou ${company}`
  if (eventType === "email_found") return email ? `${agentName} encontrou ${email}` : `${agentName} encontrou email para ${company}`
  if (eventType === "pain_signal_detected") return `${agentName} detetou sinal de dor em ${company}`
  if (eventType === "lead_imported") return `Lead importado para CRM: ${company}`
  if (eventType === "propensity_calculated") return `${agentName} calculou propensity para ${company}`
  if (eventType === "propensity_critical") return `${company} classificado como Critico`
  if (eventType === "propensity_hot") return `${company} classificado como Muito Quente`
  if (eventType === "campaign_intelligence_generated") return `${agentName} gerou campaign intelligence para ${company}`
  if (eventType === "best_channel_selected") return `${agentName} selecionou canal para ${company}`
  if (eventType === "high_conversion_detected") return `${company} com alta conversao esperada`
  if (eventType === "error") return `${agentName} registou erro operacional`
  if (eventType === "agent_started") return `${agentName} iniciou execucao`
  return `${agentName} terminou execucao`
}

function toLead(prospect: ProspectRecord): CommandCenterLead {
  return {
    id: prospect.id,
    empresa: prospect.empresa,
    cidade: prospect.cidade,
    energy_score: prospect.opportunity_score ?? 0,
    pain_score: prospect.prospect_score ?? 0,
    final_priority: prospect.priority_label ?? "Media",
    propensity_score: prospect.propensity_score ?? 0,
    propensity_label: prospect.propensity_label ?? "Nao calculado",
    conversion_probability: Number(prospect.conversion_probability ?? 0),
    next_best_action: prospect.next_best_action ?? "nutricao futura",
    best_channel: prospect.best_channel ?? "NURTURE",
    campaign_priority: prospect.campaign_priority ?? "P4",
    recommended_sequence: prospect.recommended_sequence ?? "NURTURE",
    expected_conversion: Number(prospect.expected_conversion ?? 0),
    campaign_reason: prospect.campaign_reason ?? "",
    origem: sourceLabel(prospect.source),
    data: prospect.updated_at ?? prospect.created_at,
  }
}

async function readProspects(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("prospects")
    .select("id,empresa,email,cidade,source,prospect_score,opportunity_score,priority_label,propensity_score,propensity_label,conversion_probability,next_best_action,best_channel,campaign_priority,recommended_sequence,expected_conversion,campaign_reason,problemas_detectados,status,created_at,updated_at")
    .order("updated_at", { ascending: false })
    .limit(250)

  if (error) throw error
  return (data ?? []) as ProspectRecord[]
}

async function readRuns(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("prospect_agent_runs")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(80)

  if (error) throw error
  return (data ?? []) as AgentRun[]
}

async function readEvents(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("prospect_agent_events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(60)

  if (error) throw error
  return (data ?? []) as AgentEvent[]
}

async function readSignalCount(supabase: SupabaseClient) {
  const { count, error } = await supabase
    .from("prospect_signals")
    .select("id", { count: "exact", head: true })

  if (error) throw error
  return count ?? 0
}

function normalizeAgentRuns(runs: AgentRun[]) {
  return COMMAND_CENTER_AGENTS.map((agentName) => {
    const run = runs.find((item) => item.agent_name === agentName)
    return (
      run ?? {
        id: agentName,
        agent_name: agentName,
        status: "idle" as const,
        current_task: "Sem execucao registada",
        started_at: null,
        finished_at: null,
        total_processed: 0,
        total_success: 0,
        total_failed: 0,
        error_message: null,
        created_at: new Date(0).toISOString(),
        updated_at: new Date(0).toISOString(),
      }
    )
  })
}

export async function getCommandCenterData(): Promise<CommandCenterData> {
  const client = getProspectorSupabaseClient()

  if (!client.ok) {
    return {
      metrics: {
        companiesCollectedToday: 0,
        enrichedLeads: 0,
        emailsFound: 0,
        painSignalsFound: 0,
        highPriorityLeads: 0,
        activeAgents: 0,
        registeredErrors: 0,
        averageConversionProbability: 0,
        averageExpectedConversion: 0,
        p1Leads: 0,
        callLeads: 0,
        visitLeads: 0,
        emailLeads: 0,
        nurtureLeads: 0,
      },
      agents: normalizeAgentRuns([]),
      events: [],
      recentLeads: [],
      topSources: [],
      topOpportunities: [],
      propensityDistribution: [],
      channelDistribution: [],
      campaignPriorityDistribution: [],
      hottestCompanies: [],
      warning: client.error.message,
    }
  }

  try {
    const [prospects, runs, events, signalCount] = await Promise.all([
      readProspects(client.supabase),
      readRuns(client.supabase),
      readEvents(client.supabase),
      readSignalCount(client.supabase),
    ])
    const recentLeads = prospects.map(toLead).slice(0, 12)
    const topOpportunities = [...prospects]
      .sort((a, b) => (b.propensity_score ?? 0) - (a.propensity_score ?? 0) || priorityRank(b.priority_label ?? "") - priorityRank(a.priority_label ?? "") || (b.opportunity_score ?? 0) - (a.opportunity_score ?? 0))
      .slice(0, 20)
      .map(toLead)
    const hottestCompanies = [...prospects]
      .filter((prospect) => ["Critico", "Muito Quente"].includes(prospect.propensity_label ?? ""))
      .sort((a, b) => (b.propensity_score ?? 0) - (a.propensity_score ?? 0))
      .slice(0, 8)
      .map(toLead)
    const sourceCounts = prospects.reduce<Record<string, number>>((acc, prospect) => {
      const label = sourceLabel(prospect.source)
      acc[label] = (acc[label] ?? 0) + 1
      return acc
    }, {})
    const painSignalsFromEvents = events.filter((event) => event.event_type === "pain_signal_detected").length
    const errors = events.filter((event) => event.event_type === "error").length + runs.filter((run) => run.status === "failed").length
    const conversionValues = prospects.map((prospect) => Number(prospect.conversion_probability ?? 0)).filter((value) => value > 0)
    const expectedValues = prospects.map((prospect) => Number(prospect.expected_conversion ?? 0)).filter((value) => value > 0)
    const propensityCounts = prospects.reduce<Record<string, number>>((acc, prospect) => {
      const label = prospect.propensity_label ?? "Nao calculado"
      acc[label] = (acc[label] ?? 0) + 1
      return acc
    }, {})
    const channelCounts = prospects.reduce<Record<string, number>>((acc, prospect) => {
      const channel = prospect.best_channel ?? "NURTURE"
      acc[channel] = (acc[channel] ?? 0) + 1
      return acc
    }, {})
    const campaignPriorityCounts = prospects.reduce<Record<string, number>>((acc, prospect) => {
      const priority = prospect.campaign_priority ?? "P4"
      acc[priority] = (acc[priority] ?? 0) + 1
      return acc
    }, {})

    return {
      metrics: {
        companiesCollectedToday: prospects.filter((prospect) => isToday(prospect.created_at)).length + events.filter((event) => event.event_type === "company_found" && isToday(event.created_at)).length,
        enrichedLeads: prospects.filter((prospect) => prospect.status && prospect.status !== "novo").length,
        emailsFound: prospects.filter((prospect) => Boolean(prospect.email)).length + events.filter((event) => event.event_type === "email_found").length,
        painSignalsFound: Math.max(signalCount, painSignalsFromEvents),
        highPriorityLeads: prospects.filter((prospect) => priorityRank(prospect.priority_label ?? "") >= 3).length,
        activeAgents: runs.filter((run) => run.status === "active").length,
        registeredErrors: errors,
        averageConversionProbability: conversionValues.length ? Number((conversionValues.reduce((sum, value) => sum + value, 0) / conversionValues.length).toFixed(4)) : 0,
        averageExpectedConversion: expectedValues.length ? Number((expectedValues.reduce((sum, value) => sum + value, 0) / expectedValues.length).toFixed(4)) : 0,
        p1Leads: prospects.filter((prospect) => prospect.campaign_priority === "P1").length,
        callLeads: prospects.filter((prospect) => prospect.best_channel === "CALL").length,
        visitLeads: prospects.filter((prospect) => prospect.best_channel === "VISIT").length,
        emailLeads: prospects.filter((prospect) => prospect.best_channel === "EMAIL").length,
        nurtureLeads: prospects.filter((prospect) => prospect.best_channel === "NURTURE").length,
      },
      agents: normalizeAgentRuns(runs),
      events,
      recentLeads,
      topSources: Object.entries(sourceCounts)
        .map(([source, count]) => ({ source, count }))
        .sort((a, b) => b.count - a.count),
      topOpportunities,
      propensityDistribution: Object.entries(propensityCounts)
        .map(([label, count]) => ({ label, count }))
        .sort((a, b) => b.count - a.count),
      channelDistribution: Object.entries(channelCounts)
        .map(([channel, count]) => ({ channel, count }))
        .sort((a, b) => b.count - a.count),
      campaignPriorityDistribution: Object.entries(campaignPriorityCounts)
        .map(([priority, count]) => ({ priority, count }))
        .sort((a, b) => a.priority.localeCompare(b.priority)),
      hottestCompanies,
    }
  } catch (error) {
    return {
      metrics: {
        companiesCollectedToday: 0,
        enrichedLeads: 0,
        emailsFound: 0,
        painSignalsFound: 0,
        highPriorityLeads: 0,
        activeAgents: 0,
        registeredErrors: 0,
        averageConversionProbability: 0,
        averageExpectedConversion: 0,
        p1Leads: 0,
        callLeads: 0,
        visitLeads: 0,
        emailLeads: 0,
        nurtureLeads: 0,
      },
      agents: normalizeAgentRuns([]),
      events: [],
      recentLeads: [],
      topSources: [],
      topOpportunities: [],
      propensityDistribution: [],
      channelDistribution: [],
      campaignPriorityDistribution: [],
      hottestCompanies: [],
      warning: error instanceof Error ? error.message : "Nao foi possivel carregar o Command Center.",
    }
  }
}

export async function createAgentRun(input: {
  agentName: AgentName
  status?: AgentRunStatus
  currentTask?: string
  totalProcessed?: number
  totalSuccess?: number
  totalFailed?: number
  errorMessage?: string
}): Promise<AgentRunMutationResult> {
  const client = getProspectorSupabaseClient()
  if (!client.ok) return { ok: false, error: client.error.message }

  const { data, error } = await client.supabase
    .from("prospect_agent_runs")
    .insert({
      agent_name: input.agentName,
      status: input.status ?? "active",
      current_task: input.currentTask ?? null,
      started_at: new Date().toISOString(),
      total_processed: input.totalProcessed ?? 0,
      total_success: input.totalSuccess ?? 0,
      total_failed: input.totalFailed ?? 0,
      error_message: input.errorMessage ?? null,
    })
    .select("*")
    .single()

  return error ? { ok: false, error: error.message } : { ok: true, run: data as AgentRun }
}

export async function updateAgentRun(
  id: string,
  input: {
    status?: AgentRunStatus
    currentTask?: string
    totalProcessed?: number
    totalSuccess?: number
    totalFailed?: number
    errorMessage?: string
    finishedAt?: string | null
  },
): Promise<AgentRunMutationResult> {
  const client = getProspectorSupabaseClient()
  if (!client.ok) return { ok: false, error: client.error.message }

  const finishedAt = input.finishedAt === undefined && input.status && ["completed", "failed", "idle", "paused"].includes(input.status) ? new Date().toISOString() : input.finishedAt
  const { data, error } = await client.supabase
    .from("prospect_agent_runs")
    .update({
      status: input.status,
      current_task: input.currentTask,
      total_processed: input.totalProcessed,
      total_success: input.totalSuccess,
      total_failed: input.totalFailed,
      error_message: input.errorMessage,
      finished_at: finishedAt,
    })
    .eq("id", id)
    .select("*")
    .single()

  return error ? { ok: false, error: error.message } : { ok: true, run: data as AgentRun }
}

export async function createAgentEvent(input: {
  agentName: AgentName
  eventType: AgentEventType
  eventMessage?: string
  companyId?: string
  metadata?: Record<string, unknown>
}): Promise<AgentEventMutationResult> {
  const client = getProspectorSupabaseClient()
  if (!client.ok) return { ok: false, error: client.error.message }

  const metadata = input.metadata ?? {}
  const { data, error } = await client.supabase
    .from("prospect_agent_events")
    .insert({
      agent_name: input.agentName,
      event_type: input.eventType,
      event_message: input.eventMessage ?? eventMessage(input.agentName, input.eventType, metadata),
      company_id: input.companyId ?? null,
      metadata,
    })
    .select("*")
    .single()

  return error ? { ok: false, error: error.message } : { ok: true, event: data as AgentEvent }
}
