"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewportOnce, easing } from "@/lib/animations";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

type Row = {
  label: string;
  caption: string; // small italic descriptor under label
  start: number; // 1-indexed grid column
  span: number;
  icon: string;
  background: string; // CSS background for the bar
  textClass: string; // text color/weight classes
  ringClass?: string; // optional ring
  /** is this the headline/peak row? gets bigger height + glow */
  peak?: boolean;
};

const ROWS: Row[] = [
  {
    label: "Flowering",
    caption: "Panicles & first blossom",
    start: 1,
    span: 2,
    icon: "i-leaf",
    background: "linear-gradient(90deg, #a3d4a6 0%, #6FBF73 100%)",
    textClass: "text-leaf-800",
  },
  {
    label: "Fruiting",
    caption: "Green fruit set",
    start: 2,
    span: 2,
    icon: "i-tree",
    background: "linear-gradient(90deg, #3a9c40 0%, #2E7D32 100%)",
    textClass: "text-white",
  },
  {
    label: "Harvest · Handpicked",
    caption: "Peak Alphonso season",
    start: 3,
    span: 3,
    icon: "i-mango",
    background:
      "linear-gradient(90deg, #FFD773 0%, #F4A300 50%, #E07A00 100%)",
    textClass: "text-white",
    ringClass: "ring-2 ring-white/60 shadow-glow",
    peak: true,
  },
  {
    label: "Free Delivery",
    caption: "MH 4-5 days · Others 8-9 days",
    start: 3,
    span: 4,
    icon: "i-truck",
    background: "linear-gradient(90deg, #E07A00 0%, #B86200 100%)",
    textClass: "text-white",
  },
  {
    label: "Off-season",
    caption: "Tree care & pruning",
    start: 7,
    span: 6,
    icon: "i-clipboard",
    background:
      "linear-gradient(90deg, #FCEBC2 0%, #FFF4E5 100%)",
    textClass: "text-charcoal/65",
  },
];

const HIGHLIGHTS = [
  {
    icon: "i-clipboard",
    title: "Pre-orders open",
    body: "1 March every year",
    accent: "Reserve early — most years sell out by April.",
  },
  {
    icon: "i-truck",
    title: "Free Delivery",
    body: "All over India",
    accent: "Maharashtra 4-5 days · Other States 8-9 days.",
  },
  {
    icon: "i-mango",
    title: "Peak Alphonso",
    body: "Mid-April to mid-May",
    accent: "The four golden weeks — best aroma, deepest flavour.",
  },
];

export default function HarvestCalendar() {
  // 0-indexed: April = 3, used to highlight the current peak month visually
  const peakMonthIndex = 3;

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 110% 80% at 50% 0%, #FFFBF5 0%, #FFF8EC 60%, #FCEBC2 100%)",
      }}
    >
      {/* Decorative leaf watermarks */}
      <svg
        aria-hidden="true"
        className="hidden md:block absolute -top-8 -right-12 w-64 h-64 text-leaf/10 rotate-12 pointer-events-none"
      >
        <use href="#i-leaf" />
      </svg>
      <svg
        aria-hidden="true"
        className="hidden md:block absolute bottom-12 -left-10 w-56 h-56 text-gold/15 -rotate-12 pointer-events-none"
      >
        <use href="#i-leaf" />
      </svg>
      {/* Paper grain */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='3'/></filter><rect width='240' height='240' filter='url(%23n)'/></svg>\")",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        {/* ─── Heading ─── */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="gold-rule">Harvest Calendar</span>
          <h2 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl text-charcoal leading-[1.04] tracking-[-0.02em]">
            A short,{" "}
            <em className="grad-text-static not-italic font-semibold">glorious</em>{" "}
            season.
          </h2>
          <p className="mt-5 text-charcoal/70 text-base sm:text-lg leading-relaxed">
            Alphonso is a once-a-year fruit. Pre-orders open in March; deliveries run from
            late March to early June.
          </p>

          {/* Decorative flourish */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold" />
            <svg className="w-5 h-5 text-gold" aria-hidden="true">
              <use href="#i-sun" />
            </svg>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold" />
          </div>
        </motion.div>

        {/* ─── Calendar card — proper surface ─── */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mt-12 relative rounded-3xl bg-white shadow-e2 ring-1 ring-gold/20 overflow-hidden"
        >
          {/* Top accent bar */}
          <span className="absolute top-0 inset-x-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

          <div className="overflow-x-auto">
            <div className="min-w-[900px] p-6 sm:p-8 grid grid-cols-12 gap-2 lg:gap-3 relative">
              {/* Highlight peak-month column */}
              <div
                aria-hidden="true"
                className="absolute top-2 bottom-2 rounded-2xl pointer-events-none"
                style={{
                  left: `calc((100% - 11 * ${"0.75rem"}) / 12 * ${peakMonthIndex} + ${peakMonthIndex} * 0.75rem + 1.5rem)`,
                  width:
                    "calc((100% - 11 * 0.75rem) / 12 + 0px)",
                  background:
                    "linear-gradient(180deg, rgba(244,163,0,0.10), rgba(244,163,0,0.02))",
                  boxShadow:
                    "inset 0 0 0 1.5px rgba(244,163,0,0.35)",
                }}
              />

              {/* Month labels */}
              <div className="col-span-12 grid grid-cols-12 gap-2 lg:gap-3 mb-3 text-center relative">
                {MONTHS.map((m, i) => (
                  <div
                    key={m}
                    className={`text-[10px] uppercase tracking-[0.2em] font-semibold ${
                      i === peakMonthIndex
                        ? "text-saffron"
                        : "text-charcoal/55"
                    }`}
                  >
                    {m}
                    {i === peakMonthIndex && (
                      <span className="block mt-0.5 text-[8px] font-bold tracking-[0.32em] text-saffron/80">
                        PEAK
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Month gridlines (subtle) */}
              <div
                aria-hidden="true"
                className="col-span-12 grid grid-cols-12 gap-2 lg:gap-3 absolute left-6 right-6 sm:left-8 sm:right-8 top-12 bottom-6 pointer-events-none"
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className={`${
                      i > 0 ? "border-l border-dashed border-charcoal/8" : ""
                    }`}
                  />
                ))}
              </div>

              {/* Bars */}
              {ROWS.map((row, rowIdx) => (
                <div
                  key={row.label}
                  className="col-span-12 grid grid-cols-12 gap-2 lg:gap-3 items-center mt-1.5 relative"
                >
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={viewportOnce}
                    transition={{
                      duration: 0.9,
                      ease: easing.out,
                      delay: rowIdx * 0.08,
                    }}
                    style={{
                      transformOrigin: "left center",
                      gridColumnStart: row.start,
                      gridColumnEnd: `span ${row.span}`,
                      background: row.background,
                    }}
                    className={`relative ${
                      row.peak ? "h-16" : "h-12"
                    } rounded-2xl flex items-center gap-3 px-4 ${row.textClass} ${
                      row.ringClass ?? ""
                    } overflow-hidden`}
                  >
                    {/* Inner highlight stripe */}
                    <span
                      aria-hidden="true"
                      className="absolute top-0 inset-x-0 h-px bg-white/30 pointer-events-none"
                    />

                    <span
                      className={`inline-flex items-center justify-center rounded-full shrink-0 ${
                        row.peak
                          ? "w-9 h-9 bg-white/25 ring-2 ring-white/60"
                          : "w-7 h-7 bg-white/20"
                      }`}
                    >
                      <svg
                        className={row.peak ? "w-4 h-4" : "w-3.5 h-3.5"}
                        aria-hidden="true"
                      >
                        <use href={`#${row.icon}`} />
                      </svg>
                    </span>

                    <div className="min-w-0 leading-tight">
                      <p
                        className={`${
                          row.peak
                            ? "font-serif font-semibold text-base sm:text-lg tracking-wide"
                            : "font-semibold text-xs sm:text-sm"
                        } truncate`}
                      >
                        {row.label}
                      </p>
                      <p
                        className={`${
                          row.peak
                            ? "text-[11px]"
                            : "text-[10px]"
                        } font-normal italic opacity-90 truncate`}
                      >
                        {row.caption}
                      </p>
                    </div>
                  </motion.div>
                </div>
              ))}

              {/* Legend along the bottom */}
              <div className="col-span-12 mt-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-charcoal/65">
                  <span className="flex items-center gap-1.5">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ background: "#6FBF73" }}
                    />
                    Flowering
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ background: "#2E7D32" }}
                    />
                    Fruiting
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ background: "#F4A300" }}
                    />
                    Harvest
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ background: "#B86200" }}
                    />
                    Shipping
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ background: "#FCEBC2" }}
                    />
                    Off-season
                  </span>
                </div>
                <p className="text-[11px] italic text-saffron font-semibold">
                  Peak season · April–May
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Highlight cards ─── */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={staggerContainer(0.1)}
          className="mt-8 grid sm:grid-cols-3 gap-4"
        >
          {HIGHLIGHTS.map((h, i) => (
            <motion.div
              key={h.title}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              className={`relative rounded-2xl bg-white p-5 ring-1 shadow-e1 hover:shadow-e2 transition-shadow ${
                i === 2 ? "ring-gold/40 bg-gold-50/60" : "ring-cream-200"
              }`}
            >
              {/* Peak badge on the third card */}
              {i === 2 && (
                <span className="absolute -top-3 right-5 px-3 py-0.5 rounded-full ribbon text-white text-[10px] font-bold tracking-wider uppercase shadow-e1">
                  Peak
                </span>
              )}
              <div className="flex items-start gap-3.5">
                <span
                  className={`w-12 h-12 rounded-2xl inline-flex items-center justify-center shrink-0 shadow-e1 ${
                    i === 2 ? "grad-gold-rich text-white" : "grad-leaf text-white"
                  }`}
                >
                  <svg className="w-6 h-6" aria-hidden="true">
                    <use href={`#${h.icon}`} />
                  </svg>
                </span>
                <div className="flex-1">
                  <p className="font-serif font-semibold text-charcoal text-base leading-tight">
                    {h.title}
                  </p>
                  <p className="text-saffron-700 text-xs font-bold tracking-wide mt-0.5">
                    {h.body}
                  </p>
                  <p className="text-charcoal/65 text-xs mt-2 leading-relaxed">
                    {h.accent}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
