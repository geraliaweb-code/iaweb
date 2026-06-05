import { BrainCircuit, Database, Network } from "lucide-react"
import KnowledgeVaultConstructionElements from "./KnowledgeVaultConstructionElements"
import KnowledgeVaultCountryPanel from "./KnowledgeVaultCountryPanel"
import KnowledgeVaultDocumentLibrary from "./KnowledgeVaultDocumentLibrary"
import KnowledgeVaultMetrics from "./KnowledgeVaultMetrics"
import KnowledgeVaultRiskInsights from "./KnowledgeVaultRiskInsights"

export default function KnowledgeVaultDashboard() {
  return (
    <div className="py-12 lg:py-16">
      <section className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-end">
        <div>
          <p className="inline-flex rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-amber-200">
            Demonstração ilustrativa
          </p>
          <h1 className="mt-6 text-5xl font-semibold tracking-tight text-white md:text-7xl">Knowledge Vault</h1>
          <p className="mt-5 max-w-3xl text-xl leading-8 text-slate-100">A base de conhecimento que alimenta a inteligência da plataforma.</p>
          <p className="mt-5 max-w-4xl text-base leading-8 text-slate-300">
            Cada análise contribui para uma compreensão mais profunda dos documentos, riscos, custos, especialidades e padrões da construção em Portugal, França e Espanha.
          </p>
        </div>
        <div className="construction-glass-card rounded-xl p-5">
          <div className="grid gap-3">
            <VaultSignal icon={Database} label="construction_knowledge_vault" body="Tabela preparada para conhecimento acumulado." />
            <VaultSignal icon={Network} label="Knowledge Graph" body="Relações entre documentos, riscos, custos e elementos." />
            <VaultSignal icon={BrainCircuit} label="Dataset local" body="Taxonomias usadas como fallback demonstrativo." />
          </div>
        </div>
      </section>

      <div className="mt-10">
        <KnowledgeVaultMetrics />
      </div>
      <KnowledgeVaultCountryPanel />
      <KnowledgeVaultDocumentLibrary />
      <KnowledgeVaultRiskInsights />
      <KnowledgeVaultConstructionElements />
    </div>
  )
}

function VaultSignal({ icon: Icon, label, body }: { icon: typeof Database; label: string; body: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold text-white">{label}</p>
          <p className="mt-1 text-sm leading-6 text-slate-400">{body}</p>
        </div>
      </div>
    </div>
  )
}
