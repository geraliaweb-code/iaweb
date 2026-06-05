"use client"

import { useEffect, useState } from "react"
import { useConstructionLocale } from "./useConstructionLocale"

export default function ConstructionCookieBanner() {
  const [visible, setVisible] = useState(false)
  const { copy } = useConstructionLocale()

  useEffect(() => {
    setVisible(localStorage.getItem("iaweb-construction-cookies") !== "set")
  }, [])

  function choose(value: "accepted" | "rejected" | "configured") {
    localStorage.setItem("iaweb-construction-cookies", value)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-4xl rounded-xl border border-white/12 bg-slate-950/88 p-4 text-slate-100 shadow-2xl shadow-black/40 backdrop-blur-xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm leading-6 text-slate-300">{copy.cookies.banner}</p>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => choose("accepted")} className="rounded-full bg-gradient-to-r from-amber-500 to-amber-700 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-amber-950/30">
            {copy.actions.accept}
          </button>
          <button onClick={() => choose("rejected")} className="rounded-full border border-white/12 px-4 py-2 text-xs font-bold text-slate-300 hover:border-white/25 hover:text-white">
            {copy.actions.reject}
          </button>
          <button onClick={() => choose("configured")} className="rounded-full border border-white/12 px-4 py-2 text-xs font-bold text-slate-300 hover:border-white/25 hover:text-white">
            {copy.actions.preferences}
          </button>
        </div>
      </div>
    </div>
  )
}
