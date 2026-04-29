"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import Image from "next/image";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50/50 to-yellow-50">
      {/* Warm gradient overlay */}
      <div 
        className="absolute inset-0 opacity-60"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(251, 191, 36, 0.15), transparent), radial-gradient(ellipse 60% 40% at 20% 20%, rgba(245, 158, 11, 0.1), transparent)"
        }}
      />
      
      {/* Floating mango images - Left side */}
      <motion.div
        aria-hidden="true"
        className="absolute -left-8 top-1/4 w-32 h-32 sm:w-40 sm:h-40 opacity-20 sm:opacity-30"
        animate={{ 
          y: [0, -15, 0], 
          rotate: [0, 5, 0],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src="https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=300&q=80"
          alt=""
          fill
          sizes="160px"
          className="object-cover rounded-full"
        />
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="absolute left-16 -bottom-10 w-24 h-24 sm:w-32 sm:h-32 opacity-15 sm:opacity-25"
        animate={{ 
          y: [0, 10, 0], 
          rotate: [0, -8, 0],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <Image
          src="https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=300&q=80"
          alt=""
          fill
          sizes="128px"
          className="object-cover rounded-full"
        />
      </motion.div>

      {/* Floating mango images - Right side */}
      <motion.div
        aria-hidden="true"
        className="absolute -right-8 top-1/3 w-36 h-36 sm:w-44 sm:h-44 opacity-20 sm:opacity-30"
        animate={{ 
          y: [0, 12, 0], 
          rotate: [0, -6, 0],
        }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <Image
          src="https://images.unsplash.com/photo-1591073113125-e46713c829ed?auto=format&fit=crop&w=300&q=80"
          alt=""
          fill
          sizes="176px"
          className="object-cover rounded-full"
        />
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="absolute right-20 -top-8 w-20 h-20 sm:w-28 sm:h-28 opacity-15 sm:opacity-20"
        animate={{ 
          y: [0, -10, 0], 
          rotate: [0, 10, 0],
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      >
        <Image
          src="https://images.unsplash.com/photo-1519096845289-95806ee03a1a?auto=format&fit=crop&w=300&q=80"
          alt=""
          fill
          sizes="112px"
          className="object-cover rounded-full"
        />
      </motion.div>

      {/* Decorative mango emoji accents */}
      <motion.span
        aria-hidden="true"
        className="absolute left-[10%] top-[15%] text-4xl sm:text-5xl opacity-40"
        animate={{ 
          y: [0, -8, 0], 
          rotate: [-10, 10, -10],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        🥭
      </motion.span>
      
      <motion.span
        aria-hidden="true"
        className="absolute right-[15%] bottom-[20%] text-3xl sm:text-4xl opacity-40"
        animate={{ 
          y: [0, 10, 0], 
          rotate: [10, -10, 10],
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      >
        🥭
      </motion.span>

      <motion.span
        aria-hidden="true"
        className="absolute left-[20%] bottom-[10%] text-2xl sm:text-3xl opacity-30"
        animate={{ 
          y: [0, -6, 0], 
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
      >
        🥭
      </motion.span>

      <motion.span
        aria-hidden="true"
        className="absolute right-[8%] top-[25%] text-2xl opacity-30"
        animate={{ 
          y: [0, 8, 0], 
          rotate: [5, -5, 5],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      >
        🥭
      </motion.span>

      {/* Golden decorative lines */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        variants={staggerContainer(0.1)}
        className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-24 sm:py-28 lg:py-36 text-center"
      >
        <motion.span variants={fadeUp} className="gold-rule">
          Limited Mango Season
        </motion.span>
        <motion.h2
          variants={fadeUp}
          className="mt-4 sm:mt-5 font-serif text-4xl sm:text-5xl lg:text-7xl text-charcoal leading-[1.05]"
        >
          Experience the taste of{" "}
          <span className="grad-text-static">Aamrit.</span>
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="mt-5 sm:mt-6 text-charcoal/70 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed"
        >
          A season of sunlight, rain, and patience — packed in a single wooden crate.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4"
        >
          <motion.a
            href="/shop"
            className="btn-gold inline-flex items-center justify-center gap-2 text-white font-semibold px-8 py-4 rounded-full cursor-pointer text-base sm:text-lg shadow-lg shadow-gold/25"
            whileHover={{ scale: 1.03, boxShadow: "0 20px 40px rgba(212, 168, 83, 0.35)" }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            Order Fresh Mangoes
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.a>

          <motion.a
            href="https://wa.me/919999999999?text=Hi%20Aamrit%2C%20I%27d%20like%20to%20know%20more%20about%20your%20mangoes."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-leaf hover:bg-leaf-600 text-white font-semibold px-7 py-4 rounded-full cursor-pointer text-base sm:text-lg shadow-lg transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Chat with us
          </motion.a>
        </motion.div>

        <motion.p variants={fadeUp} className="mt-6 text-charcoal/50 text-sm">
          Mango season is short. Pre-orders open every March.
        </motion.p>
      </motion.div>
    </section>
  );
}
