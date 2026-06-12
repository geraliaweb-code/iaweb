import type { ConstructionTopProjectMetric } from "@/lib/construction/analytics/types"
import { constructionProjectTypeLabels } from "@/lib/construction/constants"
import type { ConstructionProjectType } from "@/lib/construction/types"

type TopProjectsPanelProps = {
  projects: ConstructionTopProjectMetric[]
}

export default function TopProjectsPanel({ projects }: TopProjectsPanelProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 text-white shadow-[0_18px_55px_rgba(2,8,23,0.22)] backdrop-blur">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-100">Top projects</p>
      <h2 className="mt-2 text-2xl font-semibold">Projetos com maior probabilidade</h2>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="text-xs uppercase tracking-[0.14em] text-slate-500">
            <tr className="border-b border-white/10">
              <th className="py-3 pr-4">Projeto</th>
              <th className="py-3 pr-4">Tipologia</th>
              <th className="py-3 pr-4">Pais</th>
              <th className="py-3 pr-4">Valor Estimado</th>
              <th className="py-3 pr-4">Ultima Atividade</th>
              <th className="py-3">Probabilidade</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.projectId} className="border-b border-white/10 last:border-0">
                <td className="py-4 pr-4 font-semibold">{project.projectName}</td>
                <td className="py-4 pr-4 text-slate-300">{formatTypology(project.typology)}</td>
                <td className="py-4 pr-4 text-slate-300">{project.country}</td>
                <td className="py-4 pr-4 text-amber-100">{formatEuro(project.estimatedValue)}</td>
                <td className="py-4 pr-4 text-slate-400">{formatDate(project.lastActivity)}</td>
                <td className="py-4">
                  <span className="rounded-full border border-amber-200/20 bg-amber-200/10 px-3 py-1 text-xs font-bold text-amber-100">
                    {project.conversionProbability}%
                  </span>
                </td>
              </tr>
            ))}
            {!projects.length ? (
              <tr>
                <td colSpan={6} className="py-5 text-slate-400">Sem projetos para apresentar.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function formatTypology(value: string) {
  return constructionProjectTypeLabels[value as ConstructionProjectType] ?? value
}

function formatEuro(value: number) {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value)
}

function formatDate(value: string | null) {
  if (!value) return "-"
  return new Intl.DateTimeFormat("pt-PT", { dateStyle: "short", timeStyle: "short" }).format(new Date(value))
}
