export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="grad-charcoal text-white/80 relative overflow-hidden">
      <span className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <a href="#top" className="flex items-center gap-2.5 cursor-pointer">
              <span className="relative inline-flex items-center justify-center w-10 h-10 rounded-full grad-gold-rich shadow-glow ring-1 ring-saffron/30">
                <svg className="w-5 h-5 text-white" aria-hidden="true">
                  <use href="#i-mango" />
                </svg>
              </span>
              <span className="font-serif text-2xl font-semibold tracking-tight text-white">
                Aamrit
              </span>
            </a>
            <p className="mt-5 text-white/70 max-w-md leading-relaxed">
              A premium Alphonso mango brand by{" "}
              <span className="text-white font-medium">Yeskay Mango Farms Pvt. Ltd.</span> —
              family-grown across 12 farms in Ratnagiri &amp; Raigad — growing since generations, established 1985.
            </p>
            <p className="mt-4 text-white/55 text-sm italic font-serif">
              &ldquo;Aam · Amrit — the divine nectar of mango.&rdquo;
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="text-white text-[11px] font-semibold uppercase tracking-[0.22em]">
              Explore
            </p>
            <ul className="mt-4 space-y-2.5 text-white/70">
              {[
                ["#about", "About"],
                ["#varieties", "Varieties"],
                ["#farms", "Our Farms"],
                ["#process", "Process"],
                ["#packaging", "Shop"],
                ["#b2b", "For Business"],
                ["#faq", "FAQ"],
              ].map(([href, label]) => (
                <li key={href}>
                  <a href={href} className="hover:text-gold transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="text-white text-[11px] font-semibold uppercase tracking-[0.22em]">
              Get in Touch
            </p>
            <ul className="mt-4 space-y-3 text-white/75">
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 mt-1 text-gold shrink-0" aria-hidden="true">
                  <use href="#i-pin" />
                </svg>
                Yeskay Mango Farms Pvt. Ltd.
                <br />
                Ratnagiri &amp; Raigad, Maharashtra
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-4 h-4 text-gold shrink-0" aria-hidden="true">
                  <use href="#i-phone" />
                </svg>
                <a href="tel:+919999999999" className="hover:text-gold transition-colors">
                  +91 99999 99999
                </a>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-4 h-4 text-gold shrink-0" aria-hidden="true">
                  <use href="#i-mail" />
                </svg>
                <a
                  href="mailto:hello@aamrit.farm"
                  className="hover:text-gold transition-colors"
                >
                  hello@aamrit.farm
                </a>
              </li>
            </ul>

            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://wa.me/919999999999"
                aria-label="WhatsApp"
                className="w-10 h-10 rounded-full bg-leaf hover:bg-leaf-600 inline-flex items-center justify-center transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5 text-white" aria-hidden="true">
                  <use href="#i-whatsapp" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-gold inline-flex items-center justify-center transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5 text-white" aria-hidden="true">
                  <use href="#i-instagram" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 text-xs sm:text-sm text-white/55 text-center sm:text-left">
          <p>
            © {year} Yeskay Mango Farms Pvt. Ltd.
            <span className="hidden xs:inline"> · Founder: Sarfaraz Kazi</span>
          </p>
          <p className="text-[10px] sm:text-xs">
            Aamrit · Ratnagiri Gold · Raigad Gold · Mango Basket · Westmango
          </p>
        </div>
      </div>
    </footer>
  );
}
