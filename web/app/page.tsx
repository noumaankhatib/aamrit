import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import About from "@/components/About";
import Journey from "@/components/Journey";
import MangoVarieties from "@/components/MangoVarieties";
import FarmLocations from "@/components/FarmLocations";
import OrchardStory from "@/components/OrchardStory";
import QualitySection from "@/components/QualitySection";
import HarvestCalendar from "@/components/HarvestCalendar";
import Packaging from "@/components/Packaging";
import Testimonials from "@/components/Testimonials";
import Brands from "@/components/Brands";
import B2BSection from "@/components/B2BSection";
import FAQ from "@/components/FAQ";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="top">
        <Hero />
        <TrustStrip />
        <About />
        <Journey />
        <MangoVarieties />
        <FarmLocations />
        <OrchardStory />
        <QualitySection />
        <HarvestCalendar />
        <Packaging />
        <Testimonials />
        <Brands />
        <B2BSection />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
