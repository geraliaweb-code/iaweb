import type { Metadata } from "next"
import ConstructionShell from "@/components/construction/ConstructionShell"
import { ConstructionAuthForm } from "@/components/construction/ConstructionAuthForms"

export const metadata: Metadata = {
  title: "Login Construction | IAWEB",
}

type ConstructionLoginPageProps = {
  searchParams: Promise<{ recover?: string }>
}

export default async function ConstructionLoginPage({ searchParams }: ConstructionLoginPageProps) {
  const params = await searchParams

  return (
    <ConstructionShell eyebrow="Construction Login">
      <ConstructionAuthForm mode={params.recover ? "password" : "login"} />
    </ConstructionShell>
  )
}
