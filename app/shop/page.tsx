import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getProducts, getCategories } from "@/lib/shopify";
import { formatINR, formatGradeWeightDisplay } from "@/lib/money";
import ShopNav from "@/components/shop/ShopNav";

export const metadata: Metadata = {
  title: "Shop — Premium Mangoes | Aamrit",
  description:
    "Shop Alphonso, Kesar and other premium mangoes — pure, naturally ripened, from our owned orchards.",
};

export const revalidate = 60;

function getGradeFromName(name: string): string | null {
  const match = name.match(/Grade\s*(A\d)/i);
  return match ? match[1].toUpperCase() : null;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const params = await searchParams;
  const categoryFilter = params.category;
  const q = params.q?.trim();

  const [products, categories] = await Promise.all([
    getProducts({
      categorySlug: categoryFilter,
      searchQuery: q,
    }),
    getCategories(),
  ]);

  return (
    <>
      <ShopNav />
      <main className="min-h-screen bg-gradient-to-b from-cream-50 via-white to-cream-50 pb-24">
        {/* Hero background */}
        <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-br from-gold-50/60 via-transparent to-leaf/5 pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16">
          {/* Header */}
          <header className="mb-12 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-100/80 border border-gold-200/50 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-leaf animate-ping opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-leaf" />
              </span>
              <span className="text-sm font-medium text-gold-700">Now in season · April – June</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-charcoal leading-tight">
              Hand-picked mangoes,{" "}
              <span className="grad-text-static">straight from the tree</span>
            </h1>
            <p className="mt-5 text-charcoal/70 text-lg leading-relaxed">
              Naturally ripened on our multi-generational family orchards across Ratnagiri
              & Raigad. No artificial ripening. No middlemen. Delivered fresh — free across India (Maharashtra typically 4–5 days; other states 8–9 days).
            </p>
          </header>

          {/* Grade Guide */}
          <div className="mb-12 p-6 sm:p-8 bg-gradient-to-br from-gold-50 to-cream-50 rounded-3xl border border-gold-100/50">
            <div className="text-center mb-6">
              <h2 className="font-serif text-2xl sm:text-3xl text-charcoal mb-2">Understanding Mango Grades</h2>
              <p className="text-charcoal/60 text-sm sm:text-base">Choose the perfect grade for your needs</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 items-stretch">
              <Link
                href={`/shop?q=${encodeURIComponent("Grade A1")}`}
                className="group/grade relative flex h-full flex-col overflow-hidden rounded-2xl border border-gold-200/50 bg-white p-5 shadow-sm transition-all duration-200 hover:border-gold-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/80 focus-visible:ring-offset-2"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gold-400/20 to-transparent rounded-bl-full" />
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-gold-400 to-gold-500 text-white font-bold text-lg shadow-lg shadow-gold/30">
                    A1
                  </span>
                  <div>
                    <h3 className="font-bold text-charcoal">Premium</h3>
                    <p className="text-xs text-gold-600 font-medium">Best for Gifting</p>
                  </div>
                </div>
                <ul className="space-y-1.5 text-sm text-charcoal/70">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gold-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    <span>Largest size (250-305g)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gold-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    <span>Perfect shape & color</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gold-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    <span>Show-piece quality</span>
                  </li>
                </ul>
              </Link>

              <Link
                href={`/shop?q=${encodeURIComponent("Grade A2")}`}
                className="group/grade relative flex h-full flex-col overflow-hidden rounded-2xl border border-cream-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-saffron/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron/60 focus-visible:ring-offset-2"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-saffron/20 to-transparent rounded-bl-full" />
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-saffron to-gold-500 text-white font-bold text-lg shadow-lg shadow-saffron/30">
                    A2
                  </span>
                  <div>
                    <h3 className="font-bold text-charcoal">Classic</h3>
                    <p className="text-xs text-saffron font-medium">Family Favourite</p>
                  </div>
                </div>
                <ul className="space-y-1.5 text-sm text-charcoal/70">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-saffron flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    <span>Medium size (200-250g)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-saffron flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    <span>Great taste & sweetness</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-saffron flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    <span>Best value for money</span>
                  </li>
                </ul>
              </Link>

              <Link
                href={`/shop?q=${encodeURIComponent("Grade A3")}`}
                className="group/grade relative flex h-full flex-col overflow-hidden rounded-2xl border border-cream-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-leaf/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf/50 focus-visible:ring-offset-2"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-leaf/20 to-transparent rounded-bl-full" />
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-leaf to-leaf-600 text-white font-bold text-lg shadow-lg shadow-leaf/30">
                    A3
                  </span>
                  <div>
                    <h3 className="font-bold text-charcoal">Budget</h3>
                    <p className="text-xs text-leaf font-medium">Great for Cooking</p>
                  </div>
                </div>
                <ul className="space-y-1.5 text-sm text-charcoal/70">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-leaf flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    <span>Smaller size (150-200g)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-leaf flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    <span>Same authentic taste</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-leaf flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    <span>Perfect for smoothies</span>
                  </li>
                </ul>
              </Link>
            </div>
          </div>

          {/* Category filters */}
          <nav className="flex gap-2 flex-wrap justify-center mb-12">
            <Link
              href="/shop"
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                !categoryFilter
                  ? "bg-gradient-to-r from-gold-400 to-gold-500 text-white shadow-lg shadow-gold/25"
                  : "bg-white text-charcoal hover:bg-cream-100 border border-cream-200"
              }`}
            >
              All Products
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/shop?category=${c.slug}`}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  categoryFilter === c.slug
                    ? "bg-gradient-to-r from-gold-400 to-gold-500 text-white shadow-lg shadow-gold/25"
                    : "bg-white text-charcoal hover:bg-cream-100 border border-cream-200"
                }`}
              >
                {c.name}
              </Link>
            ))}
          </nav>

          {/* Products grid */}
          {products.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl shadow-e1 border border-cream-100">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-cream-100 flex items-center justify-center">
                <svg className="w-10 h-10 text-charcoal/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h2 className="font-serif text-2xl text-charcoal mb-2">No products yet</h2>
              <p className="text-charcoal/60">
                Check back soon for our seasonal offerings.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((p) => {
                const grade = getGradeFromName(p.name);
                return (
                  <Link
                    key={p.id}
                    href={`/shop/${p.slug}`}
                    className="group flex flex-col h-full rounded-3xl bg-white shadow-e1 hover:shadow-e3 transition-all duration-300 overflow-hidden hover:-translate-y-1 border border-cream-100/50 outline-none focus-visible:ring-2 focus-visible:ring-gold-400/80 focus-visible:ring-offset-2"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] shrink-0 bg-gradient-to-br from-cream-50 to-cream-100 overflow-hidden">
                      {p.imageUrl ? (
                        <Image
                          src={p.imageUrl}
                          alt={p.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="pointer-events-none object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="w-20 h-20 text-charcoal/15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      
                      {/* Gradient overlay */}
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                      />

                      {/* Badges */}
                      <div className="pointer-events-none absolute top-4 left-4 flex flex-wrap gap-2">
                        {grade && (
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-sm font-bold shadow-lg ${
                            grade === "A1" 
                              ? "bg-gradient-to-r from-gold-400 to-gold-500 shadow-gold/40" 
                              : grade === "A2" 
                              ? "bg-gradient-to-r from-saffron to-gold-500 shadow-saffron/40" 
                              : "bg-gradient-to-r from-leaf to-leaf-600 shadow-leaf/40"
                          }`}>
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Grade {grade}
                          </span>
                        )}
                        {p.featured && (
                          <span className="px-3 py-1.5 rounded-xl bg-charcoal/90 backdrop-blur-sm text-white text-xs font-bold shadow-lg">
                            Featured
                          </span>
                        )}
                      </div>
                      
                      {/* Quick view hint — decorative; whole card remains the link */}
                      <div className="pointer-events-none absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/95 backdrop-blur-sm text-charcoal text-sm font-semibold shadow-lg">
                          View Details
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex min-h-0 flex-1 flex-col p-6">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          {p.variety && (
                            <p className="text-xs text-leaf font-semibold uppercase tracking-wider mb-1">
                              {p.variety}
                            </p>
                          )}
                          <h2 className="font-serif text-xl text-charcoal group-hover:text-gold-600 transition-colors leading-snug">
                            {p.name}
                          </h2>
                        </div>
                      </div>
                      
                      <p className="mb-4 line-clamp-2 flex-1 text-sm text-charcoal/60">
                        {p.description || "Premium quality Alphonso mangoes, naturally ripened and hand-picked."}
                      </p>
                      
                      <div className="flex items-end justify-between pt-4 border-t border-cream-100">
                        <div>
                          <p className="text-xs text-charcoal/50 mb-0.5">Per dozen</p>
                          <p className="font-serif text-2xl font-bold text-charcoal">
                            {formatINR(p.priceCents)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-charcoal/50 mb-0.5">Weight</p>
                          <p className="text-sm font-medium text-charcoal/70">
                            {formatGradeWeightDisplay(grade, p.weightGrams)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
          
          {/* Trust section */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: "🥭", title: "Farm Fresh", desc: "Handpicked daily" },
              { icon: "🌿", title: "100% Natural", desc: "No chemicals" },
              { icon: "🚚", title: "Free Delivery", desc: "MH 4-5 days · Others 8-9 days" },
              { icon: "✨", title: "GI Certified", desc: "Authentic Ratnagiri" },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-cream-100 shadow-sm">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="font-semibold text-charcoal text-sm">{item.title}</p>
                  <p className="text-xs text-charcoal/60">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
