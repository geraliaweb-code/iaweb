export type PdfBrandingConfig = {
  companyName: string
  tagline: string
  website: string
  email: string
  whatsapp: string
  logoText: string
  colors: {
    background: string
    backgroundAlt: string
    panel: string
    electric: string
    blue: string
    blueSoft: string
    gold: string
    goldDark: string
    white: string
    muted: string
    subtle: string
    line: string
    danger: string
    success: string
  }
  watermark: {
    enabled: boolean
    text: string
  }
  footer: {
    enabled: boolean
    text: string
  }
  pdfMetadata: {
    author: string
    creator: string
    subject: string
    keywords: string
  }
}

export const iawebPdfBranding: PdfBrandingConfig = {
  companyName: "IAWEB",
  tagline: "Inteligencia - Automacao - Resultados",
  website: "www.iaweb.pt",
  email: "contacto@iaweb.pt",
  whatsapp: "+351 913 837 004",
  logoText: "IAWEB",
  colors: {
    background: "#050816",
    backgroundAlt: "#081120",
    panel: "#0B1325",
    electric: "#00A3FF",
    blue: "#007BFF",
    blueSoft: "#3AB8FF",
    gold: "#FFB800",
    goldDark: "#D79B00",
    white: "#FFFFFF",
    muted: "#A7B4C8",
    subtle: "#718096",
    line: "#263A5F",
    danger: "#FF7A1A",
    success: "#32D583",
  },
  watermark: {
    enabled: true,
    text: "IAWEB",
  },
  footer: {
    enabled: true,
    text: "Inteligencia - Automacao - Resultados",
  },
  pdfMetadata: {
    author: "IAWEB",
    creator: "IAWEB Platform",
    subject: "Diagnostico Estrategico Digital",
    keywords: "IA, Automacao, CRM, Website, Marketing Digital, Geracao de Leads",
  },
}
