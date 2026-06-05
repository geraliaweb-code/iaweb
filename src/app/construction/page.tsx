import type { Metadata } from "next"
import InteractiveDemo from "@/components/construction/InteractiveDemo"
import ConstructionShell from "@/components/construction/ConstructionShell"
import ConstructionPlansSection from "@/components/construction/ConstructionPlansSection"
import {
  ConstructionElementLibrary,
  ConstructionCountrySelector,
  ConstructionEuropeanBlock,
  ConstructionHowItWorks,
  ConstructionLegalFooter,
  ConstructionScenarioSection,
  ConstructionTrustCenter,
  ConstructionUseCases,
  PremiumConstructionHero,
} from "@/components/construction/ConstructionMarketingSections"

export const metadata: Metadata = {
  title: "IAWEB Construction Intelligence | Plataforma Europeia",
  description: "Plataforma europeia de inteligencia documental para construcao em Portugal, Franca e Espanha.",
}

export default function ConstructionPage() {
  return (
    <ConstructionShell>
      <PremiumConstructionHero />
      <ConstructionCountrySelector />
      <ConstructionHowItWorks />
      <InteractiveDemo />
      <ConstructionElementLibrary />
      <div className="py-14">
        <ConstructionScenarioSection />
      </div>
      <ConstructionEuropeanBlock />
      <ConstructionPlansSection compact />
      <ConstructionUseCases />
      <ConstructionTrustCenter />
      <div className="py-10">
        <ConstructionLegalFooter />
      </div>
    </ConstructionShell>
  )
}
