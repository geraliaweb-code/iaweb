import { ArrowRight, CheckCircle2, Layers3 } from "lucide-react"

type DemoRecommendedPlanProps = {
  packageName: string
  recommendations: string[]
}

export default function DemoRecommendedPlan({ packageName, recommendations }: DemoRecommendedPlanProps) {
  return (
    <section className="demo-premium-card demo-blue-glow rounded-[26px] border border-[#00A3FF]/35 bg-[#050816]/85 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur-2xl sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#FFB800]/35 bg-[#FFB800]/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[#FFE3A3]">
            Recomendacao IAWEB
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00A3FF]/25 bg-[#00A3FF]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-cyan-100">
            <Layers3 size={14} />
            Plano recomendado
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-white sm:text-4xl">{packageName}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
            Proxima conversa sugerida: transformar a analise numa proposta objetiva, com prioridades e valor claro para
            o cliente.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#007BFF] via-[#00A3FF] to-[#FFB800] px-5 py-3 text-sm font-black text-white shadow-[0_0_34px_rgba(0,163,255,0.25)]">
            Preparar proposta premium
            <ArrowRight size={16} />
          </div>
        </div>

        <div className="rounded-2xl border border-[#00A3FF]/20 bg-black/25 p-4 lg:min-w-[18rem]">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
            <ArrowRight size={16} className="text-cyan-100" />
            Prioridades praticas
          </div>
          <ul className="space-y-3">
            {recommendations.map((recommendation) => (
              <li key={recommendation} className="flex gap-3 text-sm leading-6 text-slate-300">
                <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-300" />
                <span>{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
