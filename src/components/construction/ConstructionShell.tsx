import Link from "next/link"
import { BadgeCheck, BrainCircuit, Building2, FileText, LockKeyhole, ShieldCheck } from "lucide-react"
import ConstructionCookieBanner from "./ConstructionCookieBanner"
import ConstructionLocaleSelector from "./ConstructionLocaleSelector"

type ConstructionShellProps = {
  children: React.ReactNode
  eyebrow?: string
  surface?: "dark" | "light"
}

export default function ConstructionShell({ children, eyebrow = "Construction Intelligence", surface = "dark" }: ConstructionShellProps) {
  void surface
  const seals = [
    { label: "IA Especializada", body: "Treinada em construcao", icon: BrainCircuit },
    { label: "Benchmark Europeu", body: "Referencias reais", icon: BadgeCheck },
    { label: "PT - FR - ES", body: "Inteligencia localizada", icon: Building2 },
    { label: "Dados Protegidos RGPD", body: "Seguranca e privacidade", icon: ShieldCheck },
    { label: "Infraestrutura Segura", body: "Cloud europeu", icon: LockKeyhole },
    { label: "Relatorios Executivos", body: "IA aplicada a obra", icon: FileText },
  ]

  return (
    <main className="construction-cinematic-shell min-h-screen overflow-x-hidden text-slate-50">
      <div className="construction-cinematic-bg" aria-hidden="true">
        <div className="construction-sunset" />
        <div className="construction-crane construction-crane-a" />
        <div className="construction-crane construction-crane-b" />
        <div className="construction-structure" />
        <div className="construction-blueprint-grid" />
      </div>

      <div className="relative z-10 flex min-h-screen w-full flex-col">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/82 backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-[96rem] flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <Link href="/construction" className="inline-flex min-w-0 items-center gap-4">
              <img src="/brand/logo-iaweb-trans.png" alt="IAWEB" className="h-10 w-auto max-w-[9.5rem] object-contain" />
              <span className="hidden h-8 w-px bg-white/15 sm:block" />
              <span className="hidden text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white md:inline">{eyebrow}</span>
            </Link>
            <div className="min-w-0 flex-1 justify-center lg:flex">
              <ConstructionLocaleSelector />
            </div>
            <nav className="flex items-center gap-2 text-sm font-semibold text-slate-200">
              <Link href="/construction/dashboard" className="hidden rounded-full px-4 py-2 transition hover:bg-white/5 hover:text-white md:inline-flex">
                Dashboard
              </Link>
              <Link href="/construction/billing" className="hidden rounded-full px-4 py-2 transition hover:bg-white/5 hover:text-white md:inline-flex">
                Planos
              </Link>
              <Link href="/construction#como-funciona" className="hidden rounded-full px-4 py-2 transition hover:bg-white/5 hover:text-white lg:inline-flex">
                Recursos
              </Link>
              <Link href="/construction/security" className="hidden rounded-full px-4 py-2 transition hover:bg-white/5 hover:text-white lg:inline-flex">
                Empresa
              </Link>
              <Link href="/construction/projects/new" className="rounded-lg bg-gradient-to-r from-amber-500 to-amber-700 px-4 py-2.5 text-white shadow-lg shadow-amber-950/30 transition hover:-translate-y-0.5 hover:from-amber-400 hover:to-amber-600">
                Novo Projeto
              </Link>
            </nav>
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-[96rem] flex-1 flex-col px-4 sm:px-6 lg:px-8">
          {children}
          <footer className="mt-auto border-t border-white/10 py-6 text-sm text-slate-300">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
              {seals.map((seal) => {
                const Icon = seal.icon
                return (
                  <div key={seal.label} className="flex items-start gap-3">
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden="true" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-white">{seal.label}</p>
                      <p className="mt-1 text-xs text-slate-400">{seal.body}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
              <p>Estimativa baseada na documentacao analisada e em dados de mercado. Nao constitui orcamento vinculativo.</p>
              <div className="flex flex-wrap gap-3">
                <Link href="/construction/privacy" className="hover:text-white">Privacidade</Link>
                <Link href="/construction/cookies" className="hover:text-white">Cookies</Link>
                <Link href="/construction/security" className="hover:text-white">Seguranca</Link>
                <Link href="/construction/terms" className="hover:text-white">Termos</Link>
              </div>
            </div>
          </footer>
          <ConstructionCookieBanner />
        </div>
      </div>
    </main>
  )
}
