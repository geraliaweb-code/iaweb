import Image from "next/image"
import { ArrowRight, Quote, ShieldCheck, Star, Zap } from "lucide-react"
import type { SitePalette } from "@/components/iaweb/SitePaletteSelector"

export type SiteCopy = {
  headline: string
  subheadline: string
  cta: string
  services: string[]
  about?: string
  differentiators: string[]
  testimonial?: string
  testimonials?: string[]
  faq?: Array<{
    question: string
    answer: string
  }>
  finalCta?: string
  contactCta?: string
  footer?: string
}

type SitePreviewMockupProps = {
  company: string
  niche: string
  logoPreview: string
  palette: SitePalette
  copy: SiteCopy
}

export default function SitePreviewMockup({ company, niche, logoPreview, palette, copy }: SitePreviewMockupProps) {
  const [primary, secondary, accent] = palette.colors

  return (
    <section className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.055] shadow-[0_30px_120px_rgba(0,0,0,0.42)] backdrop-blur-2xl">
      <div className="flex items-center justify-between border-b border-white/10 bg-black/25 px-4 py-3">
        <div className="flex gap-2">
          <span className="h-3 w-3 rounded-full bg-red-400/80" />
          <span className="h-3 w-3 rounded-full bg-amber-300/80" />
          <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
        </div>
        <div className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-1 text-xs font-semibold text-slate-300">
          preview.iaweb.pt/{company ? company.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "cliente"}
        </div>
      </div>

      <div style={{ background: primary, color: secondary }} className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(circle at 80% 12%, ${accent}, transparent 34%)` }} />
        <div className="relative px-5 py-5 sm:px-8">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {logoPreview ? (
                <Image src={logoPreview} alt="Logo preview" width={40} height={40} className="h-10 w-10 rounded-xl object-cover" unoptimized />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl font-black" style={{ background: accent, color: primary }}>
                  {(company || "IA").slice(0, 2).toUpperCase()}
                </div>
              )}
              <span className="text-sm font-black tracking-[-0.02em]">{company || "Empresa Cliente"}</span>
            </div>
            <span className="hidden rounded-full px-3 py-1 text-xs font-bold sm:inline-flex" style={{ background: `${accent}26`, color: accent }}>
              {niche || "website premium"}
            </span>
          </nav>

          <div className="grid gap-8 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.16em]" style={{ background: `${accent}24`, color: accent }}>
                <Zap size={13} />
                Nova homepage
              </div>
              <h1 className="text-4xl font-black leading-[0.98] tracking-[-0.055em] sm:text-5xl">{copy.headline}</h1>
              <p className="mt-5 max-w-xl text-sm leading-7 opacity-80 sm:text-base">{copy.subheadline}</p>
              <button className="mt-6 inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-black shadow-[0_18px_60px_rgba(0,0,0,0.22)]" style={{ background: accent, color: primary }}>
                {copy.cta}
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="rounded-[24px] border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
              <div className="grid gap-3 sm:grid-cols-2">
                {copy.services.map((service) => (
                  <div key={service} className="rounded-2xl border border-white/10 bg-black/15 p-4">
                    <ShieldCheck size={18} style={{ color: accent }} />
                    <div className="mt-3 text-sm font-black">{service}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white px-5 py-8 text-slate-950 sm:px-8">
          {copy.about ? (
            <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Sobre</p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">Uma marca mais clara antes da primeira conversa.</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{copy.about}</p>
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-3">
            {copy.differentiators.map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <Star size={17} className="text-amber-500" />
                <p className="mt-3 text-sm font-bold leading-6">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-950 p-5 text-white">
            <Quote size={20} style={{ color: accent }} />
            <p className="mt-3 text-sm leading-7 text-slate-200">{copy.testimonials?.[0] ?? copy.testimonial}</p>
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Prova social ficticia para mockup</p>
          </div>

          {copy.faq?.length ? (
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {copy.faq.map((item) => (
                <div key={item.question} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-sm font-black text-slate-950">{item.question}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.answer}</p>
                </div>
              ))}
            </div>
          ) : null}

          <div className="mt-5 rounded-2xl p-5" style={{ background: accent, color: primary }}>
            <h3 className="text-xl font-black tracking-[-0.03em]">{copy.contactCta ?? copy.finalCta}</h3>
            <p className="mt-2 text-sm font-semibold opacity-80">CTA final para transformar visitantes em contactos qualificados.</p>
          </div>

          {copy.footer ? <footer className="mt-5 text-center text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{copy.footer}</footer> : null}
        </div>
      </div>
    </section>
  )
}
