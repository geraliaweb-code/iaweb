import type { NicheEngine } from "./types"

export const lawyerNiche: NicheEngine = {
  id: "advocacia",
  label: "Advocacia",
  pains: [
    "Potenciais clientes procuram confianca antes de contactar.",
    "Areas de pratica nao estao explicadas de forma simples.",
    "Contactos podem chegar sem contexto juridico suficiente.",
  ],
  opportunities: [
    "Criar paginas por area de pratica com linguagem clara.",
    "Gerar pedidos de consulta com formulario qualificado.",
    "Reforcar autoridade com conteudo educativo e prova institucional.",
  ],
  objections: [
    "A advocacia nao deve parecer agressiva comercialmente.",
    "Clientes chegam por referencia.",
    "Nao podemos simplificar temas juridicos demais.",
  ],
  salesArguments: [
    "Autoridade digital nao precisa de ser agressiva; precisa de ser clara.",
    "Conteudo bem estruturado aumenta confianca antes da consulta.",
    "Formularios qualificados poupam tempo e melhoram triagem.",
  ],
  estimatedRoi: "EUR 2.000-20.000/mes em consultas e processos que podem nao chegar por falta de clareza e autoridade.",
  keywords: ["advogado", "consulta juridica", "direito empresarial", "direito familia", "sociedade advogados"],
  personalizedDiagnosis:
    "Na advocacia, a oportunidade esta em transformar autoridade tecnica em confianca simples e pedidos de consulta qualificados.",
}
