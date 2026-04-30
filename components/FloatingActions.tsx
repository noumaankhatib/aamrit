"use client";

import { motion } from "framer-motion";

export default function FloatingActions() {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 p-4 pb-5 flex items-center gap-3 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none">
      {/* Sticky Order Now — mobile/tablet only */}
      <motion.a
        href="#packaging"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6, ease: [0.16, 0.84, 0.3, 1] }}
        className="flex-1 btn-gold text-white font-semibold px-5 py-3.5 rounded-full flex items-center justify-center gap-2 shadow-xl shadow-gold/30 pointer-events-auto"
      >
        <svg className="w-5 h-5" aria-hidden="true">
          <use href="#i-cart" />
        </svg>
        Order Now
      </motion.a>

      {/* WhatsApp floating button */}
      <motion.a
        href="https://wa.me/919999999999?text=Hi%20Aamrit%2C%20I%27d%20like%20to%20order%20Alphonso%20mangoes."
        aria-label="Chat on WhatsApp"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.6, type: "spring", stiffness: 380, damping: 22 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] shadow-xl shadow-black/20 inline-flex items-center justify-center flex-shrink-0 pointer-events-auto relative"
      >
        <svg className="w-7 h-7 text-white" aria-hidden="true">
          <use href="#i-whatsapp" />
        </svg>
        <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-gold animate-ping opacity-75" />
          <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-gold border-2 border-white" />
        </span>
      </motion.a>
    </div>
  );
}
