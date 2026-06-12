import { redirect } from "next/navigation"
import CommandCenterClient from "./CommandCenterClient"
import { assertCrmAccess } from "@/lib/crm-auth"
import { getCommandCenterData } from "@/lib/prospector/observability"

export const dynamic = "force-dynamic"

export default async function EnersiaCommandCenterPage() {
  const access = await assertCrmAccess()

  if (!access.ok) {
    redirect("/crm/login")
  }

  const data = await getCommandCenterData()

  return <CommandCenterClient initialData={data} />
}
