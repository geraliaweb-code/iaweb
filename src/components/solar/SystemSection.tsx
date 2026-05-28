'use client'

import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import { Brain, Zap, Globe2 } from 'lucide-react'

const PILLARS = [
  {
    Icon: Brain,
    number: '01',
    title: 'Inteligência Artificial',
    body: 'Algoritmos proprietários que identificam empresas com intenção de compra ativa. Dados comportamentais, financeiros e geográficos combinados para qualificação precisa — sem desperdício de tempo comercial.',
    tag: 'Qualificação 95% precisa',
  },
  {
    Icon: Zap,
    number: '02',
    title: 'Automação de Aquisição',
    body: 'Fluxos automatizados que nutrem e qualificam prospects em múltiplos canais em simultâneo. A sua equipa de vendas recebe leads prontos para reunião — não para prospetar.',
    tag: '500+ contactos/mês',
  },
  {
    Icon: Globe2,
    number: '03',
    title: 'Distribuição Digital',
    body: 'Presença estratégica nos canais onde os decisores de compra de energia solar estão ativos. Visibilidade construída com dados reais, não com suposições de agência.',
    tag: 'Portugal + Espanha',
  },
]

export default function SystemSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section
      className="relative bg-slate-950 py-24 md:py-32 px-6 md:px-12 lg:px-16 overflow-hidden"
      id="sistema"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-amber-500/[0.03] blur-3xl rounded-full" />
      </div>
      <div className="absolute top-0 left-[8%] right-[8%] h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-end mb-20"
        >
          <div className="lg:col-span-3 space-y-4">
            <p className="text-amber-400 text-xs font-bold tracking-[0.2em] uppercase">
              O Sistema IAWEB
            </p>
            <h2 className="text-4xl md:text-[2.75rem] font-black text-white leading-[1.1] tracking-tight">
              Três pilares que geram{' '}
              <span className="bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">
                resultados previsíveis
              </span>
            </h2>
          </div>
          <p className="lg:col-span-2 text-base text-slate-400 leading-relaxed">
            Não vendemos promessas. Entregamos um sistema de aquisição construído sobre
            dados reais e tecnologia proprietária que opera 24/7.
          </p>
        </motion.div>

        {/* Pillars grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PILLARS.map((pillar, i) => {
            const Icon = pillar.Icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 36 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.14, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group relative rounded-2xl border border-white/[0.07] bg-white/[0.025] p-7 overflow-hidden cursor-default"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.07] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/0 to-transparent group-hover:via-amber-400/30 transition-all duration-500 pointer-events-none" />

                <div className="relative z-10 space-y-5">
                  {/* Icon row */}
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5.5 h-5.5 text-amber-400" strokeWidth={1.75} />
                    </div>
                    <span className="text-6xl font-black text-white/[0.035] leading-none tabular-nums select-none">
                      {pillar.number}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white">{pillar.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{pillar.body}</p>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                    <span className="w-1 h-1 rounded-full bg-amber-400 flex-shrink-0" />
                    {pillar.tag}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
