import { accountingTemplate } from "./accounting"
import { clinicTemplate } from "./clinic"
import { constructionTemplate } from "./construction"
import { lawyerTemplate } from "./lawyer"
import { realEstateTemplate } from "./realestate"
import { restaurantTemplate } from "./restaurant"
import type { WebsiteTemplate } from "../types"

const fallbackTemplate: WebsiteTemplate = {
  id: "generic",
  nicheAliases: ["outro", "industria", "servicos B2B", "comercio local"],
  palette: {
    name: "Preto, azul eletrico e branco",
    colors: ["#030712", "#FFFFFF", "#00A3FF"],
    labels: ["premium", "contraste", "acao"],
  },
  headline: (company) => `${company}: uma presenca digital premium para captar melhores oportunidades.`,
  subheadline: () => "Homepage desenhada para comunicar valor, gerar confianca e transformar visitas em conversas comerciais.",
  cta: "Falar com especialista",
  services: ["Website profissional", "Captação de leads", "CRM e seguimento", "Automacao comercial"],
  about: (company) => `${company} ganha uma narrativa clara, credibilidade visual e um caminho direto para contacto qualificado.`,
  differentiators: ["Clareza de proposta", "Prova de valor", "CTA forte", "Seguimento comercial"],
  testimonials: ["A percecao da marca mudou imediatamente.", "Ficou claro qual era o proximo passo."],
  faq: [
    { question: "Serve para qualquer setor?", answer: "Sim, a estrutura adapta copy, CTA e prioridades ao nicho escolhido." },
    { question: "Qual e o foco?", answer: "Credibilidade, captação de clientes, crescimento e oportunidades comerciais." },
  ],
  contactCta: () => "Transformar presenca digital em crescimento real.",
  footer: (company) => `${company} - presenca digital com estrategia e conversao.`,
  structure: ["Hero", "Servicos", "Sobre", "Diferenciais", "Provas sociais", "FAQ", "Contacto", "Footer"],
  packageName: "Website Profissional",
}

export const websiteTemplates = [
  constructionTemplate,
  clinicTemplate,
  realEstateTemplate,
  restaurantTemplate,
  lawyerTemplate,
  accountingTemplate,
  fallbackTemplate,
]

export function getWebsiteTemplate(niche: string) {
  const normalized = niche.trim().toLowerCase()

  return (
    websiteTemplates.find((template) => template.nicheAliases.some((alias) => alias.toLowerCase() === normalized)) ??
    fallbackTemplate
  )
}
