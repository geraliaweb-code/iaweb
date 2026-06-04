import Link from "next/link"
import OfficialLogo from "@/components/iaweb/OfficialLogo"

type ConstructionShellProps = {
  children: React.ReactNode
  eyebrow?: string
}

export default function ConstructionShell({ children, eyebrow = "Construction Intelligence" }: ConstructionShellProps) {
  return (
    <main className="iaweb-cinematic-shell min-h-screen overflow-x-hidden text-slate-50">
      <div className="iaweb-cinematic-bg">
        <div className="iaweb-cinematic-grid" />
        <div className="iaweb-lightning top-[12%] left-[-12%]" />
        <div className="iaweb-lightning" />
        <div className="iaweb-lightning" />
        <div className="iaweb-lightning-field" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <Link href="/construction" className="inline-flex items-center gap-4">
            <OfficialLogo compact />
            <span className="hidden h-8 w-px bg-white/10 sm:block" />
            <span className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-200">{eyebrow}</span>
          </Link>
          <nav className="flex items-center gap-2 text-sm text-slate-300">
            <Link href="/construction/dashboard" className="rounded-full border border-white/10 px-4 py-2 transition hover:border-sky-300/50 hover:text-white">
              Dashboard
            </Link>
            <Link href="/construction/billing" className="rounded-full border border-white/10 px-4 py-2 transition hover:border-sky-300/50 hover:text-white">
              Billing
            </Link>
            <Link href="/construction/projects/new" className="rounded-full bg-sky-400 px-4 py-2 font-semibold text-slate-950 transition hover:bg-sky-300">
              Novo Projeto
            </Link>
          </nav>
        </header>
        {children}
      </div>
    </main>
  )
}
