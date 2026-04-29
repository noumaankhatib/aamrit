"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";

const MILESTONES = [
  {
    year: "2008",
    title: "Founded",
    body: "A single family plot in Ratnagiri. The first crop, the first lessons.",
    icon: "i-leaf",
    metric: "1 farm",
  },
  {
    year: "2012",
    title: "Vilye Plot",
    body: "Our first major orchard — 20 acres, 1,400 trees, and a serious commitment.",
    icon: "i-tree",
    metric: "20 acres",
  },
  {
    year: "2016",
    title: "Raigad Expansion",
    body: "157-acre estate in Chordhe with 8,000 trees — scale, without losing the family touch.",
    icon: "i-pin",
    metric: "8,000 trees",
  },
  {
    year: "2019",
    title: "Westmango Export",
    body: "Launched our export arm. Aamrit mangoes start reaching tables abroad.",
    icon: "i-globe",
    metric: "5 countries",
  },
  {
    year: "Today",
    title: "Aamrit D2C",
    body: "Direct-to-home from 10 farms across 402+ acres with 15,000+ Alphonso trees.",
    icon: "i-mango",
    metric: "15,000+ trees",
  },
];

export default function Journey() {
  return (
    <section id="journey" className="relative bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="text-center max-w-3xl mx-auto px-2 sm:px-0"
        >
          <span className="gold-rule text-[10px] xs:text-[11px] sm:text-xs">Our Journey</span>
          <h2 className="mt-3 sm:mt-4 font-serif text-2xl xs:text-3xl sm:text-4xl lg:text-5xl text-charcoal leading-[1.1] sm:leading-[1.05]">
            From a small family farm to{" "}
            <span className="grad-text-static font-semibold">10 villages.</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-charcoal/70 text-sm sm:text-base lg:text-lg leading-relaxed">
            Seventeen years, ten farms, two districts. The standards never changed.
          </p>
        </motion.div>

        {/* ─── DESKTOP — horizontal timeline with golden rail + station nodes ─── */}
        <motion.ol
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={staggerContainer(0.12)}
          className="hidden lg:block mt-16 relative"
        >
          {/* Golden rail running through the station centers */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-[5.5rem] h-[3px] rounded-full"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, #F4A300 8%, #E07A00 50%, #F4A300 92%, transparent 100%)",
              boxShadow: "0 0 24px rgba(244,163,0,0.35)",
            }}
          />
          {/* Dashed sub-rail for texture */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-[5.7rem] h-px"
            style={{
              background:
                "repeating-linear-gradient(90deg, rgba(244,163,0,.45) 0 8px, transparent 8px 18px)",
            }}
          />

          <div className="grid grid-cols-5 gap-5">
            {MILESTONES.map((m, i) => {
              const isLast = i === MILESTONES.length - 1;
              return (
                <motion.li
                  key={m.year}
                  variants={fadeUp}
                  className="relative flex flex-col items-center text-center"
                >
                  <span
                    className={`font-serif text-3xl font-bold tracking-tight ${
                      isLast ? "grad-text-static" : "text-charcoal"
                    }`}
                  >
                    {m.year}
                  </span>

                  <div className="relative mt-3 mb-6">
                    <span className="absolute inset-0 rounded-full bg-gold/30 blur-md scale-125" />
                    <span
                      className={`relative inline-flex items-center justify-center w-16 h-16 rounded-full ring-4 ring-white shadow-glow ${
                        isLast ? "grad-leaf" : "grad-gold-rich"
                      }`}
                    >
                      <svg className="w-7 h-7 text-white" aria-hidden="true">
                        <use href={`#${m.icon}`} />
                      </svg>
                    </span>
                  </div>

                  <div className="card-warm px-5 py-5 w-full relative">
                    <span
                      aria-hidden="true"
                      className="absolute left-1/2 -top-3 w-1 h-3 -translate-x-1/2 bg-gold/60 rounded-full"
                    />
                    <p className="font-serif text-xl font-semibold text-charcoal leading-tight">
                      {m.title}
                    </p>
                    <p className="text-charcoal/75 text-sm mt-2.5 leading-relaxed">
                      {m.body}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream-100 border border-gold/30 text-saffron-700 text-[10px] font-bold uppercase tracking-wider">
                      <svg className="w-3 h-3" aria-hidden="true">
                        <use href="#i-check" />
                      </svg>
                      {m.metric}
                    </span>
                  </div>
                </motion.li>
              );
            })}
          </div>
        </motion.ol>

        {/* ─── MOBILE / TABLET — vertical timeline ─── */}
        <motion.ol
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={staggerContainer(0.12)}
          className="lg:hidden mt-12 relative pl-12 sm:pl-16"
        >
          <div
            aria-hidden="true"
            className="absolute left-5 sm:left-7 top-2 bottom-2 w-[3px] rounded-full"
            style={{
              background: "linear-gradient(180deg, #F4A300, #E07A00, #2E7D32)",
            }}
          />

          <div className="space-y-7">
            {MILESTONES.map((m, i) => {
              const isLast = i === MILESTONES.length - 1;
              return (
                <motion.li key={m.year} variants={fadeUp} className="relative">
                  <span
                    className={`absolute -left-12 sm:-left-16 top-1 inline-flex items-center justify-center w-10 h-10 rounded-full ring-4 ring-white shadow-glow ${
                      isLast ? "grad-leaf" : "grad-gold-rich"
                    }`}
                  >
                    <svg className="w-5 h-5 text-white" aria-hidden="true">
                      <use href={`#${m.icon}`} />
                    </svg>
                  </span>

                  <div className="card-warm pt-5 pb-5 px-5 relative">
                    <div className="flex items-baseline justify-between gap-3">
                      <span
                        className={`font-serif text-2xl font-bold tracking-tight ${
                          isLast ? "grad-text-static" : "text-charcoal"
                        }`}
                      >
                        {m.year}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cream-100 border border-gold/30 text-saffron-700 text-[10px] font-bold uppercase tracking-wider">
                        {m.metric}
                      </span>
                    </div>
                    <p className="font-serif text-lg font-semibold text-charcoal leading-tight mt-1">
                      {m.title}
                    </p>
                    <p className="text-charcoal/75 text-sm mt-2 leading-relaxed">
                      {m.body}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </div>
        </motion.ol>
      </div>
    </section>
  );
}
