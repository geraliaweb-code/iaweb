"use client"

import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { BarChart3, CheckCircle2, FileSpreadsheet, FileText, Loader2, Play, ShieldAlert, Sparkles } from "lucide-react"

const simulatedFiles = [
  { name: "Projeto_Arquitetura.pdf", type: "PDF", icon: FileText },
  { name: "Mapa_Quantidades.xlsx", type: "XLSX", icon: FileSpreadsheet },
  { name: "Estruturas.pdf", type: "PDF", icon: FileText },
  { name: "Caderno_Encargos.pdf", type: "PDF", icon: FileText },
]

const analysisSteps = [
  "A analisar documentos...",
  "A identificar especialidades...",
  "A calcular risco...",
  "A calcular maturidade...",
  "A calcular confiança...",
  "A gerar benchmark...",
  "A estimar custos...",
  "A gerar relatório executivo...",
]

const specialties = ["Arquitetura", "Estruturas", "Eletricidade", "AVAC"]

const scores = [
  { label: "Maturity Score", value: 82, tone: "bg-emerald-400", icon: CheckCircle2 },
  { label: "Risk Score", value: 34, tone: "bg-amber-400", icon: ShieldAlert },
  { label: "Confidence Score", value: 88, tone: "bg-sky-400", icon: Sparkles },
]

const estimates = ["Cenário Económico", "Cenário Normal", "Cenário Premium"]

export default function InteractiveDemo() {
  const [running, setRunning] = useState(false)
  const [activeStep, setActiveStep] = useState(-1)

  const completed = activeStep >= analysisSteps.length - 1
  const progress = useMemo(() => {
    if (activeStep < 0) return 0
    return Math.min(100, Math.round(((activeStep + 1) / analysisSteps.length) * 100))
  }, [activeStep])

  function startDemo() {
    setRunning(true)
    setActiveStep(-1)

    analysisSteps.forEach((_, index) => {
      window.setTimeout(() => setActiveStep(index), 460 * (index + 1))
    })

    window.setTimeout(() => setRunning(false), 460 * (analysisSteps.length + 1))
  }

  return (
    <section className="py-12 lg:py-16" aria-labelledby="interactive-demo-title">
      <div className="mb-8 max-w-4xl">
        <p className="inline-flex rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-amber-200">
          Demonstração ilustrativa
        </p>
        <h2 id="interactive-demo-title" className="mt-5 text-3xl font-semibold tracking-tight text-white md:text-5xl">
          Veja a IA a analisar uma obra em tempo real.
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
          Descubra em poucos segundos como a plataforma identifica documentos, calcula riscos e gera inteligência para a sua obra.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45 }}
          className="construction-glass-card rounded-xl p-5 md:p-6"
        >
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">Ficheiros simulados</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">Nenhum ficheiro é carregado. Esta área mostra apenas uma simulação visual.</p>
            </div>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-slate-200">Demo</span>
          </div>

          <div className="mt-5 grid gap-3">
            {simulatedFiles.map((file, index) => {
              const Icon = file.icon
              const fileActive = activeStep >= 0 && activeStep + index >= 1
              return (
                <motion.div
                  key={file.name}
                  animate={{ borderColor: fileActive ? "rgba(251,191,36,0.36)" : "rgba(255,255,255,0.1)" }}
                  className="flex items-center justify-between gap-4 rounded-lg border bg-white/[0.04] p-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-slate-950/60">
                      <Icon className="h-5 w-5 text-amber-300" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">{file.name}</p>
                      <p className="mt-1 text-xs text-slate-400">{file.type} preparado para demo</p>
                    </div>
                  </div>
                  <AnimatePresence mode="popLayout">
                    {fileActive ? (
                      <motion.span initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} className="text-emerald-300">
                        <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                      </motion.span>
                    ) : (
                      <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>

          <button
            type="button"
            onClick={startDemo}
            disabled={running}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-700 px-5 py-3 text-sm font-bold text-white shadow-xl shadow-amber-950/30 transition hover:-translate-y-0.5 hover:from-amber-400 hover:to-amber-600 disabled:cursor-not-allowed disabled:opacity-75"
          >
            {running ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Play className="h-4 w-4 fill-white" aria-hidden="true" />}
            Iniciar Demonstração
          </button>

          <div className="mt-6">
            <div className="mb-2 flex justify-between text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              <span>Progresso</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <motion.div className="h-full rounded-full bg-gradient-to-r from-amber-300 to-emerald-300" animate={{ width: `${progress}%` }} transition={{ duration: 0.35 }} />
            </div>
          </div>

          <div className="mt-5 grid gap-2">
            {analysisSteps.map((step, index) => {
              const done = activeStep >= index
              const current = activeStep === index && running
              return (
                <motion.div
                  key={step}
                  animate={{ opacity: done ? 1 : 0.42, x: done ? 0 : -4 }}
                  className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-sm ${
                    done ? "border-amber-300/20 bg-amber-300/10 text-slate-100" : "border-white/10 bg-white/[0.03] text-slate-400"
                  }`}
                >
                  {current ? <Loader2 className="h-4 w-4 animate-spin text-amber-300" aria-hidden="true" /> : <CheckCircle2 className={`h-4 w-4 ${done ? "text-emerald-300" : "text-slate-600"}`} aria-hidden="true" />}
                  <span>{step}</span>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="construction-glass-card relative overflow-hidden rounded-xl p-5 md:p-6"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_14%,rgba(245,158,11,0.22),transparent_28%),radial-gradient(circle_at_16%_84%,rgba(56,189,248,0.16),transparent_30%)]" aria-hidden="true" />
          <div className="relative">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">Painel visual premium</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">Resultado da demonstração</h3>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-semibold text-slate-200">
                <BarChart3 className="h-4 w-4 text-amber-300" aria-hidden="true" />
                Ilustrativo
              </span>
            </div>

            <motion.div animate={{ opacity: completed ? 1 : 0.68 }} className="mt-6 grid gap-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <Metric label="Documentos Identificados" value="23" active={completed || activeStep >= 1} />
                <Metric label="Benchmark" value="Acima da média" active={completed || activeStep >= 5} />
                <Metric label="Prazo" value="14 a 18 meses" active={completed || activeStep >= 6} />
              </div>

              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Especialidades</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {specialties.map((item, index) => (
                    <motion.span
                      key={item}
                      animate={{ opacity: activeStep >= 1 ? 1 : 0.42, y: activeStep >= 1 ? 0 : 4 }}
                      transition={{ delay: index * 0.04 }}
                      className="rounded-full border border-white/10 bg-slate-950/45 px-3 py-1.5 text-sm font-semibold text-slate-100"
                    >
                      {item}
                    </motion.span>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {scores.map((score) => {
                  const Icon = score.icon
                  const active = score.label === "Risk Score" ? activeStep >= 2 : score.label === "Maturity Score" ? activeStep >= 3 : activeStep >= 4
                  return (
                    <div key={score.label} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{score.label}</p>
                        <Icon className="h-5 w-5 text-amber-300" aria-hidden="true" />
                      </div>
                      <p className="mt-4 text-3xl font-semibold text-white">{active ? score.value : "--"}</p>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                        <motion.div className={`h-full rounded-full ${score.tone}`} animate={{ width: active ? `${score.value}%` : "0%" }} transition={{ duration: 0.55 }} />
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Estimativa</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  {estimates.map((estimate, index) => (
                    <motion.div
                      key={estimate}
                      animate={{ opacity: activeStep >= 6 ? 1 : 0.45, y: activeStep >= 6 ? 0 : 5 }}
                      transition={{ delay: index * 0.05 }}
                      className="rounded-lg border border-amber-300/15 bg-amber-300/10 p-3"
                    >
                      <p className="text-sm font-semibold text-amber-50">{estimate}</p>
                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                        <motion.div className="h-full rounded-full bg-amber-300" animate={{ width: activeStep >= 6 ? `${62 + index * 14}%` : "0%" }} transition={{ duration: 0.5 }} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <AnimatePresence>
                {completed ? (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="rounded-lg border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm leading-6 text-emerald-50"
                  >
                    Relatório executivo visual pronto. Esta demonstração é ilustrativa e não representa uma análise real de documentos.
                  </motion.p>
                ) : null}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Metric({ label, value, active }: { label: string; value: string; active: boolean }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <motion.p animate={{ opacity: active ? 1 : 0.42 }} className="mt-3 text-2xl font-semibold text-white">
        {active ? value : "--"}
      </motion.p>
    </div>
  )
}
