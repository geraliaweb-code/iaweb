"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "motion/react"
import { Globe, Target, Bot, MessageCircle, BarChart2, TrendingUp } from "lucide-react"

const services = [
  {
    icon: Globe,
    iconColor: "#0EA5E9",
    iconBg: "rgba(14, 165, 233, 0.1)",
    title: "Websites Premium",
    description: "Sites que convertem, não apenas impressionam. Performance, design e copy optimizados para cada etapa do funil.",
    glowColor: "rgba(14, 165, 233, 0.15)",
  },
  {
    icon: Target,
    iconColor: "#F59E0B",
    iconBg: "rgba(245, 158, 11, 0.1)",
    title: "Captação de Leads",
    description: "Sistemas automáticos de aquisição qualificada. O cliente certo, no momento certo, com o custo optimizado.",
    glowColor: "rgba(245, 158, 11, 0.12)",
  },
  {
    icon: Bot,
    iconColor: "#A78BFA",
    iconBg: "rgba(167, 139, 250, 0.1)",
    title: "IA Aplicada",
    description: "Automações inteligentes que trabalham 24/7. Da qualificação ao follow-up, sem intervenção manual.",
    glowColor: "rgba(167, 139, 250, 0.12)",
  },
  {
    icon: MessageCircle,
    iconColor: "#22C55E",
    iconBg: "rgba(34, 197, 94, 0.1)",
    title: "Automação WhatsApp",
    description: "Follow-up automático com personalização real. Sequências que parecem humanas e convertem como máquinas.",
    glowColor: "rgba(34, 197, 94, 0.12)",
  },
  {
    icon: BarChart2,
    iconColor: "#38BDF8",
    iconBg: "rgba(56, 189, 248, 0.1)",
    title: "CRM Inteligente",
    description: "Pipeline de vendas que se gere a si próprio. Visibilidade total, alertas automáticos, zero tarefas perdidas.",
    glowColor: "rgba(56, 189, 248, 0.12)",
  },
  {
    icon: TrendingUp,
    iconColor: "#FCD34D",
    iconBg: "rgba(252, 211, 77, 0.1)",
    title: "Métricas e Crescimento",
    description: "Dados accionáveis para decisões certeiras. Dashboards em tempo real que revelam onde está o dinheiro.",
    glowColor: "rgba(252, 211, 77, 0.12)",
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.08,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
}

function ServiceCard({
  service,
  index,
  inView,
}: {
  service: (typeof services)[0]
  index: number
  inView: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const Icon = service.icon

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${hovered ? service.glowColor.replace("0.15", "0.35").replace("0.12", "0.3") : "rgba(14,165,233,0.1)"}`,
        borderRadius: "16px",
        padding: "28px",
        cursor: "default",
        transition: "all 0.25s ease",
        transform: hovered ? "translateY(-4px) scale(1.01)" : "translateY(0) scale(1)",
        boxShadow: hovered ? `0 20px 60px ${service.glowColor}, 0 4px 20px rgba(0,0,0,0.3)` : "none",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Icon */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "48px",
          height: "48px",
          borderRadius: "12px",
          background: service.iconBg,
          border: `1px solid ${service.iconColor}30`,
          marginBottom: "20px",
          boxShadow: hovered ? `0 0 20px ${service.iconColor}40` : "none",
          transition: "box-shadow 0.25s ease",
        }}
      >
        <Icon size={22} color={service.iconColor} />
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: "17px",
          fontWeight: 700,
          color: "#F8FAFC",
          letterSpacing: "-0.02em",
          marginBottom: "10px",
        }}
      >
        {service.title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontSize: "14px",
          lineHeight: 1.65,
          color: "#64748B",
        }}
      >
        {service.description}
      </p>

      {/* Hover glow bottom */}
      {hovered && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: `linear-gradient(90deg, transparent, ${service.iconColor}, transparent)`,
            opacity: 0.6,
          }}
        />
      )}
    </motion.div>
  )
}

export default function SystemSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section
      id="sistema"
      ref={ref}
      style={{
        background: "transparent",
        padding: "120px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top divider glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(14, 165, 233, 0.3), transparent)",
        }}
      />

      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "center", marginBottom: "80px" }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "100px",
              background: "rgba(14, 165, 233, 0.06)",
              border: "1px solid rgba(14, 165, 233, 0.15)",
              marginBottom: "20px",
            }}
          >
            <span style={{ color: "#38BDF8", fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              O Sistema
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
            Tudo o que precisas para crescer,{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #38BDF8, #F59E0B)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              integrado numa só plataforma
            </span>
          </h2>

          <p
            style={{
              fontSize: "1.05rem",
              color: "#64748B",
              maxWidth: "520px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Não vendemos serviços isolados. Construímos sistemas completos de aquisição e crescimento.
          </p>
        </motion.div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
          }}
          className="services-grid"
        >
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} inView={inView} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .services-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .services-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}
