"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";

const POINTS = [
  "Custom pack sizes (3 to 10+ dozen) & private labelling",
  "Direct-from-farm pricing — no middlemen",
  "Pan-India & international export logistics (via Westmango)",
  "Corporate & festive gifting programs",
];

export default function B2BSection() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section
      id="b2b"
      className="relative grad-charcoal text-white overflow-hidden"
    >
      <div className="absolute -top-40 -right-40 w-[28rem] h-[28rem] rounded-full opacity-30 blur-3xl bg-gold/30" />
      <div className="absolute -bottom-40 -left-40 w-[28rem] h-[28rem] rounded-full opacity-25 blur-3xl bg-leaf/40" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        {/* Centered section heading */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="max-w-3xl mx-auto text-center"
        >
          <span className="gold-rule text-gold/90">For Business</span>
          <h2 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">
            Retailers, exporters,{" "}
            <span className="grad-text">gifting partners.</span>
          </h2>
          <p className="mt-5 text-white/75 text-lg leading-relaxed">
            22,000+ trees across 600+ acres means we can supply at scale — without losing
            the care of a family farm. Tell us what you need and we&apos;ll put a quote
            together within 24 hours.
          </p>
        </motion.div>

        <div className="mt-16 grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={staggerContainer(0.1)}
          >

            <motion.ul variants={staggerContainer(0.08)} className="mt-9 space-y-4 text-white/85">
              {POINTS.map((p) => (
                <motion.li key={p} variants={fadeUp} className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full grad-gold-rich inline-flex items-center justify-center text-white shadow-glow shrink-0">
                    <svg className="w-3.5 h-3.5" aria-hidden="true">
                      <use href="#i-check" />
                    </svg>
                  </span>
                  {p}
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              variants={staggerContainer(0.08)}
              className="mt-10 grid grid-cols-3 gap-3"
            >
              {[
                { v: "1985", l: "Established" },
                { v: "4", l: "Continents" },
                { v: "100T+", l: "Yearly capacity" },
              ].map((s) => (
                <motion.div
                  key={s.l}
                  variants={fadeUp}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center"
                >
                  <p className="text-gold font-serif text-2xl">{s.v}</p>
                  <p className="text-white/55 text-[10px] uppercase tracking-wider mt-1">
                    {s.l}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.form
            id="order"
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
              (e.currentTarget as HTMLFormElement).reset();
            }}
            className="bg-white text-charcoal rounded-3xl p-7 sm:p-9 shadow-e4 relative"
            noValidate
          >
            <span className="absolute -top-px inset-x-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

            <div className="flex items-center gap-2 text-saffron text-[11px] font-semibold uppercase tracking-[0.22em]">
              <svg className="w-4 h-4" aria-hidden="true">
                <use href="#i-leaf" />
              </svg>
              Bulk Inquiry
            </div>
            <h3 className="font-serif text-3xl mt-1">Get a quote in 24 hours.</h3>
            <p className="mt-2 text-charcoal/65 text-sm">
              Share a few details — we&apos;ll respond within 24 hours.
            </p>

            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-medium">Full name</span>
                <input
                  required
                  type="text"
                  name="name"
                  placeholder="Your name"
                  className="mt-1.5 block w-full rounded-xl border border-cream-200 bg-cream-50 px-4 py-3 focus:ring-2 focus:ring-gold focus:border-gold outline-none"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">
                  Company <span className="text-charcoal/50">(optional)</span>
                </span>
                <input
                  type="text"
                  name="company"
                  placeholder="Company name"
                  className="mt-1.5 block w-full rounded-xl border border-cream-200 bg-cream-50 px-4 py-3 focus:ring-2 focus:ring-gold focus:border-gold outline-none"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Email</span>
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="you@business.com"
                  className="mt-1.5 block w-full rounded-xl border border-cream-200 bg-cream-50 px-4 py-3 focus:ring-2 focus:ring-gold focus:border-gold outline-none"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Phone</span>
                <input
                  required
                  type="tel"
                  name="phone"
                  placeholder="+91 98xxx xxxxx"
                  className="mt-1.5 block w-full rounded-xl border border-cream-200 bg-cream-50 px-4 py-3 focus:ring-2 focus:ring-gold focus:border-gold outline-none"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm font-medium">Quantity / Use case</span>
                <select
                  required
                  name="qty"
                  defaultValue=""
                  className="mt-1.5 block w-full rounded-xl border border-cream-200 bg-cream-50 px-4 py-3 focus:ring-2 focus:ring-gold focus:border-gold outline-none"
                >
                  <option value="" disabled>
                    Select…
                  </option>
                  <option>D2C — single home order</option>
                  <option>Retail — 50 to 500 crates</option>
                  <option>Distribution — 500+ crates</option>
                  <option>Export — full container</option>
                  <option>Corporate gifting</option>
                  <option>Private label / White-label</option>
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm font-medium">Notes</span>
                <textarea
                  name="notes"
                  rows={3}
                  placeholder="Delivery city, dates, packaging preferences…"
                  className="mt-1.5 block w-full rounded-xl border border-cream-200 bg-cream-50 px-4 py-3 focus:ring-2 focus:ring-gold focus:border-gold outline-none"
                />
              </label>
            </div>

            <button
              type="submit"
              className="mt-6 w-full btn-gold inline-flex items-center justify-center gap-2 text-white font-semibold py-3.5 rounded-full cursor-pointer"
            >
              Send Inquiry
              <svg className="w-4 h-4" aria-hidden="true">
                <use href="#i-arrow" />
              </svg>
            </button>
            {submitted && (
              <p className="mt-4 text-leaf text-sm font-medium flex items-center gap-2">
                <svg className="w-4 h-4" aria-hidden="true">
                  <use href="#i-check" />
                </svg>
                Thank you — we&apos;ll be in touch within 24 hours.
              </p>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}
