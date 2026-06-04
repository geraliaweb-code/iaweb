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
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-4xl rounded-2xl border border-white/10 bg-slate-950/95 p-4 shadow-2xl backdrop-blur">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm leading-6 text-slate-200">{copy.cookies.banner}</p>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => choose("accepted")} className="rounded-full bg-sky-300 px-4 py-2 text-xs font-bold text-slate-950">
            {copy.actions.accept}
          </button>
          <button onClick={() => choose("rejected")} className="rounded-full border border-white/15 px-4 py-2 text-xs font-bold text-white">
            {copy.actions.reject}
          </button>
          <button onClick={() => choose("configured")} className="rounded-full border border-white/15 px-4 py-2 text-xs font-bold text-white">
            {copy.actions.preferences}
          </button>
        </div>
      </div>
    </div>
  )
}
