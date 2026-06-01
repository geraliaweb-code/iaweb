"use client"

import { Mail, Phone, MessageCircle } from "lucide-react"
import OfficialLogo from "./OfficialLogo"

const navLinks = [
  { label: "Sistema", href: "#sistema" },
  { label: "Processo", href: "#processo" },
  { label: "Resultados", href: "#resultados" },
  { label: "Contacto", href: "#contacto" },
]

const contactItems = [
  { icon: Mail, label: "contacto@iaweb.pt", href: "mailto:contacto@iaweb.pt" },
  { icon: Phone, label: "+351 913 837 004", href: "tel:+351913837004" },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    href: "https://wa.me/351913837004?text=Ol%C3%A1%2C+quero+um+diagn%C3%B3stico+gratuito+da+IAWEB.",
    external: true,
  },
]

export default function FooterSection() {
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) target.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <footer
      style={{
        background: "#060B18",
        borderTop: "1px solid transparent",
        backgroundImage: "linear-gradient(#060B18, #060B18), linear-gradient(90deg, transparent 0%, rgba(14,165,233,0.2) 50%, transparent 100%)",
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top glow */}
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
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "400px",
          height: "120px",
          background: "radial-gradient(ellipse at 50% 0%, rgba(14, 165, 233, 0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "64px 24px 40px",
        }}
      >
        {/* Main row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr",
            gap: "64px",
            marginBottom: "48px",
          }}
          className="footer-grid"
        >
          {/* Brand */}
          <div>
            <OfficialLogo compact className="mb-4 max-w-[190px]" />
            <p
              style={{
                fontSize: "14px",
                lineHeight: 1.7,
                color: "#475569",
                maxWidth: "280px",
                marginBottom: "24px",
              }}
            >
              Automatizamos aquisição. Escalamos negócios. Sistemas de IA e automação para empresas que querem crescer com previsibilidade.
            </p>

            {/* Contact links */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {contactItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "#64748B",
                    fontSize: "13px",
                    textDecoration: "none",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#94A3B8")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#64748B")}
                >
                  <item.icon size={14} />
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#475569",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "20px",
              }}
            >
              Navegação
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleAnchorClick(e, link.href)}
                  style={{
                    color: "#64748B",
                    fontSize: "14px",
                    textDecoration: "none",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#94A3B8")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#64748B")}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Horários */}
          <div>
            <h4
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#475569",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "20px",
              }}
            >
              Disponibilidade
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { label: "Segunda — Sexta", value: "9h — 19h" },
                { label: "Sábado", value: "10h — 14h" },
                { label: "Resposta garantida", value: "em 24 horas" },
              ].map((item) => (
                <div key={item.label}>
                  <div style={{ fontSize: "12px", color: "#475569", marginBottom: "2px" }}>{item.label}</div>
                  <div style={{ fontSize: "13px", color: "#94A3B8", fontWeight: 600 }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.04)",
            paddingTop: "32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <p style={{ fontSize: "13px", color: "#334155" }}>
            © {new Date().getFullYear()} IAWEB — Todos os direitos reservados.
          </p>
          <p style={{ fontSize: "13px", color: "#334155" }}>
            Feito com precisão em Portugal.{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #0EA5E9, #F59E0B)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontWeight: 600,
              }}
            >
              IAWEB
            </span>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </footer>
  )
}
