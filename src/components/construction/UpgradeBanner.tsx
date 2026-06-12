"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { readConstructionApiJson } from "@/lib/construction/client-api"

type UpgradeBannerProps = {
  projectId: string
}

type UpgradeCtaResponse = {
  title: string
  subtitle: string
  buttonText: string
  benefits: string[]
}

const fallbackCta: UpgradeCtaResponse = {
  title: "Desbloquear Analise Completa",
  subtitle: "Veja o orcamento completo por especialidade, materiais, fornecedores, produtividade e benchmark europeu.",
  buttonText: "Desbloquear Analise Completa",
  benefits: ["Orcamento completo", "Fornecedores", "Produtividade", "Benchmark europeu", "PDF Executivo Premium"],
}

export default function UpgradeBanner({ projectId }: UpgradeBannerProps) {
  const [cta, setCta] = useState<UpgradeCtaResponse>(fallbackCta)

  useEffect(() => {
    let active = true

    async function loadCta() {
      const response = await fetch(`/api/construction/projects/${projectId}/upgrade-cta`, { cache: "no-store" })
      const result = await readConstructionApiJson<UpgradeCtaResponse>(response)
      if (active && response.ok && result.title) setCta(result)
    }

    loadCta()

    return () => {
      active = false
    }
  }, [projectId])

  function trackUnlockClick() {
    void fetch(`/api/construction/projects/${projectId}/upgrade-cta`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: "upgrade-banner" }),
      keepalive: true,
    })
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-amber-200/25 bg-[linear-gradient(135deg,#061427,#0b2b4a_48%,#bd8b22)] text-white shadow-[0_24px_80px_rgba(2,8,23,0.45)]">
      <div className="grid gap-6 p-6 md:grid-cols-[1fr_auto] md:p-8">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-100">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Premium intelligence
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">{cta.title}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-amber-50/90">{cta.subtitle}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {cta.benefits.map((benefit) => (
              <span key={benefit} className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white">
                {benefit}
              </span>
            ))}
          </div>
        </div>
        <Link
          href="/construction/billing"
          onClick={trackUnlockClick}
          className="inline-flex self-start items-center justify-center gap-2 rounded-full bg-amber-100 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-white"
        >
          {cta.buttonText}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
