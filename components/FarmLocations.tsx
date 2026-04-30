"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import CountUp from "./CountUp";

type District = {
  key: string;
  label: string;
  tagline: string;
  trees: number;
  acres: number;
  image: string;
  imageAlt?: string;
  features: string[];
};

const DISTRICTS: District[] = [
  {
    key: "ratnagiri",
    label: "Ratnagiri",
    tagline: "The Original Home of Alphonso",
    trees: 9900,
    acres: 224,
    image: "/img/farms/ratnagiri-original-home-alphonso.png",
    imageAlt:
      "Alphonso mangoes ripening on trees in hillside rows overlooking the Konkan coast",
    features: ["GI-Tag Certified", "Sea Breeze Climate"],
  },
  {
    key: "raigad",
    label: "Raigad",
    tagline: "Our Largest Estate",
    trees: 12100,
    acres: 376,
    image: "/img/farms/raigad-largest-estate.png",
    imageAlt:
      "Mango trees on a hillside with ripening fruit, valley and mountain range in the distance",
    features: ["Sahyadri Foothills", "Estate Cultivation"],
  },
];

const TERROIR = [
  { icon: "☀️", title: "Coastal Sun", value: "12+ hrs daily" },
  { icon: "🌍", title: "Red Lateritic Soil", value: "Iron-rich earth" },
  { icon: "🌊", title: "Arabian Sea Breeze", value: "Floral notes" },
  { icon: "🌳", title: "Heritage Trees", value: "100+ years old" },
];

export default function FarmLocations() {
  return (
    <section id="farms" className="relative py-16 sm:py-20 bg-gradient-to-b from-cream-50 to-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gold/5 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-leaf/5 blur-[80px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Header */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-gold-100/80 text-gold-700 text-xs font-semibold tracking-wider uppercase mb-4">
            Our Farms
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-charcoal">
            <span className="grad-text">22,000+</span> trees across{" "}
            <span className="grad-text">2</span> districts
          </h2>
          <p className="mt-3 text-charcoal/60 text-base sm:text-lg max-w-xl mx-auto">
            Every mango traceable to our family-owned orchards in coastal Maharashtra
          </p>
        </motion.div>

        {/* Stats Row - Compact */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={staggerContainer(0.1)}
          className="grid grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto mb-12"
        >
          {[
            { label: "Acres", value: 600 },
            { label: "Trees", value: 22000 },
            { label: "Farms", value: 12 },
            { label: "Districts", value: 2 },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              className="text-center p-3 sm:p-4 rounded-2xl bg-white/80 border border-cream-100 shadow-sm"
            >
              <p className="font-serif text-2xl sm:text-3xl text-saffron leading-none">
                <CountUp to={stat.value} />
              </p>
              <p className="mt-1 text-charcoal/50 text-[10px] sm:text-xs uppercase tracking-wider">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* District Cards - Side by Side */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={staggerContainer(0.15)}
          className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-12"
        >
          {DISTRICTS.map((district) => (
            <motion.div
              key={district.key}
              variants={fadeUp}
              className="group relative rounded-3xl overflow-hidden bg-white shadow-e1 hover:shadow-e2 transition-shadow"
            >
              {/* Image */}
              <div className="relative h-48 sm:h-56 overflow-hidden">
                <Image
                  src={district.image}
                  alt={district.imageAlt ?? district.label}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-serif text-2xl sm:text-3xl text-white">
                    {district.label}
                  </h3>
                  <p className="text-gold-200 text-sm mt-1">{district.tagline}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Mini stats */}
                <div className="flex gap-6 mb-4">
                  <div>
                    <p className="font-serif text-2xl text-saffron">
                      <CountUp to={district.trees} />+
                    </p>
                    <p className="text-xs text-charcoal/50 uppercase tracking-wider">Trees</p>
                  </div>
                  <div>
                    <p className="font-serif text-2xl text-saffron">
                      <CountUp to={district.acres} />+
                    </p>
                    <p className="text-xs text-charcoal/50 uppercase tracking-wider">Acres</p>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  {district.features.map((f) => (
                    <span
                      key={f}
                      className="px-3 py-1 rounded-full bg-cream-50 border border-cream-200 text-charcoal/70 text-xs font-medium"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Terroir - Compact Strip */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-gold-50 to-cream-50 border border-gold-100/50"
        >
          <p className="text-center text-xs font-semibold text-saffron uppercase tracking-wider mb-4">
            What makes Konkan special
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {TERROIR.map((item) => (
              <div key={item.title} className="text-center">
                <span className="text-2xl">{item.icon}</span>
                <p className="mt-1 font-medium text-charcoal text-sm">{item.title}</p>
                <p className="text-charcoal/50 text-xs">{item.value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
