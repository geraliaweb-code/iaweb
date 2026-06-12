"use client"

import { Lock } from "lucide-react"
import type { ConstructionCostBreakdownLine } from "@/lib/construction/cost-engine-v2"

type LockedSpecialtiesPanelProps = {
  lockedSpecialties: ConstructionCostBreakdownLine[]
}

const fallbackLockedSpecialties = ["ETICS", "AVAC", "Cobertura", "Pavimentos", "Carpintarias", "ITED", "SCIE"]

export default function LockedSpecialtiesPanel({ lockedSpecialties }: LockedSpecialtiesPanelProps) {
  const labels = Array.from(new Set([...lockedSpecialties.map((item) => item.specialty), ...fallbackLockedSpecialties])).slice(0, 7)

  return (
    <article className="rounded-2xl border border-amber-200/20 bg-[linear-gradient(145deg,rgba(251,191,36,0.11),rgba(15,23,42,0.72))] p-5 backdrop-blur">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-100">Analise completa</p>
      <h3 className="mt-2 text-xl font-semibold text-white">Especialidades bloqueadas</h3>
      <p className="mt-2 text-sm leading-6 text-slate-300">Especialidades adicionais disponiveis na analise completa.</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {labels.map((label) => (
          <div key={label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm font-semibold text-slate-100">
            <Lock className="h-4 w-4 text-amber-200" aria-hidden="true" />
            {label}
          </div>
        ))}
      </div>
    </article>
  )
}
