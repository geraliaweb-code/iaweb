import Link from "next/link"
import { ArrowRight, BadgeCheck, BarChart3, Building2, ClipboardCheck, FileStack, Gauge, Globe2, HardHat, LockKeyhole, ShieldCheck } from "lucide-react"

const trustBadges = [
  "IA Especializada em Construcao",
  "Benchmark Europeu",
  "Portugal - Franca - Espanha",
  "Dados Protegidos RGPD",
  "Infraestrutura Segura",
  "Relatorios Executivos IA",
  "Analise Multidocumento",
  "Construction Intelligence Platform",
  "Desenvolvido na Uniao Europeia",
  "Preparado para mercado europeu",
]

const countryDocuments = [
  { country: "Portugal", items: ["Mapa de Quantidades", "Caderno de Encargos", "Arquitetura", "Estruturas"] },
  { country: "France", items: ["CCTP", "DPGF", "DQE", "Plans d'Execution", "Etude de Sol"] },
  { country: "Espana", items: ["Mediciones", "Presupuesto", "Pliego", "Proyecto Basico", "Proyecto de Ejecucion"] },
]

const useCases = [
  {
    title: "Caso de uso - Moradia Unifamiliar, Portugal",
    items: ["Documentacao analisada: 127 paginas", "Tempo tradicional: 3 a 5 dias", "Tempo IAWEB: poucos minutos", "Documentos identificados: 23", "Riscos encontrados: 11", "Documentos em falta: 4"],
  },
  {
    title: "Caso de uso - Projeto Residencial, Franca",
    items: ["Tempo tradicional: ate 1 semana", "Tempo IAWEB: poucos minutos", "Benchmark: mercado frances", "Nivel de confianca: elevado"],
  },
  {
    title: "Caso de uso - Gabinete Tecnico, Espanha",
    items: ["Analise documental multidisciplinar", "Estimativa por cenario economico, normal e premium", "Identificacao de documentos em falta"],
  },
]

export function ConstructionTrustBadges() {
  return (
    <div className="flex flex-wrap gap-2">
      {["Portugal", "France", "Espana", "PT", "FR", "ES", "RGPD", "Benchmark Europeu", "+100 Elementos Construtivos"].map((badge) => (
        <span key={badge} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700 shadow-sm">
          {badge}
        </span>
      ))}
    </div>
  )
}

export function ConstructionCountrySelector() {
  return (
    <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm" aria-label="Idioma preparado">
      {["PT", "FR", "ES"].map((lang, index) => (
        <button
          key={lang}
          type="button"
          className={`rounded-full px-4 py-2 text-xs font-bold transition ${index === 0 ? "bg-slate-950 text-white" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"}`}
        >
          {lang}
        </button>
      ))}
    </div>
  )
}

export function PremiumConstructionHero() {
  return (
    <section className="grid gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
      <div>
        <ConstructionCountrySelector />
        <h1 className="mt-8 max-w-5xl text-5xl font-semibold leading-[0.98] tracking-tight text-slate-950 md:text-7xl">
          IAWEB Construction Intelligence
        </h1>
        <p className="mt-6 max-w-3xl text-xl font-semibold leading-8 text-slate-700">
          A primeira plataforma europeia de Construction Intelligence para Portugal, Franca e Espanha.
        </p>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
          Transforme centenas de paginas de documentacao tecnica em decisoes claras em poucos minutos. O que normalmente demora dias a analisar, a IAWEB Construction entrega em minutos.
        </p>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-500">
          A nossa IA analisa projetos, medicoes e documentacao tecnica para revelar riscos, maturidade, orcamento e prazo da sua obra antes de avancar para execucao.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/construction/billing" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-slate-800">
            Ativar Inteligencia
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link href="#como-funciona" className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-800 transition hover:-translate-y-0.5 hover:border-slate-500">
            Ver Como Funciona
          </Link>
        </div>
        <div className="mt-8">
          <ConstructionTrustBadges />
        </div>
      </div>

      <div className="relative">
        <div className="absolute -inset-4 rounded-[2rem] bg-amber-700/10 blur-3xl" />
        <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-950/10">
          <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-amber-300">Executive health check</p>
                <h2 className="mt-2 text-2xl font-semibold">Documentacao tecnica analisada</h2>
              </div>
              <HardHat className="h-8 w-8 text-amber-300" aria-hidden="true" />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                ["Maturidade", "82%", "bg-emerald-300"],
                ["Risco", "34%", "bg-amber-300"],
                ["Confianca", "76%", "bg-sky-300"],
                ["Complexidade", "58%", "bg-orange-300"],
              ].map(([label, value, color]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-sm text-slate-300">{label}</p>
                  <p className="mt-2 text-3xl font-semibold">{value}</p>
                  <div className="mt-3 h-2 rounded-full bg-white/10">
                    <div className={`h-full rounded-full ${color}`} style={{ width: value }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl bg-white p-4 text-slate-900">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">Blueprint intelligence</p>
              <div className="mt-4 grid gap-3">
                {["Mapa de quantidades encontrado", "Estruturas em falta no pacote recebido", "Cenario normal com confianca media-alta"].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm font-semibold">
                    <BadgeCheck className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function ConstructionHowItWorks() {
  const steps = [
    { title: "Carregue a documentacao", body: "Projetos, medicoes, cadernos de encargos, especialidades e ficheiros tecnicos.", icon: FileStack },
    { title: "A IA analisa o projeto", body: "Identifica documentos, riscos, maturidade, complexidade, confianca, custos e prazos.", icon: Gauge },
    { title: "Receba inteligencia acionavel", body: "Relatorio executivo com cenarios economico, normal e premium.", icon: ClipboardCheck },
  ]

  return (
    <section id="como-funciona" className="py-14">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-700">Como funciona</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">Do ficheiro tecnico a decisao executiva.</h2>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <article key={step.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-950/5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-amber-700">0{index + 1}</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-950">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{step.body}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export function ConstructionScenarioSection() {
  return (
    <section className="grid gap-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-700">Estimativa por cenarios</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Nunca um preco unico exato.</h2>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Estimativa gerada com base na documentacao analisada, benchmark de mercado e referencias reais do setor da construcao.
        </p>
        <p className="mt-3 text-sm font-semibold text-slate-700">Quanto melhor a documentacao, mais precisa a estimativa.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ["Cenario Economico", "Faixa conservadora para decisoes iniciais."],
          ["Cenario Normal", "Referencia central para analise executiva."],
          ["Cenario Premium", "Margem superior para maior exigencia tecnica."],
        ].map(([title, body]) => (
          <article key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <BarChart3 className="h-5 w-5 text-amber-700" aria-hidden="true" />
            <h3 className="mt-4 font-semibold text-slate-950">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export function ConstructionEuropeanBlock() {
  return (
    <section className="py-14">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-700">Europa tecnica</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Inteligencia tecnica localizada por pais.</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            A IAWEB nao traduz apenas relatorios. Interpreta a obra segundo o pais tecnico da construcao.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {countryDocuments.map((country) => (
            <article key={country.country} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <Globe2 className="h-5 w-5 text-amber-700" aria-hidden="true" />
              <h3 className="mt-4 font-semibold text-slate-950">{country.country}</h3>
              <div className="mt-4 grid gap-2">
                {country.items.map((item) => (
                  <p key={item} className="rounded-xl bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">{item}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ConstructionUseCases() {
  return (
    <section className="py-14">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-700">Casos de uso</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Preparado para decisoes reais de obra.</h2>
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {useCases.map((item) => (
          <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <Building2 className="h-6 w-6 text-slate-950" aria-hidden="true" />
            <h3 className="mt-4 text-lg font-semibold text-slate-950">{item.title}</h3>
            <div className="mt-4 grid gap-2">
              {item.items.map((line) => (
                <p key={line} className="text-sm leading-6 text-slate-600">{line}</p>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export function ConstructionTrustCenter() {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-xl shadow-slate-950/10 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-300">Trust center</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">Confianca sem certificacoes inventadas.</h2>
        </div>
        <ShieldCheck className="h-10 w-10 text-amber-300" aria-hidden="true" />
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {trustBadges.map((badge) => (
          <div key={badge} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm font-semibold text-slate-100">
            {badge}
          </div>
        ))}
      </div>
    </section>
  )
}

export function ConstructionElementLibrary() {
  const elements = ["Projetos", "Medicoes", "Especialidades", "Cadernos de Encargos", "Riscos", "Prazos", "Custos", "Orcamentos", "Documentacao Tecnica"]

  return (
    <section className="rounded-[2rem] border border-amber-700/15 bg-amber-50/80 p-6 md:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-800">+100 elementos construtivos analisados</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-9">
        {elements.map((item) => (
          <div key={item} className="rounded-2xl border border-amber-900/10 bg-white px-4 py-4 text-sm font-semibold text-slate-800 shadow-sm">
            {item}
          </div>
        ))}
      </div>
      <p className="mt-5 text-sm font-semibold text-slate-700">Tudo numa unica analise.</p>
    </section>
  )
}

export function ConstructionLegalFooter() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-600">
      <div className="flex items-start gap-3">
        <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
        <p>
          Estimativa baseada na documentacao analisada e em dados de mercado disponiveis a data da analise. Nao constitui orcamento vinculativo nem garantia de custo final.
        </p>
      </div>
    </div>
  )
}
