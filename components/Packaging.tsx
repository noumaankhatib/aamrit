"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  weightGrams: number;
  imageUrl: string;
  featured: boolean;
}

interface PackagingProps {
  products: Product[];
}

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function getGradeInfo(name: string): { grade: string; weight: string; label?: string; popular?: boolean; sortOrder: number } {
  if (name.includes("A1")) {
    return { grade: "Grade A1", weight: "250-305g", label: "Premium", sortOrder: 1 };
  }
  if (name.includes("A2")) {
    return { grade: "Grade A2", weight: "200-250g", label: "Best Value", popular: true, sortOrder: 2 };
  }
  if (name.includes("A3")) {
    return { grade: "Grade A3", weight: "150-200g", sortOrder: 3 };
  }
  return { grade: "Premium", weight: "~250g", sortOrder: 99 };
}

function sortByGrade(products: Product[]): Product[] {
  return [...products].sort((a, b) => {
    const aOrder = getGradeInfo(a.name).sortOrder;
    const bOrder = getGradeInfo(b.name).sortOrder;
    return aOrder - bOrder;
  });
}

export default function Packaging({ products }: PackagingProps) {
  return (
    <section id="packaging" className="relative grad-warm overflow-hidden">
      <svg
        aria-hidden="true"
        className="hidden md:block absolute top-20 right-10 w-40 h-40 text-leaf opacity-10"
      >
        <use href="#i-leaf" />
      </svg>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="max-w-3xl mx-auto text-center"
        >
          <Link
            href="/shop"
            className="gold-rule mx-auto inline-flex max-w-full justify-center rounded-sm transition-[opacity,filter] hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2"
          >
            Alphonso Mangoes · {products.length} Grades
          </Link>
          <h2 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl text-charcoal leading-[1.05]">
            Pick your size.{" "}
            <span className="grad-text-static">We&apos;ll pack the season.</span>
          </h2>
          <p className="mt-5 text-charcoal/75 text-lg leading-relaxed">
            Cushioned in straw-lined wooden crates — the way Ratnagiri has done it for a
            hundred years.
          </p>
          <Link
            href="/shop"
            className="mt-7 btn-gold inline-flex items-center gap-2 text-white font-semibold px-7 py-3.5 rounded-full cursor-pointer"
          >
            View All Products
            <svg className="w-4 h-4" aria-hidden="true">
              <use href="#i-arrow" />
            </svg>
          </Link>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={staggerContainer(0.08)}
          className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {sortByGrade(products).map((product) => {
            const info = getGradeInfo(product.name);
            return (
              <motion.article key={product.id} variants={fadeUp} className="h-full">
                <Link
                  href={`/shop/${product.slug}`}
                  className={`card-edge tilt group relative flex h-full flex-col overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 ${
                    info.popular ? "ring-2 ring-gold" : ""
                  }`}
                >
                  {info.popular && (
                    <div className="pointer-events-none absolute top-3 right-3 z-20 inline-flex items-center gap-1.5 px-3 py-1 rounded-full ribbon text-white text-[11px] font-semibold tracking-wider uppercase">
                      <svg className="w-3 h-3" aria-hidden="true">
                        <use href="#i-star" />
                      </svg>
                      Most Popular
                    </div>
                  )}

                  <div className="relative h-64 shrink-0 overflow-hidden bg-cream-50">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="pointer-events-none object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-charcoal/20">
                      <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 via-black/20 to-transparent pointer-events-none" />

                  {info.label && (
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-3 py-1 rounded-full grad-leaf text-white text-[10px] font-bold uppercase tracking-wider shadow-e1">
                      {info.label}
                    </span>
                  )}

                    <div className="pointer-events-none absolute left-4 bottom-4 z-10 flex flex-col items-start drop-shadow-[0_6px_12px_rgba(0,0,0,0.25)]">
                      <span
                        className="grad-gold-rich text-white font-serif font-bold text-xl sm:text-2xl px-4 py-1.5 leading-none"
                        style={{ borderRadius: "10px 10px 10px 0" }}
                      >
                        {info.grade}
                      </span>
                      <span
                        className="grad-leaf text-white text-[11px] font-semibold tracking-wider uppercase px-3 py-1 leading-none -mt-px"
                        style={{ borderRadius: "0 0 10px 10px" }}
                      >
                        {info.weight} per piece
                      </span>
                    </div>
                  </div>

                  <div className="flex min-h-0 flex-1 flex-col p-5">
                    <h3 className="font-serif text-lg font-semibold text-charcoal">{product.name}</h3>
                    <div className="mt-2 flex items-baseline justify-between gap-2">
                      <p className="text-sm leading-snug text-charcoal/70">12 mangoes per box</p>
                      <span className="shrink-0 font-serif text-xl font-bold text-saffron">
                        {formatPrice(product.priceCents)}
                      </span>
                    </div>
                    <span
                      aria-hidden="true"
                      className="mt-auto pt-4 inline-flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold text-white pointer-events-none btn-gold"
                    >
                      Order Now
                      <svg className="w-3.5 h-3.5" aria-hidden="true">
                        <use href="#i-arrow" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </motion.article>
            );
          })}

          {/* ─── Custom B2B card — matches photo-card structure ─── */}
          <motion.article
            variants={fadeUp}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            className="relative rounded-3xl overflow-hidden ring-2 ring-leaf/40 shadow-e2 hover:shadow-e3 transition-shadow flex flex-col bg-white"
          >
            {/* ── Top hero block (matches the photo cards' image area at h-44) ── */}
            <div
              className="relative h-44 overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, #3a9c40 0%, #2E7D32 50%, #1F4F22 100%)",
              }}
            >
              {/* Layered watermarks */}
              <svg
                aria-hidden="true"
                className="absolute -top-8 -right-8 w-44 h-44 text-white/15 rotate-12 pointer-events-none"
              >
                <use href="#i-leaf" />
              </svg>
              <svg
                aria-hidden="true"
                className="absolute -bottom-6 -left-4 w-32 h-32 text-white/10 -rotate-12 pointer-events-none"
              >
                <use href="#i-leaf" />
              </svg>
              {/* Top inner shine */}
              <span className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

              {/* Centered globe icon as visual anchor */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/15 backdrop-blur ring-2 ring-white/40">
                  <svg className="w-7 h-7" aria-hidden="true">
                    <use href="#i-globe" />
                  </svg>
                </span>
                <p className="mt-2 text-gold-200 text-[10px] font-bold uppercase tracking-[0.32em]">
                  B2B · Custom
                </p>
              </div>

              {/* Top-left chip */}
              <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white text-leaf-700 text-[10px] font-bold uppercase tracking-wider shadow-e1">
                <svg className="w-3 h-3" aria-hidden="true">
                  <use href="#i-medal" />
                </svg>
                Westmango
              </span>
              {/* Bottom-right "50+" volume tag */}
              <span className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-charcoal/80 backdrop-blur text-white text-[11px] font-bold tracking-[0.18em] uppercase">
                50+ crates
              </span>
            </div>

            {/* ── Body ── */}
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="font-serif text-2xl text-charcoal leading-tight">
                Need more?
              </h3>
              <p className="text-charcoal/70 text-xs mt-1.5 leading-relaxed">
                Container loads, private labelling &amp; export shipments via Westmango Agro
                Export.
              </p>

              <ul className="mt-3 space-y-1.5">
                {[
                  "Custom packing",
                  "Private / white-label",
                  "International shipping",
                ].map((b) => (
                  <li
                    key={b}
                    className="flex items-center gap-2 text-charcoal/80 text-xs font-medium"
                  >
                    <span className="w-4 h-4 rounded-full bg-leaf/15 text-leaf-700 inline-flex items-center justify-center shrink-0">
                      <svg className="w-2.5 h-2.5" aria-hidden="true">
                        <use href="#i-check" />
                      </svg>
                    </span>
                    {b}
                  </li>
                ))}
              </ul>

              <a
                href="#b2b"
                className="mt-4 w-full inline-flex justify-center items-center gap-2 bg-leaf hover:bg-leaf-600 text-white text-sm font-semibold py-2.5 rounded-full cursor-pointer transition-colors shadow-e1"
              >
                Bulk Inquiry
                <svg className="w-3.5 h-3.5" aria-hidden="true">
                  <use href="#i-arrow" />
                </svg>
              </a>
            </div>
          </motion.article>
        </motion.div>
      </div>
    </section>
  );
}
