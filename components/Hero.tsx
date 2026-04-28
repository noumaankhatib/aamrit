"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { easing, heroExtra, heroWord, staggerContainer } from "@/lib/animations";
import CountUp from "./CountUp";

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);

  // Subtle GSAP parallax on the background image. Loaded only on desktop, only when motion is allowed.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 769px)").matches;
    if (reduced || !desktop) return;

    let cleanup = () => {};
    let cancelled = false;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        if (!bgRef.current || !sectionRef.current) return;
        gsap.to(bgRef.current, {
          yPercent: 14,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }, sectionRef);

      cleanup = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-[100svh] overflow-hidden pt-8"
    >
      {/* Background image — zooms from 1.06 → 1 on mount, parallaxes on scroll */}
      <motion.div
        ref={bgRef}
        className="absolute inset-0"
        initial={{ scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.6, ease: easing.out }}
      >
        <Image
          src="https://images.unsplash.com/photo-1591073113125-e46713c829ed?auto=format&fit=crop&w=2400&q=88"
          alt="Sunlit mango orchard at golden hour"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* Overlays — strong left-side scrim for legibility, warm tint, vignette */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top-to-bottom darkening for top nav legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-[#1a0f00]/85" />
        {/* Left-side scrim where the headline lives — pulls text out of the photo */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        {/* Warm gold/saffron tint for premium feel */}
        <div className="absolute inset-0 bg-gradient-to-tr from-saffron/25 via-transparent to-gold/15 mix-blend-soft-light" />
        {/* Soft halo behind the headline */}
        <div className="absolute left-0 right-0 top-1/3 h-96 bg-[radial-gradient(50%_50%_at_25%_50%,rgba(255,200,90,.30),transparent_70%)]" />
        {/* Edge vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_50%,transparent_35%,rgba(0,0,0,.55)_100%)]" />
      </div>

      {/* Mid-depth gold blob */}
      <div className="absolute top-[15%] right-[10%] w-72 h-72 rounded-full bg-gold/30 blur-3xl pointer-events-none" />

      {/* Content — single-viewport flex layout, no scroll required */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 min-h-[100svh] flex flex-col justify-center pt-24 pb-16 sm:pt-28 lg:pt-32 lg:pb-20">
        <motion.div
          className="max-w-3xl"
          initial="hidden"
          animate="show"
          variants={staggerContainer(0.1, 0.1)}
        >
          {/* Eyebrow badge */}
          <motion.div
            variants={heroExtra}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-gold/50 backdrop-blur-md text-white text-[11px] sm:text-xs font-medium shadow-[0_8px_24px_rgba(244,163,0,0.25)]"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-gold animate-ping opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
            </span>
            Yeskay Mango Farms · Family-grown since 2008
          </motion.div>

          {/* Headline — sized to fit viewport, line-stagger, deep drop shadow */}
          <motion.h1
            className="mt-4 sm:mt-5 font-serif text-white text-[40px] leading-[1.02] sm:text-5xl lg:text-7xl font-semibold tracking-tight"
            style={{
              textShadow:
                "0 2px 4px rgba(0,0,0,0.6), 0 8px 30px rgba(0,0,0,0.5), 0 0 60px rgba(244,163,0,0.15)",
            }}
            variants={staggerContainer(0.12, 0.2)}
          >
            <motion.span variants={heroWord} className="block">
              Aamrit —
            </motion.span>
            <motion.span variants={heroWord} className="block">
              Rooted in Nature,
            </motion.span>
            <motion.span variants={heroWord} className="block grad-text">
              Ripened to Perfection.
            </motion.span>
          </motion.h1>

          <motion.div
            initial="hidden"
            animate="show"
            variants={staggerContainer(0.12, 0.6)}
          >
            <motion.div
              variants={heroExtra}
              className="mt-3 sm:mt-4 inline-flex items-center gap-3 text-white"
            >
              <span className="h-px w-8 bg-gold" />
              <svg className="w-3.5 h-3.5 text-gold drop-shadow" aria-hidden="true">
                <use href="#i-leaf" />
              </svg>
              <span className="text-[10px] tracking-[0.4em] text-gold-200">
                EST · 2008 · KONKAN
              </span>
              <svg
                className="w-3.5 h-3.5 text-gold scale-x-[-1] drop-shadow"
                aria-hidden="true"
              >
                <use href="#i-leaf" />
              </svg>
              <span className="h-px w-8 bg-gold" />
            </motion.div>

            <motion.p
              variants={heroExtra}
              className="mt-3 sm:mt-4 max-w-xl text-white text-base sm:text-lg leading-relaxed font-normal"
              style={{ textShadow: "0 2px 12px rgba(0,0,0,0.55)" }}
            >
              From{" "}
              <span className="font-semibold text-gold-200">10 owned farms</span>{" "}
              across Ratnagiri & Raigad — handpicked, naturally ripened, and
              delivered straight to your home.
            </motion.p>

            <motion.div
              variants={heroExtra}
              className="mt-5 sm:mt-6 flex flex-wrap items-center gap-3 cta-halo"
            >
              <a
                href="#packaging"
                className="btn-gold animate-cta-pulse inline-flex items-center gap-2 text-white font-semibold px-6 py-3 sm:px-7 sm:py-3.5 rounded-full cursor-pointer text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true">
                  <use href="#i-cart" />
                </svg>
                Shop Mangoes
              </a>
              <a
                href="#farms"
                className="btn-ghost inline-flex items-center gap-2 text-white font-medium px-6 py-3 sm:px-7 sm:py-3.5 rounded-full cursor-pointer text-sm sm:text-base"
              >
                Explore Farms
                <svg className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true">
                  <use href="#i-arrow" />
                </svg>
              </a>
            </motion.div>
          </motion.div>

          {/* Stat counters — compact, fit in viewport */}
          <motion.dl
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: easing.out, delay: 1.1 }}
            className="mt-7 sm:mt-9 grid grid-cols-4 gap-3 sm:gap-6 max-w-2xl"
          >
            {[
              { label: "Established", value: 2008, suffix: "" },
              { label: "Acres", value: 402, suffix: "+" },
              { label: "Mango Trees", value: 15200, suffix: "+" },
              { label: "Villages", value: 10, suffix: "" },
            ].map((stat) => (
              <div key={stat.label} className="relative pl-3 sm:pl-4">
                <span className="absolute left-0 top-1 bottom-1 w-px bg-gradient-to-b from-transparent via-gold to-transparent" />
                <dt className="text-gold-200 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.24em] font-semibold">
                  {stat.label}
                </dt>
                <dd
                  className="font-serif text-white text-2xl sm:text-3xl lg:text-4xl mt-1 sm:mt-1.5 leading-none"
                  style={{
                    textShadow:
                      "0 2px 8px rgba(0,0,0,0.6), 0 0 32px rgba(244,163,0,0.4)",
                  }}
                >
                  <CountUp
                    to={
                      stat.label === "Established" ? 2008 : stat.value
                    }
                    format={(n) =>
                      stat.label === "Established" ? String(n) : n >= 1000 ? n.toLocaleString("en-IN") : String(n)
                    }
                  />
                  {stat.suffix && <span className="text-gold">{stat.suffix}</span>}
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>
      </div>

      {/* Scroll indicator — only shown on tall viewports to keep content unscrolled-visible */}
      <a
        href="#trust-strip"
        aria-label="Scroll"
        className="hidden 2xl:flex absolute z-10 left-1/2 -translate-x-1/2 bottom-6 flex-col items-center gap-2 text-white/80 hover:text-white transition-colors"
      >
        <span className="text-[10px] tracking-[0.32em] uppercase">Scroll</span>
        <span className="w-[2px] h-10 bg-white/25 relative overflow-hidden rounded-full">
          <span className="absolute top-0 left-0 w-full h-1/3 bg-gold animate-drip" />
        </span>
      </a>

      {/* Bottom wave divider */}
      <svg
        className="absolute bottom-0 inset-x-0 w-full h-12 lg:h-16 text-cream-50"
        preserveAspectRatio="none"
        viewBox="0 0 1440 80"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M0 60 Q240 20 480 50 T960 50 T1440 40 V80 H0 Z"
        />
      </svg>
    </section>
  );
}
