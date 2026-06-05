import type { Metadata } from "next"
import ConstructionShell from "@/components/construction/ConstructionShell"
import KnowledgeVaultDashboard from "@/components/construction/KnowledgeVaultDashboard"

export const metadata: Metadata = {
  title: "Knowledge Vault Construction | IAWEB",
  description: "Centro de conhecimento da IAWEB Construction Intelligence para documentos, riscos, especialidades e elementos construtivos.",
}

export default function ConstructionKnowledgeVaultPage() {
  return (
    <ConstructionShell eyebrow="Knowledge Vault">
      <KnowledgeVaultDashboard />
    </ConstructionShell>
  )
}
