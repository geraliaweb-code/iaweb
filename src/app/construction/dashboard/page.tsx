import type { Metadata } from "next"
import ConstructionDashboard from "@/components/construction/ConstructionDashboard"
import ConstructionShell from "@/components/construction/ConstructionShell"
import { getConstructionAccountContext, getConstructionAuthUser } from "@/lib/construction/auth"
import { getConstructionStats, listConstructionProjects } from "@/lib/construction/db"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Dashboard Construction | IAWEB",
}

export default async function ConstructionDashboardPage() {
  const { user } = await getConstructionAuthUser()
  const context = await getConstructionAccountContext(user)
  const { data, error } = await listConstructionProjects(12, {
    userId: user?.id ?? null,
    organizationId: context.organization?.id ?? null,
  })

  return (
    <ConstructionShell>
      <ConstructionDashboard projects={data} stats={getConstructionStats(data)} warning={error?.message} />
    </ConstructionShell>
  )
}
