import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getCartSafe, getCheckoutUrl } from "@/lib/shopify-cart";
import { formatINR, priceBreakdown } from "@/lib/money";
import ShopNav from "@/components/shop/ShopNav";
import Icon from "@/components/shop/Icon";

export const metadata = { title: "Checkout — Aamrit" };
export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const cart = await getCartSafe();
  const items = cart?.items ?? [];
  
  if (items.length === 0) redirect("/cart");

  const checkoutUrl = await getCheckoutUrl();

  const subtotal = items.reduce(
    (sum, i) => sum + i.product.priceCents * i.quantity,
    0,
  );
  const totals = priceBreakdown(subtotal);

  return (
    <>
      <ShopNav />
      <main className="min-h-screen bg-gradient-to-b from-cream-50 via-white to-cream-50 pb-24">
        {/* Background accent */}
        <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-br from-gold-50/40 via-transparent to-leaf/5 pointer-events-none" />
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-charcoal/50 hover:text-charcoal transition-colors">
              Home
            </Link>
            <span className="text-charcoal/30">/</span>
            <Link href="/shop" className="text-charcoal/50 hover:text-charcoal transition-colors">
              Shop
            </Link>
            <span className="text-charcoal/30">/</span>
            <Link href="/cart" className="text-charcoal/50 hover:text-charcoal transition-colors">
              Cart
            </Link>
            <span className="text-charcoal/30">/</span>
            <span className="text-charcoal font-medium">Checkout</span>
          </nav>
          
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-100 to-gold-200 flex items-center justify-center">
                <Icon name="lock" className="w-5 h-5 text-gold-600" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-gold-600 font-semibold">Secure Checkout</p>
                <h1 className="font-serif text-3xl sm:text-4xl text-charcoal">Almost There</h1>
              </div>
            </div>
            <Stepper current={2} />
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
            <div className="space-y-5">
              <section className="bg-white rounded-3xl shadow-e2 overflow-hidden border border-cream-100/50">
                <header className="flex items-start gap-4 p-6 bg-gradient-to-br from-cream-50 to-white border-b border-cream-100">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-500 text-white text-sm font-bold inline-flex items-center justify-center shadow-lg shadow-gold/25">
                    1
                  </span>
                  <div className="flex-1">
                    <h2 className="font-serif text-xl text-charcoal">
                      Review Your Order
                    </h2>
                    <p className="text-sm text-charcoal/60 mt-0.5">
                      You&apos;ll complete payment on the next step
                    </p>
                  </div>
                </header>

                <ul className="divide-y divide-cream-100">
                  {items.map((item) => (
                    <li key={item.id} className="p-5 sm:p-6 flex gap-4 items-center hover:bg-cream-50/30 transition-colors">
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-2xl overflow-hidden bg-gradient-to-br from-cream-50 to-cream-100 shadow-sm">
                        {item.product.imageUrl ? (
                          <Image
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-charcoal/20">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        {item.product.variety && (
                          <p className="text-xs font-semibold text-leaf uppercase tracking-wider mb-0.5">
                            {item.product.variety}
                          </p>
                        )}
                        <p className="font-serif text-lg text-charcoal">{item.product.name}</p>
                        <p className="text-sm text-charcoal/50 mt-1">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-serif text-lg font-bold tabular-nums text-charcoal">
                        {formatINR(item.product.priceCents * item.quantity)}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="px-6 py-4 border-t border-cream-100 bg-cream-50/30">
                  <Link
                    href="/cart"
                    className="text-sm text-gold-600 hover:text-gold-700 font-medium inline-flex items-center gap-1.5 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Edit cart
                  </Link>
                </div>
              </section>

              <section className="bg-gradient-to-r from-gold-50 to-gold-100/50 border border-gold-200/50 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                    <Icon name="shield" className="w-5 h-5 text-gold-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal">Secure Shopify Checkout</h3>
                    <p className="text-sm text-charcoal/70 mt-1.5 leading-relaxed">
                      You&apos;ll be redirected to our secure checkout page to enter your shipping
                      address and complete payment. All major credit cards, UPI, and wallets accepted.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <aside className="lg:sticky lg:top-28 self-start space-y-4">
              <div className="bg-white rounded-3xl shadow-e2 overflow-hidden border border-cream-100/50">
                <div className="p-6 bg-gradient-to-br from-cream-50 to-white border-b border-cream-100">
                  <h2 className="font-serif text-2xl text-charcoal">Order Summary</h2>
                </div>
                
                <div className="p-6">
                  <dl className="space-y-3 text-sm border-b border-cream-100 pb-4 mb-4">
                    <Row label="Subtotal" value={formatINR(totals.subtotalCents)} />
                    <Row
                      label="Delivery"
                      value={
                        <span className="text-leaf font-semibold flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          FREE
                        </span>
                      }
                    />
                    <Row label="GST (5%)" value={formatINR(totals.taxCents)} />
                  </dl>

                  <div className="flex justify-between font-bold text-lg mb-6">
                    <span>Estimated Total</span>
                    <span className="font-serif text-2xl tabular-nums">{formatINR(totals.totalCents)}</span>
                  </div>

                  {checkoutUrl ? (
                    <a
                      href={checkoutUrl}
                      className="w-full bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-gold/25 hover:shadow-gold/35 transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Continue to Payment
                    </a>
                  ) : (
                    <div className="w-full bg-gray-100 text-gray-400 py-4 rounded-xl font-semibold flex items-center justify-center gap-2">
                      <Icon name="lock" className="w-5 h-5" />
                      Checkout unavailable
                    </div>
                  )}

                  <p className="mt-4 text-xs text-charcoal/40 text-center">
                    Secure checkout powered by Shopify
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-cream-100 shadow-sm">
                <ul className="space-y-3 text-xs text-charcoal/60">
                  <li className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-leaf/10 flex items-center justify-center flex-shrink-0">
                      <Icon name="shield" className="w-3.5 h-3.5 text-leaf" />
                    </span>
                    <span>256-bit SSL · PCI-compliant payment</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-leaf/10 flex items-center justify-center flex-shrink-0">
                      <Icon name="credit-card" className="w-3.5 h-3.5 text-leaf" />
                    </span>
                    <span>Cards · UPI · Netbanking · Wallets</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-leaf/10 flex items-center justify-center flex-shrink-0">
                      <Icon name="truck" className="w-3.5 h-3.5 text-leaf" />
                    </span>
                    <span>Free delivery · MH 4-5 days · Others 8-9 days</span>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center">
      <dt className="text-charcoal/60">{label}</dt>
      <dd className="font-medium tabular-nums">{value}</dd>
    </div>
  );
}

function Stepper({ current }: { current: 1 | 2 | 3 }) {
  const steps = [
    { id: 1, label: "Cart", icon: "cart" },
    { id: 2, label: "Review", icon: "eye" },
    { id: 3, label: "Payment", icon: "credit-card" },
  ];
  return (
    <ol className="flex items-center bg-white rounded-2xl p-3 shadow-sm border border-cream-100">
      {steps.map((s, i) => {
        const state =
          s.id < current ? "done" : s.id === current ? "current" : "upcoming";
        return (
          <li key={s.id} className="flex items-center flex-1">
            <div className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
              state === "current" ? "bg-gradient-to-r from-gold-50 to-gold-100/50" : ""
            }`}>
              <span
                className={`w-8 h-8 rounded-full inline-flex items-center justify-center text-sm font-bold transition-all ${
                  state === "done"
                    ? "bg-leaf text-white"
                    : state === "current"
                      ? "bg-gradient-to-br from-gold-400 to-gold-500 text-white shadow-lg shadow-gold/30"
                      : "bg-cream-100 text-charcoal/40"
                }`}
              >
                {state === "done" ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : s.id}
              </span>
              <span
                className={`text-sm font-semibold hidden sm:inline transition-colors ${
                  state === "upcoming" ? "text-charcoal/40" : state === "current" ? "text-gold-700" : "text-charcoal"
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 mx-2 sm:mx-4">
                <div
                  className={`h-0.5 rounded-full transition-colors ${
                    s.id < current ? "bg-leaf" : "bg-cream-200"
                  }`}
                />
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
