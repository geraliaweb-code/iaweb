"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useInView, animate } from "motion/react"
import { Star, Quote } from "lucide-react"

function useCounter(from: number, to: number, duration: number, trigger: boolean) {
  const [value, setValue] = useState(from)
  useEffect(() => {
    if (!trigger) return
    const controls = animate(from, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setValue(Math.round(v * 10) / 10),
    })
    return () => controls.stop()
  }, [trigger, from, to, duration])
  return value
}

const metrics = [
  { value: 347, suffix: "", prefix: "+", label: "Leads gerados/mês", color: "#38BDF8", glow: "rgba(56,189,248,0.15)" },
  { value: 78, suffix: "%", prefix: "", label: "Taxa de conversão", color: "#F59E0B", glow: "rgba(245,158,11,0.15)" },
  { value: 23.4, suffix: "k", prefix: "€", label: "Receita média gerada", color: "#22C55E", glow: "rgba(34,197,94,0.15)" },
  { value: 48, suffix: "h", prefix: "", label: "Tempo médio de entrega", color: "#A78BFA", glow: "rgba(167,139,250,0.15)" },
]

const testimonials = [
  {
    name: "Ricardo Mendes",
    role: "CEO, TerraLuz Solar",
    text: "Em 3 semanas passámos de 12 leads por mês para 94. O sistema da IAWEB transformou completamente o nosso funil de vendas.",
    stars: 5,
  },
  {
    name: "Ana Ferreira",
    role: "Directora Comercial, ClimaTech",
    text: "O CRM inteligente reduziu o nosso tempo de resposta de 48h para 12 minutos. A taxa de fecho aumentou 40% no primeiro mês.",
    stars: 5,
  },
  {
    name: "Paulo Santos",
    role: "Fundador, EnergiaPro",
    text: "Nunca pensei que automação pudesse parecer tão humana. Os nossos clientes não percebem que é um sistema — e os resultados são reais.",
    stars: 5,
  },
]

function MetricCard({
  metric,
  index,
  inView,
}: {
  metric: (typeof metrics)[0]
  index: number
  inView: boolean
}) {
  const isDecimal = metric.value % 1 !== 0
  const counterValue = useCounter(0, metric.value, 1.8 + index * 0.1, inView)

  const displayValue = isDecimal
    ? counterValue.toFixed(1)
    : Math.round(counterValue as number).toString()

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 32, scale: 0.95 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${metric.glow.replace("0.15", "0.2")}`,
        borderRadius: "20px",
        padding: "36px 28px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        boxShadow: `0 0 60px ${metric.glow}`,
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: "-40px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "160px",
          height: "160px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${metric.glow} 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Value */}
      <div
        style={{
          fontSize: "clamp(2.4rem, 4vw, 3.6rem)",
          fontWeight: 900,
          letterSpacing: "-0.04em",
          color: metric.color,
          marginBottom: "8px",
          lineHeight: 1,
          textShadow: `0 0 30px ${metric.color}60`,
          position: "relative",
        }}
      >
        {metric.prefix}
        {displayValue}
        {metric.suffix}
      </div>

      {/* Label */}
      <div
        style={{
          fontSize: "14px",
          fontWeight: 500,
          color: "#64748B",
          position: "relative",
        }}
      >
        {metric.label}
      </div>
    </motion.div>
  )
}

function TestimonialCard({
  testimonial,
  index,
  inView,
}: {
  testimonial: (typeof testimonials)[0]
  index: number
  inView: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay: 0.4 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "16px",
        padding: "28px",
        position: "relative",
      }}
    >
      <Quote
        size={20}
        color="rgba(14, 165, 233, 0.3)"
        style={{ marginBottom: "16px" }}
      />

      {/* Stars */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "16px" }}>
        {Array.from({ length: testimonial.stars }).map((_, i) => (
          <Star key={i} size={14} color="#F59E0B" fill="#F59E0B" />
        ))}
      </div>

      <p
        style={{
          fontSize: "14px",
          lineHeight: 1.7,
          color: "#94A3B8",
          marginBottom: "20px",
          fontStyle: "italic",
        }}
      >
        &ldquo;{testimonial.text}&rdquo;
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(14,165,233,0.4), rgba(245,158,11,0.4))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            fontWeight: 700,
            color: "#F8FAFC",
            flexShrink: 0,
          }}
        >
          {testimonial.name[0]}
        </div>
        <div>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#F8FAFC" }}>{testimonial.name}</div>
          <div style={{ fontSize: "12px", color: "#64748B" }}>{testimonial.role}</div>
        </div>
      </div>
    </motion.div>
  )
}

export default function ResultsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section
      id="resultados"
      ref={ref}
      style={{
        background: "#030712",
        padding: "120px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background radial glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "800px",
          height: "400px",
          background:
            "radial-gradient(ellipse, rgba(14, 165, 233, 0.05) 0%, rgba(245, 158, 11, 0.03) 40%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "center", marginBottom: "64px" }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "100px",
              background: "rgba(245, 158, 11, 0.06)",
              border: "1px solid rgba(245, 158, 11, 0.15)",
              marginBottom: "20px",
            }}
          >
            <span style={{ color: "#FCD34D", fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Resultados
            </span>
          </div>

          <h2
            style={{
              fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
              fontWeight: 800,
              color: "#F8FAFC",
              letterSpacing: "-0.03em",
              marginBottom: "16px",
            }}
          >
            Números que{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #F59E0B, #FCD34D)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              falam por si
            </span>
          </h2>

          <p style={{ fontSize: "1.05rem", color: "#64748B", maxWidth: "440px", margin: "0 auto", lineHeight: 1.7 }}>
            Métricas reais de clientes que adoptaram o sistema IAWEB.
          </p>
        </motion.div>

        {/* Metrics grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
            marginBottom: "80px",
          }}
          className="metrics-grid"
        >
          {metrics.map((metric, i) => (
            <MetricCard key={metric.label} metric={metric} index={i} inView={inView} />
          ))}
        </div>

        {/* Testimonials */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
          }}
          className="testimonials-grid"
        >
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name} testimonial={t} index={i} inView={inView} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .metrics-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .testimonials-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .metrics-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  )
}
