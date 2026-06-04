import type { ConstructionTypologySeed } from "./ingestion-types"

export const constructionTypologies: ConstructionTypologySeed[] = [
  { id: "moradia", label: "Moradia", description: "Habitacao unifamiliar nova ou ampliacao relevante.", typicalAreaBandM2: [120, 450], complexityBaseline: 32 },
  { id: "remodelacao", label: "Remodelacao", description: "Intervencao em edificio existente, parcial ou integral.", typicalAreaBandM2: [40, 800], complexityBaseline: 40 },
  { id: "creche", label: "Creche", description: "Equipamento educativo com exigencias funcionais e regulamentares especificas.", typicalAreaBandM2: [400, 2500], complexityBaseline: 58 },
  { id: "hotel", label: "Hotel", description: "Unidade hoteleira ou alojamento turistico com operacao complexa.", typicalAreaBandM2: [800, 20000], complexityBaseline: 72 },
  { id: "pavilhao_industrial", label: "Pavilhao industrial", description: "Edificio industrial/logistico de vao amplo e infraestrutura tecnica.", typicalAreaBandM2: [800, 30000], complexityBaseline: 78 },
  { id: "restaurante", label: "Restaurante", description: "Espaco de restauracao com cozinha, ventilacao, seguranca e publico.", typicalAreaBandM2: [80, 1200], complexityBaseline: 55 },
  { id: "lar", label: "Lar", description: "Equipamento residencial assistido ou senior com requisitos de seguranca.", typicalAreaBandM2: [800, 12000], complexityBaseline: 68 },
  { id: "industria", label: "Industria", description: "Unidade produtiva com processos, redes e licenciamento especifico.", typicalAreaBandM2: [1000, 50000], complexityBaseline: 82 },
  { id: "comercio", label: "Comercio", description: "Loja, retail park, superficie comercial ou espaco de atendimento.", typicalAreaBandM2: [80, 10000], complexityBaseline: 48 },
]
