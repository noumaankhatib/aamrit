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
    image: "/img/process/flowering-cultivation.png",
    imageAlt:
      "Mango trees in bloom with cream-colored flower panicles in a sunlit orchard row",
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
    image: "/img/process/handpicked-peak-maturity.png",
    imageAlt:
      "Hands harvesting a ripe mango from the tree beside a woven basket filled with fruit",
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
    image: "/img/process/natural-straw-ripening.png",
    imageAlt:
      "Ripe mangoes layered in straw inside a rustic wooden crate with mango leaves",
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
    image: "/img/process/delivered-farm-fresh.png",
    imageAlt:
      "Packed mangoes in straw-lined boxes on an outdoor wooden table with farm gift packaging",
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

      <div className="relative mx-auto max-w-6xl px-5 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-32">
        <div className="text-center max-w-3xl mx-auto">
          {/* Label */}
          <span className="gold-rule text-[11px] sm:text-xs lg:text-sm tracking-[0.2em] sm:tracking-[0.25em]">
            Our Process
          </span>
          
          {/* Heading - stacked on mobile, inline on larger */}
          <h2 className="mt-3 sm:mt-4 lg:mt-5 font-serif text-charcoal">
            <span className="block text-2xl xs:text-[1.7rem] sm:text-4xl lg:text-5xl xl:text-6xl leading-tight sm:leading-[1.1]">
              From flowering to your kitchen,
            </span>
            <span className="block mt-1 sm:mt-0 sm:inline">
              <em className="grad-text-static not-italic text-2xl xs:text-[1.7rem] sm:text-4xl lg:text-5xl xl:text-6xl leading-tight sm:leading-[1.1]">
                by hand.
              </em>
            </span>
          </h2>
          
          {/* Description */}
          <p className="mt-4 sm:mt-5 lg:mt-6 text-charcoal/70 text-[15px] sm:text-base lg:text-lg leading-relaxed max-w-md sm:max-w-xl lg:max-w-2xl mx-auto px-2 sm:px-0">
            Four steps. Done the slow way. Three generations of Konkani know-how — every
            mango can be traced back to the exact tree it grew on.
          </p>
        </div>

        {/* Vertical spine + alternating rows */}
        <div className="story-spine relative mt-12 sm:mt-20">
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

          <ol className="space-y-10 xs:space-y-12 sm:space-y-16 lg:space-y-24 xl:space-y-28">
            {STEPS.map((step, i) => {
              const reverse = i % 2 === 1;
              return (
                <li
                  key={step.number}
                  className={`story-row relative grid lg:grid-cols-2 gap-4 xs:gap-5 sm:gap-8 lg:gap-12 xl:gap-16 items-center ${
                    reverse ? "lg:[direction:rtl]" : ""
                  }`}
                >
                  {/* Photo */}
                  <div
                    className="story-image relative card-edge overflow-hidden lg:[direction:ltr] group"
                    style={{ borderRadius: "1rem" }}
                  >
                    <div className="relative aspect-[4/3] xs:aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-[26rem] xl:h-[28rem] overflow-hidden rounded-xl xs:rounded-2xl sm:rounded-3xl">
                      <Image
                        src={step.image}
                        alt={step.imageAlt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
                        className="object-cover transition-transform duration-[900ms] group-hover:scale-[1.05]"
                      />
                      {/* Bottom warm gradient for chip legibility */}
                      <div className="absolute inset-x-0 bottom-0 h-1/2 sm:h-2/3 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />

                      {/* Big step number — positioned inside photo */}
                      <span
                        className="story-step-num absolute top-2.5 left-2.5 xs:top-3 xs:left-3 sm:top-4 sm:left-4 lg:top-5 lg:left-5 inline-flex items-center justify-center w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 rounded-full grad-gold-rich text-white font-serif text-lg xs:text-xl sm:text-2xl lg:text-2xl xl:text-3xl font-semibold shadow-glow ring-2 xs:ring-2 sm:ring-3 lg:ring-4 ring-white/90"
                      >
                        {step.number}
                      </span>

                      {/* Season chip — bottom-left of photo */}
                      <span className="absolute bottom-2.5 left-2.5 xs:bottom-3 xs:left-3 sm:bottom-4 sm:left-4 lg:bottom-5 lg:left-5 inline-flex items-center gap-1 xs:gap-1.5 sm:gap-2 px-2 xs:px-2.5 sm:px-3 py-0.5 xs:py-1 sm:py-1.5 rounded-full bg-white/95 backdrop-blur text-charcoal text-[9px] xs:text-[10px] sm:text-[11px] font-semibold tracking-wide sm:tracking-wider uppercase shadow-e1">
                        <svg className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 text-saffron" aria-hidden="true">
                          <use href="#i-sun" />
                        </svg>
                        {step.season}
                      </span>

                      {/* Pull-quote tag — top-right */}
                      <span className="absolute top-2.5 right-2.5 xs:top-3 xs:right-3 sm:top-4 sm:right-4 lg:top-5 lg:right-5 px-2 xs:px-2.5 sm:px-3 py-0.5 xs:py-1 sm:py-1.5 rounded-full grad-leaf text-white text-[8px] xs:text-[9px] sm:text-[10px] font-bold tracking-[0.12em] xs:tracking-[0.15em] sm:tracking-[0.18em] uppercase shadow-e1">
                        {step.tag}
                      </span>
                    </div>
                  </div>

                  {/* Copy */}
                  <div className="story-copy lg:[direction:ltr] px-0.5 xs:px-1 sm:px-0">
                    <p className="text-saffron text-[9px] xs:text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] xs:tracking-[0.25em] sm:tracking-[0.3em]">
                      Step {step.number}
                    </p>
                    <h3 className="mt-1.5 xs:mt-2 sm:mt-3 font-serif text-xl xs:text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-charcoal leading-[1.2] xs:leading-[1.15] sm:leading-[1.1]">
                      {step.title}
                    </h3>
                    <p className="mt-2 xs:mt-3 sm:mt-4 lg:mt-5 text-charcoal/70 text-[13px] xs:text-sm sm:text-base lg:text-lg leading-relaxed">
                      {step.body}
                    </p>

                    {/* Craft bullets */}
                    <ul className="mt-3 xs:mt-4 sm:mt-5 lg:mt-6 space-y-1.5 xs:space-y-2 sm:space-y-2.5">
                      {step.bullets.map((b) => (
                        <li
                          key={b}
                          className="flex items-center gap-2 xs:gap-2.5 sm:gap-3 text-charcoal/80 text-[12px] xs:text-xs sm:text-sm lg:text-base"
                        >
                          <span className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 rounded-full grad-gold-rich inline-flex items-center justify-center text-white shrink-0 shadow-e1">
                            <svg className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5" aria-hidden="true">
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
                    className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 xl:w-4 xl:h-4 rounded-full grad-gold-rich ring-3 xl:ring-4 ring-cream-50 shadow-glow"
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
