import type { ConstructionFileRecord, ConstructionQueryError } from "./types"
import { getConstructionProject, getConstructionSupabaseClient } from "./db"
import { getConstructionFileExtension, validateConstructionFile } from "./file-rules"

export const constructionFilesBucket = "construction-files"

function sanitizePathPart(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
}

export async function listConstructionProjectFiles(projectId: string) {
  const client = getConstructionSupabaseClient()

  if (!client.ok) {
    return { data: [] as ConstructionFileRecord[], error: client.error }
  }

  const { data, error } = await client.supabase
    .from("construction_files")
    .select("id,project_id,bucket,storage_path,original_filename,mime_type,size_bytes,uploaded_by,processing_status,checksum,metadata,created_at")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })

  if (error) {
    return { data: [] as ConstructionFileRecord[], error: { code: "SUPABASE_QUERY_FAILED", message: error.message } }
  }

  return { data: (data ?? []) as ConstructionFileRecord[], error: null }
}

export async function uploadConstructionProjectFile(projectId: string, file: File) {
  const validation = validateConstructionFile(file)

  if (!validation.ok) {
    return { data: null, error: validation.error }
  }

  const project = await getConstructionProject(projectId)

  if (project.error) {
    return { data: null, error: project.error }
  }

  const client = getConstructionSupabaseClient()

  if (!client.ok) {
    return { data: null, error: client.error }
  }

  const extension = getConstructionFileExtension(file.name)
  const safeName = sanitizePathPart(file.name.replace(/\.[^.]+$/, "")) || "ficheiro"
  const storagePath = `${projectId}/${Date.now()}-${crypto.randomUUID()}-${safeName}${extension ? `.${extension}` : ""}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const upload = await client.supabase.storage.from(constructionFilesBucket).upload(storagePath, buffer, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  })

  if (upload.error) {
    return { data: null, error: { code: "SUPABASE_STORAGE_FAILED", message: upload.error.message } }
  }

  const { data, error } = await client.supabase
    .from("construction_files")
    .insert({
      project_id: projectId,
      bucket: constructionFilesBucket,
      storage_path: storagePath,
      original_filename: file.name,
      mime_type: file.type || null,
      size_bytes: file.size,
      processing_status: "uploaded",
      metadata: {
        extension,
        source: "construction-upload-center",
      },
    })
    .select("id,project_id,bucket,storage_path,original_filename,mime_type,size_bytes,uploaded_by,processing_status,checksum,metadata,created_at")
    .single()

  if (error) {
    await client.supabase.storage.from(constructionFilesBucket).remove([storagePath])
    return { data: null, error: { code: "SUPABASE_INSERT_FAILED", message: error.message } }
  }

  return { data: data as ConstructionFileRecord, error: null }
}
