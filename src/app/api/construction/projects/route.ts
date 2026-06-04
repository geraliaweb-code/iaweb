import { NextResponse } from "next/server"
import {
  createConstructionProject,
  listConstructionProjects,
  validateConstructionProjectInput,
} from "@/lib/construction/db"

export async function GET() {
  const { data, error } = await listConstructionProjects(100)

  if (error) {
    return NextResponse.json({ projects: data, error: error.message }, { status: error.code === "SUPABASE_NOT_CONFIGURED" ? 200 : 500 })
  }

  return NextResponse.json({ projects: data })
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>
  const validation = validateConstructionProjectInput(body)

  if (!validation.ok) {
    return NextResponse.json({ error: validation.error.message }, { status: 400 })
  }

  const { data, error } = await createConstructionProject(validation.data)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.code === "SUPABASE_NOT_CONFIGURED" ? 503 : 500 })
  }

  return NextResponse.json({ project: data }, { status: 201 })
}
