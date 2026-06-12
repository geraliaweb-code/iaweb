import type { Metadata } from "next"
import ConstructionDashboard from "@/components/construction/ConstructionDashboard"
import ConstructionShell from "@/components/construction/ConstructionShell"
import { getConstructionAccountContext, getConstructionAuthUser } from "@/lib/construction/auth"
import { getConstructionStats, listConstructionProjects } from "@/lib/construction/db"
import { constructionAlphaLearningProjects } from "@/lib/construction/demo-data"
import { isConstructionAlphaEnvironment } from "@/lib/construction/production"
import { buildConstructionLearningStatus } from "@/lib/construction/score-engine"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Dashboard Construction | IAWEB",
}

export default async function ConstructionDashboardPage() {
  const { user } = await getConstructionAuthUser()
  const context = await getConstructionAccountContext(user)
  const isAlpha = isConstructionAlphaEnvironment()
  const { data, error } = await listConstructionProjects(12, {
    userId: user?.id ?? null,
    organizationId: context.organization?.id ?? null,
  })
  const learningProjects = isAlpha ? [...data, ...constructionAlphaLearningProjects] : data

  return (
    <ConstructionShell>
      <ConstructionDashboard
        projects={data}
        stats={getConstructionStats(data)}
        warning={error?.message}
        showProjectSelector={isAlpha}
        learningStatus={buildConstructionLearningStatus(learningProjects)}
      />
    </ConstructionShell>
  )
}
