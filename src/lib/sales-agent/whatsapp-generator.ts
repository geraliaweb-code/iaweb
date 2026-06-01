import { buildSalesContext } from "./message-engine"
import type { SalesAgentInput } from "./types"

export function generateWhatsAppMessage(input: SalesAgentInput) {
  const context = buildSalesContext(input)
  const impact = context.potentialMonthly ? ` Pode estar em causa ate ${context.potentialMonthly}/mes em oportunidades nao capturadas.` : ""

  return [
    `${context.greeting}, estive a analisar a presenca digital da ${context.company}.`,
    `O score atual ficou em ${context.currentScore}/100 e a simulacao IAWEB projeta ${context.projectedScore}/100 (+${context.improvement} pontos).`,
    `O ponto principal parece ser: ${context.mainProblem}.${impact}`,
    `Preparei uma simulacao visual para mostrar como a ${context.company} pode ganhar mais credibilidade e contactos.`,
    "Quer que lhe envie a simulacao?",
  ].join("\n\n")
}
