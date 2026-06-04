"use client"

import { useState } from "react"
import { CheckCircle2, FileSearch, FileText, Gauge, Scale, UploadCloud } from "lucide-react"
import { constructionClientTypeLabels, constructionProjectTypeLabels } from "@/lib/construction/constants"
import type { ConstructionProject } from "@/lib/construction/types"
import BenchmarkPanel from "./BenchmarkPanel"
import DocumentAnalysisPanel from "./DocumentAnalysisPanel"
import { DemoHealthCheckPanel, DemoReportPanel, DemoUploadAnalysisPanel } from "./DemoProjectPanels"
import GenerateReportButton from "./GenerateReportButton"
import HealthCheckPanel from "./HealthCheckPanel"
import ProjectReadinessChecklist from "./ProjectReadinessChecklist"
import ProjectUploadCenter from "./ProjectUploadCenter"

type ProjectTabsProps = {
  project: ConstructionProject
  demoMode?: boolean
}

const tabs = ["Overview", "Uploads", "Health Check", "Benchmark", "Relatorio"] as const
type ProjectTab = (typeof tabs)[number]

export default function ProjectTabs({ project, demoMode = false }: ProjectTabsProps) {
  const [activeTab, setActiveTab] = useState<ProjectTab>("Overview")
  const steps = [
    { label: "Upload", done: demoMode || project.analyses_count > 0, icon: UploadCloud },
    { label: "Analisar Documentos", done: demoMode || project.analyses_count > 0, icon: FileSearch },
    { label: "Gerar Health Check", done: demoMode || Boolean(project.maturity_score || project.risk_score), icon: Gauge },
    { label: "Gerar Benchmark", done: demoMode, icon: Scale },
    { label: "Gerar PDF", done: demoMode, icon: FileText },
  ]

  return (
    <div className="py-10">
      <div className="iaweb-premium-card rounded-2xl p-6">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-200">Project intelligence</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-5xl">{project.name}</h1>
          <p className="mt-4 text-base text-slate-300">
            {constructionProjectTypeLabels[project.project_type]} em {project.city}, {project.country}
          </p>
        </div>
        <div className="rounded-2xl border border-sky-300/20 bg-sky-300/10 px-5 py-4 text-sm text-sky-100">
          Estado: <span className="font-semibold text-white">{project.status}</span>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm font-semibold text-white">Resumo executivo</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            {demoMode
              ? "Projeto demo com fluxo completo para apresentar como a plataforma transforma documentacao tecnica em Health Check, estimativas e relatorio executivo."
              : "Sobe documentacao tecnica, executa Document Intelligence, gera o Health Check e fecha com um PDF executivo para decisao."}
          </p>
        </div>
        <ProjectReadinessChecklist project={project} demoMode={demoMode} />
      </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-5">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <div key={step.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${step.done ? "bg-emerald-300/10 text-emerald-200" : "bg-slate-300/10 text-slate-400"}`}>
                {step.done ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : <Icon className="h-4 w-4" aria-hidden="true" />}
              </div>
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-500">Passo {index + 1}</p>
              <p className={step.done ? "mt-1 text-sm font-semibold text-white" : "mt-1 text-sm font-semibold text-slate-400"}>{step.label}</p>
            </div>
          )
        })}
      </div>

      <div className="mt-8 flex gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03] p-2">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 rounded-xl px-4 py-2 text-sm font-medium ${
              activeTab === tab ? "bg-sky-300 text-slate-950" : "text-slate-300 transition hover:bg-white/5 hover:text-white"
            }`}
          >
            {tab === "Relatorio" ? "Relatorio" : tab}
          </button>
        ))}
      </div>

      {activeTab === "Overview" ? <OverviewPanel project={project} /> : null}
      {activeTab === "Uploads" ? (
        <div className="mt-6 grid gap-6">
          <Guidance
            title="Comeca pela documentacao"
            body="Carrega ficheiros tecnicos e executa Document Intelligence. O resto da plataforma depende desta base documental."
          />
          {demoMode ? (
            <DemoUploadAnalysisPanel />
          ) : (
            <>
              <ProjectUploadCenter projectId={project.id} />
              <DocumentAnalysisPanel projectId={project.id} />
            </>
          )}
        </div>
      ) : null}
      {activeTab === "Health Check" ? (
        <div className="mt-6 grid gap-6">
          <Guidance
            title="Transforma documentos em decisao"
            body="O Health Check resume maturidade, risco, complexidade, confianca, custo e prazo numa linguagem executiva."
          />
          {demoMode ? <DemoHealthCheckPanel /> : <HealthCheckPanel projectId={project.id} />}
        </div>
      ) : null}
      {activeTab === "Benchmark" ? (
        <div className="mt-6 grid gap-6">
          <Guidance
            title="Compara com obras semelhantes"
            body="O Benchmark V1 usa dataset simulado para mostrar se o projeto esta acima, abaixo ou dentro da media de mercado."
          />
          <BenchmarkPanel projectId={project.id} demoMode={demoMode} />
        </div>
      ) : null}
      {activeTab === "Relatorio" ? (
        <div className="mt-6 grid gap-6">
          <Guidance
            title="Fecha a narrativa executiva"
            body="O PDF junta capa, Health Check, documentos, faltas, estimativas e riscos num artefacto pronto para reuniao."
          />
          {demoMode ? <DemoReportPanel /> : <section className="iaweb-premium-card rounded-2xl p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200">PDF Executivo Premium</p>
                <h2 className="mt-2 text-xl font-semibold text-white">Relatorio Construction Intelligence</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                  Gera um PDF executivo com capa, Health Check, documentos, faltas, estimativa preliminar e principais riscos.
                </p>
              </div>
              <GenerateReportButton projectId={project.id} />
            </div>
          </section>}
        </div>
      ) : null}
    </div>
  )
}

function Guidance({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-sky-300/20 bg-sky-300/10 p-4">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-1 text-sm leading-6 text-slate-300">{body}</p>
    </div>
  )
}

function OverviewPanel({ project }: { project: ConstructionProject }) {
  return (
    <section className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
      <article className="iaweb-premium-card rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white">Overview</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Info label="Tipo de cliente" value={constructionClientTypeLabels[project.client_type]} />
          <Info label="Area estimada" value={project.estimated_area_m2 ? `${project.estimated_area_m2} m2` : "Por definir"} />
          <Info label="Maturidade" value={`${project.maturity_score ?? 0}/100`} />
          <Info label="Risco" value={`${project.risk_score ?? 0}/100`} />
          <Info label="Confianca" value={`${project.confidence_score ?? 0}/100`} />
          <Info label="Analises" value={String(project.analyses_count ?? 0)} />
        </div>
      </article>

      <div className="grid gap-5">
        <Placeholder
          icon={UploadCloud}
          title="Uploads"
          body="Centro de upload disponivel na aba Uploads para documentos tecnicos no bucket construction-files."
        />
        <Placeholder
          icon={Gauge}
          title="Health Check"
          body="Base pronta para maturity, risk e confidence sem implementar motores nesta sprint."
        />
        <Placeholder
          icon={FileText}
          title="Relatorio"
          body="Estrutura criada para relatorios executivos de intelligence."
        />
        <Placeholder
          icon={Scale}
          title="Benchmark"
          body="Comparacao simulada com obras semelhantes por tipo, pais e area."
        />
      </div>
    </section>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  )
}

function Placeholder({ icon: Icon, title, body }: { icon: typeof UploadCloud; title: string; body: string }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <Icon className="h-5 w-5 text-sky-200" aria-hidden="true" />
      <h3 className="mt-4 font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
    </article>
  )
}
