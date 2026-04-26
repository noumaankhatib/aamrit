"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { fadeUp, staggerContainer, viewportOnce, easing } from "@/lib/animations";
import CountUp from "./CountUp";

type DistrictKey = "ratnagiri" | "raigad";

type Plot = {
  name: string;
  acres: string;
  detail: string;
  active: boolean;
};

type District = {
  key: DistrictKey;
  label: string;
  region: string;
  ribbon: string;
  coords: string;
  description: string;
  totals: { plots: number; acres: number; trees: number };
  acresSuffix?: string;
  treesSuffix?: string;
  plots: Plot[];
  tehsils: string;
  mapImage: string;
  mapAlt: string;
  caption: string;
  hero: string;
  heroAlt: string;
  /** Three landscape photos shown as a strip at the bottom of the district card */
  gallery: { src: string; alt: string }[];
  /** Visual signature traits — small chips below district name */
  signature: string[];
};

const DISTRICTS: Record<DistrictKey, District> = {
  ratnagiri: {
    key: "ratnagiri",
    label: "Ratnagiri",
    region: "Konkan Coast · District",
    ribbon: "GI-tag belt",
    coords: "16.99° N · 73.31° E",
    description:
      "The original home of true Alphonso. Coastal red lateritic soil, Arabian Sea breeze, and decades of family knowledge come together to grow our most prized fruit.",
    totals: { plots: 5, acres: 150, trees: 6800 },
    acresSuffix: "+",
    treesSuffix: "+",
    plots: [
      { name: "Vilye", acres: "20 acres", detail: "1,400 trees", active: true },
      {
        name: "Dopheshwar (Barsu)",
        acres: "70 acres",
        detail: "5,400 trees",
        active: true,
      },
      { name: "Juwati", acres: "60 acres", detail: "Open land", active: false },
      { name: "Sakhar", acres: "—", detail: "Open land", active: false },
      { name: "Vikhare Gothane", acres: "—", detail: "Open land", active: false },
    ],
    tehsils: "Sangameshwar · Lanja · Ratnagiri",
    mapImage: "/img/ratnagiri-tehsil-map.png",
    mapAlt:
      "Tehsil-level map of Ratnagiri district showing Yeskay Mango Farm plots in Vilye, Dopheshwar Barsu, Sakhar, Juwati and Vikhare Gothane",
    caption: "5 plots · 150+ acres · 6,800+ Alphonso trees",
    // Hero — local file preferred. Drop /public/img/farms/ratnagiri.jpg to override.
    hero:
      "https://images.unsplash.com/photo-1605027990121-cbae9e0642df?auto=format&fit=crop&w=1800&q=88",
    heroAlt: "Sun-drenched Alphonso mangoes from Ratnagiri's red-soil coast",
    signature: ["Red lateritic soil", "Arabian Sea breeze", "GI-tag belt"],
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=900&q=85",
        alt: "Sliced Alphonso mango showing saffron-gold flesh",
      },
      {
        src: "https://images.unsplash.com/photo-1591073113125-e46713c829ed?auto=format&fit=crop&w=900&q=85",
        alt: "Mango orchard at golden hour in Ratnagiri",
      },
      {
        src: "https://images.unsplash.com/photo-1626777553635-471a96872f44?auto=format&fit=crop&w=900&q=85",
        alt: "Whole and cut Alphonso mangoes — Ratnagiri harvest",
      },
    ],
  },
  raigad: {
    key: "raigad",
    label: "Raigad",
    region: "Western Maharashtra · District",
    ribbon: "Largest estate",
    coords: "18.55° N · 73.13° E",
    description:
      "Our largest cultivation, spread across Chordhe, Mazgaon, Savroli and Saigaon. Scale that lets us serve homes, retailers, and exporters — without ever compromising care.",
    totals: { plots: 5, acres: 252, trees: 8400 },
    acresSuffix: "+",
    treesSuffix: "+",
    plots: [
      { name: "Chordhe (Estate)", acres: "157 acres", detail: "8,000 trees", active: true },
      { name: "Mazgaon", acres: "8 acres", detail: "250 trees", active: true },
      { name: "Chordhe (Plot 2)", acres: "12 acres", detail: "100 trees", active: true },
      { name: "Savroli", acres: "25 acres", detail: "50 trees", active: true },
      { name: "Saigaon", acres: "50 acres", detail: "Open land", active: false },
    ],
    tehsils: "Murud · Roha · Pen · Mahad",
    mapImage: "/img/raigad-tehsil-map.png",
    mapAlt:
      "Tehsil-level map of Raigad district showing Yeskay Mango Farm plots in Chordhe, Mazgaon, Savroli and Saigaon",
    caption: "5 plots · 252 acres · 8,400+ Alphonso trees",
    // Hero — placeholder until /public/img/farms/raigad.jpg is added.
    // Save your mango image to that path and replace this URL with "/img/farms/raigad.jpg".
    hero:
      "https://images.unsplash.com/photo-1622478230135-9ed3b5a6c75e?auto=format&fit=crop&w=1800&q=88",
    heroAlt:
      "Whole and cut mango with leaf — Raigad estate produce",
    signature: ["Sahyadri foothills", "Estate cultivation", "8,000-tree Chordhe"],
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1605027990121-cbae9e0642df?auto=format&fit=crop&w=900&q=85",
        alt: "Golden Alphonso mangoes — Raigad harvest",
      },
      {
        src: "https://images.unsplash.com/photo-1591073113125-e46713c829ed?auto=format&fit=crop&w=900&q=85",
        alt: "Mango orchard at golden hour in Raigad",
      },
      {
        src: "https://images.unsplash.com/photo-1622478230135-9ed3b5a6c75e?auto=format&fit=crop&w=900&q=85",
        alt: "Fresh mangoes in a basket — Raigad farm",
      },
    ],
  },
};

const CLIMATE = [
  {
    icon: "i-sun",
    title: "Coastal sun",
    body: "Long, bright days from January through May.",
  },
  {
    icon: "i-flask",
    title: "Red lateritic soil",
    body: "Iron-rich earth that gives Alphonso its colour.",
  },
  {
    icon: "i-globe",
    title: "Sea breeze",
    body: "Salty Arabian Sea air gives the floral aroma.",
  },
  {
    icon: "i-tree",
    title: "Generational know-how",
    body: "Konkani techniques refined over 100+ years.",
  },
];

function DistrictCard({ d }: { d: District }) {
  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
      className="card-edge overflow-hidden group bg-white"
    >
      {/* ─── Cinematic hero — taller, richer, with location dossier overlay ─── */}
      <div className="relative h-80 sm:h-[26rem] overflow-hidden">
        <Image
          src={d.hero}
          alt={d.heroAlt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
        />

        {/* Layered gradient — top dim for top-row chips, bottom dim for title block */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

        {/* Animated pulsing pin marker — anchors the location feel */}
        <div className="absolute top-6 left-6 flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full rounded-full bg-gold animate-ping opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-gold ring-2 ring-white/40" />
          </span>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-[10px] tracking-[0.22em] uppercase font-semibold">
            <svg className="w-3 h-3 text-gold" aria-hidden="true">
              <use href="#i-pin" />
            </svg>
            {d.coords}
          </span>
        </div>

        {/* Ribbon — top right, signature trait */}
        <span className="absolute top-6 right-6 px-3 py-1.5 ribbon rounded-full text-white text-[11px] font-semibold tracking-wider uppercase">
          {d.ribbon}
        </span>

        {/* Title block — bottom left, big serif name + region eyebrow + signature chips */}
        <div className="absolute bottom-6 left-6 right-6">
          <p className="text-gold-200 text-[10px] uppercase tracking-[0.32em] font-semibold">
            {d.region}
          </p>
          <h3
            className="font-serif text-white text-5xl sm:text-6xl mt-1.5 leading-none"
            style={{
              textShadow:
                "0 2px 4px rgba(0,0,0,0.6), 0 8px 30px rgba(0,0,0,0.5)",
            }}
          >
            {d.label}
          </h3>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {d.signature.map((s) => (
              <li
                key={s}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/95 text-[10px] font-medium tracking-wide"
              >
                <span className="w-1 h-1 rounded-full bg-gold" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ─── Body ─── */}
      <div className="p-7 sm:p-8">
        <p className="text-charcoal/80 leading-relaxed">{d.description}</p>

        {/* Mini gallery strip — three location photos to make the place feel real */}
        <div className="mt-6 grid grid-cols-3 gap-2">
          {d.gallery.map((g) => (
            <div
              key={g.src}
              className="relative h-20 sm:h-24 rounded-xl overflow-hidden ring-1 ring-cream-200"
            >
              <Image
                src={g.src}
                alt={g.alt}
                fill
                sizes="(max-width: 1024px) 33vw, 16vw"
                className="object-cover transition-transform duration-700 hover:scale-110"
              />
            </div>
          ))}
        </div>

        {/* Animated count-up totals */}
        <dl className="mt-6 grid grid-cols-3 gap-3">
          <div className="text-center p-4 rounded-2xl stat-tile">
            <dt className="text-charcoal/55 text-[10px] uppercase tracking-[0.18em]">Plots</dt>
            <dd className="font-serif text-3xl text-saffron mt-1">
              <CountUp to={d.totals.plots} />
            </dd>
          </div>
          <div className="text-center p-4 rounded-2xl stat-tile">
            <dt className="text-charcoal/55 text-[10px] uppercase tracking-[0.18em]">Acres</dt>
            <dd className="font-serif text-3xl text-saffron mt-1">
              <CountUp to={d.totals.acres} />
              <span className="text-gold">{d.acresSuffix}</span>
            </dd>
          </div>
          <div className="text-center p-4 rounded-2xl stat-tile">
            <dt className="text-charcoal/55 text-[10px] uppercase tracking-[0.18em]">Trees</dt>
            <dd className="font-serif text-3xl text-saffron mt-1">
              <CountUp to={d.totals.trees} />
              <span className="text-gold">{d.treesSuffix}</span>
            </dd>
          </div>
        </dl>

        {/* Plot details */}
        <div className="mt-7">
          <div className="flex items-center justify-between mb-3">
            <p className="text-charcoal/55 text-[11px] uppercase tracking-[0.22em]">
              Plot details
            </p>
            <span className="text-[10px] uppercase tracking-wider text-charcoal/45 font-semibold">
              Tehsil-level
            </span>
          </div>
          <ul className="rounded-2xl border border-cream-200 overflow-hidden divide-y divide-cream-200 bg-white">
            {d.plots.map((p) => (
              <li
                key={p.name}
                className="plot-row p-4 grid grid-cols-12 gap-3 items-center"
              >
                <span
                  className={`plot-dot w-2.5 h-2.5 col-span-1 rounded-full ${
                    p.active ? "grad-gold-rich shadow-glow" : "bg-leaf/40"
                  }`}
                />
                <span
                  className={`col-span-5 font-medium ${
                    p.active ? "text-charcoal" : "text-charcoal/80"
                  }`}
                >
                  {p.name}
                </span>
                <span className="col-span-3 text-right text-charcoal/70 text-sm">{p.acres}</span>
                <span
                  className={`col-span-3 text-right ${
                    p.active
                      ? "font-serif text-saffron"
                      : "text-leaf text-xs uppercase tracking-wider font-semibold"
                  }`}
                >
                  {p.detail}
                </span>
              </li>
            ))}
          </ul>

          {/* Tehsils — pill list, more visual than italic text */}
          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            <span className="text-charcoal/55 text-[11px] uppercase tracking-wider font-semibold mr-1">
              Tehsils:
            </span>
            {d.tehsils.split(" · ").map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 rounded-full bg-cream-100 border border-gold/25 text-charcoal/80 text-[11px] font-medium"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function FarmLocations() {
  const [active, setActive] = useState<DistrictKey>("ratnagiri");
  const district = DISTRICTS[active];

  return (
    <section id="farms" className="relative bg-white overflow-hidden">
      <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gold-50 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-leaf/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="max-w-3xl mx-auto text-center"
        >
          <span className="gold-rule">Our Farms · 10 plots across Maharashtra</span>
          <h2 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl text-charcoal leading-[1.05]">
            Two districts. Ten villages. <span className="grad-text">15,000+ trees.</span>
          </h2>
          <p className="mt-5 text-charcoal/70 text-lg leading-relaxed">
            Every Aamrit mango is traceable to a specific plot in coastal Maharashtra — owned
            by us, farmed by us, never resold.
          </p>
        </motion.div>

        {/* Totals strip with count-up — centered for symmetry with the heading */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={staggerContainer(0.08)}
          className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          {[
            { label: "Total Acres", to: 402, suffix: "+" },
            { label: "Mango Trees", to: 15200, suffix: "+" },
            { label: "Farms", to: 10 },
            { label: "Districts", to: 2 },
          ].map((s) => (
            <motion.div
              key={s.label}
              variants={fadeUp}
              className="stat-tile rounded-2xl p-5 text-center"
            >
              <p className="text-charcoal/55 text-[10px] uppercase tracking-[0.22em]">
                {s.label}
              </p>
              <p className="font-serif text-3xl sm:text-4xl mt-1.5 grad-text-static">
                <CountUp to={s.to} />
                {s.suffix && <span className="text-saffron">{s.suffix}</span>}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* District detail cards (kept for content depth) */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={staggerContainer(0.18)}
          className="mt-14 grid lg:grid-cols-2 gap-6 lg:gap-8"
        >
          <DistrictCard d={DISTRICTS.ratnagiri} />
          <DistrictCard d={DISTRICTS.raigad} />
        </motion.div>

        {/* ─── OPTIMIZED MAP — 2-col grid, fixed-height, tabs, no parallax ─── */}
        <div className="mt-16">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
          >
            <div>
              <p className="text-saffron text-[11px] font-semibold uppercase tracking-[0.22em]">
                Where we are
              </p>
              <h3 className="mt-3 font-serif text-3xl sm:text-4xl">
                Both farms sit on India&apos;s{" "}
                <span className="grad-text-static">Konkan coast.</span>
              </h3>
              <p className="mt-2 text-charcoal/65 text-sm">
                Tehsil-level plot maps, straight from the Yeskay Mango Farms profile.
              </p>
            </div>

            {/* Tabs / clickable markers */}
            <div
              role="tablist"
              aria-label="District map switch"
              className="inline-flex p-1 rounded-full bg-cream-100 border border-cream-200 shadow-e1 self-start sm:self-end relative"
            >
              {(Object.keys(DISTRICTS) as DistrictKey[]).map((key) => {
                const isActive = key === active;
                return (
                  <button
                    key={key}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActive(key)}
                    className={`relative px-5 sm:px-7 py-2.5 rounded-full text-sm font-semibold tracking-wide cursor-pointer transition-all ${
                      isActive ? "text-white" : "text-charcoal/55 hover:text-saffron"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="map-tab-active"
                        className="absolute inset-0 rounded-full"
                        style={{
                          background:
                            "linear-gradient(180deg,#F6BF45 0%,#F4A300 50%,#D88E00 100%)",
                          boxShadow:
                            "0 1px 0 rgba(255,255,255,.5) inset, 0 -2px 0 rgba(122,80,0,.25) inset, 0 8px 18px rgba(244,163,0,.32)",
                        }}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative">{DISTRICTS[key].label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* 2-col grid: map + farm details */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            className="mt-6 grid lg:grid-cols-12 gap-5 lg:gap-7 items-start"
          >
            {/* MAP — fixed height, rounded, overflow hidden, NO parallax */}
            <div className="lg:col-span-5 card-warm p-3 sm:p-4">
              <div className="relative w-full overflow-hidden rounded-2xl bg-cream-50 h-[260px] lg:h-[420px]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={district.key}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.99 }}
                    transition={{ duration: 0.45, ease: easing.out }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={district.mapImage}
                      alt={district.mapAlt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
              <p className="mt-4 text-center text-charcoal/65 text-sm italic">
                <span className="font-semibold not-italic text-charcoal">
                  {district.label} District —
                </span>{" "}
                {district.caption}
              </p>
            </div>

            {/* Farm details for selected district */}
            <div className="lg:col-span-7 card-warm p-6 sm:p-8">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={district.key}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease: easing.out }}
                >
                  <div className="flex items-center gap-2 text-saffron text-[11px] font-semibold uppercase tracking-[0.22em]">
                    <svg className="w-4 h-4" aria-hidden="true">
                      <use href="#i-pin" />
                    </svg>
                    {district.region}
                  </div>
                  <h4 className="mt-2 font-serif text-3xl sm:text-4xl text-charcoal">
                    {district.label}
                  </h4>
                  <p className="mt-3 text-charcoal/70 leading-relaxed">{district.description}</p>

                  {/* Live count-up acres / trees */}
                  <dl className="mt-6 grid grid-cols-3 gap-3">
                    <div className="text-center p-4 rounded-2xl stat-tile">
                      <dt className="text-charcoal/55 text-[10px] uppercase tracking-[0.18em]">
                        Plots
                      </dt>
                      <dd className="font-serif text-3xl text-saffron mt-1">
                        <CountUp
                          key={`${district.key}-plots`}
                          to={district.totals.plots}
                          duration={900}
                        />
                      </dd>
                    </div>
                    <div className="text-center p-4 rounded-2xl stat-tile">
                      <dt className="text-charcoal/55 text-[10px] uppercase tracking-[0.18em]">
                        Acres
                      </dt>
                      <dd className="font-serif text-3xl text-saffron mt-1">
                        <CountUp
                          key={`${district.key}-acres`}
                          to={district.totals.acres}
                          duration={1100}
                        />
                        <span className="text-gold">{district.acresSuffix}</span>
                      </dd>
                    </div>
                    <div className="text-center p-4 rounded-2xl stat-tile">
                      <dt className="text-charcoal/55 text-[10px] uppercase tracking-[0.18em]">
                        Trees
                      </dt>
                      <dd className="font-serif text-3xl text-saffron mt-1">
                        <CountUp
                          key={`${district.key}-trees`}
                          to={district.totals.trees}
                          duration={1300}
                        />
                        <span className="text-gold">{district.treesSuffix}</span>
                      </dd>
                    </div>
                  </dl>

                  <p className="mt-5 text-charcoal/55 text-xs italic">
                    Tehsils we farm in: {district.tehsils}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Climate row */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={staggerContainer(0.1)}
            className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5"
          >
            {CLIMATE.map((c) => (
              <motion.div
                key={c.title}
                variants={fadeUp}
                className="card-warm p-5 flex items-start gap-3"
              >
                <span className="w-10 h-10 rounded-xl bg-gold-50 text-saffron inline-flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" aria-hidden="true">
                    <use href={`#${c.icon}`} />
                  </svg>
                </span>
                <div>
                  <p className="font-medium text-charcoal">{c.title}</p>
                  <p className="text-charcoal/65 text-sm mt-0.5">{c.body}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
