"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, Save, Send, Sparkles } from "lucide-react"
import SitePaletteSelector, { type SitePalette } from "@/components/iaweb/SitePaletteSelector"
import SitePreviewMockup, { type SiteCopy } from "@/components/iaweb/SitePreviewMockup"
import SiteStructurePreview from "@/components/iaweb/SiteStructurePreview"

type SimulatorForm = {
  empresa: string
  nicho: string
  objetivo: string
  tom: string
  website: string
}

type SimulatorResult = {
  palette: SitePalette
  structure: string[]
  copy: SiteCopy
  packageName: string
}

const nicheOptions = ["clinicas", "construcao", "imobiliario", "restaurantes", "industria", "servicos B2B", "comercio local", "outro"]
const toneOptions = ["Premium e confiavel", "Direto e comercial", "Humano e proximo", "Tecnico e especialista", "Moderno e ousado"]
const objectiveOptions = [
  "Gerar mais leads qualificados",
  "Melhorar percecao de valor",
  "Aumentar marcacoes",
  "Receber pedidos de orcamento",
  "Organizar funil comercial",
]

const palettes: Record<string, SitePalette> = {
  clinicas: {
    name: "Azul claro, branco e verde saude",
    colors: ["#eaf7ff", "#0f172a", "#16a34a"],
    labels: ["base clara", "texto forte", "confiança"],
  },
  construcao: {
    name: "Preto, dourado e cinza concreto",
    colors: ["#0b0b0f", "#f8fafc", "#d4a017"],
    labels: ["autoridade", "contraste", "valor"],
  },
  imobiliario: {
    name: "Azul navy, branco e dourado",
    colors: ["#071a3a", "#ffffff", "#c9a227"],
    labels: ["prestigio", "clareza", "premium"],
  },
  restaurantes: {
    name: "Preto, creme e vermelho vinho",
    colors: ["#111111", "#fff7ed", "#8b1e3f"],
    labels: ["ambiente", "calor", "apetite"],
  },
  industria: {
    name: "Grafite, azul eletrico e prata",
    colors: ["#151922", "#f8fafc", "#2f80ed"],
    labels: ["robustez", "precisao", "energia"],
  },
  "servicos B2B": {
    name: "Azul profundo, branco e teal",
    colors: ["#07111f", "#ffffff", "#14b8a6"],
    labels: ["confiança", "clareza", "crescimento"],
  },
  "comercio local": {
    name: "Verde, branco e carvao",
    colors: ["#14532d", "#ffffff", "#1f2937"],
    labels: ["proximidade", "clareza", "solidez"],
  },
  outro: {
    name: "Preto, azul eletrico e branco",
    colors: ["#030712", "#ffffff", "#38bdf8"],
    labels: ["premium", "contraste", "acao"],
  },
}

const nicheLabels: Record<string, string> = {
  clinicas: "clinica",
  construcao: "empresa de construcao",
  imobiliario: "marca imobiliaria",
  restaurantes: "restaurante",
  industria: "empresa industrial",
  "servicos B2B": "empresa de servicos B2B",
  "comercio local": "comercio local",
  outro: "empresa",
}

const defaultForm: SimulatorForm = {
  empresa: "",
  nicho: "outro",
  objetivo: "Gerar mais leads qualificados",
  tom: "Premium e confiavel",
  website: "",
}

function normalizeNiche(value: string | null) {
  if (!value) return "outro"
  const normalized = value.trim()
  return nicheOptions.includes(normalized) ? normalized : "outro"
}

function getPackage(niche: string, objective: string) {
  if (objective.includes("orcamento")) return "Sistema Comercial"
  if (objective.includes("funil")) return "IAWEB Growth Engine"
  if (niche === "comercio local" || niche === "restaurantes") return "Homepage Premium desde EUR 299"
  if (niche === "industria" || niche === "servicos B2B") return "IAWEB Growth Engine"
  return "Website Profissional"
}

function buildSimulation(form: SimulatorForm): SimulatorResult {
  const company = form.empresa.trim() || "A sua empresa"
  const label = nicheLabels[form.nicho] ?? "empresa"
  const objective = form.objetivo.toLowerCase()
  const palette = palettes[form.nicho] ?? palettes.outro

  const serviceMap: Record<string, string[]> = {
    clinicas: ["Marcacoes online", "Tratamentos principais", "Equipa clinica", "Contacto rapido"],
    construcao: ["Obras realizadas", "Pedidos de orcamento", "Especialidades", "Garantias"],
    imobiliario: ["Imoveis em destaque", "Avaliacao gratuita", "Consultoria", "Contactos rapidos"],
    restaurantes: ["Menu e reservas", "Experiencia", "Eventos privados", "Localizacao"],
    industria: ["Capacidades tecnicas", "Setores servidos", "Certificacoes", "Pedido de contacto"],
    "servicos B2B": ["Servico principal", "Casos de uso", "Processo comercial", "Diagnostico"],
    "comercio local": ["Produtos estrela", "Promocoes", "Prova local", "WhatsApp"],
    outro: ["Oferta principal", "Beneficios", "Processo", "Contacto"],
  }

  const structure = [
    "Hero com promessa clara e CTA direto",
    "Blocos de servicos orientados a decisao",
    "Diferenciais e prova de confianca",
    "Prova social e resultados ficticios para mockup",
    "CTA final com contacto ou pedido de proposta",
  ]

  const copy: SiteCopy = {
    headline:
      objective.includes("marcacoes")
        ? `${company}: mais marcacoes com uma presenca digital que transmite confianca.`
        : objective.includes("orcamento")
          ? `${company}: transformar visitantes em pedidos de orcamento qualificados.`
          : `${company}: uma homepage premium para gerar mais clientes no setor ${label}.`,
    subheadline: `Simulacao inicial com tom ${form.tom.toLowerCase()}, criada para posicionar a marca, explicar valor rapidamente e conduzir o visitante para uma acao comercial.`,
    cta: objective.includes("orcamento") ? "Pedir orcamento" : objective.includes("marcacoes") ? "Marcar avaliacao" : "Falar com a equipa",
    services: serviceMap[form.nicho] ?? serviceMap.outro,
    differentiators: [
      "Mensagem clara nos primeiros cinco segundos.",
      "CTA visivel em todos os momentos importantes.",
      "Estrutura pensada para decisao e nao apenas estetica.",
    ],
    testimonial: `A equipa percebeu rapidamente o valor da ${company} e criou uma experiencia muito mais clara para quem chega pelo Google ou redes sociais.`,
    finalCta: `Pronto para transformar a presenca digital da ${company}?`,
  }

  return {
    palette,
    structure,
    copy,
    packageName: getPackage(form.nicho, form.objetivo),
  }
}

function inputClass() {
  return "mt-2 h-12 w-full rounded-2xl border border-white/10 bg-white/[0.065] px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-200/40 focus:bg-white/[0.095] focus:ring-4 focus:ring-cyan-300/10"
}

export default function SiteSimulator() {
  const searchParams = useSearchParams()
  const [form, setForm] = useState<SimulatorForm>(defaultForm)
  const [result, setResult] = useState<SimulatorResult | null>(null)
  const [logoPreview, setLogoPreview] = useState("")
  const [saveStatus, setSaveStatus] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    setForm((current) => ({
      ...current,
      empresa: searchParams.get("empresa") ?? current.empresa,
      nicho: normalizeNiche(searchParams.get("nicho")) || current.nicho,
      objetivo: searchParams.get("objetivo") ?? current.objetivo,
      website: searchParams.get("website") ?? current.website,
    }))
  }, [searchParams])

  const proposalParams = useMemo(() => {
    const params = new URLSearchParams()
    if (form.empresa.trim()) params.set("empresa", form.empresa.trim())
    if (form.nicho.trim()) params.set("nicho", form.nicho.trim())
    if (form.objetivo.trim()) params.set("objetivo", form.objetivo.trim())
    if (form.website.trim()) params.set("website", form.website.trim())
    return params.toString()
  }, [form])

  function updateField(field: keyof SimulatorForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function handleLogoUpload(file: File | null) {
    if (!file) {
      setLogoPreview("")
      return
    }

    const reader = new FileReader()
    reader.onload = () => setLogoPreview(typeof reader.result === "string" ? reader.result : "")
    reader.readAsDataURL(file)
  }

  async function handleGenerate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaveStatus("")
    setIsGenerating(true)
    await new Promise((resolve) => setTimeout(resolve, 320))
    setResult(buildSimulation(form))
    setIsGenerating(false)
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030712] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(14,165,233,0.18),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(245,158,11,0.12),transparent_28%),linear-gradient(180deg,rgba(3,7,18,0),#030712_78%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />
      </div>

      <section className="relative z-10 px-5 py-6 sm:px-8 lg:px-12">
        <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 shadow-[0_18px_70px_rgba(0,0,0,0.32)] backdrop-blur-2xl">
          <Link href="/demo" className="inline-flex items-center gap-2 text-sm font-bold text-slate-200 transition hover:text-white">
            <ArrowLeft size={15} />
            Voltar a Demo
          </Link>
          <span className="rounded-full border border-cyan-200/15 bg-cyan-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-cyan-100">
            Simulador Site
          </span>
        </nav>

        <div className="mx-auto grid max-w-7xl gap-8 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:py-16">
          <div className="lg:sticky lg:top-6 lg:self-start">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.08] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-cyan-100">
              <Sparkles size={14} />
              Sprint 2 Growth Engine
            </div>
            <h1 className="text-4xl font-black leading-[0.98] tracking-[-0.055em] text-white sm:text-6xl">
              Simular uma homepage premium em tempo real.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300">
              Gere uma proposta visual para mostrar direcao criativa, estrutura, copy inicial e pacote recomendado em
              reunioes comerciais.
            </p>

            <form onSubmit={handleGenerate} className="mt-8 rounded-[26px] border border-white/10 bg-white/[0.055] p-5 shadow-[0_24px_100px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-bold text-slate-300">Nome da empresa</span>
                  <input value={form.empresa} onChange={(event) => updateField("empresa", event.target.value)} placeholder="Ex: Clinica Central" className={inputClass()} />
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-slate-300">Nicho</span>
                  <select value={form.nicho} onChange={(event) => updateField("nicho", event.target.value)} className={`${inputClass()} bg-[#0b1220]`}>
                    {nicheOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-slate-300">Objetivo principal</span>
                  <select value={form.objetivo} onChange={(event) => updateField("objetivo", event.target.value)} className={`${inputClass()} bg-[#0b1220]`}>
                    {objectiveOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-slate-300">Tom da marca</span>
                  <select value={form.tom} onChange={(event) => updateField("tom", event.target.value)} className={`${inputClass()} bg-[#0b1220]`}>
                    {toneOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-sm font-bold text-slate-300">Website atual</span>
                  <input value={form.website} onChange={(event) => updateField("website", event.target.value)} placeholder="https://empresa.pt" className={inputClass()} />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-sm font-bold text-slate-300">Logo/imagem opcional</span>
                  <div className="mt-2 flex min-h-12 items-center gap-3 rounded-2xl border border-dashed border-white/15 bg-white/[0.045] px-4 py-3">
                    <ImagePlus size={18} className="text-cyan-100" />
                    <input type="file" accept="image/*" onChange={(event) => handleLogoUpload(event.target.files?.[0] ?? null)} className="text-sm text-slate-300 file:mr-4 file:rounded-xl file:border-0 file:bg-white file:px-3 file:py-2 file:text-sm file:font-bold file:text-[#07111F]" />
                  </div>
                  <span className="mt-2 block text-xs text-slate-500">Campo visual apenas no browser. Sem backend nesta fase.</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-black text-[#07111F] shadow-[0_16px_60px_rgba(78,140,255,0.22)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                Gerar Simulacao
              </button>
            </form>
          </div>

          <div className="space-y-5">
            {result ? (
              <>
                <SitePreviewMockup
                  company={form.empresa}
                  niche={form.nicho}
                  logoPreview={logoPreview}
                  palette={result.palette}
                  copy={result.copy}
                />
                <div className="grid gap-5 xl:grid-cols-2">
                  <SitePaletteSelector palette={result.palette} />
                  <SiteStructurePreview structure={result.structure} packageName={result.packageName} />
                </div>
                <section className="grid gap-3 md:grid-cols-3">
                  <Link
                    href={`/proposta${proposalParams ? `?${proposalParams}` : ""}`}
                    className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-[#07111F] transition hover:-translate-y-0.5"
                  >
                    <Send size={16} />
                    Gerar Proposta
                  </Link>
                  <button
                    type="button"
                    onClick={() => setSaveStatus("TODO: guardar simulacao quando existir backend/schema proprio.")}
                    className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm font-black text-emerald-100 transition hover:bg-emerald-300/15"
                  >
                    <Save size={16} />
                    Guardar Simulacao
                  </button>
                  <Link
                    href="/demo"
                    className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-cyan-200/20 bg-cyan-300/10 px-4 py-3 text-sm font-black text-cyan-100 transition hover:bg-cyan-300/15"
                  >
                    <ArrowLeft size={16} />
                    Voltar a Demo
                  </Link>
                </section>
                {saveStatus ? (
                  <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm leading-6 text-slate-300">{saveStatus}</div>
                ) : null}
              </>
            ) : (
              <section className="flex min-h-[34rem] flex-col justify-between rounded-[26px] border border-white/10 bg-white/[0.055] p-6 shadow-[0_24px_100px_rgba(0,0,0,0.34)] backdrop-blur-2xl">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-sky-100">
                    <ImagePlus size={14} />
                    Preview preparado
                  </div>
                  <h2 className="mt-5 text-3xl font-black tracking-[-0.04em] text-white">
                    Preencha os dados e mostre ao cliente como a marca pode parecer.
                  </h2>
                  <p className="mt-4 max-w-2xl leading-7 text-slate-400">
                    O simulador gera paleta, estrutura e copy inicial sem IA externa. Ideal para alinhar expectativa e
                    acelerar a decisao comercial.
                  </p>
                </div>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {["Mockup browser", "Paleta por nicho", "CTA para proposta"].map((item) => (
                    <div key={item} className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm font-bold text-slate-200">
                      {item}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
