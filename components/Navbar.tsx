"use client";

import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "/shop", label: "Buy Mangoes" },
  { href: "#varieties", label: "Varieties" },
  { href: "#farms", label: "Our Farms" },
  { href: "#process", label: "Process" },
  { href: "#b2b", label: "Business" },
  { href: "#about", label: "About" },
  { href: "#faq", label: "FAQs" },
  { href: "/blog", label: "Blog" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
    {/* Free Delivery Banner */}
    <div className="fixed top-0 inset-x-0 z-50 bg-gradient-to-r from-leaf to-leaf-700 text-white text-center py-2 px-4 text-xs sm:text-sm font-medium">
      <span className="inline-flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        Free Delivery All Over India · Maharashtra 4-5 Days · Other States 8-9 Days
      </span>
    </div>
    <header
      id="nav"
      className={`fixed top-8 inset-x-0 z-40 transition-shadow duration-300 ${
        scrolled ? "shadow-e3" : ""
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-3">
        <nav className="backdrop-blur-xl bg-white/85 border border-cream-100/80 shadow-e2 rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2.5 group cursor-pointer">
            <span className="relative inline-flex items-center justify-center w-10 h-10 rounded-full grad-gold-rich shadow-glow ring-1 ring-saffron/30">
              <svg className="w-5 h-5 text-white" aria-hidden="true">
                <use href="#i-mango" />
              </svg>
              <span className="absolute inset-0 rounded-full ring-1 ring-white/40" />
            </span>
            <span className="font-serif text-2xl font-semibold tracking-tight text-charcoal">
              Aamrit
            </span>
            <span className="hidden sm:inline-block ml-1 px-2 py-0.5 rounded-full bg-cream-100 text-saffron-700 text-[10px] font-semibold tracking-wider uppercase">
              By Yeskay
            </span>
          </a>

          <ul className="hidden lg:flex items-center gap-7 text-sm font-medium text-charcoal/80">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="relative hover:text-saffron transition-colors after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-gold hover:after:w-full after:transition-all after:duration-300"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href="/shop"
              className="hidden sm:inline-flex items-center gap-2 btn-gold text-white text-sm font-semibold px-5 py-2.5 rounded-full cursor-pointer"
            >
              Order Now
              <svg className="w-4 h-4" aria-hidden="true">
                <use href="#i-arrow" />
              </svg>
            </a>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((s) => !s)}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-cream-200 bg-white cursor-pointer"
            >
              <svg className="w-5 h-5 text-charcoal" aria-hidden="true">
                <use href="#i-menu" />
              </svg>
            </button>
          </div>
        </nav>

        {open && (
          <div className="lg:hidden mt-2 backdrop-blur-xl bg-white/95 border border-cream-100 shadow-e2 rounded-2xl p-5">
            <ul className="grid gap-1 text-charcoal font-medium">
              {[...NAV_LINKS, { href: "#faq", label: "FAQ" }].map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 px-3 rounded-lg hover:bg-cream-50"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
    </>
  );
}
