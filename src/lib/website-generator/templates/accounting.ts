import type { WebsiteTemplate } from "../types"

export const accountingTemplate: WebsiteTemplate = {
  id: "accounting",
  nicheAliases: ["contabilidade", "contabilista", "contabilistas", "accounting"],
  palette: {
    name: "Azul profundo, branco e teal",
    colors: ["#082F49", "#FFFFFF", "#14B8A6"],
    labels: ["rigor", "gestao", "clareza"],
  },
  headline: (company) => `${company}: contabilidade clara para empresas que querem decidir melhor.`,
  subheadline: () => "Homepage para comunicar rigor, proximidade e valor recorrente a clientes empresariais.",
  cta: "Pedir analise",
  services: ["Contabilidade mensal", "Fiscalidade", "Apoio a empresas", "Relatorios de gestao"],
  about: (company) => `${company} deixa de competir apenas por preco e passa a comunicar organizacao, previsibilidade e apoio ao crescimento.`,
  differentiators: ["Rigor mensal", "Apoio proativo", "Relatorios claros", "Contacto simples"],
  testimonials: ["Finalmente percebemos o valor do acompanhamento.", "O processo ficou claro antes da primeira reuniao."],
  faq: [
    { question: "Ajuda a captar clientes recorrentes?", answer: "Sim, a mensagem foca valor mensal e previsibilidade." },
    { question: "Que prova usar?", answer: "Processo, especializacoes, setores atendidos e clareza nos entregaveis." },
  ],
  contactCta: () => "Transformar procura em cliente recorrente.",
  footer: (company) => `${company} - contabilidade com clareza, rigor e decisao.`,
  structure: ["Hero de valor", "Servicos recorrentes", "Processo", "Prova", "FAQ", "Contacto"],
  packageName: "Sistema Comercial",
}
