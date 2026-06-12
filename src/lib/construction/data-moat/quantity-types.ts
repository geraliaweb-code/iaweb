import type { DataMoatCountry } from "./types"

export type QuantityProjectScaleClass = "small" | "medium" | "large" | "xlarge"

export type QuantityDocumentLanguage = "pt" | "fr" | "es"

export type QuantitySourceDocumentType = "MQ" | "DQE" | "DPGF" | "BOQ" | "ESTIMATE"

export type QuantityRawUnit = "m²" | "m2" | "m3" | "ml" | "m" | "kg" | "un" | "vg" | "conj"

export type QuantityNormalizedUnit = "m2" | "m3" | "m" | "kg" | "un" | "vg" | "conj"

export type QuantityUnitFlag = "overhead" | "compound_unit" | "exclude_from_future_benchmarks"

export type QuantityMaterialCategory =
  | "concrete"
  | "steel"
  | "drainage"
  | "water_network"
  | "urban_elements"
  | "roadworks"
  | "earthworks"

export type QuantityRecordInput = {
  id?: string
  projectId: string
  documentId?: string | null
  rawCode?: string | null
  rawDescription: string
  rawUnit: string
  rawQuantity: number
  rawBrand?: string | null
  section?: string | null
  subsection?: string | null
  pageRef?: string | null
  extractionConfidence?: number
  projectScaleClass: QuantityProjectScaleClass
  documentLanguage: QuantityDocumentLanguage
  sourceDocumentType: QuantitySourceDocumentType
}

export type QuantityRecordRow = {
  id: string
  project_id: string
  document_id: string | null
  raw_code: string | null
  raw_description: string
  raw_unit: string
  raw_quantity: number
  raw_brand: string | null
  section: string | null
  subsection: string | null
  page_ref: string | null
  extraction_confidence: number | null
  project_scale_class: QuantityProjectScaleClass
  document_language: QuantityDocumentLanguage
  source_document_type: QuantitySourceDocumentType
}

export type NormalizedMaterialSeed = {
  id: string
  canonicalName: string
  ptName: string
  frName: string
  esName: string
  category: QuantityMaterialCategory
  subcategory: string
  unitType: QuantityNormalizedUnit
  aliases: string[]
}

export type NormalizedMaterialRow = {
  id: string
  canonical_name: string
  pt_name: string
  fr_name: string
  es_name: string
  category: QuantityMaterialCategory
  subcategory: string
  unit_type: QuantityNormalizedUnit
}

export type UnitConversionRule = {
  id: string
  fromUnit: QuantityRawUnit
  toUnit: QuantityNormalizedUnit
  factor: number
  materialCategory: QuantityMaterialCategory | "any"
  country: DataMoatCountry | null
  confidence: number
  flags?: QuantityUnitFlag[]
}

export type QuantityNormalizationResult = {
  recordId: string
  material: NormalizedMaterialSeed | null
  normalizedUnit: QuantityNormalizedUnit
  normalizedQuantity: number
  conversionFactor: number
  normalizationConfidence: number
  flags: QuantityUnitFlag[]
}

export type QuantityNormalizationRow = {
  id: string
  record_id: string
  material_id: string
  normalized_unit: QuantityNormalizedUnit
  normalized_quantity: number
  conversion_factor: number
  normalization_confidence: number
}
