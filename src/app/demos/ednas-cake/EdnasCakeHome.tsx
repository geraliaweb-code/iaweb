"use client"

/**
 * Edna's Cake — Confeitaria Artesanal | Demo Premium (v2 · cinematográfica)
 * --------------------------------------------------------------------------
 * Rota isolada: /demos/ednas-cake  (não afeta nenhuma rota existente).
 *
 * Reconstrução completa orientada à EMOÇÃO e à MARCA, calibrada pela
 * referência da Demo Factory (Marlene Miranda). Ordem obrigatória:
 *   1 Hero · 2 Emoção · 3 Marca · 4 Storytelling · 5 Confiança
 *   6 Reviews · 7 Produtos/Experiências · 8 Funcionalidades (galeria/contactos)
 *
 * Assets REAIS do cliente em /public/ednas-cake/ (fotos .webp/.png + vídeos .mp4).
 * Avaliações = reais do Google (4,9 · 9 críticas). Horário = placeholder editável.
 * --------------------------------------------------------------------------
 */

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from "lenis"
import { Fraunces } from "next/font/google"
import {
  ArrowUpRight,
  ChevronRight,
  Heart,
  MapPin,
  Phone,
  Play,
  Quote,
  Sparkles,
  Star,
  X,
} from "lucide-react"

const display = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
})

const EASE = [0.21, 0.47, 0.32, 0.98] as const
const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-70px" },
  transition: { duration: 0.9, delay, ease: EASE },
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
  const msg = `Olá Edna's Cake! 🎂 Gostaria de falar sobre: ${produto}.`
  return `${base}?text=${encodeURIComponent(msg)}`
}

const EMPRESA = {
  nome: "Edna's Cake",
  slogan: "O sabor que abraça.",
  telefone: "920 497 230",
  telefoneHref: "tel:+351920497230",
  morada: "Av. Central 6, 4750-130 Arcozelo, Barcelos",
  mapsHref: "https://www.google.com/maps/search/?api=1&query=Edna's+Cake+Arcozelo+Barcelos",
  instagram: "https://instagram.com/ednascake.pt",
  instagramHandle: "@ednascake.pt",
}

const NAV = [
  { label: "História", href: "#historia" },
  { label: "Experiências", href: "#experiencias" },
  { label: "Avaliações", href: "#avaliacoes" },
  { label: "Galeria", href: "#galeria" },
  { label: "Contactos", href: "#contactos" },
]

const PILARES = [
  { icon: Heart, titulo: "Carinho brasileiro", texto: "Receitas trazidas do Brasil, feitas com o afeto de quem cozinha para a própria família." },
  { icon: Sparkles, titulo: "Detalhe artesanal", texto: "Cada bolo é desenhado à mão, peça única, pensado ao pormenor para o seu momento." },
  { icon: Star, titulo: "Reconhecida em Barcelos", texto: "4,9 no Google e a fama de «melhor coxinha de Barcelos» — confiança de quem já provou." },
]

const METODO = [
  { n: "01", titulo: "Conversa", texto: "Conte-nos a ocasião, a data e a sua ideia. Ouvimos cada detalhe com atenção." },
  { n: "02", titulo: "Criação", texto: "Desenhamos o bolo, escolhemos sabores e definimos os salgados e doces da festa." },
  { n: "03", titulo: "Confeção", texto: "Tudo feito à mão, fresco, com ingredientes de qualidade e tempo de dedicação." },
  { n: "04", titulo: "Entrega", texto: "Levante na loja em Arcozelo ou combine connosco a recolha para o grande dia." },
]

const REVIEWS = [
  { nome: "Paula Tayt-Sohn", texto: "Melhor coxinha de Barcelos.", destaque: true },
  { nome: "Joel Castro", texto: "Agradabilíssimo, e além disso é absolutamente delicioso! Parabéns, Edna." },
  { nome: "Aline Cavalcante", texto: "Melhores salgados da região sem dúvida." },
  { nome: "Ana Paula Marques", texto: "Tudo sempre maravilhoso ❤️" },
  { nome: "Luciano Camargo", texto: "Coxinha deliciosa!" },
]

const EXPERIENCIAS = [
  {
    id: "bolos",
    eyebrow: "Bolos personalizados",
    titulo: "Bolos que viram o centro da festa.",
    texto:
      "De princesas a super-heróis, de aniversários a casamentos — cada bolo é criado à medida da pessoa e do momento. Cor, tema, recheio e cada detalhe pensado para arrancar o «uau».",
    video: "/ednas-cake/video-bolos.mp4",
    poster: "/ednas-cake/bolo-princesa.webp",
    foto: "/ednas-cake/bolo-farmacia.webp",
    cta: "Encomendar um bolo",
  },
  {
    id: "salgados",
    eyebrow: "Salgados brasileiros",
    titulo: "A coxinha que conquistou Barcelos.",
    texto:
      "Crocante por fora, cremosa por dentro. Coxinhas, salgados variados e o autêntico sabor brasileiro para festas, empresas, reuniões e encomendas de família.",
    video: "/ednas-cake/video-salgados.mp4",
    poster: "/ednas-cake/coxinhas-prato.png",
    foto: "/ednas-cake/salgados-caixa.png",
    cta: "Pedir salgados",
  },
  {
    id: "eventos",
    eyebrow: "Eventos & catering",
    titulo: "Mesas que ficam na memória.",
    texto:
      "Aniversários, batizados, casamentos, coffee breaks de empresa e festas infantis. Doces, salgados e bolos a condizer, para transformar o seu evento numa experiência completa.",
    video: "/ednas-cake/video-festa.mp4",
    poster: "/ednas-cake/bolo-melancia.png",
    foto: "/ednas-cake/morango-do-amor.png",
    cta: "Planear um evento",
  },
]

type Media = { type: "image" | "video"; src: string; poster?: string; tag: string; tall?: boolean }
const GALERIA: Media[] = [
  { type: "image", src: "/ednas-cake/bolo-red-velvet.webp", tag: "Red velvet", tall: true },
  { type: "video", src: "/ednas-cake/video-bolos.mp4", poster: "/ednas-cake/bolo-princesa.webp", tag: "Bolos de festa" },
  { type: "image", src: "/ednas-cake/coxinhas-prato.png", tag: "Coxinhas" },
  { type: "image", src: "/ednas-cake/bolo-chocolate.webp", tag: "Chocolate & brigadeiro", tall: true },
  { type: "image", src: "/ednas-cake/morango-do-amor.png", tag: "Morango do amor" },
  { type: "video", src: "/ednas-cake/video-salgados.mp4", poster: "/ednas-cake/coxinhas-prato.png", tag: "Salgados" },
  { type: "image", src: "/ednas-cake/bolo-borboletas.png", tag: "Borboletas" },
  { type: "image", src: "/ednas-cake/combo-doce-salgado.webp", tag: "Doce + salgado", tall: true },
  { type: "image", src: "/ednas-cake/bolo-morango.webp", tag: "Frutos vermelhos" },
  { type: "video", src: "/ednas-cake/video-festa.mp4", poster: "/ednas-cake/bolo-melancia.png", tag: "Festas" },
  { type: "image", src: "/ednas-cake/sobremesas-presente.webp", tag: "Sobremesas presente" },
  { type: "image", src: "/ednas-cake/salgados-brigadeiro.webp", tag: "Brigadeiro & coxinha", tall: true },
]

/* ──────────────────────────  COMPONENTES  ──────────────────────── */

function SectionLabel({ children, tone = "gold" }: { children: React.ReactNode; tone?: "gold" | "green" }) {
  const color = tone === "gold" ? "var(--ec-gold-dark)" : "var(--ec-gold)"
  return (
    <p className="mb-5 flex items-center gap-4 text-[10px] font-semibold uppercase tracking-[0.42em]" style={{ color }}>
      <span className="h-px w-10" style={{ background: "currentColor", opacity: 0.5 }} />
      {children}
    </p>
  )
}

function Pill({ href, children, variant = "solid" }: { href: string; children: React.ReactNode; variant?: "solid" | "ghost" | "cream" }) {
  const base =
    "group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] transition-all duration-300 hover:scale-[1.03]"
  const styles: Record<string, React.CSSProperties> = {
    solid: { background: "var(--ec-gold)", color: "var(--ec-ink)", boxShadow: "0 18px 50px -18px rgba(216,181,109,0.7)" },
    cream: { background: "var(--ec-cream)", color: "var(--ec-ink)" },
    ghost: { border: "1px solid rgba(255,244,230,0.28)", color: "var(--ec-cream)" },
  }
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className={base}
      style={styles[variant]}
    >
      {children}
      <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  )
}

/* ─────────────────────────────  PÁGINA  ───────────────────────────── */

export default function EdnasCakeHome() {
  const heroRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState<Media | null>(null)
  const [scrolled, setScrolled] = useState(false)

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  // Smooth scroll (Lenis)
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.9 })
    let raf = 0
    const loop = (t: number) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  // GSAP reveals + signature parallax
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".ec-reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 84%" } },
        )
      })
      gsap.utils.toArray<HTMLElement>(".ec-signature").forEach((el) => {
        gsap.to(el, { xPercent: -10, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1.2 } })
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <main
      className={`ec-root relative overflow-x-clip ${display.className}`}
      style={
        {
          "--ec-ink": "#08251E",
          "--ec-ink-2": "#0B3D35",
          "--ec-moss": "#134E40",
          "--ec-green": "#1F7A68",
          "--ec-cream": "#FFF4E6",
          "--ec-cream-2": "#FBEBD9",
          "--ec-gold": "#D8B56D",
          "--ec-gold-soft": "#E7CE9A",
          "--ec-gold-dark": "#A9823C",
          "--ec-brown": "#6B4E3D",
          background: "var(--ec-ink)",
          color: "var(--ec-cream)",
        } as React.CSSProperties
      }
    >
      {/* ─── estilos locais ─── */}
      <style>{`
        .ec-root { font-feature-settings: "ss01"; }
        .ec-serif { font-family: ${display.style.fontFamily}, Georgia, serif; }
        .ec-grain::after {
          content: ""; position: absolute; inset: 0; pointer-events: none; z-index: 1; opacity: .05;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
        .ec-glass { background: rgba(8,37,30,0.55); backdrop-filter: blur(22px) saturate(150%); border: 1px solid rgba(216,181,109,0.22); }
        @keyframes ec-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .ec-marquee-track { animation: ec-marquee 32s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .ec-marquee-track { animation: none; } }
        .ec-masonry { column-gap: 14px; }
        .ec-masonry > * { break-inside: avoid; margin-bottom: 14px; }
      `}</style>

      {/* ───────────────── NAV ───────────────── */}
      <nav className="fixed inset-x-0 top-0 z-50 px-4 py-4 sm:px-6">
        <div
          className="mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 sm:px-6"
          style={
            scrolled
              ? { background: "rgba(8,37,30,0.72)", backdropFilter: "blur(20px)", border: "1px solid rgba(216,181,109,0.18)" }
              : { background: "transparent", border: "1px solid transparent" }
          }
        >
          <a href="#top" className="flex items-center gap-2.5">
            <span className="ec-serif text-xl tracking-tight text-[color:var(--ec-cream)] sm:text-2xl">Edna&apos;s Cake</span>
          </a>
          <div className="hidden items-center gap-7 text-[10px] uppercase tracking-[0.26em] lg:flex" style={{ color: "rgba(255,244,230,0.72)" }}>
            {NAV.map((n) => (
              <a key={n.label} href={n.href} className="transition-colors hover:text-[color:var(--ec-gold)]">{n.label}</a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <a href={EMPRESA.telefoneHref} aria-label="Ligar" className="grid h-10 w-10 place-items-center rounded-full transition-colors hover:text-[color:var(--ec-gold)]" style={{ border: "1px solid rgba(255,244,230,0.18)", color: "var(--ec-cream)" }}>
              <Phone className="h-4 w-4" />
            </a>
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-2 rounded-full px-4 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ background: "var(--ec-gold)", color: "var(--ec-ink)" }}>
              <WhatsAppIcon className="h-4 w-4" /> <span className="hidden sm:inline">Encomendar</span>
            </a>
          </div>
        </div>
      </nav>

      {/* ───────────────── 1 · HERO ───────────────── */}
      <section id="top" ref={heroRef} className="ec-grain relative flex min-h-[100svh] items-end overflow-hidden">
        <motion.video
          style={{ y: videoY }}
          className="absolute inset-0 h-[116%] w-full object-cover"
          src="/ednas-cake/video-bolos.mp4"
          poster="/ednas-cake/bolo-red-velvet.webp"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        {/* máscaras cinematográficas */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(8,37,30,0.72) 0%, rgba(8,37,30,0.30) 38%, rgba(8,37,30,0.92) 100%)" }} />
        <div className="absolute inset-y-0 left-0 w-2/3" style={{ background: "linear-gradient(90deg, rgba(8,37,30,0.92), rgba(8,37,30,0.30) 60%, transparent)" }} />

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 px-6 pb-14 pt-36 sm:px-8 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-end lg:pb-20 lg:px-10">
          <div className="min-w-0">
            <motion.p initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2, ease: EASE }} className="mb-6 text-[10px] uppercase tracking-[0.44em]" style={{ color: "var(--ec-gold-soft)" }}>
              Confeitaria artesanal brasileira · Arcozelo, Barcelos
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.4, ease: EASE }}
              className="ec-serif max-w-4xl text-balance font-light leading-[0.92] text-[color:var(--ec-cream)]"
              style={{ fontSize: "clamp(2.6rem, 9.5vw, 7.5rem)" }}
            >
              Cada bolo conta
              <br />
              uma história.
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.6, ease: EASE }} className="ec-serif mt-5 text-2xl italic sm:text-3xl" style={{ color: "var(--ec-gold)" }}>
              — o sabor que abraça.
            </motion.p>
            <motion.p initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.72, ease: EASE }} className="mt-6 max-w-xl text-[15px] leading-7 sm:text-base" style={{ color: "rgba(255,244,230,0.78)" }}>
              Bolos personalizados, salgados brasileiros, doces de festa e catering — feitos à mão para
              os momentos que ficam na memória.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.85, ease: EASE }} className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Pill href={waLink("uma encomenda")} variant="solid">
                <WhatsAppIcon className="h-4 w-4" /> Fazer Encomenda
              </Pill>
              <Pill href="#experiencias" variant="ghost">Ver Trabalhos</Pill>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1, ease: EASE }} className="ec-glass min-w-0 rounded-[1.6rem] p-6">
            <div className="flex items-center gap-1" style={{ color: "var(--ec-gold)" }}>
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
            </div>
            <p className="ec-serif mt-4 text-5xl text-[color:var(--ec-cream)]">4,9</p>
            <p className="mt-1 text-sm" style={{ color: "rgba(255,244,230,0.7)" }}>9 avaliações no Google</p>
            <div className="my-5 h-px" style={{ background: "rgba(216,181,109,0.25)" }} />
            <p className="flex items-center gap-2 text-sm" style={{ color: "var(--ec-gold-soft)" }}>
              <Sparkles className="h-4 w-4" /> «Melhor coxinha de Barcelos»
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* ───────────────── 2 · EMOÇÃO (marquee + manifesto) ───────────────── */}
      <section className="overflow-hidden border-y py-4" style={{ background: "var(--ec-cream)", borderColor: "rgba(169,130,60,0.2)" }}>
        <div className="ec-marquee-track flex w-max gap-10 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.34em]" style={{ color: "var(--ec-ink)" }}>
          {Array.from({ length: 2 }).map((_, g) => (
            <div key={g} className="flex shrink-0 gap-10">
              {["O sabor que abraça", "Bolos personalizados", "Salgados brasileiros", "4,9 no Google", "Feito à mão em Barcelos", "Catering & eventos"].map((t) => (
                <span key={t} className="flex items-center gap-10">
                  {t} <span style={{ color: "var(--ec-gold-dark)" }}>✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="ec-grain relative px-6 py-24 text-center sm:px-8 lg:py-32" style={{ background: "var(--ec-ink)" }}>
        <motion.p {...reveal()} className="ec-serif mx-auto max-w-4xl text-balance font-light leading-[1.05]" style={{ fontSize: "clamp(1.9rem, 5vw, 3.6rem)", color: "var(--ec-cream)" }}>
          Não vendemos apenas doces.
          <br />
          <span style={{ color: "var(--ec-gold)" }}>Servimos memórias.</span>
        </motion.p>
        <motion.p {...reveal(0.1)} className="mx-auto mt-7 max-w-xl text-[15px] leading-7" style={{ color: "rgba(255,244,230,0.65)" }}>
          Por trás de cada encomenda há uma celebração, uma família reunida e uma mesa que ninguém
          esquece. É isso que a Edna confeciona, todos os dias.
        </motion.p>
      </section>

      {/* ───────────────── 3 · MARCA (signature + pilares) ───────────────── */}
      <section className="relative overflow-hidden py-24 lg:py-32" style={{ background: "var(--ec-ink-2)" }}>
        <div className="ec-signature ec-serif pointer-events-none absolute -top-2 left-0 whitespace-nowrap leading-none" style={{ fontSize: "18vw", color: "rgba(255,244,230,0.035)" }}>
          Edna&apos;s Cake · Doces &amp; Salgados
        </div>
        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <motion.div {...reveal()} className="max-w-3xl">
            <SectionLabel>A assinatura Edna&apos;s</SectionLabel>
            <h2 className="ec-serif text-5xl font-light leading-[0.98] sm:text-7xl" style={{ color: "var(--ec-cream)" }}>
              Não é só um bolo. É afeto em forma de doce.
            </h2>
          </motion.div>
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {PILARES.map((p, i) => (
              <motion.article
                key={p.titulo}
                {...reveal(i * 0.08)}
                className="rounded-[1.5rem] p-7"
                style={{ background: "rgba(255,244,230,0.04)", border: "1px solid rgba(216,181,109,0.16)" }}
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl" style={{ background: "rgba(216,181,109,0.14)" }}>
                  <p.icon className="h-6 w-6" style={{ color: "var(--ec-gold)" }} />
                </span>
                <h3 className="ec-serif mt-6 text-3xl" style={{ color: "var(--ec-cream)" }}>{p.titulo}</h3>
                <p className="mt-3 text-sm leading-7" style={{ color: "rgba(255,244,230,0.62)" }}>{p.texto}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── 4 · STORYTELLING (história) ───────────────── */}
      <section id="historia" className="relative mx-auto grid max-w-7xl gap-12 px-6 py-24 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-10 lg:py-32">
        <motion.div {...reveal()} className="relative order-2 lg:order-1">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] shadow-2xl">
            <Image src="/ednas-cake/loja-fachada.png" alt="Loja Edna's Cake em Arcozelo, Barcelos" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 50%, rgba(8,37,30,0.55))" }} />
            <p className="absolute bottom-6 left-6 text-[10px] uppercase tracking-[0.4em]" style={{ color: "var(--ec-gold-soft)" }}>A nossa casa · Arcozelo</p>
          </div>
          <div className="ec-glass absolute -bottom-6 -right-3 hidden rounded-2xl px-6 py-4 sm:block">
            <span className="ec-serif block text-4xl" style={{ color: "var(--ec-gold)" }}>4,9</span>
            <span className="text-[11px] tracking-wide" style={{ color: "rgba(255,244,230,0.7)" }}>9 críticas no Google</span>
          </div>
        </motion.div>

        <div className="order-1 lg:order-2">
          <div className="ec-reveal"><SectionLabel>A história da Edna</SectionLabel></div>
          <h2 className="ec-reveal ec-serif text-5xl font-light leading-[0.98] sm:text-6xl" style={{ color: "var(--ec-cream)" }}>
            Uma brasileira que trouxe sabor e carinho para Barcelos.
          </h2>
          <p className="ec-reveal mt-7 max-w-xl text-[15px] leading-8" style={{ color: "rgba(255,244,230,0.72)" }}>
            A Edna&apos;s Cake nasceu da vontade de transformar receitas, memórias e celebrações em
            momentos especiais. Do Brasil para Portugal, a Edna trouxe na bagagem a paixão pela
            confeitaria e o jeito de quem cozinha com o coração.
          </p>
          <p className="ec-reveal mt-4 max-w-xl text-[15px] leading-8" style={{ color: "rgba(255,244,230,0.72)" }}>
            Entre bolos personalizados, doces artesanais e salgados brasileiros, cada encomenda é
            preparada à mão, com atenção ao detalhe, sabor e carinho — o que rendeu à casa a fama de
            melhor coxinha da região.
          </p>
          <div className="ec-reveal mt-9 flex flex-wrap gap-3">
            <Pill href={waLink("falar com a Edna")} variant="cream"><WhatsAppIcon className="h-4 w-4" /> Falar com a Edna</Pill>
            <a href={EMPRESA.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2.5 rounded-full px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors" style={{ border: "1px solid rgba(255,244,230,0.24)", color: "var(--ec-cream)" }}>
              <InstagramIcon className="h-4 w-4" /> {EMPRESA.instagramHandle}
            </a>
          </div>
        </div>
      </section>

      {/* ───────────────── 5 · CONFIANÇA (método) ───────────────── */}
      <section className="py-24 lg:py-32" style={{ background: "var(--ec-cream)" }}>
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <motion.div {...reveal()} className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <SectionLabel tone="green">Como funciona</SectionLabel>
              <h2 className="ec-serif text-5xl font-light leading-[0.95] sm:text-6xl" style={{ color: "var(--ec-ink-2)" }}>
                Da sua ideia à mesa da festa.
              </h2>
            </div>
            <p className="max-w-md text-[15px] leading-8" style={{ color: "var(--ec-brown)" }}>
              Encomendar é simples e pessoal. Falamos consigo, desenhamos tudo à medida e tratamos do
              resto — para só ter de aproveitar o momento.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {METODO.map((m, i) => (
              <motion.article key={m.n} {...reveal(i * 0.07)} className="rounded-[1.5rem] bg-white p-7" style={{ border: "1px solid rgba(169,130,60,0.2)" }}>
                <p className="text-[10px] uppercase tracking-[0.34em]" style={{ color: "var(--ec-gold-dark)" }}>{m.n}</p>
                <h3 className="ec-serif mt-6 text-3xl" style={{ color: "var(--ec-ink-2)" }}>{m.titulo}</h3>
                <p className="mt-3 text-sm leading-7" style={{ color: "var(--ec-brown)" }}>{m.texto}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── 6 · REVIEWS ───────────────── */}
      <section id="avaliacoes" className="ec-grain relative py-24 lg:py-32" style={{ background: "var(--ec-ink)" }}>
        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <motion.div {...reveal()} className="mb-12 flex flex-col items-end justify-between gap-8 md:flex-row">
            <div>
              <SectionLabel>Prova social real</SectionLabel>
              <h2 className="ec-serif text-5xl font-light leading-[0.95] sm:text-7xl" style={{ color: "var(--ec-cream)" }}>
                Quem prova, recomenda.
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <span className="ec-serif text-6xl" style={{ color: "var(--ec-gold)" }}>4,9</span>
              <div>
                <span className="flex gap-0.5" style={{ color: "var(--ec-gold)" }}>
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </span>
                <span className="text-xs uppercase tracking-[0.28em]" style={{ color: "rgba(255,244,230,0.55)" }}>9 avaliações Google</span>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6 lg:grid-rows-2">
            {REVIEWS.map((r, i) => (
              <motion.figure
                key={r.nome}
                {...reveal((i % 3) * 0.06)}
                className={`flex flex-col rounded-[1.5rem] p-7 ${r.destaque ? "lg:col-span-3 lg:row-span-2" : "lg:col-span-3"}`}
                style={{ background: r.destaque ? "var(--ec-gold)" : "rgba(255,244,230,0.05)", border: "1px solid rgba(216,181,109,0.18)" }}
              >
                <Quote className="h-7 w-7" style={{ color: r.destaque ? "var(--ec-ink)" : "var(--ec-gold)" }} />
                <blockquote className={`ec-serif mt-4 flex-1 leading-snug ${r.destaque ? "text-3xl sm:text-5xl" : "text-xl"}`} style={{ color: r.destaque ? "var(--ec-ink)" : "var(--ec-cream)" }}>
                  “{r.texto}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="ec-serif grid h-10 w-10 place-items-center rounded-full text-sm" style={{ background: r.destaque ? "rgba(8,37,30,0.15)" : "var(--ec-green)", color: r.destaque ? "var(--ec-ink)" : "var(--ec-gold-soft)" }}>{r.nome.charAt(0)}</span>
                  <span>
                    <span className="block text-[13px] font-semibold" style={{ color: r.destaque ? "var(--ec-ink)" : "var(--ec-cream)" }}>{r.nome}</span>
                    <span className="text-[11px]" style={{ color: r.destaque ? "rgba(8,37,30,0.6)" : "rgba(255,244,230,0.5)" }}>Cliente Google</span>
                  </span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── 7 · EXPERIÊNCIAS (produtos) ───────────────── */}
      <section id="experiencias" className="py-24 lg:py-32" style={{ background: "var(--ec-cream)" }}>
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <motion.div {...reveal()} className="mb-16 max-w-2xl">
            <SectionLabel tone="green">Experiências Edna&apos;s</SectionLabel>
            <h2 className="ec-serif text-5xl font-light leading-[0.95] sm:text-7xl" style={{ color: "var(--ec-ink-2)" }}>
              Três formas de adoçar o momento.
            </h2>
          </motion.div>

          <div className="space-y-20 lg:space-y-28">
            {EXPERIENCIAS.map((e, i) => {
              const flip = i % 2 === 1
              return (
                <motion.div key={e.id} id={e.id} {...reveal()} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
                  {/* media */}
                  <div className={`relative ${flip ? "lg:order-2" : ""}`}>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] shadow-2xl">
                      <video className="h-full w-full object-cover" src={e.video} poster={e.poster} autoPlay muted loop playsInline preload="metadata" />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 55%, rgba(8,37,30,0.5))" }} />
                      <span className="absolute left-5 top-5 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ background: "rgba(8,37,30,0.7)", color: "var(--ec-gold-soft)" }}>{e.eyebrow}</span>
                    </div>
                    <div className={`absolute -bottom-7 hidden aspect-square w-36 overflow-hidden rounded-2xl border-4 shadow-xl sm:block ${flip ? "-left-7" : "-right-7"}`} style={{ borderColor: "var(--ec-cream)" }}>
                      <Image src={e.foto} alt={e.titulo} fill sizes="160px" className="object-cover" />
                    </div>
                  </div>
                  {/* texto */}
                  <div className={flip ? "lg:order-1" : ""}>
                    <p className="text-[10px] uppercase tracking-[0.4em]" style={{ color: "var(--ec-gold-dark)" }}>{e.eyebrow}</p>
                    <h3 className="ec-serif mt-4 text-4xl font-light leading-[1.0] sm:text-5xl" style={{ color: "var(--ec-ink-2)" }}>{e.titulo}</h3>
                    <p className="mt-5 max-w-lg text-[15px] leading-8" style={{ color: "var(--ec-brown)" }}>{e.texto}</p>
                    <div className="mt-8">
                      <a href={waLink(e.eyebrow)} target="_blank" rel="noopener noreferrer" className="group inline-flex min-h-12 items-center gap-2.5 rounded-full px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-all hover:scale-[1.03]" style={{ background: "var(--ec-green)" }}>
                        <WhatsAppIcon className="h-4 w-4" /> {e.cta}
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ───────────────── 8 · GALERIA (instagram wall + lightbox) ───────────────── */}
      <section id="galeria" className="py-24 lg:py-32" style={{ background: "var(--ec-ink-2)" }}>
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <motion.div {...reveal()} className="mb-12 flex flex-col items-end justify-between gap-6 md:flex-row">
            <div>
              <SectionLabel>Galeria viva</SectionLabel>
              <h2 className="ec-serif text-5xl font-light leading-[0.95] sm:text-7xl" style={{ color: "var(--ec-cream)" }}>
                Direto do forno ao Instagram.
              </h2>
            </div>
            <a href={EMPRESA.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2.5 rounded-full px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ background: "var(--ec-gold)", color: "var(--ec-ink)" }}>
              <InstagramIcon className="h-4 w-4" /> {EMPRESA.instagramHandle}
            </a>
          </motion.div>

          <div className="ec-masonry sm:[column-count:2] lg:[column-count:3]">
            {GALERIA.map((m, i) => (
              <motion.button
                key={m.src + i}
                {...reveal((i % 3) * 0.05)}
                onClick={() => setActive(m)}
                className="group relative block w-full overflow-hidden rounded-[1.25rem] text-left"
                style={{ border: "1px solid rgba(216,181,109,0.14)" }}
              >
                <div className={`relative w-full ${m.tall ? "aspect-[4/5]" : "aspect-square"}`}>
                  {m.type === "image" ? (
                    <Image src={m.src} alt={m.tag} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <>
                      <Image src={m.poster!} alt={m.tag} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      <span className="absolute inset-0 grid place-items-center">
                        <span className="grid h-14 w-14 place-items-center rounded-full backdrop-blur-md transition-transform group-hover:scale-110" style={{ background: "rgba(255,244,230,0.22)", border: "1px solid rgba(255,244,230,0.5)" }}>
                          <Play className="h-5 w-5 fill-current text-white" />
                        </span>
                      </span>
                    </>
                  )}
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: "linear-gradient(180deg, transparent 55%, rgba(8,37,30,0.85))" }} />
                  <span className="absolute bottom-4 left-4 text-[11px] font-semibold uppercase tracking-[0.2em] opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ color: "var(--ec-gold-soft)" }}>{m.tag}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── CTA FINAL + CONTACTOS ───────────────── */}
      <section id="contactos" className="px-6 py-24 sm:px-8 lg:px-10 lg:py-32" style={{ background: "var(--ec-cream)" }}>
        <div className="ec-grain relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] px-6 py-16 sm:px-10 lg:px-16 lg:py-24" style={{ background: "var(--ec-ink)" }}>
          <video className="absolute inset-0 h-full w-full object-cover opacity-25" src="/ednas-cake/video-festa.mp4" poster="/ednas-cake/bolo-melancia.png" autoPlay muted loop playsInline preload="metadata" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(105deg, rgba(8,37,30,0.95) 0%, rgba(11,61,53,0.7) 55%, rgba(8,37,30,0.3))" }} />
          <div className="relative z-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="mb-6 flex flex-wrap gap-4 text-[11px] uppercase tracking-[0.22em]" style={{ color: "var(--ec-gold-soft)" }}>
                <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Arcozelo, Barcelos</span>
                <span className="flex items-center gap-2"><Sparkles className="h-4 w-4" /> Encomendas personalizadas</span>
              </div>
              <h2 className="ec-serif text-5xl font-light leading-[0.95] sm:text-6xl" style={{ color: "var(--ec-cream)" }}>
                Vamos adoçar o seu próximo momento?
              </h2>
              <p className="mt-6 max-w-lg text-[15px] leading-8" style={{ color: "rgba(255,244,230,0.72)" }}>
                Conte-nos a ocasião e tratamos do resto. Bolos, salgados e doces feitos à mão, com o
                sabor que abraça.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Pill href={waLink("uma encomenda")} variant="solid"><WhatsAppIcon className="h-4 w-4" /> Encomendar pelo WhatsApp</Pill>
                <Pill href={EMPRESA.mapsHref} variant="ghost"><MapPin className="h-4 w-4" /> Ver localização</Pill>
              </div>
            </div>

            <div className="grid gap-3">
              {[
                { icon: MapPin, label: "Morada", value: EMPRESA.morada },
                { icon: Phone, label: "Telefone", value: EMPRESA.telefone, href: EMPRESA.telefoneHref },
                { icon: Star, label: "Horário", value: "Consulte o horário atualizado no Google Maps." },
              ].map((c) => (
                <div key={c.label} className="ec-glass flex items-start gap-4 rounded-2xl p-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ background: "rgba(216,181,109,0.15)" }}>
                    <c.icon className="h-5 w-5" style={{ color: "var(--ec-gold)" }} />
                  </span>
                  <span>
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--ec-gold-soft)" }}>{c.label}</span>
                    {c.href ? (
                      <a href={c.href} className="text-sm" style={{ color: "var(--ec-cream)" }}>{c.value}</a>
                    ) : (
                      <span className="text-sm" style={{ color: "rgba(255,244,230,0.85)" }}>{c.value}</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── FOOTER ───────────────── */}
      <footer className="px-6 pb-28 pt-14 sm:px-8 lg:px-10 lg:pb-16" style={{ background: "var(--ec-ink)" }}>
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 border-b pb-10 lg:grid-cols-[1.5fr_1fr_1fr]" style={{ borderColor: "rgba(255,244,230,0.1)" }}>
            <div>
              <span className="ec-serif text-3xl" style={{ color: "var(--ec-cream)" }}>Edna&apos;s Cake</span>
              <p className="mt-4 max-w-sm text-sm leading-7" style={{ color: "rgba(255,244,230,0.6)" }}>
                {EMPRESA.slogan} Confeitaria artesanal brasileira em Arcozelo, Barcelos — bolos
                personalizados, salgados, doces e catering.
              </p>
              <div className="mt-6 flex gap-3">
                <a href={EMPRESA.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full transition-colors hover:text-[color:var(--ec-gold)]" style={{ border: "1px solid rgba(255,244,230,0.15)", color: "var(--ec-cream)" }}><InstagramIcon className="h-4 w-4" /></a>
                <a href={waLink()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="grid h-10 w-10 place-items-center rounded-full transition-colors hover:text-[color:var(--ec-gold)]" style={{ border: "1px solid rgba(255,244,230,0.15)", color: "var(--ec-cream)" }}><WhatsAppIcon className="h-4 w-4" /></a>
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-[0.24em]" style={{ color: "var(--ec-gold)" }}>Navegação</h4>
              <ul className="mt-4 space-y-2.5">
                {NAV.map((n) => (
                  <li key={n.label}><a href={n.href} className="text-sm transition-colors hover:text-[color:var(--ec-cream)]" style={{ color: "rgba(255,244,230,0.6)" }}>{n.label}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-[0.24em]" style={{ color: "var(--ec-gold)" }}>Contactos</h4>
              <ul className="mt-4 space-y-3 text-sm" style={{ color: "rgba(255,244,230,0.6)" }}>
                <li className="flex items-start gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--ec-gold)" }} />{EMPRESA.morada}</li>
                <li className="flex items-center gap-2.5"><Phone className="h-4 w-4" style={{ color: "var(--ec-gold)" }} /><a href={EMPRESA.telefoneHref} className="hover:text-[color:var(--ec-cream)]">{EMPRESA.telefone}</a></li>
                <li className="flex items-center gap-2.5"><InstagramIcon className="h-4 w-4" />{EMPRESA.instagramHandle}</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 flex flex-col items-center justify-between gap-3 text-[11px] sm:flex-row" style={{ color: "rgba(255,244,230,0.45)" }}>
            <p>© {new Date().getFullYear()} Edna&apos;s Cake · Doces &amp; Salgados</p>
            <div className="flex gap-5">
              <a href="#" className="hover:text-[color:var(--ec-cream)]">Política de Privacidade</a>
              <a href="#" className="hover:text-[color:var(--ec-cream)]">Termos</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ───────────────── DOCK FLUTUANTE ───────────────── */}
      <div className="ec-glass fixed bottom-4 left-1/2 z-50 flex max-w-[calc(100vw-1.5rem)] -translate-x-1/2 items-center gap-2 rounded-full p-2 shadow-2xl">
        <a href={waLink("uma encomenda")} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ background: "var(--ec-gold)", color: "var(--ec-ink)" }}>
          <WhatsAppIcon className="h-4 w-4" /> <span className="hidden sm:inline">Encomendar</span>
        </a>
        <a href={EMPRESA.telefoneHref} aria-label="Ligar" className="grid h-11 w-11 place-items-center rounded-full transition-colors hover:text-[color:var(--ec-gold)]" style={{ border: "1px solid rgba(255,244,230,0.15)", color: "var(--ec-cream)" }}><Phone className="h-4 w-4" /></a>
        <a href={EMPRESA.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid h-11 w-11 place-items-center rounded-full transition-colors hover:text-[color:var(--ec-gold)]" style={{ border: "1px solid rgba(255,244,230,0.15)", color: "var(--ec-cream)" }}><InstagramIcon className="h-4 w-4" /></a>
      </div>

      {/* ───────────────── LIGHTBOX ───────────────── */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] grid place-items-center p-4 backdrop-blur-xl"
            style={{ background: "rgba(8,37,30,0.94)" }}
            onClick={() => setActive(null)}
          >
            <button aria-label="Fechar" onClick={() => setActive(null)} className="absolute right-5 top-5 grid h-12 w-12 place-items-center rounded-full" style={{ background: "var(--ec-cream)", color: "var(--ec-ink)" }}>
              <X className="h-5 w-5" />
            </button>
            <motion.div
              initial={{ scale: 0.92, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 16 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="relative max-h-[86svh] w-auto overflow-hidden rounded-[1.5rem] shadow-2xl"
              onClick={(ev) => ev.stopPropagation()}
            >
              {active.type === "video" ? (
                <video src={active.src} poster={active.poster} className="max-h-[86svh] w-auto max-w-[92vw] object-contain" autoPlay controls playsInline />
              ) : (
                <img src={active.src} alt={active.tag} className="max-h-[86svh] w-auto max-w-[92vw] object-contain" />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
