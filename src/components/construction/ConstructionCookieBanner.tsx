"use client"

import { useEffect, useState } from "react"
import { getConstructionCopy } from "@/lib/construction/i18n"

export default function ConstructionCookieBanner() {
  const [visible, setVisible] = useState(false)
  const copy = getConstructionCopy("pt")

  useEffect(() => {
    setVisible(localStorage.getItem("iaweb-construction-cookies") !== "set")
  }, [])

  function choose(value: "accepted" | "rejected" | "configured") {
    localStorage.setItem("iaweb-construction-cookies", value)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white/95 p-4 text-slate-800 shadow-2xl shadow-slate-950/15 backdrop-blur">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm leading-6 text-slate-600">{copy.cookies.banner}</p>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => choose("accepted")} className="rounded-full bg-slate-950 px-4 py-2 text-xs font-bold text-white">
            {copy.actions.accept}
          </button>
          <button onClick={() => choose("rejected")} className="rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:border-slate-400">
            {copy.actions.reject}
          </button>
          <button onClick={() => choose("configured")} className="rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:border-slate-400">
            {copy.actions.preferences}
          </button>
        </div>
      </div>
    </div>
  )
}
