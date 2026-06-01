import type { WebsiteTemplate } from "../types"

export const realEstateTemplate: WebsiteTemplate = {
  id: "realestate",
  nicheAliases: ["imobiliario", "real_estate"],
  palette: {
    name: "Azul navy, branco e dourado",
    colors: ["#071A3A", "#FFFFFF", "#FFB800"],
    labels: ["prestigio", "clareza", "premium"],
  },
  headline: (company) => `${company}: captar compradores e proprietarios com uma marca imobiliaria premium.`,
  subheadline: () =>
    "Uma homepage para apresentar imoveis, prova local e proposta de valor com foco em contactos qualificados.",
  cta: "Avaliar oportunidade",
  services: ["Venda de imoveis", "Captacao de proprietarios", "Avaliacao imobiliaria", "Acompanhamento comercial"],
  about: (company) => `${company} mostra autoridade local, metodo de venda e capacidade de gerar confianca antes da primeira reuniao.`,
  differentiators: ["Autoridade local", "Apresentacao premium", "Captacao qualificada", "Processo claro"],
  testimonials: ["A marca pareceu muito mais profissional.", "Ficou claro porque escolher esta equipa."],
  faq: [
    { question: "Ajuda a captar proprietarios?", answer: "Sim, a estrutura mostra metodo, prova e caminho direto para avaliacao." },
    { question: "Que CTA funciona melhor?", answer: "Avaliar imovel, falar com consultor ou receber analise de mercado." },
  ],
  contactCta: () => "Transformar interesse em reuniao imobiliaria.",
  footer: (company) => `${company} - imobiliario com estrategia, confianca e captacao premium.`,
  structure: ["Hero premium", "Imoveis/servicos", "Metodo", "Prova local", "FAQ", "Contacto"],
  packageName: "IAWEB Growth Engine",
}
