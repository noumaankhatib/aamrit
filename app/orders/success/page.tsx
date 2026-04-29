import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Order Confirmed — Aamrit",
  description: "Thank you for your order! Your premium mangoes are on the way.",
};

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const params = await searchParams;
  const orderNumber = params.order;

  return (
    <main className="min-h-screen bg-gradient-to-b from-cream-50 via-white to-cream-50 flex items-center justify-center px-4 py-16">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-leaf/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="relative w-full max-w-lg text-center">
        {/* Success animation */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-leaf to-leaf-600 flex items-center justify-center shadow-xl animate-bounce">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_60px_rgba(0,0,0,0.08)] border border-white/50 p-8 sm:p-10">
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal mb-3">
            Thank you for your order!
          </h1>
          
          {orderNumber && (
            <p className="text-lg text-charcoal/70 mb-2">
              Order #{orderNumber}
            </p>
          )}
          
          <p className="text-charcoal/60 mb-8">
            We&apos;ve received your order and are preparing your premium mangoes with care. 
            You&apos;ll receive a confirmation email shortly with tracking details.
          </p>

          {/* Order info cards */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-cream-50 border border-cream-100">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-gold-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-charcoal">Email Sent</p>
              <p className="text-xs text-charcoal/50">Check your inbox</p>
            </div>
            <div className="p-4 rounded-2xl bg-cream-50 border border-cream-100">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-leaf/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-leaf" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <p className="text-sm font-medium text-charcoal">Shipping Soon</p>
              <p className="text-xs text-charcoal/50">MH 4-5 days</p>
            </div>
          </div>

          {/* Delivery info */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-gold-50 to-amber-50 border border-gold-100 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                <span className="text-2xl">🥭</span>
              </div>
              <div className="text-left">
                <p className="font-medium text-charcoal">Fresh from our orchards</p>
                <p className="text-sm text-charcoal/60">
                  Your mangoes are prepared for dispatch as soon as they pass ripeness checks — you&apos;ll receive tracking updates by SMS.
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/orders"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-charcoal text-white font-semibold hover:bg-charcoal/90 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              View My Orders
            </Link>
            <Link
              href="/shop"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border-2 border-gold bg-white text-charcoal font-semibold hover:bg-cream-50 transition-colors"
            >
              Continue Shopping
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Support info */}
        <p className="mt-8 text-sm text-charcoal/50">
          Questions about your order?{" "}
          <a 
            href="https://wa.me/919876543210" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-leaf hover:text-leaf-600 font-medium"
          >
            Contact us on WhatsApp
          </a>
        </p>
      </div>
    </main>
  );
}
