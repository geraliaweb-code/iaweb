import type { WebsiteTemplate } from "../types"

export const clinicTemplate: WebsiteTemplate = {
  id: "clinic",
  nicheAliases: ["clinicas", "clinica", "dentist", "dentista"],
  palette: {
    name: "Azul claro, branco e verde saude",
    colors: ["#EAF7FF", "#0F172A", "#16A34A"],
    labels: ["confiança", "limpeza", "saude"],
  },
  headline: (company) => `${company}: mais marcacoes com uma presenca digital que transmite confianca.`,
  subheadline: () =>
    "Homepage pensada para converter pesquisas por tratamentos, clinica e especialistas em marcacoes reais.",
  cta: "Marcar avaliacao",
  services: ["Tratamentos principais", "Marcacao online", "Equipa clinica", "Acompanhamento personalizado"],
  about: (company) => `${company} ganha uma apresentacao clara de tratamentos, equipa, provas de confianca e caminho direto para marcacao.`,
  differentiators: ["Confiança imediata", "Marcacao simples", "Prova social", "Explicacao por tratamento"],
  testimonials: ["Consegui perceber o tratamento certo antes de ligar.", "A marcacao ficou simples e rapida."],
  faq: [
    { question: "A homepage ajuda nas marcacoes?", answer: "Sim, reduz duvidas e torna a acao de marcar muito mais direta." },
    { question: "Que conteudo e mais importante?", answer: "Tratamentos, equipa, reputacao, localizacao e CTA de marcacao." },
  ],
  contactCta: () => "Transformar pesquisa em marcacao.",
  footer: (company) => `${company} - cuidados com confianca, clareza e marcacao simples.`,
  structure: ["Hero de marcacao", "Tratamentos", "Equipa", "Prova social", "FAQ", "Contacto"],
  packageName: "Website Profissional",
}
