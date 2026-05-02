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
import AdminDashboardOverlay from "@/components/AdminDashboardOverlay";
import { getProducts } from "@/lib/shopify";
import { auth } from "@/lib/auth";
import { getOrders, getOrderStats } from "@/lib/shopify-admin";

export default async function HomePage() {
  const [shopifyProducts, session] = await Promise.all([
    getProducts({ first: 10 }),
    auth(),
  ]);

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

  const isAdmin = session?.user?.isAdmin === true;

  let adminData: {
    stats: { totalOrders: number; unfulfilled: number; totalRevenue: number; currency: string };
    recentOrders: Array<{
      id: string;
      name: string;
      orderNumber: number;
      customerName: string;
      total: string;
      currency: string;
      fulfillmentStatus: string;
    }>;
  } | null = null;

  if (isAdmin) {
    try {
      const [orders, stats] = await Promise.all([
        getOrders({ first: 5 }),
        getOrderStats(),
      ]);
      adminData = { stats, recentOrders: orders };
    } catch (error) {
      console.error("[HomePage] Failed to fetch admin data:", error);
    }
  }

  return (
    <>
      <ShopNav />
      <main id="top">
        <Hero />
        {isAdmin && adminData && (
          <AdminDashboardOverlay
            stats={adminData.stats}
            recentOrders={adminData.recentOrders}
            userName={session?.user?.name}
            shopifyDomain={process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}
          />
        )}
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
