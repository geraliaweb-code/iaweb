'use client'

import { motion } from 'motion/react'
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid'
import { TrendingUp, Globe2, Clock, BarChart3 } from 'lucide-react'

/* ── Bento card backgrounds ──────────────────────────────────────────────── */

const BAR_HEIGHTS = [38, 55, 48, 70, 58, 82, 66, 90, 74, 100]

function ChartBackground() {
  return (
    <div className="absolute inset-0 flex items-end justify-start gap-[3px] px-6 pb-0 pt-8 opacity-25">
      {BAR_HEIGHTS.map((h, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-t-sm bg-gradient-to-t from-amber-600 to-amber-300"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: `${h}%`, originY: 1 }}
        />
      ))}
    </div>
  )
}

const MAP_DOTS = [
  { x: 15, y: 30, d: 0 }, { x: 28, y: 55, d: 0.3 }, { x: 38, y: 22, d: 0.6 },
  { x: 48, y: 48, d: 0.9 }, { x: 58, y: 32, d: 1.2 }, { x: 68, y: 62, d: 0.4 },
  { x: 78, y: 38, d: 0.7 }, { x: 88, y: 52, d: 1.0 }, { x: 22, y: 72, d: 0.2 },
  { x: 52, y: 78, d: 0.5 }, { x: 72, y: 18, d: 0.8 }, { x: 42, y: 42, d: 1.1 },
]

function MapBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {MAP_DOTS.map((dot, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-amber-400"
          style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0.5, 0.25], scale: [0, 1, 0.85] }}
          transition={{
            duration: 2,
            delay: dot.d,
            repeat: Infinity,
            repeatDelay: 3,
            ease: 'easeInOut',
          }}
        />
      ))}
      {/* Connecting arc */}
      <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 200 100">
        <path d="M 30 50 Q 100 20 170 50" stroke="#fbbf24" strokeWidth="0.5" fill="none" />
        <path d="M 20 70 Q 100 40 180 70" stroke="#fbbf24" strokeWidth="0.5" fill="none" />
      </svg>
    </div>
  )
}

function NumberWatermark({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <span className="text-[5rem] font-black text-white/[0.025] leading-none select-none tracking-tighter">
        {label}
      </span>
    </div>
  )
}

/* ── Features config ─────────────────────────────────────────────────────── */

const FEATURES = [
  {
    Icon: TrendingUp,
    name: '+500 leads qualificados por mês',
    description:
      'Leads verificados com intenção de compra real, filtrados por IA proprietária. Nenhum contacto frio, apenas oportunidades reais.',
    href: '#contacto',
    cta: 'Ver metodologia',
    background: <ChartBackground />,
    className: 'lg:col-span-2',
  },
  {
    Icon: Globe2,
    name: 'Portugal + Espanha',
    description:
      'Cobertura completa nos dois maiores mercados ibéricos de energia solar.',
    href: '#contacto',
    cta: 'Ver cobertura',
    background: <MapBackground />,
    className: 'lg:col-span-1',
  },
  {
    Icon: Clock,
    name: 'Primeiro lead em menos de 48h',
    description:
      'Da ativação ao primeiro contacto qualificado em menos de 48 horas úteis.',
    href: '#contacto',
    cta: 'Ver processo',
    background: <NumberWatermark label="48h" />,
    className: 'lg:col-span-1',
  },
  {
    Icon: BarChart3,
    name: '€14M+ em contratos gerados',
    description:
      'Volume acumulado de contratos solares facilitados pelos nossos sistemas de aquisição.',
    href: '#contacto',
    cta: 'Ver resultados',
    background: <NumberWatermark label="€14M" />,
    className: 'lg:col-span-2',
  },
]

/* ── Component ───────────────────────────────────────────────────────────── */

export default function MetricsSection() {
  return (
    <section
      className="relative bg-slate-950 py-24 md:py-32 px-6 md:px-12 lg:px-16 overflow-hidden"
      id="metricas"
    >
      <div className="absolute top-0 left-[8%] right-[8%] h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-1/4 right-0 w-[600px] h-[500px] bg-amber-500/[0.025] blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center mb-14 space-y-4"
        >
          <p className="text-amber-400 text-xs font-bold tracking-[0.2em] uppercase">
            Resultados comprovados
          </p>
          <h2 className="text-4xl md:text-[2.75rem] font-black text-white leading-[1.1] tracking-tight">
            Métricas que{' '}
            <span className="bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">
              definem o padrão
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            Números reais de campanhas ativas em Portugal e Espanha.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <BentoGrid className="grid-cols-1 md:grid-cols-3 auto-rows-[18rem]">
            {FEATURES.map(feature => (
              <BentoCard key={feature.name} {...feature} />
            ))}
          </BentoGrid>
        </motion.div>
      </div>
    </section>
  )
}
