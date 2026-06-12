import { generateSimulatedCompanies } from "./lead-enrichment"
import type { ProspectCompany, ProspectorFilters } from "./types"

export type ProspectorDataSourceMode = "simulation" | "production"

export type ProspectorDataSourceResult =
  | { ok: true; mode: ProspectorDataSourceMode; companies: ProspectCompany[]; warning?: string }
  | { ok: false; mode: ProspectorDataSourceMode; error: string }

export function getProspectorSourceMode(value?: string | null): ProspectorDataSourceMode {
  return value === "production" ? "production" : "simulation"
}

export function loadProspectorCompanies(
  filters: ProspectorFilters = {},
  mode: ProspectorDataSourceMode = "simulation",
): ProspectorDataSourceResult {
  if (mode === "simulation") {
    return {
      ok: true,
      mode,
      companies: generateSimulatedCompanies(filters),
      warning: "SIMULATION MODE: prospects gerados por motor local, nao por fonte externa.",
    }
  }

  return {
    ok: false,
    mode,
    error: "PRODUCTION MODE ainda nao tem provider configurado. Configure Google Maps, Outscraper ou CSV Import antes de gerar prospects reais.",
  }
}
