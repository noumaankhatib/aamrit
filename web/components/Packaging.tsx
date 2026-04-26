"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";

type Pack = {
  dozens: string; // e.g. "3 Dozen"
  mangoes: number; // e.g. 36
  weight: string; // e.g. "~7"
  copy: string;
  image: string; // path to crate photo (drop yours into /public/img/packaging/)
  popular?: boolean;
  label?: string; // "Best for Family" / "Best for Gifting"
};

// Crate photos. Replace these with your own files under
//   /public/img/packaging/<n>-dozen.jpg
// e.g. const image = "/img/packaging/3-dozen.jpg";
// (next/image will then optimise + serve in WebP/AVIF automatically)
const CRATE_FALLBACK =
  "https://images.unsplash.com/photo-1591073113125-e46713c829ed?auto=format&fit=crop&w=1200&q=85";
const CRATE_RIPE =
  "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=1200&q=85";

const PACKS: Pack[] = [
  {
    dozens: "3 Dozen",
    mangoes: 36,
    weight: "~7",
    copy: "Perfect for a household of 2–3",
    image: CRATE_FALLBACK,
  },
  {
    dozens: "3.5 Dozen",
    mangoes: 42,
    weight: "~8.5",
    copy: "A little extra for sharing",
    image: CRATE_FALLBACK,
  },
  {
    dozens: "4 Dozen",
    mangoes: 48,
    weight: "~10",
    copy: "Standard family crate · 4–5 people",
    image: CRATE_FALLBACK,
  },
  {
    dozens: "6 Dozen",
    mangoes: 72,
    weight: "~15",
    copy: "Best value · enough to share",
    image: CRATE_RIPE,
    popular: true,
    label: "Best for Family",
  },
  {
    dozens: "7 Dozen",
    mangoes: 84,
    weight: "~17.5",
    copy: "For larger households",
    image: CRATE_FALLBACK,
  },
  {
    dozens: "8 Dozen",
    mangoes: 96,
    weight: "~20",
    copy: "Family + neighbours",
    image: CRATE_FALLBACK,
  },
  {
    dozens: "9 Dozen",
    mangoes: 108,
    weight: "~22",
    copy: "Small office gifting",
    image: CRATE_RIPE,
    label: "Best for Gifting",
  },
  {
    dozens: "10 Dozen",
    mangoes: 120,
    weight: "~25",
    copy: "Largest standard crate",
    image: CRATE_FALLBACK,
  },
];

export default function Packaging() {
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
          <span className="gold-rule">Crates &amp; Boxes · 9 sizes</span>
          <h2 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl text-charcoal leading-[1.05]">
            Pick your size.{" "}
            <span className="grad-text-static">We&apos;ll pack the season.</span>
          </h2>
          <p className="mt-5 text-charcoal/75 text-lg leading-relaxed">
            Cushioned in straw-lined wooden crates — the way Ratnagiri has done it for a
            hundred years.
          </p>
          <a
            href="#order"
            className="mt-7 btn-gold inline-flex items-center gap-2 text-white font-semibold px-7 py-3.5 rounded-full cursor-pointer"
          >
            Place an Order
            <svg className="w-4 h-4" aria-hidden="true">
              <use href="#i-arrow" />
            </svg>
          </a>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={staggerContainer(0.08)}
          className="mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-5"
        >
          {PACKS.map((p) => (
            <motion.article
              key={p.dozens}
              variants={fadeUp}
              className={`card-edge tilt overflow-hidden group relative ${
                p.popular ? "ring-2 ring-gold" : ""
              }`}
            >
              {p.popular && (
                <div className="absolute top-3 right-3 z-20 inline-flex items-center gap-1.5 px-3 py-1 rounded-full ribbon text-white text-[11px] font-semibold tracking-wider uppercase">
                  <svg className="w-3 h-3" aria-hidden="true">
                    <use href="#i-star" />
                  </svg>
                  Most Popular
                </div>
              )}

              {/* Photo of real mango crate — replace `image` paths in PACKS with /img/packaging/*.jpg */}
              <div className="relative h-56 overflow-hidden bg-cream-50">
                <Image
                  src={p.image}
                  alt={`Wooden crate of Aamrit mangoes — ${p.dozens} pack`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                />
                {/* Subtle warm bottom gradient for tab legibility */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none" />

                {/* "Best for Family / Gifting" pill — top-left, brand green */}
                {p.label && (
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-3 py-1 rounded-full grad-leaf text-white text-[10px] font-bold uppercase tracking-wider shadow-e1">
                    {p.label}
                  </span>
                )}

                {/* YESKAY-style stacked tab: orange "X Dozen" + green "N Mangoes" — bottom-left */}
                <div className="absolute left-4 bottom-4 z-10 flex flex-col items-start drop-shadow-[0_6px_12px_rgba(0,0,0,0.25)]">
                  <span
                    className="grad-gold-rich text-white font-serif font-bold text-xl sm:text-2xl px-4 py-1.5 leading-none"
                    style={{ borderRadius: "10px 10px 10px 0" }}
                  >
                    {p.dozens}
                  </span>
                  <span
                    className="grad-leaf text-white text-[11px] font-semibold tracking-wider uppercase px-3 py-1 leading-none -mt-px"
                    style={{ borderRadius: "0 0 10px 10px" }}
                  >
                    {p.mangoes} Mangoes
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-charcoal/70 text-sm leading-snug">{p.copy}</p>
                  <span className="text-saffron font-serif text-lg shrink-0">
                    {p.weight}
                    <span className="text-charcoal/55 text-xs ml-0.5">kg</span>
                  </span>
                </div>
                <a
                  href="#order"
                  className={`mt-4 w-full inline-flex justify-center items-center gap-2 text-white text-sm font-semibold py-2.5 rounded-full cursor-pointer ${
                    p.popular
                      ? "btn-gold"
                      : "bg-charcoal hover:bg-charcoal-700 transition-colors"
                  }`}
                >
                  Order
                  <svg className="w-3.5 h-3.5" aria-hidden="true">
                    <use href="#i-arrow" />
                  </svg>
                </a>
              </div>
            </motion.article>
          ))}

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
