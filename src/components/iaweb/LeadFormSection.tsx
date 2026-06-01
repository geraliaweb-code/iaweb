"use client"

import { useRef, useState, FormEvent } from "react"
import { motion, useInView } from "motion/react"
import { ArrowRight, CheckCircle, Mail, Phone, Clock, MessageCircle } from "lucide-react"

const businessTypes = [
  "Seleciona o tipo de negócio",
  "Agência / Consultoria",
  "E-commerce / Loja Online",
  "Serviços B2B",
  "Serviços B2C",
  "Imobiliário",
  "Saúde / Bem-estar",
  "Educação / Formação",
  "Tecnologia / SaaS",
  "Indústria / Construção",
  "Outro",
]

const inputStyle = {
  width: "100%",
  padding: "13px 16px",
  borderRadius: "10px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#F8FAFC",
  fontSize: "14px",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
}

function FormInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
}: {
  label: string
  type?: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  required?: boolean
}) {
  const [focused, setFocused] = useState(false)

  return (
    <div>
      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#94A3B8", marginBottom: "8px" }}>
        {label} {required && <span style={{ color: "#0EA5E9" }}>*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...inputStyle,
          borderColor: focused ? "rgba(14, 165, 233, 0.5)" : "rgba(255,255,255,0.08)",
          boxShadow: focused ? "0 0 0 3px rgba(14, 165, 233, 0.08), 0 0 20px rgba(14, 165, 233, 0.08)" : "none",
          background: focused ? "rgba(14, 165, 233, 0.04)" : "rgba(255,255,255,0.04)",
        }}
      />
    </div>
  )
}

function FormSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: string[]
}) {
  const [focused, setFocused] = useState(false)

  return (
    <div>
      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#94A3B8", marginBottom: "8px" }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...inputStyle,
          borderColor: focused ? "rgba(14, 165, 233, 0.5)" : "rgba(255,255,255,0.08)",
          boxShadow: focused ? "0 0 0 3px rgba(14, 165, 233, 0.08)" : "none",
          background: focused ? "rgba(14, 165, 233, 0.04)" : "rgba(14, 15, 30, 0.8)",
          cursor: "pointer",
          appearance: "none",
        }}
      >
        {options.map((o) => (
          <option key={o} value={o} style={{ background: "#0A0F1E", color: "#F8FAFC" }}>
            {o}
          </option>
        ))}
      </select>
    </div>
  )
}

function FormTextarea({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string
  placeholder: string
  value: string
  onChange: (v: string) => void
}) {
  const [focused, setFocused] = useState(false)

  return (
    <div>
      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#94A3B8", marginBottom: "8px" }}>
        {label}
      </label>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...inputStyle,
          resize: "vertical",
          borderColor: focused ? "rgba(14, 165, 233, 0.5)" : "rgba(255,255,255,0.08)",
          boxShadow: focused ? "0 0 0 3px rgba(14, 165, 233, 0.08)" : "none",
          background: focused ? "rgba(14, 165, 233, 0.04)" : "rgba(255,255,255,0.04)",
        }}
      />
    </div>
  )
}

export default function LeadFormSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  const [formData, setFormData] = useState({
    nome: "",
    empresa: "",
    email: "",
    whatsapp: "",
    tipoNegocio: businessTypes[0],
    mensagem: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 1200))
    setSubmitting(false)
    setSubmitted(true)
  }

  return (
    <section
      id="contacto"
      ref={ref}
      style={{
        background: "rgba(2, 4, 11, 0.52)",
        padding: "120px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(ellipse at 30% 50%, rgba(14, 165, 233, 0.05) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(14, 165, 233, 0.25), transparent)",
        }}
      />

      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "80px",
          alignItems: "start",
          position: "relative",
        }}
        className="form-grid"
      >
        {/* LEFT — Info */}
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -32 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
              marginBottom: "24px",
            }}
          >
            <span style={{ color: "#38BDF8", fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Diagnóstico Gratuito
            </span>
          </div>

          <h2
            style={{
              fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
              fontWeight: 800,
              color: "#F8FAFC",
              letterSpacing: "-0.03em",
              marginBottom: "16px",
              lineHeight: 1.2,
            }}
          >
            Quer resultados{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #38BDF8, #F59E0B)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              como estes?
            </span>
          </h2>

          <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "#64748B", marginBottom: "48px" }}>
            Faz o teu diagnóstico gratuito. Analisamos o teu negócio e identificamos oportunidades
            de crescimento que podes implementar imediatamente.
          </p>

          {/* Contact info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "40px" }}>
            {[
              { icon: Mail, label: "Email", value: "contacto@iaweb.pt", href: "mailto:contacto@iaweb.pt" },
              { icon: Phone, label: "Telefone", value: "+351 913 837 004", href: "tel:+351913837004" },
              {
                icon: MessageCircle,
                label: "WhatsApp",
                value: "Resposta em menos de 1h",
                href: "https://wa.me/351913837004?text=Ol%C3%A1%2C+quero+um+diagn%C3%B3stico+gratuito+da+IAWEB.",
              },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "16px 20px",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(14, 165, 233, 0.06)"
                  e.currentTarget.style.borderColor = "rgba(14, 165, 233, 0.2)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.025)"
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: "rgba(14, 165, 233, 0.1)",
                    border: "1px solid rgba(14, 165, 233, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <item.icon size={18} color="#38BDF8" />
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "#64748B", fontWeight: 500, marginBottom: "2px" }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: "14px", color: "#F8FAFC", fontWeight: 600 }}>{item.value}</div>
                </div>
              </a>
            ))}
          </div>

          {/* Hours */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px 20px",
              borderRadius: "10px",
              background: "rgba(34, 197, 94, 0.05)",
              border: "1px solid rgba(34, 197, 94, 0.12)",
            }}
          >
            <Clock size={16} color="#22C55E" />
            <div>
              <span style={{ fontSize: "13px", color: "#94A3B8" }}>Disponível </span>
              <span style={{ fontSize: "13px", color: "#22C55E", fontWeight: 600 }}>Seg — Sex, 9h — 19h</span>
              <span style={{ fontSize: "13px", color: "#64748B" }}> · Resposta em 24h</span>
            </div>
          </div>
        </motion.div>

        {/* RIGHT — Form */}
        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 32 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "20px",
              padding: "40px",
            }}
          >
            {submitted ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "50%",
                    background: "rgba(34, 197, 94, 0.12)",
                    border: "1px solid rgba(34, 197, 94, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 24px",
                  }}
                >
                  <CheckCircle size={36} color="#22C55E" />
                </motion.div>
                <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#F8FAFC", marginBottom: "12px" }}>
                  Mensagem enviada!
                </h3>
                <p style={{ fontSize: "15px", color: "#64748B", lineHeight: 1.7 }}>
                  Recebemos o teu pedido. Vamos analisar o teu negócio e entrar em contacto nas próximas 24 horas.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                  }}
                  className="form-two-col"
                >
                  <FormInput
                    label="Nome completo"
                    placeholder="João Silva"
                    value={formData.nome}
                    onChange={(v) => setFormData((p) => ({ ...p, nome: v }))}
                    required
                  />
                  <FormInput
                    label="Empresa"
                    placeholder="Empresa Lda."
                    value={formData.empresa}
                    onChange={(v) => setFormData((p) => ({ ...p, empresa: v }))}
                  />
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                  }}
                  className="form-two-col"
                >
                  <FormInput
                    label="Email"
                    type="email"
                    placeholder="joao@empresa.pt"
                    value={formData.email}
                    onChange={(v) => setFormData((p) => ({ ...p, email: v }))}
                    required
                  />
                  <FormInput
                    label="WhatsApp"
                    type="tel"
                    placeholder="+351 9XX XXX XXX"
                    value={formData.whatsapp}
                    onChange={(v) => setFormData((p) => ({ ...p, whatsapp: v }))}
                  />
                </div>

                <FormSelect
                  label="Tipo de negócio"
                  value={formData.tipoNegocio}
                  onChange={(v) => setFormData((p) => ({ ...p, tipoNegocio: v }))}
                  options={businessTypes}
                />

                <FormTextarea
                  label="Conta-nos sobre o teu negócio"
                  placeholder="Descreve brevemente o teu negócio, os principais desafios e o que queres alcançar..."
                  value={formData.mensagem}
                  onChange={(v) => setFormData((p) => ({ ...p, mensagem: v }))}
                />

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "16px 28px",
                    borderRadius: "12px",
                    background: submitting
                      ? "rgba(14, 165, 233, 0.4)"
                      : "linear-gradient(135deg, #0EA5E9, #0284C7)",
                    border: "1px solid rgba(14, 165, 233, 0.4)",
                    color: "#F8FAFC",
                    fontSize: "15px",
                    fontWeight: 700,
                    cursor: submitting ? "not-allowed" : "pointer",
                    transition: "all 0.2s",
                    boxShadow: submitting ? "none" : "0 0 30px rgba(14, 165, 233, 0.25)",
                    width: "100%",
                  }}
                  onMouseEnter={(e) => {
                    if (!submitting) {
                      e.currentTarget.style.boxShadow = "0 0 50px rgba(14, 165, 233, 0.4)"
                      e.currentTarget.style.transform = "translateY(-1px)"
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 0 30px rgba(14, 165, 233, 0.25)"
                    e.currentTarget.style.transform = "translateY(0)"
                  }}
                >
                  {submitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        style={{
                          width: "16px",
                          height: "16px",
                          border: "2px solid rgba(255,255,255,0.3)",
                          borderTopColor: "white",
                          borderRadius: "50%",
                        }}
                      />
                      A enviar...
                    </>
                  ) : (
                    <>
                      Quero o meu diagnóstico gratuito
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <p style={{ fontSize: "12px", color: "#475569", textAlign: "center" }}>
                  Sem compromisso. Resposta garantida em 24 horas.
                </p>
              </form>
            )}
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .form-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .form-two-col { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
