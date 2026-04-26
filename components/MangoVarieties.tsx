"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";

type TasteProfile = {
  sweetness: { value: number; word: string };
  aroma: { value: number; word: string };
  fiber: { value: number; word: string }; // 0 = none, 5 = lots
};

type Variety = {
  name: string;
  tagline: string; // short single-line poetic descriptor under the name
  origin: string; // long origin line, used in photo overlay
  originBadge: string;
  badgeIcon: "i-shield" | "i-pin";
  signature?: boolean;
  description: string;
  image: string;
  imageAlt: string;
  taste: TasteProfile;
  notes: string[];
  noteTone: "gold" | "leaf";
  ctaLabel: string;
  ctaTone: "saffron" | "leaf";
  size: "wide" | "narrow";
};

const VARIETIES: Variety[] = [
  {
    name: "Alphonso",
    tagline: "The king of mangoes",
    origin: "Origin · Ratnagiri · GI-tag belt",
    originBadge: "GI · Ratnagiri",
    badgeIcon: "i-shield",
    signature: true,
    description:
      "Rich, creamy, fiber-free flesh with an aroma that fills the room. Grown in Ratnagiri's coastal red-soil belt — the only place Alphonso truly comes alive.",
    image:
      "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=1600&q=88",
    imageAlt: "Ripe Alphonso mangoes with deep golden colour",
    taste: {
      sweetness: { value: 5, word: "Lush" },
      aroma: { value: 5, word: "Floral" },
      fiber: { value: 0, word: "None" },
    },
    notes: ["Creamy texture", "Saffron-gold flesh", "Floral aroma", "GI-zone Ratnagiri"],
    noteTone: "gold",
    ctaLabel: "Order Alphonso",
    ctaTone: "saffron",
    size: "wide",
  },
  {
    name: "Kesar",
    tagline: "The Maharashtrian favourite",
    origin: "Origin · Maharashtra",
    originBadge: "Maharashtra",
    badgeIcon: "i-pin",
    description:
      "Vibrant, sweet, and refreshing. Loved for its bold yellow flesh and balanced tang — perfect for desserts, lassis, and gifting.",
    image:
      "https://images.unsplash.com/photo-1605027990121-cbae9e0642df?auto=format&fit=crop&w=1200&q=88",
    imageAlt: "Bright yellow Kesar mangoes in a basket",
    taste: {
      sweetness: { value: 4, word: "Bold" },
      aroma: { value: 4, word: "Bright" },
      fiber: { value: 1, word: "Light" },
    },
    notes: ["Bold sweetness", "Hint of tang", "Family favourite"],
    noteTone: "leaf",
    ctaLabel: "Order Kesar",
    ctaTone: "leaf",
    size: "narrow",
  },
];

// ─── Premium taste meter — labeled bars with named value ────────────────────
function TasteMeter({
  label,
  value,
  word,
  max = 5,
  tone = "gold",
}: {
  label: string;
  value: number;
  word: string;
  max?: number;
  tone?: "gold" | "leaf";
}) {
  const fillClass = tone === "gold" ? "bg-gold" : "bg-leaf";
  return (
    <div className="rounded-xl bg-white border border-cream-200 px-3.5 py-3 text-center shadow-e1">
      <p className="text-[9px] uppercase tracking-[0.2em] text-charcoal/55 font-semibold">
        {label}
      </p>
      <p
        className={`mt-1.5 font-serif text-base font-semibold ${
          tone === "gold" ? "text-saffron" : "text-leaf-700"
        }`}
      >
        {word}
      </p>
      <div className="mt-2 flex justify-center gap-0.5">
        {Array.from({ length: max }).map((_, i) => (
          <span
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              i < value ? fillClass : "bg-charcoal/15"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Variety card ────────────────────────────────────────────────────────────
function VarietyCard({ variety }: { variety: Variety }) {
  const colSpan = variety.size === "wide" ? "lg:col-span-3" : "lg:col-span-2";
  const noteClass =
    variety.noteTone === "gold"
      ? "bg-gold-50 text-saffron-700 border-gold/30 hover:bg-gold-100"
      : "bg-leaf/10 text-leaf-700 border-leaf/30 hover:bg-leaf/15";
  const ctaBg =
    variety.ctaTone === "saffron"
      ? "btn-gold text-white"
      : "bg-leaf hover:bg-leaf-600 text-white";

  return (
    <motion.article
      variants={fadeUp}
      className={`${colSpan} relative group flex flex-col rounded-3xl bg-white shadow-e2 ring-1 ring-gold/15 overflow-hidden hover:shadow-e3 hover:ring-gold/30 transition-all duration-500`}
    >
      {/* ─── Photo with full overlay ─── */}
      <div className="relative h-72 sm:h-80 lg:h-[22rem] overflow-hidden">
        <Image
          src={variety.image}
          alt={variety.imageAlt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.07]"
        />

        {/* Layered overlay — top dim for chips, deep bottom scrim for title */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

        {/* Top-left signature ribbon (only on Alphonso) */}
        {variety.signature && (
          <div className="absolute top-5 left-5 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ribbon text-white text-[10px] font-bold tracking-[0.18em] uppercase shadow-e1">
            <svg className="w-3 h-3" aria-hidden="true">
              <use href="#i-star" />
            </svg>
            Signature
          </div>
        )}

        {/* Top-right origin badge */}
        <div className="absolute top-5 right-5 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur text-leaf-700 text-[10px] font-bold tracking-[0.18em] uppercase border border-leaf/30 shadow-e1">
          <svg className="w-3 h-3" aria-hidden="true">
            <use href={`#${variety.badgeIcon}`} />
          </svg>
          {variety.originBadge}
        </div>

        {/* Bottom title block — name + tagline + origin */}
        <div className="absolute bottom-0 inset-x-0 p-6 sm:p-7">
          <p className="text-gold-200 text-[10px] uppercase tracking-[0.32em] font-semibold">
            {variety.tagline}
          </p>
          <h3
            className="mt-1 font-serif text-white text-5xl sm:text-6xl leading-none tracking-tight"
            style={{
              textShadow:
                "0 2px 4px rgba(0,0,0,0.6), 0 8px 30px rgba(0,0,0,0.5)",
            }}
          >
            {variety.name}
          </h3>
          <p className="mt-2.5 inline-flex items-center gap-2 text-white/85 text-xs font-medium tracking-wide">
            <svg className="w-3.5 h-3.5 text-gold" aria-hidden="true">
              <use href="#i-pin" />
            </svg>
            {variety.origin}
          </p>
        </div>
      </div>

      {/* ─── Body ─── */}
      <div className="flex-1 flex flex-col p-6 sm:p-8">
        <p className="text-charcoal/80 text-base leading-relaxed">
          {variety.description}
        </p>

        {/* Taste profile — section label + 3 labeled meters */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-px flex-1 bg-cream-200" />
            <p className="text-saffron text-[10px] font-bold uppercase tracking-[0.32em]">
              Tasting Notes
            </p>
            <span className="h-px flex-1 bg-cream-200" />
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            <TasteMeter
              label="Sweetness"
              value={variety.taste.sweetness.value}
              word={variety.taste.sweetness.word}
              tone={variety.noteTone}
            />
            <TasteMeter
              label="Aroma"
              value={variety.taste.aroma.value}
              word={variety.taste.aroma.word}
              tone={variety.noteTone}
            />
            <TasteMeter
              label="Fiber"
              value={variety.taste.fiber.value}
              word={variety.taste.fiber.word}
              tone={variety.noteTone}
            />
          </div>
        </div>

        {/* Notes pills with leading gold dot */}
        <ul className="mt-5 flex flex-wrap gap-2 text-sm">
          {variety.notes.map((n) => (
            <li
              key={n}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium border transition-colors cursor-default ${noteClass}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  variety.noteTone === "gold" ? "bg-gold" : "bg-leaf"
                }`}
              />
              {n}
            </li>
          ))}
        </ul>

        {/* CTA — full pill button at the bottom of the card */}
        <a
          href="#packaging"
          className={`mt-auto pt-7 inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-200 ${ctaBg} px-5 py-3.5 text-sm tracking-wide shadow-e1 hover:shadow-glow`}
          style={{
            // mt-auto pushes to bottom; pt-7 above ensures the gap; the actual button is the inner span
          }}
        >
          {variety.ctaLabel}
          <svg
            className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          >
            <use href="#i-arrow" />
          </svg>
        </a>
      </div>
    </motion.article>
  );
}

export default function MangoVarieties() {
  return (
    <section
      id="varieties"
      className="relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 100% 80% at 50% 0%, #FFF8EC 0%, #FCEBC2 60%, #FFF4E5 100%)",
      }}
    >
      {/* Top warm halo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-40 bg-[radial-gradient(50%_60%_at_50%_0%,rgba(244,163,0,0.25),transparent)] pointer-events-none" />

      {/* Decorative leaf watermarks */}
      <svg
        aria-hidden="true"
        className="hidden md:block absolute top-32 -left-10 w-56 h-56 text-leaf/10 -rotate-12 pointer-events-none"
      >
        <use href="#i-leaf" />
      </svg>
      <svg
        aria-hidden="true"
        className="hidden md:block absolute bottom-32 -right-12 w-64 h-64 text-gold/15 rotate-12 pointer-events-none"
      >
        <use href="#i-leaf" />
      </svg>

      {/* Subtle paper grain */}
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
          className="max-w-3xl mx-auto text-center"
        >
          <span className="gold-rule">Our Mangoes</span>
          <h2 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl text-charcoal leading-[1.04] tracking-[-0.02em]">
            A taste worth waiting{" "}
            <em className="grad-text-static not-italic font-semibold">all year</em> for.
          </h2>
          <p className="mt-5 text-charcoal/70 text-base sm:text-lg leading-relaxed">
            Two varieties, hand-selected from our orchards — each one ripened the way nature
            intended, never with chemicals.
          </p>

          {/* Decorative flourish */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold" />
            <svg className="w-5 h-5 text-gold" aria-hidden="true">
              <use href="#i-mango" />
            </svg>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold" />
          </div>
        </motion.div>

        {/* ─── Cards ─── */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={staggerContainer(0.18)}
          className="mt-12 lg:mt-14 grid lg:grid-cols-5 gap-6 lg:gap-7"
        >
          {VARIETIES.map((v) => (
            <VarietyCard key={v.name} variety={v} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
