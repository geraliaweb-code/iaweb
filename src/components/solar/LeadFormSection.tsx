'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { ArrowRight, Sun } from 'lucide-react'

interface FormState {
  nome: string
  empresa: string
  pais: string
  whatsapp: string
  website: string
}

const COUNTRIES = [
  'Portugal', 'Espanha', 'Brasil', 'Itália', 'França',
  'Alemanha', 'Reino Unido', 'Outro',
]

export default function LeadFormSection() {
  const [form, setForm] = useState<FormState>({
    nome: '', empresa: '', pais: '', whatsapp: '', website: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const set = (k: keyof FormState) => (v: string) =>
    setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section
      className="relative bg-slate-950 py-24 md:py-32 px-6 md:px-12 lg:px-16 overflow-hidden"
      id="contacto"
    >
      <div className="absolute top-0 left-[8%] right-[8%] h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-amber-500/[0.04] blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* Left — copy */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <p className="text-amber-400 text-xs font-bold tracking-[0.2em] uppercase">
              Comece o seu piloto
            </p>
            <h2 className="text-4xl md:text-[2.75rem] font-black text-white leading-[1.1] tracking-tight">
              Pronto para clientes{' '}
              <span className="bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">
                que fecham?
              </span>
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed max-w-md">
              Preencha o formulário e um especialista da IAWEB irá contactá-lo em menos
              de 24 horas com um plano personalizado para a sua empresa solar.
            </p>

            {/* Guarantees */}
            <div className="space-y-3 pt-2">
              {[
                'Resposta garantida em menos de 24h',
                'Diagnóstico inicial sem custo',
                'Sem compromisso após o primeiro contacto',
              ].map(item => (
                <div key={item} className="flex items-center gap-3 text-sm text-slate-400">
                  <div className="w-5 h-5 rounded-full bg-amber-500/15 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-400 text-[9px] font-black">✓</span>
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — form card */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-7 md:p-8 shadow-2xl shadow-black/30">
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-amber-500/15 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-0 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-amber-400/25 to-transparent" />

              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="mb-5">
                    <h3 className="text-lg font-bold text-white">Análise Gratuita</h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Receba o seu plano personalizado em 24h
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field
                      label="Nome completo"
                      placeholder="João Silva"
                      value={form.nome}
                      onChange={set('nome')}
                      required
                    />
                    <Field
                      label="Empresa"
                      placeholder="Solar S.A."
                      value={form.empresa}
                      onChange={set('empresa')}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 tracking-widest uppercase">
                      País
                    </label>
                    <select
                      value={form.pais}
                      onChange={e => set('pais')(e.target.value)}
                      required
                      className="w-full bg-slate-900/60 border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled className="bg-slate-900">Selecione o país</option>
                      {COUNTRIES.map(c => (
                        <option key={c} value={c} className="bg-slate-900">{c}</option>
                      ))}
                    </select>
                  </div>

                  <Field
                    label="WhatsApp"
                    placeholder="+351 912 345 678"
                    type="tel"
                    value={form.whatsapp}
                    onChange={set('whatsapp')}
                    required
                  />
                  <Field
                    label="Website (opcional)"
                    placeholder="www.empresa.pt"
                    type="url"
                    value={form.website}
                    onChange={set('website')}
                  />

                  <ShimmerButton
                    shimmerColor="#fbbf24"
                    background="rgba(2, 6, 23, 0.95)"
                    borderRadius="12px"
                    type="submit"
                    className="w-full justify-center py-4 text-sm font-bold border-white/[0.1] gap-2.5 mt-2"
                  >
                    Quero Mais Clientes
                    <ArrowRight className="w-4 h-4 flex-shrink-0" />
                  </ShimmerButton>

                  <p className="text-center text-xs text-slate-700 pt-1">
                    Sem spam · Dados protegidos · Resposta em 24h
                  </p>
                </form>
              ) : (
                <SuccessView />
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ── Sub-components ──────────────────────────────────────────────────────── */

function Field({
  label, placeholder, value, onChange, type = 'text', required = false,
}: {
  label: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  type?: string
  required?: boolean
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-1.5 tracking-widest uppercase">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        className="w-full bg-slate-900/60 border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 transition-all"
      />
    </div>
  )
}

function SuccessView() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="py-10 text-center space-y-5"
    >
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 15, delay: 0.1 }}
        className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10"
      >
        <Sun className="w-7 h-7 text-amber-400" />
      </motion.div>
      <div>
        <h3 className="text-xl font-bold text-white">Pedido recebido</h3>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed max-w-xs mx-auto">
          A nossa equipa vai contactá-lo via WhatsApp em menos de 24 horas com o plano personalizado.
        </p>
      </div>
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Em análise pela equipa IAWEB
      </div>
    </motion.div>
  )
}
