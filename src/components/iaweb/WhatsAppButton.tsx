"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"

const WHATSAPP_URL =
  "https://wa.me/351913837004?text=Ol%C3%A1%2C+quero+um+diagn%C3%B3stico+gratuito+da+IAWEB."

// WhatsApp SVG icon
function WhatsAppIcon({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export default function WhatsAppButton() {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{
        position: "fixed",
        bottom: "28px",
        right: "28px",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.9 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: "rgba(10, 15, 30, 0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
              padding: "8px 14px",
              color: "#F8FAFC",
              fontSize: "13px",
              fontWeight: 600,
              whiteSpace: "nowrap",
              backdropFilter: "blur(12px)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            }}
          >
            Falar connosco
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {/* Pulse ring */}
        <motion.div
          animate={{ scale: [1, 1.6, 1.6], opacity: [0.5, 0, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "rgba(34, 197, 94, 0.4)",
            pointerEvents: "none",
          }}
        />

        {/* Pulse ring 2 */}
        <motion.div
          animate={{ scale: [1, 1.4, 1.4], opacity: [0.3, 0, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "rgba(34, 197, 94, 0.3)",
            pointerEvents: "none",
          }}
        />

        {/* Main button */}
        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: hovered
              ? "linear-gradient(135deg, #16A34A, #22C55E)"
              : "linear-gradient(135deg, #15803D, #16A34A)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            boxShadow: hovered
              ? "0 0 40px rgba(34, 197, 94, 0.5), 0 8px 24px rgba(0,0,0,0.4)"
              : "0 0 20px rgba(34, 197, 94, 0.25), 0 4px 16px rgba(0,0,0,0.3)",
            transition: "background 0.2s, box-shadow 0.2s",
            cursor: "pointer",
          }}
        >
          <WhatsAppIcon size={28} />
        </motion.div>
      </a>
    </div>
  )
}
