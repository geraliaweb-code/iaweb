export { analyzeDigitalPresence } from "./digital-analysis-engine"
export { getProspectorSourceMode, loadProspectorCompanies } from "./data-sources"
export { generateSimulatedCompanies } from "./lead-enrichment"
export { getMarketSegment, marketSegments } from "./market-segment-engine"
export { calculateOpportunityScore } from "./opportunity-score"
export { calculateProspectScore, classifyProspect, generateAutomaticDiagnosis } from "./prospect-score-engine"
export { analyzeProspect, generateProspects, generateProspectsForMode } from "./prospector-engine"
export type { ProspectorDataSourceMode, ProspectorDataSourceResult } from "./data-sources"
export type {
  DigitalAnalysis,
  AutomaticDiagnosis,
  MarketSegment,
  OpportunityScore,
  ProspectCompany,
  ProspectClassification,
  ProspectScore,
  ProspectorFilters,
  ProspectorResult,
} from "./types"
