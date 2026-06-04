import type { ConstructionQueryError } from "./types"

export const constructionMaxFileSizeBytes = 100 * 1024 * 1024

export const constructionAcceptedExtensions = [
  "pdf",
  "zip",
  "dwg",
  "dxf",
  "dwf",
  "dwfx",
  "ifc",
  "xls",
  "xlsx",
  "docx",
  "jpg",
  "jpeg",
  "png",
  "webp",
] as const

export const constructionAcceptAttribute = constructionAcceptedExtensions.map((extension) => `.${extension}`).join(",")

const acceptedMimeTypes = new Set([
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
  "application/x-zip",
  "application/octet-stream",
  "application/acad",
  "application/autocad",
  "application/dwg",
  "application/dxf",
  "application/vnd.dwf",
  "application/vnd.ifc",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
])

export function getConstructionFileExtension(filename: string) {
  return filename.split(".").pop()?.trim().toLowerCase() ?? ""
}

export function isConstructionFileTypeAllowed(filename: string, mimeType?: string | null) {
  const extension = getConstructionFileExtension(filename)

  if (constructionAcceptedExtensions.includes(extension as (typeof constructionAcceptedExtensions)[number])) {
    return true
  }

  return Boolean(mimeType && acceptedMimeTypes.has(mimeType))
}

export function validateConstructionFile(file: { name: string; size: number; type?: string | null }):
  | { ok: true }
  | { ok: false; error: ConstructionQueryError } {
  if (!file.name.trim()) {
    return { ok: false, error: { code: "VALIDATION_FAILED", message: "Nome de ficheiro invalido." } }
  }

  if (file.size <= 0) {
    return { ok: false, error: { code: "VALIDATION_FAILED", message: `${file.name}: ficheiro vazio.` } }
  }

  if (file.size > constructionMaxFileSizeBytes) {
    return { ok: false, error: { code: "VALIDATION_FAILED", message: `${file.name}: tamanho maximo de 100 MB excedido.` } }
  }

  if (!isConstructionFileTypeAllowed(file.name, file.type)) {
    return { ok: false, error: { code: "VALIDATION_FAILED", message: `${file.name}: formato nao suportado.` } }
  }

  return { ok: true }
}

export function formatConstructionFileSize(bytes: number | null | undefined) {
  if (!bytes) return "0 KB"
  const units = ["B", "KB", "MB", "GB"]
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex += 1
  }

  return `${size >= 10 || unitIndex === 0 ? Math.round(size) : size.toFixed(1)} ${units[unitIndex]}`
}
