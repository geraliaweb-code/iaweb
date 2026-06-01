import type { WebsiteTemplate } from "../types"

export const constructionTemplate: WebsiteTemplate = {
  id: "construction",
  nicheAliases: ["construcao", "construction"],
  palette: {
    name: "Preto, dourado e cinza concreto",
    colors: ["#0B0F19", "#F8FAFC", "#FFB800"],
    labels: ["autoridade", "clareza", "valor"],
  },
  headline: (company) => `${company}: obras com confianca, orcamentos claros e execucao profissional.`,
  subheadline: () =>
    "Uma homepage desenhada para transformar procura por construcao, remodelacao e obras em pedidos de orcamento qualificados.",
  cta: "Pedir orcamento",
  services: ["Remodelacoes completas", "Construcao e reabilitacao", "Gestao de obra", "Orcamentos qualificados"],
  about: (company) => `${company} apresenta experiencia, processo e prova visual para reduzir receio antes do primeiro contacto.`,
  differentiators: ["Portfolio visivel", "Processo transparente", "Resposta rapida", "Prova de obra entregue"],
  testimonials: ["A proposta ficou clara desde o primeiro contacto.", "Percebemos rapidamente o nivel de profissionalismo."],
  faq: [
    { question: "Como pedir orcamento?", answer: "O visitante envia dados essenciais e recebe contacto de validacao." },
    { question: "Que prova deve aparecer?", answer: "Antes/depois, obras entregues, zonas servidas e garantias de processo." },
  ],
  contactCta: () => "Transformar uma visita num pedido de orcamento.",
  footer: (company) => `${company} - construcao com processo, confianca e resposta comercial.`,
  structure: ["Hero com obra/prova", "Servicos por tipo de projeto", "Portfolio", "Processo", "FAQ", "Contacto"],
  packageName: "Sistema Comercial",
}
