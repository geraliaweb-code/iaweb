"use client"

import { FormEvent, useEffect, useMemo, useRef, useState } from "react"
import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from "lenis"
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  Download,
  ExternalLink,
  Layers3,
  Loader2,
  Radar,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react"
import type { DiagnosticoFormData, DiagnosticoResult, ScoreCategory } from "@/lib/diagnostico"
import { downloadDiagnosticoPdf } from "./pdf"

const setores = [
  "Clinica / Saude",
  "Imobiliario / Construcao",
  "Consultoria / Servicos B2B",
  "Advocacia / Contabilidade",
  "Estetica / Bem-estar",
  "Turismo / Alojamento",
  "Servicos tecnicos",
  "Educacao / Formacao",
  "Industria",
  "Outro",
]

const objetivos = [
  "Mais contactos",
  "Melhorar website",
  "Aparecer no Google",
  "Automatizar tarefas",
  "Organizar leads",
  "Nao sei por onde comecar",
]

const categoryLabels: Record<ScoreCategory, string> = {
  website: "Website",
  google: "Google",
  conversao: "Conversao",
  automacao: "Automacao",
}

const initialForm: DiagnosticoFormData = {
  nome: "",
  empresa: "",
  email: "",
  whatsapp: "",
  website: "",
  setor: "",
  objetivo: "",
}

const previewScores = [
  ["Website", 72],
  ["Google", 48],
  ["Conversao", 57],
  ["Automacao", 18],
] as const

const reveal = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0 },
}

export default function DiagnosticoDigital() {
  const [formData, setFormData] = useState<DiagnosticoFormData>(initialForm)
  const [result, setResult] = useState<DiagnosticoResult | null>(null)
  const [submittedFormData, setSubmittedFormData] = useState<DiagnosticoFormData | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const syncedLeadKeys = useRef<Set<string>>(new Set())

  usePremiumScrollEffects()

  const sortedScores = useMemo(() => {
    if (!result) return []

    return (Object.entries(result.categorias) as Array<[ScoreCategory, number]>).sort((a, b) => a[1] - b[1])
  }, [result])

  useEffect(() => {
    if (!result || !submittedFormData) return

    const leadKey = result.id ?? `${submittedFormData.email}-${result.createdAt}-${result.scoreFinal}`

    if (syncedLeadKeys.current.has(leadKey)) return
    syncedLeadKeys.current.add(leadKey)

    async function syncLeadToCommercialFunnel() {
      try {
        const response = await fetch("/api/diagnostico/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ formData: submittedFormData, result }),
        })

        if (!response.ok) {
          const data = await response.json().catch(() => null)
          console.warn("Nao foi possivel guardar o diagnostico no funil comercial.", data)
        }
      } catch (syncError) {
        console.warn("Falha ao sincronizar diagnostico com o funil comercial.", syncError)
      }
    }

    void syncLeadToCommercialFunnel()
  }, [result, submittedFormData])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError("")
    setResult(null)
    setSubmittedFormData(null)
    const submittedData = { ...formData }

    try {
      const response = await fetch("/api/diagnostico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submittedData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error ?? "Nao foi possivel gerar o diagnostico.")
        return
      }

      setSubmittedFormData(submittedData)
      setResult(data as DiagnosticoResult)
    } catch {
      setError("Nao foi possivel ligar ao motor de diagnostico. Tenta novamente.")
    } finally {
      setSubmitting(false)
    }
  }

  function updateField(field: keyof DiagnosticoFormData, value: string) {
    setFormData((current) => ({ ...current, [field]: value }))
  }

  function handleDownloadPdf() {
    if (!result) return

    downloadDiagnosticoPdf({ formData: submittedFormData ?? formData, result })
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#04070f] text-white">
      <ScrollProgress />
      <PremiumBackground />

      <section className="relative px-5 py-6 sm:px-8 lg:px-12">
        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 shadow-[0_18px_70px_rgba(0,0,0,0.32)] backdrop-blur-2xl">
          <a href="/" className="text-sm font-black tracking-[-0.02em] text-white">
            IAWEB
          </a>
          <a
            href="#diagnostico-form"
            className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white px-4 py-2 text-sm font-bold text-[#07111F] shadow-[0_0_35px_rgba(78,140,255,0.18)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_55px_rgba(78,140,255,0.28)] focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            Receber diagnostico
            <ArrowRight size={15} className="transition group-hover:translate-x-0.5" />
          </a>
        </nav>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 py-16 lg:grid-cols-[1.04fr_0.96fr] lg:items-center lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.08] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-cyan-100 shadow-[0_0_34px_rgba(34,211,238,0.12)]">
              <Sparkles size={14} />
              Diagnostico Digital Gratuito
            </div>
            <TextReveal
              as="h1"
              className="max-w-4xl text-4xl font-black leading-[0.97] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl"
              text="Descubra quantos clientes a sua empresa esta a perder todos os meses."
            />
            <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Receba um Diagnostico Digital Gratuito e veja onde melhorar website, Google, conversao e automacao para
              gerar mais contactos.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <MagneticLink href="#diagnostico-form" variant="primary">
                Gerar diagnostico gratuito
                <ArrowRight size={17} />
              </MagneticLink>
              <MagneticLink href="#como-funciona" variant="secondary">
                Ver como funciona
              </MagneticLink>
            </div>

            <div className="mt-9 grid max-w-2xl gap-3 sm:grid-cols-3">
              {[
                ["CRM", "Lead guardada"],
                ["0-100", "Score imediato"],
                ["4 areas", "Analise completa"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 backdrop-blur-xl">
                  <div className="text-xl font-black tracking-tight text-white">{value}</div>
                  <div className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-slate-400">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="parallax-soft relative"
            data-parallax="-7"
          >
            <FloatingChip className="-left-4 top-10 hidden lg:flex" label="Google visibility" value="+31%" />
            <FloatingChip className="-right-5 bottom-24 hidden lg:flex" label="Lead friction" value="-42%" />
            <ScorePreviewCard />
          </motion.div>
        </div>
      </section>

      <RevealSection id="como-funciona" className="relative px-5 py-12 sm:px-8 lg:px-12">
        <SectionHeader
          eyebrow="Como funciona"
          title="Um diagnostico simples, com leitura de negocio."
          text="A experiencia foi desenhada para converter uma submissao curta num mapa claro de prioridades digitais."
        />
        <div className="mx-auto mt-10 grid max-w-7xl gap-4 md:grid-cols-3">
          {[
            ["01", "Preenche o formulario", "Recolhemos os sinais essenciais: empresa, website, setor e objetivo."],
            ["02", "Calculamos o score", "O motor avalia Website, Google, Conversao e Automacao sem alterar a logica existente."],
            ["03", "Recebes prioridades", "O resultado mostra potencial, classificacao e recomendacoes automaticas."],
          ].map(([step, title, text]) => (
            <GlassCard key={step}>
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.07] text-sm font-black text-cyan-100">
                {step}
              </div>
              <h3 className="text-xl font-bold tracking-tight text-white">{title}</h3>
              <p className="mt-3 leading-7 text-slate-400">{text}</p>
            </GlassCard>
          ))}
        </div>
      </RevealSection>

      <RevealSection className="relative px-5 py-12 sm:px-8 lg:px-12">
        <SectionHeader
          eyebrow="O que analisamos"
          title="As quatro alavancas que fazem uma empresa ganhar ou perder contactos."
          text="Nada de relatorios decorativos: cada area aponta para um bloqueio real na jornada do cliente."
        />
        <div className="mx-auto mt-10 grid max-w-7xl gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            [Radar, "Website", "Clareza, velocidade percebida, estrutura e confianca."],
            [BarChart3, "Google", "Presenca local, descoberta organica e sinais de autoridade."],
            [Layers3, "Conversao", "CTA, friccao, oferta e capacidade de transformar visitas em leads."],
            [Workflow, "Automacao", "Seguimento, organizacao de contactos e reducao de trabalho manual."],
          ].map(([Icon, title, text]) => (
            <GlassCard key={String(title)} compact>
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-200 ring-1 ring-cyan-200/15">
                <Icon size={19} />
              </div>
              <h3 className="text-lg font-bold text-white">{String(title)}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{String(text)}</p>
            </GlassCard>
          ))}
        </div>
      </RevealSection>

      <section id="diagnostico-form" className="gsap-section relative px-5 py-14 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-[28px] border border-white/10 bg-white/[0.065] p-5 shadow-[0_24px_100px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-8"
          >
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-200">Motor de diagnostico</p>
            <TextReveal
              as="h2"
              className="mt-4 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl"
              text="Receber Diagnostico Gratuito"
            />
            <p className="mt-4 leading-7 text-slate-400">
              Preencha os dados. O resultado so aparece depois de a lead ser guardada no Supabase com data, score final e
              categorias.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Nome" value={formData.nome} onChange={(value) => updateField("nome", value)} />
                <Field label="Empresa" value={formData.empresa} onChange={(value) => updateField("empresa", value)} />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(value) => updateField("email", value)}
                />
                <Field
                  label="WhatsApp"
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(value) => updateField("whatsapp", value)}
                />
              </div>
              <Field label="Website" value={formData.website} onChange={(value) => updateField("website", value)} />
              <div className="grid gap-5 sm:grid-cols-2">
                <SelectField label="Setor" value={formData.setor} options={setores} onChange={(value) => updateField("setor", value)} />
                <SelectField
                  label="Objetivo"
                  value={formData.objetivo}
                  options={objetivos}
                  onChange={(value) => updateField("objetivo", value)}
                />
              </div>

              {error ? (
                <div className="rounded-2xl border border-red-300/20 bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-100">
                  {error}
                </div>
              ) : null}

              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ y: submitting ? 0 : -2, scale: submitting ? 1 : 1.01 }}
                whileTap={{ scale: submitting ? 1 : 0.99 }}
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-black text-[#07111F] shadow-[0_16px_60px_rgba(78,140,255,0.22)] transition focus:outline-none focus:ring-2 focus:ring-white/30 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    A guardar lead...
                  </>
                ) : (
                  <>
                    Gerar diagnostico
                    <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
                  </>
                )}
              </motion.button>
              <p className="text-center text-xs text-slate-500">Sem compromisso. Os dados entram no CRM da IAWEB.</p>
            </form>
          </motion.div>

          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.58, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-[28px] border border-white/10 bg-white/[0.065] p-5 shadow-[0_24px_100px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-8"
          >
            {result ? (
              <motion.div
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex flex-col gap-6 border-b border-white/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-emerald-100">
                      <ShieldCheck size={14} />
                      Lead guardada no Supabase
                    </p>
                    <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-white">Resultado do diagnostico</h2>
                  </div>
                  <ScoreOrb score={result.scoreFinal} label="Presenca Digital" />
                </div>

                <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-5">
                  <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-base font-bold text-white">{result.classificacao.label}</span>
                    <span className="text-sm font-bold text-cyan-200">{result.potencialEstimado}</span>
                  </div>
                  <ProgressBar score={result.scoreFinal} large />
                  <p className="mt-5 leading-7 text-slate-300">{result.classificacao.message}</p>
                </div>

                <div className="mt-6 space-y-4">
                  {sortedScores.map(([key, score]) => (
                    <ScoreBar key={key} label={categoryLabels[key]} score={score} />
                  ))}
                </div>

                <div className="mt-8 rounded-3xl border border-cyan-200/15 bg-cyan-300/[0.055] p-5">
                  <h3 className="font-bold text-white">Recomendacoes automaticas</h3>
                  <ul className="mt-4 space-y-3">
                    {result.recomendacoes.map((recommendation) => (
                      <li key={recommendation} className="flex gap-3 text-sm leading-6 text-slate-300">
                        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-300" />
                        {recommendation}
                      </li>
                    ))}
                  </ul>
                </div>

                <motion.button
                  type="button"
                  onClick={handleDownloadPdf}
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white px-6 py-4 text-sm font-black text-[#07111F] shadow-[0_18px_70px_rgba(255,255,255,0.12)] transition focus:outline-none focus:ring-2 focus:ring-white/40"
                >
                  Baixar Relatório Estratégico
                  <Download size={16} />
                </motion.button>

                <motion.a
                  href="https://wa.me/351913837004?text=Ol%C3%A1%2C+recebi+o+Diagn%C3%B3stico+Digital+Gratuito+e+quero+agendar+o+Diagn%C3%B3stico+Estrat%C3%A9gico+Gratuito."
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-200 px-6 py-4 text-sm font-black text-[#041018] shadow-[0_18px_70px_rgba(34,211,238,0.22)] transition focus:outline-none focus:ring-2 focus:ring-cyan-100/40"
                >
                  Agendar Diagnostico Estrategico Gratuito
                  <ExternalLink size={16} />
                </motion.a>
              </motion.div>
            ) : (
              <EmptyResultState />
            )}
          </motion.div>
        </div>
      </section>

      <RevealSection className="relative px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[0.92fr_1.08fr]">
          <GlassCard>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-200">Depois do diagnostico</p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
              Transformamos o score num plano de crescimento.
            </h2>
            <p className="mt-4 leading-7 text-slate-400">
              O diagnostico mostra as fugas. A conversa estrategica seguinte define o que atacar primeiro para melhorar
              contactos, conversao e velocidade comercial.
            </p>
          </GlassCard>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Prioridade", "O que deve ser corrigido primeiro"],
              ["Impacto", "Onde ha maior potencial de contactos"],
              ["Roadmap", "Proximas acoes sem complicar"],
            ].map(([title, text]) => (
              <GlassCard key={title} compact>
                <div className="text-lg font-black text-white">{title}</div>
                <p className="mt-3 text-sm leading-6 text-slate-400">{text}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </RevealSection>

      <RevealSection className="relative px-5 pb-24 pt-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.07] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.4)] backdrop-blur-2xl sm:p-10 lg:p-12">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-200">Credibilidade</p>
              <h2 className="mt-4 max-w-3xl text-3xl font-black tracking-[-0.045em] text-white sm:text-5xl">
                Um diagnostico visualmente simples para decisoes que valem dinheiro.
              </h2>
              <p className="mt-5 max-w-2xl leading-8 text-slate-300">
                A IAWEB cruza presenca digital, automacao e conversao para encontrar oportunidades praticas em empresas
                que querem crescer sem aumentar complexidade.
              </p>
              <div className="mt-8">
                <MagneticLink href="#diagnostico-form" variant="primary">
                  Comecar agora
                  <ArrowRight size={17} />
                </MagneticLink>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Supabase", "Registo estruturado da lead"],
                ["Score 0-100", "Leitura objetiva por categoria"],
                ["WhatsApp CTA", "Proximo passo comercial claro"],
                ["Recomendacoes", "Acoes automaticas por maturidade"],
              ].map(([title, text]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <div className="font-bold text-white">{title}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </RevealSection>
    </main>
  )
}

function PremiumBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(80,92,255,0.24),transparent_30%),radial-gradient(circle_at_50%_85%,rgba(14,165,233,0.12),transparent_34%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />
      <motion.div
        animate={{ x: [0, 28, -12, 0], y: [0, -24, 18, 0], scale: [1, 1.08, 0.98, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[-10rem] top-24 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -24, 16, 0], y: [0, 30, -14, 0], scale: [1, 0.96, 1.08, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 right-[-8rem] h-96 w-96 rounded-full bg-blue-600/25 blur-3xl"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,7,15,0)_0%,rgba(4,7,15,0.74)_72%,#04070f_100%)]" />
    </div>
  )
}

function ScrollProgress() {
  return (
    <div className="fixed left-0 top-0 z-50 h-1 w-full origin-left bg-transparent">
      <div
        id="scroll-progress"
        className="h-full origin-left scale-x-0 bg-gradient-to-r from-cyan-200 via-blue-400 to-violet-400 shadow-[0_0_24px_rgba(34,211,238,0.7)]"
      />
    </div>
  )
}

function usePremiumScrollEffects() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (reduceMotion) return

    gsap.registerPlugin(ScrollTrigger)

    const lenis = new Lenis({
      duration: 1.08,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.92,
    })

    lenis.on("scroll", ScrollTrigger.update)

    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    const ctx = gsap.context(() => {
      gsap.to("#scroll-progress", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          start: 0,
          end: "max",
          scrub: 0.2,
        },
      })

      gsap.utils.toArray<HTMLElement>(".word-reveal-line").forEach((line) => {
        const words = line.querySelectorAll(".word-reveal-word")
        gsap.fromTo(
          words,
          { yPercent: 110, rotateX: -35, opacity: 0, filter: "blur(12px)" },
          {
            yPercent: 0,
            rotateX: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.9,
            ease: "power4.out",
            stagger: 0.045,
            scrollTrigger: {
              trigger: line,
              start: "top 86%",
              once: true,
            },
          },
        )
      })

      gsap.utils.toArray<HTMLElement>(".gsap-section").forEach((section) => {
        gsap.fromTo(
          section,
          { autoAlpha: 0, y: 76, filter: "blur(16px)" },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 82%",
              once: true,
            },
          },
        )
      })

      gsap.utils.toArray<HTMLElement>(".parallax-soft").forEach((element) => {
        const distance = Number(element.dataset.parallax ?? -8)
        gsap.to(element, {
          yPercent: distance,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        })
      })

      gsap.utils.toArray<HTMLElement>(".premium-hover").forEach((card) => {
        const onMove = (event: MouseEvent) => {
          const rect = card.getBoundingClientRect()
          const x = ((event.clientX - rect.left) / rect.width) * 100
          const y = ((event.clientY - rect.top) / rect.height) * 100
          card.style.setProperty("--mx", `${x}%`)
          card.style.setProperty("--my", `${y}%`)
        }

        card.addEventListener("mousemove", onMove)
        card.addEventListener("mouseleave", () => {
          card.style.setProperty("--mx", "50%")
          card.style.setProperty("--my", "0%")
        })
      })
    })

    ScrollTrigger.refresh()

    return () => {
      cancelAnimationFrame(frame)
      ctx.revert()
      lenis.destroy()
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])
}

function ScorePreviewCard() {
  return (
    <div className="premium-hover relative rounded-[32px] border border-white/10 bg-white/[0.07] p-5 shadow-[0_35px_130px_rgba(0,0,0,0.42)] backdrop-blur-2xl before:pointer-events-none before:absolute before:inset-0 before:rounded-[32px] before:bg-[radial-gradient(circle_at_var(--mx,50%)_var(--my,0%),rgba(255,255,255,0.18),transparent_34%)] before:opacity-0 before:transition before:duration-500 hover:before:opacity-100 sm:p-6">
      <div className="absolute inset-px rounded-[31px] bg-[linear-gradient(135deg,rgba(255,255,255,0.16),transparent_34%,rgba(34,211,238,0.1))]" />
      <div className="relative">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Preview do score</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-white">Presenca Digital</h2>
          </div>
          <div className="rounded-2xl border border-cyan-200/15 bg-cyan-300/10 p-3 text-cyan-100">
            <BarChart3 size={24} />
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="text-sm font-semibold text-slate-400">Exemplo estimado</span>
              <p className="mt-2 text-sm text-slate-500">Oportunidades escondidas no funil digital.</p>
            </div>
            <ScoreOrb score={62} label="Score" compact />
          </div>
          <div className="mt-6 space-y-4">
            {previewScores.map(([label, score]) => (
              <ScoreBar key={label} label={label} score={score} />
            ))}
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-emerald-200/15 bg-emerald-300/10 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-100">Potencial</p>
            <p className="mt-1 text-2xl font-black text-white">+15% a +35%</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Tempo</p>
            <p className="mt-1 text-2xl font-black text-white">Imediato</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function EmptyResultState() {
  return (
    <div className="flex h-full min-h-[34rem] flex-col justify-between rounded-3xl border border-white/10 bg-black/20 p-6">
      <div>
        <p className="inline-flex items-center gap-2 rounded-full border border-cyan-200/15 bg-cyan-300/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-cyan-100">
          <Clock3 size={14} />
          Resultado
        </p>
        <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-white">
          O score aparece aqui depois da gravacao no Supabase.
        </h2>
        <p className="mt-4 leading-7 text-slate-400">
          O motor calcula Website, Google, Conversao e Automacao para gerar a Presenca Digital Geral de 0 a 100.
        </p>
      </div>
      <div className="mt-10 space-y-4">
        {["Website", "Google", "Conversao", "Automacao"].map((label, index) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.055] p-4">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-300">{label}</span>
              <span className="text-slate-500">--/100</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
              <motion.div
                animate={{ x: ["-100%", "115%"] }}
                transition={{ duration: 1.9, delay: index * 0.16, repeat: Infinity, ease: "easeInOut" }}
                className="h-full w-1/2 rounded-full bg-gradient-to-r from-transparent via-cyan-200/35 to-transparent"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RevealSection({
  children,
  className,
  id,
}: {
  children: React.ReactNode
  className?: string
  id?: string
}) {
  return (
    <motion.section
      id={id}
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-90px" }}
      transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
      className={`gsap-section ${className ?? ""}`}
    >
      {children}
    </motion.section>
  )
}

function SectionHeader({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div className="mx-auto max-w-7xl">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-200">{eyebrow}</p>
      <TextReveal
        as="h2"
        className="mt-4 max-w-3xl text-3xl font-black tracking-[-0.045em] text-white sm:text-5xl"
        text={title}
      />
      <p className="mt-5 max-w-2xl leading-8 text-slate-400">{text}</p>
    </div>
  )
}

function TextReveal({
  text,
  className,
  as = "h2",
}: {
  text: string
  className?: string
  as?: "h1" | "h2"
}) {
  const Tag = as
  const words = text.split(" ")

  return (
    <Tag className={`word-reveal-line ${className ?? ""}`}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="inline-block overflow-hidden align-bottom">
          <span className="word-reveal-word inline-block will-change-transform">
            {word}
            {index < words.length - 1 ? "\u00a0" : ""}
          </span>
        </span>
      ))}
    </Tag>
  )
}

function GlassCard({ children, compact = false }: { children: React.ReactNode; compact?: boolean }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className={`premium-hover relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.06] shadow-[0_20px_80px_rgba(0,0,0,0.22)] backdrop-blur-2xl before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_var(--mx,50%)_var(--my,0%),rgba(34,211,238,0.14),transparent_36%)] before:opacity-0 before:transition before:duration-500 hover:before:opacity-100 ${
        compact ? "p-5" : "p-6"
      }`}
    >
      <div className="relative">{children}</div>
    </motion.div>
  )
}

function FloatingChip({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
      className={`absolute z-20 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-3 shadow-[0_20px_70px_rgba(0,0,0,0.36)] backdrop-blur-2xl ${className}`}
    >
      <div className="h-2 w-2 rounded-full bg-cyan-200 shadow-[0_0_18px_rgba(103,232,249,0.9)]" />
      <div>
        <p className="text-xs font-semibold text-slate-400">{label}</p>
        <p className="text-sm font-black text-white">{value}</p>
      </div>
    </motion.div>
  )
}

function MagneticLink({
  href,
  children,
  variant,
}: {
  href: string
  children: React.ReactNode
  variant: "primary" | "secondary"
}) {
  const ref = useRef<HTMLAnchorElement | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const primary =
    "bg-white text-[#07111F] shadow-[0_18px_70px_rgba(78,140,255,0.22)] hover:shadow-[0_22px_90px_rgba(78,140,255,0.32)]"
  const secondary = "border border-white/10 bg-white/[0.06] text-white backdrop-blur-xl hover:bg-white/[0.1]"

  function handleMouseMove(event: React.MouseEvent<HTMLAnchorElement>) {
    const element = ref.current
    if (!element) return

    const rect = element.getBoundingClientRect()
    x.set((event.clientX - rect.left - rect.width / 2) * 0.22)
    y.set((event.clientY - rect.top - rect.height / 2) * 0.35)
  }

  function handleMouseLeave() {
    animate(x, 0, { duration: 0.45, ease: [0.22, 1, 0.36, 1] })
    animate(y, 0, { duration: 0.45, ease: [0.22, 1, 0.36, 1] })
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      style={{ x, y }}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-black transition focus:outline-none focus:ring-2 focus:ring-white/30 ${
        variant === "primary" ? primary : secondary
      }`}
    >
      {children}
    </motion.a>
  )
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-300">{label}</span>
      <input
        required
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-white/[0.075] px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-200/40 focus:bg-white/[0.105] focus:ring-4 focus:ring-cyan-300/10"
      />
    </label>
  )
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-300">{label}</span>
      <select
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-[#111827] px-4 text-sm text-white outline-none transition focus:border-cyan-200/40 focus:ring-4 focus:ring-cyan-300/10"
      >
        <option value="">Selecionar</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="font-bold text-slate-300">{label}</span>
        <span className="font-black text-white">{score}/100</span>
      </div>
      <ProgressBar score={score} />
    </div>
  )
}

function ProgressBar({ score, large = false }: { score: number; large?: boolean }) {
  const color =
    score <= 40
      ? "linear-gradient(90deg,#f59e0b,#f97316)"
      : score <= 70
        ? "linear-gradient(90deg,#38bdf8,#6366f1)"
        : "linear-gradient(90deg,#34d399,#67e8f9)"

  return (
    <div className={`${large ? "h-3" : "h-2.5"} overflow-hidden rounded-full bg-white/10`}>
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${score}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative h-full rounded-full"
        style={{ background: color }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.45),transparent)] opacity-60" />
      </motion.div>
    </div>
  )
}

function ScoreOrb({ score, label, compact = false }: { score: number; label: string; compact?: boolean }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const value = useMotionValue(0)
  const rounded = useTransform(value, (latest) => Math.round(latest))
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const unsubscribe = rounded.on("change", (latest) => setDisplayValue(latest))
    return unsubscribe
  }, [rounded])

  useEffect(() => {
    if (!inView) return
    const controls = animate(value, score, { duration: 1, ease: [0.22, 1, 0.36, 1] })
    return controls.stop
  }, [inView, score, value])

  return (
    <div
      ref={ref}
      className={`relative flex shrink-0 items-center justify-center rounded-full border border-cyan-200/20 bg-cyan-200/10 shadow-[0_0_70px_rgba(34,211,238,0.18)] ${
        compact ? "h-24 w-24" : "h-32 w-32"
      }`}
    >
      <div className="absolute inset-2 rounded-full border border-white/10 bg-black/25" />
      <div className="relative text-center">
        <div className={`${compact ? "text-3xl" : "text-5xl"} font-black tracking-[-0.06em] text-white`}>
          {displayValue}
        </div>
        <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-100">{label}</div>
      </div>
    </div>
  )
}
