import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import ConstructionShell from "@/components/construction/ConstructionShell"
import ProjectTabs from "@/components/construction/ProjectTabs"
import { constructionDemoProject } from "@/lib/construction/demo-data"
import { getConstructionProject } from "@/lib/construction/db"
import { isValidConstructionProjectId } from "@/lib/construction/production"

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
          <div className="iaweb-premium-card max-w-2xl rounded-2xl p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-200">Projeto indisponivel</p>
            <h1 className="mt-3 text-2xl font-semibold text-white">Nao foi possivel carregar este projeto.</h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">{error.message}</p>
            <Link href="/construction/dashboard" className="mt-6 inline-flex rounded-full bg-sky-400 px-5 py-3 text-sm font-bold text-slate-950">
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

  return (
    <ConstructionShell>
      <ProjectTabs project={data} />
    </ConstructionShell>
  )
}
