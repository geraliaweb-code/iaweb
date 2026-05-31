import { CheckCircle2, Palette } from "lucide-react"

export type SitePalette = {
  name: string
  colors: string[]
  labels: string[]
}

type SitePaletteSelectorProps = {
  palette: SitePalette
}

export default function SitePaletteSelector({ palette }: SitePaletteSelectorProps) {
  return (
    <section className="rounded-[24px] border border-white/10 bg-white/[0.055] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.26)] backdrop-blur-2xl">
      <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-cyan-100">
        <Palette size={16} />
        Paleta recomendada
      </div>
      <h2 className="text-xl font-black tracking-[-0.03em] text-white">{palette.name}</h2>
      <div className="mt-5 grid grid-cols-3 gap-3">
        {palette.colors.map((color, index) => (
          <div key={`${color}-${palette.labels[index]}`} className="rounded-2xl border border-white/10 bg-black/20 p-3">
            <div className="h-16 rounded-xl border border-white/10" style={{ background: color }} />
            <div className="mt-3 flex items-center gap-2 text-xs font-bold text-slate-300">
              <CheckCircle2 size={14} className="text-emerald-300" />
              {palette.labels[index]}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
