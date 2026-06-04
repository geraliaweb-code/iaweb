import type { Metadata } from "next"
import BillingPanel from "@/components/construction/BillingPanel"
import ConstructionShell from "@/components/construction/ConstructionShell"
import { getConstructionBillingUsage } from "@/lib/construction/billing/usage"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Billing Construction | IAWEB",
}

export default async function ConstructionBillingPage() {
  const { data, error } = await getConstructionBillingUsage()

  return (
    <ConstructionShell surface="light">
      <BillingPanel usage={data} warning={error?.message} />
    </ConstructionShell>
  )
}
