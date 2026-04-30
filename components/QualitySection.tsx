"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";

const DOS = [
  "5–7 day straw-cradle ripening",
  "Organic compost & mulching",
  "Drip irrigation, no flooding",
  "Each mango sorted on weight machine",
];

const DONTS = [
  "Calcium carbide (banned but common)",
  "Ethylene gas chambers",
  "Synthetic colour washes",
  "Buying from middlemen",
];

// Custom Framer Motion icon — animated leaf swirl
function AnimatedLeafIcon() {
  return (
    <motion.svg
      width="56"
      height="56"
      viewBox="0 0 64 64"
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
    >
      <motion.path
        d="M52 12c-22 0-36 12-36 28 0 4 1 7 2 10 12-22 28-30 36-32-4 6-20 14-28 28 14-4 26-14 26-34z"
        fill="#F4A300"
        variants={{
          hidden: { opacity: 0, scale: 0.7, rotate: -20 },
          show: {
            opacity: 1,
            scale: 1,
            rotate: 0,
            transition: { duration: 0.9, ease: [0.16, 0.84, 0.3, 1] },
          },
        }}
      />
    </motion.svg>
  );
}

export default function QualitySection() {
  return (
    <section className="relative bg-cream-50 overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        {/* Centered section heading */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="max-w-3xl mx-auto text-center"
        >
          <span className="gold-rule">The No-Carbide Promise</span>
          <h2 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl text-charcoal leading-[1.05]">
            Why ours <em className="grad-text-static not-italic">taste different.</em>
          </h2>
          <p className="mt-5 text-charcoal/75 text-lg leading-relaxed">
            Most Indian mangoes are force-ripened with calcium carbide — a chemical that
            ripens fruit overnight but kills its flavour, aroma and natural shine. We refuse
            to use it.
          </p>
        </motion.div>

        <div className="mt-16 grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
          {/* Visual — real ripe Alphonso photo with brand stamp */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            className="card-edge overflow-hidden bg-cream-50 relative group"
          >
            <div className="relative h-72 sm:h-[26rem] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1591073113125-e46713c829ed?auto=format&fit=crop&w=1600&q=88"
                alt="Sun-ripened Alphonso mangoes from Yeskay farms"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              {/* Warm bottom gradient for legibility */}
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/55 via-black/20 to-transparent pointer-events-none" />

              {/* "5–7 days slow ripening" callout — top right */}
              <div className="absolute top-5 right-5 px-3 py-2 rounded-2xl bg-white/95 backdrop-blur shadow-e2 text-center">
                <p className="text-saffron font-serif text-2xl leading-none">5–7</p>
                <p className="text-charcoal/55 text-[9px] uppercase tracking-[0.2em] mt-1">
                  Days · Slow ripening
                </p>
              </div>

              {/* Brand stamp — bottom left, brochure-style */}
              <div className="absolute left-5 bottom-5 flex items-center gap-3">
                <span className="relative inline-flex items-center justify-center w-12 h-12 rounded-full grad-gold-rich shadow-glow ring-2 ring-white/60">
                  <svg className="w-6 h-6 text-white" aria-hidden="true">
                    <use href="#i-mango" />
                  </svg>
                </span>
                <div>
                  <p className="font-serif text-white text-2xl leading-none">Aamrit</p>
                  <p className="text-gold-200 text-[10px] tracking-[0.3em] uppercase mt-1">
                    By Yeskay · Est. 1985
                  </p>
                </div>
              </div>

              {/* "100% No Carbide" seal — top left */}
              <div className="absolute top-5 left-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-leaf text-white text-[10px] font-bold uppercase tracking-[0.18em] shadow-e1 ring-2 ring-white/40">
                <svg className="w-3.5 h-3.5" aria-hidden="true">
                  <use href="#i-shield" />
                </svg>
                100% No Carbide
              </div>
            </div>
          </motion.div>

          {/* Body */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={staggerContainer(0.12)}
          >
            <motion.div variants={fadeUp} className="flex items-center gap-4">
              <AnimatedLeafIcon />
              <h3 className="font-serif text-2xl sm:text-3xl text-charcoal leading-tight">
                A century-old Konkani method.
              </h3>
            </motion.div>
            <motion.p variants={fadeUp} className="mt-4 text-charcoal/75 leading-relaxed">
              Calcium carbide ripens fruit overnight but kills aroma, flavour, and natural
              shine. It&apos;s also unhealthy.
            </motion.p>
            <motion.p variants={fadeUp} className="mt-3 text-charcoal/75 leading-relaxed">
              Our mangoes ripen in straw-lined crates over 5–7 days, the way they have for a
              hundred years in the Konkan. The difference is something you&apos;ll taste in
              the first bite.
            </motion.p>

            <motion.div
              variants={staggerContainer(0.1)}
              className="mt-7 grid sm:grid-cols-2 gap-3"
            >
              <motion.div
                variants={fadeUp}
                className="card-warm p-5 border border-leaf/30"
              >
                <div className="flex items-center gap-2 text-leaf font-semibold text-sm">
                  <svg className="w-4 h-4" aria-hidden="true">
                    <use href="#i-check" />
                  </svg>
                  What we do
                </div>
                <ul className="mt-2 text-sm text-charcoal/75 space-y-1.5">
                  {DOS.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </motion.div>
              <motion.div
                variants={fadeUp}
                className="card-warm p-5 border border-red-200"
              >
                <div className="flex items-center gap-2 text-red-600 font-semibold text-sm">
                  <svg className="w-4 h-4 rotate-45" aria-hidden="true">
                    <use href="#i-plus" />
                  </svg>
                  What we never do
                </div>
                <ul className="mt-2 text-sm text-charcoal/75 space-y-1.5">
                  {DONTS.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
