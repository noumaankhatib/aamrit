"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";

// ─── Brand logo SVGs — modeled on the YESKAY brochure ─────────────────────────
// Each logo is a self-contained SVG so it scales crisply. Replace with PNG/JPG
// of an actual logo by swapping the `Logo` component for an <Image> element.

function MangoMark({ className = "w-12 h-12" }: { className?: string }) {
  // Stylized orange-mango-with-leaf icon used across the brand family
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <radialGradient id="mango-grad" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#FFD773" />
          <stop offset="55%" stopColor="#F4A300" />
          <stop offset="100%" stopColor="#B07300" />
        </radialGradient>
      </defs>
      {/* Stem & leaves */}
      <path
        d="M28 12 q-6 -4 -12 -2 q4 4 11 5"
        fill="#2E7D32"
        opacity="0.95"
      />
      <path
        d="M30 14 q4 -8 12 -8 q-2 8 -10 11"
        fill="#3a9c40"
      />
      <path d="M30 14 v6" stroke="#7A5000" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Mango body */}
      <ellipse cx="34" cy="38" rx="22" ry="22" fill="url(#mango-grad)" />
      <ellipse cx="27" cy="30" rx="6" ry="9" fill="#FFE5A6" opacity="0.7" />
    </svg>
  );
}

type Brand = {
  key: string;
  badge?: string;
  // The brand's logo block — sized identically across all brands for visual rhythm
  logo: React.ReactNode;
  tag: string;
};

const BRANDS: Brand[] = [
  {
    key: "aamrit",
    badge: "D2C",
    tag: "Premium · Direct-to-home",
    logo: (
      <div className="flex flex-col items-center justify-center">
        <MangoMark className="w-14 h-14" />
        <p className="mt-2 font-serif text-3xl font-semibold text-saffron tracking-tight italic">
          Aamrit
        </p>
        <span className="mt-1 px-3 py-0.5 rounded-full bg-gradient-to-r from-gold-200 via-gold to-gold-200 text-charcoal text-[10px] font-bold tracking-[0.2em] uppercase">
          Alphonso
        </span>
      </div>
    ),
  },
  {
    key: "ratnagiri-gold",
    tag: "Konkan flagship",
    logo: (
      <div className="flex flex-col items-center justify-center">
        <MangoMark className="w-14 h-14" />
        <p className="mt-2 font-serif text-2xl font-extrabold text-leaf tracking-wide">
          RATNAGIRI
        </p>
        <span className="mt-1 px-4 py-0.5 rounded-full bg-gradient-to-r from-gold-200 via-gold to-gold-200 text-charcoal text-[11px] font-bold tracking-[0.3em] uppercase shadow-e1">
          Gold
        </span>
      </div>
    ),
  },
  {
    key: "raigad-gold",
    tag: "Estate-grade",
    logo: (
      <div className="flex flex-col items-center justify-center">
        <MangoMark className="w-14 h-14" />
        <p className="mt-2 font-serif text-2xl font-extrabold text-leaf tracking-wide">
          RAIGAD
        </p>
        <span className="mt-1 px-4 py-0.5 rounded-full bg-gradient-to-r from-gold-200 via-gold to-gold-200 text-charcoal text-[11px] font-bold tracking-[0.3em] uppercase shadow-e1">
          Gold
        </span>
      </div>
    ),
  },
  {
    key: "mango-basket",
    tag: "Wholesale",
    logo: (
      <div className="flex flex-col items-center justify-center">
        {/* Stylized basket with mangoes */}
        <svg className="w-14 h-14" viewBox="0 0 64 64" aria-hidden="true">
          <ellipse cx="32" cy="42" rx="22" ry="6" fill="#7A5000" opacity="0.25" />
          <path
            d="M12 30 L52 30 L48 50 Q48 54 44 54 L20 54 Q16 54 16 50 Z"
            fill="#8C5A00"
            stroke="#5A3C00"
            strokeWidth="1.5"
          />
          <path
            d="M14 32 L50 32"
            stroke="#5A3C00"
            strokeWidth="1"
            strokeDasharray="2 3"
          />
          {/* Mangoes peeking out */}
          <ellipse cx="22" cy="28" rx="6" ry="7" fill="#F4A300" />
          <ellipse cx="32" cy="26" rx="7" ry="8" fill="#E07A00" />
          <ellipse cx="42" cy="28" rx="6" ry="7" fill="#F6BF45" />
          {/* Handle */}
          <path
            d="M18 30 Q32 14 46 30"
            fill="none"
            stroke="#5A3C00"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
        <p className="mt-2 font-serif text-xl italic text-saffron font-semibold leading-tight">
          Mango
        </p>
        <p className="font-serif text-xl italic text-leaf font-bold leading-tight -mt-1">
          Basket
        </p>
      </div>
    ),
  },
  {
    key: "westmango",
    tag: "Agro-export",
    logo: (
      <div className="flex flex-col items-center justify-center">
        {/* West-pointing mango with leaf */}
        <svg className="w-14 h-14" viewBox="0 0 64 64" aria-hidden="true">
          <path
            d="M22 8 q-4 -2 -8 0 q4 4 8 4"
            fill="#2E7D32"
          />
          <ellipse cx="32" cy="34" rx="22" ry="20" fill="#F4A300" />
          <ellipse cx="24" cy="26" rx="6" ry="8" fill="#FFE5A6" opacity="0.6" />
          <path d="M22 14 v8" stroke="#7A5000" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <p className="mt-2 font-serif text-xl text-leaf-700 font-extrabold tracking-tight">
          west<span className="text-saffron">mango</span>
        </p>
        <span className="mt-0.5 text-[9px] tracking-[0.32em] uppercase text-charcoal/70 font-semibold">
          Agro · Export
        </span>
      </div>
    ),
  },
];

export default function Brands() {
  return (
    <section className="relative bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="gold-rule">Yeskay Family of Brands</span>
          <h2 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl text-charcoal leading-[1.05]">
            One farm group. Five brands.{" "}
            <span className="grad-text-static">One promise.</span>
          </h2>
          <p className="mt-5 text-charcoal/70 text-lg leading-relaxed">
            Each brand serves a different audience — from premium D2C to bulk export — but
            every fruit traces back to the same orchards.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={staggerContainer(0.1)}
          className="mt-14 grid grid-cols-2 lg:grid-cols-5 gap-5"
        >
          {BRANDS.map((b) => (
            <motion.div
              key={b.key}
              variants={fadeUp}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className={`relative bg-white rounded-3xl border-2 p-7 flex flex-col items-center text-center shadow-e1 hover:shadow-e3 transition-shadow ${
                b.key === "aamrit" ? "border-gold ring-2 ring-gold/30" : "border-gold/40"
              }`}
            >
              {b.badge && (
                <span className="absolute -top-3 right-5 px-3 py-1 rounded-full ribbon text-white text-[10px] font-bold tracking-wider uppercase shadow-e1">
                  {b.badge}
                </span>
              )}
              <div className="min-h-[140px] flex items-center justify-center">{b.logo}</div>
              <p className="mt-4 text-charcoal/60 text-xs tracking-wide">{b.tag}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
