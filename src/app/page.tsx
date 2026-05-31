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
    <main className="bg-[#030712] min-h-screen overflow-x-hidden">
      <NavbarSection />
      <HeroSection />
      <SystemSection />
      <ProcessSection />
      <ResultsSection />
      <LeadFormSection />
      <FooterSection />
      <WhatsAppButton />
    </main>
  )
}
