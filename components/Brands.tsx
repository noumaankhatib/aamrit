"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";

// ─── Brand logo SVGs — modeled on the YESKAY brochure ─────────────────────────
// Each logo is a self-contained SVG so it scales crisply. Replace with PNG/JPG
// of an actual logo by swapping the `Logo` component for an <Image> element.

function MangoMark({ className = "w-12 h-12", id = "default" }: { className?: string; id?: string }) {
  const gradId = `mango-grad-${id}`;
  const highlightId = `mango-highlight-${id}`;
  const shadowId = `mango-shadow-${id}`;
  const leafGradId = `leaf-grad-${id}`;
  
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        {/* Main mango body gradient - rich golden orange */}
        <radialGradient id={gradId} cx="30%" cy="25%" r="75%">
          <stop offset="0%" stopColor="#FFE066" />
          <stop offset="25%" stopColor="#FFCC33" />
          <stop offset="50%" stopColor="#F4A300" />
          <stop offset="75%" stopColor="#E07A00" />
          <stop offset="100%" stopColor="#B85C00" />
        </radialGradient>
        {/* Top highlight for 3D effect */}
        <radialGradient id={highlightId} cx="35%" cy="30%" r="40%">
          <stop offset="0%" stopColor="#FFF5D6" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#FFE5A6" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#F4A300" stopOpacity="0" />
        </radialGradient>
        {/* Bottom shadow gradient */}
        <radialGradient id={shadowId} cx="50%" cy="80%" r="50%">
          <stop offset="0%" stopColor="#8B4513" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#8B4513" stopOpacity="0" />
        </radialGradient>
        {/* Leaf gradient */}
        <linearGradient id={leafGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4CAF50" />
          <stop offset="50%" stopColor="#2E7D32" />
          <stop offset="100%" stopColor="#1B5E20" />
        </linearGradient>
      </defs>
      
      {/* Drop shadow */}
      <ellipse cx="32" cy="54" rx="16" ry="4" fill="#000" opacity="0.1" />
      
      {/* Left leaf - larger, curved */}
      <path
        d="M26 16 Q14 8 10 12 Q14 18 24 18 Q20 14 26 16"
        fill={`url(#${leafGradId})`}
      />
      {/* Leaf vein */}
      <path
        d="M24 16 Q18 14 12 13"
        fill="none"
        stroke="#1B5E20"
        strokeWidth="0.5"
        opacity="0.6"
      />
      
      {/* Right leaf - smaller accent */}
      <path
        d="M32 14 Q38 6 44 8 Q40 14 32 16"
        fill="#43A047"
      />
      <path
        d="M34 13 Q38 10 42 9"
        fill="none"
        stroke="#2E7D32"
        strokeWidth="0.4"
        opacity="0.5"
      />
      
      {/* Stem */}
      <path 
        d="M28 16 Q30 18 30 22" 
        stroke="#5D4037" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        fill="none" 
      />
      <path 
        d="M29 17 Q30 18 30 20" 
        stroke="#8D6E63" 
        strokeWidth="1" 
        strokeLinecap="round" 
        fill="none" 
      />
      
      {/* Mango body - main shape with characteristic curve */}
      <path
        d="M30 20 
           Q48 22 54 36 
           Q56 46 50 52 
           Q42 58 32 56 
           Q18 54 12 44 
           Q8 34 14 26 
           Q20 18 30 20"
        fill={`url(#${gradId})`}
      />
      
      {/* Bottom shadow overlay */}
      <ellipse cx="32" cy="48" rx="18" ry="10" fill={`url(#${shadowId})`} />
      
      {/* Main highlight - gives 3D roundness */}
      <ellipse cx="26" cy="32" rx="10" ry="12" fill={`url(#${highlightId})`} />
      
      {/* Secondary smaller highlight */}
      <ellipse cx="22" cy="28" rx="4" ry="5" fill="#FFF8E1" opacity="0.5" />
      
      {/* Subtle skin texture dots */}
      <circle cx="38" cy="38" r="0.8" fill="#D46A00" opacity="0.3" />
      <circle cx="42" cy="42" r="0.6" fill="#D46A00" opacity="0.25" />
      <circle cx="36" cy="46" r="0.7" fill="#D46A00" opacity="0.2" />
      <circle cx="28" cy="44" r="0.5" fill="#D46A00" opacity="0.2" />
      
      {/* Rim light on right edge */}
      <path
        d="M50 36 Q54 42 50 50"
        fill="none"
        stroke="#FFE082"
        strokeWidth="1"
        opacity="0.4"
        strokeLinecap="round"
      />
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
        <div className="relative">
          <MangoMark className="w-16 h-16 drop-shadow-lg" id="aamrit" />
          <div className="absolute -inset-2 bg-gradient-to-b from-gold/20 to-transparent rounded-full blur-md -z-10" />
        </div>
        <p className="mt-3 font-serif text-3xl font-semibold text-saffron tracking-tight italic">
          Aamrit
        </p>
        <span className="mt-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-gold-100 via-gold-200 to-gold-100 text-charcoal text-[10px] font-bold tracking-[0.2em] uppercase shadow-sm border border-gold/30">
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
        <div className="relative">
          <MangoMark className="w-16 h-16 drop-shadow-lg" id="ratnagiri" />
        </div>
        <p className="mt-3 font-serif text-2xl font-extrabold text-leaf tracking-wide">
          RATNAGIRI
        </p>
        <span className="mt-1.5 px-5 py-1 rounded-full bg-gradient-to-r from-gold-100 via-gold-300 to-gold-100 text-charcoal text-[11px] font-bold tracking-[0.3em] uppercase shadow-sm border border-gold/40">
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
        <div className="relative">
          <MangoMark className="w-16 h-16 drop-shadow-lg" id="raigad" />
        </div>
        <p className="mt-3 font-serif text-2xl font-extrabold text-leaf tracking-wide">
          RAIGAD
        </p>
        <span className="mt-1.5 px-5 py-1 rounded-full bg-gradient-to-r from-gold-100 via-gold-300 to-gold-100 text-charcoal text-[11px] font-bold tracking-[0.3em] uppercase shadow-sm border border-gold/40">
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
        {/* Stylized basket with realistic mangoes */}
        <svg className="w-16 h-16 drop-shadow-lg" viewBox="0 0 64 64" aria-hidden="true">
          <defs>
            <linearGradient id="basket-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#A67C52" />
              <stop offset="50%" stopColor="#8B5A2B" />
              <stop offset="100%" stopColor="#5D3A1A" />
            </linearGradient>
            <radialGradient id="basket-mango1" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFE066" />
              <stop offset="50%" stopColor="#F4A300" />
              <stop offset="100%" stopColor="#B85C00" />
            </radialGradient>
            <radialGradient id="basket-mango2" cx="35%" cy="25%" r="70%">
              <stop offset="0%" stopColor="#FFCC33" />
              <stop offset="50%" stopColor="#E07A00" />
              <stop offset="100%" stopColor="#A04800" />
            </radialGradient>
            <radialGradient id="basket-mango3" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFD54F" />
              <stop offset="50%" stopColor="#FFB300" />
              <stop offset="100%" stopColor="#C68400" />
            </radialGradient>
          </defs>
          {/* Shadow */}
          <ellipse cx="32" cy="56" rx="18" ry="4" fill="#000" opacity="0.1" />
          {/* Basket body */}
          <path
            d="M10 32 L54 32 L50 52 Q50 56 46 56 L18 56 Q14 56 14 52 Z"
            fill="url(#basket-grad)"
          />
          {/* Basket weave lines */}
          <path d="M14 36 L50 36" stroke="#5D3A1A" strokeWidth="0.8" opacity="0.5" />
          <path d="M15 42 L49 42" stroke="#5D3A1A" strokeWidth="0.8" opacity="0.5" />
          <path d="M16 48 L48 48" stroke="#5D3A1A" strokeWidth="0.8" opacity="0.5" />
          {/* Vertical weaves */}
          <path d="M24 32 L22 56" stroke="#5D3A1A" strokeWidth="0.5" opacity="0.4" />
          <path d="M32 32 L32 56" stroke="#5D3A1A" strokeWidth="0.5" opacity="0.4" />
          <path d="M40 32 L42 56" stroke="#5D3A1A" strokeWidth="0.5" opacity="0.4" />
          {/* Mangoes - with highlights */}
          <ellipse cx="22" cy="28" rx="7" ry="8" fill="url(#basket-mango1)" />
          <ellipse cx="19" cy="25" rx="2" ry="3" fill="#FFF8E1" opacity="0.5" />
          <ellipse cx="32" cy="25" rx="8" ry="9" fill="url(#basket-mango2)" />
          <ellipse cx="28" cy="22" rx="2.5" ry="3.5" fill="#FFF8E1" opacity="0.5" />
          <ellipse cx="43" cy="27" rx="7" ry="8" fill="url(#basket-mango3)" />
          <ellipse cx="40" cy="24" rx="2" ry="3" fill="#FFF8E1" opacity="0.5" />
          {/* Small leaves on mangoes */}
          <path d="M20 20 Q18 18 16 19 Q18 21 20 20" fill="#2E7D32" />
          <path d="M31 16 Q33 14 35 15 Q33 17 31 16" fill="#43A047" />
          <path d="M42 19 Q40 17 38 18 Q40 20 42 19" fill="#2E7D32" />
          {/* Handle */}
          <path
            d="M16 32 Q32 12 48 32"
            fill="none"
            stroke="#5D3A1A"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M17 32 Q32 14 47 32"
            fill="none"
            stroke="#8B5A2B"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <p className="mt-3 font-serif text-xl italic text-saffron font-semibold leading-tight">
          Mango
        </p>
        <p className="font-serif text-xl italic text-leaf font-bold leading-tight -mt-0.5">
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
        <div className="relative">
          <MangoMark className="w-16 h-16 drop-shadow-lg" id="westmango" />
          {/* Globe overlay hint */}
          <svg className="absolute -bottom-1 -right-1 w-6 h-6" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="10" fill="#2E7D32" opacity="0.9" />
            <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="#fff" strokeWidth="0.8" opacity="0.6" />
            <path d="M12 2 v20" fill="none" stroke="#fff" strokeWidth="0.6" opacity="0.5" />
            <path d="M2 12 h20" fill="none" stroke="#fff" strokeWidth="0.6" opacity="0.5" />
          </svg>
        </div>
        <p className="mt-3 font-serif text-xl text-leaf-700 font-extrabold tracking-tight">
          west<span className="text-saffron">mango</span>
        </p>
        <span className="mt-1 text-[9px] tracking-[0.32em] uppercase text-charcoal/60 font-semibold">
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
          className="mt-10 sm:mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5"
        >
          {BRANDS.map((b) => (
            <motion.div
              key={b.key}
              variants={fadeUp}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className={`relative bg-white rounded-2xl sm:rounded-3xl border-2 p-4 sm:p-5 lg:p-7 flex flex-col items-center text-center shadow-e1 hover:shadow-e3 transition-shadow ${
                b.key === "aamrit" ? "border-gold ring-2 ring-gold/30" : "border-gold/40"
              }`}
            >
              {b.badge && (
                <span className="absolute -top-2 sm:-top-3 right-3 sm:right-5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full ribbon text-white text-[8px] sm:text-[10px] font-bold tracking-wider uppercase shadow-e1">
                  {b.badge}
                </span>
              )}
              <div className="min-h-[100px] sm:min-h-[120px] lg:min-h-[140px] flex items-center justify-center">{b.logo}</div>
              <p className="mt-2 sm:mt-3 lg:mt-4 text-charcoal/60 text-[10px] sm:text-xs tracking-wide">{b.tag}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
