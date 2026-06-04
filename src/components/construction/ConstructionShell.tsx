import Link from "next/link"
import OfficialLogo from "@/components/iaweb/OfficialLogo"
import ConstructionCookieBanner from "./ConstructionCookieBanner"

type ConstructionShellProps = {
  children: React.ReactNode
  eyebrow?: string
  surface?: "dark" | "light"
}

export default function ConstructionShell({ children, eyebrow = "Construction Intelligence", surface = "dark" }: ConstructionShellProps) {
  const isLight = surface === "light"

  return (
    <main className={isLight ? "min-h-screen overflow-x-hidden bg-slate-50 text-slate-800" : "iaweb-cinematic-shell min-h-screen overflow-x-hidden text-slate-50"}>
      {isLight ? (
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_46%,#eef2f7_100%)]">
          <div className="absolute inset-0 opacity-[0.42] [background-image:linear-gradient(#0f172a0d_1px,transparent_1px),linear-gradient(90deg,#0f172a0d_1px,transparent_1px)] [background-size:48px_48px]" />
          <div className="absolute left-1/2 top-0 h-[34rem] w-[70rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(180,83,9,0.12),transparent_62%)] blur-3xl" />
        </div>
      ) : (
        <div className="iaweb-cinematic-bg">
          <div className="iaweb-cinematic-grid" />
          <div className="iaweb-lightning top-[12%] left-[-12%]" />
          <div className="iaweb-lightning" />
          <div className="iaweb-lightning" />
          <div className="iaweb-lightning-field" />
        </div>
      )}

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className={`flex flex-wrap items-center justify-between gap-4 border-b pb-5 ${isLight ? "border-slate-200/80" : "border-white/10"}`}>
          <Link href="/construction" className="inline-flex items-center gap-4">
            <span className={isLight ? "rounded-full bg-slate-950 px-3 py-2 shadow-sm" : ""}>
              <OfficialLogo compact />
            </span>
            <span className={`hidden h-8 w-px sm:block ${isLight ? "bg-slate-200" : "bg-white/10"}`} />
            <span className={`text-xs font-semibold uppercase tracking-[0.28em] ${isLight ? "text-slate-600" : "text-sky-200"}`}>{eyebrow}</span>
          </Link>
          <nav className={`flex items-center gap-2 text-sm ${isLight ? "text-slate-600" : "text-slate-300"}`}>
            <Link href="/construction/dashboard" className={`rounded-full border px-4 py-2 transition ${isLight ? "border-slate-200 bg-white hover:border-slate-400 hover:text-slate-950" : "border-white/10 hover:border-sky-300/50 hover:text-white"}`}>
              Dashboard
            </Link>
            <Link href="/construction/billing" className={`rounded-full border px-4 py-2 transition ${isLight ? "border-slate-200 bg-white hover:border-slate-400 hover:text-slate-950" : "border-white/10 hover:border-sky-300/50 hover:text-white"}`}>
              Billing
            </Link>
            <Link href="/construction/projects/new" className={`rounded-full px-4 py-2 font-semibold transition ${isLight ? "bg-slate-950 text-white hover:bg-slate-800" : "bg-sky-400 text-slate-950 hover:bg-sky-300"}`}>
              Novo Projeto
            </Link>
          </nav>
        </header>
        {children}
        <footer className={`mt-auto border-t py-6 text-sm ${isLight ? "border-slate-200 text-slate-500" : "border-white/10 text-slate-400"}`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p>Estimativa baseada na documentacao analisada e em dados de mercado disponiveis a data da analise. Nao constitui orcamento vinculativo nem garantia de custo final.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/construction/privacy" className={isLight ? "hover:text-slate-950" : "hover:text-white"}>Privacidade</Link>
              <Link href="/construction/cookies" className={isLight ? "hover:text-slate-950" : "hover:text-white"}>Cookies</Link>
              <Link href="/construction/security" className={isLight ? "hover:text-slate-950" : "hover:text-white"}>Seguranca</Link>
              <Link href="/construction/terms" className={isLight ? "hover:text-slate-950" : "hover:text-white"}>Termos</Link>
            </div>
          </div>
        </footer>
        <ConstructionCookieBanner />
      </div>
    </main>
  )
}
