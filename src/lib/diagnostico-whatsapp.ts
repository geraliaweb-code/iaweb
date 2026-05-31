import type { DiagnosticoFormData, DiagnosticoResult } from "@/lib/diagnostico"

type GenerateDiagnosticoWhatsAppMessageParams = {
  lead: DiagnosticoFormData
  result: DiagnosticoResult
}

export function generateDiagnosticoWhatsAppMessage({ lead, result }: GenerateDiagnosticoWhatsAppMessageParams) {
  const principalOportunidade = result.recomendacoes[0]

  if (!principalOportunidade) {
    throw new Error("Diagnostico sem oportunidade principal.")
  }

  return [
    `Ola ${lead.nome}, obrigado por fazer o diagnostico da ${lead.empresa}.`,
    `O score geral ficou em ${result.scoreFinal}/100 e a principal oportunidade que vimos foi: ${principalOportunidade}`,
    "Se fizer sentido, posso ajudar a perceber quais seriam os proximos passos numa conversa curta.",
  ].join("\n\n")
}
