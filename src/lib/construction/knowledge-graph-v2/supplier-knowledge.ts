import type { SupplierNode } from "./types"

export const supplierKnowledgeNodes: SupplierNode[] = [
  { id: "supplier:saint_gobain", type: "supplier", label: "Saint-Gobain", metadata: { countries: ["portugal", "france", "spain"], materials: ["material:vidro_duplo", "material:pladur", "material:isolamento_etics"], segment: "premium" } },
  { id: "supplier:leroy_merlin_pro", type: "supplier", label: "Leroy Merlin Pro", metadata: { countries: ["portugal", "france", "spain"], materials: ["material:pavimento_ceramico", "material:pladur", "material:cabo_eletrico"], segment: "normal" } },
  { id: "supplier:sonae_arauco", type: "supplier", label: "Sonae Arauco", metadata: { countries: ["portugal", "spain"], materials: ["material:pladur"], segment: "normal" } },
  { id: "supplier:bosch_thermotechnology", type: "supplier", label: "Bosch Thermotechnology", metadata: { countries: ["portugal", "france", "spain"], materials: ["material:equipamento_avac"], segment: "premium" } },
  { id: "supplier:schneider_electric", type: "supplier", label: "Schneider Electric", metadata: { countries: ["portugal", "france", "spain"], materials: ["material:cabo_eletrico", "material:cabo_dados"], segment: "premium" } },
  { id: "supplier:arcelor_mittal", type: "supplier", label: "ArcelorMittal", metadata: { countries: ["portugal", "france", "spain"], materials: ["material:aco_estrutural"], segment: "premium" } },
  { id: "supplier:weber", type: "supplier", label: "Weber", metadata: { countries: ["portugal", "france", "spain"], materials: ["material:isolamento_etics"], segment: "normal" } },
]
