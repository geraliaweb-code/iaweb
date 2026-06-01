import { buildSalesContext } from "./message-engine"
import type { SalesAgentInput } from "./types"

export function generateFollowups(input: SalesAgentInput) {
  const context = buildSalesContext(input)
  const monthly = context.potentialMonthly ? `, sobretudo porque o potencial nao capturado pode chegar a ${context.potentialMonthly}/mes` : ""

  return {
    followup3d: [
      `${context.greeting}, volto a pegar no ponto da simulacao da ${context.company}.`,
      `Nao e preciso decidir nada agora. A ideia era apenas mostrar a diferenca entre o estado atual (${context.currentScore}/100) e a versao projetada (${context.projectedScore}/100).`,
      "Posso mostrar-lhe a diferenca em 2 minutos?",
    ].join("\n\n"),
    followup7d: [
      `${context.greeting}, deixo so uma nota rapida.`,
      `O principal risco que vimos foi este: ${context.mainProblem}.`,
      `Quando isto fica invisivel, a empresa pode continuar a perder contactos qualificados${monthly}.`,
      "Quer que lhe envie a simulacao para avaliar com calma?",
    ].join("\n\n"),
    followup15d: [
      `${context.greeting}, faz sentido reabrirmos a conversa da ${context.company}?`,
      `A oportunidade continua simples: ${context.mainOpportunity}.`,
      `A simulacao mostra uma melhoria de +${context.improvement} pontos no score digital, com foco em mais credibilidade, contactos e crescimento.`,
      "Se fizer sentido, posso enviar um resumo curto com a recomendacao.",
    ].join("\n\n"),
  }
}
