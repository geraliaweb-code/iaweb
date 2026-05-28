'use client'

import { motion } from 'motion/react'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { ArrowRight, Check } from 'lucide-react'

const FEATURES = [
  'Diagnóstico completo do mercado',
  'Setup técnico da infraestrutura',
  'Primeiros 20 leads qualificados',
  'Relatórios semanais de performance',
  'Suporte direto via WhatsApp',
  'Reunião de revisão mensal',
]

const DIFFERENTIALS = [
  { value: 'Sem', label: 'contratos de longo prazo' },
  { value: 'Sem', label: 'custos de setup iniciais' },
  { value: 'Com', label: 'garantia de entrega no piloto' },
]

export default function PilotOfferSection() {
  return (
    <section
      className="relative bg-slate-950 py-24 md:py-32 px-6 md:px-12 lg:px-16 overflow-hidden"
      id="oferta"
    >
      <div className="absolute top-0 left-[8%] right-[8%] h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      {/* Amber centered glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-amber-500/[0.05] blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center mb-14 space-y-4"
        >
          <p className="text-amber-400 text-xs font-bold tracking-[0.2em] uppercase">
            Oferta de entrada
          </p>
          <h2 className="text-4xl md:text-[2.75rem] font-black text-white leading-[1.1] tracking-tight">
            Piloto Premium
          </h2>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            Comprove o sistema antes de escalar. Risco mínimo, resultado máximo.
          </p>
        </motion.div>

        {/* Offer card */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative max-w-3xl mx-auto"
        >
          {/* Outer glow */}
          <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-amber-500/30 via-amber-500/10 to-transparent pointer-events-none" />

          <div className="relative rounded-3xl border border-amber-500/20 bg-white/[0.025] backdrop-blur-sm overflow-hidden">
            {/* Top amber line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

            <div className="p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                {/* Left — pricing */}
                <div className="space-y-6">
                  <div>
                    <div className="flex items-start gap-1">
                      <span className="text-lg text-amber-400 font-bold mt-2">€</span>
                      <span className="text-6xl font-black text-white leading-none tabular-nums">497</span>
                      <span className="text-slate-400 text-sm mt-auto mb-1">/mês</span>
                    </div>
                    <p className="text-sm text-amber-400/80 font-medium mt-2">
                      + fee por lead qualificado entregue
                    </p>
                  </div>

                  <p className="text-sm text-slate-400 leading-relaxed">
                    Modelo transparente: apenas paga pelos resultados. A mensalidade cobre
                    a operação, o fee reflete a performance.
                  </p>

                  {/* Risk-free labels */}
                  <div className="space-y-2.5">
                    {DIFFERENTIALS.map((d, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                          d.value === 'Sem'
                            ? 'bg-slate-800 border border-white/10'
                            : 'bg-amber-500/20 border border-amber-500/30'
                        }`}>
                          <span className={`text-[9px] font-black ${
                            d.value === 'Sem' ? 'text-slate-500' : 'text-amber-400'
                          }`}>
                            {d.value === 'Sem' ? '✕' : '✓'}
                          </span>
                        </div>
                        <span className={`text-sm ${
                          d.value === 'Sem' ? 'text-slate-500' : 'text-slate-300'
                        }`}>
                          <span className="font-semibold">{d.value}</span> {d.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <ShimmerButton
                    shimmerColor="#fbbf24"
                    background="rgba(2, 6, 23, 0.95)"
                    borderRadius="12px"
                    className="w-full justify-center px-6 py-4 text-sm font-bold border-amber-500/20 gap-2"
                  >
                    Quero Mais Clientes
                    <ArrowRight className="w-4 h-4 flex-shrink-0" />
                  </ShimmerButton>
                </div>

                {/* Right — features */}
                <div className="space-y-4">
                  <p className="text-xs font-bold text-slate-500 tracking-[0.15em] uppercase">
                    O que está incluído
                  </p>
                  <ul className="space-y-3">
                    {FEATURES.map(feature => (
                      <li key={feature} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-amber-500/15 border border-amber-500/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-amber-400" strokeWidth={2.5} />
                        </div>
                        <span className="text-sm text-slate-300 leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-4 border-t border-white/[0.05]">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      O piloto tem duração mínima de 30 dias. Após o período piloto,
                      pode escalar ou encerrar sem penalizações.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
