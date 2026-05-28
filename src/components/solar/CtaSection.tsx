'use client'

import { motion } from 'motion/react'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { ArrowRight } from 'lucide-react'

export default function CtaSection() {
  return (
    <section className="relative bg-slate-950 py-24 md:py-32 px-6 md:px-12 lg:px-16 overflow-hidden">
      <div className="absolute top-0 left-[8%] right-[8%] h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* Deep amber glow — final CTA climax */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-amber-500/[0.07] blur-3xl rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-amber-400/[0.06] blur-2xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="space-y-6"
        >
          <p className="text-amber-400 text-xs font-bold tracking-[0.2em] uppercase">
            A decisão é agora
          </p>

          <h2 className="text-4xl md:text-5xl lg:text-[3.25rem] font-black text-white leading-[1.08] tracking-tight">
            A sua empresa solar está
            <br />
            <span className="text-slate-500">a crescer ou a sobreviver?</span>
          </h2>

          <p className="text-xl md:text-2xl font-semibold text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Cada mês sem um sistema de aquisição previsível é receita perdida para
            um concorrente que já o tem.
          </p>
        </motion.div>

        {/* Amber divider line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="w-24 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto origin-center"
        />

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="space-y-4"
        >
          <ShimmerButton
            shimmerColor="#fbbf24"
            background="rgba(2, 6, 23, 0.9)"
            borderRadius="14px"
            className="px-10 py-5 text-lg font-black border-amber-500/20 gap-3 mx-auto"
          >
            Quero Mais Clientes
            <ArrowRight className="w-5 h-5 flex-shrink-0" />
          </ShimmerButton>

          <p className="text-sm text-slate-600">
            A partir de €497/mês · Primeiro lead em 48h · Sem contrato longo prazo
          </p>
        </motion.div>
      </div>
    </section>
  )
}
