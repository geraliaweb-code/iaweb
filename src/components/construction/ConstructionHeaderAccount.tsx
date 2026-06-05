"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Building2, CreditCard, UserRound } from "lucide-react"
import type { ConstructionOrganization, ConstructionUserProfile } from "@/lib/construction/types"

type HeaderContext = {
  authenticated: boolean
  profile: ConstructionUserProfile | null
  organization: ConstructionOrganization | null
  planName: string
}

export default function ConstructionHeaderAccount() {
  const [context, setContext] = useState<HeaderContext | null>(null)

  useEffect(() => {
    let active = true

    fetch("/api/construction/auth/context", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: HeaderContext) => {
        if (active) setContext(data)
      })
      .catch(() => {
        if (active) setContext(null)
      })

    return () => {
      active = false
    }
  }, [])

  if (!context?.authenticated) {
    return (
      <Link href="/construction/login" className="hidden rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/5 hover:text-white xl:inline-flex">
        Perfil
      </Link>
    )
  }

  return (
    <div className="hidden items-center gap-2 xl:flex">
      <HeaderPill href="/construction/account" icon={UserRound} label={context.profile?.name ?? "Perfil"} />
      <HeaderPill href="/construction/organization" icon={Building2} label={context.organization?.name ?? "Organizacao"} />
      <HeaderPill href="/construction/billing" icon={CreditCard} label={context.planName ?? "Plano atual"} />
    </div>
  )
}

function HeaderPill({ href, icon: Icon, label }: { href: string; icon: typeof UserRound; label: string }) {
  return (
    <Link href={href} className="inline-flex max-w-44 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white">
      <Icon className="h-3.5 w-3.5 shrink-0 text-amber-200" aria-hidden="true" />
      <span className="truncate">{label}</span>
    </Link>
  )
}
