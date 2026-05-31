import { Activity, BarChart3 } from "lucide-react"

type DemoScoreCardProps = {
  score: number
  scores: Array<{
    label: string
    value: number
  }>
}

function getScoreLabel(score: number) {
  if (score < 45) return "Presenca digital critica"
  if (score < 70) return "Base comercial incompleta"
  if (score < 84) return "Boa base para escalar"
  return "Sistema pronto para crescer"
}

function getBarColor(score: number) {
  if (score < 45) return "from-[#FFB800] to-orange-500"
  if (score < 70) return "from-[#00A3FF] to-[#007BFF]"
  return "from-emerald-400 to-[#3AB8FF]"
}

export default function DemoScoreCard({ score, scores }: DemoScoreCardProps) {
  return (
    <section className="demo-premium-card rounded-[26px] border border-[#00A3FF]/35 bg-[#050816]/80 p-5 shadow-[0_26px_90px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00A3FF]/35 bg-[#007BFF]/15 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-[#BFEAFF]">
            <Activity size={14} />
            Score comercial
          </div>
          <h2 className="mt-4 text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl">{getScoreLabel(score)}</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
            Leitura rapida para abrir a conversa com clareza: onde a empresa perde oportunidades e qual sistema deve
            entrar primeiro.
          </p>
        </div>

        <div
          className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full border border-[#00A3FF]/35 bg-[#00A3FF]/10 shadow-[0_0_70px_rgba(0,163,255,0.28)] [animation:demo-pulse-glow_3.2s_ease-in-out_infinite]"
          style={{ background: `conic-gradient(#00A3FF ${score * 3.6}deg, rgba(255,184,0,0.95) ${Math.max(score * 3.6, 18)}deg, rgba(255,255,255,0.08) 0deg)` }}
        >
          <div className="absolute inset-3 rounded-full border border-white/10 bg-[#050816]/95 shadow-[inset_0_0_28px_rgba(0,163,255,0.22)]" />
          <div className="relative text-center">
            <div className="text-5xl font-black tracking-[-0.06em] text-white">{score}</div>
            <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-100">/100</div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {scores.map((item) => (
          <div key={item.label} className="demo-premium-card rounded-2xl border border-[#00A3FF]/20 bg-black/25 p-4">
            <div className="mb-3 flex items-center justify-between gap-3 text-sm">
              <span className="inline-flex items-center gap-2 font-bold text-slate-200">
                <BarChart3 size={15} className="text-[#3AB8FF]" />
                {item.label}
              </span>
              <span className="font-black text-white">{item.value}/100</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
              <div className={`h-full rounded-full bg-gradient-to-r ${getBarColor(item.value)} transition-[width] duration-700 ease-out`} style={{ width: `${item.value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
