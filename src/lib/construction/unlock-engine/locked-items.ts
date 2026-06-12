import type { ConstructionLockedFeature } from "./types"

export const constructionLockedFeatures: ConstructionLockedFeature[] = [
  {
    key: "complete_budget",
    label: "Orcamento completo",
    description: "Custos completos por especialidade, materiais, mao de obra, equipamentos e subtotais.",
  },
  {
    key: "suppliers",
    label: "Fornecedores completos",
    description: "Fornecedores sugeridos por material, pais e categoria.",
  },
  {
    key: "productivity",
    label: "Produtividade completa",
    description: "Produtividade por equipa, unidade, dia e especialidade.",
  },
  {
    key: "executive_pdf",
    label: "PDF executivo completo",
    description: "Relatorio executivo completo com leitura tecnica e financeira.",
  },
  {
    key: "european_benchmark",
    label: "Benchmark europeu completo",
    description: "Comparacao por mercado, pais, tipologia e faixa de custo.",
  },
  {
    key: "ai_recommendations",
    label: "Recomendacoes IA completas",
    description: "Recomendacoes tecnicas, proximos passos e alertas priorizados.",
  },
]

export const constructionUnlockCopy = {
  label: "Desbloquear Analise Completa" as const,
  title: "Desbloquear Analise Completa",
  body: "Veja o orcamento completo por especialidade, materiais, mao de obra, fornecedores e produtividade.",
  previewBody: "A previa gratuita mostra apenas parte da analise para validar o potencial da obra.",
  href: "/construction/billing",
}
