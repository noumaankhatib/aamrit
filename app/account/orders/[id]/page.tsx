import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAuthenticated, getOrderById } from "@/app/account/actions";
import { formatINR } from "@/lib/money";

export const dynamic = "force-dynamic";

function toCents(amount: string): number {
  const n = parseFloat(amount);
  if (Number.isNaN(n)) return 0;
  return Math.round(n * 100);
}

function formatDate(iso: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const FINANCIAL_STYLES: Record<string, string> = {
  PAID: "bg-leaf/10 text-leaf-700",
  PENDING: "bg-gold/10 text-saffron",
  AUTHORIZED: "bg-gold/10 text-saffron",
  PARTIALLY_PAID: "bg-gold/10 text-saffron",
  REFUNDED: "bg-charcoal/10 text-charcoal/70",
  PARTIALLY_REFUNDED: "bg-charcoal/10 text-charcoal/70",
  VOIDED: "bg-red-50 text-red-600",
};

const FULFILLMENT_STYLES: Record<string, string> = {
  FULFILLED: "bg-leaf/10 text-leaf-700",
  IN_PROGRESS: "bg-gold/10 text-saffron",
  PARTIALLY_FULFILLED: "bg-gold/10 text-saffron",
  UNFULFILLED: "bg-charcoal/10 text-charcoal/70",
  ON_HOLD: "bg-charcoal/10 text-charcoal/70",
  CANCELLED: "bg-red-50 text-red-600",
};

function StatusPill({ value, map }: { value: string; map: Record<string, string> }) {
  const cls = map[value] ?? "bg-charcoal/10 text-charcoal/70";
  const label = value.toLowerCase().replace(/_/g, " ");
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${cls}`}>
      {label}
    </span>
  );
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const authed = await isAuthenticated();
  if (!authed) redirect("/account/login");

  const { id } = await params;
  const orderId = decodeURIComponent(id);
  const order = await getOrderById(orderId);
  if (!order) notFound();

  const subtotal = order.subtotalPrice ? toCents(order.subtotalPrice.amount) : null;
  const shipping = order.totalShipping ? toCents(order.totalShipping.amount) : null;
  const tax = order.totalTax ? toCents(order.totalTax.amount) : null;
  const total = toCents(order.totalPrice.amount);

  const addr = order.shippingAddress;
  const shipName = addr ? [addr.firstName, addr.lastName].filter(Boolean).join(" ") : "";
  const shipLines = addr
    ? [
        addr.address1,
        addr.address2,
        [addr.city, addr.province, addr.zip].filter(Boolean).join(", "),
        addr.country,
      ].filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white pb-16">
      {/* Breadcrumb / header */}
      <div className="bg-charcoal text-white py-10 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/account?tab=orders"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to orders
          </Link>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-white/60 text-sm">Order</p>
              <h1 className="font-serif text-3xl sm:text-4xl">#{order.orderNumber}</h1>
              <p className="text-white/60 text-sm mt-1">Placed on {formatDate(order.processedAt)}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusPill value={order.financialStatus} map={FINANCIAL_STYLES} />
              <StatusPill value={order.fulfillmentStatus} map={FULFILLMENT_STYLES} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Line items */}
            <section className="bg-white rounded-2xl border border-cream-100 overflow-hidden">
              <header className="px-6 py-4 border-b border-cream-100">
                <h2 className="font-serif text-lg text-charcoal">
                  Items ({order.lineItems.length})
                </h2>
              </header>
              <ul className="divide-y divide-cream-100">
                {order.lineItems.map((item, i) => {
                  const lineTotal = item.price ? toCents(item.price.amount) * item.quantity : null;
                  const unit = item.price ? toCents(item.price.amount) : null;
                  return (
                    <li key={i} className="px-6 py-4 flex items-center gap-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-cream-100 overflow-hidden flex-shrink-0">
                        {item.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.image.url}
                            alt={item.image.altText || item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-charcoal/30">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-charcoal truncate">{item.title}</p>
                        <p className="text-sm text-charcoal/60">
                          Qty {item.quantity}
                          {unit !== null && (
                            <>
                              <span className="mx-2">·</span>
                              {formatINR(unit)} each
                            </>
                          )}
                        </p>
                      </div>
                      {lineTotal !== null && (
                        <div className="text-right font-semibold text-charcoal whitespace-nowrap">
                          {formatINR(lineTotal)}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* Tracking */}
            {order.fulfillments.length > 0 && (
              <section className="bg-white rounded-2xl border border-cream-100">
                <header className="px-6 py-4 border-b border-cream-100">
                  <h2 className="font-serif text-lg text-charcoal">Tracking</h2>
                </header>
                <div className="p-6 space-y-3">
                  {order.fulfillments.map((f, i) => (
                    <div
                      key={i}
                      className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-cream-50 border border-cream-100"
                    >
                      <div>
                        <p className="text-sm font-medium text-charcoal capitalize">
                          {f.status.toLowerCase().replace(/_/g, " ")}
                        </p>
                        {(f.trackingCompany || f.trackingNumber) && (
                          <p className="text-sm text-charcoal/60 mt-0.5">
                            {[f.trackingCompany, f.trackingNumber].filter(Boolean).join(" · ")}
                          </p>
                        )}
                      </div>
                      {f.trackingUrl && (
                        <a
                          href={f.trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-saffron hover:text-saffron-700 inline-flex items-center gap-1"
                        >
                          Track shipment
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 3h7v7m0-7L10 14m-4-4h4m-4 0v4M4 4h6m-6 0v6" />
                          </svg>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Summary */}
            <section className="bg-white rounded-2xl border border-cream-100 p-6">
              <h2 className="font-serif text-lg text-charcoal mb-4">Summary</h2>
              <dl className="space-y-2 text-sm">
                {subtotal !== null && (
                  <div className="flex justify-between">
                    <dt className="text-charcoal/60">Subtotal</dt>
                    <dd className="text-charcoal">{formatINR(subtotal)}</dd>
                  </div>
                )}
                {shipping !== null && (
                  <div className="flex justify-between">
                    <dt className="text-charcoal/60">Shipping</dt>
                    <dd className="text-charcoal">
                      {shipping === 0 ? "Free" : formatINR(shipping)}
                    </dd>
                  </div>
                )}
                {tax !== null && tax > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-charcoal/60">Tax</dt>
                    <dd className="text-charcoal">{formatINR(tax)}</dd>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t border-cream-100 font-semibold">
                  <dt className="text-charcoal">Total</dt>
                  <dd className="text-charcoal">{formatINR(total)}</dd>
                </div>
              </dl>

              {order.statusPageUrl && (
                <a
                  href={order.statusPageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-cream-200 hover:border-charcoal/40 text-charcoal text-sm font-medium transition-colors"
                >
                  View order status page
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 3h7v7m0-7L10 14m-4-4h4m-4 0v4M4 4h6m-6 0v6" />
                  </svg>
                </a>
              )}
            </section>

            {/* Shipping address */}
            {addr && (
              <section className="bg-white rounded-2xl border border-cream-100 p-6">
                <h2 className="font-serif text-lg text-charcoal mb-4">Shipping address</h2>
                <div className="text-sm text-charcoal/80 space-y-0.5">
                  {shipName && <p className="font-medium text-charcoal">{shipName}</p>}
                  {shipLines.map((l, i) => (
                    <p key={i}>{l}</p>
                  ))}
                  {addr.phone && <p className="pt-2 text-charcoal/60">{addr.phone}</p>}
                </div>
              </section>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
