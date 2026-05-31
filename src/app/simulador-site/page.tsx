import type { Metadata } from "next"
import { Suspense } from "react"
import SiteSimulator from "@/components/iaweb/SiteSimulator"

export const metadata: Metadata = {
  title: "Simulador de Website | IAWEB Growth Engine",
  description: "Simulador visual de homepage para reunioes comerciais e captacao online.",
}

export default function SimuladorSitePage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#030712]" />}>
      <SiteSimulator />
    </Suspense>
  )
}
