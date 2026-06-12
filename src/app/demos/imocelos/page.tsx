import type { Metadata } from "next"
import ImocelosHome from "./ImocelosHome"

export const metadata: Metadata = {
  title: "Imocelos — Mediação Imobiliária | Barcelos e Região",
  description:
    "Especialistas em compra, venda, arrendamento e investimento imobiliário em Barcelos, Braga, Esposende e Famalicão. Avaliação gratuita do seu imóvel em 24h.",
}

export default function ImocelosDemoPage() {
  return <ImocelosHome />
}
