'use client'

import React from 'react'
import { motion } from 'motion/react'
import { AuroraBackground } from '@/components/ui/aurora-background'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { ArrowRight, ChevronDown } from 'lucide-react'

const STATS = [
  { value: '+500', label: 'leads qualificados/mês' },
  { value: '€14M+', label: 'em contratos gerados' },
  { value: '2 países', label: 'Portugal e Espanha' },
]

export default function HeroSection() {
  return (
    <div className="relative" id="inicio">
      <AuroraBackground
        className="!bg-slate-950 !h-auto min-h-screen text-white px-6 md:px-12 lg:px-16 pb-20"
        showRadialGradient
      >
        {/* Amber depth glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] rounded-full bg-amber-600/[0.06] blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-amber-400/[0.04] blur-[80px]" />
        </div>

        {/* Nav bar */}
        <nav className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between py-7">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-slate-950">
                <path d="M7 0L8.5 5.5L14 7L8.5 8.5L7 14L5.5 8.5L0 7L5.5 5.5L7 0Z" fill="currentColor" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">IAWEB</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="hidden md:flex items-center gap-6 text-sm text-slate-400"
          >
            {['Sistema', 'Processo', 'Métricas'].map(item => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
            <a
              href="#contacto"
              className="px-4 py-2 rounded-lg border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 transition-all text-xs font-semibold tracking-wide uppercase"
            >
              Contacto
            </a>
          </motion.div>
        </nav>

        {/* Hero content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center gap-8 pt-16 pb-12">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/[0.07] text-amber-300 text-sm font-medium"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
            Aquisição inteligente para empresas solares
          </motion.div>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-[5rem] font-black leading-[1.0] tracking-tight"
          >
            <span className="text-white">Geramos clientes</span>
            <br />
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent">
                qualificados
              </span>
            </span>
            <br />
            <span className="text-slate-200/90">para empresas solares</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl text-lg md:text-xl text-slate-400 leading-relaxed"
          >
            A IAWEB combina IA, automação e distribuição digital para criar
            oportunidades comerciais reais para empresas de energia solar em{' '}
            <span className="text-slate-200 font-medium">Portugal e Espanha</span>.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <ShimmerButton
              shimmerColor="#fbbf24"
              background="rgba(2, 6, 23, 0.9)"
              borderRadius="12px"
              className="px-8 py-4 text-base font-bold border-white/[0.1] gap-2.5"
            >
              Quero Mais Clientes
              <ArrowRight className="w-4 h-4 flex-shrink-0" />
            </ShimmerButton>

            <motion.a
              href="#sistema"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-slate-300 border border-white/[0.08] rounded-xl hover:border-white/[0.15] hover:text-white transition-all bg-white/[0.02] hover:bg-white/[0.05] backdrop-blur-sm cursor-pointer"
            >
              Ver Como Funciona
            </motion.a>
          </motion.div>

          {/* Trust divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5 pt-4"
          >
            {STATS.map((stat, i) => (
              <React.Fragment key={stat.label}>
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-black text-white tabular-nums">{stat.value}</p>
                  <p className="text-xs text-slate-500 mt-1 tracking-wide">{stat.label}</p>
                </div>
                {i < STATS.length - 1 && (
                  <div className="hidden sm:block w-px h-10 bg-white/[0.08]" />
                )}
              </React.Fragment>
            ))}
          </motion.div>

          {/* Partner logos placeholder */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap items-center justify-center gap-6 pt-2"
          >
            <p className="text-xs text-slate-600 tracking-widest uppercase w-full text-center mb-1">
              Confiado por empresas solares em
            </p>
            {['Portugal', 'Espanha', 'Itália'].map(country => (
              <span
                key={country}
                className="text-sm text-slate-600/60 font-medium tracking-wide"
              >
                {country}
              </span>
            ))}
          </motion.div>
        </div>
      </AuroraBackground>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-1.5 text-slate-600"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </div>
  )
}
