import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import ConstructionShell from "@/components/construction/ConstructionShell"
import ExecutiveProjectDashboard from "@/components/construction/ExecutiveProjectDashboard"
import ProjectTabs from "@/components/construction/ProjectTabs"
import { constructionDemoHealthCheck, constructionDemoProject } from "@/lib/construction/demo-data"
import { getConstructionProject } from "@/lib/construction/db"
import { isValidConstructionProjectId } from "@/lib/construction/production"
import { listConstructionHealthCheck } from "@/lib/construction/score-engine"

export const dynamic = "force-dynamic"

type ProjectPageProps = {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: "Projeto Construction | IAWEB",
}

export default async function ConstructionProjectPage({ params }: ProjectPageProps) {
  const { id } = await params

  if (id === "demo") {
    return (
      <ConstructionShell surface="light">
        <ExecutiveProjectDashboard project={constructionDemoProject} healthCheck={constructionDemoHealthCheck} />
        <ProjectTabs project={constructionDemoProject} demoMode />
      </ConstructionShell>
    )
  }

  if (!isValidConstructionProjectId(id)) {
    notFound()
  }

  const { data, error } = await getConstructionProject(id)

  if (error?.code === "NOT_FOUND") {
    notFound()
  }

  if (error) {
    return (
      <ConstructionShell surface="light">
        <div className="flex flex-1 items-center justify-center py-12">
          <div className="max-w-2xl rounded-lg border border-slate-200 bg-white p-7 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-700">Projeto indisponivel</p>
            <h1 className="mt-3 text-2xl font-semibold text-slate-950">Nao foi possivel carregar este projeto.</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">{error.message}</p>
            <Link href="/construction/dashboard" className="mt-6 inline-flex rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white">
              Voltar ao dashboard
            </Link>
          </div>
        </div>
      </ConstructionShell>
    )
  }

  if (!data) {
    notFound()
  }

  const healthCheckResult = await listConstructionHealthCheck(data.id)

  return (
    <ConstructionShell surface="light">
      <ExecutiveProjectDashboard project={data} healthCheck={healthCheckResult.data} warning={healthCheckResult.error?.message} />
      <ProjectTabs project={data} />
    </ConstructionShell>
  )
}
