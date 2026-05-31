import { Banknote, CalendarClock } from "lucide-react"

type ProposalInvestmentCardProps = {
  setupValue: string
  monthlyValue: string
  onSetupChange: (value: string) => void
  onMonthlyChange: (value: string) => void
}

export default function ProposalInvestmentCard({
  setupValue,
  monthlyValue,
  onSetupChange,
  onMonthlyChange,
}: ProposalInvestmentCardProps) {
  return (
    <section className="rounded-[24px] border border-amber-300/15 bg-amber-300/[0.06] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.26)] backdrop-blur-2xl">
      <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-amber-100">
        <Banknote size={16} />
        Investimento
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="flex items-center gap-2 text-sm font-bold text-slate-300">
            <Banknote size={15} className="text-amber-200" />
            Valor setup
          </span>
          <input
            value={setupValue}
            onChange={(event) => onSetupChange(event.target.value)}
            className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-black/25 px-4 text-sm font-bold text-white outline-none transition focus:border-amber-200/40 focus:ring-4 focus:ring-amber-300/10"
          />
        </label>
        <label className="block">
          <span className="flex items-center gap-2 text-sm font-bold text-slate-300">
            <CalendarClock size={15} className="text-amber-200" />
            Valor mensal
          </span>
          <input
            value={monthlyValue}
            onChange={(event) => onMonthlyChange(event.target.value)}
            className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-black/25 px-4 text-sm font-bold text-white outline-none transition focus:border-amber-200/40 focus:ring-4 focus:ring-amber-300/10"
          />
        </label>
      </div>
    </section>
  )
}
