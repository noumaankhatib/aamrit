"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";

const MILESTONES = [
  {
    year: "1985",
    title: "Kamal Kasam Kazi",
    body:
      "Our visionary founder, Late Mr. Kamal Kasam Kazi, started the business from a single family farm in Ratnagiri.",
    icon: "i-leaf",
    metric: "Ratnagiri · legacy",
  },
  {
    year: "2000",
    title: "Ratnagiri growth",
    body: "Expansion of farms to 70 acres in Ratnagiri.",
    icon: "i-tree",
    metric: "70 acres",
  },
  {
    year: "2005",
    title: "Raigad expansion",
    body: "157 acres in Chordhe village with 9,000 mango trees.",
    icon: "i-pin",
    metric: "Chordhe · 157 ac",
  },
  {
    year: "2010",
    title: "Murud Janjira",
    body: "Expansion of Raigad Murud Janjira farms to 300+ acres.",
    icon: "i-tree",
    metric: "300+ acres",
  },
  {
    year: "2013",
    title: "Ratnagiri portfolio",
    body: "Added two more 20-acre farms to our portfolio in Ratnagiri.",
    icon: "i-leaf",
    metric: "+40 acres",
  },
  {
    year: "2019",
    title: "Westmango Agro Export",
    body:
      "Launched our export arm. Aamrit mangoes start reaching tables abroad.",
    icon: "i-globe",
    metric: "Export arm",
  },
  {
    year: "Today",
    title: "Aamrit D2C",
    body:
      "Direct to home — 12 farms spread across 600+ acres with 22,000+ mango trees.",
    icon: "i-mango",
    metric: "22,000+ trees",
  },
];

export default function Journey() {
  return (
    <section
      id="journey"
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #FFFDF9 0%, #FFF9F0 35%, #FFF4E0 70%, #FCEBC2 100%)",
      }}
    >
      {/* Warm ambient glow blobs */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-gold/15 to-saffron/10 blur-[120px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-leaf/8 to-gold/5 blur-[100px] pointer-events-none"
      />

      {/* Subtle decorative leaf watermarks */}
      <svg
        aria-hidden="true"
        className="hidden lg:block absolute -top-8 -right-12 w-64 h-64 text-saffron/[0.07] rotate-12 pointer-events-none"
      >
        <use href="#i-leaf" />
      </svg>
      <svg
        aria-hidden="true"
        className="hidden lg:block absolute bottom-16 -left-10 w-52 h-52 text-leaf/[0.06] -rotate-12 pointer-events-none"
      >
        <use href="#i-leaf" />
      </svg>

      {/* Paper grain texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.025] pointer-events-none mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='3'/></filter><rect width='240' height='240' filter='url(%23n)'/></svg>\")",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        {/* Heading */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="text-center max-w-5xl mx-auto px-2 sm:px-0"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-100/80 to-orange-100/80 border border-amber-200/50 shadow-sm backdrop-blur-sm">
            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs sm:text-sm font-semibold text-amber-800 tracking-wide uppercase">Our Journey</span>
          </span>
          <h2 className="mt-6 font-serif text-3xl xs:text-4xl sm:text-[2.625rem] lg:text-5xl text-charcoal leading-[1.15] tracking-tight">
            From small family farm to{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 bg-clip-text text-transparent font-semibold">
                the largest Alphonso mango cultivators
              </span>
              <span className="absolute -bottom-1 left-0 right-0 h-3 bg-gradient-to-r from-amber-200/50 via-orange-200/50 to-amber-200/50 -skew-x-2 rounded-sm" />
            </span>
            .
          </h2>
          <p className="mt-6 text-charcoal/70 text-base sm:text-lg lg:text-xl leading-relaxed max-w-3xl mx-auto">
            40+ years, 2 districts, 12 farms. The standards never changed.
          </p>

          {/* Decorative flourish */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400/60 rounded-full" />
            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400/60 rounded-full" />
          </div>
        </motion.div>

        {/* ─── DESKTOP — horizontal gold rail + 7 stations (xl+) ─── */}
        <motion.ol
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={staggerContainer(0.08)}
          className="hidden xl:grid xl:grid-cols-7 gap-3 2xl:gap-4 mt-16 relative pb-4"
        >
          {/* Primary gold rail */}
          <span
            aria-hidden="true"
            className="absolute left-[2%] right-[2%] top-[5.75rem] h-[4px] rounded-full xl:left-[3%] xl:right-[3%]"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, #FFD773 8%, #F4A300 30%, #E07A00 50%, #F4A300 70%, #FFD773 92%, transparent 100%)",
              boxShadow:
                "0 0 32px rgba(244,163,0,0.4), 0 0 8px rgba(244,163,0,0.25)",
            }}
          />
          {/* Dashed sub-rail */}
          <span
            aria-hidden="true"
            className="absolute left-[2%] right-[2%] top-[6.1rem] h-px xl:left-[3%] xl:right-[3%]"
            style={{
              background:
                "repeating-linear-gradient(90deg, rgba(224,122,0,.35) 0 6px, transparent 6px 14px)",
            }}
          />

          {MILESTONES.map((m, i) => {
            const isLast = i === MILESTONES.length - 1;
            return (
              <motion.li
                key={m.year}
                variants={fadeUp}
                className="relative flex flex-col items-center text-center pt-2"
              >
                {/* Year */}
                <span
                  className={`font-serif font-bold tracking-tight leading-none mb-5 text-xl xl:text-[1.375rem] 2xl:text-[1.625rem] px-1 ${
                    isLast
                      ? "grad-text-static drop-shadow-sm"
                      : "text-charcoal/90"
                  }`}
                >
                  {m.year}
                </span>

                {/* Glowing node */}
                <div className="relative mb-5 group">
                  <span className="absolute inset-0 rounded-full bg-gradient-to-br from-gold/40 to-saffron/30 blur-2xl scale-[2] opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="absolute inset-0 rounded-full bg-gold/25 blur-lg scale-[1.5]" />
                  <span
                    className={`relative inline-flex items-center justify-center w-[4rem] h-[4rem] xl:w-[4.5rem] xl:h-[4.5rem] rounded-full ring-[5px] ring-white shadow-[0_8px_32px_rgba(244,163,0,0.35),0_0_0_1px_rgba(255,255,255,0.5)_inset] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_12px_40px_rgba(244,163,0,0.5)] ${
                      isLast ? "grad-leaf" : "grad-gold-rich"
                    }`}
                  >
                    <svg
                      className="w-7 h-7 xl:w-8 xl:h-8 text-white drop-shadow-md"
                      aria-hidden
                    >
                      <use href={`#${m.icon}`} />
                    </svg>
                  </span>
                </div>

                {/* Card */}
                <div
                  className="group/card w-full text-left flex flex-col rounded-2xl mt-1 flex-1 min-h-[265px] 2xl:min-h-[245px] overflow-hidden transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background:
                      "linear-gradient(165deg, #FFFFFF 0%, #FFFCF7 40%, #FFF8ED 100%)",
                    boxShadow:
                      "0 4px 20px rgba(43,43,43,0.06), 0 1px 3px rgba(43,43,43,0.04), inset 0 1px 0 rgba(255,255,255,0.9)",
                    border: "1px solid rgba(244,163,0,0.18)",
                  }}
                >
                  {/* Top accent bar */}
                  <span
                    aria-hidden="true"
                    className="block h-1 w-full"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(244,163,0,0.5) 30%, rgba(224,122,0,0.6) 50%, rgba(244,163,0,0.5) 70%, transparent)",
                    }}
                  />
                  <div className="px-4 py-5 xl:px-5 xl:py-6 flex flex-col flex-1">
                    <p className="font-serif font-semibold text-charcoal leading-snug text-sm xl:text-[0.9375rem] tracking-tight">
                      {m.title}
                    </p>
                    <p className="text-charcoal/65 leading-relaxed text-[11px] xl:text-xs mt-2.5 flex-1">
                      {m.body}
                    </p>
                    <span
                      className="mt-4 inline-flex w-fit items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] xl:text-[10px] font-bold uppercase tracking-wide transition-colors"
                      style={{
                        background:
                          "linear-gradient(135deg, #FFF8ED, #FFF4E0)",
                        border: "1px solid rgba(224,122,0,0.3)",
                        color: "#b86200",
                        boxShadow:
                          "0 2px 6px rgba(224,122,0,0.12), inset 0 1px 0 rgba(255,255,255,0.8)",
                      }}
                    >
                      <svg className="w-3 h-3 shrink-0" aria-hidden>
                        <use href="#i-check" />
                      </svg>
                      {m.metric}
                    </span>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </motion.ol>

        {/* ─── MOBILE / TABLET — vertical cards ─── */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={staggerContainer(0.1)}
          className="xl:hidden mt-14 space-y-5"
        >
          {MILESTONES.map((m, i) => {
            const isLast = i === MILESTONES.length - 1;
            return (
              <motion.div
                key={m.year}
                variants={fadeUp}
                className="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{
                  background:
                    "linear-gradient(165deg, #FFFFFF 0%, #FFFCF7 50%, #FFF8ED 100%)",
                  boxShadow:
                    "0 4px 24px rgba(43,43,43,0.07), 0 1px 3px rgba(43,43,43,0.04), inset 0 1px 0 rgba(255,255,255,0.9)",
                  border: "1px solid rgba(244,163,0,0.15)",
                }}
              >
                {/* Top accent bar */}
                <span
                  aria-hidden="true"
                  className="block h-1 w-full"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(244,163,0,0.5) 25%, rgba(224,122,0,0.6) 50%, rgba(244,163,0,0.5) 75%, transparent)",
                  }}
                />
                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <span
                      className={`inline-flex shrink-0 h-14 w-14 items-center justify-center rounded-full ring-[5px] ring-white shadow-[0_8px_28px_rgba(244,163,0,0.3)] ${
                        isLast ? "grad-leaf" : "grad-gold-rich"
                      }`}
                    >
                      <svg
                        className="h-7 w-7 text-white drop-shadow-md"
                        aria-hidden
                      >
                        <use href={`#${m.icon}`} />
                      </svg>
                    </span>
                    <div className="min-w-0 flex-1">
                      <span
                        className={`font-serif text-2xl sm:text-[1.625rem] font-bold tracking-tight ${
                          isLast ? "grad-text-static" : "text-charcoal/90"
                        }`}
                      >
                        {m.year}
                      </span>
                      <p className="font-serif font-semibold text-charcoal mt-1.5 leading-snug">
                        {m.title}
                      </p>
                      <p className="text-charcoal/65 text-sm mt-2.5 leading-relaxed">
                        {m.body}
                      </p>
                      <span
                        className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide"
                        style={{
                          background:
                            "linear-gradient(135deg, #FFF8ED, #FFF4E0)",
                          border: "1px solid rgba(224,122,0,0.3)",
                          color: "#b86200",
                          boxShadow:
                            "0 2px 6px rgba(224,122,0,0.12), inset 0 1px 0 rgba(255,255,255,0.8)",
                        }}
                      >
                        <svg className="w-3 h-3" aria-hidden>
                          <use href="#i-check" />
                        </svg>
                        {m.metric}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
