import { NextResponse } from "next/server"
import {
  analyzeConstructionProjectDocuments,
  listConstructionDetectedDocuments,
} from "@/lib/construction/document-intelligence"
import { canRunAnalysis, recordConstructionUsageEvent } from "@/lib/construction/billing/usage"
import { invalidConstructionProjectResponse, isValidConstructionProjectId } from "@/lib/construction/production"

export const runtime = "nodejs"

type AnalyzeRouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(_request: Request, context: AnalyzeRouteContext) {
  const { id } = await context.params

  if (!isValidConstructionProjectId(id)) {
    return invalidConstructionProjectResponse()
  }

  const { data, error } = await listConstructionDetectedDocuments(id)

  if (error) {
    return NextResponse.json({ documents: data, error: error.message }, { status: error.code === "SUPABASE_NOT_CONFIGURED" ? 200 : 500 })
  }

  return NextResponse.json({ documents: data })
}

export async function POST(_request: Request, context: AnalyzeRouteContext) {
  const { id } = await context.params

  if (!isValidConstructionProjectId(id)) {
    return invalidConstructionProjectResponse()
  }

  const billing = await canRunAnalysis(id)

  if (!billing.allowed) {
    return NextResponse.json({ documents: [], error: billing.decision?.reason ?? billing.error?.message ?? "Limite de billing atingido." }, { status: 402 })
  }

  const { data, error } = await analyzeConstructionProjectDocuments(id)

  if (error) {
    return NextResponse.json({ documents: data, error: error.message }, { status: error.code === "NOT_FOUND" ? 404 : 500 })
  }

  await recordConstructionUsageEvent(id, "analyze_documents")

  return NextResponse.json({ documents: data })
}
