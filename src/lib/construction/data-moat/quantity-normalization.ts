import type {
  NormalizedMaterialSeed,
  QuantityNormalizationResult,
  QuantityRecordInput,
  QuantityRawUnit,
  QuantityUnitFlag,
  UnitConversionRule,
} from "./quantity-types"

export const normalizedMaterialSeeds: NormalizedMaterialSeed[] = [
  {
    id: "mat-structural-concrete-c25-30",
    canonicalName: "STRUCTURAL_CONCRETE_C25_30",
    ptName: "Betão C25/30",
    frName: "Béton C25/30",
    esName: "Hormigón HA-25",
    category: "concrete",
    subcategory: "structural_concrete",
    unitType: "m3",
    aliases: ["betao c25/30", "betão c25/30", "béton c25/30", "beton c25/30", "concrete c25/30", "hormigon ha-25", "hormigón ha-25"],
  },
  {
    id: "mat-reinforcement-steel",
    canonicalName: "REINFORCEMENT_STEEL",
    ptName: "Aço A400",
    frName: "Acier HA",
    esName: "Acero B500S",
    category: "steel",
    subcategory: "reinforcement",
    unitType: "kg",
    aliases: ["aco a400", "aço a400", "acier ha", "acero b500s", "reinforcement steel", "varao a400", "varão a400"],
  },
  {
    id: "mat-pvc-drainage-pipe-sn4",
    canonicalName: "PVC_DRAINAGE_PIPE_SN4",
    ptName: "Tubo PVC SN4",
    frName: "Tube PVC CR4",
    esName: "Tubo PVC SN4",
    category: "drainage",
    subcategory: "pvc_pipe",
    unitType: "m",
    aliases: ["tubo pvc sn4", "tube pvc cr4", "pvc drainage pipe sn4", "pvc sn4", "pvc cr4"],
  },
  {
    id: "mat-hdpe-pipe",
    canonicalName: "HDPE_PIPE",
    ptName: "Tubo PEAD",
    frName: "Tube PEHD",
    esName: "Tubo PEAD",
    category: "water_network",
    subcategory: "hdpe_pipe",
    unitType: "m",
    aliases: ["pead", "pead dn90", "tubo pead", "tube pehd", "hdpe pipe", "pehd", "tubo pead dn90"],
  },
  {
    id: "mat-concrete-kerb",
    canonicalName: "CONCRETE_KERB",
    ptName: "Lancil",
    frName: "Bordure béton",
    esName: "Bordillo de hormigón",
    category: "urban_elements",
    subcategory: "kerb",
    unitType: "m",
    aliases: ["lancil", "lancis", "bordure beton", "bordure béton", "bordillo de hormigon", "bordillo de hormigón", "concrete kerb"],
  },
  {
    id: "mat-manhole-chamber",
    canonicalName: "MANHOLE_CHAMBER",
    ptName: "Câmara de visita",
    frName: "Regard de visite",
    esName: "Pozo de registro",
    category: "drainage",
    subcategory: "inspection_chamber",
    unitType: "un",
    aliases: ["camara de visita", "câmara de visita", "regard de visite", "pozo de registro", "manhole chamber"],
  },
  {
    id: "mat-bituminous-pavement",
    canonicalName: "BITUMINOUS_PAVEMENT",
    ptName: "Pavimento betuminoso",
    frName: "Enrobé bitumineux",
    esName: "Pavimento bituminoso",
    category: "roadworks",
    subcategory: "asphalt",
    unitType: "m2",
    aliases: ["pavimento betuminoso", "enrobe bitumineux", "enrobé bitumineux", "pavimento bituminoso", "bituminous pavement", "asphalt"],
  },
  {
    id: "mat-graded-aggregate-base",
    canonicalName: "GRADED_AGGREGATE_BASE",
    ptName: "Tout-venant",
    frName: "Tout-venant",
    esName: "Zahorra",
    category: "earthworks",
    subcategory: "aggregate_base",
    unitType: "m3",
    aliases: ["tout-venant", "tout venant", "zahorra", "graded aggregate base", "agregado britado"],
  },
]

export const unitConversionRules: UnitConversionRule[] = [
  { id: "unit-m2", fromUnit: "m²", toUnit: "m2", factor: 1, materialCategory: "any", country: null, confidence: 98 },
  { id: "unit-m2-ascii", fromUnit: "m2", toUnit: "m2", factor: 1, materialCategory: "any", country: null, confidence: 98 },
  { id: "unit-m3", fromUnit: "m3", toUnit: "m3", factor: 1, materialCategory: "any", country: null, confidence: 98 },
  { id: "unit-ml", fromUnit: "ml", toUnit: "m", factor: 1, materialCategory: "any", country: null, confidence: 96 },
  { id: "unit-m", fromUnit: "m", toUnit: "m", factor: 1, materialCategory: "any", country: null, confidence: 98 },
  { id: "unit-kg", fromUnit: "kg", toUnit: "kg", factor: 1, materialCategory: "any", country: null, confidence: 98 },
  { id: "unit-un", fromUnit: "un", toUnit: "un", factor: 1, materialCategory: "any", country: null, confidence: 96 },
  {
    id: "unit-vg",
    fromUnit: "vg",
    toUnit: "vg",
    factor: 1,
    materialCategory: "any",
    country: null,
    confidence: 82,
    flags: ["overhead", "exclude_from_future_benchmarks"],
  },
  {
    id: "unit-conj",
    fromUnit: "conj",
    toUnit: "conj",
    factor: 1,
    materialCategory: "any",
    country: null,
    confidence: 78,
    flags: ["compound_unit"],
  },
]

export function normalizeQuantityRecord(record: QuantityRecordInput): QuantityNormalizationResult {
  const material = findNormalizedMaterial(record.rawDescription)
  const unitRule = findUnitConversionRule(record.rawUnit as QuantityRawUnit, material?.category)
  const normalizedQuantity = roundQuantity(record.rawQuantity * unitRule.factor)
  const materialConfidence = material ? 92 : 45
  const extractionConfidence = record.extractionConfidence ?? 70
  const normalizationConfidence = Math.round((materialConfidence * 0.5) + (unitRule.confidence * 0.3) + (extractionConfidence * 0.2))

  return {
    recordId: record.id ?? `${record.projectId}-${slugify(record.rawDescription)}-${record.rawQuantity}`,
    material,
    normalizedUnit: unitRule.toUnit,
    normalizedQuantity,
    conversionFactor: unitRule.factor,
    normalizationConfidence,
    flags: unitRule.flags ?? [],
  }
}

export function findNormalizedMaterial(description: string) {
  const normalized = normalizeSearchText(description)
  return normalizedMaterialSeeds.find((material) =>
    material.aliases.some((alias) => normalized.includes(normalizeSearchText(alias))),
  ) ?? null
}

export function findUnitConversionRule(unit: QuantityRawUnit | string, materialCategory?: NormalizedMaterialSeed["category"]) {
  const normalizedUnit = normalizeUnit(unit)
  return unitConversionRules.find((rule) =>
    rule.fromUnit === normalizedUnit && (rule.materialCategory === "any" || rule.materialCategory === materialCategory),
  ) ?? {
    id: "unit-fallback-un",
    fromUnit: "un",
    toUnit: "un",
    factor: 1,
    materialCategory: "any",
    country: null,
    confidence: 35,
  }
}

export function normalizeUnit(unit: string): QuantityRawUnit {
  const clean = unit.trim().toLowerCase()
  if (clean === "m²" || clean === "m2") return clean
  if (clean === "m³") return "m3"
  if (clean === "ml" || clean === "m.l." || clean === "metro linear" || clean === "metros lineares") return "ml"
  if (clean === "m" || clean === "metro" || clean === "metros") return "m"
  if (clean === "kg") return "kg"
  if (clean === "un" || clean === "und" || clean === "unid" || clean === "unidade") return "un"
  if (clean === "vg" || clean === "verba global") return "vg"
  if (clean === "conj" || clean === "conjunto") return "conj"
  return "un"
}

function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}

function roundQuantity(value: number) {
  return Math.round(value * 1000) / 1000
}

function slugify(value: string) {
  return normalizeSearchText(value).replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}
