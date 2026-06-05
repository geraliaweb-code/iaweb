import type { Metadata } from "next"
import ConstructionShell from "@/components/construction/ConstructionShell"
import { ConstructionAuthForm } from "@/components/construction/ConstructionAuthForms"

export const metadata: Metadata = {
  title: "Registo Construction | IAWEB",
}

export default function ConstructionRegisterPage() {
  return (
    <ConstructionShell eyebrow="Construction Register">
      <ConstructionAuthForm mode="register" />
    </ConstructionShell>
  )
}
