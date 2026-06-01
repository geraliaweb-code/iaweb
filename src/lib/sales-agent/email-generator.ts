import { buildSalesContext } from "./message-engine"
import type { SalesAgentInput } from "./types"

export function generateInitialEmail(input: SalesAgentInput) {
  const context = buildSalesContext(input)
  const subject = `Analise digital da ${context.company}: score ${context.currentScore}/100`
  const financialLine = context.potentialAnnual
    ? `Num cenario conservador, isto pode representar ate ${context.potentialAnnual}/ano em potencial nao capturado.`
    : "Ha sinais claros de oportunidades que podem estar a ficar fora do funil comercial."

  const body = [
    `${context.greeting},`,
    `Analisei a presenca digital da ${context.company}${context.citySuffix} e encontrei uma oportunidade concreta: ${context.mainOpportunity}.`,
    `O score atual ficou em ${context.currentScore}/100. Com uma homepage orientada a credibilidade, captacao e seguimento comercial, a projecao sobe para ${context.projectedScore}/100 (+${context.improvement} pontos).`,
    financialLine,
    `Tambem preparei uma prova visual: ${context.visualProof}.`,
    `A recomendacao inicial e ${context.recommendedPlan}, nao para "ter mais um site", mas para transformar a presenca digital num sistema simples de gerar mais contactos e oportunidades.`,
    "Faz sentido analisarmos isto juntos durante 10 minutos?",
    "Cumprimentos,\nIAWEB",
  ].join("\n\n")

  return { subject, body }
}
