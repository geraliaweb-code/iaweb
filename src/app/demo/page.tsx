import type { Metadata } from "next"
import DemoCommercialTool from "@/components/iaweb/DemoCommercialTool"

export const metadata: Metadata = {
  title: "Demo Comercial | IAWEB Growth Engine",
  description: "Ferramenta comercial presencial para analisar empresas, estimar perdas e recomendar planos IAWEB.",
}

export default function DemoPage() {
  return <DemoCommercialTool />
}
