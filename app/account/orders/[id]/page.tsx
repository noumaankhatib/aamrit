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
        {/* Order Status Banner */}
        <OrderStatusBanner 
          financialStatus={order.financialStatus}
          fulfillmentStatus={order.fulfillmentStatus}
          fulfillments={order.fulfillments}
          statusPageUrl={order.statusPageUrl}
        />

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

            {/* Order Status Timeline */}
            <section className="bg-white rounded-2xl border border-cream-100">
              <header className="px-6 py-4 border-b border-cream-100">
                <h2 className="font-serif text-lg text-charcoal">Order Status</h2>
              </header>
              <div className="p-6">
                <OrderStatusTimeline 
                  financialStatus={order.financialStatus}
                  fulfillmentStatus={order.fulfillmentStatus}
                  fulfillments={order.fulfillments}
                  processedAt={order.processedAt}
                />
              </div>
            </section>

            {/* Tracking Details */}
            {order.fulfillments.length > 0 && order.fulfillments.some(f => f.trackingNumber || f.trackingCompany) && (
              <section className="bg-white rounded-2xl border border-cream-100">
                <header className="px-6 py-4 border-b border-cream-100">
                  <h2 className="font-serif text-lg text-charcoal">Shipment Tracking</h2>
                </header>
                <div className="p-6 space-y-4">
                  {order.fulfillments.map((f, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-gradient-to-br from-cream-50 to-white border border-cream-100"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-saffron/10 flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-saffron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                              f.status === "FULFILLED" || f.status === "SUCCESS" 
                                ? "bg-leaf/10 text-leaf-700" 
                                : f.status === "IN_TRANSIT"
                                ? "bg-saffron/10 text-saffron"
                                : "bg-charcoal/10 text-charcoal/70"
                            }`}>
                              {f.status === "FULFILLED" ? "Shipped" : f.status.toLowerCase().replace(/_/g, " ")}
                            </span>
                          </div>
                          {f.trackingCompany && (
                            <p className="text-sm font-medium text-charcoal">{f.trackingCompany}</p>
                          )}
                          {f.trackingNumber && (
                            <p className="text-sm text-charcoal/70 font-mono mt-0.5">
                              AWB: {f.trackingNumber}
                            </p>
                          )}
                        </div>
                        {f.trackingUrl && (
                          <a
                            href={f.trackingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 px-4 py-2 bg-saffron text-white text-sm font-medium rounded-xl hover:bg-saffron-600 transition-colors inline-flex items-center gap-1.5"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Track
                          </a>
                        )}
                      </div>
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

function OrderStatusTimeline({
  financialStatus,
  fulfillmentStatus,
  fulfillments,
  processedAt,
}: {
  financialStatus: string;
  fulfillmentStatus: string;
  fulfillments: { status: string; trackingCompany: string | null; trackingNumber: string | null; trackingUrl: string | null }[];
  processedAt: string;
}) {
  const isPaid = financialStatus === "PAID" || financialStatus === "AUTHORIZED";
  const isShipped = fulfillmentStatus === "FULFILLED" || fulfillmentStatus === "PARTIALLY_FULFILLED" || fulfillmentStatus === "IN_PROGRESS";
  const hasTracking = fulfillments.some(f => f.trackingNumber);
  const isDelivered = fulfillments.some(f => f.status === "DELIVERED" || f.status === "SUCCESS");

  const steps = [
    {
      id: "confirmed",
      label: "Order Confirmed",
      description: processedAt ? `Placed on ${formatDate(processedAt)}` : "Order placed",
      completed: true,
      active: !isPaid,
    },
    {
      id: "paid",
      label: "Payment Received",
      description: isPaid ? "Payment successful" : "Awaiting payment",
      completed: isPaid,
      active: isPaid && !isShipped,
    },
    {
      id: "shipped",
      label: "Shipped",
      description: isShipped 
        ? hasTracking 
          ? "Your order is on its way" 
          : "Order dispatched"
        : "Preparing your order",
      completed: isShipped,
      active: isShipped && !isDelivered,
    },
    {
      id: "delivered",
      label: "Delivered",
      description: isDelivered ? "Order delivered" : "Estimated delivery in 3-5 days",
      completed: isDelivered,
      active: false,
    },
  ];

  return (
    <div className="relative">
      <div className="space-y-0">
        {steps.map((step, index) => (
          <div key={step.id} className="relative flex gap-4">
            {/* Line connecting steps */}
            {index < steps.length - 1 && (
              <div 
                className={`absolute left-[15px] top-8 w-0.5 h-[calc(100%-8px)] ${
                  step.completed ? "bg-leaf" : "bg-cream-200"
                }`}
              />
            )}
            
            {/* Step indicator */}
            <div className="relative z-10 flex-shrink-0">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.completed 
                    ? "bg-leaf text-white" 
                    : step.active 
                    ? "bg-saffron text-white animate-pulse" 
                    : "bg-cream-100 text-charcoal/30"
                }`}
              >
                {step.completed ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : step.active ? (
                  <div className="w-2 h-2 rounded-full bg-white" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-charcoal/20" />
                )}
              </div>
            </div>
            
            {/* Step content */}
            <div className={`pb-6 ${index === steps.length - 1 ? "pb-0" : ""}`}>
              <p className={`text-sm font-medium ${
                step.completed || step.active ? "text-charcoal" : "text-charcoal/40"
              }`}>
                {step.label}
              </p>
              <p className={`text-xs mt-0.5 ${
                step.completed || step.active ? "text-charcoal/60" : "text-charcoal/30"
              }`}>
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrderStatusBanner({
  financialStatus,
  fulfillmentStatus,
  fulfillments,
  statusPageUrl,
}: {
  financialStatus: string;
  fulfillmentStatus: string;
  fulfillments: { status: string; trackingCompany: string | null; trackingNumber: string | null; trackingUrl: string | null }[];
  statusPageUrl: string | null;
}) {
  const hasTracking = fulfillments.some(f => f.trackingNumber);
  const trackingUrl = fulfillments.find(f => f.trackingUrl)?.trackingUrl;
  
  if (financialStatus === "REFUNDED" || financialStatus === "VOIDED") {
    return (
      <div className="mb-6 p-4 rounded-xl bg-charcoal/5 border border-charcoal/10">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-charcoal/10 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-charcoal/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-charcoal">Order Refunded</p>
            <p className="text-sm text-charcoal/60 mt-0.5">
              This order has been refunded. The amount will be credited to your original payment method within 5-7 business days.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (fulfillmentStatus === "FULFILLED" && hasTracking) {
    return (
      <div className="mb-6 p-4 rounded-xl bg-leaf/5 border border-leaf/20">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-leaf/10 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-leaf-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-medium text-charcoal">Your order is on its way!</p>
            <p className="text-sm text-charcoal/60 mt-0.5">
              We&apos;ve shipped your order. Track your package to see its current location.
            </p>
          </div>
          {trackingUrl && (
            <a
              href={trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 px-4 py-2 bg-leaf text-white text-sm font-medium rounded-xl hover:bg-leaf-600 transition-colors inline-flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Track Package
            </a>
          )}
        </div>
      </div>
    );
  }

  if (fulfillmentStatus === "UNFULFILLED" && financialStatus === "PAID") {
    return (
      <div className="mb-6 p-4 rounded-xl bg-gold/5 border border-gold/20">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-saffron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-charcoal">We&apos;re preparing your order</p>
            <p className="text-sm text-charcoal/60 mt-0.5">
              Your payment was successful! We&apos;re now packing your items with care. You&apos;ll receive tracking details once shipped.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (financialStatus === "PENDING") {
    return (
      <div className="mb-6 p-4 rounded-xl bg-gold/5 border border-gold/20">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-saffron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-medium text-charcoal">Payment Pending</p>
            <p className="text-sm text-charcoal/60 mt-0.5">
              We&apos;re waiting for your payment to be confirmed. If you&apos;ve already paid, it may take a few minutes to process.
            </p>
          </div>
          {statusPageUrl && (
            <a
              href={statusPageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 px-4 py-2 bg-saffron text-white text-sm font-medium rounded-xl hover:bg-saffron-600 transition-colors"
            >
              Complete Payment
            </a>
          )}
        </div>
      </div>
    );
  }

  return null;
}
