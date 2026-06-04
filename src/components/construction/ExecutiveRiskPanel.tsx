import { AlertTriangle, ShieldCheck } from "lucide-react"
import type { ConstructionHealthCheckResult } from "@/lib/construction/types"

type ExecutiveRiskPanelProps = {
  alerts: ConstructionHealthCheckResult["alerts"]
  hasAnalysis: boolean
}

const severityClasses: Record<string, string> = {
  high: "border-red-200 bg-red-50 text-red-800",
  medium: "border-amber-200 bg-amber-50 text-amber-800",
  low: "border-slate-200 bg-slate-50 text-slate-700",
}

export default function ExecutiveRiskPanel({ alerts, hasAnalysis }: ExecutiveRiskPanelProps) {
  const visibleAlerts = hasAnalysis ? alerts.slice(0, 5) : []

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Principais riscos</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-950">Riscos executivos da obra</h2>
        </div>
        <AlertTriangle className="h-5 w-5 text-amber-700" aria-hidden="true" />
      </div>

      {visibleAlerts.length ? (
        <div className="mt-5 grid gap-3">
          {visibleAlerts.map((alert, index) => (
            <article key={`${alert.type}-${index}`} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-950">{alert.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{alert.recommendation}</p>
                </div>
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${severityClasses[alert.severity] ?? severityClasses.low}`}>
                  {alert.severity}
                </span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-5">
          <ShieldCheck className="h-5 w-5 text-slate-700" aria-hidden="true" />
          <p className="mt-3 font-semibold text-slate-950">{hasAnalysis ? "Sem riscos principais registados." : "Riscos ainda por calcular."}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {hasAnalysis
              ? "O motor nao registou alertas relevantes para a ultima analise disponivel."
              : "Faz upload da documentacao e gera o Health Check para calcular riscos tecnicos e documentais."}
          </p>
        </div>
      )}
    </section>
  )
}
