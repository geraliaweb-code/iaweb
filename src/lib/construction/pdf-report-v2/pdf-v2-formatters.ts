export function formatPdfV2Currency(value: number | null | undefined) {
  const amount = Number(value ?? 0)

  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number.isFinite(amount) ? amount : 0)
}

export function formatPdfV2Date(value: Date) {
  return new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(value)
}

export function formatPdfV2Range(range: { min: number; max: number }) {
  return `${formatPdfV2Currency(range.min)} - ${formatPdfV2Currency(range.max)}`
}

export function formatPdfV2Score(value: number | null | undefined) {
  const score = Math.max(0, Math.min(100, Math.round(Number(value ?? 0))))
  return `${score}/100`
}

export function formatPdfV2Percent(value: number | null | undefined) {
  const percent = Math.max(0, Math.min(100, Math.round(Number(value ?? 0))))
  return `${percent}%`
}

export function safePdfV2Filename(value: string) {
  const cleaned = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .toLowerCase()

  return cleaned || "projeto"
}

export function compactPdfV2Text(value: string | number | null | undefined, fallback = "Nao indicado") {
  const text = String(value ?? "").trim()
  return text || fallback
}
