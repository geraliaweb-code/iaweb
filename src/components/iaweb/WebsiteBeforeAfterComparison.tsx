"use client"

import { ArrowRight, CheckCircle2, TrendingUp, XCircle } from "lucide-react"
import type { ScoreProjection, WebsiteComparison } from "@/lib/website-generator"

type WebsiteBeforeAfterComparisonProps = {
  comparison: WebsiteComparison
  projection: ScoreProjection
}

function ScoreOrb({ label, score, tone }: { label: string; score: number; tone: "before" | "after" }) {
  const color = tone === "before" ? "#FF7A1A" : "#00A3FF"

  return (
    <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full border bg-black/35" style={{ borderColor: `${color}66`, boxShadow: `0 0 46px ${color}22` }}>
      <div className="absolute inset-2 rounded-full border border-white/10" />
      <div className="relative text-center">
        <div className="text-4xl font-black tracking-[-0.06em] text-white">{score}</div>
        <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">{label}</div>
      </div>
    </div>
  )
}

export default function WebsiteBeforeAfterComparison({ comparison, projection }: WebsiteBeforeAfterComparisonProps) {
  const beforeAreas = Object.entries(comparison.before.areas)
  const afterAreas = Object.entries(comparison.after.areas)

  return (
    <section className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.055] p-5 shadow-[0_30px_120px_rgba(0,0,0,0.42)] backdrop-blur-2xl sm:p-6">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/15 bg-cyan-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-cyan-100">
            <TrendingUp size={14} />
            Before / After Engine
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-[-0.045em] text-white">Da perda invisivel para uma solucao visivel.</h2>
        </div>
        <div className="rounded-2xl border border-[#00A3FF]/25 bg-[#00A3FF]/10 px-4 py-3 text-sm font-black text-cyan-100">
          +{projection.improvementPoints} pontos | +{projection.improvementPercent}%
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_auto_1fr]">
        <article className="rounded-[24px] border border-orange-400/25 bg-orange-400/[0.055] p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-200">Antes</p>
              <h3 className="mt-2 text-xl font-black text-white">{comparison.before.title}</h3>
            </div>
            <ScoreOrb label="atual" score={comparison.before.score} tone="before" />
          </div>
          <ul className="mt-5 space-y-3">
            {comparison.before.problems.map((problem) => (
              <li key={problem} className="flex gap-3 text-sm leading-6 text-slate-300">
                <XCircle size={17} className="mt-0.5 shrink-0 text-orange-300" />
                {problem}
              </li>
            ))}
          </ul>
          <div className="mt-5 grid gap-2">
            {beforeAreas.map(([area, text]) => (
              <div key={area} className="rounded-2xl border border-white/10 bg-black/20 p-3">
                <div className="text-[10px] font-black uppercase tracking-[0.16em] text-orange-200">{area}</div>
                <div className="mt-1 text-sm leading-6 text-slate-300">{text}</div>
              </div>
            ))}
          </div>
        </article>

        <div className="flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#FFB800]/40 bg-[#FFB800]/15 text-[#FFB800] shadow-[0_0_70px_rgba(255,184,0,0.28)]">
            <ArrowRight size={26} />
          </div>
        </div>

        <article className="rounded-[24px] border border-[#00A3FF]/30 bg-[#00A3FF]/[0.055] p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-100">Depois</p>
              <h3 className="mt-2 text-xl font-black text-white">{comparison.after.title}</h3>
            </div>
            <ScoreOrb label="projetado" score={comparison.after.score} tone="after" />
          </div>
          <ul className="mt-5 space-y-3">
            {comparison.after.improvements.map((improvement) => (
              <li key={improvement} className="flex gap-3 text-sm leading-6 text-slate-300">
                <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-cyan-200" />
                {improvement}
              </li>
            ))}
          </ul>
          <div className="mt-5 grid gap-2">
            {afterAreas.map(([area, text]) => (
              <div key={area} className="rounded-2xl border border-white/10 bg-black/20 p-3">
                <div className="text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100">{area}</div>
                <div className="mt-1 text-sm leading-6 text-slate-300">{text}</div>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="mt-5 overflow-hidden rounded-full bg-white/10">
        <div className="h-3 rounded-full bg-gradient-to-r from-orange-400 via-[#FFB800] to-[#00A3FF]" style={{ width: `${projection.projectedScore}%` }} />
      </div>
    </section>
  )
}
