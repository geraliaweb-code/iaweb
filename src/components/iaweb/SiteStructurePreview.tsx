import { LayoutTemplate, MousePointerClick } from "lucide-react"

type SiteStructurePreviewProps = {
  structure: string[]
  packageName: string
}

export default function SiteStructurePreview({ structure, packageName }: SiteStructurePreviewProps) {
  return (
    <section className="rounded-[24px] border border-white/10 bg-white/[0.055] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.26)] backdrop-blur-2xl">
      <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-sky-100">
        <LayoutTemplate size={16} />
        Estrutura recomendada
      </div>
      <div className="space-y-3">
        {structure.map((item, index) => (
          <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-300/10 text-xs font-black text-cyan-100">
              {String(index + 1).padStart(2, "0")}
            </div>
            <span className="text-sm font-semibold text-slate-200">{item}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-2xl border border-cyan-200/15 bg-cyan-300/[0.07] p-4">
        <div className="mb-1 flex items-center gap-2 text-sm font-bold text-white">
          <MousePointerClick size={16} className="text-cyan-100" />
          Pacote recomendado
        </div>
        <p className="text-lg font-black tracking-[-0.03em] text-cyan-50">{packageName}</p>
      </div>
    </section>
  )
}
