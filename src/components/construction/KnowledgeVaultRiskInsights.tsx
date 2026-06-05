import { AlertTriangle, ShieldAlert, Zap } from "lucide-react"
import { constructionDocumentTaxonomy } from "@/lib/construction/dataset/document-taxonomy"
import { constructionRiskMatrix } from "@/lib/construction/dataset/risk-matrix"

const missingDocuments = ["Mapa de Quantidades / DPGF / Mediciones", "Estruturas", "Caderno de Encargos / CCTP / Pliego", "Estudo de solo", "SCIE / segurança contra incêndio"]
const criticalSpecialties = Array.from(new Set(constructionDocumentTaxonomy.filter((item) => item.criticality === "critical").map((item) => item.specialty))).slice(0, 8)

export default function KnowledgeVaultRiskInsights() {
  return (
    <section className="py-12">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-400">Risk Insights</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">Padrões de risco que a plataforma aprende a reconhecer.</h2>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <InsightCard icon={AlertTriangle} title="Documentos mais frequentemente em falta" items={missingDocuments} source="Fallback demonstrativo" />
        <InsightCard icon={ShieldAlert} title="Riscos mais frequentes" items={constructionRiskMatrix.map((risk) => risk.title)} source="Dataset local" />
        <InsightCard icon={Zap} title="Especialidades mais críticas" items={criticalSpecialties} source="Taxonomia local" />
      </div>
    </section>
  )
}

function InsightCard({ icon: Icon, title, items, source }: { icon: typeof AlertTriangle; title: string; items: string[]; source: string }) {
  return (
    <article className="construction-glass-card rounded-xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{source}</p>
          <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>
        </div>
        <Icon className="h-6 w-6 text-amber-300" aria-hidden="true" />
      </div>
      <div className="mt-5 grid gap-2">
        {items.map((item, index) => (
          <div key={`${title}-${item}`} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2">
            <span className="text-xs font-bold text-amber-300">{String(index + 1).padStart(2, "0")}</span>
            <span className="text-sm font-medium text-slate-200">{item}</span>
          </div>
        ))}
      </div>
    </article>
  )
}
