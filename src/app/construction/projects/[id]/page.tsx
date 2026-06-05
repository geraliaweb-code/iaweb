import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import ConstructionCopilot from "@/components/construction/ConstructionCopilot"
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
      <ConstructionShell>
        <ExecutiveProjectDashboard project={constructionDemoProject} healthCheck={constructionDemoHealthCheck} />
        <ConstructionCopilot project={constructionDemoProject} healthCheck={constructionDemoHealthCheck} />
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
      <ConstructionShell>
        <div className="flex flex-1 items-center justify-center py-12">
          <div className="construction-glass-card max-w-2xl rounded-xl p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-400">Projeto indisponivel</p>
            <h1 className="mt-3 text-2xl font-semibold text-white">Nao foi possivel carregar este projeto.</h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">{error.message}</p>
            <Link href="/construction/dashboard" className="mt-6 inline-flex rounded-lg bg-amber-500 px-5 py-3 text-sm font-bold text-slate-950">
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
    <ConstructionShell>
      <ExecutiveProjectDashboard project={data} healthCheck={healthCheckResult.data} warning={healthCheckResult.error?.message} />
      <ConstructionCopilot project={data} healthCheck={healthCheckResult.data} />
      <ProjectTabs project={data} />
    </ConstructionShell>
  )
}
