import type { Metadata } from "next"
import DiagnosticoDigital from "./DiagnosticoDigital"

export const metadata: Metadata = {
  title: "Diagnostico Digital Gratuito | IAWEB",
  description:
    "Receba uma analise gratuita da sua presenca digital com score de website, Google, conversao e automacao.",
}

export default function DiagnosticoPage() {
  return <DiagnosticoDigital />
}
