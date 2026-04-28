import ShopNav from "@/components/shop/ShopNav";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import About from "@/components/About";
import Journey from "@/components/Journey";
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
import { getProducts } from "@/lib/shopify";

export default async function HomePage() {
  const shopifyProducts = await getProducts({ first: 10 });
  
  const products = shopifyProducts.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    priceCents: p.priceCents,
    weightGrams: p.weightGrams,
    imageUrl: p.imageUrl,
    featured: p.featured,
  }));

  return (
    <>
      <ShopNav />
      <main id="top">
        <Hero />
        <Packaging products={products} />
        <TrustStrip />
        <About />
        <Journey />
        <FarmLocations />
        <OrchardStory />
        <QualitySection />
        <HarvestCalendar />
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
