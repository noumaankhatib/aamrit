import Image from "next/image";
import Link from "next/link";
import { getCartSafe } from "@/lib/shopify-cart";
import {
  formatINR,
  formatWeight,
  priceBreakdown,
  DELIVERY_INFO,
} from "@/lib/money";
import ShopNav from "@/components/shop/ShopNav";
import Icon from "@/components/shop/Icon";
import {
  updateCartQtyAction,
  removeCartItemAction,
  clearCartAction,
} from "@/app/cart/actions";

export const metadata = { title: "Cart — Aamrit" };
export const dynamic = "force-dynamic";

export default async function CartPage() {
  const cart = await getCartSafe();
  const items = cart?.items ?? [];

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
            <span className="text-charcoal font-medium">Cart</span>
          </nav>
          
          <CartHeader itemCount={items.length} />

          {items.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 mt-8">
              {/* Items */}
              <div className="space-y-4">
                {/* Free delivery banner */}
                <div className="bg-gradient-to-r from-leaf/10 to-leaf/5 border border-leaf/20 rounded-2xl p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-leaf/20 flex items-center justify-center">
                    <Icon name="truck" className="w-6 h-6 text-leaf" />
                  </div>
                  <div>
                    <p className="font-semibold text-leaf-700">Free Delivery on All Orders!</p>
                    <p className="text-sm text-leaf-600/80">
                      {DELIVERY_INFO.maharashtra.label}: {DELIVERY_INFO.maharashtra.days} days · {DELIVERY_INFO.otherStates.label}: {DELIVERY_INFO.otherStates.days} days
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-3xl shadow-e2 overflow-hidden border border-cream-100/50">
                  <div className="px-6 py-4 border-b border-cream-100 bg-cream-50/50">
                    <p className="text-sm font-semibold text-charcoal">Your Items ({items.length})</p>
                  </div>
                  <div className="divide-y divide-cream-100">
                    {items.map((item) => (
                      <article key={item.id} className="p-5 sm:p-6 flex gap-5 hover:bg-cream-50/30 transition-colors">
                        <Link
                          href={`/shop/${item.product.slug}`}
                          className="relative w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 rounded-2xl overflow-hidden bg-gradient-to-br from-cream-50 to-cream-100 shadow-sm group"
                        >
                          {item.product.imageUrl ? (
                            <Image
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              fill
                              sizes="128px"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-charcoal/20">
                              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </Link>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              {item.product.variety && (
                                <p className="text-xs font-semibold text-leaf uppercase tracking-wider mb-1">
                                  {item.product.variety}
                                </p>
                              )}
                              <Link
                                href={`/shop/${item.product.slug}`}
                                className="font-serif text-lg sm:text-xl text-charcoal hover:text-gold-600 transition-colors block leading-snug"
                              >
                                {item.product.name}
                              </Link>
                              <p className="text-sm text-charcoal/50 mt-1">
                                {formatWeight(item.product.weightGrams)} per piece
                              </p>
                            </div>
                            <div className="text-right hidden sm:block">
                              <p className="font-serif text-xl font-bold text-charcoal">
                                {formatINR(item.product.priceCents * item.quantity)}
                              </p>
                              <p className="text-xs text-charcoal/50 mt-0.5">
                                {formatINR(item.product.priceCents)} each
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 mt-4">
                            <QtyStepper
                              lineId={item.id}
                              quantity={item.quantity}
                            />
                            <form action={removeCartItemAction}>
                              <input type="hidden" name="lineId" value={item.id} />
                              <button
                                type="submit"
                                aria-label="Remove from cart"
                                className="inline-flex items-center gap-1.5 text-sm text-charcoal/50 hover:text-red-500 transition-colors cursor-pointer group"
                              >
                                <Icon name="trash" className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                Remove
                              </button>
                            </form>
                          </div>
                          
                          {/* Mobile price */}
                          <p className="sm:hidden font-semibold text-charcoal mt-3">
                            {formatINR(item.product.priceCents * item.quantity)}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm pt-2">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-700 font-medium transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Continue shopping
                  </Link>
                  <form action={clearCartAction}>
                    <button
                      type="submit"
                      className="text-charcoal/50 hover:text-red-500 cursor-pointer transition-colors"
                    >
                      Clear cart
                    </button>
                  </form>
                </div>
              </div>

              {/* Sticky summary */}
              <aside className="lg:sticky lg:top-28 self-start space-y-4">
                <div className="bg-white rounded-3xl shadow-e2 overflow-hidden border border-cream-100/50">
                  <div className="p-6 bg-gradient-to-br from-cream-50 to-white border-b border-cream-100">
                    <h2 className="font-serif text-2xl text-charcoal">Order Summary</h2>
                  </div>
                  
                  <div className="p-6">
                    <dl className="space-y-3 text-sm text-charcoal">
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
                      <div className="border-t border-cream-100 pt-4 mt-4 flex justify-between font-bold text-lg">
                        <dt>Total</dt>
                        <dd className="font-serif text-2xl">{formatINR(totals.totalCents)}</dd>
                      </div>
                    </dl>

                    <Link
                      href="/checkout"
                      className="mt-6 flex items-center justify-center gap-2 w-full bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-white py-4 rounded-xl font-semibold shadow-lg shadow-gold/25 hover:shadow-gold/35 transition-all cursor-pointer"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                      Proceed to Checkout
                    </Link>

                    <ul className="mt-6 space-y-3 text-xs text-charcoal/60">
                      <TrustItem icon="lock" label="Secure checkout · 256-bit SSL encryption" />
                      <TrustItem icon="shield" label="100% authentic · GI certified Alphonso" />
                      <TrustItem icon="truck" label="Free delivery · MH 4-5 days · Others 8-9 days" />
                    </ul>
                  </div>
                </div>

                {/* Help card */}
                <div className="bg-gradient-to-br from-cream-50 to-cream-100/50 rounded-2xl p-5 text-center border border-cream-200/50">
                  <p className="text-sm text-charcoal/70 mb-2">Need help with your order?</p>
                  <a 
                    href="mailto:hello@aamrit.in" 
                    className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-700 font-semibold text-sm transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    hello@aamrit.in
                  </a>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function CartHeader({ itemCount }: { itemCount: number }) {
  return (
    <header className="mb-2">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-100 to-gold-200 flex items-center justify-center">
          <Icon name="cart" className="w-5 h-5 text-gold-600" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-gold-600 font-semibold">Your Cart</p>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal leading-tight">
            {itemCount === 0
              ? "Empty for now"
              : `${itemCount} ${itemCount === 1 ? "item" : "items"}`}
          </h1>
        </div>
      </div>
    </header>
  );
}

function EmptyCart() {
  return (
    <div className="bg-white rounded-3xl shadow-e2 p-12 sm:p-20 text-center mt-8 border border-cream-100/50">
      <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-gold-100 to-gold-200 flex items-center justify-center mb-6 shadow-lg shadow-gold/20">
        <Icon name="cart" className="w-12 h-12 text-gold-600" />
      </div>
      <h2 className="font-serif text-3xl text-charcoal mb-3">Your cart is empty</h2>
      <p className="text-charcoal/60 mb-8 max-w-md mx-auto leading-relaxed">
        Browse our handpicked Alphonso, Kesar, and other premium varieties — naturally ripened and sealed at peak freshness.
      </p>
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-gold/25 hover:shadow-gold/35 transition-all cursor-pointer"
      >
        Explore the Shop
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Link>
    </div>
  );
}

function QtyStepper({ lineId, quantity }: { lineId: string; quantity: number }) {
  return (
    <form action={updateCartQtyAction} className="inline-flex items-center bg-cream-50 rounded-xl overflow-hidden border border-cream-200">
      <input type="hidden" name="lineId" value={lineId} />
      <button
        type="submit"
        name="quantity"
        value={quantity - 1}
        aria-label="Decrease quantity"
        className="w-10 h-10 flex items-center justify-center hover:bg-cream-100 transition-colors cursor-pointer text-charcoal/70 hover:text-charcoal"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>
      <span className="w-12 h-10 flex items-center justify-center text-sm font-bold tabular-nums border-x border-cream-200 bg-white">
        {quantity}
      </span>
      <button
        type="submit"
        name="quantity"
        value={quantity + 1}
        aria-label="Increase quantity"
        className="w-10 h-10 flex items-center justify-center hover:bg-cream-100 transition-colors cursor-pointer text-charcoal/70 hover:text-charcoal"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </form>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center">
      <dt className="text-charcoal/60">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}

function TrustItem({
  icon,
  label,
}: {
  icon: Parameters<typeof Icon>[0]["name"];
  label: string;
}) {
  return (
    <li className="flex items-center gap-2.5">
      <span className="w-6 h-6 rounded-full bg-leaf/10 flex items-center justify-center flex-shrink-0">
        <Icon name={icon} className="w-3.5 h-3.5 text-leaf" />
      </span>
      <span>{label}</span>
    </li>
  );
}
