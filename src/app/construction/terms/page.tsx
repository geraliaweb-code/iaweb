import type { Metadata } from "next"
import ConstructionShell from "@/components/construction/ConstructionShell"

export const metadata: Metadata = {
  title: "Termos Construction | IAWEB",
}

export default function ConstructionTermsPage() {
  return (
    <ConstructionShell>
      <section className="mx-auto max-w-4xl py-14">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-400">Termos</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">Termos de utilizacao Construction Intelligence</h1>
        <div className="construction-glass-card mt-8 grid gap-4 rounded-xl p-6 text-base leading-7 text-slate-300">
          <p>
            A IAWEB Construction Intelligence fornece analises indicativas baseadas na documentacao carregada, em regras tecnicas, benchmarks e dados de mercado disponiveis no momento da analise.
          </p>
          <p>
            Os resultados nao constituem orcamento vinculativo, projeto de execucao, fiscalizacao, parecer legal, garantia de custo final ou substituicao de validacao por tecnico qualificado.
          </p>
          <p>
            O utilizador e responsavel por garantir que tem autorizacao para carregar e analisar os ficheiros submetidos na plataforma.
          </p>
        </div>
      </section>
    </ConstructionShell>
  )
}
