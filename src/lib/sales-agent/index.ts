import { generateInitialEmail } from "./email-generator"
import { generateFollowups } from "./followup-generator"
import { generateObjectionResponses } from "./objection-handler"
import { generateWhatsAppMessage } from "./whatsapp-generator"
import { buildSalesContext } from "./message-engine"
import type { SalesAgentInput, SalesAgentMessages } from "./types"

export function generateSalesAgentMessages(input: SalesAgentInput): SalesAgentMessages {
  const context = buildSalesContext(input)
  const email = generateInitialEmail(input)
  const followups = generateFollowups(input)
  const objections = generateObjectionResponses(input)

  return {
    whatsappMessage: generateWhatsAppMessage(input),
    emailSubject: email.subject,
    emailBody: email.body,
    followup3d: followups.followup3d,
    followup7d: followups.followup7d,
    followup15d: followups.followup15d,
    objectionResponses: objections,
    postProposalMessage: [
      `${context.greeting}, enviei a proposta para a ${context.company}.`,
      `O foco e simples: sair de um score atual de ${context.currentScore}/100 para uma presenca projetada de ${context.projectedScore}/100, com mais credibilidade, contactos e seguimento comercial.`,
      "Quer que eu lhe resuma os proximos passos?",
    ].join("\n\n"),
    postMeetingMessage: [
      `${context.greeting}, obrigado pela reuniao.`,
      `Ficou claro que a prioridade da ${context.company} passa por ${context.mainOpportunity}.`,
      `Vou deixar tudo alinhado com a simulacao visual, score projetado e ${context.recommendedPlan}. Faz sentido avancarmos para o proximo passo?`,
    ].join("\n\n"),
    status: "gerado",
  }
}

export type { ObjectionKey, SalesAgentInput, SalesAgentMessages } from "./types"
