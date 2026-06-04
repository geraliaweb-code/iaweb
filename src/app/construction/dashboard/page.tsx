import type { Metadata } from "next"
import ConstructionDashboard from "@/components/construction/ConstructionDashboard"
import ConstructionShell from "@/components/construction/ConstructionShell"
import { getConstructionStats, listConstructionProjects } from "@/lib/construction/db"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Dashboard Construction | IAWEB",
}

export default async function ConstructionDashboardPage() {
  const { data, error } = await listConstructionProjects(12)

  return (
    <ConstructionShell>
      <ConstructionDashboard projects={data} stats={getConstructionStats(data)} warning={error?.message} />
    </ConstructionShell>
  )
}
