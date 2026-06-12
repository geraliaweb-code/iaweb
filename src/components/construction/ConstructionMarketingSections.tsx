"use client"

import Link from "next/link"
import { ArrowRight, BadgeCheck, BarChart3, Boxes, BrainCircuit, Building2, CloudUpload, Gauge, Globe2, Landmark, LockKeyhole, Maximize, Play, Settings, ShieldCheck, Volume2 } from "lucide-react"
import { useConstructionLocale } from "./useConstructionLocale"

const trustBadges = [
  "IA Especializada em Construcao",
  "Benchmark Europeu",
  "Portugal - France - Espanha",
  "Dados Protegidos RGPD",
  "Infraestrutura Segura",
  "Relatorios Executivos IA",
  "Analise Multidocumento",
  "Construction Intelligence Platform",
  "Desenvolvido na Uniao Europeia",
  "Preparado para mercado europeu",
]

const countryDocuments = [
  { country: "Portugal", flag: "PT", items: ["Mapas de Quantidades", "Caderno de Encargos", "Arquitetura", "Estruturas"] },
  { country: "France", flag: "FR", items: ["CCTP", "DPGF", "DQE", "Plans d'Execution", "Etude de Sol"] },
  { country: "Espana", flag: "ES", items: ["Mediciones", "Presupuesto", "Pliego", "Proyecto Basico"] },
]

const useCases = [
  {
    title: "Moradia Unifamiliar, Portugal",
    items: ["127 paginas analisadas", "Tempo tradicional: 3 a 5 dias", "Tempo IAWEB: poucos minutos", "Documentos em falta identificados"],
  },
  {
    title: "Projeto Residencial, France",
    items: ["Benchmark de mercado frances", "CCTP, DPGF e DQE interpretados", "Riscos documentais destacados", "Nivel de confianca executivo"],
  },
  {
    title: "Gabinete Tecnico, Espanha",
    items: ["Analise documental multidisciplinar", "Cenarios economico, normal e premium", "Prazos provaveis", "Relatorio pronto para reuniao"],
  },
]

const flagClasses: Record<string, string> = {
  PT: "bg-[linear-gradient(90deg,#047857_0_42%,#dc2626_42%)]",
  FR: "bg-[linear-gradient(90deg,#1d4ed8_0_33%,#ffffff_33%_66%,#dc2626_66%)]",
  ES: "bg-[linear-gradient(180deg,#dc2626_0_25%,#facc15_25%_75%,#dc2626_75%)]",
  EU: "bg-blue-700",
}

function Flag({ code }: { code: string }) {
  return <span className={`inline-flex h-4 w-6 rounded-[2px] border border-white/20 shadow-sm ${flagClasses[code]}`} aria-hidden="true" />
}

export function ConstructionTrustBadges() {
  const { copy } = useConstructionLocale()
  const ui = copy.ui
  const badges = [
    { label: ui.trust.platform, body: ui.trust.platformBody, icon: Globe2 },
    { label: ui.trust.data, body: ui.trust.dataBody, icon: ShieldCheck },
    { label: ui.trust.benchmark, body: ui.trust.benchmarkBody, icon: BarChart3 },
    { label: ui.trust.elements, body: ui.trust.elementsBody, icon: Boxes },
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {badges.map((badge) => {
        const Icon = badge.icon
        return (
          <div key={badge.label} className="construction-glass-card rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Icon className="h-6 w-6 text-amber-400" aria-hidden="true" />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-white">{badge.label}</p>
                <p className="mt-1 text-xs font-semibold text-slate-300">{badge.body}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function ConstructionCountrySelector() {
  const { copy } = useConstructionLocale()
  const ui = copy.ui
  return (
    <div className="grid gap-4 border-y border-white/10 py-5 lg:grid-cols-[0.6fr_1fr_1fr_1fr_0.7fr]">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-400">{ui.countries.eyebrow}</p>
      {countryDocuments.map((country) => (
        <div key={country.country} className="flex items-start gap-3">
          <Flag code={country.flag} />
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.12em] text-white">{country.country}</p>
            <p className="mt-1 text-xs leading-5 text-slate-300">{country.items.slice(0, 3).join(", ")}</p>
          </div>
        </div>
      ))}
      <p className="text-xs leading-5 text-slate-300">{ui.countries.helper}</p>
    </div>
  )
}

export function PremiumConstructionHero() {
  const { copy } = useConstructionLocale()
  const ui = copy.ui
  return (
    <section className="grid min-h-[calc(100vh-5rem)] gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-16">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-400">{ui.hero.eyebrow}</p>
        <h1 className="mt-7 max-w-5xl text-5xl font-semibold leading-[1.02] tracking-tight text-white md:text-7xl">
          {ui.hero.titlePrefix} <span className="text-amber-400">{ui.hero.titleHighlight}</span>
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-100">
          {ui.hero.subtitle}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/construction/projects/new" className="inline-flex items-center gap-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-700 px-7 py-4 text-sm font-bold text-white shadow-xl shadow-amber-950/30 transition hover:-translate-y-0.5 hover:from-amber-400 hover:to-amber-600">
            {ui.hero.primary}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link href="/construction/projects/demo" className="inline-flex items-center gap-3 rounded-lg border border-white/25 bg-white/[0.04] px-7 py-4 text-sm font-bold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/[0.08]">
            {ui.hero.secondary}
            <Play className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-9">
          <ConstructionTrustBadges />
        </div>
      </div>

      <div className="construction-glass-card rounded-xl p-5 shadow-2xl shadow-black/40">
        <div className="border-b border-white/10 pb-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white">{ui.hero.executive}</p>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-4">
          {[
            [ui.hero.maturity, "82%", "bg-emerald-400"],
            [ui.hero.risk, "34%", "bg-amber-400"],
            [ui.hero.confidence, "76%", "bg-sky-400"],
            [ui.hero.complexity, "58%", "bg-orange-400"],
          ].map(([label, value, color]) => (
            <div key={label} className="rounded-lg border border-white/10 bg-white/[0.06] p-4">
              <p className="text-[0.65rem] font-bold uppercase text-slate-300">{label}</p>
              <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
              <div className="mt-3 h-2 rounded-full bg-white/10">
                <div className={`h-full rounded-full ${color}`} style={{ width: value }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 border-t border-white/10 pt-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">{ui.hero.estimates}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              [ui.hero.economic, "€ 780 - 920 /m²"],
              [ui.hero.normal, "€ 980 - 1.250 /m²"],
              [ui.hero.premium, "€ 1.350 - 1.750 /m²"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-white/10 bg-white/[0.06] p-4">
                <p className="text-sm font-semibold text-white">{label}</p>
                <p className="mt-4 text-base font-bold text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 border-t border-white/10 pt-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">{ui.hero.market}</p>
          <div className="mt-4 grid gap-3 rounded-lg border border-white/10 bg-white/[0.06] p-4 sm:grid-cols-4">
            <Meta flag="PT" title="Portugal" body="Pais tecnico" />
            <Meta title="Normal" body={ui.hero.segment} icon={Gauge} />
            <Meta title="Leroy Merlin" body={ui.hero.supplier} icon={Landmark} />
            <Meta title="Estrutura" body={ui.hero.category} icon={Building2} />
          </div>
        </div>
      </div>
    </section>
  )
}

function Meta({ title, body, flag, icon: Icon }: { title: string; body: string; flag?: string; icon?: typeof Gauge }) {
  return (
    <div className="flex items-center gap-2">
      {flag ? <Flag code={flag} /> : Icon ? <Icon className="h-5 w-5 text-white" aria-hidden="true" /> : null}
      <div>
        <p className="text-xs font-bold text-white">{title}</p>
        <p className="text-[0.65rem] text-slate-300">{body}</p>
      </div>
    </div>
  )
}

export function ConstructionHowItWorks() {
  const { copy } = useConstructionLocale()
  const ui = copy.ui
  const steps = [
    { title: ui.how.uploadTitle, body: ui.how.uploadBody, icon: CloudUpload },
    { title: ui.how.analyzeTitle, body: ui.how.analyzeBody, icon: BrainCircuit },
    { title: ui.how.receiveTitle, body: ui.how.receiveBody, icon: BarChart3 },
  ]

  return (
    <section id="como-funciona" className="py-14">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-400">{ui.how.eyebrow}</p>
      <div className="mt-3 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div>
          <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-white md:text-4xl">{ui.how.title}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <article key={step.title} className="construction-glass-card rounded-lg p-6">
                  <Icon className="h-8 w-8 text-amber-400" aria-hidden="true" />
                  <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-slate-300">0{index + 1}</p>
                  <h3 className="mt-3 text-base font-semibold text-white">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{step.body}</p>
                </article>
              )
            })}
          </div>
        </div>
        <div>
          <div className="relative aspect-video overflow-hidden rounded-xl border border-white/15 bg-slate-950 shadow-2xl shadow-black/30">
            <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(2,8,23,0.18),rgba(2,8,23,0.78)),url('/brand/construction-hero-8k.jpg')] bg-cover bg-center" />
            <button type="button" className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-white/10 text-white backdrop-blur">
              <Play className="h-9 w-9 fill-white" aria-hidden="true" />
            </button>
            <div className="absolute inset-x-6 bottom-5">
              <div className="mb-3 flex items-center justify-between gap-3 text-xs font-semibold text-white">
                <span className="inline-flex items-center gap-2"><Play className="h-3.5 w-3.5 fill-white" aria-hidden="true" />1:18 / 2:45</span>
                <span className="inline-flex items-center gap-3">
                  <Volume2 className="h-4 w-4" aria-hidden="true" />
                  <Settings className="h-4 w-4" aria-hidden="true" />
                  <Maximize className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-white/25">
                <div className="h-full w-1/2 rounded-full bg-amber-400" />
              </div>
            </div>
          </div>
          <div className="mt-4 border-l-2 border-amber-400 pl-4">
            <h3 className="font-semibold text-white">{ui.how.videoTitle}</h3>
            <p className="mt-1 text-sm text-slate-300">{ui.how.videoBody}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export function ConstructionScenarioSection() {
  return (
    <section className="construction-glass-card grid gap-8 rounded-xl p-6 md:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-400">Estimativa por cenarios</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">Nunca um preco unico exato.</h2>
        <p className="mt-4 text-base leading-7 text-slate-300">
          Estimativa gerada com base na documentacao analisada, benchmark de mercado e referencias reais do setor da construcao.
        </p>
        <p className="mt-3 text-sm font-semibold text-slate-100">Quanto melhor a documentacao, mais precisa a estimativa.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {["Cenario Economico", "Cenario Normal", "Cenario Premium"].map((title) => (
          <article key={title} className="rounded-lg border border-white/10 bg-white/[0.05] p-5">
            <BarChart3 className="h-5 w-5 text-amber-400" aria-hidden="true" />
            <h3 className="mt-4 font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">Faixa de custo calculada por maturidade, risco, complexidade e confianca.</p>
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
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-400">Europa tecnica</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">Inteligencia tecnica localizada por pais.</h2>
          <p className="mt-4 text-base leading-7 text-slate-300">A IAWEB interpreta a obra segundo o pais tecnico da construcao.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {countryDocuments.map((country) => (
            <article key={country.country} className="construction-glass-card rounded-lg p-5">
              <div className="flex items-center gap-3">
                <Flag code={country.flag} />
                <h3 className="font-semibold text-white">{country.country}</h3>
              </div>
              <div className="mt-4 grid gap-2">
                {country.items.map((item) => (
                  <p key={item} className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm font-medium text-slate-200">{item}</p>
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
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-400">Casos de uso</p>
      <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-white">Preparado para decisoes reais de obra.</h2>
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {useCases.map((item) => (
          <article key={item.title} className="construction-glass-card rounded-lg p-6">
            <Building2 className="h-6 w-6 text-amber-400" aria-hidden="true" />
            <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
            <div className="mt-4 grid gap-2">
              {item.items.map((line) => (
                <p key={line} className="text-sm leading-6 text-slate-300">{line}</p>
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
    <section className="construction-glass-card rounded-xl p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-400">Trust center</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">Confianca sem certificacoes inventadas.</h2>
        </div>
        <ShieldCheck className="h-10 w-10 text-amber-400" aria-hidden="true" />
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {trustBadges.map((badge) => (
          <div key={badge} className="rounded-lg border border-white/10 bg-white/[0.05] p-4 text-sm font-semibold text-slate-100">
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
    <section className="construction-glass-card rounded-xl p-6 md:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-400">+100 elementos construtivos analisados</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-9">
        {elements.map((item) => (
          <div key={item} className="rounded-lg border border-white/10 bg-white/[0.05] px-4 py-4 text-sm font-semibold text-slate-100">
            {item}
          </div>
        ))}
      </div>
    </section>
  )
}

export function ConstructionLegalFooter() {
  return (
    <div className="construction-glass-card rounded-lg p-5 text-sm leading-6 text-slate-300">
      <div className="flex items-start gap-3">
        <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden="true" />
        <p>
          Estimativa baseada na documentacao analisada e em dados de mercado disponiveis a data da analise. Nao constitui orcamento vinculativo nem garantia de custo final.
        </p>
      </div>
    </div>
  )
}
