import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts, getAllProductSlugs } from "@/lib/shopify";
import { DELIVERY_INFO, formatINR, formatGradeWeightDisplay } from "@/lib/money";
import ShopNav from "@/components/shop/ShopNav";
import AddToCartForm from "@/components/shop/AddToCartForm";
import ProductGallery from "@/components/shop/ProductGallery";
import { env } from "@/lib/env";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const slugs = await getAllProductSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found — Aamrit" };

  return {
    title: `${product.name} — Aamrit Premium Mangoes`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      ...(product.imageUrl ? { images: [product.imageUrl] } : {}),
    },
  };
}

const gradeFeatures: Record<string, { tagline: string; highlights: string[]; color: string }> = {
  A1: {
    tagline: "The Crown Jewel",
    highlights: [
      "Largest size (250-350g each)",
      "Perfect golden-saffron color",
      "Exceptional sweetness (22+ Brix)",
      "Gift-worthy presentation",
      "Hand-selected premium pieces",
    ],
    color: "from-amber-500 to-yellow-500",
  },
  A2: {
    tagline: "Premium Excellence",
    highlights: [
      "Large size (200-250g each)",
      "Rich golden color",
      "Excellent sweetness (20+ Brix)",
      "Perfect for family enjoyment",
      "Superior quality selection",
    ],
    color: "from-gold-500 to-gold-400",
  },
  A3: {
    tagline: "Classic Goodness",
    highlights: [
      "Standard size (150-200g each)",
      "Beautiful golden hue",
      "Great sweetness (18+ Brix)",
      "Excellent value for money",
      "Quality-assured selection",
    ],
    color: "from-gold-400 to-amber-400",
  },
};

const defaultFeatures = [
  "Naturally tree-ripened",
  "No artificial chemicals",
  "Farm-fresh delivery",
  "GI certified Ratnagiri",
  "Sustainably grown",
];

function toPlainProductDescription(htmlOrText: string): string {
  if (!htmlOrText?.trim()) return "";
  return htmlOrText
    .replace(/<\/p\s*>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/\u00a0/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Break long storefront copy into scannable paragraphs. */
function splitAboutParagraphs(plain: string): string[] {
  const trimmed = plain.trim();
  if (!trimmed) return [];

  const blocks = trimmed.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  if (blocks.length >= 2) return blocks;

  const text = blocks[0] ?? trimmed;
  if (text.length < 360) return [text];

  const sentences =
    text.match(/[^.!?…]*[.!?…]+(?:\s|$)|[^.!?…]+$/g)?.map((s) => s.trim()).filter(Boolean) ?? [text];
  if (sentences.length < 4) return [text];

  const nPara = Math.min(4, Math.ceil(sentences.length / 3));
  const per = Math.ceil(sentences.length / nPara);
  const out: string[] = [];
  for (let i = 0; i < sentences.length; i += per) {
    out.push(sentences.slice(i, i + per).join(" "));
  }
  return out;
}

function getDefaultAboutParagraphs(grade: string | null): string[] {
  const g = grade?.toUpperCase() ?? "";
  const gradeHeart =
    g === "A1"
      ? "Grade A1 is crown-jewel fruit: voluptuous mango picked for symmetrical curves, a coral blush sweeping the shoulder, and a lustre photographers chase before anyone takes a bite."
      : g === "A2"
      ? "Grade A2 balances generosity and purity of flavour—the household favourite: roomy fruit, nectar that ribbons down your chin, and aroma that politely announces itself across the dining room."
      : g === "A3"
      ? "Grade A3 keeps Alphonso’s soul in a petite frame—ideal diced over yoghurt, folded into shakes and kulfi, or eaten from the chopping board between meetings."
      : "Across our Maharashtra orchards inside the GI-tagged corridor, trees are coached by instincts earned over generations—fruit is chosen when the cheek softens naturally, never when a calendar insists.";

  return [
    "Ratnagiri Alphonso is the mango other varieties borrow adjectives from: fibre-free custard flesh, satin sheen beneath the peel, perfume that escapes the rim of the crate before you lift the lid.",
    gradeHeart,
    "Ripening honours the Konkan way—fruits nested in breathable straw till their shoulders blush evenly. No calcium carbide, no hurried gas regimes—only airflow, neighbours lending ethylene shade to neighbours.",
    "We box while the orchard’s breath still clings—harvest sorted at dawn when shoulders yield, cushioned immediately, dispatched so sweetness and salt air meet your doorway in the same week they left the grove.",
  ];
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || !product.active) notFound();

  const related = await getRelatedProducts(product.id, product.categoryId, 3);

  const ldjson = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: [product.imageUrl, ...product.gallery],
    sku: product.id,
    brand: { "@type": "Brand", name: "Aamrit" },
    offers: {
      "@type": "Offer",
      price: (product.priceCents / 100).toFixed(2),
      priceCurrency: "INR",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `${env.appUrl}/shop/${product.slug}`,
    },
  };

  const gradeMatch = product.name.match(/Grade\s*(A\d)/i);
  const grade = gradeMatch ? gradeMatch[1].toUpperCase() : null;
  const gradeInfo = grade ? gradeFeatures[grade] : null;
  const features = gradeInfo?.highlights || defaultFeatures;

  const plainDescription = toPlainProductDescription(product.description);
  const fromStoreAbout = splitAboutParagraphs(plainDescription);
  const aboutParagraphs =
    fromStoreAbout.length > 0 ? fromStoreAbout : getDefaultAboutParagraphs(grade);

  return (
    <>
      <ShopNav />
      <main className="min-h-screen bg-gradient-to-b from-cream-50 via-white to-cream-50 pb-20">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ldjson) }}
        />
        
        {/* Hero background with animated gradient */}
        <div className="absolute top-0 left-0 right-0 h-[600px] overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-gold-50/60 via-transparent to-leaf/5" />
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gold-200/30 rounded-full blur-3xl" />
          <div className="absolute top-20 -left-20 w-72 h-72 bg-leaf/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link href="/" className="text-charcoal/50 hover:text-charcoal transition-colors">
              Home
            </Link>
            <svg className="w-4 h-4 text-charcoal/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/shop" className="text-charcoal/50 hover:text-charcoal transition-colors">
              Shop
            </Link>
            <svg className="w-4 h-4 text-charcoal/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-charcoal font-medium truncate">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Gallery */}
            <div className="lg:sticky lg:top-8 lg:self-start">
              <ProductGallery
                mainImage={product.imageUrl}
                gallery={product.gallery}
                productName={product.name}
              />
              
              {/* Certification badges below gallery */}
              <div className="mt-6 flex items-center justify-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-cream-100">
                  <svg className="w-5 h-5 text-leaf" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-xs font-semibold text-charcoal/70">GI Certified</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-cream-100">
                  <svg className="w-5 h-5 text-leaf" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <span className="text-xs font-semibold text-charcoal/70">100% Natural</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-cream-100">
                  <svg className="w-5 h-5 text-leaf" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs font-semibold text-charcoal/70">{DELIVERY_INFO.shortText}</span>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="lg:py-4">
              {/* Badge row */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {grade && gradeInfo && (
                  <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r ${gradeInfo.color} text-white text-sm font-bold tracking-wider shadow-lg`}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {grade} · {gradeInfo.tagline}
                  </span>
                )}
                {product.variety && (
                  <span className="px-3 py-1.5 rounded-full bg-leaf/10 text-leaf-700 text-xs font-semibold tracking-wide uppercase">
                    {product.variety}
                  </span>
                )}
                {product.stock > 0 && product.stock <= 10 && (
                  <span className="px-3 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-bold animate-pulse flex items-center gap-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                    Only {product.stock} left!
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-charcoal leading-tight mb-3">
                {product.name}
              </h1>
              
              {/* Tagline */}
              <p className="text-lg text-charcoal/60 mb-6">
                Authentic Ratnagiri Alphonso · Naturally Ripened · Premium Quality
              </p>

              {/* Rating & Social proof */}
              <div className="flex items-center gap-4 mb-8 flex-wrap">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gold-50 rounded-full">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gold-700">5.0</span>
                </div>
                <span className="text-sm text-charcoal/50">|</span>
                <span className="text-sm text-charcoal/60 flex items-center gap-1">
                  <svg className="w-4 h-4 text-leaf" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  500+ happy customers
                </span>
                <span className="text-sm text-charcoal/50">|</span>
                <span className="text-sm text-charcoal/60 flex items-center gap-1">
                  <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                  Season 2026
                </span>
              </div>

              {/* Price card - Premium design */}
              <div className="relative bg-gradient-to-br from-white via-cream-50/50 to-gold-50/30 rounded-3xl p-6 shadow-e2 border border-cream-100 mb-6 overflow-hidden">
                {/* Decorative element */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gold-200/20 rounded-full blur-2xl" />
                
                <div className="relative">
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                      <p className="text-xs text-charcoal/50 uppercase tracking-widest mb-2 font-medium">Price per dozen (12 mangoes)</p>
                      <div className="flex items-baseline gap-3">
                        <span className="font-serif text-5xl font-bold text-charcoal">
                          {formatINR(product.priceCents)}
                        </span>
                        <span className="text-charcoal/40 text-lg line-through">
                          {formatINR(Math.round(product.priceCents * 1.15))}
                        </span>
                      </div>
                      <p className="text-sm text-charcoal/50 mt-1">
                        That&apos;s just {formatINR(Math.round(product.priceCents / 12))} per mango!
                      </p>
                    </div>
                    <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-leaf to-leaf-600 text-white text-sm font-bold shadow-lg">
                      Save 15%
                    </div>
                  </div>
                  
                  {/* Quick specs */}
                  <div className="grid grid-cols-3 gap-3 pt-5 border-t border-cream-200/50">
                    <div className="text-center p-3 rounded-xl bg-white/60">
                      <svg className="w-5 h-5 text-gold mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                      </svg>
                      <p className="text-xs text-charcoal/60">Weight</p>
                      <p className="font-semibold text-charcoal text-sm">
                        {formatGradeWeightDisplay(grade, product.weightGrams)}
                      </p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-white/60">
                      <svg className="w-5 h-5 text-gold mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <p className="text-xs text-charcoal/60">Quantity</p>
                      <p className="font-semibold text-charcoal text-sm">12 per box</p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-white/60">
                      <svg className="w-5 h-5 text-gold mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-xs text-charcoal/60">Delivery</p>
                      <p className="font-semibold text-charcoal text-sm leading-snug">
                        MH {DELIVERY_INFO.maharashtra.days} · Others {DELIVERY_INFO.otherStates.days} days
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add to cart */}
              <AddToCartForm productId={product.id} stock={product.stock} />

              {/* Product Features / Highlights */}
              <div className="mt-8 p-6 rounded-3xl bg-gradient-to-br from-gold-50/50 to-cream-50 border border-gold-100/50">
                <h3 className="font-serif text-xl text-charcoal mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {grade ? `${grade} Grade Highlights` : "Product Highlights"}
                </h3>
                <ul className="space-y-3">
                  {features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-charcoal/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trust badges - Enhanced */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="group flex flex-col items-center text-center p-4 rounded-2xl bg-white border border-cream-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                  <div className="w-12 h-12 rounded-full bg-leaf/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-leaf" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                  <span className="text-sm text-charcoal font-semibold">Free Delivery</span>
                  <span className="text-[11px] text-charcoal/50">MH 4-5 days · Others 8-9 days</span>
                </div>
                <div className="group flex flex-col items-center text-center p-4 rounded-2xl bg-white border border-cream-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                  <div className="w-12 h-12 rounded-full bg-leaf/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-leaf" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <span className="text-sm text-charcoal font-semibold">100% Authentic</span>
                  <span className="text-[11px] text-charcoal/50">GI Tagged Ratnagiri</span>
                </div>
              </div>

              {/* Description - Enhanced with tabs-like sections */}
              <div className="mt-10 space-y-6">
                {/* About Section */}
                <div className="relative overflow-hidden rounded-[1.65rem] border border-gold-200/40 bg-gradient-to-br from-white via-cream-50/50 to-gold-50/40 p-7 sm:p-9 shadow-[0_24px_50px_-32px_rgba(46,125,80,0.15)]">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-gold-300/25 blur-3xl"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-16 -left-12 h-44 w-44 rounded-full bg-leaf/15 blur-3xl"
                  />
                  <div className="relative">
                    <div className="mb-5 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full border border-gold-200/60 bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-saffron/90 shadow-sm">
                        Story of the fruit
                      </span>
                      {grade && (
                        <span className="inline-flex items-center rounded-full bg-gradient-to-r from-gold-500/90 to-amber-500/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                          {grade} · Konkan
                        </span>
                      )}
                    </div>
                    <h2 className="font-serif text-2xl sm:text-[1.65rem] leading-tight text-charcoal">
                      About This Mango
                    </h2>
                    {fromStoreAbout.length === 0 && (
                      <p className="mt-2 max-w-prose text-sm leading-relaxed text-charcoal/55">
                        Grown where the Sahyadri leans toward the Arabian Sea—where laterite soil and saline breeze teach every tree how to fold sunshine into juice.
                      </p>
                    )}
                    <div className="mt-6 space-y-5 border-l-2 border-gold-300/60 pl-5 sm:pl-6">
                      {aboutParagraphs.map((para, idx) => (
                        <p
                          key={idx}
                          className={
                            idx === 0
                              ? "font-serif text-[1.05rem] leading-[1.65] text-charcoal sm:text-lg"
                              : "text-[0.9375rem] leading-relaxed text-charcoal/78 sm:text-[15px]"
                          }
                        >
                          {para}
                        </p>
                      ))}
                    </div>
                    <dl className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl border border-white/70 bg-white/60 px-4 py-3 text-center backdrop-blur-sm shadow-sm">
                        <dt className="text-[10px] font-semibold uppercase tracking-wider text-charcoal/45">
                          Ripening
                        </dt>
                        <dd className="mt-1 font-medium text-charcoal/85">Straw-lined &amp; natural</dd>
                      </div>
                      <div className="rounded-2xl border border-white/70 bg-white/60 px-4 py-3 text-center backdrop-blur-sm shadow-sm">
                        <dt className="text-[10px] font-semibold uppercase tracking-wider text-charcoal/45">
                          Traceability
                        </dt>
                        <dd className="mt-1 font-medium text-charcoal/85">Farm lot to your door</dd>
                      </div>
                      <div className="rounded-2xl border border-white/70 bg-white/60 px-4 py-3 text-center backdrop-blur-sm shadow-sm">
                        <dt className="text-[10px] font-semibold uppercase tracking-wider text-charcoal/45">
                          Promise
                        </dt>
                        <dd className="mt-1 font-medium text-charcoal/85">No carbide shortcuts</dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* Origin Story */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-cream-50 to-white border border-cream-100 shadow-sm">
                  <h2 className="font-serif text-xl text-charcoal mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-leaf/10 flex items-center justify-center">
                      <svg className="w-4 h-4 text-leaf" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    From Our Orchards to You
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 rounded-full bg-gold-100 flex items-center justify-center flex-shrink-0 text-gold-700 font-bold text-sm">1</span>
                      <div>
                        <p className="font-medium text-charcoal text-sm">Hand-Picked</p>
                        <p className="text-xs text-charcoal/60">Selected at perfect ripeness</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 rounded-full bg-gold-100 flex items-center justify-center flex-shrink-0 text-gold-700 font-bold text-sm">2</span>
                      <div>
                        <p className="font-medium text-charcoal text-sm">Quality Check</p>
                        <p className="text-xs text-charcoal/60">Multi-point inspection</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 rounded-full bg-gold-100 flex items-center justify-center flex-shrink-0 text-gold-700 font-bold text-sm">3</span>
                      <div>
                        <p className="font-medium text-charcoal text-sm">Careful Packing</p>
                        <p className="text-xs text-charcoal/60">Cushioned for safe transit</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 rounded-full bg-gold-100 flex items-center justify-center flex-shrink-0 text-gold-700 font-bold text-sm">4</span>
                      <div>
                        <p className="font-medium text-charcoal text-sm">Express Delivery</p>
                        <p className="text-xs text-charcoal/60">Cold-chain onward to your PIN</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                {product.benefits && (
                  <div className="p-6 rounded-3xl bg-gradient-to-br from-leaf/5 to-leaf/10 border border-leaf/20">
                    <h3 className="font-serif text-xl text-charcoal mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-leaf/20 flex items-center justify-center">
                        <svg className="w-4 h-4 text-leaf" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      Health Benefits
                    </h3>
                    <p className="text-charcoal/70 leading-relaxed">{product.benefits}</p>
                  </div>
                )}

                {/* Nutrition */}
                {product.nutrition && (
                  <div className="p-6 rounded-3xl bg-gradient-to-br from-gold-50 to-gold-100/50 border border-gold/20">
                    <h3 className="font-serif text-xl text-charcoal mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gold-200 flex items-center justify-center">
                        <svg className="w-4 h-4 text-gold-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                      </div>
                      Nutritional Info
                    </h3>
                    <p className="text-charcoal/70 leading-relaxed">{product.nutrition}</p>
                  </div>
                )}

                {/* Storage Tips */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-50/50 to-orange-50/30 border border-amber-100/50">
                  <h3 className="font-serif text-xl text-charcoal mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    Storage Tips
                  </h3>
                  <ul className="space-y-2 text-sm text-charcoal/70">
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Store at room temperature until ripe (2-3 days)
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Refrigerate only after ripening to extend freshness
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Best consumed within 5-7 days of delivery
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products - Enhanced */}
          {related.length > 0 && (
            <section className="mt-24">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-100 text-gold-700 text-sm font-semibold mb-3">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                    </svg>
                    More Choices
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-charcoal">You may also like</h2>
                </div>
                <Link 
                  href="/shop" 
                  className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-charcoal text-white text-sm font-semibold hover:bg-charcoal/90 transition-colors shadow-lg"
                >
                  View all products
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((r) => {
                  const relatedGrade = r.name.match(/Grade\s*(A\d)/i)?.[1]?.toUpperCase();
                  const relatedGradeInfo = relatedGrade ? gradeFeatures[relatedGrade] : null;
                  return (
                    <Link
                      key={r.id}
                      href={`/shop/${r.slug}`}
                      className="group bg-white rounded-3xl shadow-e1 hover:shadow-e3 transition-all duration-300 overflow-hidden hover:-translate-y-1 border border-cream-100/50"
                    >
                      <div className="relative aspect-square bg-gradient-to-br from-cream-50 to-cream-100 overflow-hidden">
                        {r.imageUrl ? (
                          <Image 
                            src={r.imageUrl} 
                            alt={r.name} 
                            fill 
                            sizes="33vw" 
                            className="object-cover transition-transform duration-500 group-hover:scale-105" 
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-charcoal/20">
                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        {/* Grade badge on related products */}
                        {relatedGrade && relatedGradeInfo && (
                          <div className="absolute top-4 left-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r ${relatedGradeInfo.color} text-white text-xs font-bold shadow-lg`}>
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              {relatedGrade}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <p className="text-xs text-leaf font-semibold uppercase tracking-wider">{r.variety}</p>
                        <h3 className="font-serif text-xl text-charcoal mt-1 group-hover:text-gold-700 transition-colors">{r.name}</h3>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-cream-100">
                          <div>
                            <p className="text-xs text-charcoal/50">Per dozen</p>
                            <p className="text-xl font-bold text-charcoal">{formatINR(r.priceCents)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-charcoal/50">Weight</p>
                            <p className="text-sm font-medium text-charcoal/70">
                              {formatGradeWeightDisplay(relatedGrade ?? null, r.weightGrams)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
              
              {/* Mobile view all link */}
              <div className="mt-8 sm:hidden text-center">
                <Link 
                  href="/shop" 
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-charcoal text-white font-semibold hover:bg-charcoal/90 transition-colors shadow-lg"
                >
                  View all products
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </section>
          )}
          
          {/* Bottom CTA Section */}
          <section className="mt-24 mb-8">
            <div className="relative rounded-3xl bg-gradient-to-r from-gold-500 via-gold-400 to-amber-400 p-8 sm:p-12 overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
              
              <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-center sm:text-left">
                  <h2 className="font-serif text-2xl sm:text-3xl text-white mb-2">
                    Have questions about our mangoes?
                  </h2>
                  <p className="text-white/80">
                    We&apos;re here to help! Reach out to us on WhatsApp for instant support.
                  </p>
                </div>
                <a 
                  href="https://wa.me/919876543210?text=Hi%2C%20I%20have%20a%20question%20about%20your%20mangoes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-8 py-4 bg-white text-charcoal font-bold rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                >
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Chat with us
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
