import { ArrowRight, CheckCircle2, Layers3 } from "lucide-react"

type DemoRecommendedPlanProps = {
  packageName: string
  recommendations: string[]
}

export default function DemoRecommendedPlan({ packageName, recommendations }: DemoRecommendedPlanProps) {
  return (
    <section className="rounded-[26px] border border-cyan-200/15 bg-cyan-300/[0.055] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur-2xl sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-cyan-100">
            <Layers3 size={14} />
            Plano recomendado
          </div>
          <h2 className="mt-4 text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl">{packageName}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
            Proxima conversa sugerida: transformar a analise numa proposta objetiva, com prioridades e valor claro para
            o cliente.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4 lg:min-w-[18rem]">
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
