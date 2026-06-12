import Link from "next/link"
import { ArrowRight, Lock, ShieldCheck } from "lucide-react"
import type { UnlockedConstructionAnalysis } from "@/lib/construction/unlock-engine"

type UnlockedAnalysisPreviewProps = {
  analysis: UnlockedConstructionAnalysis
}

export default function UnlockedAnalysisPreview({ analysis }: UnlockedAnalysisPreviewProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950 text-white shadow-2xl shadow-slate-950/30">
      <div className="border-b border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.95),rgba(30,41,59,0.88),rgba(146,64,14,0.28))] p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-200">Unlock Engine</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              {analysis.accessLevel === "full_unlocked" ? "Analise completa desbloqueada" : "Previa gratuita da analise"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              {analysis.accessLevel === "full_unlocked"
                ? "Pode ver fornecedores, produtividade, benchmark, PDF completo e recomendacoes avancadas."
                : "A previa gratuita mostra apenas parte da analise para validar o potencial da obra."}
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm font-bold text-amber-100">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            {analysis.unlockedPercentage}% visivel
          </span>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1fr_0.82fr]">
        <div className="p-6 md:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <Metric label="Total visivel" value={formatEuro(analysis.totalVisibleCost)} />
            <Metric
              label="Estimativa completa"
              value={`${formatEuro(analysis.estimatedFullCostRange.min)} a ${formatEuro(analysis.estimatedFullCostRange.max)}`}
            />
          </div>

          <h3 className="mt-7 text-lg font-semibold">Especialidades visiveis</h3>
          <div className="mt-4 grid gap-3">
            {analysis.visibleSpecialties.map((item) => (
              <article key={`${item.specialty}-${item.itemName}`} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-200">{item.specialty}</p>
                    <h4 className="mt-2 font-semibold">{item.itemName}</h4>
                    <p className="mt-1 text-sm text-slate-400">
                      {item.quantity} {item.unit} - {item.materialName}
                    </p>
                  </div>
                  <p className="text-lg font-bold text-amber-100">{formatEuro(item.subtotal)}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="border-t border-white/10 bg-white/[0.03] p-6 md:p-8 lg:border-l lg:border-t-0">
          <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-5">
            <Lock className="h-6 w-6 text-amber-200" aria-hidden="true" />
            <h3 className="mt-4 text-xl font-semibold">{analysis.upgradeCTA.title}</h3>
            <p className="mt-3 text-sm leading-6 text-amber-50/85">{analysis.upgradeCTA.body}</p>
            <Link
              href={analysis.upgradeCTA.href}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-amber-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-200"
            >
              {analysis.upgradeCTA.label}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <h3 className="mt-7 text-lg font-semibold">Especialidades bloqueadas</h3>
          <div className="mt-4 grid gap-2">
            {analysis.lockedSpecialties.length ? (
              analysis.lockedSpecialties.map((item) => (
                <div key={`${item.specialty}-${item.itemName}`} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-950/55 px-4 py-3">
                  <span className="text-sm font-medium text-slate-300">{item.specialty}</span>
                  <Lock className="h-4 w-4 text-amber-200" aria-hidden="true" />
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm text-emerald-100">
                Todas as especialidades estao desbloqueadas.
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  )
}

function formatEuro(value: number) {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value)
}
