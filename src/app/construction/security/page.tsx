import type { Metadata } from "next"
import ConstructionShell from "@/components/construction/ConstructionShell"

export const metadata: Metadata = { title: "Security Construction | IAWEB" }

export default function ConstructionSecurityPage() {
  const seals = ["IA Especializada em Construcao", "Benchmark Europeu", "Portugal - Franca - Espanha", "Dados Protegidos RGPD", "Infraestrutura Segura", "Relatorios Executivos IA", "Analise Multidocumento", "Construction Intelligence Platform", "Desenvolvido na Uniao Europeia", "Preparado para mercado europeu"]
  return (
    <ConstructionShell>
      <section className="py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-200">Trust Center</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">Seguranca e confianca</h1>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {seals.map((seal) => (
            <div key={seal} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm font-semibold text-slate-100">
              {seal}
            </div>
          ))}
        </div>
      </section>
    </ConstructionShell>
  )
}
