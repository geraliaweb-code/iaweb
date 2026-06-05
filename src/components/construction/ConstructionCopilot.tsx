"use client"

import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { BrainCircuit, CheckCircle2, FileWarning, Lightbulb, MessageSquareText, Search, ShieldAlert } from "lucide-react"
import type { ConstructionHealthCheckResult, ConstructionProject } from "@/lib/construction/types"
import { useConstructionLocale } from "./useConstructionLocale"

type ConstructionCopilotProps = {
  project: ConstructionProject
  healthCheck: ConstructionHealthCheckResult | null
}

type SupportedQuestion =
  | "risk"
  | "missing-documents"
  | "maturity"
  | "benchmark"
  | "estimate"
  | "next-steps"

const quickQuestions: Array<{ id: SupportedQuestion; label: string }> = [
  { id: "risk", label: "Porque o risco está elevado?" },
  { id: "missing-documents", label: "Que documentos estão em falta?" },
  { id: "maturity", label: "Como melhorar a maturidade?" },
  { id: "benchmark", label: "Explicar benchmark." },
  { id: "estimate", label: "Explicar estimativa." },
  { id: "next-steps", label: "Próximos passos." },
]

const technicalCountryLabels: Record<string, string> = {
  portugal: "Portugal",
  france: "França",
  spain: "Espanha",
}

export default function ConstructionCopilot({ project, healthCheck }: ConstructionCopilotProps) {
  const { copy } = useConstructionLocale()
  const ui = copy.ui
  const [input, setInput] = useState("")
  const [activeQuestion, setActiveQuestion] = useState<SupportedQuestion>("risk")
  const hasHealthCheck = Boolean(healthCheck)
  const answer = useMemo(() => buildAnswer(activeQuestion, project, healthCheck), [activeQuestion, project, healthCheck])

  function ask(question: SupportedQuestion, label: string) {
    setActiveQuestion(question)
    setInput(label)
  }

  function analyzeQuestion() {
    const normalized = input.toLowerCase()
    if (normalized.includes("falta") || normalized.includes("documento")) setActiveQuestion("missing-documents")
    else if (normalized.includes("matur")) setActiveQuestion("maturity")
    else if (normalized.includes("benchmark") || normalized.includes("media") || normalized.includes("média")) setActiveQuestion("benchmark")
    else if (normalized.includes("estim") || normalized.includes("custo") || normalized.includes("preço") || normalized.includes("preco")) setActiveQuestion("estimate")
    else if (normalized.includes("passo") || normalized.includes("proximo") || normalized.includes("próximo")) setActiveQuestion("next-steps")
    else setActiveQuestion("risk")
  }

  return (
    <section className="construction-glass-card rounded-xl p-5 md:p-6">
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="inline-flex rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-amber-200">
            Assistente baseado na análise atual do projeto
          </p>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white">{ui.pages.copilotTitle}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            {ui.pages.copilotSubtitle}
          </p>

          <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <label htmlFor="construction-copilot-input" className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
              Pergunta
            </label>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <input
                id="construction-copilot-input"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Pergunte à IA..."
                className="min-h-12 flex-1 rounded-lg border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-amber-300/60"
              />
              <button
                type="button"
                onClick={analyzeQuestion}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-amber-950/30 transition hover:-translate-y-0.5 hover:from-amber-400 hover:to-amber-600"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                Analisar
              </button>
            </div>
          </div>

          <div className="mt-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Perguntas rápidas</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {quickQuestions.map((question) => (
                <button
                  key={question.id}
                  type="button"
                  onClick={() => ask(question.id, question.label)}
                  className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                    activeQuestion === question.id
                      ? "border-amber-300/40 bg-amber-300/15 text-amber-100"
                      : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {question.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-950/55 p-5 shadow-2xl shadow-black/20">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">Resposta do Copilot</p>
              <p className="mt-2 text-sm text-slate-400">
                Fonte: {hasHealthCheck ? "Health Check, scores, riscos, estimativas e knowledge graph do projeto." : "A aguardar Health Check do projeto."}
              </p>
            </div>
            <BrainCircuit className="h-7 w-7 text-amber-300" aria-hidden="true" />
          </div>

          {!hasHealthCheck ? (
            <div className="mt-5 rounded-lg border border-amber-300/20 bg-amber-300/10 p-5">
              <div className="flex items-start gap-3">
                <FileWarning className="mt-0.5 h-5 w-5 shrink-0 text-amber-200" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-white">Faça upload da documentação e gere o Health Check para desbloquear recomendações inteligentes.</p>
                  <p className="mt-2 text-sm leading-6 text-amber-50/80">
                    Nesta sprint, o Copilot não usa IA real. Ele só interpreta dados já existentes no projeto.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeQuestion}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
                className="mt-5 grid gap-4"
              >
                <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
                  <div className="flex items-start gap-3">
                    <MessageSquareText className="mt-0.5 h-5 w-5 shrink-0 text-sky-200" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-semibold text-white">{answer.title}</p>
                      <p className="mt-3 text-sm leading-7 text-slate-300">{answer.body}</p>
                    </div>
                  </div>
                </div>

                {answer.items.length ? (
                  <div className="grid gap-2">
                    {answer.items.map((item) => (
                      <div key={item} className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" aria-hidden="true" />
                        <p className="text-sm leading-6 text-slate-200">{item}</p>
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="grid gap-3 sm:grid-cols-3">
                  <Signal label="Risco" value={`${healthCheck!.riskScore}/100`} icon={ShieldAlert} />
                  <Signal label="Maturidade" value={`${healthCheck!.maturityScore}/100`} icon={Lightbulb} />
                  <Signal label="Documentos" value={String(healthCheck!.documentsFound)} icon={FileWarning} />
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </section>
  )
}

function buildAnswer(question: SupportedQuestion, project: ConstructionProject, healthCheck: ConstructionHealthCheckResult | null) {
  if (!healthCheck) {
    return { title: "Health Check pendente", body: "Ainda não existem dados suficientes para gerar uma resposta baseada no projeto.", items: [] as string[] }
  }

  const country = technicalCountryLabels[project.technical_country] ?? project.technical_country
  const missingDocuments = healthCheck.missingCriticalDocuments
  const alertItems = healthCheck.alerts.map((alert) => `${alert.title}: ${alert.recommendation}`)
  const recommendations = healthCheck.knowledgeGraph?.recommendations ?? []
  const benchmarkUsed = healthCheck.costEstimate?.calculationBasis?.benchmarkUsed
  const costNotes = healthCheck.costEstimate?.costNotes ?? []
  const scheduleNotes = healthCheck.scheduleEstimate?.scheduleNotes ?? []
  const scenarioItems = healthCheck.costEstimate?.scenarios?.map((scenario) => `${scenario.label}: ${formatCurrency(scenario.min)} a ${formatCurrency(scenario.max)}.`) ?? []

  if (question === "missing-documents") {
    return {
      title: "Documentos críticos em falta",
      body: missingDocuments.length
        ? "Foram identificados os seguintes documentos críticos em falta na análise atual do projeto."
        : "A análise atual não indica documentos críticos em falta.",
      items: missingDocuments,
    }
  }

  if (question === "maturity") {
    return {
      title: "Como melhorar a maturidade documental",
      body: "A maturidade documental pode ser melhorada reforçando a completude dos documentos, especialidades e evidências técnicas já assinaladas pelo Health Check.",
      items: [...missingDocuments.map((item) => `Adicionar ou validar: ${item}`), ...recommendations].slice(0, 6),
    }
  }

  if (question === "benchmark") {
    return {
      title: "Explicação do benchmark",
      body: benchmarkUsed
        ? `O benchmark usado na análise atual foi: ${benchmarkUsed}. A leitura considera o país técnico ${country}, o segmento do projeto e a base documental disponível.`
        : `Ainda não existe benchmark detalhado disponível no Health Check atual. O país técnico selecionado é ${country}.`,
      items: healthCheck.knowledgeGraph?.mainRelations.slice(0, 5) ?? [],
    }
  }

  if (question === "estimate") {
    return {
      title: "Explicação da estimativa",
      body: healthCheck.costEstimate
        ? `A estimativa atual vai de ${formatCurrency(healthCheck.costEstimate.estimatedCostMin)} a ${formatCurrency(healthCheck.costEstimate.estimatedCostMax)}, com confiança de ${healthCheck.costEstimate.costConfidence}/100.`
        : "Ainda não existe estimativa de custo disponível no Health Check atual.",
      items: [...scenarioItems, ...costNotes, ...scheduleNotes].slice(0, 7),
    }
  }

  if (question === "next-steps") {
    return {
      title: "Próximos passos recomendados",
      body: "Os próximos passos abaixo vêm das recomendações e alertas já existentes na análise atual do projeto.",
      items: [...recommendations, ...alertItems].slice(0, 6),
    }
  }

  return {
    title: "Porque o risco está elevado?",
    body:
      healthCheck.riskScore >= 50
        ? "O risco encontra-se elevado porque a análise atual identificou alertas, lacunas documentais ou especialidades críticas que reduzem a confiança executiva."
        : "O risco não aparece elevado na análise atual. Ainda assim, os pontos abaixo ajudam a perceber os fatores documentais e técnicos relevantes.",
    items: [...alertItems, ...missingDocuments.map((item) => `Documento em falta: ${item}`), ...(healthCheck.knowledgeGraph?.derivedRisks ?? [])].slice(0, 6),
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value)
}

function Signal({ label, value, icon: Icon }: { label: string; value: string; icon: typeof ShieldAlert }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
      <Icon className="h-4 w-4 text-amber-300" aria-hidden="true" />
      <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-white">{value}</p>
    </div>
  )
}
