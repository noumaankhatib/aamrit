import Link from "next/link";
import ShopNav from "@/components/shop/ShopNav";
import Icon from "@/components/shop/Icon";
import { env } from "@/lib/env";

export const metadata = { title: "My orders — Aamrit" };

export default function OrdersPage() {
  const shopifyDomain = env.shopify.publicStoreDomain || env.shopify.storeDomain;
  const accountUrl = shopifyDomain ? `https://${shopifyDomain}/account` : null;

  return (
    <>
      <ShopNav />
      <main className="min-h-screen bg-gradient-to-b from-cream-50 via-white to-cream-50 pb-24">
        {/* Background accent */}
        <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-br from-gold-50/40 via-transparent to-leaf/5 pointer-events-none" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-charcoal/50 hover:text-charcoal transition-colors">
              Home
            </Link>
            <span className="text-charcoal/30">/</span>
            <span className="text-charcoal font-medium">My Orders</span>
          </nav>
          
          <header className="mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-100 to-gold-200 flex items-center justify-center">
                <Icon name="package" className="w-5 h-5 text-gold-600" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-gold-600 font-semibold">Account</p>
                <h1 className="font-serif text-3xl sm:text-4xl text-charcoal">My Orders</h1>
              </div>
            </div>
          </header>

          <div className="bg-white rounded-3xl shadow-e2 p-10 sm:p-16 text-center border border-cream-100/50">
            <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-cream-50 to-cream-100 flex items-center justify-center mb-6 border border-cream-200">
              <Icon name="package" className="w-12 h-12 text-charcoal/30" />
            </div>
            <h2 className="font-serif text-3xl text-charcoal mb-3">View Your Orders</h2>
            <p className="text-charcoal/60 mb-8 max-w-md mx-auto leading-relaxed">
              Your order history and tracking information are available in your Shopify account.
              View order status, tracking details, and request support there.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {accountUrl ? (
                <a
                  href={accountUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-gold/25 hover:shadow-gold/35 transition-all"
                >
                  View Orders
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ) : null}
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 border-2 border-charcoal text-charcoal hover:bg-charcoal hover:text-white px-8 py-4 rounded-xl font-semibold transition-all"
              >
                Continue Shopping
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-r from-gold-50 to-gold-100/50 border border-gold-200/50 rounded-2xl p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                <Icon name="spark" className="w-5 h-5 text-gold-500" />
              </div>
              <div>
                <h3 className="font-semibold text-charcoal">Order Confirmation</h3>
                <p className="text-sm text-charcoal/70 mt-1.5 leading-relaxed">
                  After completing your purchase, you&apos;ll receive an order confirmation email
                  with your order details and tracking information. If you created an account during
                  checkout, you can log in to view your order history anytime.
                </p>
              </div>
            </div>
          </div>

          {/* Help card */}
          <div className="mt-6 bg-white rounded-2xl p-5 text-center border border-cream-100 shadow-sm">
            <p className="text-sm text-charcoal/70">
              Need help with an order?{" "}
              <a href="mailto:hello@aamrit.in" className="text-gold-600 hover:text-gold-700 font-semibold transition-colors">
                hello@aamrit.in
              </a>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
