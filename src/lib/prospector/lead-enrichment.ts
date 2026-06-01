import type { ProspectCompany, ProspectorFilters } from "./types"
import { getMarketSegment, marketSegments } from "./market-segment-engine"

const cities = ["Lisboa", "Porto", "Braga", "Coimbra", "Aveiro", "Faro", "Viseu", "Setubal"]
const names = ["Norte", "Prime", "Central", "Premium", "Lusa", "Atlântico", "Digital", "Viva", "Pro", "Clara"]

function slug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function generateSimulatedCompanies(filters: ProspectorFilters = {}): ProspectCompany[] {
  const selectedSegments = filters.nicho ? [getMarketSegment(filters.nicho)] : marketSegments
  const limit = filters.limit ?? 30
  const companies: ProspectCompany[] = []

  for (let index = 0; companies.length < limit; index += 1) {
    const segment = selectedSegments[index % selectedSegments.length]
    const city = filters.cidade || cities[index % cities.length]
    const suffix = names[index % names.length]
    const companyName = `${segment.label} ${suffix} ${city}`
    const domain = slug(companyName)

    companies.push({
      empresa: companyName,
      contacto: ["Ana", "Miguel", "Sofia", "Pedro", "Carla", "Rui"][index % 6],
      email: `prospect+${domain}@iaweb.pt`,
      telefone: `+35191${String(2000000 + index).padStart(7, "0")}`,
      website: index % 5 === 0 ? "" : `https://${domain}.pt`,
      cidade: city,
      regiao: filters.regiao || "Portugal",
      nicho: segment.niche,
      keywords: filters.keywords?.length ? filters.keywords : segment.keywords,
      estimatedTicket: filters.estimatedTicket ?? segment.defaultTicket,
      status: filters.status ?? "novo",
      source: "simulado",
    })
  }

  return companies
}
