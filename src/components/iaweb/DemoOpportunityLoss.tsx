import { Euro, TrendingDown } from "lucide-react"

type DemoOpportunityLossProps = {
  niche: string
  lossRange: {
    min: number
    max: number
  }
  monthlyLoss: number
  reason: string
}

function formatEuro(value: number) {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value)
}

export default function DemoOpportunityLoss({ niche, lossRange, monthlyLoss, reason }: DemoOpportunityLossProps) {
  return (
    <section className="rounded-[26px] border border-amber-300/15 bg-amber-300/[0.06] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-2xl sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-amber-100">
            <TrendingDown size={14} />
            Perda mensal estimada
          </div>
          <h2 className="mt-4 text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl">
            {formatEuro(monthlyLoss)} / mes
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-amber-50/80">
            Para o nicho <strong className="text-white">{niche || "outro"}</strong>, a janela de perda usada nesta
            simulacao e de {formatEuro(lossRange.min)} a {formatEuro(lossRange.max)} por mes.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/25 p-4 text-sm leading-6 text-slate-300 lg:max-w-sm">
          <div className="mb-2 flex items-center gap-2 font-bold text-white">
            <Euro size={16} className="text-amber-200" />
            Leitura comercial
          </div>
          {reason}
        </div>
      </div>
    </section>
  )
}
