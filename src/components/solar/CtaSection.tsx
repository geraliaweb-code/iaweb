'use client'

import { motion } from 'motion/react'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { ArrowRight } from 'lucide-react'

export default function CtaSection() {
  return (
    <section className="relative bg-slate-950 py-24 md:py-32 px-6 md:px-10 lg:px-16 overflow-hidden">
      <div className="absolute top-0 left-[8%] right-[8%] h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* Single, very restrained radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(251,191,36,0.03) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-3xl mx-auto text-center">

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.48 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-3 text-[11px] font-medium text-slate-500 tracking-[0.18em] uppercase">
            <span className="block w-5 h-px bg-amber-400/40" />
            A decisão é agora
            <span className="block w-5 h-px bg-amber-400/40" />
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.48, delay: 0.06 }}
          className="text-4xl md:text-5xl font-bold text-white leading-[1.07] tracking-[-0.02em] mb-5"
        >
          A sua empresa está a crescer{' '}
          <span className="text-slate-500">ou a sobreviver?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.48, delay: 0.12 }}
          className="text-base md:text-lg text-slate-400/80 leading-relaxed mb-10 max-w-xl mx-auto"
        >
          Cada mês sem um sistema de aquisição previsível é receita que vai
          para um concorrente que já o tem.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.18 }}
          className="flex flex-col items-center gap-3"
        >
          <ShimmerButton
            shimmerColor="#fbbf24"
            background="rgba(3, 7, 18, 0.97)"
            borderRadius="10px"
            className="px-7 py-3.5 text-sm font-semibold border-white/[0.1] gap-2"
          >
            Pedir diagnóstico gratuito
            <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
          </ShimmerButton>

          <p className="text-xs text-slate-600">
            A partir de €497/mês · Primeiro resultado em 48h · Sem contrato longo prazo
          </p>
        </motion.div>
      </div>
    </section>
  )
}
