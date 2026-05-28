'use client'

import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import {
  TrendingDown, Clock, Shield, Users, Leaf, Wrench,
  type LucideIcon,
} from 'lucide-react'
import type { Variants } from 'motion/react'

interface Metric {
  icon: LucideIcon
  value: string
  label: string
  description: string
  accent?: 'amber' | 'emerald'
}

const METRICS: Metric[] = [
  {
    icon: TrendingDown,
    value: '60%',
    label: 'Redução na Fatura',
    description: 'Poupança média comprovada nos primeiros 12 meses após instalação do sistema.',
  },
  {
    icon: Clock,
    value: '< 4 anos',
    label: 'Payback Garantido',
    description: 'Retorno total do investimento assegurado em menos de 4 anos com as nossas soluções.',
  },
  {
    icon: Shield,
    value: '25 anos',
    label: 'Garantia Completa',
    description: 'Garantia de produção e desempenho dos painéis fotovoltaicos incluída no contrato.',
  },
  {
    icon: Users,
    value: '+500',
    label: 'Empresas Clientes',
    description: 'Projetos industriais e comerciais concluídos com sucesso em todo o território nacional.',
  },
  {
    icon: Leaf,
    value: '0 CO₂',
    label: 'Emissões Operacionais',
    description: 'Energia 100% limpa e renovável. Cumpra as metas ESG e relatórios de sustentabilidade.',
    accent: 'emerald',
  },
  {
    icon: Wrench,
    value: '72h',
    label: 'Instalação Rápida',
    description: 'Da visita técnica à produção de energia em apenas 72 horas úteis. Mínima interrupção.',
  },
]

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut' },
  },
}

export default function BenefitsSection() {
  const gridRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(gridRef, { once: true, margin: '-80px' })

  return (
    <section className="relative bg-slate-950 py-24 md:py-32 px-6 md:px-12 lg:px-16 overflow-hidden">

      {/* ── Ambient glow ───────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1100px] h-[500px] bg-amber-500/[0.035] blur-3xl rounded-full" />
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-amber-600/[0.025] blur-3xl rounded-full -translate-y-1/2" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* ── Section header ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55 }}
          className="text-center mb-16 md:mb-20 space-y-5"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-sm font-medium">
            <span>Por que escolher energia solar agora?</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-white leading-tight tracking-tight">
            Números que{' '}
            <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent">
              falam por si
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Mais de 500 empresas já transformaram a sua estrutura de custos energéticos.
            Veja o que pode esperar para o seu negócio.
          </p>
        </motion.div>

        {/* ── Metrics grid ───────────────────────────────────────────── */}
        <motion.div
          ref={gridRef}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
        >
          {METRICS.map((metric, i) => (
            <MetricCard key={i} metric={metric} />
          ))}
        </motion.div>

        {/* ── Bottom CTA strip ───────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="mt-16 md:mt-20 relative rounded-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/[0.12] via-amber-500/[0.06] to-transparent" />
          <div className="absolute inset-0 border border-amber-500/20 rounded-2xl" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-amber-400/40 via-amber-300/20 to-transparent" />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-8 md:p-10">
            <div className="space-y-1.5">
              <h3 className="text-xl md:text-2xl font-bold text-white">
                Pronto para reduzir os seus custos?
              </h3>
              <p className="text-slate-400 text-sm md:text-base">
                Análise técnica gratuita · Sem compromisso · Resposta em 24h
              </p>
            </div>
            <motion.a
              href="#hero"
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="flex-shrink-0 inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/25"
            >
              Solicitar Análise Gratuita
              <span className="text-base">→</span>
            </motion.a>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

/* ── MetricCard ──────────────────────────────────────────────────────────── */

function MetricCard({ metric }: { metric: Metric }) {
  const Icon = metric.icon
  const isEmerald = metric.accent === 'emerald'

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -5, transition: { duration: 0.18, ease: 'easeOut' } }}
      className="group relative rounded-2xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm p-6 overflow-hidden cursor-default"
    >
      {/* Hover glow overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none rounded-2xl">
        <div className={`absolute inset-0 bg-gradient-to-br rounded-2xl ${
          isEmerald
            ? 'from-emerald-500/[0.09] via-transparent to-transparent'
            : 'from-amber-500/[0.09] via-transparent to-transparent'
        }`} />
        <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${
          isEmerald
            ? 'from-transparent via-emerald-400/40 to-transparent'
            : 'from-transparent via-amber-400/40 to-transparent'
        }`} />
      </div>

      <div className="relative z-10 space-y-4">
        {/* Icon badge */}
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${
          isEmerald
            ? 'bg-emerald-500/15 border-emerald-500/25'
            : 'bg-amber-500/15 border-amber-500/25'
        }`}>
          <Icon className={`w-5 h-5 ${isEmerald ? 'text-emerald-400' : 'text-amber-400'}`} strokeWidth={2} />
        </div>

        {/* Value + label */}
        <div>
          <p className={`text-3xl font-extrabold bg-gradient-to-r bg-clip-text text-transparent ${
            isEmerald
              ? 'from-emerald-400 to-emerald-300'
              : 'from-amber-400 via-amber-300 to-yellow-200'
          }`}>
            {metric.value}
          </p>
          <p className="text-base font-semibold text-white mt-1">{metric.label}</p>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-400 leading-relaxed">{metric.description}</p>
      </div>
    </motion.div>
  )
}
