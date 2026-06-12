import type { ProductivityDataset } from "../dataset-types"

export const portugalProductivity: ProductivityDataset[] = [
  { country: "Portugal", specialty: "Pintura", unit: "m2/dia", productivityRate: 120, crewSize: 2, scenario: "normal" },
  { country: "Portugal", specialty: "Pintura", unit: "m2/dia", productivityRate: 145, crewSize: 2, scenario: "premium" },
  { country: "Portugal", specialty: "ETICS", unit: "m2/dia", productivityRate: 45, crewSize: 3, scenario: "normal" },
  { country: "Portugal", specialty: "Pladur", unit: "m2/dia", productivityRate: 35, crewSize: 2, scenario: "normal" },
  { country: "Portugal", specialty: "Ceramica", unit: "m2/dia", productivityRate: 25, crewSize: 2, scenario: "normal" },
  { country: "Portugal", specialty: "Alvenaria", unit: "m2/dia", productivityRate: 42, crewSize: 3, scenario: "normal" },
  { country: "Portugal", specialty: "Estruturas", unit: "m3/dia", productivityRate: 22, crewSize: 5, scenario: "normal" },
  { country: "Portugal", specialty: "AVAC", unit: "kw/dia", productivityRate: 18, crewSize: 2, scenario: "normal" },
  { country: "Portugal", specialty: "Eletricidade", unit: "ponto/dia", productivityRate: 28, crewSize: 2, scenario: "normal" },
  { country: "Portugal", specialty: "ITED", unit: "ponto/dia", productivityRate: 32, crewSize: 2, scenario: "normal" },
  { country: "Portugal", specialty: "SCIE", unit: "ponto/dia", productivityRate: 18, crewSize: 2, scenario: "normal" },
]
