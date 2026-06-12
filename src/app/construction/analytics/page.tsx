import type { Metadata } from "next"
import ConstructionAnalyticsDashboard from "@/components/construction/ConstructionAnalyticsDashboard"
import ConstructionShell from "@/components/construction/ConstructionShell"
import { getConstructionAnalytics } from "@/lib/construction/analytics/dashboard"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Analytics Construction | IAWEB",
}

export default async function ConstructionAnalyticsPage() {
  const analytics = await getConstructionAnalytics()

  return (
    <ConstructionShell eyebrow="Construction Analytics">
      <ConstructionAnalyticsDashboard analytics={analytics} />
    </ConstructionShell>
  )
}
