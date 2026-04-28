"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ProductGalleryProps {
  mainImage: string;
  gallery: string[];
  productName: string;
}

export default function ProductGallery({
  mainImage,
  gallery,
  productName,
}: ProductGalleryProps) {
  const allImages = mainImage ? [mainImage, ...gallery] : gallery;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const currentImage = allImages[selectedIndex] || "";

  const goToImage = (index: number) => {
    setDirection(index > selectedIndex ? 1 : -1);
    setSelectedIndex(index);
  };

  const goNext = () => {
    if (selectedIndex < allImages.length - 1) {
      setDirection(1);
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const goPrev = () => {
    if (selectedIndex > 0) {
      setDirection(-1);
      setSelectedIndex(selectedIndex - 1);
    }
  };

  if (allImages.length === 0) {
    return (
      <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-cream-50 to-cream-100 shadow-e2 border border-cream-200/50">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-charcoal/20">
          <svg
            className="w-24 h-24"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="mt-3 text-sm text-charcoal/30">No image available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-cream-50 to-cream-100 shadow-e3 group border border-cream-200/50">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0, x: direction * 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -30 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={currentImage}
              alt={`${productName} - Image ${selectedIndex + 1}`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority={selectedIndex === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Gradient overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Navigation arrows */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={goPrev}
              disabled={selectedIndex === 0}
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/95 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all duration-200 ${
                selectedIndex === 0
                  ? "opacity-30 cursor-not-allowed"
                  : "opacity-0 group-hover:opacity-100 hover:bg-white hover:scale-110 hover:shadow-xl"
              }`}
              aria-label="Previous image"
            >
              <svg
                className="w-5 h-5 text-charcoal"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={goNext}
              disabled={selectedIndex === allImages.length - 1}
              className={`absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/95 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all duration-200 ${
                selectedIndex === allImages.length - 1
                  ? "opacity-30 cursor-not-allowed"
                  : "opacity-0 group-hover:opacity-100 hover:bg-white hover:scale-110 hover:shadow-xl"
              }`}
              aria-label="Next image"
            >
              <svg
                className="w-5 h-5 text-charcoal"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        {/* Image counter badge */}
        {allImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg text-charcoal text-sm font-semibold flex items-center gap-2">
            <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{selectedIndex + 1} / {allImages.length}</span>
          </div>
        )}
        
        {/* Zoom hint */}
        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-sm text-charcoal/70 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
          Click to zoom
        </div>
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {allImages.map((src, index) => (
            <motion.button
              key={src}
              onClick={() => goToImage(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative aspect-square rounded-xl overflow-hidden bg-white shadow-sm transition-all duration-200 ${
                index === selectedIndex
                  ? "ring-2 ring-gold ring-offset-2 shadow-lg"
                  : "opacity-70 hover:opacity-100 hover:shadow-md"
              }`}
              aria-label={`View image ${index + 1}`}
              aria-current={index === selectedIndex ? "true" : undefined}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="10vw"
                className="object-cover"
              />
              {index === selectedIndex && (
                <motion.div
                  layoutId="thumbnail-indicator"
                  className="absolute inset-0 border-2 border-gold rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
