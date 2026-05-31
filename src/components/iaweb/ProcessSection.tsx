"use client"

import { useRef } from "react"
import { motion, useInView } from "motion/react"
import { Search, Wrench, Rocket } from "lucide-react"

const phases = [
  {
    number: "01",
    icon: Search,
    iconColor: "#0EA5E9",
    iconBg: "rgba(14, 165, 233, 0.1)",
    title: "Diagnóstico",
    description:
      "Mapeamos o teu negócio, público-alvo e oportunidades. Identificamos onde está o dinheiro e o que está a impedir o crescimento.",
    details: ["Auditoria digital completa", "Análise da concorrência", "Definição de objectivos"],
  },
  {
    number: "02",
    icon: Wrench,
    iconColor: "#F59E0B",
    iconBg: "rgba(245, 158, 11, 0.1)",
    title: "Construção",
    description:
      "Desenvolvemos o sistema completo: website, automações, integrações e copy. Em 48-72 horas, o sistema está activo.",
    details: ["Website premium", "Automações e CRM", "Integrações WhatsApp & IA"],
  },
  {
    number: "03",
    icon: Rocket,
    iconColor: "#22C55E",
    iconBg: "rgba(34, 197, 94, 0.1)",
    title: "Aquisição",
    description:
      "Activamos o sistema de captação. Leads chegam, são qualificados automaticamente e encaminhados para o teu pipeline.",
    details: ["Campanhas de aquisição", "Follow-up automático", "Relatórios semanais"],
  },
]

export default function ProcessSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section
      id="processo"
      ref={ref}
      style={{
        background: "#0A0F1E",
        padding: "120px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(ellipse at 50% 0%, rgba(14, 165, 233, 0.06) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      {/* Top/bottom dividers */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(14, 165, 233, 0.2), transparent)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(14, 165, 233, 0.2), transparent)",
        }}
      />

      <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative" }}>
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
              O Processo
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
            De zero a sistema activo{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #38BDF8, #22C55E)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              em 3 fases
            </span>
          </h2>

          <p style={{ fontSize: "1.05rem", color: "#64748B", maxWidth: "480px", margin: "0 auto", lineHeight: 1.7 }}>
            Um processo estruturado que elimina a incerteza e entrega resultados mensuráveis.
          </p>
        </motion.div>

        {/* Phases */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr auto 1fr",
            gap: "0",
            alignItems: "start",
          }}
          className="process-grid"
        >
          {phases.map((phase, i) => (
            <>
              {/* Phase card */}
              <motion.div
                key={phase.number}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "20px",
                  padding: "36px 28px",
                  position: "relative",
                }}
              >
                {/* Number */}
                <div
                  style={{
                    fontSize: "64px",
                    fontWeight: 900,
                    letterSpacing: "-0.04em",
                    color: "rgba(14, 165, 233, 0.08)",
                    lineHeight: 1,
                    marginBottom: "-16px",
                    userSelect: "none",
                  }}
                >
                  {phase.number}
                </div>

                {/* Icon */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "52px",
                    height: "52px",
                    borderRadius: "14px",
                    background: phase.iconBg,
                    border: `1px solid ${phase.iconColor}30`,
                    marginBottom: "20px",
                    boxShadow: `0 0 24px ${phase.iconColor}20`,
                  }}
                >
                  <phase.icon size={24} color={phase.iconColor} />
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontSize: "22px",
                    fontWeight: 800,
                    color: "#F8FAFC",
                    letterSpacing: "-0.02em",
                    marginBottom: "14px",
                  }}
                >
                  {phase.title}
                </h3>

                {/* Description */}
                <p style={{ fontSize: "14px", lineHeight: 1.7, color: "#64748B", marginBottom: "24px" }}>
                  {phase.description}
                </p>

                {/* Detail list */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {phase.details.map((detail) => (
                    <div
                      key={detail}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        fontSize: "13px",
                        color: "#94A3B8",
                      }}
                    >
                      <div
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: phase.iconColor,
                          flexShrink: 0,
                          boxShadow: `0 0 6px ${phase.iconColor}80`,
                        }}
                      />
                      {detail}
                    </div>
                  ))}
                </div>

                {/* Bottom accent */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: "28px",
                    right: "28px",
                    height: "2px",
                    borderRadius: "1px",
                    background: `linear-gradient(90deg, ${phase.iconColor}, transparent)`,
                    transformOrigin: "left",
                  }}
                />
              </motion.div>

              {/* Connector arrow — between phases */}
              {i < phases.length - 1 && (
                <motion.div
                  key={`connector-${i}`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 16px",
                    paddingTop: "100px",
                  }}
                  className="process-connector"
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "1px",
                        background: "linear-gradient(90deg, rgba(14,165,233,0.4), rgba(14,165,233,0.1))",
                      }}
                    />
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRight: "2px solid rgba(14,165,233,0.5)",
                        borderTop: "2px solid rgba(14,165,233,0.5)",
                        transform: "rotate(45deg) translateX(-2px)",
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .process-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .process-connector {
            display: none !important;
          }
        }
      `}</style>
    </section>
  )
}
