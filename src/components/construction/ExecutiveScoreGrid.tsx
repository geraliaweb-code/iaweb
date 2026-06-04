import { BarChart3, BrainCircuit, Gauge, ShieldAlert } from "lucide-react"

export type ExecutiveScore = {
  label: string
  value: number | null
  helper: string
  tone: "navy" | "gold" | "slate" | "blue"
}

type ExecutiveScoreGridProps = {
  scores: ExecutiveScore[]
  hasAnalysis: boolean
}

const icons = {
  "Maturity Score": Gauge,
  "Risk Score": ShieldAlert,
  "Complexity Score": BarChart3,
  "Confidence Score": BrainCircuit,
}

const barTones: Record<ExecutiveScore["tone"], string> = {
  navy: "bg-slate-900",
  gold: "bg-amber-500",
  slate: "bg-slate-500",
  blue: "bg-sky-800",
}

export default function ExecutiveScoreGrid({ scores, hasAnalysis }: ExecutiveScoreGridProps) {
  return (
    <section className="grid gap-4 lg:grid-cols-4">
      {scores.map((score) => {
        const Icon = icons[score.label as keyof typeof icons] ?? Gauge
        const value = hasAnalysis ? score.value ?? 0 : null
        const width = value === null ? 0 : Math.max(4, Math.min(100, value))

        return (
          <article key={score.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{score.label}</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                  {value === null ? "Pendente" : value}
                  {value === null ? null : <span className="text-base text-slate-400">/100</span>}
                </p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-800">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className={`h-full rounded-full ${barTones[score.tone]}`} style={{ width: `${width}%` }} />
            </div>
            <p className="mt-3 text-sm leading-5 text-slate-600">{score.helper}</p>
          </article>
        )
      })}
    </section>
  )
}
