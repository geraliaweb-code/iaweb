'use client'

import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import { AlertTriangle, TrendingDown, Users, Quote } from 'lucide-react'

const PROBLEMS = [
  {
    Icon: Users,
    title: 'Indicação',
    stat: '73%',
    statDesc: 'das empresas solares dependem de referências de clientes anteriores',
    body: 'Crescimento imprevisível. Dependente de clientes satisfeitos que talvez nunca recomendem.',
  },
  {
    Icon: TrendingDown,
    title: 'Porta a porta',
    stat: '€2.400',
    statDesc: 'custo médio por lead qualificado via equipa comercial terrestre',
    body: 'Alto custo operacional, baixa escalabilidade e equipa desgastada com prospeção manual.',
  },
  {
    Icon: AlertTriangle,
    title: 'Sorte',
    stat: '0',
    statDesc: 'sistemas previsíveis de geração de clientes na maioria das empresas',
    body: 'Meses bons seguidos de meses fracos. Sem controlo. Sem previsibilidade. Sem escala.',
  },
]

export default function ProblemSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      className="relative bg-slate-950 py-24 md:py-32 px-6 md:px-12 lg:px-16 overflow-hidden"
      id="problema"
    >
      {/* Subtle warm danger glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-red-950/[0.18] blur-3xl rounded-full" />
      </div>
      <div className="absolute top-0 left-[8%] right-[8%] h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-16 max-w-2xl space-y-4"
        >
          <p className="text-amber-400 text-xs font-bold tracking-[0.2em] uppercase">
            O problema que ninguém quer admitir
          </p>
          <h2 className="text-4xl md:text-[2.75rem] font-black text-white leading-[1.1] tracking-tight">
            A sua empresa solar está a crescer{' '}
            <span className="text-slate-500">ou apenas a sobreviver?</span>
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed">
            A maioria das empresas solares usa as mesmas três estratégias de aquisição —
            e todas têm o mesmo problema fundamental.
          </p>
        </motion.div>

        {/* Problem cards */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {PROBLEMS.map((p, i) => {
            const Icon = p.Icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 36 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="group relative rounded-2xl border border-white/[0.05] bg-white/[0.02] p-7 overflow-hidden"
              >
                {/* Hover reveal */}
                <div className="absolute inset-0 bg-gradient-to-b from-red-950/[0.12] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

                <div className="relative z-10 space-y-5">
                  <div className="w-10 h-10 rounded-xl bg-red-950/25 border border-red-900/25 flex items-center justify-center">
                    <Icon className="w-4.5 h-4.5 text-red-400/60" strokeWidth={2} />
                  </div>

                  <div>
                    <p className="text-4xl font-black text-white tabular-nums leading-none">
                      {p.stat}
                    </p>
                    <p className="text-xs text-slate-500 mt-1.5 leading-snug max-w-[16rem]">
                      {p.statDesc}
                    </p>
                  </div>

                  <div className="pt-1 border-t border-white/[0.04]">
                    <p className="text-sm font-semibold text-slate-300 mb-1.5">{p.title}</p>
                    <p className="text-sm text-slate-500 leading-relaxed">{p.body}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Contrast quote — the shift */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative rounded-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/[0.09] via-amber-500/[0.04] to-transparent" />
          <div className="absolute inset-0 border border-amber-500/[0.15] rounded-2xl" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-amber-400/40 via-amber-300/15 to-transparent" />

          <div className="relative p-8 md:p-10">
            <Quote className="w-7 h-7 text-amber-400/25 mb-4" />
            <p className="text-xl md:text-2xl font-semibold text-slate-200 leading-relaxed max-w-3xl">
              "Se a sua empresa solar ainda depende de indicação, porta a porta ou sorte,{' '}
              <span className="text-amber-300 font-bold">está vulnerável.</span>"
            </p>
            <p className="text-sm text-slate-600 mt-5">
              — IAWEB · Diagnóstico de aquisição comercial
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
