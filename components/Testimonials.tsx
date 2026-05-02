"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";

const QUOTES = [
  {
    avatar: "P",
    quote:
      "My mother-in-law said these taste exactly like the mangoes from her childhood in Ratnagiri. That's the highest compliment in our family!",
    name: "Priya Deshmukh",
    location: "Mumbai",
    detail: "Ordering since 2022",
    verified: true,
    date: "April 2024",
  },
  {
    avatar: "A",
    quote:
      "Sent 50 boxes to our clients this Diwali. Every single person called back to ask where we got them. The packaging was impeccable.",
    name: "Arjun Mehta",
    location: "Bengaluru",
    detail: "Corporate orders",
    verified: true,
    date: "March 2024",
  },
  {
    avatar: "N",
    quote:
      "First time buying online and I was nervous. But when I cut open the first mango and that fragrance filled the room... I understood why people wait all year for this.",
    name: "Neha Kulkarni",
    location: "Pune",
    detail: "First-time buyer",
    verified: true,
    date: "May 2024",
  },
];

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden">
      {/* Warm gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50/50 via-orange-50/30 to-white" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-orange-100/30 rounded-full blur-3xl" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-amber-200/50 shadow-sm backdrop-blur-sm">
            <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span className="text-xs sm:text-sm font-semibold text-amber-800 tracking-wide">Loved by Mango Families</span>
          </span>
          <h2 className="mt-6 font-serif text-4xl sm:text-5xl lg:text-6xl text-charcoal leading-[1.08]">
            Words from our table{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">to yours.</span>
              <span className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-amber-200/60 to-orange-200/60 -skew-x-2 rounded-sm" />
            </span>
          </h2>
          <p className="mt-5 text-charcoal/60 text-lg max-w-xl mx-auto">
            Real stories from families who&apos;ve made Aamrit a part of their mango season.
          </p>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-8"
        >
          <div className="flex items-center gap-3 px-5 py-3 bg-white/70 backdrop-blur-sm rounded-2xl border border-amber-100 shadow-sm">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              ))}
            </div>
            <div className="text-left">
              <span className="font-serif text-2xl font-bold text-charcoal">4.9</span>
              <span className="text-charcoal/50 text-sm ml-1">/ 5</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-charcoal/70">
            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">1,200+ verified reviews</span>
          </div>
          
          <div className="flex items-center gap-2 text-charcoal/70">
            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-sm font-medium">2,500+ families served</span>
          </div>
        </motion.div>

        {/* Testimonial cards */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={staggerContainer(0.12)}
          className="mt-14 grid md:grid-cols-3 gap-6 lg:gap-8"
        >
          {QUOTES.map((q, idx) => (
            <motion.figure
              key={q.name}
              variants={fadeUp}
              className={`group relative bg-white/80 backdrop-blur-sm rounded-3xl p-7 sm:p-8 border border-amber-100/50 shadow-lg shadow-amber-900/5 hover:shadow-xl hover:shadow-amber-900/10 transition-all duration-300 hover:-translate-y-1 ${
                idx === 1 ? "md:-mt-4 md:mb-4" : ""
              }`}
            >
              {/* Quote icon */}
              <div className="absolute -top-4 left-6 w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
                </svg>
              </div>
              
              {/* Stars */}
              <div className="flex gap-1 mb-5 pt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                ))}
              </div>
              
              {/* Quote */}
              <blockquote className="font-serif text-lg sm:text-xl leading-relaxed text-charcoal/90">
                &ldquo;{q.quote}&rdquo;
              </blockquote>
              
              {/* Author */}
              <figcaption className="mt-6 pt-6 border-t border-amber-100/50">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <span className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 inline-flex items-center justify-center text-amber-700 font-bold text-lg border-2 border-white shadow-md">
                      {q.avatar}
                    </span>
                    {q.verified && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center ring-2 ring-white">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-charcoal">{q.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-charcoal/50 mt-0.5">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{q.location}</span>
                      <span className="text-charcoal/30">·</span>
                      <span>{q.detail}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-charcoal/40">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Reviewed {q.date}</span>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
        
        {/* Bottom CTA */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mt-12 text-center"
        >
          <p className="text-charcoal/50 text-sm">
            Join thousands of families who trust Aamrit for their mango season
          </p>
        </motion.div>
      </div>
    </section>
  );
}
