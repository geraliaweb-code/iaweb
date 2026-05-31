'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'motion/react'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { ArrowRight } from 'lucide-react'

/* ── Animation helper ────────────────────────────────────────────────────── */
const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.48, delay, ease: [0.21, 0.47, 0.32, 0.98] as const },
})

const STATS = [
  { value: '+500', label: 'leads / mês' },
  { value: '€14M+', label: 'em contratos' },
  { value: 'PT · ES', label: 'mercados activos' },
]

const NAV_LINKS = [
  { label: 'Sistema', href: '#sistema' },
  { label: 'Processo', href: '#processo' },
  { label: 'Resultados', href: '#metricas' },
]

export default function HeroSection() {
  return (
    <div className="relative flex flex-col min-h-screen bg-[#030712]" id="inicio">

      {/* ── Subtle background treatment ────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {/* Single very faint top radial — warmth without glow */}
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(ellipse at top, rgba(251,191,36,0.025) 0%, transparent 65%)' }}
        />
        {/* Dot grid — barely visible, adds depth like Linear */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            opacity: 0.025,
          }}
        />
      </div>

      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <header className="relative z-20 h-14 flex-shrink-0 border-b border-white/[0.06]">
        <nav className="h-full max-w-6xl mx-auto px-6 md:px-10 flex items-center justify-between">

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="isolate flex-shrink-0"
          >
            <Image
              src="/brand/iaweb-logo.png"
              alt="IAWEB"
              width={180}
              height={58}
              priority
              className="h-8 w-auto mix-blend-screen"
            />
          </motion.div>

          {/* Links — desktop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="hidden md:flex items-center gap-7"
          >
            {NAV_LINKS.map(link => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-slate-400 hover:text-slate-100 transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <a
              href="#contacto"
              className="inline-flex items-center text-sm font-medium text-slate-300 hover:text-white border border-white/[0.1] hover:border-white/[0.2] px-4 py-1.5 rounded-lg transition-all duration-200 bg-white/[0.02] hover:bg-white/[0.05]"
            >
              Diagnóstico gratuito
            </a>
          </motion.div>
        </nav>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 md:px-10 py-20 md:py-28">
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-0">

          {/* Label */}
          <motion.div {...fade(0)} className="mb-10">
            <span className="inline-flex items-center gap-3 text-[11px] font-medium text-slate-500 tracking-[0.18em] uppercase">
              <span className="block w-5 h-px bg-amber-400/40 flex-shrink-0" />
              Aquisição digital premium
              <span className="block w-5 h-px bg-amber-400/40 flex-shrink-0" />
            </span>
          </motion.div>

          {/* H1 */}
          <motion.h1
            {...fade(0.07)}
            className="text-[clamp(2.5rem,5.5vw,4.25rem)] font-bold text-white leading-[1.06] tracking-[-0.025em] mb-6"
          >
            Geramos clientes{' '}
            <span className="text-amber-300/90">qualificados</span>
            {' '}para empresas modernas
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            {...fade(0.14)}
            className="max-w-xl text-base md:text-lg text-slate-400/80 leading-[1.7] mb-10"
          >
            A IAWEB combina websites premium, automação e inteligência artificial
            para transformar presença digital em oportunidades comerciais reais.
          </motion.p>

          {/* CTAs */}
          <motion.div {...fade(0.21)} className="flex flex-col sm:flex-row items-center gap-3 mb-24">
            <ShimmerButton
              shimmerColor="#fbbf24"
              background="rgba(3, 7, 18, 0.97)"
              borderRadius="10px"
              className="px-6 py-3 text-sm font-semibold border-white/[0.1] gap-2"
            >
              Pedir diagnóstico gratuito
              <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
            </ShimmerButton>

            <a
              href="#sistema"
              className="px-5 py-3 text-sm font-medium text-slate-400 hover:text-slate-200 rounded-lg hover:bg-white/[0.04] transition-all duration-200"
            >
              Ver como funciona →
            </a>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.55 }}
            className="w-full flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-0 border-t border-white/[0.06] pt-8"
          >
            {STATS.map((stat, i) => (
              <React.Fragment key={stat.label}>
                <div className="flex flex-col items-center gap-1 sm:flex-1">
                  <span className="text-xl font-semibold text-white tabular-nums tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-xs text-slate-600 font-medium">
                    {stat.label}
                  </span>
                </div>
                {i < STATS.length - 1 && (
                  <div className="hidden sm:block w-px h-7 bg-white/[0.07] flex-shrink-0" />
                )}
              </React.Fragment>
            ))}
          </motion.div>

        </div>
      </main>

    </div>
  )
}
