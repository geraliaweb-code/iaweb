import type { Metadata } from "next"
import ConstructionShell from "@/components/construction/ConstructionShell"
import NewProjectIntro from "@/components/construction/NewProjectIntro"
import NewProjectForm from "@/components/construction/NewProjectForm"

export const metadata: Metadata = {
  title: "Novo Projeto Construction | IAWEB",
}

export default function NewConstructionProjectPage() {
  return (
    <ConstructionShell>
      <section className="py-10">
        <NewProjectIntro />
        <NewProjectForm />
      </section>
    </ConstructionShell>
  )
}
