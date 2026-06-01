import { createClient } from "@supabase/supabase-js"
import { Activity, CheckCircle2, Cpu, Database, FileText, HeartPulse, MessageCircle, ShieldCheck, TriangleAlert, XCircle } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { createDiagnosticoPdf } from "@/app/diagnostico/pdf"
import { assertCrmAccess } from "@/lib/crm-auth"
import { calculateDiagnostico, type DiagnosticoFormData, type DiagnosticoResult } from "@/lib/diagnostico"
import { calculateFinanceImpact } from "@/lib/finance-impact"
import { generateSalesAgentMessages } from "@/lib/sales-agent"
import { generateWebsiteTransformation } from "@/lib/website-generator"
import OfficialLogo from "@/components/iaweb/OfficialLogo"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

type HealthStatus = "ok" | "attention" | "error"

type TestLeadRow = {
  id: string
  empresa: string | null
  email: string | null
  setor: string | null
  score_geral: number | null
  status: string | null
  impacto_financeiro: Record<string, unknown> | null
  homepage_gerada: Record<string, unknown> | null
  plano_recomendado: string | null
  score_projetado: number | null
  melhoria_prevista: number | null
  template_utilizado: string | null
  whatsapp_message: string | null
  email_subject: string | null
  email_body: string | null
  followup_3d: string | null
  followup_7d: string | null
  followup_15d: string | null
  objection_responses: Record<string, string> | null
  post_proposal_message: string | null
  post_meeting_message: string | null
  sales_agent_status: string | null
}

type SupabaseSnapshot = {
  configured: boolean
  error?: string
  leads: TestLeadRow[]
}

const sampleLead: DiagnosticoFormData = {
  nome: "Miguel Teste",
  empresa: "Empresa Teste IAWEB",
  email: "teste@iaweb.pt",
  whatsapp: "+351910000000",
  website: "https://empresa-teste.pt",
  setor: "clinicas",
  objetivo: "Aumentar marcacoes",
}

async function getSupabaseSnapshot(): Promise<SupabaseSnapshot> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    return {
      configured: false,
      error: "Supabase nao configurado neste ambiente.",
      leads: [],
    }
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  const { data, error } = await supabase
    .from("diagnosticos")
    .select(
      "id,empresa,email,setor,score_geral,status,impacto_financeiro,homepage_gerada,plano_recomendado,score_projetado,melhoria_prevista,template_utilizado,whatsapp_message,email_subject,email_body,followup_3d,followup_7d,followup_15d,objection_responses,post_proposal_message,post_meeting_message,sales_agent_status",
    )
    .like("email", "teste+%@iaweb.pt")
    .order("created_at", { ascending: false })

  if (error) {
    return {
      configured: true,
      error: error.message,
      leads: [],
    }
  }

  return {
    configured: true,
    leads: (data ?? []) as TestLeadRow[],
  }
}

function getStatus(ok: boolean, hasData = true): HealthStatus {
  if (ok) return "ok"
  return hasData ? "error" : "attention"
}

function statusClass(status: HealthStatus) {
  if (status === "ok") return "border-emerald-300/25 bg-emerald-300/10 text-emerald-100"
  if (status === "attention") return "border-[#FFB800]/30 bg-[#FFB800]/10 text-[#FFE3A3]"
  return "border-rose-300/25 bg-rose-300/10 text-rose-100"
}

function statusIcon(status: HealthStatus) {
  if (status === "ok") return CheckCircle2
  if (status === "attention") return TriangleAlert
  return XCircle
}

function countMessages(leads: TestLeadRow[]) {
  return leads.reduce((sum, lead) => {
    const objectionCount = Object.keys(lead.objection_responses ?? {}).length
    return (
      sum +
      [
        lead.whatsapp_message,
        lead.email_body,
        lead.followup_3d,
        lead.followup_7d,
        lead.followup_15d,
        lead.post_proposal_message,
        lead.post_meeting_message,
      ].filter(Boolean).length +
      objectionCount
    )
  }, 0)
}

function runLocalValidations() {
  const diagnostic = calculateDiagnostico(sampleLead)
  const result: DiagnosticoResult = {
    ...diagnostic,
    createdAt: new Date().toISOString(),
  }
  const homepage = generateWebsiteTransformation({
    company: sampleLead.empresa,
    niche: sampleLead.setor,
    objective: sampleLead.objetivo,
    website: sampleLead.website,
    currentScore: result.scoreFinal,
  })
  const finance = calculateFinanceImpact({
    niche: sampleLead.setor,
    packageName: homepage.homepage.packageName,
    score: result.scoreFinal,
  })
  const salesAgent = generateSalesAgentMessages({
    company: sampleLead.empresa,
    contactName: sampleLead.nome,
    niche: sampleLead.setor,
    currentScore: result.scoreFinal,
    projectedScore: homepage.projection.projectedScore,
    improvementPoints: homepage.projection.improvementPoints,
    financialImpact: finance,
    recommendedPlan: homepage.homepage.packageName,
    generatedHomepage: homepage.homepage,
    templateUsed: homepage.homepage.templateId,
    problems: [result.classificacao.message],
    opportunities: result.recomendacoes,
  })
  const pdf = createDiagnosticoPdf({ formData: sampleLead, result })

  return {
    diagnosticOk: result.scoreFinal > 0 && result.recomendacoes.length > 0,
    financeOk: finance.lostRevenueMonthly.max > 0 && finance.lostRevenueAnnual.max > 0,
    homepageOk: Boolean(homepage.homepage.copy.headline && homepage.projection.projectedScore > result.scoreFinal),
    proposalOk: Boolean(homepage.homepage.packageName && finance.potentialRoi.max > 0),
    whatsappOk: salesAgent.whatsappMessage.length > 40,
    emailOk: salesAgent.emailSubject.length > 5 && salesAgent.emailBody.length > 80,
    followupOk: Boolean(salesAgent.followup3d && salesAgent.followup7d && salesAgent.followup15d),
    pdfOk: typeof pdf.getNumberOfPages === "function" ? pdf.getNumberOfPages() >= 7 : true,
    salesAgentOk: Object.keys(salesAgent.objectionResponses).length >= 6,
  }
}

function MetricCard({ label, value, icon: Icon }: { label: string; value: string; icon: LucideIcon }) {
  return (
    <div className="iaweb-premium-card rounded-2xl p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">{label}</p>
        <Icon size={19} className="text-[#3AB8FF]" />
      </div>
      <p className="mt-3 text-4xl font-black tracking-[-0.05em] text-white">{value}</p>
    </div>
  )
}

function ValidationCard({ label, status, detail }: { label: string; status: HealthStatus; detail: string }) {
  const Icon = statusIcon(status)

  return (
    <div className={`rounded-2xl border p-4 shadow-[0_0_28px_rgba(0,163,255,0.08)] ${statusClass(status)}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-black uppercase tracking-[0.14em]">{label}</p>
        <Icon size={18} />
      </div>
      <p className="mt-2 text-sm leading-6 opacity-80">{detail}</p>
    </div>
  )
}

export default async function AdminTestesPage() {
  const access = await assertCrmAccess()

  if (!access.ok) {
    redirect("/crm/login")
  }

  const snapshot = await getSupabaseSnapshot()
  const validations = runLocalValidations()
  const leads = snapshot.leads
  const totalHomepages = leads.filter((lead) => lead.homepage_gerada && Object.keys(lead.homepage_gerada).length > 0).length
  const totalPropostas = leads.filter((lead) => ["proposta", "negociacao", "fechado"].includes(lead.status ?? "")).length
  const totalMessages = countMessages(leads)
  const crmOk = snapshot.configured && !snapshot.error
  const seedOk = leads.length >= 20

  const checklist = [
    ["Diagnostico", validations.diagnosticOk, "Motor local calculou score e recomendacoes."],
    ["Impacto Financeiro", validations.financeOk, "Potencial mensal e anual calculados."],
    ["Homepage", validations.homepageOk, "Website Generator gerou copy e score projetado."],
    ["Proposta", validations.proposalOk, "Plano recomendado e ROI disponiveis."],
    ["CRM", crmOk && seedOk, snapshot.error ?? `${leads.length}/20 leads ficticias encontradas.`],
    ["WhatsApp", validations.whatsappOk && totalMessages > 0, "Mensagem inicial gerada para testes."],
    ["Email", validations.emailOk && totalMessages > 0, "Assunto e corpo de email gerados."],
    ["Follow-up", validations.followupOk && totalMessages > 0, "Follow-ups 3d, 7d e 15d disponiveis."],
    ["PDF", validations.pdfOk, "Relatorio executivo multipagina gerado localmente."],
  ] as const

  const health = [
    ["CRM", getStatus(crmOk && seedOk, snapshot.configured), snapshot.error ?? "Leitura de leads ficticias."],
    ["Diagnostico", getStatus(validations.diagnosticOk), "Motor de diagnostico operacional."],
    ["Website Generator", getStatus(validations.homepageOk), "Homepage, template e score projetado operacionais."],
    ["PDF", getStatus(validations.pdfOk), "PDF executivo gera documento multipagina."],
    ["Agente Comercial", getStatus(validations.salesAgentOk), "Mensagens e objecoes geradas."],
    ["Supabase", getStatus(crmOk, snapshot.configured), snapshot.error ?? "Conexao e query de teste executadas."],
  ] as const

  return (
    <main className="iaweb-cinematic-shell px-4 py-8 sm:px-6 lg:px-8">
      <div className="iaweb-cinematic-bg">
        <div className="iaweb-cinematic-grid" />
        <div className="iaweb-lightning top-[16%] left-[-10%]" />
        <div className="iaweb-lightning" />
        <div className="iaweb-lightning" />
        <div className="iaweb-lightning-field" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-6">
        <header className="iaweb-premium-card rounded-2xl p-6">
          <OfficialLogo compact className="mb-5 max-w-[190px]" />
          <p className="inline-flex items-center gap-2 rounded-full border border-[#00A3FF]/30 bg-[#007BFF]/15 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[#BFEAFF]">
            <HeartPulse size={14} />
            Ambiente de testes IAWEB
          </p>
          <h1 className="iaweb-hero-title mt-4 text-4xl font-black text-white md:text-6xl">
            Mission <span className="iaweb-glow-text">Control</span>
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
            Painel interno para validar CRM, diagnostico, nichos, impacto financeiro, website generator, PDF, agente
            comercial e pipeline sem usar clientes reais.
          </p>
        </header>

        <section className="grid gap-3 md:grid-cols-5">
          <MetricCard label="Total Leads" value={String(leads.length)} icon={Database} />
          <MetricCard label="Diagnosticos" value={String(leads.filter((lead) => (lead.score_geral ?? 0) > 0).length)} icon={HeartPulse} />
          <MetricCard label="Homepages" value={String(totalHomepages)} icon={FileText} />
          <MetricCard label="Propostas" value={String(totalPropostas)} icon={CheckCircle2} />
          <MetricCard label="Mensagens" value={String(totalMessages)} icon={MessageCircle} />
        </section>

        <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr_0.9fr]">
          <div className="iaweb-premium-card rounded-2xl p-5">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#3AB8FF]">
              <ShieldCheck size={15} />
              Estado da plataforma
            </p>
            <div className="mt-5 flex items-center gap-5">
              <div className="iaweb-orbit grid size-24 place-items-center">
                <span className="text-3xl font-black text-white">{health.filter(([, status]) => status === "ok").length}</span>
              </div>
              <p className="text-sm leading-6 text-slate-400">motores em estado operacional dentro das validacoes locais e Supabase.</p>
            </div>
          </div>
          <div className="iaweb-premium-card rounded-2xl p-5">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#FFB800]">
              <Cpu size={15} />
              Motores ativos
            </p>
            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              {["Diagnostico", "Impacto", "Website", "PDF", "CRM", "Agente"].map((engine) => (
                <div key={engine} className="rounded-xl border border-[#00A3FF]/20 bg-[#00A3FF]/10 p-3">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-[#BFEAFF]">{engine}</p>
                  <div className="mt-3 h-1.5 rounded-full bg-gradient-to-r from-[#00A3FF] to-[#FFB800]" />
                </div>
              ))}
            </div>
          </div>
          <div className="iaweb-premium-card rounded-2xl p-5">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#3AB8FF]">
              <Activity size={15} />
              Validacoes em tempo real
            </p>
            <div className="mt-5 space-y-3">
              {checklist.slice(0, 5).map(([label, ok]) => (
                <div key={label}>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{label}</span>
                    <span className={ok ? "text-emerald-300" : "text-[#FFB800]"}>{ok ? "OK" : "ATENCAO"}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className={`h-full rounded-full ${ok ? "w-full bg-emerald-300" : "w-2/3 bg-[#FFB800]"}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {!snapshot.configured || snapshot.error ? (
          <section className="rounded-2xl border border-[#FFB800]/30 bg-[#FFB800]/10 p-5 text-[#FFE3A3]">
            <p className="font-black">Atencao Supabase</p>
            <p className="mt-2 text-sm leading-6">
              {snapshot.error ?? "Supabase nao esta configurado."} Execute as migrations e o seed para ver os dados reais
              neste painel.
            </p>
          </section>
        ) : null}

        <section className="iaweb-premium-card rounded-2xl p-5">
          <h2 className="text-2xl font-black tracking-[-0.04em] text-white">Checklist de teste</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {checklist.map(([label, ok, detail]) => (
              <ValidationCard key={label} label={label} status={getStatus(ok, snapshot.configured)} detail={detail} />
            ))}
          </div>
        </section>

        <section className="iaweb-premium-card rounded-2xl p-5">
          <h2 className="text-2xl font-black tracking-[-0.04em] text-white">Saude da Plataforma</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {health.map(([label, status, detail]) => (
              <ValidationCard key={label} label={label} status={status} detail={detail} />
            ))}
          </div>
        </section>

        <section className="iaweb-premium-card rounded-2xl p-5">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <h2 className="text-2xl font-black tracking-[-0.04em] text-white">Leads ficticias carregadas</h2>
              <p className="mt-2 text-sm text-slate-400">Emails com prefixo teste+ e dominio iaweb.pt.</p>
            </div>
            <span className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.14em] ${statusClass(seedOk ? "ok" : "attention")}`}>
              {seedOk ? "Seed completo" : "Seed pendente"}
            </span>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.14em] text-slate-500">
                <tr>
                  <th className="border-b border-white/10 py-3">Empresa</th>
                  <th className="border-b border-white/10 py-3">Nicho</th>
                  <th className="border-b border-white/10 py-3">Score</th>
                  <th className="border-b border-white/10 py-3">Projetado</th>
                  <th className="border-b border-white/10 py-3">Template</th>
                  <th className="border-b border-white/10 py-3">Status</th>
                  <th className="border-b border-white/10 py-3">Agente</th>
                </tr>
              </thead>
              <tbody>
                {leads.slice(0, 20).map((lead) => (
                  <tr key={lead.id} className="text-slate-300">
                    <td className="border-b border-white/5 py-3 font-semibold text-white">{lead.empresa}</td>
                    <td className="border-b border-white/5 py-3">{lead.setor}</td>
                    <td className="border-b border-white/5 py-3">{lead.score_geral}/100</td>
                    <td className="border-b border-white/5 py-3">{lead.score_projetado || "--"}/100</td>
                    <td className="border-b border-white/5 py-3">{lead.template_utilizado || "--"}</td>
                    <td className="border-b border-white/5 py-3">{lead.status}</td>
                    <td className="border-b border-white/5 py-3">{lead.sales_agent_status || "pendente"}</td>
                  </tr>
                ))}
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">
                      Sem leads ficticias carregadas. Execute supabase/test_seed_iaweb.sql.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}
