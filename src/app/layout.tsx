import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'IAWEB — Automatizamos Aquisição. Escalamos Negócios.',
  description:
    'A IAWEB cria websites premium, automações inteligentes e sistemas com IA para empresas que querem crescer com previsibilidade. Leads qualificados, conversão real.',
  keywords: ['IAWEB', 'websites premium', 'automação', 'IA', 'leads', 'marketing digital', 'Portugal'],
  openGraph: {
    title: 'IAWEB — Automatizamos Aquisição. Escalamos Negócios.',
    description: 'Websites premium, automações inteligentes e IA para empresas que querem crescer com previsibilidade.',
    type: 'website',
    locale: 'pt_PT',
  },
  icons: {
    icon: '/brand/iaweb-icon.png',
    shortcut: '/brand/iaweb-icon.png',
    apple: '/brand/iaweb-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#030712] text-[#F8FAFC]">
        {children}
      </body>
    </html>
  )
}
