import { getNicheEngine } from "@/lib/niches"
import type { ScoreProjection, WebsiteComparison, WebsiteGeneratorInput } from "./types"

export function buildWebsiteComparison(input: WebsiteGeneratorInput, projection: ScoreProjection): WebsiteComparison {
  const niche = getNicheEngine(input.niche)
  const currentWebsite = input.website?.trim() || "Website atual"

  return {
    before: {
      title: currentWebsite,
      score: projection.currentScore,
      problems: [
        niche.pains[0] ?? "A proposta de valor nao fica clara rapidamente.",
        niche.pains[1] ?? "Contactos chegam sem seguimento estruturado.",
        "Conversao, SEO, Google, automacao e mobile nao trabalham como sistema.",
      ],
      areas: {
        conversion: "CTA pouco direto e baixo sentido de urgencia.",
        seo: "Conteudo ainda pouco orientado a pesquisas de intencao.",
        google: "Prova local e sinais de confianca abaixo do potencial.",
        automation: "Seguimento dependente de trabalho manual.",
        mobile: "Experiencia mobile com friccao comercial.",
      },
    },
    after: {
      title: "Homepage IAWEB",
      score: projection.projectedScore,
      improvements: [
        niche.opportunities[0] ?? "Proposta de valor clara e CTA forte.",
        niche.opportunities[1] ?? "Percurso de captacao e seguimento estruturado.",
        "Homepage preparada para credibilidade, captacao, automacao e proposta comercial.",
      ],
      areas: {
        conversion: "Hero, CTA e secoes orientadas a pedido de contacto.",
        credibility: "Prova, diferenciais e argumentos do nicho visiveis.",
        acquisition: "Estrutura preparada para campanhas, Google e pesquisa organica.",
        automation: "Leads prontas para CRM, proxima acao e follow-up.",
        mobile: "Experiencia responsiva para decisao rapida.",
      },
    },
  }
}
