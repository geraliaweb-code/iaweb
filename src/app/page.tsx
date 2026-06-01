import NavbarSection from "@/components/iaweb/NavbarSection"
import HeroSection from "@/components/iaweb/HeroSection"
import SystemSection from "@/components/iaweb/SystemSection"
import ProcessSection from "@/components/iaweb/ProcessSection"
import ResultsSection from "@/components/iaweb/ResultsSection"
import LeadFormSection from "@/components/iaweb/LeadFormSection"
import FooterSection from "@/components/iaweb/FooterSection"
import WhatsAppButton from "@/components/iaweb/WhatsAppButton"

export default function Home() {
  return (
    <main className="iaweb-cinematic-shell min-h-screen overflow-x-hidden">
      <div className="iaweb-cinematic-bg">
        <div className="iaweb-cinematic-grid" />
        <div className="iaweb-lightning top-[12%] left-[-12%]" />
        <div className="iaweb-lightning" />
        <div className="iaweb-lightning" />
        <div className="iaweb-lightning-field" />
      </div>
      <div className="relative z-10">
        <NavbarSection />
        <HeroSection />
        <SystemSection />
        <ProcessSection />
        <ResultsSection />
        <LeadFormSection />
        <FooterSection />
        <WhatsAppButton />
      </div>
    </main>
  )
}
