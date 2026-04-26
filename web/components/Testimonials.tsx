"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";

const QUOTES = [
  {
    avatar: "P",
    quote:
      "Best Alphonso I've tasted in years. The aroma alone took me back to my Konkan summers.",
    name: "Priya Deshmukh",
    detail: "Mumbai · Repeat customer · 3 seasons",
  },
  {
    avatar: "A",
    quote:
      "Pure farm freshness. No carbide, no after-taste — just real, ripe mango. Sent boxes to all my clients.",
    name: "Arjun Mehta",
    detail: "Bengaluru · Corporate gifting · 60 crates",
  },
  {
    avatar: "N",
    quote:
      "Crate arrived perfectly cushioned. Every mango ripened evenly. This is what real Alphonso is supposed to taste like.",
    name: "Neha Kulkarni",
    detail: "Pune · First-time buyer",
  },
];

export default function Testimonials() {
  return (
    <section className="relative bg-cream-50 overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="gold-rule">Loved by Mango People</span>
          <h2 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl text-charcoal leading-[1.05]">
            Words from our table{" "}
            <em className="grad-text-static not-italic">to yours.</em>
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mt-10 flex flex-wrap items-center justify-center gap-6 text-charcoal/65 text-sm"
        >
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5 text-gold">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className="w-5 h-5" aria-hidden="true">
                  <use href="#i-star" />
                </svg>
              ))}
            </div>
            <span className="font-serif text-2xl text-charcoal">4.9</span>
            <span>· 1,200+ reviews</span>
          </div>
          <span className="hidden sm:inline-block w-px h-4 bg-charcoal/20" />
          <span>96% would recommend</span>
          <span className="hidden sm:inline-block w-px h-4 bg-charcoal/20" />
          <span>2,500+ households served</span>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={staggerContainer(0.12)}
          className="mt-14 grid md:grid-cols-3 gap-6 lg:gap-8"
        >
          {QUOTES.map((q) => (
            <motion.figure
              key={q.name}
              variants={fadeUp}
              className="card-warm p-8 relative"
            >
              <svg
                aria-hidden="true"
                className="absolute -top-4 left-7 w-10 h-10 text-gold opacity-90"
              >
                <use href="#i-quote" />
              </svg>
              <div className="flex gap-0.5 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className="w-4 h-4" aria-hidden="true">
                    <use href="#i-star" />
                  </svg>
                ))}
              </div>
              <blockquote className="mt-5 font-serif text-xl sm:text-2xl leading-snug text-charcoal italic">
                &ldquo;{q.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="w-11 h-11 rounded-full grad-gold-rich inline-flex items-center justify-center text-white font-semibold ring-2 ring-white shadow-e1">
                  {q.avatar}
                </span>
                <span>
                  <span className="block font-medium text-charcoal">{q.name}</span>
                  <span className="block text-charcoal/55 text-xs">{q.detail}</span>
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
