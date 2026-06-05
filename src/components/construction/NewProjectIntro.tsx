"use client"

import { useConstructionLocale } from "./useConstructionLocale"

export default function NewProjectIntro() {
  const { copy } = useConstructionLocale()
  const ui = copy.ui

  return (
    <div className="mx-auto mb-8 max-w-4xl">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-200">{ui.pages.newProjectEyebrow}</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-5xl">{ui.pages.newProjectTitle}</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">{ui.pages.newProjectBody}</p>
    </div>
  )
}
