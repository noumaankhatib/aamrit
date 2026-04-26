"use client";

import { motion } from "framer-motion";

export default function FloatingActions() {
  return (
    <>
      {/* Sticky Order Now — mobile only, leaves room for WhatsApp button */}
      <motion.a
        href="#packaging"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6, ease: [0.16, 0.84, 0.3, 1] }}
        className="lg:hidden fixed bottom-4 left-4 right-20 z-30 btn-gold text-white font-semibold px-5 py-3.5 rounded-full flex items-center justify-center gap-2 cursor-pointer"
      >
        <svg className="w-5 h-5" aria-hidden="true">
          <use href="#i-cart" />
        </svg>
        Order Now
      </motion.a>

      {/* WhatsApp floating button — always visible */}
      <motion.a
        href="https://wa.me/919999999999?text=Hi%20Aamrit%2C%20I%27d%20like%20to%20order%20Alphonso%20mangoes."
        aria-label="Chat on WhatsApp"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.6, type: "spring", stiffness: 380, damping: 22 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-4 right-4 z-30 w-14 h-14 rounded-full bg-leaf hover:bg-leaf-600 shadow-glow inline-flex items-center justify-center cursor-pointer"
      >
        <svg className="w-7 h-7 text-white" aria-hidden="true">
          <use href="#i-whatsapp" />
        </svg>
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full rounded-full bg-gold animate-ping opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-gold" />
        </span>
      </motion.a>
    </>
  );
}
