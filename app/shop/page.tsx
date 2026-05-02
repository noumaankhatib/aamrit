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
      <main className="min-h-screen bg-gradient-to-b from-amber-50/30 via-white to-orange-50/20 pb-24">
        {/* Hero background with subtle pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-br from-amber-100/40 via-orange-50/30 to-transparent" />
          <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-amber-200/20 to-orange-200/10 rounded-full blur-3xl" />
          <div className="absolute top-40 left-10 w-96 h-96 bg-gradient-to-br from-green-100/20 to-emerald-100/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
          {/* Compact Header with Filters */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-serif text-2xl sm:text-3xl text-charcoal tracking-tight">
                  Premium Mangoes
                </h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-leaf/10 to-emerald-500/10 border border-leaf/20 text-xs font-semibold text-leaf shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-leaf animate-ping opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-leaf" />
                  </span>
                  In Season
                </span>
              </div>
              <p className="text-charcoal/60 text-sm max-w-md">
                Naturally ripened Alphonso & Kesar from Ratnagiri. Free delivery across India.
              </p>
            </div>
            
            {/* Grade Quick Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-charcoal/50 font-medium mr-1">Grade:</span>
              <Link
                href="/shop"
                className={`cursor-pointer px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  !params.q?.includes("Grade")
                    ? "bg-charcoal text-white shadow-md shadow-charcoal/20"
                    : "bg-white text-charcoal border border-gray-200 hover:border-charcoal/40 hover:shadow-sm"
                }`}
              >
                All
              </Link>
              <Link
                href={`/shop?q=${encodeURIComponent("Grade A1")}`}
                className={`cursor-pointer px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 inline-flex items-center gap-1.5 ${
                  params.q === "Grade A1"
                    ? "bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-md shadow-amber-500/30"
                    : "bg-white text-charcoal border border-gray-200 hover:border-amber-300 hover:shadow-sm"
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 shadow-inner"></span>
                A1 Premium
              </Link>
              <Link
                href={`/shop?q=${encodeURIComponent("Grade A2")}`}
                className={`cursor-pointer px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 inline-flex items-center gap-1.5 ${
                  params.q === "Grade A2"
                    ? "bg-gradient-to-r from-orange-400 to-amber-500 text-white shadow-md shadow-orange-500/30"
                    : "bg-white text-charcoal border border-gray-200 hover:border-orange-300 hover:shadow-sm"
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 shadow-inner"></span>
                A2 Classic
                <span className="ml-0.5 px-1.5 py-0.5 bg-gradient-to-r from-rose-500 to-red-500 text-white text-[10px] font-bold rounded-md shadow-sm">Popular</span>
              </Link>
              <Link
                href={`/shop?q=${encodeURIComponent("Grade A3")}`}
                className={`cursor-pointer px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 inline-flex items-center gap-1.5 ${
                  params.q === "Grade A3"
                    ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-md shadow-emerald-500/30"
                    : "bg-white text-charcoal border border-gray-200 hover:border-emerald-300 hover:shadow-sm"
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 shadow-inner"></span>
                A3 Value
              </Link>
            </div>
          </div>

          {/* Category filters - compact */}
          {categories.length > 0 && (
            <nav className="flex gap-2 flex-wrap mb-6 items-center">
              <span className="text-xs text-charcoal/50 font-medium mr-1">Variety:</span>
              <Link
                href="/shop"
                className={`cursor-pointer px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  !categoryFilter
                    ? "bg-charcoal text-white shadow-md shadow-charcoal/20"
                    : "bg-white text-charcoal hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
                }`}
              >
                All
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/shop?category=${c.slug}`}
                  className={`cursor-pointer px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    categoryFilter === c.slug
                      ? "bg-charcoal text-white shadow-md shadow-charcoal/20"
                      : "bg-white text-charcoal hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {c.name}
                </Link>
              ))}
            </nav>
          )}

          {/* Products grid */}
          {products.length === 0 ? (
            <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-100">
              <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                <svg className="w-10 h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h2 className="font-serif text-2xl text-charcoal mb-2">No products yet</h2>
              <p className="text-charcoal/60">
                Check back soon for our seasonal offerings.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((p) => {
                const grade = getGradeFromName(p.name);
                return (
                  <Link
                    key={p.id}
                    href={`/shop/${p.slug}`}
                    className="group cursor-pointer flex flex-col h-full rounded-2xl bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-amber-200/50 outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 focus-visible:ring-offset-2"
                  >
                    {/* Image */}
                    <div className="relative aspect-square shrink-0 bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden">
                      {p.imageUrl ? (
                        <Image
                          src={p.imageUrl}
                          alt={p.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="pointer-events-none object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="w-14 h-14 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Grade Badge */}
                      {grade && (
                        <div className="pointer-events-none absolute top-3 left-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-white text-xs font-bold shadow-lg backdrop-blur-sm ${
                            grade === "A1" 
                              ? "bg-gradient-to-r from-amber-500 to-amber-600" 
                              : grade === "A2" 
                              ? "bg-gradient-to-r from-orange-500 to-amber-500" 
                              : "bg-gradient-to-r from-emerald-500 to-green-500"
                          }`}>
                            {grade}
                          </span>
                        </div>
                      )}
                      
                      {/* Quick view button */}
                      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm text-charcoal shadow-lg">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex min-h-0 flex-1 flex-col p-3 sm:p-4">
                      {p.variety && (
                        <p className="text-[10px] sm:text-xs text-emerald-600 font-semibold uppercase tracking-wider mb-1">
                          {p.variety}
                        </p>
                      )}
                      <h2 className="font-serif text-sm sm:text-base text-charcoal group-hover:text-amber-700 transition-colors duration-200 leading-tight line-clamp-2 mb-3">
                        {p.name}
                      </h2>
                      
                      <div className="mt-auto pt-3 border-t border-gray-100 flex items-end justify-between">
                        <div>
                          <p className="text-[10px] text-charcoal/50 mb-0.5">Per dozen</p>
                          <p className="font-serif text-lg sm:text-xl font-bold text-charcoal">
                            {formatINR(p.priceCents)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-charcoal/50 mb-0.5">Weight</p>
                          <p className="text-xs sm:text-sm font-medium text-charcoal/70">
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
          
          {/* Trust bar - with SVG icons */}
          <div className="mt-10 py-6 px-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
              <div className="flex items-center gap-2.5 text-sm text-charcoal/80">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="font-medium">Farm Fresh</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-charcoal/80">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <span className="font-medium">100% Natural</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-charcoal/80">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <span className="font-medium">Free Delivery</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-charcoal/80">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-100 to-violet-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <span className="font-medium">GI Certified</span>
              </div>
            </div>
          </div>

          {/* Grade Guide - collapsible */}
          <details className="mt-6 group">
            <summary className="cursor-pointer list-none">
              <div className="flex items-center justify-center gap-2 py-3.5 px-5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200/50 hover:border-amber-300 transition-all duration-200 hover:shadow-sm">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-semibold text-charcoal">Understanding Mango Grades</span>
                <svg className="w-4 h-4 text-charcoal/50 transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </summary>
            <div className="mt-4 p-5 sm:p-6 bg-gradient-to-br from-amber-50/60 to-orange-50/40 rounded-2xl border border-amber-100/50">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-start gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-amber-200/40 shadow-sm">
                  <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-white font-bold text-sm shadow-lg shadow-amber-500/30">
                    A1
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-charcoal">Premium</h3>
                    <p className="text-xs text-charcoal/60 mt-1">250-305g · Best for gifting</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-orange-200/40 shadow-sm relative">
                  <span className="absolute -top-2 -right-2 px-2 py-1 bg-gradient-to-r from-rose-500 to-red-500 text-white text-[10px] font-bold rounded-lg shadow-md">Popular</span>
                  <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 text-white font-bold text-sm shadow-lg shadow-orange-500/30">
                    A2
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-charcoal">Classic</h3>
                    <p className="text-xs text-charcoal/60 mt-1">200-250g · Family favorite</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-emerald-200/40 shadow-sm">
                  <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/30">
                    A3
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-charcoal">Value</h3>
                    <p className="text-xs text-charcoal/60 mt-1">150-200g · Great for smoothies</p>
                  </div>
                </div>
              </div>
            </div>
          </details>
        </div>
      </main>
    </>
  );
}
