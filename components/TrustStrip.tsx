"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";

const ITEMS = [
  { icon: "i-medal", label: "17+ years of mango farming" },
  { icon: "i-tree", label: "Direct from owned farms" },
  { icon: "i-shield", label: "100% no-carbide promise" },
  { icon: "i-truck", label: "Free delivery all over India" },
  { icon: "i-globe", label: "Export-ready (Westmango)" },
  { icon: "i-heart", label: "100% satisfaction guarantee" },
];

export default function TrustStrip() {
  return (
    <section id="trust-strip" className="relative bg-cream-50 border-b border-cream-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-7">
        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={staggerContainer(0.06)}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-4 gap-x-2 lg:gap-x-4 text-charcoal/70 text-xs sm:text-sm font-medium"
        >
          {ITEMS.map((item) => (
            <motion.li
              key={item.label}
              variants={fadeUp}
              className="flex items-center gap-2.5"
            >
              <span className="w-7 h-7 rounded-full grad-gold inline-flex items-center justify-center text-white shadow-e1">
                <svg className="w-3.5 h-3.5" aria-hidden="true">
                  <use href={`#${item.icon}`} />
                </svg>
              </span>
              {item.label}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
