'use client'

import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import { Search, Rocket, CheckCircle2 } from 'lucide-react'

const STEPS = [
  {
    Icon: Search,
    number: '01',
    title: 'Diagnóstico',
    period: 'Semana 1',
    body: 'Mapeamos o seu mercado, perfil de cliente ideal e oportunidades geográficas. Identificamos onde estão os seus melhores clientes potenciais.',
    details: ['Análise de ICP', 'Mapeamento geográfico', 'Definição de canais', 'Benchmark competitivo'],
  },
  {
    Icon: Rocket,
    number: '02',
    title: 'Ativação',
    period: 'Semana 2–3',
    body: 'Lançamos as campanhas de aquisição com a infraestrutura técnica configurada. IA a qualificar prospects em tempo real, 24/7.',
    details: ['Setup da infraestrutura', 'Lançamento de campanhas', 'IA em produção', 'Primeiros contactos'],
  },
  {
    Icon: CheckCircle2,
    number: '03',
    title: 'Entrega',
    period: 'Semana 4+',
    body: 'Recebe leads qualificados prontos para reunião comercial. A sua equipa foca-se exclusivamente em fechar negócios.',
    details: ['Leads verificados', 'Relatórios semanais', 'Otimização contínua', 'Suporte dedicado'],
  },
]

export default function ProcessSection() {
  const ref = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const lineInView = useInView(lineRef, { once: true, margin: '-40px' })

  return (
    <section
      className="relative bg-slate-950 py-24 md:py-32 px-6 md:px-12 lg:px-16 overflow-hidden"
      id="processo"
    >
      <div className="absolute top-0 left-[8%] right-[8%] h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center mb-16 md:mb-20 space-y-4"
        >
          <p className="text-amber-400 text-xs font-bold tracking-[0.2em] uppercase">
            Como funciona
          </p>
          <h2 className="text-4xl md:text-[2.75rem] font-black text-white leading-[1.1] tracking-tight">
            De zero a clientes em{' '}
            <span className="bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">
              30 dias
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
            Um processo estruturado, sem surpresas, com resultados mensuráveis desde a primeira semana.
          </p>
        </motion.div>

        {/* Timeline */}
        <div ref={ref} className="relative">

          {/* Desktop connecting line */}
          <div
            ref={lineRef}
            className="hidden md:block absolute top-[26px] left-[calc(16.5%+20px)] right-[calc(16.5%+20px)] h-px overflow-hidden"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={lineInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="h-full origin-left"
              style={{
                background: 'linear-gradient(90deg, rgba(251,191,36,0.4), rgba(251,191,36,0.15), rgba(251,191,36,0.4))',
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
            {STEPS.map((step, i) => {
              const Icon = step.Icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 32 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.18, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col"
                >
                  {/* Step circle */}
                  <div className="flex items-center gap-4 md:block mb-6">
                    <div className="relative flex-shrink-0 w-[52px] h-[52px] rounded-full bg-slate-950 border-2 border-amber-500/35 flex items-center justify-center z-10 shadow-lg shadow-amber-500/5">
                      <Icon className="w-5 h-5 text-amber-400" strokeWidth={2} />
                    </div>
                    {/* Mobile side line */}
                    <div className="md:hidden flex-1 h-px bg-gradient-to-r from-amber-500/20 to-transparent" />
                  </div>

                  <div className="space-y-3 md:pt-0">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] font-black text-amber-400/50 tracking-[0.2em] uppercase">
                        {step.number}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-700" />
                      <span className="text-xs text-slate-500">{step.period}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">{step.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{step.body}</p>

                    <ul className="space-y-2 pt-2">
                      {step.details.map(detail => (
                        <li key={detail} className="flex items-center gap-2 text-sm text-slate-500">
                          <span className="w-1 h-1 rounded-full bg-amber-400/40 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
