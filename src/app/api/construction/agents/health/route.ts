import { NextResponse } from "next/server"
import { constructionAgentActivation, constructionAgentQualityGates } from "@/lib/construction/agent-network"

export async function GET() {
  return NextResponse.json({
    status: "ok",
    sprint: 45,
    automaticCyclesEnabled: false,
    activeAgents: constructionAgentActivation.filter((agent) => agent.status === "active").map((agent) => agent.code),
    standbyAgents: constructionAgentActivation.filter((agent) => agent.status === "standby").map((agent) => agent.code),
    qualityGates: constructionAgentQualityGates,
  })
}
