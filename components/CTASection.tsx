"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";

export default function CTASection() {
  return (
    <section className="relative grad-warm overflow-hidden">
      <motion.div
        aria-hidden="true"
        className="absolute -top-12 left-10 w-24 h-32 rounded-[50%] opacity-50"
        style={{
          background: "radial-gradient(circle at 28% 28%, #FFE5A6, #F4A300 55%, #B07300 100%)",
        }}
        animate={{ y: [0, 8, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute -top-8 right-1/4 w-16 h-24 rounded-[50%] opacity-40"
        style={{
          background: "radial-gradient(circle at 28% 28%, #FFE5A6, #F4A300 55%, #B07300 100%)",
        }}
        animate={{ y: [0, 8, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute top-0 right-10 w-20 h-28 rounded-[50%] opacity-50"
        style={{
          background: "radial-gradient(circle at 28% 28%, #FFE5A6, #F4A300 55%, #B07300 100%)",
        }}
        animate={{ y: [0, 8, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
      />

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        variants={staggerContainer(0.1)}
        className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-28 lg:py-40 text-center"
      >
        <motion.span variants={fadeUp} className="gold-rule">
          Limited Mango Season
        </motion.span>
        <motion.h2
          variants={fadeUp}
          className="mt-5 font-serif text-5xl sm:text-6xl lg:text-7xl text-charcoal leading-[1.02]"
        >
          Experience the taste of <span className="grad-text">Aamrit.</span>
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="mt-6 text-charcoal/75 text-lg sm:text-xl max-w-2xl mx-auto"
        >
          A season of sunlight, rain, and patience — packed in a single wooden crate.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-wrap justify-center gap-3 cta-halo"
        >
          {/* Primary CTA — subtle pulse, scale + color deepen on hover */}
          <motion.a
            href="#packaging"
            className="btn-gold animate-cta-pulse inline-flex items-center gap-2 text-white font-semibold px-8 py-4 rounded-full cursor-pointer text-lg"
            whileHover={{ scale: 1.04, filter: "saturate(1.15) brightness(0.96)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
          >
            Order Fresh Mangoes
            <svg className="w-5 h-5" aria-hidden="true">
              <use href="#i-arrow" />
            </svg>
          </motion.a>

          <motion.a
            href="https://wa.me/919999999999?text=Hi%20Aamrit%2C%20I%27d%20like%20to%20know%20more%20about%20your%20mangoes."
            className="inline-flex items-center gap-2 bg-leaf hover:bg-leaf-600 text-white font-semibold px-7 py-4 rounded-full cursor-pointer text-lg shadow-e2"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
          >
            <svg className="w-5 h-5" aria-hidden="true">
              <use href="#i-whatsapp" />
            </svg>
            Chat with us
          </motion.a>
        </motion.div>

        <motion.p variants={fadeUp} className="mt-6 text-charcoal/55 text-sm">
          Mango season is short. Pre-orders open every March.
        </motion.p>
      </motion.div>
    </section>
  );
}
