"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";

const PILLARS = [
  { icon: "i-medal", eyebrow: "Highest", label: "Standards" },
  { icon: "i-team", eyebrow: "Dedicated", label: "Team" },
  { icon: "i-mango", eyebrow: "Unmatched", label: "Sweetness" },
  { icon: "i-heart", eyebrow: "Customer", label: "Satisfaction" },
];

export default function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden lg:min-h-[100svh] lg:flex lg:flex-col lg:justify-center"
      style={{
        // Cream-paper background — warmer than plain white, hints at brochure stock
        background:
          "radial-gradient(ellipse 90% 70% at 50% 0%, #FFFBF5 0%, #FFF7EA 60%, #FFF2DD 100%)",
      }}
    >
      {/* Decorative blobs */}
      <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-gold-50 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-leaf/5 blur-3xl pointer-events-none" />
      {/* Subtle grain overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='3'/></filter><rect width='240' height='240' filter='url(%23n)'/></svg>\")",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        {/* ─── Centered heading ─── */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="max-w-3xl mx-auto text-center"
        >
          <span className="gold-rule">About Yeskay Mango Farms</span>
          <h2 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl text-charcoal leading-[1.04] tracking-[-0.02em]">
            Where tradition meets{" "}
            <em className="grad-text-static not-italic font-semibold">excellence</em>
            <br className="hidden sm:block" /> in mango cultivation.
          </h2>
          <p className="mt-4 text-charcoal/70 text-base sm:text-lg leading-relaxed">
            One of Maharashtra&apos;s largest producers of Alphonso mangoes — committed to
            quality and sustainability since 1985.
          </p>
        </motion.div>

        {/* ─── Brochure-style 2-column body ─── */}
        <div className="mt-10 lg:mt-12 grid lg:grid-cols-12 gap-6 lg:gap-12 items-start">
          {/* ═══ LEFT: prose ═══ */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={staggerContainer(0.1)}
            className="lg:col-span-7"
          >
            {/* Prose card — gives the text a real surface instead of floating on the section */}
            <motion.div
              variants={fadeUp}
              className="relative rounded-3xl bg-white/70 backdrop-blur-sm border border-cream-200 shadow-soft p-6 sm:p-8 lg:p-10"
            >
              {/* Top gold accent bar */}
              <span className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

              {/* Welcome lead */}
              <p className="text-charcoal text-base sm:text-lg leading-relaxed">
                Welcome to{" "}
                <span className="font-serif font-bold tracking-wide text-leaf-700">
                  YESKAY MANGO FARMS PVT. LTD.
                </span>{" "}
                — where tradition meets excellence in mango cultivation. As one of
                Maharashtra&apos;s largest producers of Alphonso, we take pride in quality,
                innovation, and sustainability.
              </p>

              {/* Hairline divider */}
              <div className="my-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-cream-200" />
                <svg className="w-4 h-4 text-gold" aria-hidden="true">
                  <use href="#i-leaf" />
                </svg>
                <span className="h-px flex-1 bg-cream-200" />
              </div>

              {/* Two condensed prose paragraphs with tasteful drop-cap on the first */}
              <div className="text-charcoal/85 leading-[1.7] space-y-4 text-[15px] sm:text-base text-justify hyphens-auto">
                <p>
                  <span
                    className="float-left mr-2 mt-1 font-serif text-5xl sm:text-6xl leading-[0.85] grad-text-static font-bold"
                    style={{ letterSpacing: "-0.02em" }}
                  >
                    F
                  </span>
                  ounded in 1985, we&apos;ve grown from a small family farm into a leading
                  name in the Alphonso mango industry — leveraging western Maharashtra&apos;s
                  ideal climate and red soil, and combining time-honored techniques with
                  modern, sustainable practices.
                </p>
                <p>
                  We&apos;re passionate about bringing the best Alphonso mangoes to your table
                  — through direct sales, partnerships, or export. Every fruit is hand-picked,
                  naturally ripened, and traceable to the tree it grew on.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* ═══ RIGHT: yellow pillars panel + basket ═══ */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            className="lg:col-span-5"
          >
            <div className="relative">
              {/* Yellow vertical panel */}
              <div
                className="relative rounded-3xl overflow-hidden shadow-e3 ring-1 ring-saffron/20"
                style={{
                  background:
                    "linear-gradient(180deg, #FFD773 0%, #F4A300 55%, #E07A00 100%)",
                }}
              >
                {/* Layered watermark pattern */}
                <svg
                  aria-hidden="true"
                  className="absolute -right-8 -top-8 w-48 h-48 text-white/15 rotate-12 pointer-events-none"
                >
                  <use href="#i-leaf" />
                </svg>
                <svg
                  aria-hidden="true"
                  className="absolute -left-6 top-44 w-32 h-32 text-white/10 -rotate-12 pointer-events-none"
                >
                  <use href="#i-leaf" />
                </svg>
                {/* Top inner shine */}
                <span
                  aria-hidden="true"
                  className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent pointer-events-none"
                />

                {/* Panel header */}
                <div className="relative px-6 pt-6 sm:px-7 sm:pt-7">
                  <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/30 backdrop-blur-sm text-charcoal text-[10px] font-bold uppercase tracking-[0.22em] ring-1 ring-white/40">
                    <svg className="w-3 h-3" aria-hidden="true">
                      <use href="#i-medal" />
                    </svg>
                    Why us
                  </p>
                  <h3 className="mt-2 font-serif text-2xl font-bold text-charcoal leading-tight">
                    Four pillars,
                    <br />
                    <span className="text-leaf-700">one promise.</span>
                  </h3>
                </div>

                {/* 4 Pillars list — refined with hover rail */}
                <motion.ul
                  initial="hidden"
                  whileInView="show"
                  viewport={viewportOnce}
                  variants={staggerContainer(0.08)}
                  className="relative px-3 pt-4 pb-4 sm:px-4 sm:pt-5"
                >
                  {PILLARS.map((p, i) => (
                    <motion.li
                      key={p.label}
                      variants={fadeUp}
                      whileHover={{ x: 4 }}
                      transition={{ type: "spring", stiffness: 280, damping: 22 }}
                      className={`relative flex items-center gap-3.5 px-3 py-2.5 rounded-xl group hover:bg-white/20 transition-colors ${
                        i !== PILLARS.length - 1
                          ? "border-b border-white/30"
                          : ""
                      }`}
                    >
                      <span className="inline-flex items-center justify-center w-11 h-11 rounded-full grad-leaf text-white shadow-e2 ring-2 ring-white/50 shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-5 h-5" aria-hidden="true">
                          <use href={`#${p.icon}`} />
                        </svg>
                      </span>
                      <div className="min-w-0">
                        <p className="font-serif text-base sm:text-lg font-bold text-charcoal leading-none">
                          {p.eyebrow} {p.label}
                        </p>
                      </div>
                      <svg
                        className="ml-auto w-4 h-4 text-charcoal/40 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                        aria-hidden="true"
                      >
                        <use href="#i-arrow" />
                      </svg>
                    </motion.li>
                  ))}
                </motion.ul>

                {/* Basket image strip */}
                <div className="relative h-28 sm:h-32 overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1591073113125-e46713c829ed?auto=format&fit=crop&w=1200&q=88"
                    alt="Basket of fresh Alphonso mangoes from Yeskay Mango Farms"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-16"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(224,122,0,0.9), rgba(224,122,0,0.0))",
                    }}
                  />
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
