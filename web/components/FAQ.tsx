"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { fadeUp, staggerContainer, viewportOnce, easing } from "@/lib/animations";

const ITEMS = [
  {
    q: "How do I know your mangoes are really naturally ripened?",
    a: "Three things: (1) we own every farm — there's no point in our chain where a middleman could swap fruit; (2) you can visit any of our 10 plots in Ratnagiri or Raigad at any time during the season; (3) artificially ripened Alphonso looks uniformly yellow with no aroma — ours ripen unevenly with a strong floral smell, which is the natural sign.",
  },
  {
    q: "When is the season and how do I pre-order?",
    a: "Alphonso is a once-a-year fruit. Pre-orders open every March; deliveries run from late March through early June, with peak fruit between mid-April and mid-May. Reserve early — we sell out most years by April.",
  },
  {
    q: "What if my mangoes arrive damaged?",
    a: "100% replacement, no questions asked. WhatsApp us a photo within 48 hours of delivery and we'll dispatch a fresh crate at our cost. Our 100% Satisfaction Guarantee has been part of how we do business since 2008.",
  },
  {
    q: "Why is your Alphonso pricier than what I see in local markets?",
    a: "Real Konkan Alphonso is the world's most expensive mango variety to grow. We never use chemicals, never auction-buy from middlemen, and never let an unripe fruit ship. The 5–7 day natural ripening alone costs us 30% more than gas-ripened alternatives. You're paying for actual Alphonso, hand-picked from the GI-tag belt.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes — through our sister brand Westmango Agro Export. We currently ship to UAE, Singapore, UK, USA, and Australia. For export inquiries, please use the B2B form.",
  },
  {
    q: "Can I visit your farms?",
    a: "Absolutely — we encourage it. Our Vilye and Chordhe estates welcome visits during the harvest season (April–May). Drop us a WhatsApp at least a week ahead and we'll arrange a guided tour with chai and fresh-cut mango.",
  },
];

function FAQItem({
  q,
  a,
  defaultOpen = false,
}: {
  q: string;
  a: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <motion.div variants={fadeUp} className="card-warm p-6 sm:p-7">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        aria-expanded={open}
        className="flex items-center justify-between gap-4 cursor-pointer w-full text-left"
      >
        <span className="font-serif text-lg sm:text-xl text-charcoal">{q}</span>
        <span
          className="w-8 h-8 rounded-full grad-gold-rich text-white inline-flex items-center justify-center shrink-0 transition-transform duration-300"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0)" }}
        >
          <svg className="w-4 h-4" aria-hidden="true">
            <use href="#i-plus" />
          </svg>
        </span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.4, ease: easing.out }}
        style={{ overflow: "hidden" }}
      >
        <p className="mt-4 text-charcoal/70 leading-relaxed">{a}</p>
      </motion.div>
    </motion.div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="relative bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="text-center"
        >
          <span className="gold-rule">Common Questions</span>
          <h2 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl text-charcoal leading-[1.05]">
            Honest answers,{" "}
            <em className="grad-text-static not-italic">in plain English.</em>
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={staggerContainer(0.08)}
          className="mt-12 space-y-3"
        >
          {ITEMS.map((it, idx) => (
            <FAQItem key={it.q} q={it.q} a={it.a} defaultOpen={idx === 0} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
