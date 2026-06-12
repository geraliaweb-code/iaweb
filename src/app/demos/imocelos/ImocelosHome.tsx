"use client"

/**
 * Imocelos — Mediação Imobiliária | Demo Premium
 * --------------------------------------------------------------------------
 * Demo comercial realista para apresentar ao proprietário da Imocelos.
 * Rota isolada: /demos/imocelos  (não afeta nenhuma rota existente).
 *
 * Imóveis e fotos REAIS fornecidos pelo cliente (não inventar imóveis):
 *   - /imocelos/foto02.jpg  → Moradia T4, Apúlia (Esposende)
 *   - /imocelos/foto03.jpg  → Apartamento T3, Arcozelo (Barcelos)
 *   - /imocelos/foto05.jpg  → Moradia T3, Midões (Barcelos)
 *   - /imocelos/hero01.png  → render institucional (referência / hero alt)
 *
 * Para adicionar/trocar imóveis no futuro: editar o array IMOVEIS abaixo.
 * Os testemunhos são PLACEHOLDERS de demonstração (ver array TESTEMUNHOS).
 * --------------------------------------------------------------------------
 */

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  Home,
  Tag,
  TrendingUp,
  Search,
  BedDouble,
  Bath,
  Ruler,
  Bookmark,
  ArrowRight,
  ArrowUpRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Menu,
  X,
  Star,
  Building2,
  Key,
} from "lucide-react"

/* Ícones de marca (lucide v1 removeu os brand icons) */
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.9 3.78-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.9h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94z" />
    </svg>
  )
}
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

/* ─────────────────────────────  DADOS  ───────────────────────────── */

const EMPRESA = {
  nome: "Imocelos",
  sub: "Mediação Imobiliária",
  telefone: "253 824 499",
  telefoneHref: "tel:+351253824499",
  email: "imocelos@gmail.com",
  morada: "Av. Alcaides de Faria 333, 4750-290 Barcelos",
  whatsapp: "https://wa.me/351253824499",
}

const NAV_LINKS = [
  "Imóveis",
  "Comprar",
  "Vender",
  "Arrendar",
  "Serviços",
  "Sobre Nós",
  "Contactos",
]

const SERVICOS = [
  {
    icon: Home,
    titulo: "Comprar",
    texto:
      "Encontre o imóvel ideal com acompanhamento especializado em cada passo do processo.",
  },
  {
    icon: Tag,
    titulo: "Vender",
    texto:
      "Valorizamos o seu imóvel com estratégia de mercado, apresentação profissional e máxima visibilidade.",
  },
  {
    icon: TrendingUp,
    titulo: "Investir",
    texto:
      "Identificamos oportunidades imobiliárias com potencial de valorização e rentabilidade.",
  },
  {
    icon: Key,
    titulo: "Arrendar",
    texto:
      "Soluções de arrendamento com acompanhamento próximo, simples e seguro.",
  },
]

// Imóveis REAIS fornecidos pelo cliente. Para adicionar mais, basta
// acrescentar objetos a este array com a mesma estrutura.
const IMOVEIS = [
  {
    imagem: "/imocelos/foto02.jpg",
    titulo: "Moradia T4",
    local: "Apúlia, Esposende",
    preco: "445 000 €",
    quartos: 4,
    wc: 3,
    area: "265 m²",
    descricao:
      "Moradia de luxo em localização privilegiada, com arquitetura moderna, jardim privado e excelente exposição solar.",
  },
  {
    imagem: "/imocelos/foto03.jpg",
    titulo: "Apartamento T3",
    local: "Barcelos, Arcozelo",
    preco: "299 000 €",
    quartos: 3,
    wc: 2,
    area: "148 m²",
    descricao:
      "Apartamento moderno com excelente luminosidade, boas áreas e localização estratégica em Barcelos.",
  },
  {
    imagem: "/imocelos/foto05.jpg",
    titulo: "Moradia T3",
    local: "Midões, Barcelos",
    preco: "287 500 €",
    quartos: 3,
    wc: 2,
    area: "180 m²",
    descricao:
      "Moradia contemporânea com jardim, garagem e potencial para personalização familiar.",
  },
]

const NUMEROS = [
  { valor: "+12", label: "Anos de experiência" },
  { valor: "+250", label: "Imóveis vendidos" },
  { valor: "+5", label: "Concelhos" },
  { valor: "100%", label: "Compromisso" },
]

const PROCESSO = [
  { n: "01", titulo: "Avaliação", texto: "Análise rigorosa e gratuita do valor de mercado do seu imóvel." },
  { n: "02", titulo: "Estratégia de venda", texto: "Definimos o posicionamento e o plano certo para vender bem." },
  { n: "03", titulo: "Divulgação", texto: "Apresentação profissional e máxima visibilidade nos canais certos." },
  { n: "04", titulo: "Visitas e negociação", texto: "Acompanhamento das visitas e negociação a defender os seus interesses." },
  { n: "05", titulo: "Escritura", texto: "Apoio completo até à assinatura, com total transparência." },
]

// ⚠️ PLACEHOLDERS — testemunhos fictícios apenas para demonstração.
const TESTEMUNHOS = [
  {
    texto:
      "Profissionalismo, dedicação e transparência. Recomendo totalmente a Imocelos para quem quer vender ou comprar com tranquilidade.",
    nome: "Ana Pereira",
    local: "Barcelos",
  },
  {
    texto:
      "Venderam a minha casa em menos tempo do que esperava e sempre com uma comunicação excelente. Equipa muito competente.",
    nome: "Carlos Martins",
    local: "Arcozelo",
  },
  {
    texto:
      "Ajudaram-me a encontrar a casa perfeita para a minha família. Acompanhamento impecável do início ao fim.",
    nome: "Sofia Fernandes",
    local: "Braga",
  },
]

/* ─────────────────────────────  HELPERS  ───────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
}

function Section({
  children,
  className = "",
  id,
  style,
}: {
  children: React.ReactNode
  className?: string
  id?: string
  style?: React.CSSProperties
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.section>
  )
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-lg"
        style={{ background: "var(--imo-gold)" }}
      >
        <Building2 className="h-5 w-5" style={{ color: "var(--imo-black)" }} strokeWidth={2} />
      </div>
      <div className="leading-none">
        <span
          className="block text-lg font-bold tracking-tight"
          style={{ color: light ? "var(--imo-white)" : "var(--imo-white)" }}
        >
          IMOCELOS
        </span>
        <span
          className="block text-[10px] font-medium uppercase tracking-[0.2em]"
          style={{ color: "var(--imo-gold)" }}
        >
          Mediação Imobiliária
        </span>
      </div>
    </div>
  )
}

/* ─────────────────────────────  PÁGINA  ───────────────────────────── */

export default function ImocelosHome() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden font-sans antialiased"
      style={
        {
          "--imo-green": "#003F36",
          "--imo-green-deep": "#00322B",
          "--imo-gold": "#C6A15B",
          "--imo-gold-soft": "#D8BC82",
          "--imo-black": "#050706",
          "--imo-white": "#FFFFFF",
          "--imo-cream": "#F6F3EE",
          background: "var(--imo-black)",
          color: "var(--imo-white)",
        } as React.CSSProperties
      }
    >
      {/* ───────────────── HEADER ───────────────── */}
      <header
        className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06]"
        style={{ background: "rgba(5,7,6,0.78)", backdropFilter: "blur(24px) saturate(180%)" }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Logo />

          <nav className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l}
                href="#"
                className="text-[13px] font-medium tracking-wide text-white/75 transition-colors hover:text-white"
              >
                {l}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-5 lg:flex">
            <a
              href={EMPRESA.telefoneHref}
              className="flex items-center gap-2 text-[13px] font-medium text-white/70 transition-colors hover:text-white"
            >
              <Phone className="h-3.5 w-3.5" style={{ color: "var(--imo-gold)" }} />
              {EMPRESA.telefone}
            </a>
            <div className="h-4 w-px bg-white/15" />
            <a
              href="#avaliacao"
              className="rounded-full px-5 py-2 text-[13px] font-semibold tracking-wide transition-all hover:opacity-90 active:scale-95"
              style={{ background: "var(--imo-gold)", color: "var(--imo-black)" }}
            >
              Avaliar Imóvel
            </a>
          </div>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white lg:hidden"
            aria-label="Menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            className="border-t border-white/8 px-5 py-4 lg:hidden"
            style={{ background: "rgba(5,7,6,0.97)" }}
          >
            <nav className="flex flex-col gap-0.5">
              {NAV_LINKS.map((l) => (
                <a
                  key={l}
                  href="#"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-[15px] font-medium text-white/80 hover:bg-white/5 hover:text-white"
                >
                  {l}
                </a>
              ))}
            </nav>
            <div className="mt-4 flex flex-col gap-3 border-t border-white/8 pt-4">
              <a href={EMPRESA.telefoneHref} className="flex items-center gap-2 text-sm font-medium text-white/70">
                <Phone className="h-4 w-4" style={{ color: "var(--imo-gold)" }} />
                {EMPRESA.telefone}
              </a>
              <a
                href="#avaliacao"
                onClick={() => setMenuOpen(false)}
                className="rounded-full px-5 py-3 text-center text-sm font-semibold"
                style={{ background: "var(--imo-gold)", color: "var(--imo-black)" }}
              >
                Avaliar Imóvel
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ───────────────── HERO ───────────────── */}
      <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden">
        {/* hero01.png — render arquitetónico premium (não é imóvel à venda) */}
        {/* Para usar vídeo: colocar /imocelos/hero.mp4 e descomentar bloco abaixo */}
        {/*
        <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover">
          <source src="/imocelos/hero.mp4" type="video/mp4" />
        </video>
        */}
        <Image
          src="/imocelos/hero01.png"
          alt="Arquitectura premium — Imocelos"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Overlay cinematográfico multi-camada */}
        {/* Camada 1: gradiente direcional — escuro à esquerda, deixa ver arquitectura à direita */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(115deg, rgba(5,7,6,0.97) 0%, rgba(5,7,6,0.88) 30%, rgba(5,7,6,0.65) 55%, rgba(0,63,54,0.28) 100%)",
          }}
        />
        {/* Camada 2: vinheta inferior para ancorar o conteúdo */}
        <div
          className="absolute inset-x-0 bottom-0 h-2/3"
          style={{
            background: "linear-gradient(0deg, rgba(5,7,6,0.95) 0%, rgba(5,7,6,0.5) 40%, transparent 100%)",
          }}
        />
        {/* Camada 3: glow dourado subtil no canto inferior esquerdo */}
        <div
          className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, var(--imo-gold), transparent 70%)" }}
        />

        {/* Conteúdo hero — sempre visível, sem animações de opacidade */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 pt-36 lg:px-8 lg:pb-20">

          {/* Label com linha dourada decorativa */}
          <div className="flex items-center gap-3">
            <div className="h-px w-10 rounded-full" style={{ background: "var(--imo-gold)" }} />
            <span
              className="text-[11px] font-semibold uppercase tracking-[0.35em]"
              style={{ color: "var(--imo-gold)" }}
            >
              Barcelos e Região
            </span>
          </div>

          {/* Headline editorial — grande, impactante */}
          <h1 className="mt-6 max-w-[720px] text-[2.6rem] font-black leading-[0.96] tracking-[-0.025em] text-white sm:text-6xl lg:text-7xl xl:text-[5.25rem]">
            Encontre o imóvel certo.
            <span
              className="mt-1 block font-black italic leading-[0.96]"
              style={{ color: "var(--imo-gold)" }}
            >
              Venda com confiança.
            </span>
          </h1>

          {/* Subheadline curta e limpa */}
          <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-white/65 sm:text-base">
            Especialistas em compra, venda e investimento imobiliário em Barcelos e região.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#imoveis"
              className="group flex items-center gap-2.5 rounded-full px-7 py-3.5 text-[13px] font-bold tracking-wide transition-all hover:opacity-90 active:scale-95"
              style={{ background: "var(--imo-gold)", color: "var(--imo-black)" }}
            >
              Ver Imóveis
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#avaliacao"
              className="rounded-full border border-white/25 px-7 py-3.5 text-[13px] font-semibold text-white/90 backdrop-blur-sm transition-all hover:border-white/50 hover:text-white"
            >
              Avaliar o Meu Imóvel
            </a>
          </div>

          {/* Search bar branca premium */}
          <div
            className="mt-12 max-w-[860px] overflow-hidden rounded-2xl"
            style={{ boxShadow: "0 25px 70px rgba(0,0,0,0.55)" }}
          >
            {/* Desktop: horizontal */}
            <div className="hidden items-stretch bg-white md:flex">
              <SearchFieldWhite label="Tipo de imóvel" options={["Todos", "Moradia", "Apartamento", "Terreno"]} />
              <div className="my-4 w-px bg-gray-100" />
              <SearchFieldWhite label="Tipo de negócio" options={["Comprar", "Arrendar", "Investir"]} />
              <div className="my-4 w-px bg-gray-100" />
              <SearchFieldWhite
                label="Localização"
                options={["Barcelos, Arcozelo e mais", "Esposende", "Braga", "Famalicão"]}
              />
              <button
                className="flex shrink-0 items-center gap-2 px-8 text-[13px] font-bold tracking-wide text-white transition-colors hover:opacity-90"
                style={{ background: "var(--imo-green)" }}
              >
                <Search className="h-4 w-4" />
                Pesquisar
              </button>
            </div>
            {/* Mobile: stacked */}
            <div className="flex flex-col gap-0 bg-white md:hidden">
              <div className="border-b border-gray-100 p-4">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Tipo de imóvel</p>
                <select className="w-full appearance-none bg-transparent text-sm font-medium text-gray-800 outline-none">
                  {["Todos", "Moradia", "Apartamento", "Terreno"].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div className="border-b border-gray-100 p-4">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Tipo de negócio</p>
                <select className="w-full appearance-none bg-transparent text-sm font-medium text-gray-800 outline-none">
                  {["Comprar", "Arrendar", "Investir"].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div className="border-b border-gray-100 p-4">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Localização</p>
                <select className="w-full appearance-none bg-transparent text-sm font-medium text-gray-800 outline-none">
                  {["Barcelos, Arcozelo e mais", "Esposende", "Braga", "Famalicão"].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
              <button
                className="flex items-center justify-center gap-2 py-4 text-[13px] font-bold tracking-wide text-white"
                style={{ background: "var(--imo-green)" }}
              >
                <Search className="h-4 w-4" />
                Pesquisar Imóveis
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── SERVIÇOS ───────────────── */}
      <Section id="servicos" className="px-5 py-24 lg:px-8" style={{ background: "rgba(255,255,255,0.018)" }}>
        <div className="mx-auto max-w-7xl">
          <motion.div variants={fadeUp} className="mb-12 max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--imo-gold)" }}>
              O que fazemos
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Acompanhamento completo, do primeiro contacto à escritura.
            </h2>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICOS.map((s) => (
              <motion.div
                key={s.titulo}
                variants={fadeUp}
                className="group rounded-2xl border border-white/8 p-7 transition-all hover:border-[var(--imo-gold)]/40 hover:-translate-y-1"
                style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))" }}
              >
                <div
                  className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ background: "rgba(198,161,91,0.12)" }}
                >
                  <s.icon className="h-6 w-6" style={{ color: "var(--imo-gold)" }} />
                </div>
                <h3 className="text-xl font-semibold">{s.titulo}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-white/65">{s.texto}</p>
                <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-white/45 transition-colors group-hover:text-[var(--imo-gold)]">
                  Saber mais <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ───────────────── IMÓVEIS EM DESTAQUE ───────────────── */}
      <Section id="imoveis" className="px-5 py-20 lg:px-8" >
        <div className="mx-auto max-w-7xl">
          <motion.div variants={fadeUp} className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--imo-gold)" }}>
                Imóveis em destaque
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Os melhores imóveis, para os melhores clientes.
              </h2>
            </div>
            <a href="#" className="flex items-center gap-1.5 text-sm font-semibold text-white/70 hover:text-[var(--imo-gold)]">
              Ver todos os imóveis <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {IMOVEIS.map((imovel) => (
              <motion.article
                key={imovel.titulo + imovel.local}
                variants={fadeUp}
                className="group overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02] transition-all hover:-translate-y-1.5 hover:border-[var(--imo-gold)]/40 hover:shadow-2xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={imovel.imagem}
                    alt={`${imovel.titulo} — ${imovel.local}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <span
                    className="absolute left-3 top-3 rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide"
                    style={{ background: "var(--imo-gold)", color: "var(--imo-black)" }}
                  >
                    Destaque
                  </span>
                  <button
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-md bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-[var(--imo-gold)] hover:text-black"
                    aria-label="Guardar imóvel"
                  >
                    <Bookmark className="h-4 w-4" />
                  </button>

                  {/* Descrição no hover */}
                  <div className="absolute inset-x-0 bottom-0 translate-y-full p-4 text-xs leading-relaxed text-white/90 transition-transform duration-500 group-hover:translate-y-0"
                    style={{ background: "linear-gradient(180deg, transparent, rgba(5,7,6,0.95))" }}>
                    {imovel.descricao}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-base font-semibold">{imovel.titulo}</h3>
                  <p className="mt-0.5 flex items-center gap-1 text-sm text-white/55">
                    <MapPin className="h-3.5 w-3.5" style={{ color: "var(--imo-gold)" }} />
                    {imovel.local}
                  </p>

                  <div className="mt-4 flex items-center gap-4 border-y border-white/8 py-3 text-xs text-white/60">
                    <span className="flex items-center gap-1.5">
                      <BedDouble className="h-4 w-4" /> {imovel.quartos}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Bath className="h-4 w-4" /> {imovel.wc}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Ruler className="h-4 w-4" /> {imovel.area}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-bold" style={{ color: "var(--imo-gold)" }}>
                      {imovel.preco}
                    </span>
                    <button
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-white/80 transition-colors hover:border-[var(--imo-gold)] hover:text-[var(--imo-gold)]"
                      aria-label="Ver detalhes"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}

            {/* CARD 4 — Captação de proprietários (não é um imóvel) */}
            <motion.div
              variants={fadeUp}
              className="relative flex flex-col justify-between overflow-hidden rounded-2xl p-7"
              style={{ background: "linear-gradient(155deg, var(--imo-green) 0%, var(--imo-green-deep) 100%)" }}
            >
              <div
                className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full opacity-20"
                style={{ background: "radial-gradient(circle, var(--imo-gold), transparent 70%)" }}
              />
              <div>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: "rgba(198,161,91,0.18)" }}>
                  <Tag className="h-6 w-6" style={{ color: "var(--imo-gold)" }} />
                </div>
                <h3 className="text-2xl font-bold leading-tight">Quer vender o seu imóvel?</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/75">
                  Receba uma avaliação gratuita e descubra como valorizar o seu imóvel antes de o colocar no mercado.
                </p>
              </div>
              <a
                href="#avaliacao"
                className="mt-7 flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition-transform hover:scale-[1.03]"
                style={{ background: "var(--imo-gold)", color: "var(--imo-black)" }}
              >
                Avaliar Imóvel <ArrowRight className="h-4 w-4" />
              </a>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* ───────────────── AVALIAÇÃO (prioritária) ───────────────── */}
      <Section id="avaliacao" className="px-5 py-20 lg:px-8">
        <div
          className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-white/8"
          style={{ background: "linear-gradient(160deg, var(--imo-green) 0%, var(--imo-green-deep) 100%)" }}
        >
          <div className="grid lg:grid-cols-2">
            {/* Texto + bullets */}
            <motion.div variants={fadeUp} className="p-8 lg:p-12">
              <span className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--imo-gold)" }}>
                Avaliação gratuita
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Quanto vale o seu imóvel?
              </h2>
              <p className="mt-4 max-w-md text-white/75">
                Preencha os dados e receba uma avaliação gratuita e sem compromisso do seu imóvel.
              </p>

              <ul className="mt-8 space-y-3.5">
                {[
                  { icon: Clock, t: "Resposta em até 24h" },
                  { icon: CheckCircle2, t: "Avaliação 100% gratuita" },
                  { icon: ShieldCheck, t: "Totalmente confidencial" },
                ].map((b) => (
                  <li key={b.t} className="flex items-center gap-3 text-sm text-white/90">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: "rgba(198,161,91,0.15)" }}>
                      <b.icon className="h-4.5 w-4.5" style={{ color: "var(--imo-gold)" }} />
                    </span>
                    {b.t}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Formulário */}
            <motion.div variants={fadeUp} className="p-8 lg:p-12">
              <form
                onSubmit={(e) => e.preventDefault()}
                className="rounded-2xl bg-white p-6 sm:p-7"
                style={{ color: "var(--imo-black)" }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Nome completo" placeholder="O seu nome" />
                  <Field label="Telefone" placeholder="9xx xxx xxx" type="tel" />
                  <Field label="Email" placeholder="O seu email" type="email" />
                  <SelectField label="Tipo de imóvel" options={["Selecione", "Moradia", "Apartamento", "Terreno", "Outro"]} />
                  <div className="sm:col-span-2">
                    <Field label="Localização do imóvel" placeholder="Ex: Barcelos, Arcozelo, Tamel…" />
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-5 w-full rounded-lg px-6 py-3.5 text-sm font-semibold transition-transform hover:scale-[1.01]"
                  style={{ background: "var(--imo-gold)", color: "var(--imo-black)" }}
                >
                  Receber Avaliação Gratuita
                </button>
                <p className="mt-3 text-center text-[11px] text-black/45">
                  Ao enviar, concorda em ser contactado pela Imocelos. Dados tratados de forma confidencial.
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* ───────────────── NÚMEROS ───────────────── */}
      <Section className="px-5 py-16 lg:px-8" style={undefined}>
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 lg:grid-cols-4">
          {NUMEROS.map((n) => (
            <motion.div key={n.label} variants={fadeUp} className="text-center sm:text-left">
              <div className="text-4xl font-bold sm:text-5xl" style={{ color: "var(--imo-gold)" }}>
                {n.valor}
              </div>
              <div className="mt-2 text-sm font-medium text-white/70">{n.label}</div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ───────────────── PROCESSO ───────────────── */}
      <Section className="px-5 py-20 lg:px-8" style={{ background: "var(--imo-green-deep)" }}>
        <div className="mx-auto max-w-7xl">
          <motion.div variants={fadeUp} className="mb-12 max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--imo-gold)" }}>
              O nosso processo
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Venda o seu imóvel com acompanhamento profissional.
            </h2>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {PROCESSO.map((p) => (
              <motion.div
                key={p.n}
                variants={fadeUp}
                className="relative rounded-2xl border border-white/8 bg-white/[0.02] p-6"
              >
                <span className="text-3xl font-bold" style={{ color: "rgba(198,161,91,0.45)" }}>
                  {p.n}
                </span>
                <h3 className="mt-3 text-base font-semibold">{p.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{p.texto}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ───────────────── TESTEMUNHOS (placeholders) ───────────────── */}
      <Section className="px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div variants={fadeUp} className="mb-12 max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--imo-gold)" }}>
              Testemunhos
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              A satisfação dos nossos clientes é o nosso maior orgulho.
            </h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {TESTEMUNHOS.map((t) => (
              <motion.figure
                key={t.nome}
                variants={fadeUp}
                className="rounded-2xl border border-white/8 bg-white/[0.02] p-7"
              >
                <div className="flex gap-1" style={{ color: "var(--imo-gold)" }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-white/80">“{t.texto}”</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
                    style={{ background: "rgba(198,161,91,0.15)", color: "var(--imo-gold)" }}
                  >
                    {t.nome.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.nome}</div>
                    <div className="text-xs text-white/50">{t.local}</div>
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </Section>

      {/* ───────────────── CTA FINAL ───────────────── */}
      <Section className="px-5 pb-20 lg:px-8">
        <div
          className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 rounded-3xl px-8 py-12 text-center md:flex-row md:text-left lg:px-14"
          style={{ background: "linear-gradient(120deg, var(--imo-green) 0%, var(--imo-green-deep) 100%)" }}
        >
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Pronto para dar o próximo passo?</h2>
            <p className="mt-2 max-w-xl text-white/75">
              Fale connosco e descubra como podemos ajudar na compra, venda ou valorização do seu imóvel.
            </p>
          </div>
          <a
            href={EMPRESA.telefoneHref}
            className="flex shrink-0 items-center gap-2 rounded-md px-7 py-3.5 text-sm font-semibold transition-transform hover:scale-[1.03]"
            style={{ background: "var(--imo-gold)", color: "var(--imo-black)" }}
          >
            Contacte-nos <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </Section>

      {/* ───────────────── FOOTER ───────────────── */}
      <footer className="border-t border-white/8 px-5 py-14 lg:px-8" style={{ background: "var(--imo-black)" }}>
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1.2fr_1.3fr]">
            <div>
              <Logo />
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">
                A Imocelos é uma empresa de mediação imobiliária em Barcelos, dedicada a realizar sonhos e criar
                oportunidades.
              </p>
              <div className="mt-5 flex gap-3">
                {[FacebookIcon, InstagramIcon, Mail].map((Ic, i) => (
                  <a
                    key={i}
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/70 transition-colors hover:border-[var(--imo-gold)] hover:text-[var(--imo-gold)]"
                  >
                    <Ic className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Navegação</h4>
              <ul className="mt-4 space-y-2.5 text-sm text-white/70">
                {["Imóveis", "Comprar", "Vender", "Arrendar", "Serviços"].map((l) => (
                  <li key={l}>
                    <a href="#" className="hover:text-[var(--imo-gold)]">{l}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Contactos</h4>
              <ul className="mt-4 space-y-3 text-sm text-white/70">
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--imo-gold)" }} />
                  {EMPRESA.morada}
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 shrink-0" style={{ color: "var(--imo-gold)" }} />
                  <a href={EMPRESA.telefoneHref} className="hover:text-[var(--imo-gold)]">{EMPRESA.telefone}</a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 shrink-0" style={{ color: "var(--imo-gold)" }} />
                  <a href={`mailto:${EMPRESA.email}`} className="hover:text-[var(--imo-gold)]">{EMPRESA.email}</a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Newsletter</h4>
              <p className="mt-4 text-sm text-white/60">Receba as melhores oportunidades no seu email.</p>
              <form onSubmit={(e) => e.preventDefault()} className="mt-4 flex gap-2">
                <input
                  type="email"
                  placeholder="O seu email"
                  className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-[var(--imo-gold)]"
                />
                <button
                  className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-lg"
                  style={{ background: "var(--imo-gold)", color: "var(--imo-black)" }}
                  aria-label="Subscrever"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/8 pt-6 text-xs text-white/40 sm:flex-row">
            <span>© {new Date().getFullYear()} Imocelos — Mediação Imobiliária. Todos os direitos reservados.</span>
            <div className="flex gap-5">
              <a href="#" className="hover:text-white/70">Política de Privacidade</a>
              <a href="#" className="hover:text-white/70">Termos e Condições</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ───────────────── WHATSAPP FLUTUANTE ───────────────── */}
      <a
        href={EMPRESA.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-transform hover:scale-110"
        style={{ background: "#25D366" }}
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="#fff" aria-hidden>
          <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.042zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      </a>
    </div>
  )
}

/* ─────────────────────────────  SUB-COMPONENTES  ───────────────────────────── */

/* Search field para a barra branca do hero */
function SearchFieldWhite({ label, options }: { label: string; options: string[] }) {
  return (
    <div className="flex flex-1 flex-col justify-center px-6 py-4">
      <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">{label}</p>
      <select
        defaultValue={options[0]}
        className="cursor-pointer appearance-none bg-transparent text-[13px] font-semibold text-gray-800 outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  )
}

/* Search field para a barra dark (mantida para compatibilidade) */
function SearchField({ label, options }: { label: string; options: string[] }) {
  return (
    <div className="flex-1 px-4 py-2">
      <label className="block text-[11px] font-medium uppercase tracking-wide text-white/45">{label}</label>
      <select
        defaultValue={options[0]}
        className="mt-0.5 w-full cursor-pointer appearance-none bg-transparent text-sm font-medium text-white outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o} className="text-black">
            {o}
          </option>
        ))}
      </select>
    </div>
  )
}

function Divider() {
  return <div className="hidden w-px self-stretch bg-white/10 md:block" />
}

function Field({
  label,
  placeholder,
  type = "text",
}: {
  label: string
  placeholder: string
  type?: string
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-black/70">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-lg border border-black/12 bg-[var(--imo-cream)] px-3.5 py-2.5 text-sm text-black outline-none transition-colors placeholder-black/35 focus:border-[var(--imo-gold)]"
      />
    </label>
  )
}

function SelectField({ label, options }: { label: string; options: string[] }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-black/70">{label}</span>
      <select
        defaultValue={options[0]}
        className="w-full rounded-lg border border-black/12 bg-[var(--imo-cream)] px-3.5 py-2.5 text-sm text-black outline-none focus:border-[var(--imo-gold)]"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  )
}
