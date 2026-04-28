"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

type Step = {
  number: string;
  title: string;
  season: string; // "October–February" etc.
  tag: string; // short pill above the title
  body: string;
  bullets: string[]; // 3 craft details
  image: string; // Unsplash or /img/process/<n>.jpg
  imageAlt: string;
};

const STEPS: Step[] = [
  {
    number: "01",
    title: "Flowering & Cultivation",
    season: "October — February",
    tag: "Slow farming",
    body: "Year-round care across 402+ acres of Ratnagiri & Raigad. Mineral-rich red lateritic soil, drip irrigation, and hand-pruning shape every panicle that becomes a fruit.",
    bullets: [
      "Organic compost & mulching",
      "Drip irrigation, no flooding",
      "Hand-pruning by farm team",
    ],
    image:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1600&q=85",
    imageAlt: "Mango tree flowering with panicles in orchard",
  },
  {
    number: "02",
    title: "Handpicked at Peak Maturity",
    season: "April — Early May",
    tag: "By hand only",
    body: "Each mango is harvested at the precise moment of maturity — never with machines, never with nets. Experienced farmers use shoulder-baskets and wooden poles, the way it's been done for a century.",
    bullets: [
      "Shoulder-basket harvesting",
      "No machines, no bruising",
      "Sorted on the tree",
    ],
    image:
      "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=1600&q=85",
    imageAlt: "Hands holding freshly hand-picked Alphonso mangoes",
  },
  {
    number: "03",
    title: "Natural Straw Ripening",
    season: "5 — 7 days",
    tag: "No carbide. Ever.",
    body: "Cushioned in straw-lined wooden crates and ripened slowly the traditional Konkani way. Never with calcium carbide, ethylene gas, or any chemical agent — which is why the aroma fills the room.",
    bullets: [
      "Straw-cradle bedding",
      "5–7 day slow ripening",
      "Daily hand-inspection",
    ],
    image:
      "https://images.unsplash.com/photo-1519096845289-95806ee03a1a?auto=format&fit=crop&w=1600&q=85",
    imageAlt: "Ripe golden mangoes arranged in traditional straw basket",
  },
  {
    number: "04",
    title: "Delivered Farm-Fresh",
    season: "Free Delivery",
    tag: "All over India",
    body: "Picked, packed, and dispatched within 24 hours from the farm. Free delivery across India — Maharashtra in 4-5 days, other states in 8-9 days. The mango that lands on your table is the one we picked off the tree this week.",
    bullets: [
      "Dispatched within 24 hours",
      "MH 4-5 days · Others 8-9 days",
      "100% replacement guarantee",
    ],
    image:
      "https://images.unsplash.com/photo-1591073113125-e46713c829ed?auto=format&fit=crop&w=1600&q=85",
    imageAlt: "Fresh mangoes ready for delivery to your doorstep",
  },
];

export default function OrchardStory() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 1024px)").matches;

    let cleanup = () => {};
    let cancelled = false;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled || !sectionRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        const root = sectionRef.current!;

        // Per-step reveal — image slides from its side, copy fades up
        gsap.utils.toArray<HTMLElement>(".story-row", root).forEach((row, i) => {
          const reverse = i % 2 === 1;
          const img = row.querySelector(".story-image");
          const copy = row.querySelector(".story-copy");
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: row,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          });
          if (img) {
            tl.from(
              img,
              {
                opacity: 0,
                x: reverse ? 60 : -60,
                duration: 1.0,
                ease: "power3.out",
              },
              0
            );
          }
          if (copy) {
            tl.from(
              copy,
              {
                opacity: 0,
                y: 40,
                duration: 0.9,
                ease: "power3.out",
              },
              0.15
            );
          }
        });

        // Step number badge pop
        gsap.utils.toArray<HTMLElement>(".story-step-num", root).forEach((badge) => {
          gsap.from(badge, {
            scale: 0.5,
            opacity: 0,
            duration: 0.7,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: badge,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          });
        });

        // Vertical timeline — draws as user scrolls (desktop only)
        if (desktop && !reduced) {
          const line = root.querySelector<HTMLElement>(".story-spine-fill");
          const spine = root.querySelector<HTMLElement>(".story-spine");
          if (line && spine) {
            gsap.fromTo(
              line,
              { scaleY: 0 },
              {
                scaleY: 1,
                ease: "none",
                transformOrigin: "top center",
                scrollTrigger: {
                  trigger: spine,
                  start: "top 70%",
                  end: "bottom 70%",
                  scrub: true,
                },
              }
            );
          }
        }

        // Subtle parallax background
        if (!reduced && desktop && bgRef.current) {
          gsap.to(bgRef.current, {
            yPercent: 14,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        }
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
      id="process"
      ref={sectionRef}
      className="relative bg-cream-50 overflow-hidden"
    >
      {/* Soft parallax warm backdrop */}
      <div
        ref={bgRef}
        aria-hidden="true"
        className="absolute -top-20 left-0 right-0 h-[130%] opacity-30 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 50% at 25% 15%, rgba(244,163,0,0.25), transparent 60%), radial-gradient(50% 40% at 85% 75%, rgba(46,125,50,0.20), transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center max-w-3xl mx-auto">
          <span className="gold-rule">Our Process</span>
          <h2 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl text-charcoal leading-[1.05]">
            From flowering to your kitchen,{" "}
            <em className="grad-text-static not-italic">by hand.</em>
          </h2>
          <p className="mt-5 text-charcoal/75 text-lg leading-relaxed">
            Four steps. Done the slow way. Three generations of Konkani know-how — every
            mango can be traced back to the exact tree it grew on.
          </p>
        </div>

        {/* Vertical spine + alternating rows */}
        <div className="story-spine relative mt-20">
          {/* Center line — desktop only */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px"
            style={{
              background:
                "repeating-linear-gradient(180deg, rgba(244,163,0,.35) 0 6px, transparent 6px 14px)",
            }}
          />
          <div
            aria-hidden="true"
            className="story-spine-fill hidden lg:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-[2px] bg-gradient-to-b from-gold via-saffron to-leaf shadow-glow"
            style={{ transformOrigin: "top center" }}
          />

          <ol className="space-y-16 lg:space-y-28">
            {STEPS.map((step, i) => {
              const reverse = i % 2 === 1;
              return (
                <li
                  key={step.number}
                  className={`story-row relative grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                    reverse ? "lg:[direction:rtl]" : ""
                  }`}
                >
                  {/* Photo */}
                  <div
                    className="story-image relative card-edge overflow-hidden lg:[direction:ltr] group"
                    style={{ borderRadius: "1.75rem" }}
                  >
                    <div className="relative h-72 sm:h-96 lg:h-[28rem] overflow-hidden">
                      <Image
                        src={step.image}
                        alt={step.imageAlt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover transition-transform duration-[900ms] group-hover:scale-[1.05]"
                      />
                      {/* Bottom warm gradient for chip legibility */}
                      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                      {/* Big step number — bottom-left corner of photo */}
                      <span
                        className="story-step-num absolute -top-3 -left-3 lg:top-5 lg:left-5 inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 rounded-full grad-gold-rich text-white font-serif text-2xl lg:text-3xl font-semibold shadow-glow ring-4 ring-white"
                      >
                        {step.number}
                      </span>

                      {/* Season chip — bottom-left of photo */}
                      <span className="absolute bottom-5 left-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur text-charcoal text-[11px] font-semibold tracking-wider uppercase shadow-e1">
                        <svg className="w-3.5 h-3.5 text-saffron" aria-hidden="true">
                          <use href="#i-sun" />
                        </svg>
                        {step.season}
                      </span>

                      {/* Pull-quote tag — top-right */}
                      <span className="absolute top-5 right-5 px-3 py-1.5 rounded-full grad-leaf text-white text-[10px] font-bold tracking-[0.18em] uppercase shadow-e1">
                        {step.tag}
                      </span>
                    </div>
                  </div>

                  {/* Copy */}
                  <div className="story-copy lg:[direction:ltr]">
                    <p className="text-saffron text-[11px] font-semibold uppercase tracking-[0.3em]">
                      Step {step.number}
                    </p>
                    <h3 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl text-charcoal leading-[1.1]">
                      {step.title}
                    </h3>
                    <p className="mt-5 text-charcoal/75 text-base sm:text-lg leading-relaxed">
                      {step.body}
                    </p>

                    {/* Craft bullets */}
                    <ul className="mt-6 space-y-2.5">
                      {step.bullets.map((b) => (
                        <li
                          key={b}
                          className="flex items-center gap-3 text-charcoal/85 text-sm sm:text-base"
                        >
                          <span className="w-7 h-7 rounded-full grad-gold-rich inline-flex items-center justify-center text-white shrink-0 shadow-e1">
                            <svg className="w-3.5 h-3.5" aria-hidden="true">
                              <use href="#i-check" />
                            </svg>
                          </span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Center node on the spine — desktop only */}
                  <span
                    aria-hidden="true"
                    className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full grad-gold-rich ring-4 ring-cream-50 shadow-glow"
                  />
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
