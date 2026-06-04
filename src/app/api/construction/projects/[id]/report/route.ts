import { NextResponse } from "next/server"
import { canRunAnalysis, recordConstructionUsageEvent } from "@/lib/construction/billing/usage"
import { generateConstructionExecutivePdf } from "@/lib/construction/pdf-report"
import { invalidConstructionProjectResponse, isValidConstructionProjectId } from "@/lib/construction/production"

export const runtime = "nodejs"

type ReportRouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(_request: Request, context: ReportRouteContext) {
  return generateReportResponse(context)
}

export async function POST(_request: Request, context: ReportRouteContext) {
  return generateReportResponse(context)
}

async function generateReportResponse(context: ReportRouteContext) {
  const { id } = await context.params

  if (!isValidConstructionProjectId(id)) {
    return invalidConstructionProjectResponse()
  }

  const billing = await canRunAnalysis(id)

  if (!billing.allowed) {
    return NextResponse.json({ error: billing.decision?.reason ?? billing.error?.message ?? "Limite de billing atingido." }, { status: 402 })
  }

  const { data, error } = await generateConstructionExecutivePdf(id)

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Nao foi possivel gerar o relatorio." }, { status: error?.code === "NOT_FOUND" ? 404 : 500 })
  }

  await recordConstructionUsageEvent(id, "generate_pdf")

  return new NextResponse(Buffer.from(data.bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${data.filename}"`,
      "X-Construction-Report-Id": data.report.id,
      "X-Construction-Report-Url": data.report.report_url ?? "",
    },
  })
}
