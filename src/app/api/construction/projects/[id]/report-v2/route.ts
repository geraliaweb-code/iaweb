import { NextResponse } from "next/server"
import { generateConstructionExecutivePdfV2 } from "@/lib/construction/pdf-report-v2"
import { invalidConstructionProjectResponse, isValidConstructionProjectId } from "@/lib/construction/production"

export const runtime = "nodejs"

type ReportV2RouteContext = {
  params: Promise<{ id: string }>
}

export async function POST(_request: Request, context: ReportV2RouteContext) {
  const { id } = await context.params

  if (!isValidConstructionProjectId(id)) {
    return invalidConstructionProjectResponse()
  }

  const result = await generateConstructionExecutivePdfV2(id)

  if (result.blocked) {
    return NextResponse.json(result.blocked, { status: 402 })
  }

  if (result.error || !result.data) {
    return NextResponse.json(
      { error: result.error?.message ?? "Nao foi possivel gerar o PDF Executivo V2." },
      { status: result.error?.code === "NOT_FOUND" ? 404 : 500 },
    )
  }

  return new NextResponse(Buffer.from(result.data.bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${result.data.filename}"`,
      "X-Construction-Report-Version": "executive_v2",
      "X-Construction-Report-Id": result.data.report?.id ?? "",
      "X-Construction-Report-Warnings": result.data.warnings.join(" | "),
    },
  })
}
