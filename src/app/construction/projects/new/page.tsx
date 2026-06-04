import type { Metadata } from "next"
import ConstructionShell from "@/components/construction/ConstructionShell"
import NewProjectForm from "@/components/construction/NewProjectForm"

export const metadata: Metadata = {
  title: "Novo Projeto Construction | IAWEB",
}

export default function NewConstructionProjectPage() {
  return (
    <ConstructionShell>
      <section className="py-10">
        <div className="mx-auto mb-8 max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-200">Novo projeto</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-5xl">Criar fundacao de intelligence</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            Regista os metadados essenciais do projeto. Os motores de analise ficam preparados para as proximas sprints.
          </p>
        </div>
        <NewProjectForm />
      </section>
    </ConstructionShell>
  )
}
