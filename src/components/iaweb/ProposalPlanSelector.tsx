import { CheckCircle2, Layers3 } from "lucide-react"

export type ProposalPlanKey = "homepage" | "website" | "sistema" | "growth"

export type ProposalPlan = {
  key: ProposalPlanKey
  name: string
  setupLabel: string
  monthlyLabel: string
  includes: string[]
}

export const proposalPlans: ProposalPlan[] = [
  {
    key: "homepage",
    name: "Homepage Premium",
    setupLabel: "desde EUR 299",
    monthlyLabel: "EUR 49-99",
    includes: ["Homepage premium", "WhatsApp", "Formulario", "SEO base", "Assistencia mensal basica"],
  },
  {
    key: "website",
    name: "Website Profissional",
    setupLabel: "EUR 799-1.200",
    monthlyLabel: "EUR 99-199",
    includes: ["Ate 5 paginas", "SEO base", "Formularios", "Google Maps", "Otimizacao mobile", "Suporte mensal"],
  },
  {
    key: "sistema",
    name: "Sistema Comercial",
    setupLabel: "EUR 1.500-2.500",
    monthlyLabel: "EUR 199-499",
    includes: ["Website", "CRM", "Funil comercial", "Automacoes", "Relatorio mensal", "Follow-up"],
  },
  {
    key: "growth",
    name: "IAWEB Growth Engine",
    setupLabel: "EUR 3.000-7.500+",
    monthlyLabel: "EUR 499-1.500+",
    includes: ["Website", "CRM", "Automacao", "Agentes IA", "Captacao de leads", "Relatorios PDF", "Funil comercial", "Acompanhamento estrategico"],
  },
]

type ProposalPlanSelectorProps = {
  selectedKey: ProposalPlanKey
  onChange: (plan: ProposalPlan) => void
}

export function getPlanByKey(key: string) {
  return proposalPlans.find((plan) => plan.key === key) ?? proposalPlans[1]
}

export function getPlanByName(name: string) {
  const normalized = name.toLowerCase()
  if (normalized.includes("growth")) return proposalPlans[3]
  if (normalized.includes("sistema")) return proposalPlans[2]
  if (normalized.includes("homepage")) return proposalPlans[0]
  return proposalPlans[1]
}

export default function ProposalPlanSelector({ selectedKey, onChange }: ProposalPlanSelectorProps) {
  return (
    <section className="rounded-[24px] border border-white/10 bg-white/[0.055] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.26)] backdrop-blur-2xl">
      <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-cyan-100">
        <Layers3 size={16} />
        Pacote recomendado
      </div>
      <div className="grid gap-3">
        {proposalPlans.map((plan) => {
          const selected = plan.key === selectedKey

          return (
            <button
              key={plan.key}
              type="button"
              onClick={() => onChange(plan)}
              className={`rounded-2xl border p-4 text-left transition ${
                selected
                  ? "border-cyan-200/35 bg-cyan-300/[0.12] shadow-[0_0_38px_rgba(34,211,238,0.1)]"
                  : "border-white/10 bg-black/20 hover:border-white/20 hover:bg-white/[0.06]"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-black tracking-[-0.02em] text-white">{plan.name}</div>
                  <div className="mt-1 text-xs font-semibold text-slate-400">
                    Setup {plan.setupLabel} · Mensal {plan.monthlyLabel}
                  </div>
                </div>
                {selected ? <CheckCircle2 size={18} className="text-emerald-300" /> : null}
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
