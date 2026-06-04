import type { ConstructionRiskReferenceSeed } from "./ingestion-types"

export const constructionRiskMatrix: ConstructionRiskReferenceSeed[] = [
  { riskType: "missing_document", title: "Documento critico em falta", severity: "high", trigger: "Documento obrigatorio nao identificado.", recommendation: "Recolher ou classificar o documento antes de decisao executiva." },
  { riskType: "low_document_confidence", title: "Confianca documental baixa", severity: "medium", trigger: "Confidence score documental inferior a 55.", recommendation: "Rever nomes, metadata e duplicados antes do Health Check final." },
  { riskType: "missing_measurements", title: "Medicoes ou quantidades ausentes", severity: "high", trigger: "Sem medicoes, DPGF, DQE, Presupuesto ou mapa de quantidades.", recommendation: "Solicitar mapa de quantidades ou documento equivalente." },
  { riskType: "missing_structures", title: "Estruturas ausentes", severity: "high", trigger: "Projeto sem estruturas quando aplicavel.", recommendation: "Confirmar projeto de estabilidade/estruturas." },
  { riskType: "unknown_documents", title: "Documentos nao classificados", severity: "medium", trigger: "Ficheiros tecnicos sem classificacao confiavel.", recommendation: "Renomear ficheiros e rever taxonomia documental." },
  { riskType: "high_complexity", title: "Complexidade tecnica elevada", severity: "medium", trigger: "Tipologia, area ou especialidades elevam complexidade.", recommendation: "Reforcar revisao tecnica e planeamento de contingencias." },
]
