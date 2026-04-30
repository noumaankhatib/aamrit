import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import ShopNav from "@/components/shop/ShopNav";

export const metadata: Metadata = {
  title: "Blog — Alphonso Mango Guide, Tips & Stories | Aamrit",
  description:
    "Learn about Alphonso mangoes, natural ripening methods, health benefits, and stories from our family orchards in Ratnagiri & Raigad (established 1985, 22,000+ trees). Expert tips from Yeskay Mango Farms.",
  keywords: [
    "alphonso mango blog",
    "hapus mango tips",
    "ratnagiri mango guide",
    "natural mango ripening",
    "mango health benefits",
    "konkan mango farming",
  ],
  openGraph: {
    title: "Blog — Alphonso Mango Guide & Stories | Aamrit",
    description:
      "Expert guides on Alphonso mangoes, natural ripening, health benefits, and farm stories from Ratnagiri.",
    type: "website",
  },
};

const BLOG_POSTS = [
  {
    slug: "how-to-identify-real-alphonso-mango",
    title: "How to Identify Real Alphonso Mango: 7 Expert Tips",
    excerpt:
      "Learn the telltale signs that distinguish genuine Ratnagiri Alphonso from fake or artificially ripened mangoes. Our farmers share generations of knowledge.",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=85",
    category: "Guide",
    readTime: "5 min read",
    date: "April 15, 2026",
  },
  {
    slug: "carbide-vs-natural-ripening",
    title: "Carbide vs Natural Ripening: Why It Matters for Your Health",
    excerpt:
      "Discover the dangers of calcium carbide ripening and why our 5-7 day straw-cradle method produces healthier, tastier mangoes.",
    image: "https://images.unsplash.com/photo-1519096845289-95806ee03a1a?auto=format&fit=crop&w=800&q=85",
    category: "Health",
    readTime: "7 min read",
    date: "April 10, 2026",
  },
  {
    slug: "alphonso-mango-health-benefits",
    title: "10 Surprising Health Benefits of Alphonso Mangoes",
    excerpt:
      "From boosting immunity to improving digestion, discover why the 'King of Mangoes' is also a superfood packed with vitamins and antioxidants.",
    image: "https://images.unsplash.com/photo-1591073113125-e46713c829ed?auto=format&fit=crop&w=800&q=85",
    category: "Health",
    readTime: "6 min read",
    date: "April 5, 2026",
  },
  {
    slug: "ratnagiri-vs-karnataka-alphonso",
    title: "Ratnagiri vs Karnataka Alphonso: Why Maharashtra is Superior",
    excerpt:
      "Not all Alphonso is equal. Discover why GI-tagged Ratnagiri Alphonso stands apart from Karnataka varieties in taste, aroma, and quality.",
    image: "https://images.unsplash.com/photo-1605027990121-cbae9e0642df?auto=format&fit=crop&w=800&q=85",
    category: "Guide",
    readTime: "5 min read",
    date: "March 28, 2026",
  },
];

export default function BlogPage() {
  return (
    <>
      <ShopNav />
      <main className="min-h-screen bg-gradient-to-b from-cream-50 via-white to-cream-50 pb-24">
        {/* Hero */}
        <div className="relative bg-gradient-to-br from-charcoal via-charcoal to-charcoal/95 text-white py-20 sm:py-28 overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-gold/10 blur-[150px] -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-leaf/5 blur-[120px] translate-y-1/2 -translate-x-1/3" />
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60'><rect fill='white' width='60' height='60'/><circle cx='30' cy='30' r='1' fill='white'/></svg>\")",
            }} />
          </div>
          
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-gold/20 to-saffron/20 border border-gold/30 text-gold-200 text-xs font-semibold tracking-wider uppercase mb-6 backdrop-blur-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Aamrit Blog
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] tracking-tight">
              Mango Wisdom from{" "}
              <span className="relative">
                <span className="bg-gradient-to-r from-gold-300 via-gold-200 to-saffron-300 bg-clip-text text-transparent">Our Orchards</span>
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-gold/30" viewBox="0 0 100 12" preserveAspectRatio="none">
                  <path d="M0 8 Q25 0, 50 8 T100 8" fill="none" stroke="currentColor" strokeWidth="3" />
                </svg>
              </span>
            </h1>
            <p className="mt-6 text-white/60 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              Expert guides, health tips, and stories from three generations of Alphonso farmers in Ratnagiri & Raigad.
            </p>
            
            {/* Stats */}
            <div className="mt-10 flex items-center justify-center gap-8 sm:gap-12">
              {[
                { value: "4", label: "Articles" },
                { value: "1985", label: "Established" },
                { value: "22K+", label: "Trees" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-serif text-2xl sm:text-3xl text-gold-300">{stat.value}</p>
                  <p className="text-xs text-white/40 uppercase tracking-wider mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          {/* Section header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl text-charcoal">Latest Articles</h2>
              <p className="mt-1 text-charcoal/50 text-sm">Fresh insights from our mango experts</p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-full bg-saffron/10 text-saffron text-xs font-semibold">All</span>
              <span className="px-3 py-1.5 rounded-full bg-cream-100 text-charcoal/60 text-xs font-medium hover:bg-cream-200 transition-colors cursor-pointer">Guide</span>
              <span className="px-3 py-1.5 rounded-full bg-cream-100 text-charcoal/60 text-xs font-medium hover:bg-cream-200 transition-colors cursor-pointer">Health</span>
            </div>
          </div>
          
          {/* Featured post (first one larger) */}
          <Link
            href={`/blog/${BLOG_POSTS[0].slug}`}
            className="group block mb-10 bg-white rounded-[2rem] shadow-e2 hover:shadow-e3 transition-all duration-500 overflow-hidden hover:-translate-y-1 border border-cream-100/50"
          >
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative h-64 md:h-full min-h-[280px] overflow-hidden">
                <Image
                  src={BLOG_POSTS[0].image}
                  alt={BLOG_POSTS[0].title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent md:bg-gradient-to-t" />
                <span className="absolute top-5 left-5 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-xs font-bold text-saffron uppercase tracking-wider shadow-lg">
                  Featured
                </span>
              </div>
              <div className="p-8 md:p-10 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full bg-leaf/10 text-leaf text-xs font-semibold">{BLOG_POSTS[0].category}</span>
                  <span className="text-xs text-charcoal/40">{BLOG_POSTS[0].date}</span>
                  <span className="text-xs text-charcoal/40">•</span>
                  <span className="text-xs text-charcoal/40">{BLOG_POSTS[0].readTime}</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-charcoal group-hover:text-saffron transition-colors leading-tight">
                  {BLOG_POSTS[0].title}
                </h2>
                <p className="mt-4 text-charcoal/60 leading-relaxed line-clamp-3">
                  {BLOG_POSTS[0].excerpt}
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold-600 group-hover:text-gold-700">
                  Read full article
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
          
          {/* Other posts grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {BLOG_POSTS.slice(1).map((post, index) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-2xl shadow-e1 hover:shadow-e3 transition-all duration-300 overflow-hidden hover:-translate-y-2 border border-cream-100/50"
              >
                {/* Image */}
                <div className="relative h-48 sm:h-52 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                  <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm shadow-lg ${
                    post.category === 'Health' 
                      ? 'bg-leaf/90 text-white' 
                      : 'bg-white/95 text-saffron'
                  }`}>
                    {post.category}
                  </span>
                  {/* Read time badge */}
                  <span className="absolute bottom-4 right-4 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white text-[10px] font-medium">
                    {post.readTime}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6">
                  <div className="flex items-center gap-2 text-xs text-charcoal/40 mb-3">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{post.date}</span>
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl text-charcoal group-hover:text-saffron transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-charcoal/50 text-sm leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="mt-5 pt-4 border-t border-cream-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gold-400 to-saffron flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold">A</span>
                      </div>
                      <span className="text-xs text-charcoal/60 font-medium">Aamrit Team</span>
                    </div>
                    <svg className="w-5 h-5 text-charcoal/30 group-hover:text-saffron group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </main>
    </>
  );
}
