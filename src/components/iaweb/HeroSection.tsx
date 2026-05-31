"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView, animate } from "motion/react"
import { ArrowRight, MessageCircle, Mail, Phone, Zap, TrendingUp, Users, Activity } from "lucide-react"

const WHATSAPP_URL =
  "https://wa.me/351913837004?text=Ol%C3%A1%2C+quero+um+diagn%C3%B3stico+gratuito+da+IAWEB."

// Animated counter hook
function useCounter(from: number, to: number, duration: number, trigger: boolean) {
  const [value, setValue] = useState(from)

  useEffect(() => {
    if (!trigger) return
    const controls = animate(from, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    })
    return () => controls.stop()
  }, [trigger, from, to, duration])

  return value
}

// Activity feed items
const activityItems = [
  { color: "#0EA5E9", label: "Lead qualificado recebido", time: "agora mesmo" },
  { color: "#F59E0B", label: "Automação de follow-up activa", time: "2m atrás" },
  { color: "#22C55E", label: "Website publicado com sucesso", time: "5m atrás" },
  { color: "#A78BFA", label: "Relatório de métricas gerado", time: "12m atrás" },
]

// Bar chart data
const barData = [42, 58, 71, 65, 83, 79, 94, 88, 78, 100, 91, 85]

function DashboardCard() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })
  const leads = useCounter(0, 347, 2, inView)
  const revenue = useCounter(0, 234, 2.2, inView)
  const conversion = useCounter(0, 78, 1.8, inView)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 60, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: "rgba(10, 15, 30, 0.85)",
          border: "1px solid rgba(14, 165, 233, 0.25)",
          borderRadius: "20px",
          padding: "24px",
          width: "100%",
          maxWidth: "420px",
          backdropFilter: "blur(20px)",
          boxShadow:
            "0 0 80px rgba(14, 165, 233, 0.12), 0 0 120px rgba(14, 165, 233, 0.06), 0 24px 48px rgba(0,0,0,0.5)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow inner */}
        <div
          style={{
            position: "absolute",
            top: "-60px",
            right: "-60px",
            width: "200px",
            height: "200px",
            background: "radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Zap size={16} color="#F59E0B" />
            <span style={{ color: "#F8FAFC", fontSize: "14px", fontWeight: 700, letterSpacing: "-0.01em" }}>
              Sistema IAWEB
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#22C55E",
                boxShadow: "0 0 8px rgba(34, 197, 94, 0.8)",
              }}
            />
            <span style={{ color: "#22C55E", fontSize: "12px", fontWeight: 600 }}>Activo</span>
          </div>
        </div>

        {/* Metrics row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              background: "rgba(14, 165, 233, 0.06)",
              border: "1px solid rgba(14, 165, 233, 0.12)",
              borderRadius: "12px",
              padding: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
              <Users size={13} color="#94A3B8" />
              <span style={{ color: "#94A3B8", fontSize: "11px", fontWeight: 500 }}>Leads/mês</span>
            </div>
            <div style={{ color: "#38BDF8", fontSize: "28px", fontWeight: 800, letterSpacing: "-0.03em" }}>
              {leads}
            </div>
          </div>
          <div
            style={{
              background: "rgba(245, 158, 11, 0.06)",
              border: "1px solid rgba(245, 158, 11, 0.12)",
              borderRadius: "12px",
              padding: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
              <TrendingUp size={13} color="#94A3B8" />
              <span style={{ color: "#94A3B8", fontSize: "11px", fontWeight: 500 }}>Receita gerada</span>
            </div>
            <div style={{ color: "#FCD34D", fontSize: "28px", fontWeight: 800, letterSpacing: "-0.03em" }}>
              €{(revenue / 10).toFixed(1)}k
            </div>
          </div>
        </div>

        {/* Conversion bar */}
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <span style={{ color: "#94A3B8", fontSize: "12px" }}>Taxa de conversão</span>
            <span style={{ color: "#38BDF8", fontSize: "13px", fontWeight: 700 }}>{conversion}%</span>
          </div>
          <div
            style={{
              height: "6px",
              borderRadius: "3px",
              background: "rgba(255,255,255,0.06)",
              overflow: "hidden",
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: inView ? `${conversion}%` : 0 }}
              transition={{ duration: 1.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                height: "100%",
                borderRadius: "3px",
                background: "linear-gradient(90deg, #0EA5E9, #38BDF8)",
                boxShadow: "0 0 12px rgba(14, 165, 233, 0.5)",
              }}
            />
          </div>
        </div>

        {/* Activity feed */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: "16px",
            marginBottom: "20px",
          }}
        >
          {activityItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -10 }}
              transition={{ duration: 0.3, delay: 0.8 + i * 0.1 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "7px 0",
                borderBottom: i < activityItems.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: item.color,
                  flexShrink: 0,
                  boxShadow: `0 0 8px ${item.color}80`,
                }}
              />
              <span style={{ color: "#CBD5E1", fontSize: "12px", flex: 1 }}>{item.label}</span>
              <span style={{ color: "#475569", fontSize: "11px", flexShrink: 0 }}>{item.time}</span>
            </motion.div>
          ))}
        </div>

        {/* Mini bar chart */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
            <Activity size={13} color="#94A3B8" />
            <span style={{ color: "#94A3B8", fontSize: "11px" }}>Actividade últimas 12h</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: "4px",
              height: "48px",
            }}
          >
            {barData.map((val, i) => (
              <motion.div
                key={i}
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: inView ? `${(val / 100) * 48}px` : 0,
                  opacity: inView ? 1 : 0,
                }}
                transition={{ duration: 0.5, delay: 1.2 + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  flex: 1,
                  borderRadius: "3px 3px 0 0",
                  background:
                    i === barData.length - 3
                      ? "linear-gradient(to top, #0EA5E9, #38BDF8)"
                      : "rgba(14, 165, 233, 0.25)",
                  boxShadow:
                    i === barData.length - 3 ? "0 0 8px rgba(14, 165, 233, 0.5)" : "none",
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Floating particle
function Particle({ x, y, size, delay }: { x: string; y: string; size: number; delay: number }) {
  return (
    <motion.div
      animate={{ y: [-8, 8, -8], opacity: [0.3, 0.7, 0.3] }}
      transition={{ duration: 4 + delay, repeat: Infinity, ease: "easeInOut", delay }}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: "50%",
        background: "rgba(14, 165, 233, 0.6)",
        boxShadow: "0 0 12px rgba(14, 165, 233, 0.8)",
        pointerEvents: "none",
      }}
    />
  )
}

const particles = [
  { x: "15%", y: "20%", size: 3, delay: 0 },
  { x: "80%", y: "15%", size: 2, delay: 0.8 },
  { x: "70%", y: "70%", size: 4, delay: 1.5 },
  { x: "25%", y: "75%", size: 2, delay: 2.1 },
  { x: "90%", y: "45%", size: 3, delay: 0.4 },
  { x: "5%", y: "55%", size: 2, delay: 1.2 },
  { x: "50%", y: "10%", size: 2, delay: 1.8 },
]

export default function HeroSection() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100dvh",
        background: "#030712",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        paddingTop: "80px",
      }}
    >
      {/* Grid background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(14, 165, 233, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(14, 165, 233, 0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      {/* Glow blue — right side (behind dashboard) */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          right: "5%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(14, 165, 233, 0.12) 0%, rgba(14, 165, 233, 0.04) 40%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Glow golden — left side (behind headline) */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "0%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(245, 158, 11, 0.08) 0%, rgba(245, 158, 11, 0.03) 40%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Bottom fade */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "200px",
          background: "linear-gradient(to bottom, transparent, #030712)",
          pointerEvents: "none",
        }}
      />

      {/* Particles */}
      {particles.map((p, i) => (
        <Particle key={i} {...p} />
      ))}

      {/* Content */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "80px 24px",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "64px",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}
        className="hero-grid"
      >
        {/* LEFT — Copy */}
        <div>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "100px",
              background: "rgba(14, 165, 233, 0.08)",
              border: "1px solid rgba(14, 165, 233, 0.2)",
              marginBottom: "28px",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#0EA5E9",
                boxShadow: "0 0 8px rgba(14, 165, 233, 0.8)",
              }}
            />
            <span style={{ color: "#38BDF8", fontSize: "13px", fontWeight: 600, letterSpacing: "0.02em" }}>
              Sistema Proprietário de Aquisição
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1
              style={{
                fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)",
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                color: "#F8FAFC",
                marginBottom: "0",
              }}
            >
              Transformamos presença digital em
            </h1>
            <h1
              style={{
                fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)",
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                background: "linear-gradient(135deg, #38BDF8 0%, #F59E0B 60%, #FCD34D 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "28px",
                filter: "drop-shadow(0 0 30px rgba(14, 165, 233, 0.3))",
              }}
            >
              clientes qualificados
            </h1>
          </motion.div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontSize: "1.1rem",
              lineHeight: 1.7,
              color: "#94A3B8",
              marginBottom: "40px",
              maxWidth: "520px",
            }}
          >
            A IAWEB cria websites premium, automações inteligentes e sistemas com IA para empresas que querem
            crescer com previsibilidade.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.44, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "40px" }}
          >
            <CTAPrimary href="#contacto" label="Pedir Diagnóstico Gratuito" />
            <CTAGhost href={WHATSAPP_URL} label="Falar no WhatsApp" external />
          </motion.div>

          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.54, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <a
              href="mailto:contacto@iaweb.pt"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                color: "#64748B",
                fontSize: "13px",
                textDecoration: "none",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#94A3B8")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#64748B")}
            >
              <Mail size={14} />
              contacto@iaweb.pt
            </a>
            <a
              href="tel:+351913837004"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                color: "#64748B",
                fontSize: "13px",
                textDecoration: "none",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#94A3B8")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#64748B")}
            >
              <Phone size={14} />
              +351 913 837 004
            </a>
          </motion.div>
        </div>

        {/* RIGHT — Dashboard */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <DashboardCard />
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
        }
      `}</style>
    </section>
  )
}

function CTAPrimary({ href, label }: { href: string; label: string }) {
  const [hovered, setHovered] = useState(false)

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) target.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "14px 24px",
        borderRadius: "10px",
        background: hovered
          ? "linear-gradient(135deg, #0284C7, #0EA5E9)"
          : "linear-gradient(135deg, #0EA5E9, #38BDF8)",
        border: "1px solid rgba(14, 165, 233, 0.4)",
        color: "#F8FAFC",
        fontSize: "15px",
        fontWeight: 700,
        textDecoration: "none",
        transition: "all 0.2s",
        boxShadow: hovered
          ? "0 0 40px rgba(14, 165, 233, 0.4), 0 8px 24px rgba(14, 165, 233, 0.2)"
          : "0 0 20px rgba(14, 165, 233, 0.2)",
        transform: hovered ? "translateY(-1px)" : "translateY(0)",
      }}
    >
      {label}
      <ArrowRight size={16} />
    </a>
  )
}

function CTAGhost({ href, label, external }: { href: string; label: string; external?: boolean }) {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "14px 24px",
        borderRadius: "10px",
        background: hovered ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.12)",
        color: hovered ? "#F8FAFC" : "#CBD5E1",
        fontSize: "15px",
        fontWeight: 600,
        textDecoration: "none",
        transition: "all 0.2s",
        transform: hovered ? "translateY(-1px)" : "translateY(0)",
      }}
    >
      <MessageCircle size={16} />
      {label}
    </a>
  )
}
