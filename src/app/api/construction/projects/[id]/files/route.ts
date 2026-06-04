import { NextResponse } from "next/server"
import { invalidConstructionProjectResponse, isValidConstructionProjectId } from "@/lib/construction/production"
import { listConstructionProjectFiles, uploadConstructionProjectFile } from "@/lib/construction/storage"

export const runtime = "nodejs"

type FilesRouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(_request: Request, context: FilesRouteContext) {
  const { id } = await context.params

  if (!isValidConstructionProjectId(id)) {
    return invalidConstructionProjectResponse()
  }

  const { data, error } = await listConstructionProjectFiles(id)

  if (error) {
    return NextResponse.json({ files: data, error: error.message }, { status: error.code === "SUPABASE_NOT_CONFIGURED" ? 200 : 500 })
  }

  return NextResponse.json({ files: data })
}

export async function POST(request: Request, context: FilesRouteContext) {
  const { id } = await context.params

  if (!isValidConstructionProjectId(id)) {
    return invalidConstructionProjectResponse()
  }

  const formData = await request.formData().catch(() => null)

  if (!formData) {
    return NextResponse.json({ error: "Pedido de upload invalido." }, { status: 400 })
  }

  const files = formData.getAll("files").filter((value): value is File => value instanceof File)

  if (!files.length) {
    return NextResponse.json({ error: "Seleciona pelo menos um ficheiro." }, { status: 400 })
  }

  const uploaded = []

  for (const file of files) {
    const result = await uploadConstructionProjectFile(id, file)

    if (result.error) {
      return NextResponse.json(
        {
          files: uploaded,
          error: result.error.message,
        },
        { status: result.error.code === "VALIDATION_FAILED" ? 400 : 500 },
      )
    }

    uploaded.push(result.data)
  }

  return NextResponse.json({ files: uploaded }, { status: 201 })
}
