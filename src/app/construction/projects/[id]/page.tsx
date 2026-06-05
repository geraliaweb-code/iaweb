import type { Metadata } from "next"
import Link from "next/link"
import { Lock } from "lucide-react"
import { notFound } from "next/navigation"
import ConstructionCopilot from "@/components/construction/ConstructionCopilot"
import ConstructionShell from "@/components/construction/ConstructionShell"
import ExecutiveProjectDashboard from "@/components/construction/ExecutiveProjectDashboard"
import ProjectTabs from "@/components/construction/ProjectTabs"
import { getConstructionAccountContext, getConstructionAuthUser } from "@/lib/construction/auth"
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

  const { user } = await getConstructionAuthUser()
  const context = await getConstructionAccountContext(user)

  if (user && context.organization?.id) {
    if (data.organization_id !== context.organization.id) notFound()
  } else if (user && data.user_id && data.user_id !== user.id) {
    notFound()
  }

  const healthCheckResult = await listConstructionHealthCheck(data.id)

  return (
    <ConstructionShell>
      <ExecutiveProjectDashboard project={data} healthCheck={healthCheckResult.data} warning={healthCheckResult.error?.message} />
      <LockedCopilotPanel />
      <ProjectTabs project={data} />
    </ConstructionShell>
  )
}

function LockedCopilotPanel() {
  return (
    <section className="construction-glass-card rounded-xl p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="max-w-3xl">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-300 text-slate-950">
            <Lock className="h-5 w-5" aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-white">Construction Copilot completo bloqueado</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            O Copilot completo, recomendacoes tecnicas, proximos passos e Knowledge Vault avancado fazem parte da analise completa.
          </p>
        </div>
        <Link href="/construction/billing" className="inline-flex rounded-lg bg-amber-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-300">
          Desbloquear Analise Completa
        </Link>
      </div>
    </section>
  )
}
