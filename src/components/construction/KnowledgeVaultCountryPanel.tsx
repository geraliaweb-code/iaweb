"use client"

import { Building2 } from "lucide-react"

const flagClasses: Record<string, string> = {
  PT: "bg-[linear-gradient(90deg,#047857_0_42%,#dc2626_42%)]",
  FR: "bg-[linear-gradient(90deg,#1d4ed8_0_33%,#ffffff_33%_66%,#dc2626_66%)]",
  ES: "bg-[linear-gradient(180deg,#dc2626_0_25%,#facc15_25%_75%,#dc2626_75%)]",
}

const countries = [
  {
    name: "Portugal",
    flag: "PT",
    body: "Vocabulário documental e técnico para obras em território português.",
    items: ["Mapa de Quantidades", "Caderno de Encargos", "Arquitetura", "Estruturas", "ETICS", "ITED"],
  },
  {
    name: "França",
    flag: "FR",
    body: "Leitura localizada para documentação técnica francesa.",
    items: ["CCTP", "DPGF", "DQE", "Plans d’Exécution", "Étude de Sol"],
  },
  {
    name: "Espanha",
    flag: "ES",
    body: "Taxonomia adaptada a medições, orçamento e projeto espanhol.",
    items: ["Mediciones", "Presupuesto", "Pliego", "Proyecto Básico", "Proyecto de Ejecución"],
  },
]

function Flag({ code }: { code: string }) {
  return <span className={`h-4 w-6 rounded-[2px] border border-white/20 shadow-sm ${flagClasses[code]}`} aria-hidden="true" />
}

export default function KnowledgeVaultCountryPanel() {
  return (
    <section className="py-12">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-400">Países</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">Conhecimento localizado por mercado.</h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-slate-300">Painéis alimentados pela taxonomia Construction e por fallback demonstrativo quando ainda não há dados reais suficientes.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {countries.map((country) => (
          <article key={country.name} className="construction-glass-card rounded-xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <Flag code={country.flag} />
                <h3 className="text-xl font-semibold text-white">{country.name}</h3>
              </div>
              <Building2 className="h-5 w-5 text-amber-300" aria-hidden="true" />
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-300">{country.body}</p>
            <div className="mt-5 grid gap-2">
              {country.items.map((item) => (
                <div key={item} className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm font-semibold text-slate-100">
                  {item}
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
