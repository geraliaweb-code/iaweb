import type { NicheEngine } from "./types"

export const dentistNiche: NicheEngine = {
  id: "clinicas",
  label: "Clinicas e dentistas",
  pains: [
    "Pacientes pesquisam no Google, mas nem sempre encontram sinais fortes de confianca.",
    "Marcacoes ficam dependentes de chamadas e respostas manuais.",
    "Tratamentos de maior valor nao sao explicados com clareza.",
  ],
  opportunities: [
    "Aumentar marcacoes com paginas por tratamento.",
    "Melhorar reputacao e prova social com testemunhos e casos.",
    "Criar resposta rapida por WhatsApp para pedidos de avaliacao.",
  ],
  objections: [
    "Ja temos agenda cheia.",
    "Nao podemos prometer resultados clinicos.",
    "Os pacientes chegam por indicacao.",
  ],
  salesArguments: [
    "Agenda cheia hoje nao garante procura qualificada nos proximos meses.",
    "A comunicacao pode educar sem prometer resultados.",
    "Um percurso claro aumenta confianca antes da primeira consulta.",
  ],
  estimatedRoi: "EUR 2.000-15.000/mes em marcacoes e tratamentos que podem perder-se por falta de confianca digital.",
  keywords: ["dentista", "clinica dentaria", "implantes", "estetica dentaria", "marcacao online"],
  personalizedDiagnosis:
    "Clinicas e dentistas precisam de transmitir seguranca, autoridade e facilidade de marcacao em poucos segundos.",
}
