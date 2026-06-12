import type { ConstructionAnalyticsData } from "@/lib/construction/analytics/types"
import AnalyticsKpiCards from "./AnalyticsKpiCards"
import ConversionFunnel from "./ConversionFunnel"
import CountryPerformancePanel from "./CountryPerformancePanel"
import RevenuePanel from "./RevenuePanel"
import TopOrganizationsPanel from "./TopOrganizationsPanel"
import TopProjectsPanel from "./TopProjectsPanel"
import TypologyPerformancePanel from "./TypologyPerformancePanel"

type ConstructionAnalyticsDashboardProps = {
  analytics: ConstructionAnalyticsData
}

export default function ConstructionAnalyticsDashboard({ analytics }: ConstructionAnalyticsDashboardProps) {
  return (
    <div className="grid gap-6 py-8">
      <section className="overflow-hidden rounded-2xl border border-amber-200/20 bg-[linear-gradient(135deg,#061427,#0b2b4a_52%,#9a741d)] p-6 text-white shadow-[0_24px_80px_rgba(2,8,23,0.45)] md:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-100">Conversion dashboard</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">Revenue Analytics</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-amber-50/90">
              Metricas de conversao, receita potencial e inteligencia comercial geradas a partir da Commercial Experience Layer.
            </p>
          </div>
          <p className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white">
            Atualizado {formatDate(analytics.generatedAt)}
          </p>
        </div>
      </section>

      {analytics.warnings.length ? (
        <section className="rounded-2xl border border-amber-200/20 bg-amber-200/10 p-4 text-sm text-amber-50">
          Dados parciais: {analytics.warnings.slice(0, 3).join(" | ")}
        </section>
      ) : null}

      <AnalyticsKpiCards kpis={analytics.kpis} />

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <ConversionFunnel funnel={analytics.funnel} />
        <RevenuePanel revenue={analytics.revenue} />
      </div>

      <TopProjectsPanel projects={analytics.topProjects} />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <TopOrganizationsPanel organizations={analytics.topOrganizations} />
        <CountryPerformancePanel countries={analytics.countryPerformance} />
      </div>

      <TypologyPerformancePanel typologies={analytics.typologyPerformance} />
    </div>
  )
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-PT", { dateStyle: "short", timeStyle: "short" }).format(new Date(value))
}
