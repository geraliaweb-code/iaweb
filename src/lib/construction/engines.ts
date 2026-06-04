import { futureConstructionEngines } from "./constants"

export type ConstructionEngineStatus = {
  name: string
  enabled: false
  phase: "foundation"
}

export function getConstructionEngineRegistry(): ConstructionEngineStatus[] {
  return futureConstructionEngines.map((name) => ({
    name,
    enabled: false,
    phase: "foundation",
  }))
}
