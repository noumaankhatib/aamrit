"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { addToCartAction } from "@/app/cart/actions";

export default function AddToCartForm({
  productId,
  stock,
}: {
  productId: string;
  stock: number;
}) {
  const [qty, setQty] = useState(1);
  const [pending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);
  const outOfStock = stock <= 0;

  function submit(goToCart: boolean) {
    const fd = new FormData();
    fd.set("productId", productId);
    fd.set("quantity", String(qty));
    if (goToCart) fd.set("goToCart", "1");
    startTransition(async () => {
      await addToCartAction(fd);
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    });
  }

  return (
    <div className="space-y-4">
      {/* Quantity selector */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-charcoal/70">Quantity:</label>
        <div className="flex items-center bg-cream-50 rounded-xl border border-cream-200 overflow-hidden">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={outOfStock || qty <= 1}
            className="w-12 h-12 flex items-center justify-center text-charcoal/70 hover:bg-cream-100 hover:text-charcoal disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Decrease quantity"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <span className="w-14 h-12 flex items-center justify-center text-lg font-semibold text-charcoal border-x border-cream-200">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(stock || 99, q + 1))}
            disabled={outOfStock || qty >= stock}
            className="w-12 h-12 flex items-center justify-center text-charcoal/70 hover:bg-cream-100 hover:text-charcoal disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Increase quantity"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        <span className={`text-sm font-medium ${outOfStock ? 'text-red-500' : stock <= 10 ? 'text-orange-500' : 'text-leaf'}`}>
          {outOfStock ? (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              Out of stock
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {stock} in stock
            </span>
          )}
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <motion.button
          type="button"
          disabled={pending || outOfStock}
          onClick={() => submit(false)}
          whileHover={{ scale: outOfStock ? 1 : 1.02 }}
          whileTap={{ scale: outOfStock ? 1 : 0.98 }}
          className={`relative flex-1 flex items-center justify-center gap-2 font-semibold py-4 px-6 rounded-xl transition-all duration-200 overflow-hidden ${
            outOfStock
              ? "bg-charcoal/10 text-charcoal/40 cursor-not-allowed"
              : added
              ? "bg-leaf text-white"
              : "btn-gold text-white shadow-glow"
          }`}
        >
          <AnimatePresence mode="wait">
            {pending ? (
              <motion.span
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Adding...
              </motion.span>
            ) : added ? (
              <motion.span
                key="added"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Added to cart!
              </motion.span>
            ) : (
              <motion.span
                key="default"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Add to cart
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        <motion.button
          type="button"
          disabled={pending || outOfStock}
          onClick={() => submit(true)}
          whileHover={{ scale: outOfStock ? 1 : 1.02 }}
          whileTap={{ scale: outOfStock ? 1 : 0.98 }}
          className={`flex-1 flex items-center justify-center gap-2 font-semibold py-4 px-6 rounded-xl border-2 transition-all duration-200 ${
            outOfStock
              ? "border-charcoal/10 text-charcoal/40 cursor-not-allowed"
              : "border-charcoal text-charcoal hover:bg-charcoal hover:text-white"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Buy now
        </motion.button>
      </div>

      {/* Free delivery banner */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-leaf/5 border border-leaf/20">
        <div className="w-8 h-8 rounded-full bg-leaf/10 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-leaf" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        </div>
        <div className="text-xs">
          <p className="font-semibold text-leaf-700">Free Delivery All Over India</p>
          <p className="text-charcoal/60">Maharashtra 4-5 days · Other States 8-9 days</p>
        </div>
      </div>
    </div>
  );
}
