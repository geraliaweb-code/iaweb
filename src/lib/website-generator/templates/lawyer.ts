import type { WebsiteTemplate } from "../types"

export const lawyerTemplate: WebsiteTemplate = {
  id: "lawyer",
  nicheAliases: ["advocacia", "advogado", "advogados", "lawyer"],
  palette: {
    name: "Azul profundo, branco e dourado discreto",
    colors: ["#07111F", "#FFFFFF", "#B8995B"],
    labels: ["autoridade", "rigor", "confiança"],
  },
  headline: (company) => `${company}: autoridade juridica clara para transformar procura em consulta.`,
  subheadline: () => "Homepage institucional para apresentar areas de pratica, credibilidade e caminho seguro para contacto.",
  cta: "Agendar consulta",
  services: ["Consultoria juridica", "Areas de pratica", "Analise inicial", "Acompanhamento de processos"],
  about: (company) => `${company} comunica especializacao, discricao e confianca sem parecer generico ou excessivamente tecnico.`,
  differentiators: ["Autoridade tecnica", "Confidencialidade", "Especializacao clara", "Contacto seguro"],
  testimonials: ["Percebi rapidamente se era o escritorio certo.", "A comunicacao transmitiu confianca e rigor."],
  faq: [
    { question: "Pode respeitar tom institucional?", answer: "Sim, o template privilegia clareza, rigor e discricao." },
    { question: "Qual e o CTA ideal?", answer: "Agendar consulta ou solicitar analise inicial." },
  ],
  contactCta: () => "Transformar duvida juridica em consulta.",
  footer: (company) => `${company} - advocacia com clareza, confianca e criterio.`,
  structure: ["Hero institucional", "Areas de pratica", "Metodo", "Credenciais", "FAQ", "Contacto"],
  packageName: "Sistema Comercial",
}
