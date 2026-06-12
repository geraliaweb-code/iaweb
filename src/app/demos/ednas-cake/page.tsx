import type { Metadata } from "next"
import EdnasCakeHome from "./EdnasCakeHome"

export const metadata: Metadata = {
  title: "Edna's Cake — Bolos, Doces e Salgados Artesanais | Barcelos",
  description:
    "Bolos personalizados, doces artesanais, salgados e catering em Arcozelo, Barcelos. O sabor que abraça. Encomende pelo WhatsApp. ⭐ 4,9 no Google.",
  openGraph: {
    title: "Edna's Cake — O sabor que abraça | Barcelos",
    description:
      "Bolos personalizados, coxinhas, doces de festa e catering para os seus momentos especiais em Barcelos.",
    type: "website",
    locale: "pt_PT",
  },
}

export default function EdnasCakeDemoPage() {
  return <EdnasCakeHome />
}
