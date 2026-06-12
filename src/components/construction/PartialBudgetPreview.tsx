import Link from "next/link"
import { ArrowRight, Lock, ShieldCheck } from "lucide-react"
import { constructionProjectTypeLabels } from "@/lib/construction/constants"
import type { ConstructionHealthCheckResult, ConstructionProject } from "@/lib/construction/types"

type PartialBudgetPreviewProps = {
  project: ConstructionProject
  healthCheck: ConstructionHealthCheckResult | null
}

const lockedItems = [
  "Orcamento completo",
  "Custos por especialidade",
  "Materiais detalhados",
  "Marcas",
  "Fornecedores",
  "Equipamentos",
  "Mao de obra completa",
  "Produtividade",
  "Benchmark Europeu",
  "PDF Executivo",
  "Construction Copilot completo",
  "Recomendacoes tecnicas",
  "Proximos passos",
  "Knowledge Vault avancado",
]

const visibleBudgetExamples = [
  {
    title: "Estruturas",
    lines: [
      ["Betao C30/37", "120 m3"],
      ["Material", "14.000 EUR"],
      ["Bombagem", "2.000 EUR"],
      ["Mao de obra", "6.000 EUR"],
    ],
    total: "22.000 EUR",
  },
  {
    title: "Pintura interior",
    lines: [
      ["Area", "1.000 m2"],
      ["Tinta", "CIN VinylMatt ou equivalente"],
      ["Quantidade", "180 litros"],
      ["Material", "1.850 EUR"],
      ["Mao de obra", "2.400 EUR"],
      ["Equipamentos", "250 EUR"],
    ],
    total: "4.500 EUR",
  },
]

export default function PartialBudgetPreview({ project, healthCheck }: PartialBudgetPreviewProps) {
  const hasAnalysis = Boolean(healthCheck)
  const cost = healthCheck?.costEstimate
  const schedule = healthCheck?.scheduleEstimate
  const documentsIdentified = healthCheck?.identifiedSpecialties.length
    ? healthCheck.identifiedSpecialties.join(", ")
    : healthCheck?.documentsFound
      ? `${healthCheck.documentsFound} documentos classificados`
      : "Disponivel apos upload e Document Intelligence"
  const missingDocuments = healthCheck?.missingCriticalDocuments.length
    ? healthCheck.missingCriticalDocuments.slice(0, 4).join(", ")
    : hasAnalysis
      ? "Sem faltas criticas na amostra parcial"
      : "Disponivel apos Health Check"

  return (
    <section className="mt-6 rounded-lg border border-amber-200 bg-white p-6 shadow-sm md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Analise gratuita parcial</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
            Veja uma amostra realista de 20%-30% antes de desbloquear a analise completa.
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Dados indicativos de mercado por faixas. Nunca prometemos preco exato sem validacao tecnica, fornecedores e medicoes completas.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          Amostra desbloqueada
        </span>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <PreviewMetric label="Tipo de obra" value={constructionProjectTypeLabels[project.project_type]} />
        <PreviewMetric label="Area" value={project.estimated_area_m2 ? `${project.estimated_area_m2} m2` : "Por definir"} />
        <PreviewMetric label="Maturity Score" value={`${healthCheck?.maturityScore ?? project.maturity_score ?? 0}/100`} />
        <PreviewMetric label="Risk Score" value={`${healthCheck?.riskScore ?? project.risk_score ?? 0}/100`} />
        <PreviewMetric label="Confidence Score" value={`${healthCheck?.confidenceScore ?? project.confidence_score ?? 0}/100`} />
        <PreviewMetric
          label="Prazo preliminar"
          value={schedule ? `${schedule.estimatedMonthsMin} a ${schedule.estimatedMonthsMax} meses` : "A gerar"}
        />
        <PreviewMetric
          label="Orcamento preliminar"
          value={cost ? `${formatEuro(cost.estimatedCostMin)} a ${formatEuro(cost.estimatedCostMax)}` : "A gerar"}
        />
        <PreviewMetric label="Documentos identificados" value={documentsIdentified} />
      </div>

      <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Documentos em falta</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-950">{missingDocuments}</p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {visibleBudgetExamples.map((example) => (
          <article key={example.title} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">{example.title}</p>
            <div className="mt-4 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
              {example.lines.map(([label, value]) => (
                <div key={`${example.title}-${label}`} className="grid grid-cols-[0.9fr_1.1fr] gap-3 px-4 py-3 text-sm">
                  <span className="font-medium text-slate-500">{label}</span>
                  <span className="font-semibold text-slate-950">{value}</span>
                </div>
              ))}
              <div className="grid grid-cols-[0.9fr_1.1fr] gap-3 bg-amber-50 px-4 py-3 text-sm">
                <span className="font-bold text-amber-800">Total</span>
                <span className="font-bold text-slate-950">{example.total}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-slate-950 text-white">
        <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="p-5 md:p-6">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-amber-400 text-slate-950">
              <Lock className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">Desbloquear Analise Completa</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Aceda ao orcamento completo por material, mao de obra, fornecedor, benchmark europeu, PDF executivo e recomendacoes da IA.
            </p>
            <Link
              href="/construction/billing"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-amber-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-300"
            >
              Desbloquear Analise Completa
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="relative border-t border-white/10 p-5 md:p-6 lg:border-l lg:border-t-0">
            <div className="absolute inset-0 bg-slate-950/30 backdrop-blur-[2px]" />
            <div className="relative grid gap-2 sm:grid-cols-2">
              {lockedItems.map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300">
                  <Lock className="h-3.5 w-3.5 shrink-0 text-amber-300" aria-hidden="true" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function PreviewMetric({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold leading-5 text-slate-950">{value}</p>
    </article>
  )
}

function formatEuro(value: number) {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value)
}
