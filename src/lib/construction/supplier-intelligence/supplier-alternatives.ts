import { europeanSuppliers } from "../datasets/europe"
import { getSupplierId, normalizeSupplierCountry } from "./supplier-coverage"
import { matchSuppliers } from "./supplier-matching"
import { rankSuppliers } from "./supplier-ranking"

export function findSupplierAlternatives(input: {
  supplierId: string
  country?: string | null
  specialty?: string | null
  category?: string | null
}) {
  const current = europeanSuppliers.find((supplier) => getSupplierId(supplier) === input.supplierId)
  if (!current) return []

  const country = normalizeSupplierCountry(input.country ?? current.country)
  const compatible = matchSuppliers({
    country,
    specialty: input.specialty,
    category: input.category,
  }).filter((supplier) => getSupplierId(supplier) !== input.supplierId)

  return rankSuppliers({
    suppliers: compatible,
    country,
    specialty: input.specialty,
    category: input.category,
  })
}
