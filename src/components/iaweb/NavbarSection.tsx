"use client"

import { useEffect, useState } from "react"
import { motion, useScroll } from "motion/react"
import { MessageCircle, Mail } from "lucide-react"
import OfficialLogo from "./OfficialLogo"

const navLinks = [
  { label: "Sistema", href: "#sistema" },
  { label: "Processo", href: "#processo" },
  { label: "Resultados", href: "#resultados" },
  { label: "Contacto", href: "#contacto" },
]

export default function NavbarSection() {
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (v) => {
      setScrolled(v > 40)
    })
    return () => unsubscribe()
  }, [scrollY])

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: "background 0.3s ease, border-color 0.3s ease",
        background: scrolled
          ? "rgba(3, 7, 18, 0.85)"
          : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(14, 165, 233, 0.12)"
          : "1px solid transparent",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "24px",
        }}
      >
        {/* Logo */}
        <a href="/" style={{ display: "flex", alignItems: "center", flexShrink: 0 }} aria-label="IAWEB">
          <OfficialLogo priority className="max-w-[180px] sm:max-w-[220px]" />
        </a>

        {/* Nav links — desktop */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flex: 1,
            justifyContent: "center",
          }}
          className="hidden md:flex"
        >
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} onClick={handleAnchorClick} />
          ))}
        </div>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
          <a
            href="mailto:contacto@iaweb.pt"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "#94A3B8",
              fontSize: "13px",
              textDecoration: "none",
              transition: "color 0.15s",
            }}
            className="hidden lg:flex"
            onMouseEnter={(e) => (e.currentTarget.style.color = "#F8FAFC")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#94A3B8")}
          >
            <Mail size={14} />
            contacto@iaweb.pt
          </a>

          <a
            href="https://wa.me/351913837004?text=Ol%C3%A1%2C+quero+um+diagn%C3%B3stico+gratuito+da+IAWEB."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.04)",
              color: "#94A3B8",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#22C55E"
              e.currentTarget.style.borderColor = "rgba(34,197,94,0.3)"
              e.currentTarget.style.background = "rgba(34,197,94,0.08)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#94A3B8"
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"
              e.currentTarget.style.background = "rgba(255,255,255,0.04)"
            }}
          >
            <MessageCircle size={16} />
          </a>

          <a
            href="#contacto"
            onClick={(e) => handleAnchorClick(e, "#contacto")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "8px 18px",
              borderRadius: "8px",
              background: "rgba(14, 165, 233, 0.15)",
              border: "1px solid rgba(14, 165, 233, 0.35)",
              color: "#38BDF8",
              fontSize: "13px",
              fontWeight: 600,
              textDecoration: "none",
              transition: "all 0.2s",
              boxShadow: "0 0 20px rgba(14, 165, 233, 0.1)",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(14, 165, 233, 0.25)"
              e.currentTarget.style.borderColor = "rgba(14, 165, 233, 0.6)"
              e.currentTarget.style.boxShadow = "0 0 30px rgba(14, 165, 233, 0.25)"
              e.currentTarget.style.color = "#7DD3FC"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(14, 165, 233, 0.15)"
              e.currentTarget.style.borderColor = "rgba(14, 165, 233, 0.35)"
              e.currentTarget.style.boxShadow = "0 0 20px rgba(14, 165, 233, 0.1)"
              e.currentTarget.style.color = "#38BDF8"
            }}
          >
            Diagnóstico Gratuito
          </a>
        </div>
      </div>
    </motion.nav>
  )
}

function NavLink({
  href,
  label,
  onClick,
}: {
  href: string
  label: string
  onClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href={href}
      onClick={(e) => onClick(e, href)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        padding: "6px 14px",
        color: hovered ? "#F8FAFC" : "#94A3B8",
        fontSize: "14px",
        fontWeight: 500,
        textDecoration: "none",
        transition: "color 0.15s",
        borderRadius: "6px",
      }}
    >
      {label}
      <motion.span
        animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.15 }}
        style={{
          position: "absolute",
          bottom: "2px",
          left: "14px",
          right: "14px",
          height: "1px",
          background: "linear-gradient(90deg, #0EA5E9, #38BDF8)",
          transformOrigin: "left",
          boxShadow: "0 0 8px rgba(14, 165, 233, 0.6)",
        }}
      />
    </a>
  )
}
