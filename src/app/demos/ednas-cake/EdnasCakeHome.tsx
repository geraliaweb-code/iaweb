"use client"

/**
 * Edna's Cake — Bolos, Doces e Salgados Artesanais | Demo Premium
 * --------------------------------------------------------------------------
 * Demo comercial realista para apresentar à dona da Edna's Cake.
 * Rota isolada: /demos/ednas-cake  (não afeta nenhuma rota existente).
 *
 * FOTOS E VÍDEOS REAIS fornecidos pelo cliente (pasta /public/ednas-cake/):
 *   Imagens (.webp / .png):
 *     bolo-chocolate.webp      → bolo de chocolate com brigadeiro
 *     bolo-red-velvet.webp     → red velvet com frutos vermelhos
 *     bolo-morango.webp        → bolo de chocolate com morangos
 *     bolo-princesa.webp       → bolo personalizado (princesas "Helena")
 *     bolo-farmacia.webp       → bolo personalizado (farmacêutica "Sofia")
 *     bolo-ironman.webp        → bolo personalizado (Iron Man "Thierry")
 *     bolo-melancia.png        → bolo personalizado (melancia / Turma da Mônica)
 *     bolo-borboletas.png      → bolo personalizado (borboletas "Shaela")
 *     combo-doce-salgado.webp  → bolo de pote + caixa de coxinhas
 *     salgados-brigadeiro.webp → coxinhas (branca + brigadeiro) com a marca
 *     salgados-caixa.png       → caixa de salgados da marca
 *     coxinhas-prato.png       → prato de coxinhas douradas
 *     morango-do-amor.png      → morango do amor na caixa da marca
 *     sobremesas-presente.webp → sobremesas em embalagem presente
 *     sobremesa-copo.png       → sobremesa no copo
 *     loja-fachada.png         → fachada / montra da loja em Arcozelo
 *   Vídeos (.mp4):
 *     video-bolos.mp4          → bolos de festa / casamento (hero + reel)
 *     video-salgados.mp4       → coxinhas / salgados / açaí
 *     video-festa.mp4          → salgados e bolos de aniversário
 *
 * Avaliações = REAIS do Google (5 mostradas). Rating 4,9 · 9 críticas.
 * Horário = placeholder editável (Google: abre às 14:00).
 * --------------------------------------------------------------------------
 */

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Fraunces } from "next/font/google"
import {
  Cake,
  Croissant,
  Candy,
  UtensilsCrossed,
  Sparkles,
  Star,
  Heart,
  Gift,
  Users,
  Coffee,
  Baby,
  PartyPopper,
  CalendarHeart,
  ChefHat,
  Phone,
  MapPin,
  Clock,
  Menu,
  X,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Quote,
} from "lucide-react"

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
})

/* ──────────────────────  ÍCONES DE MARCA (SVG)  ────────────────────── */

function WhatsAppIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor" aria-hidden>
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.413c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
    </svg>
  )
}
function InstagramIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

/* ─────────────────────────────  DADOS  ───────────────────────────── */

const WHATSAPP = "351920497230"
function waLink(produto?: string) {
  const base = `https://wa.me/${WHATSAPP}`
  if (!produto) return base
  const msg = `Olá Edna's Cake! 🎂 Gostaria de fazer uma encomenda: ${produto}.`
  return `${base}?text=${encodeURIComponent(msg)}`
}

const EMPRESA = {
  nome: "Edna's Cake",
  tagline: "Doces & Salgados",
  slogan: "O sabor que abraça.",
  telefone: "920 497 230",
  telefoneHref: "tel:+351920497230",
  morada: "Av. Central 6, 4750-130 Arcozelo, Barcelos",
  mapsHref: "https://www.google.com/maps/search/?api=1&query=Edna's+Cake+Arcozelo+Barcelos",
  instagram: "https://instagram.com/ednascake.pt",
  instagramHandle: "@ednascake.pt",
}

const NAV_LINKS = [
  { label: "Início", href: "#inicio" },
  { label: "Favoritos", href: "#favoritos" },
  { label: "Bolos", href: "#catalogo" },
  { label: "Salgados", href: "#catalogo" },
  { label: "Eventos", href: "#eventos" },
  { label: "Avaliações", href: "#avaliacoes" },
  { label: "Contactos", href: "#contactos" },
]

const FAVORITOS = [
  {
    icon: Croissant,
    titulo: "Coxinha",
    texto: "Crocante por fora, cremosa por dentro e cheia de sabor brasileiro.",
  },
  {
    icon: Cake,
    titulo: "Bolos personalizados",
    texto: "Bolos criados para aniversários, casamentos, batizados e datas especiais.",
  },
  {
    icon: Candy,
    titulo: "Docinhos de festa",
    texto: "Brigadeiros, beijinhos e doces que deixam qualquer mesa mais bonita.",
  },
  {
    icon: UtensilsCrossed,
    titulo: "Salgados",
    texto: "Opções perfeitas para festas, empresas, reuniões e encomendas familiares.",
  },
]

const CATALOGO = [
  {
    img: "/ednas-cake/bolo-red-velvet.webp",
    categoria: "Bolos",
    titulo: "Red Velvet com frutos vermelhos",
    texto: "Camadas fofas com creme aveludado e frutos vermelhos frescos.",
  },
  {
    img: "/ednas-cake/coxinhas-prato.png",
    categoria: "Salgados",
    titulo: "Coxinhas douradas",
    texto: "Crocantes, douradas e recheadas — a estrela das festas.",
  },
  {
    img: "/ednas-cake/bolo-princesa.webp",
    categoria: "Personalizados",
    titulo: "Bolos temáticos",
    texto: "Cada detalhe pensado para tornar a festa inesquecível.",
  },
  {
    img: "/ednas-cake/bolo-chocolate.webp",
    categoria: "Bolos",
    titulo: "Chocolate com brigadeiro",
    texto: "Massa húmida de chocolate com brigadeiro cremoso e crocante.",
  },
  {
    img: "/ednas-cake/morango-do-amor.png",
    categoria: "Doces",
    titulo: "Morango do amor",
    texto: "O doce do momento — e os docinhos que enchem a mesa de carinho.",
  },
  {
    img: "/ednas-cake/salgados-caixa.png",
    categoria: "Salgados",
    titulo: "Caixas para partilhar",
    texto: "Sortido de salgados perfeito para reuniões e coffee breaks.",
  },
  {
    img: "/ednas-cake/bolo-morango.webp",
    categoria: "Bolos",
    titulo: "Bolo de morango",
    texto: "Chocolate com morangos e frutos vermelhos, fresquinho na caixa.",
  },
  {
    img: "/ednas-cake/sobremesas-presente.webp",
    categoria: "Sobremesas",
    titulo: "Sobremesas presente",
    texto: "Sobremesas individuais em embalagem que já é um presente.",
  },
]

const VIDEOS = [
  {
    src: "/ednas-cake/video-bolos.mp4",
    poster: "/ednas-cake/bolo-princesa.webp",
    etiqueta: "Bolos personalizados",
  },
  {
    src: "/ednas-cake/video-salgados.mp4",
    poster: "/ednas-cake/coxinhas-prato.png",
    etiqueta: "Salgados & Coxinhas",
  },
  {
    src: "/ednas-cake/video-festa.mp4",
    poster: "/ednas-cake/bolo-melancia.png",
    etiqueta: "Festas & Eventos",
  },
]

const ETAPAS = [
  { n: "1", titulo: "Escolha o produto", texto: "Bolo, salgados, doces ou um menu completo para a sua festa." },
  { n: "2", titulo: "Envie data e quantidade", texto: "Diga-nos a data, o número de pessoas e a sua ideia." },
  { n: "3", titulo: "Receba a confirmação", texto: "Confirmamos tudo pelo WhatsApp, com calma e atenção ao detalhe." },
  { n: "4", titulo: "Levante na loja", texto: "Levante na loja em Arcozelo ou combine connosco a recolha." },
]

const EVENTOS = [
  { icon: PartyPopper, titulo: "Aniversários" },
  { icon: Heart, titulo: "Casamentos" },
  { icon: Baby, titulo: "Batizados" },
  { icon: Users, titulo: "Empresas" },
  { icon: Coffee, titulo: "Coffee breaks" },
  { icon: CalendarHeart, titulo: "Festas infantis" },
]

const AVALIACOES = [
  { nome: "Joel Castro", texto: "Agradabilíssimo, e além disso é absolutamente delicioso! Parabéns, Edna." },
  { nome: "Aline Cavalcante", texto: "Melhores salgados da região sem dúvida." },
  { nome: "Ana Paula Marques", texto: "Tudo sempre maravilhoso ❤️" },
  { nome: "Paula Tayt-Sohn", texto: "Melhor coxinha de Barcelos." },
  { nome: "Luciano Camargo", texto: "Coxinha deliciosa!" },
]

/* ──────────────────────────  ANIMAÇÕES  ────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
}
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

/* ──────────────────────────  COMPONENTES  ──────────────────────── */

function Logo({ light = false }: { light?: boolean }) {
  return (
    <a href="#inicio" className="flex items-center gap-3 group">
      <span
        className="flex h-11 w-11 items-center justify-center rounded-full ring-1 transition-transform group-hover:scale-105"
        style={{
          background: light ? "rgba(255,255,255,0.08)" : "var(--ec-green)",
          boxShadow: "0 6px 18px -8px rgba(11,61,53,0.55)",
        }}
      >
        <ChefHat className="h-5 w-5" style={{ color: "var(--ec-gold)" }} />
      </span>
      <span className="leading-none">
        <span
          className={`block text-[19px] font-semibold tracking-tight ${display.className}`}
          style={{ color: light ? "var(--ec-cream)" : "var(--ec-green-deep)" }}
        >
          Edna&apos;s Cake
        </span>
        <span
          className="block text-[10px] font-medium uppercase tracking-[0.32em]"
          style={{ color: "var(--ec-gold-dark)" }}
        >
          Doces &amp; Salgados
        </span>
      </span>
    </a>
  )
}

function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: "var(--ec-gold-dark)" }}>
      <span className="h-px w-7 rounded-full" style={{ background: "var(--ec-gold)" }} />
      {children}
    </span>
  )
}

/* ─────────────────────────────  PÁGINA  ───────────────────────────── */

export default function EdnasCakeHome() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div
      id="inicio"
      className="min-h-screen w-full overflow-x-hidden antialiased"
      style={
        {
          "--ec-green": "#1F7A68",
          "--ec-green-deep": "#0B3D35",
          "--ec-green-deeper": "#072A23",
          "--ec-gold": "#D8B56D",
          "--ec-gold-soft": "#E7CE9A",
          "--ec-gold-dark": "#A9823C",
          "--ec-cream": "#FFF4E6",
          "--ec-cream-2": "#FBEBD9",
          "--ec-white": "#FFFFFF",
          "--ec-brown": "#6B4E3D",
          "--ec-ink": "#2B2018",
          background: "var(--ec-cream)",
          color: "var(--ec-ink)",
        } as React.CSSProperties
      }
    >
      {/* ───────────────── HEADER ───────────────── */}
      <header
        className="fixed inset-x-0 top-0 z-50 border-b"
        style={{
          background: "rgba(255,244,230,0.82)",
          backdropFilter: "blur(20px) saturate(160%)",
          borderColor: "rgba(169,130,60,0.18)",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 lg:px-8">
          <Logo />

          <nav className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-[13px] font-medium tracking-wide transition-colors"
                style={{ color: "var(--ec-green-deep)" }}
              >
                <span className="border-b-2 border-transparent pb-0.5 transition-colors hover:border-[var(--ec-gold)]">{l.label}</span>
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-5 lg:flex">
            <a href={EMPRESA.telefoneHref} className="flex items-center gap-2 text-[13px] font-semibold" style={{ color: "var(--ec-green-deep)" }}>
              <Phone className="h-3.5 w-3.5" style={{ color: "var(--ec-gold-dark)" }} />
              {EMPRESA.telefone}
            </a>
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-transform hover:scale-[1.03]"
              style={{ background: "var(--ec-green)" }}
            >
              <WhatsAppIcon className="h-4 w-4" />
              Encomendar
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-full lg:hidden"
            style={{ background: "rgba(31,122,104,0.1)", color: "var(--ec-green-deep)" }}
            aria-label="Menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="border-t lg:hidden" style={{ borderColor: "rgba(169,130,60,0.18)", background: "var(--ec-cream)" }}>
            <nav className="mx-auto flex max-w-7xl flex-col px-5 py-3">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="border-b py-3 text-[15px] font-medium"
                  style={{ color: "var(--ec-green-deep)", borderColor: "rgba(169,130,60,0.12)" }}
                >
                  {l.label}
                </a>
              ))}
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white"
                style={{ background: "var(--ec-green)" }}
              >
                <WhatsAppIcon className="h-4 w-4" /> Encomendar pelo WhatsApp
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* ───────────────── HERO ───────────────── */}
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
        {/* Vídeo de fundo + fallback poster */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/ednas-cake/bolo-red-velvet.webp"
        >
          <source src="/ednas-cake/video-bolos.mp4" type="video/mp4" />
        </video>

        {/* Overlay para legibilidade */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(7,42,35,0.78) 0%, rgba(11,61,53,0.62) 38%, rgba(7,42,35,0.86) 100%)",
          }}
        />
        <div className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(216,181,109,0.28), transparent 70%)" }} />

        <div className="relative z-10 mx-auto max-w-4xl px-6 py-32 text-center">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.div variants={fadeUp} className="mb-6 flex flex-wrap items-center justify-center gap-3">
              <span
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[12px] font-semibold backdrop-blur-md"
                style={{ background: "rgba(255,255,255,0.12)", color: "var(--ec-cream)", border: "1px solid rgba(216,181,109,0.4)" }}
              >
                <span className="flex items-center gap-0.5" style={{ color: "var(--ec-gold)" }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </span>
                4,9 no Google
              </span>
              <span
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[12px] font-semibold backdrop-blur-md"
                style={{ background: "rgba(216,181,109,0.16)", color: "var(--ec-gold-soft)", border: "1px solid rgba(216,181,109,0.4)" }}
              >
                <Sparkles className="h-3.5 w-3.5" /> «Melhor coxinha de Barcelos»
              </span>
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="mb-5 text-[12px] font-semibold uppercase tracking-[0.34em]"
              style={{ color: "var(--ec-gold-soft)" }}
            >
              Doces • Salgados • Bolos Personalizados • Catering
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className={`text-balance text-4xl font-semibold leading-[1.08] text-white sm:text-5xl lg:text-6xl ${display.className}`}
            >
              Bolos que marcam momentos.
              <br />
              <span style={{ color: "var(--ec-gold)" }}>Sabores que criam memórias.</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-2xl text-pretty text-[15px] leading-relaxed text-white/85 sm:text-base">
              Bolos personalizados, doces artesanais, salgados e catering para festas, empresas e
              momentos especiais em Barcelos.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.03] sm:w-auto"
                style={{ background: "var(--ec-green)", boxShadow: "0 14px 34px -12px rgba(31,122,104,0.8)" }}
              >
                <WhatsAppIcon className="h-4 w-4" /> Fazer Encomenda
              </a>
              <a
                href="#catalogo"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-colors hover:bg-white/10 sm:w-auto"
                style={{ color: "var(--ec-cream)", border: "1px solid rgba(255,244,230,0.45)" }}
              >
                Ver Catálogo <ArrowRight className="h-4 w-4" />
              </a>
            </motion.div>
          </motion.div>
        </div>

        <a href="#favoritos" className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white/60" aria-label="Descer">
          <span className="flex h-9 w-9 animate-bounce items-center justify-center rounded-full" style={{ border: "1px solid rgba(255,255,255,0.3)" }}>
            <ArrowRight className="h-4 w-4 rotate-90" />
          </span>
        </a>
      </section>

      {/* ───────────────── FAVORITOS ───────────────── */}
      <section id="favoritos" className="relative py-20 lg:py-28" style={{ background: "var(--ec-cream)" }}>
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="mb-12 text-center">
            <SectionTag>Os preferidos da casa</SectionTag>
            <h2 className={`mt-4 text-3xl font-semibold sm:text-4xl ${display.className}`} style={{ color: "var(--ec-green-deep)" }}>
              Os favoritos de quem já provou.
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {FAVORITOS.map((f) => (
              <motion.div
                key={f.titulo}
                variants={fadeUp}
                className="group rounded-3xl border bg-white p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                style={{ borderColor: "rgba(169,130,60,0.18)" }}
              >
                <span
                  className="flex h-14 w-14 items-center justify-center rounded-2xl transition-colors"
                  style={{ background: "var(--ec-cream-2)" }}
                >
                  <f.icon className="h-7 w-7" style={{ color: "var(--ec-green)" }} />
                </span>
                <h3 className={`mt-5 text-xl font-semibold ${display.className}`} style={{ color: "var(--ec-green-deep)" }}>
                  {f.titulo}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed" style={{ color: "var(--ec-brown)" }}>
                  {f.texto}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───────────────── CATÁLOGO / GALERIA ───────────────── */}
      <section id="catalogo" className="py-20 lg:py-28" style={{ background: "var(--ec-cream-2)" }}>
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="mb-12 max-w-2xl">
            <SectionTag>Catálogo</SectionTag>
            <h2 className={`mt-4 text-3xl font-semibold sm:text-4xl ${display.className}`} style={{ color: "var(--ec-green-deep)" }}>
              Feito à mão, com o carinho de sempre.
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed" style={{ color: "var(--ec-brown)" }}>
              Bolos, salgados, doces e sobremesas preparados por encomenda. Escolha o seu preferido e
              peça diretamente pelo WhatsApp.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {CATALOGO.map((c) => (
              <motion.article
                key={c.titulo}
                variants={fadeUp}
                className="group flex flex-col overflow-hidden rounded-3xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                style={{ borderColor: "rgba(169,130,60,0.18)" }}
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={c.img}
                    alt={c.titulo}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span
                    className="absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold backdrop-blur-md"
                    style={{ background: "rgba(11,61,53,0.82)", color: "var(--ec-gold-soft)" }}
                  >
                    {c.categoria}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className={`text-[17px] font-semibold ${display.className}`} style={{ color: "var(--ec-green-deep)" }}>
                    {c.titulo}
                  </h3>
                  <p className="mt-1.5 flex-1 text-[13px] leading-relaxed" style={{ color: "var(--ec-brown)" }}>
                    {c.texto}
                  </p>
                  <a
                    href={waLink(c.titulo)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-semibold transition-colors"
                    style={{ background: "var(--ec-cream-2)", color: "var(--ec-green-deep)" }}
                  >
                    <WhatsAppIcon className="h-4 w-4" style={{ color: "var(--ec-green)" }} /> Pedir por WhatsApp
                  </a>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───────────────── VÍDEOS / REELS ───────────────── */}
      <section className="py-20 lg:py-28" style={{ background: "var(--ec-green-deep)" }}>
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="mb-12 text-center">
            <SectionTag>Bastidores</SectionTag>
            <h2 className={`mt-4 text-3xl font-semibold text-white sm:text-4xl ${display.className}`}>
              Momentos da Edna&apos;s Cake
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-white/70">
              Um cantinho dos nossos bolos, salgados e festas — feitos com sabor e carinho.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {VIDEOS.map((v) => (
              <motion.div
                key={v.src}
                variants={fadeUp}
                className="group relative aspect-[9/13] overflow-hidden rounded-3xl border shadow-lg"
                style={{ borderColor: "rgba(216,181,109,0.25)" }}
              >
                <video
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster={v.poster}
                >
                  <source src={v.src} type="video/mp4" />
                </video>
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 45%, rgba(7,42,35,0.85) 100%)" }} />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
                  <span
                    className="rounded-full px-3 py-1 text-[12px] font-semibold backdrop-blur-md"
                    style={{ background: "rgba(255,244,230,0.16)", color: "var(--ec-cream)", border: "1px solid rgba(216,181,109,0.35)" }}
                  >
                    {v.etiqueta}
                  </span>
                  <a
                    href={waLink(v.etiqueta)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[12px] font-semibold text-white transition-transform hover:scale-105"
                    style={{ background: "var(--ec-green)" }}
                  >
                    Pedir igual <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───────────────── ENCOMENDAS ───────────────── */}
      <section id="encomendas" className="py-20 lg:py-28" style={{ background: "var(--ec-cream)" }}>
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="mb-12 text-center">
            <SectionTag>Encomendas</SectionTag>
            <h2 className={`mt-4 text-3xl font-semibold sm:text-4xl ${display.className}`} style={{ color: "var(--ec-green-deep)" }}>
              Faça a sua encomenda em poucos minutos.
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {ETAPAS.map((e) => (
              <motion.div key={e.n} variants={fadeUp} className="relative rounded-3xl border bg-white p-7" style={{ borderColor: "rgba(169,130,60,0.18)" }}>
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-bold ${display.className}`}
                  style={{ background: "var(--ec-green)", color: "var(--ec-gold-soft)" }}
                >
                  {e.n}
                </span>
                <h3 className={`mt-5 text-lg font-semibold ${display.className}`} style={{ color: "var(--ec-green-deep)" }}>
                  {e.titulo}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed" style={{ color: "var(--ec-brown)" }}>
                  {e.texto}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="mt-10 text-center">
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.03]"
              style={{ background: "var(--ec-green)", boxShadow: "0 14px 34px -12px rgba(31,122,104,0.8)" }}
            >
              <WhatsAppIcon className="h-5 w-5" /> Encomendar pelo WhatsApp
            </a>
          </motion.div>
        </div>
      </section>

      {/* ───────────────── EVENTOS ───────────────── */}
      <section id="eventos" className="relative overflow-hidden py-20 lg:py-28" style={{ background: "var(--ec-cream-2)" }}>
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="mb-12 text-center">
            <SectionTag>Catering & Eventos</SectionTag>
            <h2 className={`mt-4 text-3xl font-semibold sm:text-4xl ${display.className}`} style={{ color: "var(--ec-green-deep)" }}>
              Para festas, empresas e momentos especiais.
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
          >
            {EVENTOS.map((ev) => (
              <motion.div
                key={ev.titulo}
                variants={fadeUp}
                className="group flex flex-col items-center gap-3 rounded-2xl border bg-white px-4 py-7 text-center transition-all hover:-translate-y-1 hover:shadow-lg"
                style={{ borderColor: "rgba(169,130,60,0.18)" }}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full" style={{ background: "var(--ec-cream-2)" }}>
                  <ev.icon className="h-6 w-6" style={{ color: "var(--ec-green)" }} />
                </span>
                <span className="text-[13px] font-semibold" style={{ color: "var(--ec-green-deep)" }}>
                  {ev.titulo}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───────────────── HISTÓRIA ───────────────── */}
      <section id="historia" className="py-20 lg:py-28" style={{ background: "var(--ec-cream)" }}>
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-xl">
              <Image
                src="/ednas-cake/loja-fachada.png"
                alt="Loja Edna's Cake em Arcozelo, Barcelos"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div
              className={`absolute -bottom-5 -right-3 hidden rounded-2xl px-6 py-4 shadow-lg sm:block ${display.className}`}
              style={{ background: "var(--ec-green)", color: "var(--ec-cream)" }}
            >
              <span className="block text-3xl font-bold" style={{ color: "var(--ec-gold-soft)" }}>4,9</span>
              <span className="text-[12px] tracking-wide">9 críticas no Google</span>
            </div>
          </motion.div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
            <motion.div variants={fadeUp}><SectionTag>A nossa história</SectionTag></motion.div>
            <motion.h2 variants={fadeUp} className={`mt-4 text-3xl font-semibold leading-tight sm:text-4xl ${display.className}`} style={{ color: "var(--ec-green-deep)" }}>
              Uma brasileira que trouxe sabor e carinho para Barcelos.
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-5 text-[15px] leading-relaxed" style={{ color: "var(--ec-brown)" }}>
              A Edna&apos;s Cake nasceu para transformar receitas, memórias e celebrações em momentos
              especiais. Entre bolos personalizados, doces artesanais e salgados brasileiros, cada
              encomenda é preparada com atenção ao detalhe, sabor e carinho.
            </motion.p>
            <motion.ul variants={fadeUp} className="mt-7 space-y-3">
              {[
                "Receitas brasileiras autênticas, feitas à mão",
                "Bolos personalizados para cada celebração",
                "Salgados e doces para festas, empresas e eventos",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[14px]" style={{ color: "var(--ec-ink)" }}>
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" style={{ color: "var(--ec-green)" }} />
                  {item}
                </li>
              ))}
            </motion.ul>
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
                style={{ background: "var(--ec-green)" }}
              >
                <WhatsAppIcon className="h-4 w-4" /> Falar connosco
              </a>
              <a
                href={EMPRESA.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors"
                style={{ border: "1px solid rgba(169,130,60,0.4)", color: "var(--ec-green-deep)" }}
              >
                <InstagramIcon className="h-4 w-4" /> {EMPRESA.instagramHandle}
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ───────────────── AVALIAÇÕES ───────────────── */}
      <section id="avaliacoes" className="py-20 lg:py-28" style={{ background: "var(--ec-green-deeper)" }}>
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="mb-12 text-center">
            <SectionTag>Avaliações reais</SectionTag>
            <h2 className={`mt-4 text-3xl font-semibold text-white sm:text-4xl ${display.className}`}>
              Quem prova, recomenda.
            </h2>
            <div className="mt-5 inline-flex items-center gap-3 rounded-full px-5 py-2.5" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(216,181,109,0.3)" }}>
              <span className={`text-2xl font-bold ${display.className}`} style={{ color: "var(--ec-gold)" }}>4,9</span>
              <span className="flex items-center gap-0.5" style={{ color: "var(--ec-gold)" }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </span>
              <span className="text-[13px] text-white/70">· 9 críticas no Google</span>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {AVALIACOES.map((a) => (
              <motion.figure
                key={a.nome}
                variants={fadeUp}
                className="flex flex-col rounded-3xl p-6"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <Quote className="h-7 w-7" style={{ color: "var(--ec-gold)" }} />
                <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed text-white/90">
                  “{a.texto}”
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${display.className}`}
                    style={{ background: "var(--ec-green)", color: "var(--ec-gold-soft)" }}
                  >
                    {a.nome.charAt(0)}
                  </span>
                  <span>
                    <span className="block text-[14px] font-semibold text-white">{a.nome}</span>
                    <span className="flex items-center gap-0.5" style={{ color: "var(--ec-gold)" }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current" />
                      ))}
                    </span>
                  </span>
                </figcaption>
              </motion.figure>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───────────────── CONTACTOS ───────────────── */}
      <section id="contactos" className="py-20 lg:py-28" style={{ background: "var(--ec-cream-2)" }}>
        <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
            <motion.div variants={fadeUp}><SectionTag>Contactos</SectionTag></motion.div>
            <motion.h2 variants={fadeUp} className={`mt-4 text-3xl font-semibold sm:text-4xl ${display.className}`} style={{ color: "var(--ec-green-deep)" }}>
              Vamos adoçar o seu próximo momento?
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-3 text-[15px] leading-relaxed" style={{ color: "var(--ec-brown)" }}>
              Encomende pelo WhatsApp ou passe pela nossa loja em Arcozelo. Teremos todo o gosto em ajudar.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 space-y-4">
              {[
                { icon: MapPin, label: "Morada", value: EMPRESA.morada },
                { icon: Phone, label: "Telefone", value: EMPRESA.telefone },
                { icon: Clock, label: "Horário", value: "Consulte o horário atualizado no Google Maps." },
              ].map((c) => (
                <div key={c.label} className="flex items-start gap-4 rounded-2xl border bg-white p-4" style={{ borderColor: "rgba(169,130,60,0.18)" }}>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ background: "var(--ec-cream-2)" }}>
                    <c.icon className="h-5 w-5" style={{ color: "var(--ec-green)" }} />
                  </span>
                  <span>
                    <span className="block text-[12px] font-semibold uppercase tracking-wider" style={{ color: "var(--ec-gold-dark)" }}>{c.label}</span>
                    <span className="text-[14px]" style={{ color: "var(--ec-ink)" }}>{c.value}</span>
                  </span>
                </div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="mt-7 flex flex-wrap gap-3">
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03]" style={{ background: "var(--ec-green)" }}>
                <WhatsAppIcon className="h-4 w-4" /> WhatsApp
              </a>
              <a href={EMPRESA.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors" style={{ border: "1px solid rgba(169,130,60,0.4)", color: "var(--ec-green-deep)" }}>
                <InstagramIcon className="h-4 w-4" /> Instagram
              </a>
              <a href={EMPRESA.mapsHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors" style={{ border: "1px solid rgba(169,130,60,0.4)", color: "var(--ec-green-deep)" }}>
                <MapPin className="h-4 w-4" /> Ver localização
              </a>
            </motion.div>
          </motion.div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="overflow-hidden rounded-[2rem] border shadow-lg" style={{ borderColor: "rgba(169,130,60,0.25)" }}>
            <iframe
              title="Localização Edna's Cake"
              src="https://www.google.com/maps?q=Av.%20Central%206,%204750-130%20Arcozelo,%20Barcelos&output=embed"
              className="h-full min-h-[360px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </section>

      {/* ───────────────── FOOTER ───────────────── */}
      <footer className="pt-16 pb-28 lg:pb-16" style={{ background: "var(--ec-green-deeper)" }}>
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <Logo light />
              <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-white/65">
                {EMPRESA.slogan} Bolos personalizados, doces artesanais, salgados e catering em Arcozelo,
                Barcelos. Feitos à mão, com carinho brasileiro.
              </p>
              <div className="mt-6 flex gap-3">
                <a href={EMPRESA.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/10" style={{ border: "1px solid rgba(255,255,255,0.15)", color: "var(--ec-cream)" }}>
                  <InstagramIcon className="h-4.5 w-4.5" />
                </a>
                <a href={waLink()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/10" style={{ border: "1px solid rgba(255,255,255,0.15)", color: "var(--ec-cream)" }}>
                  <WhatsAppIcon className="h-4.5 w-4.5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-[12px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--ec-gold)" }}>Navegação</h4>
              <ul className="mt-4 space-y-2.5">
                {NAV_LINKS.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-[14px] text-white/70 transition-colors hover:text-white">{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[12px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--ec-gold)" }}>Contactos</h4>
              <ul className="mt-4 space-y-3 text-[14px] text-white/70">
                <li className="flex items-start gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--ec-gold)" }} />{EMPRESA.morada}</li>
                <li className="flex items-center gap-2.5"><Phone className="h-4 w-4" style={{ color: "var(--ec-gold)" }} /><a href={EMPRESA.telefoneHref} className="hover:text-white">{EMPRESA.telefone}</a></li>
                <li className="flex items-center gap-2.5"><InstagramIcon className="h-4 w-4" />{EMPRESA.instagramHandle}</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-6 text-[12px] sm:flex-row" style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}>
            <p>© {new Date().getFullYear()} Edna&apos;s Cake · Doces &amp; Salgados. Todos os direitos reservados.</p>
            <div className="flex gap-5">
              <a href="#" className="transition-colors hover:text-white">Política de Privacidade</a>
              <a href="#" className="transition-colors hover:text-white">Termos</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ───────────────── WHATSAPP FLUTUANTE ───────────────── */}
      <a
        href={waLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Encomendar pelo WhatsApp"
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl transition-transform hover:scale-110"
        style={{ background: "#25D366", boxShadow: "0 10px 30px -8px rgba(37,211,102,0.7)" }}
      >
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-30" style={{ background: "#25D366" }} />
        <WhatsAppIcon className="relative h-7 w-7" />
      </a>
    </div>
  )
}
