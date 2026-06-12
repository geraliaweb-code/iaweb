import { getConstructionSupabaseClient } from "./db"

export type ConstructionAgentStatus = "active" | "scheduled" | "standby"

export type ConstructionAgentNode = {
  code: string
  label: string
  week: string
  status: ConstructionAgentStatus
  role: string
}

export type ConstructionAgentProposal = {
  id: string
  source: string
  country: "PT" | "FR" | "ES"
  status: string
  auditScore: number
  value: string
  updatedAt: string
}

export type ConstructionAgentLog = {
  id: string
  agent: string
  stage: string
  message: string
  createdAt: string
}

export type ConstructionAgentRuntime = {
  online: boolean
  endpoint: string | null
  activeAgents: string[]
  automaticCyclesEnabled: boolean
}

export const constructionAgentActivation: ConstructionAgentNode[] = [
  { code: "agent_pt", label: "Agent PT", week: "Semana 1", status: "active", role: "Ingestao de propostas portuguesas" },
  { code: "normalizer", label: "Normalizer", week: "Semana 1", status: "active", role: "Aliases, dicionarios, regras e fallback LLM condicionado" },
  { code: "auditor", label: "Auditor", week: "Semana 1", status: "active", role: "Confianca, anomalias e score minimo" },
  { code: "supervisor", label: "Supervisor", week: "Semana 1", status: "active", role: "Encaminha para aprovacao Diego/Governor" },
  { code: "director", label: "Director", week: "Semana 2", status: "scheduled", role: "Coordenacao multi-agente apos estabilizacao" },
  { code: "agent_fr", label: "Agent FR", week: "Semana 3", status: "scheduled", role: "Ingestao francesa depois da base PT" },
  { code: "datamoat_agent", label: "DataMoat Agent", week: "Semana 4", status: "scheduled", role: "Publicacao apenas apos aprovacao Governor" },
  { code: "agent_es", label: "Agent ES", week: "Standby", status: "standby", role: "Sem ativacao no Sprint 45" },
]

export const constructionAgentQualityGates = [
  "Ciclos automaticos desativados",
  "Semana 1 limitada a Agent PT, Normalizer, Auditor e Supervisor",
  "Normalizacao deterministica antes de qualquer fallback LLM",
  "Telegram Diego obrigatorio antes de Governor Approval",
  "DataMoat Agent bloqueado ate Semana 4 e aprovacao Governor",
  "Agent ES em standby total",
]

const fallbackProposals: ConstructionAgentProposal[] = [
  {
    id: "PT-REAL-SAMPLE-001",
    source: "fornecedor_pt_demo",
    country: "PT",
    status: "waiting_governor_approval",
    auditScore: 88,
    value: "EUR 5.874,50",
    updatedAt: "Sprint 45 seed",
  },
]

const fallbackLogs: ConstructionAgentLog[] = [
  { id: "1", agent: "agent_pt", stage: "ingest", message: "Proposta PT realista recebida", createdAt: "seed" },
  { id: "2", agent: "normalizer", stage: "normalize", message: "Betao C25/30, Aco A500 e Reboco normalizados por alias/regra", createdAt: "seed" },
  { id: "3", agent: "auditor", stage: "audit", message: "Score 88 sem fallback LLM", createdAt: "seed" },
  { id: "4", agent: "supervisor", stage: "telegram", message: "Aguardando aprovacao Diego/Governor", createdAt: "seed" },
]

export async function getConstructionAgentNetworkSnapshot() {
  const runtime = await getConstructionAgentRuntime()
  const client = getConstructionSupabaseClient()

  if (!client.ok) {
    return {
      proposals: fallbackProposals,
      logs: fallbackLogs,
      runtime,
      warning: runtime.online ? null : "Supabase nao configurado. A mostrar seed operacional Sprint 45.",
    }
  }

  const [proposalsResult, logsResult] = await Promise.all([
    client.supabase
      .from("agent_proposals")
      .select("id,country,status,audit_score,updated_at,raw_payload,agent_sources(source_name)")
      .order("updated_at", { ascending: false })
      .limit(8),
    client.supabase
      .from("agent_logs")
      .select("id,agent_code,stage,message,created_at")
      .order("created_at", { ascending: false })
      .limit(8),
  ])

  const proposals: ConstructionAgentProposal[] = (proposalsResult.data ?? []).map((proposal: any) => ({
    id: proposal.id,
    source: proposal.agent_sources?.source_name ?? proposal.raw_payload?.source_name ?? "agent_source",
    country: proposal.country,
    status: proposal.status,
    auditScore: proposal.audit_score ?? 0,
    value: proposal.raw_payload?.total_value ?? "pendente",
    updatedAt: proposal.updated_at,
  }))

  const logs: ConstructionAgentLog[] = (logsResult.data ?? []).map((log: any) => ({
    id: String(log.id),
    agent: log.agent_code,
    stage: log.stage,
    message: log.message,
    createdAt: log.created_at,
  }))

  return {
    proposals: proposals.length ? proposals : fallbackProposals,
    logs: logs.length ? logs : fallbackLogs,
    runtime,
    warning: runtime.online ? null : proposalsResult.error?.message ?? logsResult.error?.message ?? null,
  }
}

async function getConstructionAgentRuntime(): Promise<ConstructionAgentRuntime> {
  const endpoint = process.env.AGENT_NETWORK_API_URL ?? "http://65.21.53.147:8045"

  try {
    const response = await fetch(`${endpoint}/health`, { cache: "no-store", signal: AbortSignal.timeout(3000) })

    if (!response.ok) {
      return { online: false, endpoint, activeAgents: [], automaticCyclesEnabled: false }
    }

    const health = await response.json()
    return {
      online: health.status === "ok",
      endpoint,
      activeAgents: Array.isArray(health.active_agents) ? health.active_agents : [],
      automaticCyclesEnabled: health.automatic_cycles_enabled === true,
    }
  } catch {
    return { online: false, endpoint, activeAgents: [], automaticCyclesEnabled: false }
  }
}
