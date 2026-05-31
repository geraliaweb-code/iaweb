import type { Metadata } from "next"
import { Suspense } from "react"
import ProposalGenerator from "@/components/iaweb/ProposalGenerator"

export const metadata: Metadata = {
  title: "Gerador de Proposta | IAWEB Growth Engine",
  description: "Gerador client-side de proposta comercial premium para clientes IAWEB.",
}

export default function PropostaPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#030712]" />}>
      <ProposalGenerator />
    </Suspense>
  )
}
